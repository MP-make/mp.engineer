'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ExternalLink, Github, Edit2, Save, X, Plus, Trash2, Upload, Globe, FolderOpen, Sun, Moon, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { theme, toggleTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { data: session } = useSession();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTechnologies, setEditTechnologies] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editGithubLink, setEditGithubLink] = useState('');
  const [editSections, setEditSections] = useState<any[]>([]);

  // New states for UI enhancements
  const [activeRoleTab, setActiveRoleTab] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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

  // Custom Header for Project Page
  const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const themeRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
          setIsThemeOpen(false);
        }
        if (langRef.current && !langRef.current.contains(event.target as Node)) {
          setIsLangOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <nav className={`fixed top-0 w-full ${theme === 'dark' ? 'bg-accent' : 'bg-white'} border-b ${theme === 'dark' ? 'border-primary/20' : 'border-gray-200'} z-50 shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-sm">&lt;/&gt;</span>
                </div>
                <div className="hidden sm:block">
                  <span className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-900'} font-bold text-lg group-hover:text-primary transition-colors`}>
                    Marlon Pecho
                  </span>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} -mt-0.5`}>
                    Full-Stack Developer
                  </p>
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#landing" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>Landing</a>
              <a href="#paneles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>Paneles</a>
              <a href="#roles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>Roles</a>
              <a href="#auth" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>Autenticación</a>
              
              {/* Language Selector */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all duration-300`}
                >
                  <Globe size={18} />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                  <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLangOpen && (
                  <div className={`absolute right-0 mt-2 w-32 rounded-xl ${theme === 'dark' ? 'bg-[#1e2432] border-primary/30' : 'bg-white border-gray-200'} border shadow-xl overflow-hidden`}>
                    <button
                      onClick={() => { setLanguage('es'); setIsLangOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm ${language === 'es' ? 'bg-primary/20 text-primary' : theme === 'dark' ? 'text-white hover:bg-primary/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
                    >
                      🇪🇸 Español
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm ${language === 'en' ? 'bg-primary/20 text-primary' : theme === 'dark' ? 'text-white hover:bg-primary/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
                    >
                      🇺🇸 English
                    </button>
                  </div>
                )}
              </div>

              {/* Theme Selector */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false); }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all duration-300`}
                >
                  {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                  <ChevronDown size={14} className={`transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
                </button>
                {isThemeOpen && (
                  <div className={`absolute right-0 mt-2 w-32 rounded-xl ${theme === 'dark' ? 'bg-[#1e2432] border-primary/30' : 'bg-white border-gray-200'} border shadow-xl overflow-hidden`}>
                    <button
                      onClick={() => { setTheme('light'); setIsThemeOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm ${theme === 'light' ? 'bg-primary/20 text-primary' : theme === 'dark' ? 'text-white hover:bg-primary/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
                    >
                      <Sun size={16} /> {t.theme.light}
                    </button>
                    <button
                      onClick={() => { setTheme('dark'); setIsThemeOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
                    >
                      <Moon size={16} /> {t.theme.dark}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Language */}
              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all`}
              >
                <Globe size={20} />
              </button>
              {/* Mobile Theme */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${theme === 'dark' ? 'bg-accent' : 'bg-white'} rounded-lg mt-2 border ${theme === 'dark' ? 'border-primary/20' : 'border-gray-200'}`}>
                <a href="#landing" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>Landing</a>
                <a href="#paneles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>Paneles</a>
                <a href="#roles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>Roles</a>
                <a href="#auth" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>Autenticación</a>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
        <Header />
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
        <Header />
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
        <Header />
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
      <Header />

      {/* Noise Texture */}
      <div className="fixed inset-0 opacity-5 mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }}></div>

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

      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center pt-64 pb-48">
        <img src={project.images?.[0]?.image} alt={project.title} className="absolute inset-0 object-cover opacity-40 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-primary mb-8 font-medium">
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
                  className="w-full px-4 py-3 mb-4 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300 text-center text-6xl font-bold tracking-tight"
                  placeholder="Título del proyecto"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 mb-6 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300 text-center text-xl leading-relaxed"
                  rows={3}
                  placeholder="Descripción del proyecto"
                />
                <input
                  type="text"
                  value={editTechnologies}
                  onChange={(e) => setEditTechnologies(e.target.value)}
                  className="w-full px-4 py-3 mb-8 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300 text-center"
                  placeholder="Tecnologías separadas por coma"
                />
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {editTechnologies.split(',').map((tech, i) => (
                    <span key={i} className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 justify-center mb-8">
                  <input
                    type="url"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    className="px-4 py-2 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300"
                    placeholder="Enlace del proyecto"
                  />
                  <input
                    type="url"
                    value={editGithubLink}
                    onChange={(e) => setEditGithubLink(e.target.value)}
                    className="px-4 py-2 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300"
                    placeholder="Enlace de GitHub"
                  />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">
                  {project.title}
                </h1>
                <p className="text-xl mb-6 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
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
                    Ver Demo
                  </a>
                )}
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 text-white border border-white/30 px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <Github size={20} />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div>
        {sections.map((section: any, index: number) => {
          switch (section.type) {
            case 'landing':
              return (
                <section key={index} id="landing" className="bg-[#0f172a] py-20">
                  <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold tracking-tight mb-12 text-primary text-center">Landing</h2>
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-5 prose prose-invert prose-lg">
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Escribe aquí la introducción o descripción principal del proyecto..."
                          />
                        ) : (
                          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {section.text}
                          </p>
                        )}
                      </div>
                      <div className="lg:col-span-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
                          {(section.images || []).map((image: string, imgIndex: number) => {
                            if (imgIndex === 0) {
                              return (
                                <div key={imgIndex} className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                  <img
                                    src={image}
                                    alt={`Landing ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeImageFromSection(index, imgIndex); }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div key={imgIndex} className="rounded-2xl bg-gray-800 group relative overflow-hidden cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                  <img
                                    src={image}
                                    alt={`Landing ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeImageFromSection(index, imgIndex); }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              );
                            }
                          })}
                          {isEditing && (
                            <div className="rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
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
                  </div>
                </section>
              );

            case 'paneles':
              return (
                <section key={index} id="paneles" className="bg-[#1e293b] py-20">
                  <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold tracking-tight mb-12 text-primary text-center">Paneles</h2>
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
                          {(section.images || []).map((image: string, imgIndex: number) => {
                            if (imgIndex === 0) {
                              return (
                                <div key={imgIndex} className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                  <img
                                    src={image}
                                    alt={`Paneles ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeImageFromSection(index, imgIndex); }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div key={imgIndex} className="rounded-2xl bg-gray-800 group relative overflow-hidden cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                  <img
                                    src={image}
                                    alt={`Paneles ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeImageFromSection(index, imgIndex); }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              );
                            }
                          })}
                          {isEditing && (
                            <div className="rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
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
                      <div className="lg:col-span-5 prose prose-invert prose-lg">
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Describe la galería o paneles del proyecto..."
                          />
                        ) : (
                          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {section.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'roles':
              return (
                <section key={index} id="roles" className="bg-[#0f172a] py-20">
                  <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold tracking-tight mb-12 text-primary text-center">Roles</h2>
                    <div className="flex space-x-2 bg-white/5 p-1 rounded-xl backdrop-blur-sm w-fit mx-auto mb-8">
                      {(section.roles || []).map((role, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveRoleTab(i)}
                          className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            activeRoleTab === i
                              ? 'bg-primary text-white shadow-lg'
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                    {section.roles && section.roles[activeRoleTab] && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid lg:grid-cols-12 gap-12 items-center">
                          <div className="lg:col-span-5 prose prose-invert prose-lg">
                            <h3 className="text-2xl font-bold tracking-tight mb-4 text-white">{section.roles[activeRoleTab].name}</h3>
                            {isEditing ? (
                              <textarea
                                value={section.roles[activeRoleTab].description || ''}
                                onChange={(e) => updateRole(activeRoleTab, { description: e.target.value })}
                                className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                                rows={6}
                                placeholder="Descripción del rol"
                              />
                            ) : (
                              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                {section.roles[activeRoleTab].description}
                              </p>
                            )}
                          </div>
                          <div className="lg:col-span-7">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
                              {(section.roles[activeRoleTab].images || []).map((image: string, imgIndex: number) => {
                                if (imgIndex === 0) {
                                  return (
                                    <div key={imgIndex} className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                      <img
                                        src={image}
                                        alt={`${section.roles[activeRoleTab].name} ${imgIndex + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                      />
                                      {isEditing && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); const rolesSection = editSections.find(s => s.type === 'roles'); if (rolesSection) { const sectionIndex = editSections.indexOf(rolesSection); const roles = rolesSection.roles || []; const updatedRoles = roles.map((r: any, i: number) => i === activeRoleTab ? { ...r, images: r.images.filter((_: string, j: number) => j !== imgIndex) } : r); updateSection(sectionIndex, { roles: updatedRoles }); } }}
                                          className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      )}
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div key={imgIndex} className="rounded-2xl bg-gray-800 group relative overflow-hidden cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                      <img
                                        src={image}
                                        alt={`${section.roles[activeRoleTab].name} ${imgIndex + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                      />
                                      {isEditing && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); const rolesSection = editSections.find(s => s.type === 'roles'); if (rolesSection) { const sectionIndex = editSections.indexOf(rolesSection); const roles = rolesSection.roles || []; const updatedRoles = roles.map((r: any, i: number) => i === activeRoleTab ? { ...r, images: r.images.filter((_: string, j: number) => j !== imgIndex) } : r); updateSection(sectionIndex, { roles: updatedRoles }); } }}
                                          className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      )}
                                    </div>
                                  );
                                }
                              })}
                              {isEditing && (
                                <div className="rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) => { const files = Array.from(e.target.files!); updateRole(activeRoleTab, { images: [...(section.roles[activeRoleTab].images || []), ...files.map(f => URL.createObjectURL(f))] }); }}
                                    className="hidden"
                                    id={`role-upload-${activeRoleTab}`}
                                  />
                                  <label htmlFor={`role-upload-${activeRoleTab}`} className="cursor-pointer text-center">
                                    <Plus size={32} className="text-primary mx-auto mb-2" />
                                    <span className="text-sm text-primary">Agregar Imágenes</span>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {isEditing && (
                      <div className="text-center mt-8">
                        <button
                          onClick={addRole}
                          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                        >
                          <Plus size={16} />
                          Agregar Rol
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              );

            case 'auth':
              return (
                <section key={index} id="auth" className="bg-[#1e293b] py-20">
                  <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold tracking-tight mb-12 text-primary text-center">Autenticación</h2>
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
                          {(section.images || []).map((image: string, imgIndex: number) => {
                            if (imgIndex === 0) {
                              return (
                                <div key={imgIndex} className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                  <img
                                    src={image}
                                    alt={`Auth ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeImageFromSection(index, imgIndex); }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div key={imgIndex} className="rounded-2xl bg-gray-800 group relative overflow-hidden cursor-zoom-in" onClick={() => setLightboxImage(image)}>
                                  <img
                                    src={image}
                                    alt={`Auth ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); removeImageFromSection(index, imgIndex); }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              );
                            }
                          })}
                          {isEditing && (
                            <div className="rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center">
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
                      <div className="lg:col-span-5 prose prose-invert prose-lg">
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Describe las características de autenticación y seguridad..."
                          />
                        ) : (
                          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                            {section.text}
                          </p>
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

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}