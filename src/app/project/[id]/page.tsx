'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ExternalLink, Github, Edit2, Save, X, Plus, Trash2, Upload, Globe, FolderOpen, Sun, Moon, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { AnimatePresence, motion } from 'framer-motion';
import PhoneMockup from '@/components/PhoneMockup';
import LaptopMockup from '@/components/LaptopMockup';

interface Project {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  link?: string;
  github_link?: string;
  technologies: string[];
  status: 'completed' | 'in-progress';
  created_at: string;
  images?: { image: string }[];
  is_full_page?: boolean;
  content_structure?: {
    sections: any[];
  };
}

const TextReveal = ({ text }: { text: string }) => {
  const words = text.split(" ");

  return (
    <motion.p
      className="font-sans text-lg leading-loose text-slate-300 font-light"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0,
            delay: i * 0.03
          }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

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
  const [editShortDescription, setEditShortDescription] = useState('');
  const [editTechnologies, setEditTechnologies] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editGithubLink, setEditGithubLink] = useState('');
  const [editSections, setEditSections] = useState<any[]>([]);

  // New states for UI enhancements
  const [activeRoleTab, setActiveRoleTab] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  // Estado para alternar entre Desktop (Swiper) y Mobile (Mockup)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // New states for landing images
  const [editDesktopImage, setEditDesktopImage] = useState('');
  const [editMobileImage, setEditMobileImage] = useState('');
  const [newDesktopFile, setNewDesktopFile] = useState<File | null>(null);
  const [newMobileFile, setNewMobileFile] = useState<File | null>(null);

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
      setEditTechnologies(
        Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : (project.technologies || '') // Fallback seguro
      );
      setEditLink(project.link || '');
      setEditGithubLink(project.github_link || '');
      setEditShortDescription(project.short_description || '');
      const sections = project.content_structure?.sections || [];
      setEditSections(sections.map((s: any) => ({
        ...s,
        enabled: s.enabled !== false,
        ...(s.type === 'auth' ? { hasRegistration: s.hasRegistration !== false } : {})
      })));
      const landing = sections.find((s: any) => s.type === 'landing');
      if (landing) {
        setEditDesktopImage(landing.desktopImage || '');
        setEditMobileImage(landing.mobileImage || '');
      }
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

      // Handle new images for roles
      const updatedSectionsWithRoles = await Promise.all(updatedSections.map(async section => {
        if (section.type === 'roles' && section.roles) {
          const updatedRoles = await Promise.all(section.roles.map(async (role: any) => {
            if (role.newImages && role.newImages.length > 0) {
              const uploadedUrls = [];
              for (const file of role.newImages) {
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
                ...role,
                images: [...(role.images || []), ...uploadedUrls],
                newImages: undefined
              };
            }
            return role;
          }));
          return { ...section, roles: updatedRoles };
        }
        return section;
      }));

      // Handle new mobile images for sections
      const updatedSectionsWithMobile = await Promise.all(updatedSections.map(async (section) => {
        if (section.newMobileImage) {
          const fileExt = section.newMobileImage.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const { error } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, section.newMobileImage);
          if (error) throw error;
          const { data: { publicUrl } } = await supabase.storage
            .from('portfolio-images')
            .getPublicUrl(fileName);
          return {
            ...section,
            mobileImage: publicUrl,
            newMobileImage: undefined
          };
        }
        return section;
      }));

      // Handle new desktop and mobile images for landing
      let updatedDesktopImage = editDesktopImage;
      let updatedMobileImage = editMobileImage;

      if (newDesktopFile) {
        const fileExt = newDesktopFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, newDesktopFile);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(fileName);
        updatedDesktopImage = publicUrl;
      }

      if (newMobileFile) {
        const fileExt = newMobileFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, newMobileFile);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(fileName);
        updatedMobileImage = publicUrl;
      }

      const contentStructure = { sections: updatedSectionsWithMobile.map(section => section.type === 'landing' ? { ...section, desktopImage: updatedDesktopImage, mobileImage: updatedMobileImage } : section) };

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          title: editTitle,
          description: editDescription,
          short_description: editShortDescription,
          link: editLink || null,
          github_link: editGithubLink || null,
          technologies: String(editTechnologies ?? '').split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0),
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
        short_description: editShortDescription,
        link: editLink,
        github_link: editGithubLink,
        technologies: String(editTechnologies ?? '').split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0),
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
      setEditTechnologies(
        Array.isArray(project.technologies) 
          ? project.technologies.join(', ') 
          : (project.technologies || '') // Fallback seguro
      );
      setEditLink(project.link || '');
      setEditGithubLink(project.github_link || '');
      setEditShortDescription(project.short_description || '');
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
    const enabledSections = project?.content_structure?.sections?.filter((s: any) => s.enabled !== false) || [];
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
                    {t.project.header.name}
                  </span>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} -mt-0.5`}>
                    {t.project.header.role}
                  </p>
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {enabledSections.some(s => s.type === 'landing') && <a href="#landing" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.project.header.landing}</a>}
              {enabledSections.some(s => s.type === 'paneles') && <a href="#paneles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.project.header.panels}</a>}
              {enabledSections.some(s => s.type === 'roles') && <a href="#roles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.project.header.roles}</a>}
              {enabledSections.some(s => s.type === 'auth') && <a href="#auth" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.project.header.auth}</a>}
              
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
                {enabledSections.some(s => s.type === 'landing') && <a href="#landing" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.project.header.landing}</a>}
                {enabledSections.some(s => s.type === 'paneles') && <a href="#paneles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.project.header.panels}</a>}
                {enabledSections.some(s => s.type === 'roles') && <a href="#roles" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.project.header.roles}</a>}
                {enabledSections.some(s => s.type === 'auth') && <a href="#auth" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.project.header.auth}</a>}
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
            <p className="text-xl font-semibold">{t.project.loading.loading}</p>
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
            <h1 className="text-4xl font-bold mb-4">{t.project.loading.notFound}</h1>
            <Link href="/" className="text-primary hover:text-secondary font-medium">
              ← {t.project.hero.backHome}
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
            <h1 className="text-4xl font-bold mb-4">{t.project.loading.comingSoon}</h1>
            <p className="text-lg mb-6">Esta página completa está en desarrollo. ¡Vuelve pronto!</p>
            <Link href="/" className="text-primary hover:text-secondary font-medium">
              ← {t.project.hero.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render full-page project with sections
  const sections = isEditing ? editSections : project.content_structure.sections;
  const filteredSections = isEditing ? sections : sections.filter((s: any) => s.enabled !== false);

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
              {t.project.edit.edit}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Save size={16} />
                {t.project.edit.save}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={16} />
                {t.project.edit.cancel}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center pt-64 pb-48" style={{ backgroundImage: `url(${project.images?.[0]?.image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 backdrop-blur-sm bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
        <div className="relative z-10 text-center max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 mb-8">
            <ArrowLeft size={24} />
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
                  placeholder={t.project.hero.titlePlaceholder}
                />
                <textarea
                  value={editShortDescription}
                  onChange={(e) => setEditShortDescription(e.target.value)}
                  className="w-full px-4 py-3 mb-6 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300 text-center text-lg leading-relaxed"
                  rows={2}
                  placeholder="Descripción corta para las tarjetas"
                ></textarea>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 mb-6 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300 text-center text-xl leading-relaxed"
                  rows={3}
                  placeholder={t.project.hero.descriptionPlaceholder}
                ></textarea>
                <input
                  type="text"
                  value={editTechnologies}
                  onChange={(e) => setEditTechnologies(e.target.value)}
                  className="w-full px-4 py-3 mb-8 bg-black/20 text-white border-2 border-white/30 rounded-xl focus:outline-none focus:border-white transition-all duration-300 text-center"
                  placeholder={t.project.hero.techPlaceholder}
                />
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {editTechnologies && String(editTechnologies).trim().length > 0 ? (
                    String(editTechnologies).split(',').map((tech, i) => (
                      <span key={i} className="backdrop-blur-md bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {tech.trim()}
                      </span>
                    ))
                  ) : null}
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
                <h1 className="text-6xl font-heading font-bold tracking-tight text-white mb-4 drop-shadow-lg">
                  {project.title}
                </h1>
                <p className="text-xl mb-6 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {project.description ? project.description.substring(0, 100) + '...' : ''}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {project.technologies && Array.isArray(project.technologies) ? project.technologies.map((tech, i) => (
                    <span key={i} className="backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  )) : []}
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
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <ExternalLink size={20} />
                    {t.project.hero.viewDemo}
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
                    {t.project.hero.github}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div>
        {filteredSections.map((section: any, index: number) => {
          switch (section.type) {
            case 'landing':
              return (
                <section key={index} id="landing" className="bg-[#0f172a] py-20">
                  <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-heading font-bold tracking-tight mb-12 text-primary text-left">{t.project.sections.landing}</h2>
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                      
                      {/* Columna de Texto (Sin cambios) */}
                      <div className="lg:col-span-5 prose prose-invert prose-lg">
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Escribe aquí la introducción..."
                          ></textarea>
                        ) : (
                          <TextReveal text={section.text} />
                        )}

                        {isEditing && (
                          <label className="flex items-center gap-2 mt-4">
                            <input type="checkbox" checked={section.enabled !== false} onChange={(e) => updateSection(index, { enabled: e.target.checked })} />
                            <span className="text-gray-300">Habilitada</span>
                          </label>
                        )}

                        {/* Campo para Imagen Versión Móvil */}
                        {isEditing && (
                          <div>
                            <div className="mt-6">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Imagen Versión Desktop
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewDesktopFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 bg-[#0f1419] text-white border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-all duration-300"
                              />
                              {editDesktopImage && (
                                <p className="text-sm text-gray-400 mt-2">Imagen actual: {editDesktopImage.split('/').pop()}</p>
                              )}
                            </div>
                            <div className="mt-6">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Imagen Versión Móvil
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewMobileFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 bg-[#0f1419] text-white border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-all duration-300"
                              />
                              {editMobileImage && (
                                <p className="text-sm text-gray-400 mt-2">Imagen actual: {editMobileImage.split('/').pop()}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Columna de Imágenes (MODIFICADA) */}
                      <div className="lg:col-span-7 overflow-hidden py-10 relative">
                        
                        {/* Botón Toggle: Solo visible en PC (md:flex), oculto en móvil */}
                        <div className="hidden md:flex justify-end mb-6 absolute top-0 right-0 z-20">
                          <button 
                            onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-lg ${
                              viewMode === 'mobile' 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
                            }`}
                          >
                            {viewMode === 'desktop' ? (
                              <>📱 Ver en Celular</>
                            ) : (
                              <>💻 Ver en Laptop</>
                            )}
                          </button>
                        </div>

                        {/* Renderizado Condicional */}
                        {viewMode === 'mobile' ? (
                          // 1. VISTA MOCKUP CELULAR
                          <div className="animate-in fade-in zoom-in duration-500 rounded-2xl border border-white/5 shadow-2xl shadow-black/50">
                             <PhoneMockup imageSrc={section.mobileImage || ''} />
                             <p className="text-center text-sm text-gray-500 mt-2">
                               Haz scroll dentro del dispositivo para navegar
                             </p>
                          </div>
                        ) : (
                          // 2. VISTA LAPTOP MOCKUP
                          <div className="animate-in fade-in zoom-in duration-500 rounded-2xl border border-white/5 shadow-2xl shadow-black/50">
                             <LaptopMockup imageSrc={section.desktopImage || ''} />
                             <p className="text-center text-sm text-gray-500 mt-2">
                               Haz scroll dentro del dispositivo para navegar
                             </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'paneles':
              return (
                <section key={index} id="paneles" className="bg-[#1e293b] py-20">
                  <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-heading font-bold tracking-tight mb-12 text-primary text-left">Paneles</h2>
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7 overflow-hidden py-10">
                        <Swiper
                          effect={'coverflow'}
                          grabCursor={true}
                          centeredSlides={true}
                          slidesPerView={'auto'}
                          loop={true}
                          autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                          }}
                          coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                          }}
                          pagination={true}
                          modules={[EffectCoverflow, Pagination, Autoplay]}
                          className="w-full pt-10 pb-10"
                        >
                          {(section.images || []).map((image: string, imgIndex: number) => (
                            <SwiperSlide key={imgIndex} className="bg-center bg-cover w-[300px] h-[300px] rounded-2xl border border-white/5 shadow-2xl shadow-black/50 overflow-hidden relative group">
                              <img 
                                src={image} 
                                alt={`Slide ${imgIndex}`} 
                                className="block w-full h-full object-cover cursor-pointer"
                                onClick={() => setLightboxImage(image)}
                              />
                              {isEditing && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeImageFromSection(index, imgIndex); }}
                                  className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        {isEditing && (
                          <div className="rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center mt-6">
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
                      <div className="lg:col-span-5 prose prose-invert prose-lg">
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Describe la galería o paneles del proyecto..."
                          ></textarea>
                        ) : (
                          <TextReveal text={section.text} />
                        )}

                        {isEditing && (
                          <label className="flex items-center gap-2 mt-4">
                            <input type="checkbox" checked={section.enabled !== false} onChange={(e) => updateSection(index, { enabled: e.target.checked })} />
                            <span className="text-gray-300">Habilitada</span>
                          </label>
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
                    <h2 className="text-3xl font-heading font-bold tracking-tight mb-12 text-primary text-left">Roles</h2>
                    <div className="flex space-x-2 bg-white/5 p-1 rounded-xl backdrop-blur-sm w-fit mx-auto mb-8">
                      {(section.roles || []).map((role: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setActiveRoleTab(i)}
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
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
                                className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                                rows={6}
                                placeholder="Descripción del rol"
                              ></textarea>
                            ) : (
                              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                {section.roles[activeRoleTab].description}
                              </p>
                            )}

                            {isEditing && (
                              <label className="flex items-center gap-2 mt-4">
                                <input type="checkbox" checked={section.enabled !== false} onChange={(e) => updateSection(index, { enabled: e.target.checked })} />
                                <span className="text-gray-300">Habilitada</span>
                              </label>
                            )}
                          </div>
                          <div className="lg:col-span-7 overflow-hidden py-10">
                            <Swiper
                              effect={'coverflow'}
                              grabCursor={true}
                              centeredSlides={true}
                              slidesPerView={'auto'}
                              loop={true}
                              autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                              }}
                              coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                              }}
                              pagination={true}
                              modules={[EffectCoverflow, Pagination, Autoplay]}
                              className="w-full pt-10 pb-10"
                            >
                              {(section.roles[activeRoleTab].images || []).map((image: string, imgIndex: number) => (
                                <SwiperSlide key={imgIndex} className="w-[600px] h-[200px] rounded-2xl border border-white/5 shadow-2xl shadow-black/50 overflow-hidden relative group backdrop-blur-md bg-white/10">
                                  <img 
                                    src={image} 
                                    alt={`Slide ${imgIndex}`} 
                                    className="block w-full h-full object-cover cursor-pointer"
                                    onClick={() => setLightboxImage(image)}
                                  />
                                  {isEditing && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); const rolesSection = editSections.find(s => s.type === 'roles'); if (rolesSection) { const sectionIndex = editSections.indexOf(rolesSection); const roles = rolesSection.roles || []; const updatedRoles = roles.map((r: any, i: number) => i === activeRoleTab ? { ...r, images: r.images.filter((_: string, j: number) => j !== imgIndex) } : r); updateSection(sectionIndex, { roles: updatedRoles }); } }}
                                      className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </SwiperSlide>
                              ))}
                            </Swiper>
                            {isEditing && (
                              <div className="rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center mt-6">
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) => updateRole(activeRoleTab, { newImages: [...(section.roles[activeRoleTab].newImages || []), ...Array.from(e.target.files!)] })}
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
                    <h2 className="text-3xl font-heading font-bold tracking-tight mb-12 text-primary text-left">Autenticación</h2>
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7">
                        <div className="flex flex-col items-center">
                          {/* El Switch */}
                          <div className="flex bg-white/10 p-1 rounded-full mb-8 backdrop-blur-md">
                            <button
                              onClick={() => setAuthView('login')}
                              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${authView === 'login' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                              Iniciar Sesión
                            </button>
                            {section.hasRegistration !== false && (
                              <button
                                onClick={() => setAuthView('register')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${authView === 'register' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                              >
                                Registrarse
                              </button>
                            )}
                          </div>

                          {/* El Contenido Animado */}
                          <div className="w-full max-w-4xl h-[400px] relative overflow-hidden rounded-2xl bg-gray-900 border border-white/10 shadow-2xl shadow-black/50">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={authView}
                                initial={{ x: authView === 'login' ? -50 : 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: authView === 'login' ? 50 : -50, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                              >
                                {/* Lógica para mostrar imagen 0 si es login, imagen 1 si es registro */}
                                <img 
                                  src={(section.images || [])[authView === 'login' ? 0 : 1] || '/placeholder.jpg'} 
                                  className="w-full h-full object-cover"
                                />
                                {/* Overlay con texto descriptivo */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                  <h3 className="text-2xl font-bold text-white mb-2">
                                    {authView === 'login' ? 'Acceso Seguro' : 'Registro de Usuarios'}
                                  </h3>
                                  <p className="text-gray-300">
                                    {authView === 'login' 
                                      ? 'Autenticación mediante credenciales encriptadas o proveedores sociales (OAuth).' 
                                      : 'Formulario de registro con validación en tiempo real y verificación de correo.'}
                                  </p>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      <div className="lg:col-span-5 prose prose-invert prose-lg">
                        {isEditing ? (
                          <textarea
                            value={section.text || ''}
                            onChange={(e) => updateSection(index, { text: e.target.value })}
                            className={`w-full px-4 py-3 ${theme === 'dark' ? 'bg-[#0f1419] text-white' : 'bg-white text-gray-900'} border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 text-lg leading-relaxed`}
                            rows={6}
                            placeholder="Describe las características de autenticación y seguridad..."
                          ></textarea>
                        ) : (
                          <TextReveal text={section.text} />
                        )}

                        {isEditing && (
                          <div className="mt-4 space-y-2">
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={section.enabled !== false} onChange={(e) => updateSection(index, { enabled: e.target.checked })} />
                              <span className="text-gray-300">Habilitada</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="checkbox" checked={section.hasRegistration !== false} onChange={(e) => updateSection(index, { hasRegistration: e.target.checked })} />
                              <span className="text-gray-300">Tiene Registro</span>
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

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}