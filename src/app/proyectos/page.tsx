'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
// Navbar importado (asumiendo que lo tienes configurado)
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
          
          if (isAVentify && !isBVentify) return -1; // Mueve A arriba
          if (!isAVentify && isBVentify) return 1;  // Mueve B arriba
          return 0; // Mantiene el orden original para los demás
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Función para corregir status si es necesario
  const getStatus = (project: Project) => {
    if (project.title.toLowerCase().includes('ventify')) return 'completed';
    return project.status;
  };

  return (
    <div className="min-h-screen bg-[#050B14] relative font-sans text-slate-200 selection:bg-cyan-500/30">
      
      {/* ================= ELEMENTOS DE FONDO INNOVADORES ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Resplandor superior izquierdo (Cyan) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/20 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Resplandor inferior derecho (Emerald) */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-900/10 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Patrón de Grid sutil para dar textura */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] bg-repeat"></div>
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
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-md">
            Proyectos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Destacados</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
            Explora mi colección de trabajos. Desde arquitecturas de backend escalables hasta interfaces frontend inmersivas. Soluciones reales para problemas complejos.
          </motion.p>
        </motion.div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
             <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
        )}

        {/* GRID DE PROYECTOS (BENTO STYLE) */}
        {!isLoading && projects.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[minmax(380px,auto)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project, index) => {
              // El primer proyecto (Ventify) será SIEMPRE el "Hero Project" ocupando todo el ancho superior
              const isHeroProject = index === 0; 
              
              return (
                <motion.article 
                  key={project.id} 
                  variants={itemVariants}
                  // Si es el Hero Project, ocupa 100% del ancho en pantallas grandes. Si no, ocupa 1 columna normal.
                  className={`group relative rounded-[2rem] overflow-hidden bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_10px_40px_rgba(34,211,238,0.15)] hover:-translate-y-1 ${isHeroProject ? 'md:col-span-2 lg:col-span-3 min-h-[500px]' : 'col-span-1'}`}
                >
                  
                  {/* IMAGEN DE FONDO (Overlay Style) */}
                  {project.images?.[0]?.image ? (
                    <>
                      <img 
                        src={project.images[0].image} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      />
                      {/* Gradiente dramático: Negro fuerte abajo para leer el texto, casi transparente arriba */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-[#050B14] ${isHeroProject ? 'via-[#050B14]/70' : 'via-[#050B14]/80'} to-transparent transition-opacity duration-500`}></div>
                      
                      {/* Tinte de color suave para integrar la imagen con el diseño general */}
                      <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay opacity-50 group-hover:opacity-0 transition-opacity duration-500"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-[#050B14] flex items-center justify-center">
                      <Code2 size={64} className="text-white/5" />
                    </div>
                  )}

                  {/* CONTENIDO DE LA TARJETA */}
                  <div className={`relative h-full flex flex-col justify-end z-10 ${isHeroProject ? 'p-10 md:p-14 lg:w-2/3' : 'p-8'}`}>
                    
                    {/* Header de la tarjeta */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        {isHeroProject && (
                          <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            <Star size={12} className="fill-amber-300" /> Top Project
                          </span>
                        )}
                        {getStatus(project) === 'completed' ? (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            Completado
                          </span>
                        ) : (
                           <span className="bg-blue-500/20 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            En Progreso
                          </span>
                        )}
                      </div>

                      {/* Links Rápidos (Esquina superior derecha) */}
                      <div className={`flex gap-3 transition-all duration-300 ${isHeroProject ? 'opacity-100' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                         {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-20">
                            <Github size={18} />
                          </a>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-20">
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Textos */}
                    <h3 className={`font-extrabold text-white mb-4 tracking-tight group-hover:text-cyan-400 transition-colors drop-shadow-md ${isHeroProject ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl'}`}>
                      {project.title}
                    </h3>
                    
                    <p className={`text-slate-300 font-light leading-relaxed mb-8 drop-shadow-md ${isHeroProject ? 'text-lg md:text-xl line-clamp-4' : 'text-base line-clamp-3'}`}>
                      {project.description}
                    </p>

                    {/* Tecnologías */}
                    <div className="flex flex-wrap gap-2 mt-auto relative z-20">
                      {Array.isArray(project.technologies) && project.technologies.slice(0, isHeroProject ? 8 : 4).map((tech, i) => (
                        <span key={i} className="bg-slate-900/80 backdrop-blur-md border border-white/10 text-cyan-50 px-3 py-1.5 rounded-lg text-xs font-mono font-medium group-hover:border-cyan-500/30 transition-colors">
                          {tech}
                        </span>
                      ))}
                      {Array.isArray(project.technologies) && project.technologies.length > (isHeroProject ? 8 : 4) && (
                        <span className="text-slate-400 text-xs font-mono py-1.5 px-2">+{project.technologies.length - (isHeroProject ? 8 : 4)}</span>
                      )}
                    </div>
                    
                    {/* Enlace invisible sobre toda la tarjeta (excepto botones superiores) */}
                    <Link
                      href={`/proyectos/${project.id}`}
                      className="absolute inset-0 z-0"
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
          <p className="text-slate-400 text-lg mb-6 font-light">¿Quieres explorar el código detrás de la magia?</p>
          <a
            href="https://github.com/MP-make"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 text-slate-200 transition-all duration-300"
          >
            <Github size={20} className="group-hover:text-cyan-400 transition-colors" />
            <span className="font-bold tracking-wide">Visita mi GitHub</span>
            <ExternalLink size={16} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </a>
        </motion.div>

      </main>
    </div>
  );
}
