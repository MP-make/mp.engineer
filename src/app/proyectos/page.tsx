'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Github, Code2, Rocket, Star, Briefcase, User } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  github_link?: string;
  technologies: string[];
  status: 'COMPLETADO' | 'EN DESARROLLO';
  project_type: 'personal' | 'company';
  company?: string;
  created_at: string;
  images?: { image: string }[];
  featured?: boolean;
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'company' | 'personal'>('personal');
  const { t } = useLanguage();

  useEffect(() => {
    let ignore = false;
    const fetchProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('portfolio_project')
        .select('*, images:portfolio_projectimage(image)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else if (data && !ignore) {
        const sorted = [...data].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setProjects(sorted);
      }
      setIsLoading(false);
    };
    fetchProjects();

    const onFocus = () => { fetchProjects(); };
    window.addEventListener('focus', onFocus);
    return () => {
      ignore = true;
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const personalProjects = projects.filter(p => p.project_type === 'personal' || !p.project_type);
  const companyProjects = projects.filter(p => p.project_type === 'company');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const getStatus = (project: Project) => project.status;

  const renderProjectCard = (project: Project, index: number, isHero: boolean) => (
    <motion.article
      key={project.id}
      variants={itemVariants}
      className={`group relative rounded-[1.5rem] overflow-hidden bg-card-bg border border-border-subtle hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] hover:-translate-y-1 ${isHero ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}`}
    >
      {project.images?.[0]?.image ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={project.images[0].image}
            alt={project.title}
            className="w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-50 group-hover:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-card-bg/40 to-surface flex items-center justify-center">
          <Code2 size={48} className="text-white/5" />
        </div>
      )}

      <div className={`relative h-full flex flex-col justify-end z-10 p-8 ${isHero ? 'md:p-10' : ''}`}>
        <div className="flex justify-between items-start mb-auto pb-8">
          <div className="flex flex-wrap items-center gap-3">
            {isHero && (
              <span className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                <Star size={12} className="fill-cyan-400" /> Destacado
              </span>
            )}
            {getStatus(project) === 'COMPLETADO' ? (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                {t.projects.completed}
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                {t.projects.inProgress}
              </span>
            )}
            {project.company && (
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                {project.company}
              </span>
            )}
          </div>

          <div className={`flex gap-2 transition-all duration-300 ${isHero ? 'opacity-100' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-tag-bg border border-border-color backdrop-blur-md flex items-center justify-center text-text-muted hover:bg-primary-dim hover:text-cyan-400 transition-all z-20">
                <Github size={16} />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-tag-bg border border-border-color backdrop-blur-md flex items-center justify-center text-text-muted hover:bg-primary-dim hover:text-cyan-400 transition-all z-20">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        <h3 className={`font-bold text-text-primary mb-3 tracking-tight group-hover:text-cyan-400 transition-colors ${isHero ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
          {project.title}
        </h3>

        <p className={`text-text-muted font-light leading-relaxed mb-6 ${isHero ? 'text-base line-clamp-3 max-w-xl' : 'text-sm line-clamp-3'}`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 relative z-20">
          {Array.isArray(project.technologies) && project.technologies.slice(0, isHero ? 6 : 3).map((tech, i) => (
            <span key={i} className="bg-tag-bg backdrop-blur-md border border-border-subtle text-text-secondary px-2.5 py-1 rounded text-[11px] font-mono tracking-wide group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">
              {tech}
            </span>
          ))}
          {Array.isArray(project.technologies) && project.technologies.length > (isHero ? 6 : 3) && (
            <span className="text-slate-500 text-[11px] font-mono py-1 px-1">+{project.technologies.length - (isHero ? 6 : 3)}</span>
          )}
        </div>

        <Link
          href={`/proyectos/${project.id}`}
          className="absolute inset-0 z-0 cursor-pointer"
          aria-label={`Ver detalles de ${project.title}`}
        >
          <span className="sr-only">Ver detalles</span>
        </Link>
      </div>
    </motion.article>
  );

  const renderGrid = (items: Project[]) => {
    const featuredIndex = items.findIndex(p => p.featured);
    const heroIdx = featuredIndex >= 0 ? featuredIndex : 0;
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(400px,auto)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((project, index) => renderProjectCard(project, index, items.length > 1 && index === heroIdx))}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative font-sans text-text-secondary selection:bg-cyan-500/30 bg-surface">

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tech-dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#22d3ee" opacity="0.5"/>
                <path d="M 2 2 L 50 50" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#tech-dots)" />
          </svg>
        </div>
        <div className="absolute bottom-[-20%] right-[10%] w-[50vw] h-[50vw] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">

        <motion.div
          className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex-1 z-10" variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Rocket size={14} /> Portafolio
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-8 leading-tight">
              <span className="gradient-title drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                {t.projects.title}<br/>Destacados
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-light max-w-xl">
              {t.projects.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex-1 w-full relative group"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
              <img
                src="/setupweb.webp"
                alt="Mi entorno de desarrollo"
                className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(10,15,24,1)] pointer-events-none"></div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border border-cyan-500/30 rounded-full animate-[spin_8s_linear_infinite] pointer-events-none"></div>
            <div className="absolute top-[10%] -right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] animate-pulse"></div>
          </motion.div>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && projects.length > 0 && (
          <>
            {/* Tabs - Capsule Segmented Control */}
            <div className="flex items-center justify-center mb-14">
              <div className="relative flex p-1 rounded-full bg-card-bg/60 border border-border-color shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] w-full max-w-md mx-auto">
                <div
                  className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    left: activeTab === 'personal' ? '4px' : 'calc(50% + 2px)',
                    width: 'calc(50% - 6px)'
                  }}
                />
                <button
                  onClick={() => setActiveTab('personal')}
                  className="relative z-10 flex-1 flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300"
                >
                  <User size={22} className="hidden sm:block" />
                  <span className={activeTab === 'personal' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}>
                    {t.projects.personal}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-mono px-1.5 py-0.5 rounded-full ${
                    activeTab === 'personal' ? 'bg-white/15 text-text-primary' : 'bg-hover-bg text-text-muted'
                  }`}>
                    {personalProjects.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('company')}
                  className="relative z-10 flex-1 flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300"
                >
                  <Briefcase size={22} className="hidden sm:block" />
                  <span className={activeTab === 'company' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}>
                    {t.projects.company}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-mono px-1.5 py-0.5 rounded-full ${
                    activeTab === 'company' ? 'bg-white/15 text-text-primary' : 'bg-hover-bg text-text-muted'
                  }`}>
                    {companyProjects.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Sliding container */}
            <div className="overflow-hidden rounded-2xl">
              <motion.div
                className="flex"
                style={{ width: '200%' }}
                animate={{ x: activeTab === 'personal' ? '0%' : '-50%' }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Personal panel */}
                <div className="w-1/2 pr-3">
                  {personalProjects.length > 0 ? (
                    renderGrid(personalProjects)
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                      <User size={48} className="mb-4 opacity-30" />
                      <p className="text-lg font-light">No hay proyectos personales aún.</p>
                    </div>
                  )}
                </div>

                {/* Company panel */}
                <div className="w-1/2 pl-3">
                  {companyProjects.length > 0 ? (
                    renderGrid(companyProjects)
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                      <Briefcase size={48} className="mb-4 opacity-30" />
                      <p className="text-lg font-light">No hay proyectos de empresa aún.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}

        {!isLoading && projects.length === 0 && (
          <p className="text-center text-slate-500 py-20">No hay proyectos disponibles.</p>
        )}

        <motion.div
          className="mt-20 text-center border-t border-border-subtle pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-text-muted text-sm mb-6 font-light">{t.projects.viewMore}</p>
          <a
            href="https://github.com/MP-make"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-tag-bg border border-border-subtle hover:bg-primary-dim hover:border-cyan-500/30 text-text-secondary transition-all duration-300"
          >
            <Github size={18} className="group-hover:text-cyan-400 transition-colors" />
            <span className="font-semibold text-sm tracking-wide group-hover:text-white transition-colors">{t.projects.visitGithub}</span>
          </a>
        </motion.div>

      </main>
    </div>
  );
}
