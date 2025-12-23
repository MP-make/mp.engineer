'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, ExternalLink, Github, Code, Database, Smartphone, Users, Shield } from 'lucide-react';
import Link from 'next/link';
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

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

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

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar />
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
        <Navbar />
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
    // Render standard project page
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 font-medium">
              <ArrowLeft size={20} />
              Volver al inicio
            </Link>

            <div className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-primary/20' : 'border-gray-200'} shadow-2xl mb-8`}>
              {project.images && project.images.length > 0 && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={project.images[0].image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {project.title}
                  </h1>
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    project.status === 'completed'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {project.status === 'completed' ? 'Completado' : 'En Progreso'}
                  </div>
                </div>

                <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {project.description}
                </p>

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Tecnologías
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {(project.link || project.github_link) && (
                  <div className="flex gap-3">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                      >
                        <ExternalLink size={18} />
                        Ver Proyecto
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-6 py-3 rounded-xl hover:bg-primary/20 transition-all"
                      >
                        <Github size={18} />
                        Ver Código
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render full-page project with sections
  const sections = project.content_structure.sections;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      {/* Header */}
      <div className={`border-b ${theme === 'dark' ? 'border-primary/20 bg-[#0f1419]' : 'border-gray-200 bg-white'} py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary mb-8 font-medium">
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>

          <div className="text-center">
            <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {project.title}
            </h1>
            <p className={`text-xl mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {project.technologies.map((tech, i) => (
                <span key={i} className="bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-full text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
            {(project.link || project.github_link) && (
              <div className="flex gap-4 justify-center">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <ExternalLink size={20} />
                    Ver Proyecto
                  </a>
                )}
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/30 px-8 py-4 rounded-xl hover:bg-primary/20 transition-all"
                  >
                    <Github size={20} />
                    Ver Código
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="py-16">
        {sections.map((section: any, index: number) => {
          switch (section.type) {
            case 'landing':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Sección Landing
                        </h2>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                          {section.text}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {section.images?.map((image: string, imgIndex: number) => (
                          <div key={imgIndex} className="aspect-square rounded-xl overflow-hidden">
                            <img
                              src={image}
                              alt={`Landing ${imgIndex + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'paneles':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Sección Paneles
                      </h2>
                      <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                        {section.text}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                      {section.images?.map((image: string, imgIndex: number) => (
                        <div key={imgIndex} className="aspect-video rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={image}
                            alt={`Panel ${imgIndex + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'roles':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Sección Roles
                      </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {section.roles?.map((role: any, roleIndex: number) => (
                        <div key={roleIndex} className={`p-6 rounded-2xl border ${theme === 'dark' ? 'border-primary/20 bg-[#0f1419]' : 'border-gray-200 bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Users size={24} className="text-primary" />
                            </div>
                            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {role.name}
                            </h3>
                          </div>
                          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {role.description}
                          </p>
                          {role.images && role.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {role.images.map((image: string, imgIndex: number) => (
                                <div key={imgIndex} className="aspect-square rounded-lg overflow-hidden">
                                  <img
                                    src={image}
                                    alt={`${role.name} ${imgIndex + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'auth':
              return (
                <section key={index} className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
                  <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Sección Auth
                        </h2>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                          {section.text}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {section.images?.map((image: string, imgIndex: number) => (
                          <div key={imgIndex} className="aspect-square rounded-xl overflow-hidden">
                            <img
                              src={image}
                              alt={`Auth ${imgIndex + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
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
    </div>
  );
}