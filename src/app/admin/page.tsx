'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Save, X, Plus, FolderOpen, MessageSquare, ExternalLink, Calendar, Tag, Sun, Moon, Upload, Image as ImageIcon, Award, LogOut, TrendingUp, Eye, CheckCircle2, Home, Github, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession, signOut } from 'next-auth/react';
import Carousel from '@/components/Carousel';
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
  const [activeTab, setActiveTab] = useState<'projects' | 'contacts' | 'skills' | 'hero' | 'pages'>('projects');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    github_link: '',
    technologies: '',
    status: 'completed',
    is_full_page: false,
    content_structure: {}
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Section builder states
  const [landingText, setLandingText] = useState('');
  const [landingDesktopImage, setLandingDesktopImage] = useState('');
  const [landingMobileImage, setLandingMobileImage] = useState('');
  const [landingDesktopFile, setLandingDesktopFile] = useState<File | null>(null);
  const [landingMobileFile, setLandingMobileFile] = useState<File | null>(null);

  const [panelesText, setPanelesText] = useState('');
  const [panelesImages, setPanelesImages] = useState<string[]>([]);
  const [panelesNewImageUrl, setPanelesNewImageUrl] = useState('');
  const [panelesSelectedFiles, setPanelesSelectedFiles] = useState<File[]>([]);

  const [roles, setRoles] = useState([{ name: '', description: '', images: [] as string[] }]);
  const [rolesNewImageUrls, setRolesNewImageUrls] = useState<string[]>(['']);
  const [rolesSelectedFiles, setRolesSelectedFiles] = useState<File[][]>([[]]);

  const [authText, setAuthText] = useState('');
  const [authImages, setAuthImages] = useState<string[]>([]);
  const [authNewImageUrl, setAuthNewImageUrl] = useState('');
  const [authSelectedFiles, setAuthSelectedFiles] = useState<File[]>([]);

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
    
    const techArray = (formData.technologies || '').trim() 
      ? (formData.technologies || '').split(',').map(t => t.trim()).filter(t => t.length > 0)
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

      let contentStructure = formData.content_structure;

      if (formData.is_full_page) {
        // Helper function to upload files
        const uploadFiles = async (files: File[]): Promise<string[]> => {
          const urls: string[] = [];
          for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
              alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB por archivo.`);
              return [];
            }
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image.webp'];
            if (!allowedTypes.includes(file.type)) {
              alert(`El archivo ${file.name} no es un tipo de imagen válido.`);
              return [];
            }
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const { data, error } = await supabase.storage
              .from('portfolio-images')
              .upload(fileName, file);
            if (error) {
              alert(`Error al subir ${file.name}: ${error.message}`);
              return [];
            }
            const { data: { publicUrl } } = supabase.storage
              .from('portfolio-images')
              .getPublicUrl(fileName);
            urls.push(publicUrl);
          }
          return urls;
        };

        // Upload section images
        let landingDesktopUrl = landingDesktopImage;
        let landingMobileUrl = landingMobileImage;
        if (landingDesktopFile) {
          const uploaded = await uploadFiles([landingDesktopFile]);
          if (uploaded.length > 0) landingDesktopUrl = uploaded[0];
        }
        if (landingMobileFile) {
          const uploaded = await uploadFiles([landingMobileFile]);
          if (uploaded.length > 0) landingMobileUrl = uploaded[0];
        }

        const panelesUploaded = await uploadFiles(panelesSelectedFiles);
        if (panelesUploaded.length === 0 && panelesSelectedFiles.length > 0) return;
        const panelesAllImages = [...panelesImages, ...panelesUploaded];

        const authUploaded = await uploadFiles(authSelectedFiles);
        if (authUploaded.length === 0 && authSelectedFiles.length > 0) return;
        const authAllImages = [...authImages, ...authUploaded];

        // For roles
        const rolesWithImages = await Promise.all(roles.map(async (role, index) => {
          const uploaded = await uploadFiles(rolesSelectedFiles[index] || []);
          if (uploaded.length === 0 && (rolesSelectedFiles[index] || []).length > 0) return null;
          return {
            name: role.name,
            description: role.description,
            images: [...role.images, ...uploaded]
          };
        }));
        if (rolesWithImages.includes(null)) return;
        const validRoles = rolesWithImages.filter(r => r !== null);

        // Build content structure
        contentStructure = {
          sections: [
            { type: 'landing', text: landingText, desktopImage: landingDesktopUrl, mobileImage: landingMobileUrl },
            { type: 'paneles', text: panelesText, images: panelesAllImages },
            { type: 'roles', roles: validRoles },
            { type: 'auth', text: authText, images: authAllImages }
          ]
        };
      }

      if (editingId) {
        const response = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            description: formData.description,
            link: formData.link || null,
            github_link: formData.github_link || null,
            technologies: techArray,
            status: formData.status,
            is_full_page: formData.is_full_page,
            content_structure: contentStructure
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update project');
        }
      } else {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            link: formData.link || null,
            github_link: formData.github_link || null,
            technologies: techArray,
            status: formData.status,
            is_full_page: formData.is_full_page,
            content_structure: contentStructure,
            created_at: new Date().toISOString()
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create project');
        }
        const { data } = await response.json();
        projectId = data[0].id;
      }

      if (allImageUrls.length > 0 && projectId) {
        if (editingId) {
          const response = await fetch(`/api/project-images?project_id=${editingId}`, { method: 'DELETE' });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete images');
          }
        }

        const imageData = allImageUrls.map(url => ({
          project_id: projectId,
          image: url
        }));

        const response = await fetch('/api/project-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: imageData })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to insert images');
        }
      }

      setFormData({ title: '', description: '', link: '', github_link: '', technologies: '', status: 'completed', is_full_page: false, content_structure: {} });
      setImageUrls([]);
      setSelectedFiles([]);
      setEditingId(null);
      // Reset section states
      setLandingText('');
      setLandingDesktopImage('');
      setLandingMobileImage('');
      setLandingDesktopFile(null);
      setLandingMobileFile(null);
      setPanelesText('');
      setPanelesImages([]);
      setPanelesNewImageUrl('');
      setPanelesSelectedFiles([]);
      setRoles([{ name: '', description: '', images: [] }]);
      setRolesNewImageUrls(['']);
      setRolesSelectedFiles([[]]);
      setAuthText('');
      setAuthImages([]);
      setAuthNewImageUrl('');
      setAuthSelectedFiles([]);
      loadData();
      
      alert('✅ Proyecto guardado exitosamente!');
    } catch (error) {
      console.error('Error saving project:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      console.error('Full error object:', JSON.stringify(error, null, 2));
      alert('❌ Error al guardar el proyecto. Revisa la consola para más detalles.');
    }
  };

  const handleEdit = async (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      link: project.link || '',
      github_link: project.github_link || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      status: project.status,
      is_full_page: project.is_full_page || false,
      content_structure: project.content_structure || {}
    });
    setEditingId(project.id);

    const { data: images } = await supabase
      .from('portfolio_projectimage')
      .select('image')
      .eq('project_id', project.id);
    
    if (images) {
      setImageUrls(images.map(img => img.image));
    }

    // Populate section states if full_page
    if (project.is_full_page && project.content_structure?.sections) {
      const sections = project.content_structure.sections;
      const landing = sections.find((s: any) => s.type === 'landing');
      if (landing) {
        setLandingText(landing.text || '');
        setLandingDesktopImage(landing.desktopImage || '');
        setLandingMobileImage(landing.mobileImage || '');
      }
      const paneles = sections.find((s: any) => s.type === 'paneles');
      if (paneles) {
        setPanelesText(paneles.text || '');
        setPanelesImages(paneles.images || []);
      }
      const rolesSection = sections.find((s: any) => s.type === 'roles');
      if (rolesSection) {
        setRoles(rolesSection.roles || [{ name: '', description: '', images: [] }]);
        setRolesNewImageUrls(new Array((rolesSection.roles || [{ name: '', description: '', images: [] }]).length).fill(''));
        setRolesSelectedFiles(new Array((rolesSection.roles || [{ name: '', description: '', images: [] }]).length).fill([]));
      }
      const auth = sections.find((s: any) => s.type === 'auth');
      if (auth) {
        setAuthText(auth.text || '');
        setAuthImages(auth.images || []);
      }
    }

    setActiveTab(project.is_full_page ? 'pages' : 'projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      const response = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error deleting project: ' + (errorData.error || 'Unknown error'));
        return;
      }
      loadData();
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este mensaje?')) {
      const response = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error deleting contact: ' + (errorData.error || 'Unknown error'));
        return;
      }
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
      const method = editingSkillId ? 'PUT' : 'POST';
      const body = editingSkillId ? { id: editingSkillId, ...skillFormData } : skillFormData;
      const response = await fetch('/api/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save skill');
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
      const response = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error deleting skill: ' + (errorData.error || 'Unknown error'));
        return;
      }
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
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0f1419]' : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FolderOpen className="text-primary animate-pulse" size={32} />
            </div>
          </div>
          <p className={`text-xl font-semibold mt-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cargando panel...</p>
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
      <header className={`sticky top-0 z-50 backdrop-blur-xl ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-b ${theme === 'dark' ? 'border-primary/20' : 'border-gray-200'} shadow-2xl`}>
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
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bienvenido, {session?.user?.name || 'Admin'}</p>
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
                <div className="relative z-10 flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium">
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
          <div className={`group relative overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a1f2e] to-[#151a27]' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} border ${theme === 'dark' ? 'border-primary/20 hover:border-primary/50' : 'border-blue-200 hover:border-blue-300'} transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FolderOpen size={24} className="text-primary" />
                </div>
                <TrendingUp size={20} className="text-green-400" />
              </div>
              <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Proyectos Totales</p>
              <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{projects.length}</p>
            </div>
          </div>

          <div className={`group relative overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a1f2e] to-[#151a27]' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} border ${theme === 'dark' ? 'border-primary/20 hover:border-primary/50' : 'border-blue-200 hover:border-blue-300'} transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1`}>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/5 group-hover:to-secondary/10 transition-all duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare size={24} className="text-secondary" />
                </div>
                <Eye size={20} className="text-blue-400" />
              </div>
              <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Mensajes Nuevos</p>
              <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{contacts.length}</p>
            </div>
          </div>

          <div className={`group relative overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a1f2e] to-[#151a27]' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} border ${theme === 'dark' ? 'border-primary/20 hover:border-primary/50' : 'border-blue-200 hover:border-blue-300'} transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award size={24} className="text-primary" />
                </div>
                <CheckCircle2 size={20} className="text-primary" />
              </div>
              <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Habilidades</p>
              <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{skills.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs - Modern Design */}
        <div className={`flex flex-wrap gap-3 mb-8 p-2 ${theme === 'dark' ? 'bg-[#0f1419]/50' : 'bg-white/50'} backdrop-blur-xl rounded-2xl border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          {[
            { id: 'projects', icon: FolderOpen, label: 'Proyectos', count: projects.length },
            { id: 'pages', icon: FolderOpen, label: 'Páginas', count: projects.filter(p => p.is_full_page).length },
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
                  : `${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`
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
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-gray-50 to-white'} p-8 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl sticky top-32`}>
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
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Tag size={16} className="text-primary" />
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="Nombre del proyecto"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      rows={4}
                      placeholder="Describe tu proyecto..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <ExternalLink size={16} className="text-primary" />
                      Link (opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="https://ejemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                      <Github size={16} className="text-primary" />
                      Link de GitHub (opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.github_link}
                      onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tecnologías</label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="React, Node.js, PostgreSQL"
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      <option value="completed">Completado</option>
                      <option value="in-progress">En Progreso</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Imágenes del Proyecto</label>
                    {imageUrls.length > 0 && <Carousel images={imageUrls} />}
                    <div className="space-y-3">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img src={url} alt={`Imagen ${index + 1}`} className="w-20 h-20 object-cover rounded-lg border-2 border-primary/30" />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className={`flex-1 px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      />
                      <button
                        type="button"
                        onClick={addImageUrl}
                        className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/50 transition-all duration-300"
                      >
                        <Plus size={16} className="text-primary" />
                      </button>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className={`w-full px-4 py-3 mt-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    />
                    <div className="space-y-3 mt-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className={`flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.is_full_page}
                      onChange={(e) => setFormData({ ...formData, is_full_page: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-primary transition-all duration-300"
                    />
                    <label className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>¿Es una página completa?</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                    >
                      {editingId ? 'Guardar Cambios' : 'Crear Proyecto'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ title: '', description: '', link: '', github_link: '', technologies: '', status: 'completed', is_full_page: false, content_structure: {} });
                          setImageUrls([]);
                          setSelectedFiles([]);
                          setEditingId(null);
                        }}
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                      >
                        <X size={16} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Projects List */}
            <div className="lg:col-span-3 space-y-6">
              {projects.map((project) => (
                <div key={project.id} className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-white to-gray-100'} p-6 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                      {project.is_full_page && <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">Página Completa</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300"
                      >
                        <Edit2 size={16} className="text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                  <div className="flex items-center gap-3 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-primary/10 text-primary border border-primary/10 px-4 py-2 rounded-full text-sm font-medium">{tech}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/50 transition-all duration-300 text-primary font-medium"
                      >
                        <ExternalLink size={16} />
                        <span>Ver Proyecto</span>
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/50 transition-all duration-300 text-primary font-medium"
                      >
                        <Github size={16} />
                        <span>Ver Código</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {contacts.map((contact) => (
              <div key={contact.id} className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-white to-gray-100'} p-6 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{contact.name}</h3>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{contact.email}</p>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{contact.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-gray-50 to-white'} p-8 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl sticky top-32`}>
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
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Nombre</label>
                    <input
                      type="text"
                      value={skillFormData.name}
                      onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="Nombre de la habilidad"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Categoría</label>
                    <input
                      type="text"
                      value={skillFormData.category}
                      onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="Categoría de la habilidad"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Proficiencia</label>
                    <input
                      type="number"
                      value={skillFormData.proficiency}
                      onChange={(e) => setSkillFormData({ ...skillFormData, proficiency: parseInt(e.target.value) })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="Proficiencia (0-100)"
                      min={0}
                      max={100}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                    >
                      {editingSkillId ? 'Guardar Cambios' : 'Crear Habilidad'}
                    </button>
                    {editingSkillId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSkillFormData({ name: '', category: '', proficiency: 50 });
                          setEditingSkillId(null);
                        }}
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                      >
                        <X size={16} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Skills List */}
            <div className="lg:col-span-3 space-y-6">
              {skills.map((skill) => (
                <div key={skill.id} className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-white to-gray-100'} p-6 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{skill.name}</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300"
                      >
                        <Edit2 size={16} className="text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-gray-400 mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{skill.category}</p>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                          Proficiencia
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                      <div style={{ width: `${skill.proficiency}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Images Tab */}
        {activeTab === 'hero' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-gray-50 to-white'} p-8 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl sticky top-32`}>
                <div className="flex items-center gap-3 mb-6">
                  {editingHeroId ? (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Edit2 size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Editar Hero Image</h2>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Plus size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Nueva Hero Image</h2>
                    </>
                  )}
                </div>
                
                <form onSubmit={handleHeroSubmit} className="space-y-5">
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Título (opcional)</label>
                    <input
                      type="text"
                      value={heroFormData.title}
                      onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="Título de la imagen"
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Orden</label>
                    <input
                      type="number"
                      value={heroFormData.order}
                      onChange={(e) => setHeroFormData({ ...heroFormData, order: parseInt(e.target.value) })}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="Orden de la imagen"
                      min={0}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>URL de la Imagen</label>
                    <input
                      type="url"
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Subir Imagen</label>
                    <input
                      type="file"
                      onChange={handleHeroFileSelect}
                      className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                    >
                      {editingHeroId ? 'Guardar Cambios' : 'Crear Hero Image'}
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
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                      >
                        <X size={16} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Hero Images List */}
            <div className="lg:col-span-3 space-y-6">
              {heroImages.map((heroImage) => (
                <div key={heroImage.id} className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-white to-gray-100'} p-6 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{heroImage.title || 'Sin Título'}</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditHero(heroImage)}
                        className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300"
                      >
                        <Edit2 size={16} className="text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteHero(heroImage.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                  <img src={heroImage.image} alt={heroImage.title || 'Hero Image'} className="w-full h-64 object-contain rounded-lg border-2 border-primary/30" />
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Orden: {heroImage.order}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            {editingId && (
              <div className="mb-8">
                <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-gray-50 to-white'} p-8 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Edit2 size={20} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Editar Página Completa</h2>
                  </div>

                  {/* Editable Page Preview */}
                  <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
                    <Navbar />

                    {/* Header */}
                    <div className={`border-b ${theme === 'dark' ? 'border-primary/20 bg-[#0f1419]' : 'border-gray-200 bg-white'} mt-24 pt-10 pb-16`}>
                      <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center">
                          <div className="mb-6">
                            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Título del Proyecto</label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-center text-5xl font-bold`}
                              placeholder="Título del proyecto"
                            />
                          </div>
                          <div className="mb-6">
                            <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Descripción del Proyecto</label>
                            <textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-center text-xl`}
                              rows={3}
                              placeholder="Describe tu proyecto..."
                            />
                          </div>
                          <div className="flex flex-wrap gap-3 justify-center mb-8 max-w-3xl mx-auto leading-loose p-4">
                            {formData.technologies.split(',').map((tech, i) => (
                              <span key={i} className="inline-block m-1 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-4 justify-center">
                            {formData.link && (
                              <a
                                href={formData.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                              >
                                <ExternalLink size={20} />
                                Ver Proyecto
                              </a>
                            )}
                            {formData.github_link && (
                              <a
                                href={formData.github_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-8 py-4 rounded-xl hover:bg-primary/20 transition-all"
                              >
                                <Github size={20} />
                                Ver Código
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="py-16">
                      {/* Sección de Introducción */}
                      <section className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`}>
                        <div className="max-w-7xl mx-auto">
                          <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                              <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sección de Introducción</h2>
                              <textarea
                                value={landingText}
                                onChange={(e) => setLandingText(e.target.value)}
                                className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-lg leading-relaxed`}
                                rows={6}
                                placeholder="Escribe aquí la introducción o descripción principal del proyecto..."
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="mb-6">
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Imagen Desktop</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setLandingDesktopFile(e.target.files?.[0] || null)}
                                  className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                />
                                {landingDesktopImage && <img src={landingDesktopImage} alt="Desktop" className="w-full h-32 object-cover rounded-lg mt-2" />}
                              </div>
                              <div className="mb-6">
                                <label className={`block mb-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Imagen Mobile</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setLandingMobileFile(e.target.files?.[0] || null)}
                                  className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                />
                                {landingMobileImage && <img src={landingMobileImage} alt="Mobile" className="w-full h-32 object-cover rounded-lg mt-2" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Sección de Galería */}
                      <section className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
                        <div className="max-w-7xl mx-auto">
                          <div className="text-center mb-16">
                            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sección de Galería</h2>
                            <textarea
                              value={panelesText}
                              onChange={(e) => setPanelesText(e.target.value)}
                              className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-xl max-w-3xl mx-auto`}
                              rows={4}
                              placeholder="Describe la galería de imágenes del proyecto..."
                            />
                          </div>
                          <div className="grid md:grid-cols-3 gap-8">
                            {(() => {
                              const allImages = [
                                ...panelesImages.map((img, idx) => ({ src: img, isNew: false, originalIndex: idx })),
                                ...panelesSelectedFiles.map((file, idx) => ({ src: URL.createObjectURL(file), isNew: true, originalIndex: idx }))
                              ];
                              return allImages.map((image, imgIndex) => (
                                <div key={`${image.isNew ? 'new' : 'old'}-${imgIndex}`} className={`aspect-video rounded-xl overflow-hidden relative group ${image.isNew ? 'border-2 border-yellow-500/50' : ''}`}>
                                  <img
                                    src={image.src}
                                    alt={`Galería ${imgIndex + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                  {image.isNew && (
                                    <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                      NUEVO
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (image.isNew) {
                                        setPanelesSelectedFiles(panelesSelectedFiles.filter((_, i) => i !== image.originalIndex));
                                      } else {
                                        setPanelesImages(panelesImages.filter((_, i) => i !== image.originalIndex));
                                      }
                                    }}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ));
                            })()}
                            <div className="aspect-video rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                              <input
                                type="file"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) setPanelesSelectedFiles([...panelesSelectedFiles, ...Array.from(e.target.files)]);
                                }}
                                className="hidden"
                                id="paneles-upload"
                              />
                              <label htmlFor="paneles-upload" className="cursor-pointer text-center">
                                <Plus size={32} className="text-primary mx-auto mb-2" />
                                <span className="text-sm text-primary">Agregar Imágenes</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Sección de Equipo */}
                      <section className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`}>
                        <div className="max-w-7xl mx-auto">
                          <div className="text-center mb-16">
                            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sección de Equipo</h2>
                          </div>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {roles.map((role, roleIndex) => (
                              <div key={roleIndex} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'border-primary/20 bg-[#0f1419]' : 'border-gray-200 bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 relative group`}>
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Users size={24} className="text-primary" />
                                  </div>
                                  <input
                                    type="text"
                                    value={role.name}
                                    onChange={(e) => {
                                      const newRoles = [...roles];
                                      newRoles[roleIndex].name = e.target.value;
                                      setRoles(newRoles);
                                    }}
                                    className={`flex-1 px-3 py-2 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-xl font-bold`}
                                    placeholder="Nombre del rol"
                                  />
                                </div>
                                <textarea
                                  value={role.description}
                                  onChange={(e) => {
                                    const newRoles = [...roles];
                                    newRoles[roleIndex].description = e.target.value;
                                    setRoles(newRoles);
                                  }}
                                  className={`w-full px-3 py-2 mb-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                                  rows={3}
                                  placeholder="Descripción del rol en el proyecto..."
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  {(() => {
                                    const roleImages = [
                                      ...role.images.map((img, idx) => ({ src: img, isNew: false, originalIndex: idx })),
                                      ...(rolesSelectedFiles[roleIndex] || []).map((file, idx) => ({ src: URL.createObjectURL(file), isNew: true, originalIndex: idx }))
                                    ];
                                    return roleImages.map((image, imgIndex) => (
                                      <div key={`${image.isNew ? 'new' : 'old'}-${imgIndex}`} className={`aspect-square rounded-lg overflow-hidden relative group ${image.isNew ? 'border-2 border-yellow-500/50' : ''}`}>
                                        <img
                                          src={image.src}
                                          alt={`${role.name} ${imgIndex + 1}`}
                                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                        {image.isNew && (
                                          <div className="absolute top-1 left-1 bg-yellow-500 text-black px-1 py-0.5 rounded text-xs font-bold">
                                            NUEVO
                                          </div>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (image.isNew) {
                                              const newFiles = [...rolesSelectedFiles];
                                              newFiles[roleIndex] = (newFiles[roleIndex] || []).filter((_, i) => i !== image.originalIndex);
                                              setRolesSelectedFiles(newFiles);
                                            } else {
                                              const newRoles = [...roles];
                                              newRoles[roleIndex].images = newRoles[roleIndex].images.filter((_, i) => i !== image.originalIndex);
                                              setRoles(newRoles);
                                            }
                                          }}
                                          className="absolute top-1 right-1 p-1 rounded bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    ));
                                  })()}
                                  <div className="aspect-square rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
                                    <input
                                      type="file"
                                      multiple
                                      onChange={(e) => {
                                        if (e.target.files) {
                                          const newFiles = [...rolesSelectedFiles];
                                          newFiles[roleIndex] = [...(newFiles[roleIndex] || []), ...Array.from(e.target.files)];
                                          setRolesSelectedFiles(newFiles);
                                        }
                                      }}
                                      className="hidden"
                                      id={`role-upload-${roleIndex}`}
                                    />
                                    <label htmlFor={`role-upload-${roleIndex}`} className="cursor-pointer text-center">
                                      <Plus size={20} className="text-primary mx-auto mb-1" />
                                      <span className="text-xs text-primary">Agregar</span>
                                    </label>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setRoles(roles.filter((_, i) => i !== roleIndex))}
                                  className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                            <div className={`p-6 rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-primary/20 bg-[#0f1419]/50' : 'border-gray-300 bg-gray-50'} flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all duration-300`} onClick={() => {
                              setRoles([...roles, { name: '', description: '', images: [] }]);
                              setRolesNewImageUrls([...rolesNewImageUrls, '']);
                              setRolesSelectedFiles([...rolesSelectedFiles, []]);
                            }}>
                              <div className="text-center">
                                <Plus size={48} className="text-primary mx-auto mb-4" />
                                <span className="text-primary font-medium">Agregar Miembro del Equipo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Sección de Autenticación */}
                      <section className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
                        <div className="max-w-7xl mx-auto">
                          <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                              <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sección de Autenticación</h2>
                              <textarea
                                value={authText}
                                onChange={(e) => setAuthText(e.target.value)}
                                className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 ${theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-lg leading-relaxed`}
                                rows={6}
                                placeholder="Describe el sistema de autenticación o login del proyecto..."
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {(() => {
                                const authAllImages = [
                                  ...authImages.map((img, idx) => ({ src: img, isNew: false, originalIndex: idx })),
                                  ...authSelectedFiles.map((file, idx) => ({ src: URL.createObjectURL(file), isNew: true, originalIndex: idx }))
                                ];
                                return authAllImages.map((image, imgIndex) => (
                                  <div key={`${image.isNew ? 'new' : 'old'}-${imgIndex}`} className={`aspect-square rounded-xl overflow-hidden relative group ${image.isNew ? 'border-2 border-yellow-500/50' : ''}`}>
                                    <img
                                      src={image.src}
                                      alt={`Autenticación ${imgIndex + 1}`}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                    {image.isNew && (
                                      <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                        NUEVO
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (image.isNew) {
                                          setAuthSelectedFiles(authSelectedFiles.filter((_, i) => i !== image.originalIndex));
                                        } else {
                                          setAuthImages(authImages.filter((_, i) => i !== image.originalIndex));
                                        }
                                      }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ));
                              })()}
                              <div className="aspect-square rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files) setAuthSelectedFiles([...authSelectedFiles, ...Array.from(e.target.files)]);
                                  }}
                                  className="hidden"
                                  id="auth-upload"
                                />
                                <label htmlFor="auth-upload" className="cursor-pointer text-center">
                                  <Plus size={32} className="text-primary mx-auto mb-2" />
                                  <span className="text-sm text-primary">Agregar Imágenes</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center gap-3 mt-8">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ title: '', description: '', link: '', github_link: '', technologies: '', status: 'completed', is_full_page: false, content_structure: {} });
                        setImageUrls([]);
                        setSelectedFiles([]);
                        setEditingId(null);
                        // Reset section states
                        setLandingText('');
                        setLandingDesktopImage('');
                        setLandingMobileImage('');
                        setLandingDesktopFile(null);
                        setLandingMobileFile(null);
                        setPanelesText('');
                        setPanelesImages([]);
                        setPanelesNewImageUrl('');
                        setPanelesSelectedFiles([]);
                        setRoles([{ name: '', description: '', images: [] }]);
                        setRolesNewImageUrls(['']);
                        setRolesSelectedFiles([[]]);
                        setAuthText('');
                        setAuthImages([]);
                        setAuthNewImageUrl('');
                        setAuthSelectedFiles([]);
                      }}
                      className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                    >
                      <X size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Projects List */}
            {projects.filter(p => p.is_full_page).map((project) => (
              <div key={project.id} className={`${theme === 'dark' ? 'bg-gradient-to-br from-[#1e2432] to-[#252b3d]' : 'bg-gradient-to-br from-white to-gray-100'} p-6 rounded-2xl ${theme === 'dark' ? 'border border-primary/30' : 'border border-gray-300'} shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/50 transition-all duration-300 text-primary font-medium"
                    >
                      Editar Página
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 transition-all duration-300"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                <a
                  href={`/project/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/50 transition-all duration-300 text-primary font-medium"
                >
                  <ExternalLink size={16} />
                  Ver Página Completa
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
