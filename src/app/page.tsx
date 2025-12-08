'use client';

import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Carousel from '@/components/Carousel';
import { Code, Database, Smartphone, Mail, Github, ExternalLink, CheckCircle, Clock, Palette, Atom, Server, Zap } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { GitBranch, Cloud, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  technologies: string[];
  status: 'completed' | 'in-progress';
  created_at: string;
  images?: { image: string }[];
}

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Cargar proyectos
      const { data: projectsData } = await supabase
        .from('portfolio_project')
        .select(`
          *,
          images:portfolio_projectimage(image)
        `)
        .order('created_at', { ascending: false });
      
      // Cargar habilidades
      const { data: skillsData } = await supabase
        .from('portfolio_skill')
        .select('*')
        .order('category', { ascending: true });
      
      setProjects(projectsData || []);
      setSkills(skillsData || []);
    };
    
    fetchData();
  }, []);

  // Mapeo de iconos según el nombre de la habilidad
  const getIconForSkill = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name.includes('python') || name.includes('javascript') || name.includes('typescript') || name.includes('html') || name.includes('next') || name.includes('node') || name.includes('django')) {
      return <Code size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />;
    }
    if (name.includes('css') || name.includes('tailwind')) {
      return <Palette size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />;
    }
    if (name.includes('react')) {
      return <Atom size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />;
    }
    if (name.includes('database') || name.includes('postgres') || name.includes('sql') || name.includes('mongo')) {
      return <Database size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />;
    }
    if (name.includes('server')) {
      return <Server size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />;
    }
    return <Code size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />;
  };

  return (
    <div className="min-h-screen bg-accent text-customWhite">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" data-aos="fade-up">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(1, 195, 142, 0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-pulse opacity-30"><Code size={40} className="text-primary glow" /></div>
          <div className="absolute top-1/3 right-1/4 animate-bounce opacity-20"><Database size={30} className="text-primary glow" /></div>
          <div className="absolute bottom-1/4 left-1/3 animate-spin opacity-25"><Smartphone size={35} className="text-primary glow" /></div>
          <div className="absolute bottom-1/3 right-1/3 animate-pulse opacity-30"><Palette size={40} className="text-primary glow" /></div>
        </div>
        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-shadow-lg" data-aos="fade-up" data-aos-delay="200" style={{ textShadow: '0 0 10px rgba(1, 195, 142, 0.5)' }}>
            Marlon <span style={{color: 'var(--primary)'}}>Pecho</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary mb-4 leading-loose" data-aos="fade-up" data-aos-delay="400">
            Ingeniero de Sistemas & Desarrollador Full Stack
          </p>
          <p className="text-lg text-customWhite max-w-2xl mx-auto mb-8 leading-loose" data-aos="fade-up" data-aos-delay="600">
            Ingeniero de sistemas Marlon Pecho. Transformando ideas en soluciones digitales que impulsan negocios y cerrando brechas tecnológicas en Perú!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" data-aos="fade-up" data-aos-delay="800">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white mb-6 hover:from-secondary hover:to-primary transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-primary/50 hover:brightness-110 glow permanent-glow animate-pulse" data-aos="fade-up" data-aos-delay="800">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
              </span>
              <span className="font-bold text-lg">Disponible para proyectos</span>
            </div>
          </div>
          <div className="mt-16" data-aos="fade-up" data-aos-delay="1000">
            <a href="#contact" className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-accent px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1 glow">
              Conectemos
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-card" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white" data-aos="fade-up" style={{ textShadow: '0 0 10px rgba(1, 195, 142, 0.5)' }}>Sobre Mí</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-semibold mb-4">Resumen Profesional</h3>
              <p className="text-gray-300 mb-6">
                Como estudiante avanzado de Ingeniería de Sistemas, me especializo en desarrollo full-stack con enfoque en tecnologías modernas. Mi experiencia abarca desde gestión de datos backend hasta interfaces frontend intuitivas, siempre priorizando soluciones limpias, eficientes y escalables.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Experiencia</h3>
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 glow" data-aos="fade-up" data-aos-delay="400">
                  <h4 className="text-primary font-semibold flex items-center">
                    <Code className="mr-2 glow" size={20} />
                    Desarrollo Full-Stack
                  </h4>
                  <p className="text-gray-300">Construyendo aplicaciones web end-to-end usando frameworks y mejores prácticas modernas.</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 glow" data-aos="fade-up" data-aos-delay="600">
                  <h4 className="text-primary font-semibold flex items-center">
                    <Database className="mr-2 glow" size={20} />
                    Gestión de Datos
                  </h4>
                  <p className="text-gray-300">Diseñando e implementando soluciones eficientes de bases de datos y pipelines de procesamiento de datos.</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 glow" data-aos="fade-up" data-aos-delay="800">
                  <h4 className="text-primary font-semibold flex items-center">
                    <Smartphone className="mr-2 glow" size={20} />
                    Diseño UX/UI
                  </h4>
                  <p className="text-gray-300">Creando interfaces de usuario intuitivas con atención a la experiencia del usuario.</p>
                </div>
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <h3 className="text-2xl font-semibold mb-4">Habilidades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow"
                    data-aos="fade-up"
                    data-aos-delay={`${600 + index * 100}`}
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                      {getIconForSkill(skill.name)}
                      <span className="font-semibold text-sm sm:text-base">{skill.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-gradient-to-b from-accent to-card relative overflow-hidden" data-aos="fade-up">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(1, 195, 142, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(1, 195, 142, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white" data-aos="fade-up" style={{ textShadow: '0 0 20px rgba(1, 195, 142, 0.5)' }}>
              Proyectos <span className="text-primary">Destacados</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              Soluciones innovadoras construidas con las últimas tecnologías
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="group bg-[#1e2432] rounded-2xl overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2" 
                data-aos="fade-up" 
                data-aos-delay={`${200 + index * 200}`}
              >
                {/* Badge de estado */}
                <div className="p-4 pb-0 flex justify-end">
                  <div className={`${project.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'} text-white px-6 py-3 rounded-full text-sm font-black flex items-center gap-2 shadow-2xl border-4 border-white/90`}>
                    {project.status === 'completed' ? (
                      <>
                        <CheckCircle size={18} className="animate-pulse drop-shadow-lg" strokeWidth={3} />
                        <span className="drop-shadow-lg">COMPLETADO</span>
                      </>
                    ) : (
                      <>
                        <Clock size={18} className="animate-pulse drop-shadow-lg" strokeWidth={3} />
                        <span className="drop-shadow-lg">EN DESARROLLO</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Carrusel */}
                <div className="p-4 pt-3">
                  <div className="transform group-hover:scale-105 transition-transform duration-500">
                    <Carousel images={project.images?.map(img => img.image) || []} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 pt-4 space-y-5 bg-gradient-to-b from-[#1e2432] to-[#181d28]">
                  <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed text-base">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="pt-5 border-t-2 border-primary/20">
                    <p className="text-xs text-gray-400 mb-4 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Code size={14} className="text-primary" />
                      Stack Tecnológico
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                        project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className="bg-primary/15 text-primary border-2 border-primary/40 text-sm px-4 py-2 rounded-full hover:bg-primary/25 hover:border-primary hover:scale-105 transition-all duration-300 font-semibold"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm italic">Sin tecnologías especificadas</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-4 pt-5">
                    {project.link && (
                      <>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 transform hover:-translate-y-1 text-base"
                        >
                          <ExternalLink size={20} />
                          Ver Demo
                        </a>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-primary border-2 border-primary/50 hover:border-primary px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
                        >
                          <Github size={20} />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA adicional */}
          <div className="mt-16 text-center" data-aos="fade-up" data-aos-delay="400">
            <p className="text-gray-300 mb-4 text-lg">¿Quieres ver más de mi trabajo?</p>
            <a 
              href="https://github.com/MP-make" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-bold text-lg group"
            >
              <Github size={24} />
              Visita mi GitHub
              <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-card" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white" data-aos="fade-up" style={{ textShadow: '0 0 10px rgba(1, 195, 142, 0.5)' }}>Contacto</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-semibold mb-4">Conectemos</h3>
              <p className="text-gray-300 mb-6">
                Siempre estoy interesado en nuevas oportunidades y colaboraciones. ¡No dudes en contactarme!
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="text-primary mr-3" size={20} />
                  <span>marlonpecho264@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="text-primary mr-3" size={20} />
                  <span>907-326-121</span>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-primary hover:text-secondary transition-colors glow">
                  <Github size={24} />
                </a>
                <a href="#" className="text-primary hover:text-secondary transition-colors glow">
                  <Mail size={24} />
                </a>
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 px-4 border-t border-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              © 2025 Marlon Pecho. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors glow">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/marlon-pecho-530443385/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors glow">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
