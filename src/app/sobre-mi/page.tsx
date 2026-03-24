'use client';

import Navbar from '@/components/Navbar';
import Timeline from '@/components/Timeline';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const timelineEvents = [
  {
    id: '1',
    title: 'Desarrollador Full-Stack',
    subtitle: 'Consigueventas - Empresa de Marketing Digital',
    description: 'Desarrollo de aplicaciones web modernas usando React, Next.js, y Node.js. Implementación de soluciones e-commerce y sistemas de gestión.',
    date: '2023 - Presente',
    type: 'work' as const,
  },
  {
    id: '2',
    title: 'Co-Founder & Desarrollador',
    subtitle: 'Ventify - Plataforma de Ventas',
    description: 'Como co-fundador, lideré el desarrollo técnico de una plataforma que incrementó las ventas de pymes en un 70%. Tecnologías: React, Firebase, Stripe.',
    date: '2022 - 2023',
    type: 'work' as const,
  },
  {
    id: '3',
    title: 'Ingeniería de Sistemas Avanzados',
    subtitle: 'Universidad Nacional de Ingeniería',
    description: 'Estudios enfocados en desarrollo de software, bases de datos, y tecnologías emergentes. Proyecto final: Sistema de gestión universitaria.',
    date: '2020 - 2024',
    type: 'education' as const,
  },
  {
    id: '4',
    title: 'Desarrollador Freelance',
    subtitle: 'Proyectos Independientes',
    description: 'Desarrollo de sitios web para pequeñas empresas usando WordPress, WooCommerce, y soluciones personalizadas.',
    date: '2021 - Presente',
    type: 'work' as const,
  },
];

export default function SobreMi() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6">
              Sobre Mí
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Soy Marlon Pecho, estudiante de Ingeniería de Sistemas Avanzados apasionado por el desarrollo web.
              Me especializo en crear soluciones digitales innovadoras que combinan diseño moderno con funcionalidad robusta.
            </p>
          </div>

          {/* Timeline Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-200 text-center mb-12">
              Experiencia & Educación
            </h2>
            <Timeline events={timelineEvents} />
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-3xl font-bold text-slate-200 text-center mb-12">
              Tecnologías & Habilidades
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'React/Next.js', level: 'Avanzado' },
                { name: 'Node.js/Python', level: 'Avanzado' },
                { name: 'PostgreSQL/Firebase', level: 'Intermedio' },
                { name: 'Tailwind CSS', level: 'Avanzado' },
                { name: 'WordPress/WooCommerce', level: 'Experto' },
                { name: 'UI/UX Design', level: 'Intermedio' },
              ].map((skill, index) => {
                const getProgressWidth = (level: string) => {
                  switch (level) {
                    case 'Avanzado': return '90%';
                    case 'Intermedio': return '60%';
                    case 'Experto': return '100%';
                    default: return '50%';
                  }
                };

                return (
                  <motion.div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-800 p-6 hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:-translate-y-1 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">{skill.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Nivel:</span>
                        <span className="text-cyan-400 font-medium">{skill.level}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div 
                          className="bg-cyan-400 h-2 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.5)] transition-all duration-1000" 
                          style={{ width: getProgressWidth(skill.level) }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}