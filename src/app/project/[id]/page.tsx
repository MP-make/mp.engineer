'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ExternalLink, Github, Code, Database, Smartphone, Users, Shield, Edit2, Save, X, Plus, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  github_link?: string;
  technologies: string[];
  status: 'completed' | 'in-progress';
  created_at: string;
  images?: { image: string }[];
  is_full_page?: boolean;
  content_structure?: any;
}

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { data: session } = useSession();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTechnologies, setEditTechnologies] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editGithubLink, setEditGithubLink] = useState('');
  const [editSections, setEditSections] = useState<any[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase
        .from('portfolio_project')
        .select(`*, images:portfolio_projectimage(image)`)
        .eq('id', id)
        .single();

      setProject(data);
      setLoading(false);
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (project) {
      setEditTitle(project.title);
      setEditDescription(project.description);
      setEditTechnologies(project.technologies.join(', '));
      setEditLink(project.link || '');
      setEditGithubLink(project.github_link || '');
      setEditSections(project.content_structure?.sections || []);
    }
  }, [project]);

  const handleSave = async () => {
    if (!project) return;

    try {
      // Upload any new images for sections
      const updatedSections = await Promise.all(editSections.map(async (section) => {
        if (section.newImages && section.newImages.length > 0) {
          const uploadedUrls = [];
          for (const file of section.newImages) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { error } = await supabase.storage
              .from('portfolio-images')
              .upload(fileName, file);
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage
              .from('portfolio-images')
              .getPublicUrl(fileName);
            uploadedUrls.push(publicUrl);
          }
          return {
            ...section,
            images: [...(section.images || []), ...uploadedUrls],
            newImages: undefined
          };
        }
        return section;
      }));

      const contentStructure = { sections: updatedSections };

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          title: editTitle,
          description: editDescription,
          link: editLink || null,
          github_link: editGithubLink || null,
          technologies: editTechnologies.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0),
          status: project.status,
          is_full_page: project.is_full_page,
          content_structure: contentStructure
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      // Update local state
      setProject({
        ...project,
        title: editTitle,
        description: editDescription,
        link: editLink,
        github_link: editGithubLink,
        technologies: editTechnologies.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0),
        content_structure: contentStructure
      });

      setIsEditing(false);
      alert('✅ Proyecto actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('❌ Error al actualizar el proyecto.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    if (project) {
      setEditTitle(project.title);
      setEditDescription(project.description);
      setEditTechnologies(project.technologies.join(', '));
      setEditLink(project.link || '');
      setEditGithubLink(project.github_link || '');
      setEditSections(project.content_structure?.sections || []);
    }
  };

  const updateSection = (index: number, updates: any) => {
    setEditSections(sections => sections.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  const addImageToSection = (sectionIndex: number, files: FileList) => {
    const newImages = Array.from(files);
    updateSection(sectionIndex, { newImages: [...(editSections[sectionIndex].newImages || []), ...newImages] });
  };

  const removeImageFromSection = (sectionIndex: number, imageIndex: number) => {
    const section = editSections[sectionIndex];
    const images = section.images || [];
    updateSection(sectionIndex, { images: images.filter((_: string, i: number) => i !== imageIndex) });
  };

  const addRole = () => {
    const rolesSection = editSections.find(s => s.type === 'roles');
    if (rolesSection) {
      const index = editSections.indexOf(rolesSection);
      updateSection(index, { roles: [...(rolesSection.roles || []), { name: '', description: '', images: [] }] });
    }
  };

  const updateRole = (roleIndex: number, updates: any) => {
    const rolesSection = editSections.find(s => s.type === 'roles');
    if (rolesSection) {
      const sectionIndex = editSections.indexOf(rolesSection);
      const roles = rolesSection.roles || [];
      updateSection(sectionIndex, { roles: roles.map((r: any, i: number) => i === roleIndex ? { ...r, ...updates } : r) });
    }
  };

  const removeRole = (roleIndex: number) => {
    const rolesSection = editSections.find(s => s.type === 'roles');
    if (rolesSection) {
      const sectionIndex = editSections.indexOf(rolesSection);
      const roles = rolesSection.roles || [];
      updateSection(sectionIndex, { roles: roles.filter((_: any, i: number) => i !== roleIndex) });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
            <p className="text-xl font-semibold">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Proyecto no encontrado</h1>
            <Link href="/" className="text-primary hover:text-secondary font-medium">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project.is_full_page || !project.content_structure?.sections) {
    // Render coming soon message
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Página Próximamente</h1>
            <p className="text-lg mb-6">Esta página completa está en desarrollo. ¡Vuelve pronto!</p>
            <Link href="/" className="text-primary hover:text-secondary font-medium">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render full-page project with sections
  const sections = isEditing ? editSections : project.content_structure.sections;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      {/* Edit Controls */}
      {session && (
        <div className="fixed top-20 right-4 z-50">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              <Edit2 size={16} />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save size={16} />
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className={`border-b ${theme === 'dark' ? 'border-primary/20 bg-[#0f1419]' : 'border-gray-200 bg-white'} py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 font-medium">
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>

          <div className="text-center">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full px-4 py-3 mb-4 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-center text-5xl font-bold`}
                  placeholder="Título del proyecto"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={`w-full px-4 py-3 mb-6 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-center text-xl`}
                  rows={3}
                  placeholder="Descripción del proyecto"
                />
                <input
                  type="text"
                  value={editTechnologies}
                  onChange={(e) => setEditTechnologies(e.target.value)}
                  className={`w-full px-4 py-3 mb-8 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-center`}
                  placeholder="Tecnologías separadas por coma"
                />
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {editTechnologies.split(',').map((tech, i) => (
                    <span key={i} className="bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-medium">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 justify-center mb-8">
                  <input
                    type="url"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className={`px-4 py-2 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300`}
                    placeholder="Enlace del proyecto"
                  />
                  <input
                    type="url"
                    value={editGithubLink}
                    onChange={(e) => setEditGithubLink(e.target.value)}
                    className={`px-4 py-2 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300`}
                    placeholder="Enlace de GitHub"
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {project.title}
                </h1>
                <p className={`text-xl mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </>
            )}
            {(project.link || project.github_link) && !isEditing && (
              <div className="flex gap-4 justify-center">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <ExternalLink size={20} />
                    Ver Proyecto
                  </a>
                )}
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-8 py-4 rounded-xl hover:bg-primary/20 transition-all"
                  >
                    <Github size={20} />
                    Ver Código
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="py-16">
        {sections.map((section: any, index: number) => {
          switch (section.type) {
            case 'landing':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Sección de Introducción
                        </h2>
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Escribe aquí la introducción o descripción principal del proyecto..."
                          />
                        ) : (
                          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {section.text}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {(section.images || []).map((image: string, imgIndex: number) => (
                          <div key={imgIndex} className="aspect-square rounded-xl overflow-hidden relative group">
                            <img
                              src={image}
                              alt={`Introducción ${imgIndex + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {isEditing && (
                              <button
                                onClick={() => removeImageFromSection(index, imgIndex)}
                                className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <div className="aspect-square rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                            <input
                              type="file"
                              multiple
                              onChange={(e) => addImageToSection(index, e.target.files!)}
                              className="hidden"
                              id={`landing-upload-${index}`}
                            />
                            <label htmlFor={`landing-upload-${index}`} className="cursor-pointer text-center">
                              <Plus size={32} className="text-primary mx-auto mb-2" />
                              <span className="text-sm text-primary">Agregar Imágenes</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'paneles':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Sección de Galería
                      </h2>
                      {isEditing ? (
                        <textarea
                          value={section.text || ''}
                          onChange={(e) => updateSection(index, { text: e.target.value })}
                          className={`w-full px-4 py-3 max-w-3xl mx-auto ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-xl`}
                          rows={4}
                          placeholder="Describe la galería o paneles del proyecto..."
                        />
                      ) : (
                        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                          {section.text}
                        </p>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                      {(section.images || []).map((image: string, imgIndex: number) => (
                        <div key={imgIndex} className="aspect-video rounded-xl overflow-hidden shadow-lg relative group">
                          <img
                            src={image}
                            alt={`Panel ${imgIndex + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          {isEditing && (
                            <button
                              onClick={() => removeImageFromSection(index, imgIndex)}
                              className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <div className="aspect-video rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                          <input
                            type="file"
                            multiple
                            onChange={(e) => addImageToSection(index, e.target.files!)}
                            className="hidden"
                            id={`paneles-upload-${index}`}
                          />
                          <label htmlFor={`paneles-upload-${index}`} className="cursor-pointer text-center">
                            <Plus size={32} className="text-primary mx-auto mb-2" />
                            <span className="text-sm text-primary">Agregar Imágenes</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );

            case 'roles':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Sección de Roles y Responsabilidades
                      </h2>
                      {isEditing && (
                        <button
                          onClick={addRole}
                          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors mb-8"
                        >
                          <Plus size={16} />
                          Agregar Rol
                        </button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {(section.roles || []).map((role: any, roleIndex: number) => (
                        <div key={roleIndex} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'border-primary/20 bg-[#0f1419]' : 'border-gray-200 bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 relative`}>
                          {isEditing && (
                            <button
                              onClick={() => removeRole(roleIndex)}
                              className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Users size={24} className="text-primary" />
                            </div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={role.name || ''}
                                onChange={(e) => updateRole(roleIndex, { name: e.target.value })}
                                className={`flex-1 px-2 py-1 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded focus:outline-none focus:border-primary transition-all duration-300 text-xl font-bold`}
                                placeholder="Nombre del rol"
                              />
                            ) : (
                              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {role.name}
                              </h3>
                            )}
                          </div>
                          {isEditing ? (
                            <textarea
                              value={role.description || ''}
                              onChange={(e) => updateRole(roleIndex, { description: e.target.value })}
                              className={`w-full px-2 py-1 mb-4 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded focus:outline-none focus:border-primary transition-all duration-300`}
                              rows={3}
                              placeholder="Descripción del rol"
                            />
                          ) : (
                            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {role.description}
                            </p>
                          )}
                          {role.images && role.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {role.images.map((image: string, imgIndex: number) => (
                                <div key={imgIndex} className="aspect-square rounded-lg overflow-hidden relative group">
                                  <img
                                    src={image}
                                    alt={`${role.name} ${imgIndex + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={() => {
                                        const rolesSection = editSections.find(s => s.type === 'roles');
                                        if (rolesSection) {
                                          const sectionIndex = editSections.indexOf(rolesSection);
                                          const roles = rolesSection.roles || [];
                                          const updatedRoles = roles.map((r: any, i: number) => i === roleIndex ? { ...r, images: r.images.filter((_: string, j: number) => j !== imgIndex) } : r);
                                          updateSection(sectionIndex, { roles: updatedRoles });
                                        }
                                      }}
                                      className="absolute top-1 right-1 p-1 rounded bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {isEditing && (
                            <div className="mt-4">
                              <input
                                type="file"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files!);
                                  updateRole(roleIndex, { images: [...(role.images || []), ...files.map(f => URL.createObjectURL(f))] });
                                }}
                                className="hidden"
                                id={`role-upload-${roleIndex}`}
                              />
                              <label htmlFor={`role-upload-${roleIndex}`} className="cursor-pointer flex items-center gap-2 text-primary hover:text-primary/80">
                                <Upload size={16} />
                                Agregar Imágenes
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'auth':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Sección de Autenticación y Seguridad
                        </h2>
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Describe las características de autenticación y seguridad..."
                          />
                        ) : (
                          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {section.text}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {(section.images || []).map((image: string, imgIndex: number) => (
                          <div key={imgIndex} className="aspect-square rounded-xl overflow-hidden relative group">
                            <img
                              src={image}
                              alt={`Auth ${imgIndex + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {isEditing && (
                              <button
                                onClick={() => removeImageFromSection(index, imgIndex)}
                                className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditing && (
                          <div className="aspect-square rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                            <input
                              type="file"
                              multiple
                              onChange={(e) => addImageToSection(index, e.target.files!)}
                              className="hidden"
                              id={`auth-upload-${index}`}
                            />
                            <label htmlFor={`auth-upload-${index}`} className="cursor-pointer text-center">
                              <Plus size={32} className="text-primary mx-auto mb-2" />
                              <span className="text-sm text-primary">Agregar Imágenes</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}