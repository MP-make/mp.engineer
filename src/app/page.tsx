'use client';

import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Carousel from '@/components/Carousel';
import { Code, Database, Smartphone, Mail, Github, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiPython, SiDjango,
  SiTailwindcss, SiNodedotjs, SiPostgresql, SiMongodb, SiGit, SiDocker,
  SiHtml5, SiCss3, SiSupabase, SiFirebase, SiFigma, SiVercel, SiLinux, SiMysql, SiGithub
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';

interface Project {
  id: number;
  title: string;
  description: string;
  link?: string;
  demo_link?: string;
  github_link?: string;
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

interface HeroImage {
  id: number;
  image: string;
  title?: string;
  order: number;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      const { data: projectsData } = await supabase
        .from('portfolio_project')
        .select(`*, images:portfolio_projectimage(image)`)
        .order('created_at', { ascending: false });
      
      const { data: skillsData } = await supabase
        .from('portfolio_skill')
        .select('*')
        .order('category', { ascending: true });

      const { data: heroData } = await supabase
        .from('portfolio_heroimage')
        .select('*')
        .order('order', { ascending: true });
      
      setProjects(projectsData || []);
      setSkills(skillsData || []);
      setHeroImages(heroData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const maxSlides = Math.max(t.hero.slides.length, heroImages.length);
    if (maxSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [t.hero.slides.length, heroImages.length]);

  // Slide 0, 2, 4 = imagen DERECHA (imageRight = true)
  // Slide 1, 3, 5 = imagen IZQUIERDA (imageRight = false)
  const imageOnRight = currentSlide % 2 === 0;

  const getIconForSkill = (skillName: string) => {
    const name = skillName.toLowerCase().trim();
    const size = 32;
    
    // Mapeo exacto por nombre - más robusto
    if (name === 'node.js' || name === 'nodejs' || name === 'node') return <SiNodedotjs size={size} />;
    if (name === 'next.js' || name === 'nextjs' || name === 'next') return <SiNextdotjs size={size} />;
    if (name === 'typescript' || name === 'ts') return <SiTypescript size={size} />;
    if (name === 'javascript' || name === 'js') return <SiJavascript size={size} />;
    if (name === 'python' || name === 'py') return <SiPython size={size} />;
    if (name === 'django') return <SiDjango size={size} />;
    if (name === 'react' || name === 'reactjs' || name === 'react.js') return <SiReact size={size} />;
    if (name === 'tailwind' || name === 'tailwindcss' || name === 'tailwind css') return <SiTailwindcss size={size} />;
    if (name === 'postgresql' || name === 'postgres') return <SiPostgresql size={size} />;
    if (name === 'mongodb' || name === 'mongo') return <SiMongodb size={size} />;
    if (name === 'mysql') return <SiMysql size={size} />;
    if (name === 'supabase') return <SiSupabase size={size} />;
    if (name === 'firebase') return <SiFirebase size={size} />;
    if (name === 'git') return <SiGit size={size} />;
    if (name === 'github') return <SiGithub size={size} />;
    if (name === 'docker') return <SiDocker size={size} />;
    if (name === 'html' || name === 'html5') return <SiHtml5 size={size} />;
    if (name === 'css' || name === 'css3') return <SiCss3 size={size} />;
    if (name === 'aws' || name === 'amazon web services') return <FaAws size={size} />;
    if (name === 'figma') return <SiFigma size={size} />;
    if (name === 'vercel') return <SiVercel size={size} />;
    if (name === 'linux') return <SiLinux size={size} />;
    
    // Fallback con includes para casos parciales - más específico
    if (name.includes('node')) return <SiNodedotjs size={size} />;
    if (name.includes('next')) return <SiNextdotjs size={size} />;
    if (name.includes('typescript')) return <SiTypescript size={size} />;
    if (name.includes('javascript')) return <SiJavascript size={size} />;
    if (name.includes('python')) return <SiPython size={size} />;
    if (name.includes('react')) return <SiReact size={size} />;
    if (name.includes('tailwind')) return <SiTailwindcss size={size} />;
    if (name.includes('postgres')) return <SiPostgresql size={size} />;
    if (name.includes('mongo')) return <SiMongodb size={size} />;
    if (name.includes('supabase')) return <SiSupabase size={size} />;
    if (name.includes('mysql')) return <SiMysql size={size} />;
    if (name.includes('html')) return <SiHtml5 size={size} />;
    if (name.includes('css')) return <SiCss3 size={size} />;
    if (name.includes('git') && !name.includes('hub')) return <SiGit size={size} />;
    if (name.includes('github') || name.includes('git hub')) return <SiGithub size={size} />;
    if (name.includes('vercel')) return <SiVercel size={size} />;
    if (name.includes('sql')) return <Database size={size} />;
    
    return <Code size={size} />;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative overflow-hidden">
        {/* Desktop */}
        <div className="hidden lg:flex w-full min-h-screen relative">
          {/* Texto - posición dinámica */}
          <div 
            className={`absolute top-0 h-screen w-1/2 flex items-center transition-all duration-[1000ms] ease-in-out ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} z-10`}
            style={{ left: imageOnRight ? '0%' : '50%' }}
          >
            <div className="w-full px-8 lg:px-16 xl:px-20">
              {/* Título con transición */}
              <div className="relative min-h-[200px] mb-8">
                {t.hero.slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      currentSlide % t.hero.slides.length === index 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    <h1 className={`text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <span className="text-primary">{slide.title.split(' ')[0]}</span>{' '}
                      {slide.title.split(' ').slice(1).join(' ')}
                    </h1>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed max-w-md`}>
                      {slide.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              {/* Badge disponible */}
              <div className="mb-8">
                <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.hero.available}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mb-8">
                <a href="#contact" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 text-lg">
                  {t.hero.connect}
                  <ExternalLink size={20} />
                </a>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                <a href="#projects" className={`px-6 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 hover:border-primary text-gray-400 hover:text-primary' : 'border-gray-300 hover:border-primary text-gray-600 hover:text-primary'} rounded-xl font-medium transition-all duration-300`}>
                  {t.hero.viewProjects}
                </a>
                <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className={`px-6 py-3 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'} rounded-xl font-medium transition-all duration-300 flex items-center gap-2`}>
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Imagen - posición dinámica opuesta al texto */}
          <div 
            className={`absolute top-0 h-screen w-1/2 overflow-hidden transition-all duration-[1000ms] ease-in-out`}
            style={{ left: imageOnRight ? '50%' : '0%' }}
          >
            <div className="relative w-full h-full">
              {heroImages.length > 0 ? (
                heroImages.map((img, index) => (
                  <div
                    key={img.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      currentSlide % heroImages.length === index 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img src={img.image} alt={img.title || 'Hero'} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/10' : 'bg-white/5'}`}></div>
                  </div>
                ))
              ) : (
                <div className={`w-full h-full ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a1f2e] to-[#0f1419]' : 'bg-gradient-to-br from-gray-200 to-gray-300'} flex items-center justify-center`}>
                  <Code size={64} className="text-primary/30" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className={`lg:hidden w-full min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
          <div className="w-full pt-24 px-6">
            <div className="relative min-h-[160px] mb-6">
              {t.hero.slides.map((slide, index) => (
                <div key={index} className={`absolute inset-0 transition-all duration-500 ${currentSlide % t.hero.slides.length === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-primary">{slide.title.split(' ')[0]}</span> {slide.title.split(' ').slice(1).join(' ')}
                  </h1>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{slide.subtitle}</p>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-green-500"></span></span>
                <span className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.hero.available}</span>
              </div>
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl mb-6">{t.hero.connect}<ExternalLink size={18} /></a>
          </div>
          <div className="px-6 pb-8 flex-1 flex items-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
              {heroImages.map((img, index) => (
                <img key={img.id} src={img.image} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${currentSlide % heroImages.length === index ? 'opacity-100' : 'opacity-0'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.about.title}</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t.about.professionalSummary}</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{t.about.professionalDescription}</p>
              <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t.about.experience}</h3>
              <div className="space-y-4">
                <div className={`${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} p-4 rounded-lg border border-primary/30 hover:border-primary transition-all duration-300 shadow-lg`}>
                  <h4 className="text-primary font-semibold flex items-center"><Code className="mr-2" size={20} />{t.about.fullStack}</h4>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>{t.about.fullStackDesc}</p>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} p-4 rounded-lg border border-primary/30 hover:border-primary transition-all duration-300 shadow-lg`}>
                  <h4 className="text-primary font-semibold flex items-center"><Database className="mr-2" size={20} />{t.about.dataManagement}</h4>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>{t.about.dataManagementDesc}</p>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'} p-4 rounded-lg border border-primary/30 hover:border-primary transition-all duration-300 shadow-lg`}>
                  <h4 className="text-primary font-semibold flex items-center"><Smartphone className="mr-2" size={20} />{t.about.uxui}</h4>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>{t.about.uxuiDesc}</p>
                </div>
              </div>
            </div>
            
            {/* Skills - Grid de 3 columnas */}
            <div>
              <h3 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t.about.skills}</h3>
              <div className="grid grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className={`group ${theme === 'dark' ? 'bg-[#0f1419] hover:bg-[#151a25]' : 'bg-white hover:bg-gray-50'} p-4 rounded-xl border border-primary/20 hover:border-primary hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-lg`}>
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                      <div className="text-primary group-hover:text-secondary transition-colors duration-200">
                        {getIconForSkill(skill.name)}
                      </div>
                      <span className={`font-medium text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{skill.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-20 px-4 ${theme === 'dark' ? 'bg-gradient-to-b from-[#1e2432] to-[#0f1419]' : 'bg-gradient-to-b from-gray-100 to-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.projects.title} <span className="text-primary">Destacados</span></h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto`}>{t.projects.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project.id} className={`group ${theme === 'dark' ? 'bg-[#1a1f2e]' : 'bg-white'} rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-primary/20 hover:border-primary/50' : 'border-gray-200 hover:border-primary/50'} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}>
                <div className="p-4 pb-0 flex justify-end">
                  <div className={`${project.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'} text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2`}>
                    {project.status === 'completed' ? <><CheckCircle size={14} />{t.projects.completed}</> : <><Clock size={14} />{t.projects.inProgress}</>}
                  </div>
                </div>
                <div className="p-4 pt-2"><div className="rounded-xl overflow-hidden"><Carousel images={project.images?.map(img => img.image) || []} /></div></div>
                <div className="p-6 pt-2 space-y-4">
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-primary transition-colors`}>{project.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>{project.description}</p>
                  <div className={`pt-4 border-t ${theme === 'dark' ? 'border-primary/10' : 'border-gray-200'}`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-3 font-bold uppercase tracking-wider flex items-center gap-2`}><Code size={12} className="text-primary" />{t.projects.techStack}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.technologies) && project.technologies.map((tech, i) => (
                        <span key={i} className={`${theme === 'dark' ? 'bg-primary/10 border-primary/30' : 'bg-primary/5 border-primary/20'} text-primary border text-xs px-3 py-1 rounded-full font-medium`}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  {(project.demo_link || project.github_link || project.link) && (
                    <div className="flex gap-3 pt-4">
                      {(project.demo_link || project.link) && (
                        <a href={project.demo_link || project.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg">
                          <ExternalLink size={16} />{t.projects.viewDemo}
                        </a>
                      )}
                      {project.github_link && (
                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} text-primary border border-primary/30 px-4 py-3 rounded-xl transition-all`}>
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{t.projects.viewMore}</p>
            <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-secondary font-bold">
              <Github size={20} />{t.projects.visitGithub}<ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.contact.title}</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t.contact.connect}</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{t.contact.description}</p>
              <div className="space-y-4">
                <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><Mail className="text-primary mr-3" size={20} /><span>marlonpecho264@gmail.com</span></div>
                <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}><Smartphone className="text-primary mr-3" size={20} /><span>+51 907-326-121</span></div>
              </div>
              <div className="mt-6 flex space-x-4">
                <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"><Github size={24} /></a>
                <a href="mailto:marlonpecho264@gmail.com" className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110"><Mail size={24} /></a>
              </div>
            </div>
            <div><ContactForm /></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-[#0a0e14] border-primary/20' : 'bg-gray-100 border-gray-200'} py-8 px-4 border-t`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>© 2025 Marlon Pecho. {t.footer.rights}</p>
          <div className="flex gap-6">
            <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-gray-500 hover:text-primary' : 'text-gray-600 hover:text-primary'} text-sm`}>GitHub</a>
            <a href="https://www.linkedin.com/in/marlon-pecho-530443385/" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-gray-500 hover:text-primary' : 'text-gray-600 hover:text-primary'} text-sm`}>LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
