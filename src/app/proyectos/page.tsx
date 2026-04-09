'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
// Navbar importado
import Navbar from '@/components/Navbar'; 
import { ExternalLink, Github, Code2, Rocket, Star } from 'lucide-react';

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

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('portfolio_project')
        .select('*, images:portfolio_projectimage(image)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else if (data) {
        // LÓGICA CLAVE: Forzar a Ventify a ser el primero
        const sortedProjects = [...data].sort((a, b) => {
          const isAVentify = a.title.toLowerCase().includes('ventify');
          const isBVentify = b.title.toLowerCase().includes('ventify');
          
          if (isAVentify && !isBVentify) return -1;
          if (!isAVentify && isBVentify) return 1; 
          return 0; 
        });
        
        setProjects(sortedProjects);
      }
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const getStatus = (project: Project) => {
    if (project.title.toLowerCase().includes('ventify')) return 'completed';
    return project.status;
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-200 selection:bg-cyan-500/30 bg-[#050B14]">
      
      {/* ================= ELEMENTOS DE FONDO TECNOLÓGICOS ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glow Principal (Cyan) más intenso pero concentrado */}
        <div className="absolute top-[0%] left-[10%] w-[40vw] h-[40vw] bg-cyan-500/10 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Constelación / Nodos de fondo (Simulado con SVG para estética Tech) */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tech-dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#22d3ee" opacity="0.5"/>
                <path d="M 2 2 L 60 60" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#tech-dots)" />
          </svg>
        </div>

        {/* Resplandor inferior (Azul profundo) */}
        <div className="absolute bottom-[-20%] right-[10%] w-[50vw] h-[50vw] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          className="max-w-3xl mb-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <Rocket size={14} /> Portfolio
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Destacados</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-300/90 leading-relaxed font-light">
            Explora mi colección de trabajos. Desde arquitecturas de backend escalables hasta interfaces frontend inmersivas. Soluciones reales para problemas complejos.
          </motion.p>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
             <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        )}

        {/* GRID DE PROYECTOS (BENTO STYLE MEJORADO) */}
        {!isLoading && projects.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(400px,auto)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project, index) => {
              // Ventify siempre será isHeroProject
              const isHeroProject = index === 0; 
              
              return (
                <motion.article 
                  key={project.id} 
                  variants={itemVariants}
                  // AJUSTE CLAVE: lg:col-span-2 (Ocupa 2 de las 3 columnas, no todo el ancho)
                  className={`group relative rounded-[1.5rem] overflow-hidden bg-[#0a1017] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(34,211,238,0.1)] hover:-translate-y-1.5 ${isHeroProject ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}`}
                >
                  
                  {/* IMAGEN DE FONDO */}
                  {project.images?.[0]?.image ? (
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <img 
                        src={project.images[0].image} 
                        alt={project.title} 
                        className="w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-40 group-hover:opacity-60 mix-blend-luminosity"
                      />
                      
                      {/* Gradiente para Legibilidad (Más oscuro abajo, fundido arriba) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/80 to-transparent"></div>
                      
                      {/* Tinte general para mantener la estética Tech oscura */}
                      <div className="absolute inset-0 bg-[#0a1017]/40 mix-blend-multiply"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-[#050B14] flex items-center justify-center">
                      <Code2 size={48} className="text-white/5" />
                    </div>
                  )}

                  {/* CONTENIDO DE LA TARJETA */}
                  <div className={`relative h-full flex flex-col justify-end z-10 p-8 ${isHeroProject ? 'md:p-12' : ''}`}>
                    
                    {/* Header de la tarjeta (Badges) */}
                    <div className="flex justify-between items-start mb-auto pb-8">
                      <div className="flex flex-wrap items-center gap-3">
                        {isHeroProject && (
                          <span className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                            <Star size={12} className="fill-cyan-400 text-cyan-400" /> Destacado
                          </span>
                        )}
                        {getStatus(project) === 'completed' ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                            Completado
                          </span>
                        ) : (
                           <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                            En Progreso
                          </span>
                        )}
                      </div>

                      {/* Links Rápidos */}
                      <div className={`flex gap-2 transition-all duration-300 ${isHeroProject ? 'opacity-100' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                         {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all z-20">
                            <Github size={16} />
                          </a>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all z-20">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Textos */}
                    <h3 className={`font-bold text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors drop-shadow-lg ${isHeroProject ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
                      {project.title}
                    </h3>
                    
                    <p className={`text-slate-400 font-light leading-relaxed mb-6 drop-shadow-md ${isHeroProject ? 'text-lg line-clamp-3 max-w-xl' : 'text-sm line-clamp-3'}`}>
                      {project.description}
                    </p>

                    {/* Tecnologías */}
                    <div className="flex flex-wrap gap-2 relative z-20">
                      {Array.isArray(project.technologies) && project.technologies.slice(0, isHeroProject ? 6 : 3).map((tech, i) => (
                        <span key={i} className="bg-[#050B14]/80 backdrop-blur-md border border-white/5 text-cyan-200/80 px-2.5 py-1 rounded text-[11px] font-mono tracking-wide group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">
                          {tech}
                        </span>
                      ))}
                      {Array.isArray(project.technologies) && project.technologies.length > (isHeroProject ? 6 : 3) && (
                        <span className="text-slate-500 text-[11px] font-mono py-1 px-1">+{project.technologies.length - (isHeroProject ? 6 : 3)}</span>
                      )}
                    </div>
                    
                    {/* Enlace invisible */}
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
            })}
          </motion.div>
        )}

        {/* FOOTER */}
        <motion.div 
          className="mt-32 text-center border-t border-white/5 pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 text-sm mb-6 font-light">¿Quieres explorar el código detrás de la magia?</p>
          <a
            href="https://github.com/MP-make"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-slate-300 transition-all duration-300"
          >
            <Github size={18} className="group-hover:text-cyan-400 transition-colors" />
            <span className="font-semibold text-sm tracking-wide group-hover:text-white transition-colors">Visita mi GitHub</span>
          </a>
        </motion.div>

      </main>
    </div>
  );
}