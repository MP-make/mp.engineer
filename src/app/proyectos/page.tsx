'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { ExternalLink, Github, Code } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  link?: string;
  demo_link?: string;
  github_link?: string;
  technologies: string[];
  tags: string[];
  status: 'completed' | 'in-progress';
  created_at: string;
  images?: { image: string }[];
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('portfolio_project')
        .select(`*, tags, images:portfolio_projectimage(image)`)
        .order('created_at', { ascending: false });
      
      console.log("--- DEBUG DE PROYECTOS ---");
      console.log("Error de Supabase:", error);
      console.log("Total de proyectos recibidos:", data?.length);
      console.log("Muestra de un proyecto:", data?.[0]);
      console.log("--------------------------");
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  const professionalProjects = projects.filter(project => 
    project.tags && Array.isArray(project.tags) && project.tags.some(tag => tag.toUpperCase().includes('CONSIGUEVENTAS'))
  );
  const personalProjects = projects.filter(project => 
    !project.tags || !Array.isArray(project.tags) || !project.tags.some(tag => tag.toUpperCase().includes('CONSIGUEVENTAS'))
  );

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const wordpressIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15l-3.5-9h2.1l2.55 6.9L13.45 8H15.5l-3.5 9h-1.5z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6">
              Proyectos Destacados
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Explora mi colección de proyectos que demuestran mis habilidades en desarrollo web moderno,
              desde aplicaciones full-stack hasta soluciones e-commerce personalizadas.
            </p>
          </motion.div>

          {/* Sección Profesionales */}
          <motion.section 
            className="mb-16"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-200 mb-8 text-center">
              Proyectos Profesionales (Empresa: Consigueventas)
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {professionalProjects.length === 0 ? (
                <p className="text-slate-400 col-span-full text-center">No se encontraron proyectos con estos filtros. Revisa la consola del servidor.</p>
              ) : (
                professionalProjects.map((project) => (
                  <motion.div 
                    key={project.id} 
                    className="group bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-cyan-500/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    variants={cardVariants}
                  >
                    {/* Project Image */}
                    <div className="aspect-video overflow-hidden">
                      {project.images && project.images.length > 0 ? (
                        <img 
                          src={project.images[0].image} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          {wordpressIcon}
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        {wordpressIcon}
                        <span className="text-cyan-400 text-sm font-medium">WordPress</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {project.short_description || project.description.substring(0, 120) + '...'}
                      </p>

                      {/* Technologies */}
                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(project.technologies) && project.technologies.map((tech, i) => (
                            <span key={i} className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs px-3 py-1 rounded-full font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        <Link
                          href={`/proyectos/${project.id}`}
                          className="w-full flex items-center justify-center gap-3 bg-cyan-500 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-cyan-400 hover:shadow-lg"
                        >
                          Ver Detalles
                          {(project.demo_link || project.link) && <ExternalLink size={16} />}
                          {project.github_link && <Github size={16} />}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.section>

          {/* Sección Freelance & Personales */}
          <motion.section 
            className="mb-16"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-200 mb-8 text-center">
              Proyectos Freelance & Personales
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {personalProjects.length === 0 ? (
                <p className="text-slate-400 col-span-full text-center">No se encontraron proyectos con estos filtros. Revisa la consola del servidor.</p>
              ) : (
                personalProjects.map((project) => (
                  <motion.div 
                    key={project.id} 
                    className="group bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                    variants={cardVariants}
                  >
                    {/* Project Image */}
                    <div className="aspect-video overflow-hidden">
                      {project.images && project.images.length > 0 ? (
                        <img 
                          src={project.images[0].image} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <Code size={48} className="text-slate-600" />
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {project.short_description || project.description.substring(0, 120) + '...'}
                      </p>

                      {/* Technologies */}
                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(project.technologies) && project.technologies.map((tech, i) => (
                            <span key={i} className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs px-3 py-1 rounded-full font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        <Link
                          href={`/proyectos/${project.id}`}
                          className="w-full flex items-center justify-center gap-3 bg-cyan-500 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-cyan-400 hover:shadow-lg"
                        >
                          Ver Detalles
                          {(project.demo_link || project.link) && <ExternalLink size={16} />}
                          {project.github_link && <Github size={16} />}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.section>

          {/* Footer */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400 mb-4">¿Quieres ver más proyectos?</p>
            <a
              href="https://github.com/MP-make"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-slate-200 font-bold"
            >
              <Github size={20} />Visita mi GitHub<ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}