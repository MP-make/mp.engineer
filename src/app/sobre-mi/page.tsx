'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Timeline from '@/components/Timeline';
import ParticleBackground from '@/components/ParticleBackground';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Smartphone, Zap, Users, Github, ExternalLink, Terminal } from 'lucide-react';

// Información actualizada: Experiencia & Educación
const timelineEvents = [
  {
    id: '1',
    title: 'Desarrollador Full-Stack',
    subtitle: 'Consigueventas - Agencia de Marketing Digital',
    description: 'Lidero el desarrollo y mantenimiento de ecosistemas web profesionales, desde sitios corporativos hasta e-commerce complejos. Mi enfoque principal es la optimización de performance y la creación de interfaces modernas que impulsan la conversión de clientes. Proyectos clave: pvelectronica.com.pe, effetha.com, consigueventas.com. Stack: Next.js, React, WordPress Avanzado.',
    date: '2025 — Presente',
    type: 'work' as const,
  },
  {
    id: '2',
    title: 'Co-Founder & Desarrollador Principal',
    subtitle: 'Ventify - Plataforma SaaS de Gestión de Ventas',
    description: 'Diseño y mantengo la arquitectura técnica de una solución SaaS que automatiza inventarios y ventas. He logrado que negocios locales incrementen su eficiencia operativa y sus ventas significativamente mediante la digitalización. Impacto: Arquitectura escalable y gestión de flujos de pago integrados. Stack: React, Firebase, Stripe, PostgreSQL.',
    date: '2024 — Presente',
    type: 'work' as const,
  },
  {
    id: '3',
    title: 'Voluntario de Sistemas',
    subtitle: 'Poder Judicial de Ica',
    description: 'Apoyo técnico especializado en el área de sistemas, colaborando en la gestión de infraestructura digital y soporte técnico dentro de la institución para optimizar los procesos judiciales electrónicos. Enfoque: Soporte de sistemas, gestión de redes y software institucional.',
    date: '2025 (Periodo de 6 meses)',
    type: 'work' as const,
  },
  {
    id: '4',
    title: 'Desarrollador Web Freelance',
    subtitle: 'Proyectos Independientes',
    description: 'Cuatro años brindando soluciones digitales a medida para pymes y emprendedores. Especializado en el despliegue rápido de sitios web funcionales, seguros y optimizados para SEO. Experiencia: Más de 10 proyectos entregados con éxito en diversos sectores.',
    date: '2021 — Presente',
    type: 'work' as const,
  },
  {
    id: '5',
    title: 'Ingeniería de Sistemas e Informática',
    subtitle: 'Universidad Tecnológica del Perú (UTP)',
    description: 'Formación técnica sólida con énfasis en ingeniería de software, seguridad de la información y gestión de proyectos tecnológicos en el Perú.',
    date: 'En curso (Ciclo Final)',
    type: 'education' as const,
  },
];

const stats = [
  { icon: Zap, label: 'Años de Experiencia', value: '2' },
  { icon: Globe, label: 'Proyectos Completados', value: '10' },
  { icon: Users, label: 'Clientes Satisfechos', value: '9' },
];

export default function SobreMi() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative font-sans text-slate-200 selection:bg-cyan-500/30 bg-[#0a0f18] z-0">
      
      {/* ================= ELEMENTOS DE FONDO TECNOLÓGICOS ================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <ParticleBackground />
        
        {/* Glow Principal (Cyan) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Resplandor inferior (Azul profundo) */}
        <div className="absolute bottom-[-20%] right-[10%] w-[50vw] h-[50vw] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Constelación / Nodos de fondo (Simulado con SVG para estética Tech) */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tech-dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#22d3ee" opacity="0.5"/>
                <path d="M 2 2 L 50 50" stroke="#22d3ee" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#tech-dots)" />
          </svg>
        </div>
      </div>

      <Navbar />

      <main className="pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto">
        
        {/* ================= HERO SECTION ================= */}
        <motion.div 
          className="flex flex-col items-center text-center mb-28"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Icono Principal Tech */}
          <motion.div
            className="relative w-28 h-28 mx-auto mb-10 flex items-center justify-center group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-400/30 transition-all duration-500"></div>
            <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute inset-2 border border-blue-500/30 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>
            <div className="relative w-16 h-16 bg-[#0a1017] border border-cyan-500/50 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center justify-center rotate-45 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-shadow duration-500">
              <Code size={32} className="text-cyan-400 -rotate-45" />
            </div>
          </motion.div>
          
          {/* Título Colosal - Blanco Sólido */}
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-8 leading-tight text-white drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Sobre Mí
          </motion.h1>
          
          {/* Descripción - Totalmente limpia y centrada */}
          <motion.p 
            className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Soy Marlon Pecho, estudiante de Ingeniería de Sistemas Avanzados apasionado por el desarrollo web.
            Me especializo en crear soluciones digitales innovadoras que combinan diseño moderno con funcionalidad robusta.
          </motion.p>

          {/* Botones de Acción Glassmorphism */}
          <motion.div 
            className="flex flex-wrap justify-center gap-5 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="https://github.com/MP-make"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#0a1017] border border-white/10 rounded-full text-slate-300 hover:bg-white/5 hover:text-white hover:border-cyan-500/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group"
            >
              <Github size={20} className="group-hover:text-cyan-400 transition-colors" />
              <span className="font-semibold tracking-wide">GitHub</span>
            </a>
            <a
              href="/cv-marlon-pecho.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-100 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] group"
            >
              <ExternalLink size={20} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              <span className="font-semibold tracking-wide">Descargar CV</span>
            </a>
          </motion.div>
        </motion.div>

        {/* ================= STATS SECTION ================= */}
        <motion.section 
          className="mb-32 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Línea conectora de fondo */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -z-10 hidden md:block"></div>
          
          {/* Grid ajustado a 3 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative group p-8 bg-[#0a1017]/80 backdrop-blur-md border border-white/5 rounded-3xl hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(34,211,238,0.05)] overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Borde superior luminoso on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="p-4 bg-cyan-950/30 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500 border border-cyan-500/10 group-hover:border-cyan-500/30">
                    <stat.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-5xl font-black text-white mb-2 drop-shadow-md group-hover:text-transparent bg-clip-text bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-cyan-100 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ================= TIMELINE SECTION ================= */}
        <motion.section 
          className="mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Experiencia & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Educación</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-[#0a1017]/50 p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-sm">
            <Timeline events={timelineEvents} />
          </div>
        </motion.section>

        {/* ================= SKILLS SECTION ================= */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Tecnologías & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Habilidades</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'React / Next.js', level: 'Avanzado', icon: Code },
              { name: 'Node.js / Python', level: 'Avanzado', icon: Database },
              { name: 'PostgreSQL / Firebase', level: 'Intermedio', icon: Database },
              { name: 'Tailwind CSS', level: 'Avanzado', icon: Globe },
              { name: 'WordPress / Woo', level: 'Experto', icon: Smartphone },
              { name: 'UI/UX Design', level: 'Intermedio', icon: Zap },
            ].map((skill, index) => {
              const getProgressWidth = (level: string) => {
                switch (level) {
                  case 'Avanzado': return '85%';
                  case 'Intermedio': return '65%';
                  case 'Experto': return '98%';
                  default: return '50%';
                }
              };

              return (
                <motion.div
                  key={index}
                  className="bg-[#0a1017] rounded-3xl border border-white/5 p-8 hover:border-cyan-500/40 hover:bg-[#0d1522] transition-all duration-500 group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Resplandor de fondo sutil */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-colors duration-500"></div>

                  <div className="flex items-center gap-5 mb-8 relative z-10">
                    <div className="p-3.5 bg-slate-900/80 border border-white/5 rounded-xl group-hover:border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300">
                      <skill.icon className="text-cyan-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-100 transition-colors">{skill.name}</h3>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Nivel</span>
                      <span className="text-sm font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/20">{skill.level}</span>
                    </div>
                    
                    {/* Barra de progreso Tech */}
                    <div className="w-full bg-[#050B14] rounded-full h-2.5 overflow-hidden border border-white/5 shadow-inner">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-300 relative" 
                        style={{ width: getProgressWidth(skill.level) }}
                        initial={{ width: 0 }}
                        whileInView={{ width: getProgressWidth(skill.level) }}
                        transition={{ duration: 1.5, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                        viewport={{ once: true }}
                      >
                        {/* Brillo en la punta de la barra */}
                        <div className="absolute top-0 right-0 w-10 h-full bg-white/30 blur-[2px]"></div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ================= CALL TO ACTION ================= */}
        <motion.section 
          className="text-center mt-32 py-16 px-6 relative rounded-[3rem] overflow-hidden border border-white/5 bg-[#0a1017]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background Glows for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              ¿Listo para trabajar <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">juntos?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Si tienes un proyecto en mente o quieres discutir oportunidades de colaboración para llevar tus ideas al siguiente nivel, no dudes en contactarme.
            </p>
            
            <Link 
              href="/contacto"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Zap size={22} className="fill-white" />
              Contactar Ahora
            </Link>
          </div>
        </motion.section>

      </main>
    </div>
  );
}