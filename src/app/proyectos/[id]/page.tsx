import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { ExternalLink, Github, ArrowLeft, Code, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

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
  is_full_page: boolean;
  content_structure?: any;
  images?: { image: string }[];
}

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return;

      const { data: projectData } = await supabase
        .from('portfolio_project')
        .select(`*, images:portfolio_projectimage(image)`)
        .eq('id', params.id)
        .single();

      setProject(projectData);
      setLoading(false);
    };
    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400">Cargando...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-200 mb-4">Proyecto no encontrado</h1>
          <Link href="/proyectos" className="text-cyan-400 hover:text-slate-200">
            ← Volver a Proyectos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a Proyectos
          </Link>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-4 md:mb-0">
                {project.title}
              </h1>
              <div className={`${project.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'} text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-full border w-fit`}>
                {project.status === 'completed' ? <><CheckCircle size={16} />Completado</> : <><Clock size={16} />En Progreso</>}
              </div>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <div className="rounded-2xl overflow-hidden">
                <Carousel images={project.images.map(img => img.image)} />
              </div>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Code size={24} className="text-cyan-400" />
              Tecnologías Utilizadas
            </h2>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(project.technologies) && project.technologies.map((tech, i) => (
                <span key={i} className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Full Page Content */}
          {project.is_full_page && project.content_structure && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-200 mb-6">Detalles del Proyecto</h2>
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-8">
                {/* Render content_structure here - assuming it's HTML or JSON */}
                <div dangerouslySetInnerHTML={{ __html: project.content_structure }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {(project.demo_link || project.link) && (
              <a
                href={project.demo_link || project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-400 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:scale-105"
              >
                <ExternalLink size={20} />Ver Demo en Vivo
              </a>
            )}
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:border-cyan-400"
              >
                <Github size={20} />Ver Código en GitHub
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}