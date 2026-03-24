'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  status: 'completed' | 'in-progress';
  created_at: string;
  images?: { image: string }[];
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('Todos');
  const { t } = useLanguage();

  const filters = ['Todos', 'WordPress', 'React', 'Node.js'];

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projectsData } = await supabase
        .from('portfolio_project')
        .select(`*, images:portfolio_projectimage(image)`)
        .order('created_at', { ascending: false });
      
      setProjects(projectsData || []);
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'Todos') return true;
    return Array.isArray(project.technologies) && project.technologies.some(tech => 
      tech.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6">
              Proyectos Destacados
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Explora mi colección de proyectos que demuestran mis habilidades en desarrollo web moderno,
              desde aplicaciones full-stack hasta soluciones e-commerce personalizadas.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-transparent border border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
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
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-4">¿Quieres ver más proyectos?</p>
            <a
              href="https://github.com/MP-make"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-slate-200 font-bold"
            >
              <Github size={20} />Visita mi GitHub<ExternalLink size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}