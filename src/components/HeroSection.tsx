import Link from 'next/link';
import { ExternalLink, Github, Download } from 'lucide-react';

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
    <section id="home" className="min-h-[80vh] flex flex-col items-center justify-center text-center mx-auto relative z-10 px-6">
      {/* Name with Glow Effect */}
      <h1 className="text-5xl md:text-7xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] mb-6">
        Marlon
      </h1>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-4">
        Full-Stack Developer
      </h2>

      {/* Description */}
      <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
        {t.hero.slides[0]?.subtitle || "Estudiante de Ingeniería de Sistemas Avanzados especializado en desarrollo web moderno."}
      </p>

      {/* Availability Badge */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-cyan-500/50 transition-all duration-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
          </span>
          <span className="text-sm font-medium text-cyan-400">{t.hero.available}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/contacto"
          className="bg-cyan-400 text-slate-950 font-semibold px-8 py-4 rounded-full hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-105 flex items-center gap-3"
        >
          {t.hero.connect}
          <ExternalLink size={20} />
        </Link>
        <a
          href="/cv-marlon-pecho.pdf"
          download
          className="bg-transparent border border-slate-700 text-slate-300 px-8 py-4 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-3"
        >
          Descargar CV
          <Download size={20} />
        </a>
        <Link
          href="/proyectos"
          className="bg-transparent border border-slate-700 text-slate-300 px-8 py-4 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-3"
        >
          {t.hero.viewProjects}
          <Github size={20} />
        </Link>
      </div>
    </section>
  );
}