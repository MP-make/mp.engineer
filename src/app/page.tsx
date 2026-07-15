'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import ProjectLoadingOverlay from '@/components/ProjectLoadingOverlay';
import { supabase } from '@/lib/supabase';

interface HeroImage {
  id: number;
  image: string;
  title?: string;
  order: number;
}

interface HeroSectionProps {
  t: any;
  currentSlide: number;
  heroImages: HeroImage[];
  isImageOnLeft: boolean;
}

export default function HeroSection({ t, currentSlide, heroImages, isImageOnLeft }: HeroSectionProps) {
  const phrases = ['Full-Stack Developer_', 'Ingeniero de Sistemas_'];
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cvUrl, setCvUrl] = useState('/cv-marlon-pecho.pdf');

  useEffect(() => {
    const fetchCv = async () => {
      const { data, error } = await supabase
        .from('portfolio_cv')
        .select('url')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (!error && data) {
        setCvUrl(data.url);
      }
    };
    fetchCv();
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setText(
          isDeleting
            ? currentPhrase.slice(0, text.length - 1)
            : currentPhrase.slice(0, text.length + 1)
        );
      }, isDeleting ? 40 : 80);
    }

    return () => clearTimeout(timeout);
  }, [text, phraseIndex, isDeleting, phrases]);

  return (
    <section id="home" className="relative flex items-center justify-center mx-auto z-10 px-6 py-10 lg:py-16 w-full max-w-7xl min-h-screen bg-background">
      
      {/* ================= ELEMENTOS DE FONDO TECNOLÓGICOS (Sobre Mi style) ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <ParticleBackground />
        
        {/* Glow Principal (Cyan) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Resplandor inferior (Azul profundo) */}
        <div className="absolute bottom-[-20%] right-[10%] w-[50vw] h-[50vw] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Constelación / Nodos de fondo */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tech-dots-home" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#22d3ee" opacity="0.5"/>
                <path d="M 2 2 L 50 50" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#tech-dots-home)" />
          </svg>
        </div>
      </div>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center w-full relative z-10">
        
        {/* Left Side - Text Content */}
        <motion.div 
          className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 lg:pl-12 xl:pl-20"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge de Disponibilidad */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-tag-bg backdrop-blur-md border border-border-color shadow-[0_0_20px_rgba(34,211,238,0.05)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-medium text-cyan-300 uppercase tracking-wider">
                {t?.hero?.available || 'Disponible para proyectos'}
              </span>
            </div>
          </motion.div>

          {/* Name with Enhanced Glow Effect */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-4 tracking-tighter leading-tight whitespace-nowrap"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Marlon Pecho
          </motion.h1>

          {/* Title with Typewriter Effect */}
          <h2 className="text-2xl md:text-3xl font-bold text-text-secondary mb-6 font-mono opacity-90 min-h-[2rem]">
            &gt; {text}
          </h2>

          {/* Description */}
          <p className="text-lg text-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-light line-clamp-2">
            {t?.hero?.slides?.[0]?.subtitle || "Donde las ideas complejas cobran vida a través de código limpio, arquitecturas escalables y experiencias digitales inmersivas."}
          </p>

          {/* Botones - Más compactos y estilizados */}
          <motion.div 
            className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-full hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 hover:-translate-y-1 text-sm md:text-base shrink-0"
            >
              {t?.hero?.connect || 'Conectemos'}
              <ExternalLink size={16} />
            </Link>
            
            <a
              href={cvUrl}
              download
              className="inline-flex items-center justify-center gap-2 bg-tag-bg backdrop-blur-sm border border-border-color text-text-secondary px-5 py-2.5 rounded-full hover:border-cyan-500/50 hover:bg-hover-bg transition-all duration-300 hover:-translate-y-1 text-sm md:text-base shrink-0"
            >
              Descargar CV
              <Download size={16} />
            </a>
            
            <ProjectLoadingOverlay t={t} />
          </motion.div>
        </motion.div>

        {/* Right Side - Profile Image */}
        <motion.div 
          className="flex justify-center lg:justify-center order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px]">
            
            {/* Outer Glow Ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-emerald-500/30 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Inner Hexagonal/Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-slate-800 to-emerald-400 rounded-full p-1 shadow-2xl">
              <div className="bg-surface-alt w-full h-full rounded-full p-1 relative overflow-hidden">
                
                {/* Contenedor de la Imagen */}
                <div className="w-full h-full bg-surface rounded-full overflow-hidden relative">
                  
                  {/* IMAGEN DE PERFIL REPOSICIONADA */}
                  <img 
                    src="/principalmarlonpecho.webp" 
                    alt="Marlon Pecho" 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Overlay Oscuro para Integrar */}
                  <div className="absolute inset-0 bg-overlay transition-colors duration-500 group-hover:bg-overlay/30 pointer-events-none" />

                  {/* Overlay Tint Effect */}
                  <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
                </div>

              </div>
            </div>
            
            {/* Floating Tech Badges */}
            <motion.div 
              className="absolute top-4 sm:top-6 -right-3 sm:-right-4 w-10 h-10 sm:w-14 sm:h-14 bg-card-bg rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] z-20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-cyan-400 text-[10px] sm:text-sm font-bold font-mono">JS</span>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-8 sm:bottom-12 -left-4 sm:-left-6 w-10 h-10 sm:w-14 sm:h-14 bg-card-bg rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <span className="text-emerald-400 text-[10px] sm:text-sm font-bold font-mono">TS</span>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}