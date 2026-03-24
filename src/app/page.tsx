'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroSection from '@/components/HeroSection';
import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

interface HeroImage {
  id: number;
  image: string;
  title?: string;
  order: number;
}

interface Project {
  id: number;
  title: string;
  short_description: string;
  technologies: string[];
  images?: { image: string }[];
}

export default function Home() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data: heroData } = await supabase
        .from('portfolio_heroimage')
        .select('*')
        .order('order', { ascending: true });
      
      setHeroImages(heroData || []);
    };
    fetchHeroImages();
  }, []);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const { data: projectsData } = await supabase
        .from('portfolio_project')
        .select(`*, images:portfolio_projectimage(image)`)
        .limit(3);
      
      setFeaturedProjects(projectsData || []);
    };
    fetchFeaturedProjects();
  }, []);

  useEffect(() => {
    const maxSlides = Math.max(t.hero.slides.length, heroImages.length);
    if (maxSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [t.hero.slides.length, heroImages.length]);

  // Datos estáticos temporales para proyectos destacados
  const staticProjects: Project[] = [
    {
      id: 1,
      title: 'Ventify',
      short_description: 'Plataforma de ventas que incrementó las ventas de pymes en un 70%. Tecnologías: React, Firebase, Stripe.',
      technologies: ['React', 'Firebase', 'Stripe'],
      images: [{ image: '/static/images/V-1.png' }]
    },
    {
      id: 2,
      title: 'Inmobiliaria Pecho',
      short_description: 'Sistema de gestión inmobiliaria con panel administrativo completo. Tecnologías: Next.js, PostgreSQL, Tailwind.',
      technologies: ['Next.js', 'PostgreSQL', 'Tailwind CSS'],
      images: [{ image: '/static/images/V-2.png' }]
    }
  ];

  const displayProjects = featuredProjects.length > 0 ? featuredProjects.slice(0, 2) : staticProjects;

  return (
    <div className="min-h-screen bg-slate-950">
      <HeroSection
        t={t}
        theme="dark"
        currentSlide={currentSlide}
        heroImages={heroImages}
        isImageOnLeft={false}
      />

      {/* Sección Destacados */}
      <motion.section 
        className="py-20 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-200 mb-4">
              Destacados
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Una selección de mi trabajo
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {displayProjects.map((project) => (
              <motion.div 
                key={project.id} 
                className="group bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="aspect-video overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img 
                      src={project.images[0].image} 
                      alt={project.title} 
                      className="w-full h-full object-cover brightness-110 group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <ExternalLink size={48} className="text-slate-600" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {project.short_description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs px-3 py-1 rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-slate-200 font-bold text-lg transition-colors"
            >
              Ver Todos los Proyectos <ExternalLink size={20} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Sección Testimonio */}
      <motion.section 
        className="py-20 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-200">
              Lo Que Dicen de Mí
            </h2>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-cyan-400 fill-cyan-400" />
              ))}
            </div>
            <blockquote className="text-lg text-slate-300 leading-relaxed text-center mb-6">
              "Destacamos el profesionalismo, compromiso y capacidad técnica de Marlon Pecho. Como desarrollador principal de Ventify, logró implementar un sistema que nos ayudó a incrementar nuestras ventas en un 97%, asegurando el orden y control de nuestro inventario. Recomendamos ampliamente a Marlon como un aliado estratégico, innovador y eficaz."
            </blockquote>
            <cite className="text-cyan-400 font-semibold text-center block">
              — René Forest Minaya Isidro (Gerente de Producción)
            </cite>
          </div>
        </div>
      </motion.section>

      {/* Sección Call to Action */}
      <motion.section 
        className="py-20 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-200 mb-6">
            ¿Listo para colaborar?
          </h2>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Estoy disponible para proyectos freelance, colaboraciones y oportunidades laborales. Hablemos sobre cómo puedo ayudarte a llevar tu idea al siguiente nivel.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-cyan-500 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-cyan-400 hover:shadow-lg hover:scale-105"
          >
            Hablemos
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
