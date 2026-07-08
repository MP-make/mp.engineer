'use client';

import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { ExternalLink, Github, ArrowLeft, Code, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

export interface Project {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  link?: string;
  demo_link?: string;
  github_link?: string;
  technologies: string[];
  status: 'COMPLETADO' | 'EN DESARROLLO';
  created_at: string;
  is_full_page: boolean;
  content_structure?: string | null;
  images?: { image: string }[];
}

interface Props {
  project: Project;
  fromTab?: string;
}

export default function ProjectDetailClient({ project, fromTab }: Props) {
  const backHref = `/proyectos${fromTab ? `?tab=${fromTab}` : ''}`;
  const sanitizedHtml = project.content_structure
    ? DOMPurify.sanitize(project.content_structure)
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-text-muted hover:text-cyan-400 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a Proyectos
          </Link>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-text-secondary mb-4 md:mb-0">
                {project.title}
              </h1>
              <div className={`${project.status === 'COMPLETADO' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'} text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-full border w-fit`}>
                {project.status === 'COMPLETADO' ? <><CheckCircle size={16} />Completado</> : <><Clock size={16} />En Progreso</>}
              </div>
            </div>
            <p className="text-lg text-text-muted leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <div className="rounded-2xl overflow-hidden">
                <Carousel images={project.images.map(img => img.image)} />
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-secondary mb-4 flex items-center gap-2">
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

          {project.is_full_page && sanitizedHtml && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-secondary mb-6">Detalles del Proyecto</h2>
              <div className="bg-card-bg/40 backdrop-blur-md rounded-2xl border border-border-color p-8">
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
              </div>
            </div>
          )}

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
                className="flex-1 flex items-center justify-center gap-2 bg-tag-bg backdrop-blur-md border border-border-color text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:border-cyan-400"
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
