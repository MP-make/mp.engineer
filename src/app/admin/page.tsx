'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Save, X, Plus, FolderOpen, MessageSquare, ExternalLink, Calendar, Tag, Sun, Moon, Upload, Image as ImageIcon, Award } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function AdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'contacts' | 'skills'>('projects');
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    technologies: '',
    status: 'completed'
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Skill form states
  const [skillFormData, setSkillFormData] = useState({
    name: '',
    category: '',
    proficiency: 50
  });
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Cargar proyectos
    const { data: projectsData } = await supabase
      .from('portfolio_project')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Cargar mensajes de contacto
    const { data: contactsData } = await supabase
      .from('portfolio_contact')
      .select('*')
      .order('created_at', { ascending: false });

    // Cargar habilidades
    const { data: skillsData } = await supabase
      .from('portfolio_skill')
      .select('*')
      .order('category', { ascending: true });

    setProjects(projectsData || []);
    setContacts(contactsData || []);
    setSkills(skillsData || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const techArray = formData.technologies.trim() 
      ? formData.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];
    
    try {
      // Subir archivos a Supabase Storage
      const uploadedUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          // Validar tamaño del archivo (máximo 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB por archivo.`);
            return;
          }
          
          // Validar tipo de archivo
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
            alert(`El archivo ${file.name} no es un tipo de imagen válido. Solo se permiten: JPG, PNG, GIF, WebP.`);
            return;
          }
          
          // Generar nombre único para el archivo
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          // Subir archivo a Supabase Storage
          const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, file);
          
          if (error) {
            console.error('Error al subir archivo:', error);
            alert(`Error al subir ${file.name}: ${error.message}`);
            return;
          }
          
          // Obtener URL pública del archivo subido
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(fileName);
          
          uploadedUrls.push(publicUrl);
        }
      }
      
      // Combinar URLs de archivos subidos con URLs manuales
      const allImageUrls = [...uploadedUrls, ...imageUrls];
      
      let projectId = editingId;

      if (editingId) {
        // Actualizar proyecto existente
        const { error } = await supabase
          .from('portfolio_project')
          .update({
            title: formData.title,
            description: formData.description,
            link: formData.link || null,
            technologies: techArray,
            status: formData.status
          })
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        // Crear nuevo proyecto
        const { data, error } = await supabase
          .from('portfolio_project')
          .insert([{
            title: formData.title,
            description: formData.description,
            link: formData.link || null,
            technologies: techArray,
            status: formData.status,
            created_at: new Date().toISOString()
          }])
          .select();
        
        if (error) throw error;
        projectId = data[0].id;
      }

      // Guardar imágenes
      if (allImageUrls.length > 0 && projectId) {
        // Eliminar imágenes antiguas si estamos editando
        if (editingId) {
          await supabase
            .from('portfolio_projectimage')
            .delete()
            .eq('project_id', editingId);
        }

        // Insertar nuevas imágenes
        const imageData = allImageUrls.map(url => ({
          project_id: projectId,
          image: url
        }));

        const { error } = await supabase
          .from('portfolio_projectimage')
          .insert(imageData);
        
        if (error) throw error;
      }

      // Reset form
      setFormData({ title: '', description: '', link: '', technologies: '', status: 'completed' });
      setImageUrls([]);
      setSelectedFiles([]);
      setEditingId(null);
      loadData();
      
      alert('Proyecto guardado exitosamente!');
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      alert('Error al guardar el proyecto. Revisa la consola para más detalles.');
    }
  };

  const handleEdit = async (project: any) => {
    setFormData({
      title: project.title,
      description: project.description,
      link: project.link || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      status: project.status
    });
    setEditingId(project.id);

    // Cargar imágenes del proyecto
    const { data: images } = await supabase
      .from('portfolio_projectimage')
      .select('image')
      .eq('project_id', project.id);
    
    if (images) {
      setImageUrls(images.map(img => img.image));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      await supabase
        .from('portfolio_project')
        .delete()
        .eq('id', id);
      loadData();
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este mensaje?')) {
      await supabase
        .from('portfolio_contact')
        .delete()
        .eq('id', id);
      loadData();
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Skill handlers
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSkillId) {
        const { error } = await supabase
          .from('portfolio_skill')
          .update(skillFormData)
          .eq('id', editingSkillId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_skill')
          .insert([skillFormData]);
        
        if (error) throw error;
      }

      setSkillFormData({ name: '', category: '', proficiency: 50 });
      setEditingSkillId(null);
      loadData();
    } catch (error) {
      console.error('Error al guardar habilidad:', error);
      alert('Error al guardar la habilidad.');
    }
  };

  const handleEditSkill = (skill: any) => {
    setSkillFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency
    });
    setEditingSkillId(skill.id);
  };

  const handleDeleteSkill = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta habilidad?')) {
      await supabase
        .from('portfolio_skill')
        .delete()
        .eq('id', id);
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-white text-xl font-semibold">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] dark:from-[#0f1419] dark:via-[#1a1f2e] dark:to-[#0f1419] light:from-gray-50 light:via-gray-100 light:to-gray-50 text-white dark:text-white light:text-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e2432] to-[#252b3d] dark:from-[#1e2432] dark:to-[#252b3d] light:from-white light:to-gray-50 border-b-2 border-primary/30 shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/50">
                  <FolderOpen size={24} className="text-white" />
                </div>
                Panel de Administración
              </h1>
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1 ml-13">Gestiona tu portafolio profesional</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => router.push('/')}
                className="group bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 flex items-center gap-2"
              >
                <ExternalLink size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                Ver Sitio Web
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] dark:from-[#1e2432] dark:to-[#252b3d] light:from-white light:to-gray-50 light:border-gray-200 rounded-2xl p-6 border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm font-medium mb-1">Total de Proyectos</p>
                <p className="text-4xl font-bold text-primary">{projects.length}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FolderOpen size={32} className="text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] dark:from-[#1e2432] dark:to-[#252b3d] light:from-white light:to-gray-50 light:border-gray-200 rounded-2xl p-6 border border-secondary/30 hover:border-secondary/60 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm font-medium mb-1">Mensajes Recibidos</p>
                <p className="text-4xl font-bold text-secondary">{contacts.length}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <MessageSquare size={32} className="text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] dark:from-[#1e2432] dark:to-[#252b3d] light:from-white light:to-gray-50 light:border-gray-200 rounded-2xl p-6 border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm font-medium mb-1">Habilidades</p>
                <p className="text-4xl font-bold text-primary">{skills.length}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Award size={32} className="text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-[#1e2432] dark:bg-[#1e2432] light:bg-white light:border-gray-200 p-2 rounded-2xl border border-primary/20">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'projects' 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/30' 
                : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 hover:bg-[#252b3d] light:hover:bg-gray-100'
            }`}
          >
            <FolderOpen size={20} />
            Proyectos
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'projects' ? 'bg-white/20' : 'bg-primary/20 text-primary'
            }`}>
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'contacts' 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/30' 
                : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 hover:bg-[#252b3d] light:hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={20} />
            Mensajes
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'contacts' ? 'bg-white/20' : 'bg-secondary/20 text-secondary'
            }`}>
              {contacts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'skills' 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/30' 
                : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 hover:bg-[#252b3d] light:hover:bg-gray-100'
            }`}
          >
            <Award size={20} />
            Habilidades
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'skills' ? 'bg-white/20' : 'bg-primary/20 text-primary'
            }`}>
              {skills.length}
            </span>
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] p-8 rounded-2xl border border-primary/30 shadow-2xl sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  {editingId ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Edit2 size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Editar Proyecto</h2>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Plus size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Nuevo Proyecto</h2>
                    </>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* ...existing form fields... */}
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <Tag size={16} className="text-primary" />
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                      placeholder="Nombre del proyecto"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500 resize-none"
                      rows={4}
                      placeholder="Describe tu proyecto..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <ExternalLink size={16} className="text-primary" />
                      Link (opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                      placeholder="https://ejemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Tecnologías</label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React, Next.js, TypeScript, Tailwind"
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separa cada tecnología con coma</p>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <Upload size={16} className="text-primary" />
                      Subir Imágenes del Proyecto
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileSelect}
                          className="flex-1 px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary file:cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 bg-[#0f1419] p-2 rounded-lg border border-primary/20">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Preview ${index + 1}`} 
                              className="w-12 h-12 object-cover rounded" 
                            />
                            <span className="flex-1 text-sm text-gray-300 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(index)}
                              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Selecciona múltiples imágenes (PNG, JPG, JPEG, GIF, WebP). Máximo 5MB por archivo.</p>
                    </div>
                  </div>

                  {/* Image URLs Section */}
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <ImageIcon size={16} className="text-primary" />
                      O agrega URLs de imágenes
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="flex-1 px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={addImageUrl}
                          className="px-4 py-3 bg-primary hover:bg-secondary rounded-xl transition-colors flex items-center gap-2 font-semibold"
                        >
                          <Plus size={18} />
                          Agregar
                        </button>
                      </div>
                      <div className="space-y-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 bg-[#0f1419] p-2 rounded-lg border border-primary/20">
                            <img src={url} alt={`Preview ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                            <span className="flex-1 text-sm text-gray-300 truncate">{url}</span>
                            <button
                              type="button"
                              onClick={() => removeImageUrl(index)}
                              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">Agrega URLs de imágenes alojadas en Supabase Storage o servicios externos</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white cursor-pointer"
                    >
                      <option value="completed">✅ Completado</option>
                      <option value="in-progress">🔄 En Desarrollo</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 flex items-center justify-center gap-2"
                    >
                      {editingId ? (
                        <>
                          <Save size={20} />
                          Actualizar Proyecto
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          Crear Proyecto
                        </>
                      )}
                    </button>
                    
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ title: '', description: '', link: '', technologies: '', status: 'completed' });
                          setImageUrls([]);
                          setEditingId(null);
                        }}
                        className="px-6 py-4 bg-red-600/20 hover:bg-red-600/30 border-2 border-red-600/50 hover:border-red-600 rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Projects List */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] p-8 rounded-2xl border border-primary/30 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FolderOpen className="text-primary" />
                  Proyectos Existentes
                </h2>
                
                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {projects.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <FolderOpen size={48} className="text-primary/50" />
                      </div>
                      <p className="text-gray-400 text-lg">No hay proyectos todavía</p>
                      <p className="text-gray-500 text-sm mt-2">Crea tu primer proyecto usando el formulario</p>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div 
                        key={project.id} 
                        className="bg-gradient-to-br from-[#0f1419] to-[#1a1f2e] p-6 rounded-xl border-2 border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                            {project.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                          }`}>
                            {project.status === 'completed' ? '✅ Completado' : '🔄 En progreso'}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                        
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            className="text-primary hover:text-secondary text-sm hover:underline mb-3 flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink size={14} />
                            {project.link}
                          </a>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(project.technologies) && project.technologies.map((tech: string, idx: number) => (
                            <span 
                              key={idx} 
                              className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Project Images */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(project.images) && project.images.map((image: string, idx: number) => (
                            <img 
                              key={idx} 
                              src={image} 
                              alt={`Project Image ${idx + 1}`} 
                              className="w-24 h-24 object-cover rounded-lg border border-primary/20"
                            />
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar size={14} />
                            {new Date(project.created_at).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="bg-primary/20 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 border border-primary/30 hover:border-primary"
                            >
                              <Edit2 size={14} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 border border-red-600/30 hover:border-red-600"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Skill Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] p-8 rounded-2xl border border-primary/30 shadow-2xl sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  {editingSkillId ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Edit2 size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Editar Habilidad</h2>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Plus size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Nueva Habilidad</h2>
                    </>
                  )}
                </div>

                <form onSubmit={handleSkillSubmit} className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Nombre</label>
                    <input
                      type="text"
                      value={skillFormData.name}
                      onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                      placeholder="React, Python, Node.js..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Categoría</label>
                    <input
                      type="text"
                      value={skillFormData.category}
                      onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                      placeholder="Frontend, Backend, Database..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">
                      Nivel de Dominio: {skillFormData.proficiency}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skillFormData.proficiency}
                      onChange={(e) => setSkillFormData({ ...skillFormData, proficiency: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[#0f1419] rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Principiante</span>
                      <span>Intermedio</span>
                      <span>Experto</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 flex items-center justify-center gap-2"
                    >
                      {editingSkillId ? (
                        <>
                          <Save size={20} />
                          Actualizar Habilidad
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          Crear Habilidad
                        </>
                      )}
                    </button>

                    {editingSkillId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSkillFormData({ name: '', category: '', proficiency: 50 });
                          setEditingSkillId(null);
                        }}
                        className="px-6 py-4 bg-red-600/20 hover:bg-red-600/30 border-2 border-red-600/50 hover:border-red-600 rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Skills List */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] p-8 rounded-2xl border border-primary/30 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Award className="text-primary" />
                  Habilidades Existentes
                </h2>

                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {skills.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award size={48} className="text-primary/50" />
                      </div>
                      <p className="text-gray-400 text-lg">No hay habilidades todavía</p>
                      <p className="text-gray-500 text-sm mt-2">Agrega tu primera habilidad usando el formulario</p>
                    </div>
                  ) : (
                    Object.entries(
                      skills.reduce((acc, skill) => {
                        if (!acc[skill.category]) acc[skill.category] = [];
                        acc[skill.category].push(skill);
                        return acc;
                      }, {} as Record<string, any[]>)
                    ).map(([category, categorySkills]) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                          <Tag size={18} />
                          {category}
                        </h3>
                        <div className="space-y-3">
                          {categorySkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="bg-gradient-to-br from-[#0f1419] to-[#1a1f2e] p-4 rounded-xl border-2 border-primary/20 hover:border-primary/60 transition-all duration-300"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-bold text-white">{skill.name}</h4>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditSkill(skill)}
                                    className="bg-primary/20 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 border border-primary/30 hover:border-primary"
                                  >
                                    <Edit2 size={14} />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 border border-red-600/30 hover:border-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <div className="w-full bg-[#0a0e14] rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                                  style={{ width: `${skill.proficiency}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-400 mt-1 text-right">{skill.proficiency}% de dominio</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] p-8 rounded-2xl border border-primary/30 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageSquare className="text-secondary" />
              Mensajes de Contacto
            </h2>
            
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                    <MessageSquare size={48} className="text-secondary/50" />
                  </div>
                  <p className="text-gray-400 text-lg">No hay mensajes todavía</p>
                  <p className="text-gray-500 text-sm mt-2">Los mensajes aparecerán aquí cuando alguien te contacte</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="bg-gradient-to-br from-[#0f1419] to-[#1a1f2e] p-6 rounded-xl border-2 border-secondary/20 hover:border-secondary/60 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-secondary mb-1">{contact.name}</h3>
                        <a href={`mailto:${contact.email}`} className="text-gray-400 text-sm hover:text-primary transition-colors flex items-center gap-1">
                          📧 {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Calendar size={14} />
                            {new Date(contact.created_at).toLocaleDateString('es-ES')}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {new Date(contact.created_at).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white p-2.5 rounded-lg transition-all duration-300 border border-red-600/30 hover:border-red-600"
                          title="Eliminar mensaje"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-[#0a0e14] p-4 rounded-lg border border-primary/10">
                      <p className="text-gray-300 leading-relaxed">{contact.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(1, 195, 142, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #01c38e, #00a876);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00a876, #01c38e);
        }
      `}</style>
    </div>
  );
}