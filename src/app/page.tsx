'use client';

import Link from 'next/link';
import { ExternalLink, Github, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroImage {
  id: number;
  image: string;
  title?: string;
  order: number;
}

interface HeroSectionProps {
  t: any;
  theme: string;
  currentSlide: number;
  heroImages: HeroImage[];
  isImageOnLeft: boolean;
}

export default function HeroSection({ t, theme, currentSlide, heroImages, isImageOnLeft }: HeroSectionProps) {
  return (
    <section id="home" className="relative flex items-center justify-center mx-auto z-10 px-6 py-20 lg:py-32 w-full max-w-7xl">
      
      {/* ================= ELEMENTOS DE FONDO ================= */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        
        {/* Floating Code Lines - Izquierda (OPACIDAD AUMENTADA A /50) */}
        <div className="hidden lg:block absolute top-10 left-0 text-cyan-400/50 font-mono text-xs md:text-sm animate-pulse">
          {`const developer = {`}
        </div>
        <div className="hidden lg:block absolute top-20 left-4 text-cyan-400/50 font-mono text-xs md:text-sm animate-pulse delay-1000">
          {`  name: 'Marlon Pecho',`}
        </div>
        <div className="hidden lg:block absolute top-32 left-4 text-cyan-400/50 font-mono text-xs md:text-sm animate-pulse delay-2000">
          {`  skills: ['React', 'Next.js', 'PostgreSQL']`}
        </div>
        <div className="hidden lg:block absolute top-44 left-0 text-cyan-400/50 font-mono text-xs md:text-sm animate-pulse delay-3000">
          {`};`}
        </div>

        {/* Right Side Code - Derecha (OPACIDAD AUMENTADA A /50) */}
        <div className="hidden lg:block absolute top-20 right-0 text-cyan-400/50 font-mono text-xs md:text-sm animate-pulse delay-1500 text-right">
          {`function buildIdeas() {`}
        </div>
        <div className="hidden lg:block absolute top-32 right-4 text-cyan-400/50 font-mono text-xs md:text-sm animate-pulse delay-2500 text-right">
          {`  return 'digital solutions';`}
        </div>
        <div className="hidden lg:block absolute top-44 right-0 text-cyan-400/50 font-mono text-xs md:text-sm animate-pulse delay-3500 text-right">
          {`}`}
        </div>

        {/* Formas Geométricas (OPACIDAD AUMENTADA) */}
        <motion.div 
          className="hidden md:block absolute top-1/4 left-10 w-24 h-24 border border-cyan-400/40 rounded-lg"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="hidden md:block absolute bottom-1/4 right-10 w-32 h-32 border border-emerald-400/30 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] h-[500px] bg-cyan-900/20 blur-[120px] rounded-full" />
      </div>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center w-full relative z-10">
        
        {/* Left Side - Text Content */}
        <motion.div 
          className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
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
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
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
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-4 tracking-tighter leading-tight"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Marlon Pecho
          </motion.h1>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6 font-mono opacity-90">
            &gt; Full-Stack Developer_
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-light">
            {t?.hero?.slides?.[0]?.subtitle || "Donde las ideas complejas cobran vida a través de código limpio, arquitecturas escalables y experiencias digitales inmersivas."}
          </p>

          {/* Botones - Más compactos y estilizados */}
          <motion.div 
            className="flex flex-wrap justify-center lg:justify-start gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-full hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 hover:-translate-y-1 text-sm md:text-base"
            >
              {t?.hero?.connect || 'Conectemos'}
              <ExternalLink size={16} />
            </Link>
            
            <a
              href="/cv-marlon-pecho.pdf"
              download
              className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300 px-6 py-2.5 rounded-full hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 text-sm md:text-base"
            >
              Descargar CV
              <Download size={16} />
            </a>
            
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-slate-700 text-slate-300 px-6 py-2.5 rounded-full hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 text-sm md:text-base"
            >
              {t?.hero?.viewProjects || 'Ver Proyectos'}
              <Github size={16} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side - Profile Image */}
        <motion.div 
          className="flex justify-center lg:justify-end order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative group w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]">
            
            {/* Outer Glow Ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-emerald-500/30 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Inner Hexagonal/Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-slate-800 to-emerald-400 rounded-full p-1 shadow-2xl">
              <div className="bg-[#0f1419] w-full h-full rounded-full p-1 relative overflow-hidden">
                
                {/* Contenedor de la Imagen */}
                <div className="w-full h-full bg-slate-800 rounded-full overflow-hidden relative">
                  
                  {/* IMAGEN DE PERFIL REPOSICIONADA */}
                  <img 
                    src="/principalmarlonpecho.webp" 
                    alt="Marlon Pecho" 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Overlay Oscuro para Integrar */}
                  <div className="absolute inset-0 bg-slate-950/40 transition-colors duration-500 group-hover:bg-slate-950/10 pointer-events-none" />

                  {/* Overlay Tint Effect */}
                  <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
                </div>

              </div>
            </div>
            
            {/* Floating Tech Badges */}
            <motion.div 
              className="absolute top-4 -right-2 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] z-20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-cyan-400 text-xs font-bold font-mono">JS</span>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-10 -left-4 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] z-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <span className="text-emerald-400 text-xs font-bold font-mono">TS</span>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}