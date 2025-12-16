'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Save, X, Plus, FolderOpen, MessageSquare, ExternalLink, Calendar, Tag, Sun, Moon, Upload, Image as ImageIcon, Award, LogOut, TrendingUp, Eye, CheckCircle2, Home, Github } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession, signOut } from 'next-auth/react';

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
}

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

interface HeroImage {
  id: number;
  image: string;
  title?: string;
  order: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // State declarations
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'contacts' | 'skills' | 'hero'>('projects');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    github_link: '',
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

  // Hero form states
  const [heroFormData, setHeroFormData] = useState({
    title: '',
    order: 0
  });
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heroSelectedFile, setHeroSelectedFile] = useState<File | null>(null);
  const [editingHeroId, setEditingHeroId] = useState<number | null>(null);

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // Load data function
  const loadData = async () => {
    setLoading(true);
    
    const { data: projectsData } = await supabase
      .from('portfolio_project')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data: contactsData } = await supabase
      .from('portfolio_contact')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: skillsData } = await supabase
      .from('portfolio_skill')
      .select('*')
      .order('category', { ascending: true });

    const { data: heroData } = await supabase
      .from('portfolio_heroimage')
      .select('*')
      .order('order', { ascending: true });

    setProjects(projectsData || []);
    setContacts(contactsData || []);
    setSkills(skillsData || []);
    setHeroImages(heroData || []);
    setLoading(false);
  };

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  // Mostrar loading mientras verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-white text-xl font-semibold">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const techArray = formData.technologies.trim() 
      ? formData.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];
    
    try {
      const uploadedUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          if (file.size > 5 * 1024 * 1024) {
            alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB por archivo.`);
            return;
          }
          
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(file.type)) {
            alert(`El archivo ${file.name} no es un tipo de imagen válido.`);
            return;
          }
          
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, file);
          
          if (error) {
            alert(`Error al subir ${file.name}: ${error.message}`);
            return;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(fileName);
          
          uploadedUrls.push(publicUrl);
        }
      }
      
      const allImageUrls = [...uploadedUrls, ...imageUrls];
      let projectId = editingId;

      if (editingId) {
        const { error } = await supabase
          .from('portfolio_project')
          .update({
            title: formData.title,
            description: formData.description,
            link: formData.link || null,
            github_link: formData.github_link || null,
            technologies: techArray,
            status: formData.status
          })
          .eq('id', editingId);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('portfolio_project')
          .insert([{
            title: formData.title,
            description: formData.description,
            link: formData.link || null,
            github_link: formData.github_link || null,
            technologies: techArray,
            status: formData.status,
            created_at: new Date().toISOString()
          }])
          .select();
        
        if (error) throw error;
        projectId = data[0].id;
      }

      if (allImageUrls.length > 0 && projectId) {
        if (editingId) {
          await supabase
            .from('portfolio_projectimage')
            .delete()
            .eq('project_id', editingId);
        }

        const imageData = allImageUrls.map(url => ({
          project_id: projectId,
          image: url
        }));

        await supabase
          .from('portfolio_projectimage')
          .insert(imageData);
      }

      setFormData({ title: '', description: '', link: '', technologies: '', status: 'completed' });
      setImageUrls([]);
      setSelectedFiles([]);
      setEditingId(null);
      loadData();
      
      alert('✅ Proyecto guardado exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar el proyecto.');
    }
  };

  const handleEdit = async (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      link: project.link || '',
      github_link: project.github_link || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      status: project.status
    });
    setEditingId(project.id);

    const { data: images } = await supabase
      .from('portfolio_projectimage')
      .select('image')
      .eq('project_id', project.id);
    
    if (images) {
      setImageUrls(images.map(img => img.image));
    }

    setActiveTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      await supabase.from('portfolio_project').delete().eq('id', id);
      loadData();
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este mensaje?')) {
      await supabase.from('portfolio_contact').delete().eq('id', id);
      loadData();
    }
  };

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      await signOut({ redirect: true, callbackUrl: '/' });
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
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSkillId) {
        await supabase.from('portfolio_skill').update(skillFormData).eq('id', editingSkillId);
      } else {
        await supabase.from('portfolio_skill').insert([skillFormData]);
      }

      setSkillFormData({ name: '', category: '', proficiency: 50 });
      setEditingSkillId(null);
      loadData();
    } catch (error) {
      alert('Error al guardar la habilidad.');
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setSkillFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency
    });
    setEditingSkillId(skill.id);
    setActiveTab('skills');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSkill = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta habilidad?')) {
      await supabase.from('portfolio_skill').delete().eq('id', id);
      loadData();
    }
  };

  // Hero Image handlers
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = heroImageUrl;
      
      // Upload file if selected
      if (heroSelectedFile) {
        if (heroSelectedFile.size > 5 * 1024 * 1024) {
          alert('El archivo es demasiado grande. Máximo 5MB.');
          return;
        }
        
        const fileExt = heroSelectedFile.name.split('.').pop();
        const fileName = `hero-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, heroSelectedFile);
        
        if (error) {
          alert(`Error al subir imagen: ${error.message}`);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage  
          .from('portfolio-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }
      
      if (!imageUrl) {
        alert('Por favor selecciona una imagen o ingresa una URL');
        return;
      }

      if (editingHeroId) {
        await supabase
          .from('portfolio_heroimage')
          .update({
            image: imageUrl,
            title: heroFormData.title || null,
            order: heroFormData.order
          })
          .eq('id', editingHeroId);
      } else {
        await supabase
          .from('portfolio_heroimage')
          .insert([{
            image: imageUrl,
            title: heroFormData.title || null,
            order: heroFormData.order
          }]);
      }

      setHeroFormData({ title: '', order: 0 });
      setHeroImageUrl('');
      setHeroSelectedFile(null);
      setEditingHeroId(null);
      loadData();
      
      alert('✅ Imagen del Hero guardada exitosamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar la imagen.');
    }
  };

  const handleEditHero = (heroImage: HeroImage) => {
    setHeroFormData({
      title: heroImage.title || '',
      order: heroImage.order
    });
    setHeroImageUrl(heroImage.image);
    setEditingHeroId(heroImage.id);
    setActiveTab('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHero = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta imagen del Hero?')) {
      await supabase.from('portfolio_heroimage').delete().eq('id', id);
      loadData();
    }
  };

  const handleHeroFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroSelectedFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FolderOpen className="text-primary animate-pulse" size={32} />
            </div>
          </div>
          <p className="text-white text-xl font-semibold mt-6">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a1f2e]' : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f1419]/80 border-b border-primary/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <FolderOpen size={28} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Panel de Control
                </h1>
                <p className="text-sm text-gray-400">Bienvenido, {session?.user?.name || 'Admin'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="relative group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-secondary/10 rounded-xl transition-all duration-300"></div>
                {theme === 'dark' ? <Sun size={20} className="text-primary relative z-10" /> : <Moon size={20} className="text-primary relative z-10" />}
              </button>

              <button 
                onClick={() => router.push('/')}
                className="relative group px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/20 group-hover:to-primary/10 transition-all duration-500"></div>
                <div className="relative z-10 flex items-center space-x-2 text-white font-medium">
                  <ExternalLink size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:inline">Ver Sitio</span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="relative group p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
              >
                <LogOut size={20} className="text-red-400 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f2e] to-[#151a27] border border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FolderOpen size={24} className="text-primary" />
                </div>
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">Proyectos Totales</p>
              <p className="text-4xl font-bold text-white">{projects.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f2e] to-[#151a27] border border-secondary/20 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/5 group-hover:to-secondary/10 transition-all duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare size={24} className="text-secondary" />
                </div>
                <Eye size={20} className="text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">Mensajes Nuevos</p>
              <p className="text-4xl font-bold text-white">{contacts.length}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f2e] to-[#151a27] border border-primary/20 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award size={24} className="text-primary" />
                </div>
                <CheckCircle2 size={20} className="text-primary" />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">Habilidades</p>
              <p className="text-4xl font-bold text-white">{skills.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs - Modern Design */}
        <div className="flex flex-wrap gap-3 mb-8 p-2 bg-[#0f1419]/50 backdrop-blur-xl rounded-2xl border border-white/10">
          {[
            { id: 'projects', icon: FolderOpen, label: 'Proyectos', count: projects.length },
            { id: 'contacts', icon: MessageSquare, label: 'Mensajes', count: contacts.length },
            { id: 'skills', icon: Award, label: 'Habilidades', count: skills.length },
            { id: 'hero', icon: Home, label: 'Hero Images', count: heroImages.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 relative group px-6 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <tab.icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-primary/20 text-primary'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
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
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <Github size={16} className="text-primary" />
                      Link de GitHub (opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.github_link}
                      onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                      placeholder="https://github.com/username/repo"
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
                          setFormData({ title: '', description: '', link: '', github_link: '', technologies: '', status: 'completed' });
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
                          {Array.isArray(project.images) && project.images.map((image: { image: string }, idx: number) => (
                            <img 
                              key={idx} 
                              src={image.image} 
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
                      }, {} as Record<string, Skill[]>)
                    ).map(([category, categorySkills]) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                          <Tag size={18} />
                          {category}
                        </h3>
                        <div className="space-y-3">
                          {(categorySkills).map((skill) => (
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

        {/* Hero Images Tab */}
        {activeTab === 'hero' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Hero Form */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] p-8 rounded-2xl border border-primary/30 shadow-2xl sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  {editingHeroId ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Edit2 size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Editar Imagen Hero</h2>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Plus size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Nueva Imagen Hero</h2>
                    </>
                  )}
                </div>

                <form onSubmit={handleHeroSubmit} className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <Upload size={16} className="text-primary" />
                      Subir Imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileSelect}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary file:cursor-pointer"
                    />
                    {heroSelectedFile && (
                      <div className="mt-3 flex items-center gap-2 bg-[#0f1419] p-2 rounded-lg border border-primary/20">
                        <img 
                          src={URL.createObjectURL(heroSelectedFile)} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded" 
                        />
                        <span className="flex-1 text-sm text-gray-300 truncate">{heroSelectedFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setHeroSelectedFile(null)}
                          className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <ImageIcon size={16} className="text-primary" />
                      O URL de Imagen
                    </label>
                    <input
                      type="url"
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {heroImageUrl && !heroSelectedFile && (
                      <div className="mt-3">
                        <img 
                          src={heroImageUrl} 
                          alt="Preview" 
                          className="w-full h-40 object-cover rounded-lg border border-primary/20" 
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                      <Tag size={16} className="text-primary" />
                      Título (opcional)
                    </label>
                    <input
                      type="text"
                      value={heroFormData.title}
                      onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white placeholder-gray-500"
                      placeholder="Descripción de la imagen"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Orden</label>
                    <input
                      type="number"
                      value={heroFormData.order}
                      onChange={(e) => setHeroFormData({ ...heroFormData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-[#0f1419] border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-white"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Las imágenes se mostrarán en orden ascendente</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/50 flex items-center justify-center gap-2"
                    >
                      {editingHeroId ? (
                        <>
                          <Save size={20} />
                          Actualizar Imagen
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          Agregar Imagen
                        </>
                      )}
                    </button>

                    {editingHeroId && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeroFormData({ title: '', order: 0 });
                          setHeroImageUrl('');
                          setHeroSelectedFile(null);
                          setEditingHeroId(null);
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

            {/* Hero Images List */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-[#1e2432] to-[#252b3d] p-8 rounded-2xl border border-primary/30 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Home className="text-primary" />
                  Imágenes del Hero (Carrusel de Bienvenida)
                </h2>

                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {heroImages.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <ImageIcon size={48} className="text-primary/50" />
                      </div>
                      <p className="text-gray-400 text-lg">No hay imágenes del Hero</p>
                      <p className="text-gray-500 text-sm mt-2">Agrega imágenes para el carrusel de bienvenida</p>
                    </div>
                  ) : (
                    heroImages.map((heroImage) => (
                      <div
                        key={heroImage.id}
                        className="bg-gradient-to-br from-[#0f1419] to-[#1a1f2e] p-4 rounded-xl border-2 border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                      >
                        <div className="flex gap-4">
                          <img 
                            src={heroImage.image} 
                            alt={heroImage.title || 'Hero Image'} 
                            className="w-40 h-24 object-cover rounded-lg border border-primary/20"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-lg font-bold text-white">
                                  {heroImage.title || 'Sin título'}
                                </h4>
                                <p className="text-sm text-gray-400">Orden: {heroImage.order}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditHero(heroImage)}
                                  className="bg-primary/20 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 border border-primary/30 hover:border-primary"
                                >
                                  <Edit2 size={14} />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteHero(heroImage.id)}
                                  className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 border border-red-600/30 hover:border-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{heroImage.image}</p>
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