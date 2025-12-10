'use client';

import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Carousel from '@/components/Carousel';
import { Code, Database, Smartphone, Mail, Github, ExternalLink, CheckCircle, Clock, Palette, Atom, Server } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Auto-advance text slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % t.hero.slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [t.hero.slides.length]);

  // Auto-advance hero images every 4 seconds
  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const getIconForSkill = (skillName: string) => {
    const name = skillName.toLowerCase();
    const iconClass = "text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2";
    
    if (name.includes('python') || name.includes('javascript') || name.includes('typescript') || name.includes('html') || name.includes('next') || name.includes('node') || name.includes('django')) {
      return <Code size={40} className={iconClass} />;
    }
    if (name.includes('css') || name.includes('tailwind')) {
      return <Palette size={40} className={iconClass} />;
    }
    if (name.includes('react')) {
      return <Atom size={40} className={iconClass} />;
    }
    if (name.includes('database') || name.includes('postgres') || name.includes('sql') || name.includes('mongo')) {
      return <Database size={40} className={iconClass} />;
    }
    if (name.includes('server')) {
      return <Server size={40} className={iconClass} />;
    }
    return <Code size={40} className={iconClass} />;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-accent text-customWhite' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      {/* Hero Section - Split Screen */}
      <section id="home" className="min-h-screen relative flex flex-col lg:flex-row">
        {/* Left Side - Full Height Image */}
        <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0 overflow-hidden">
          {heroImages.length > 0 ? (
            <>
              {heroImages.map((img, index) => (
                <div
                  key={img.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={img.image}
                    alt={img.title || 'Hero Image'}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'}`}></div>
                </div>
              ))}
            </>
          ) : (
            <div className={`w-full h-full ${theme === 'dark' ? 'bg-gradient-to-br from-[#1a1f2e] to-[#0f1419]' : 'bg-gradient-to-br from-gray-200 to-gray-300'} flex items-center justify-center`}>
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
                  <Code size={64} className="text-primary/50" />
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium text-lg`}>Hero Images</p>
                <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>Agrega imágenes desde el panel admin</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div className={`w-full lg:w-1/2 min-h-screen flex items-center ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`}>
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-24 lg:py-0">
            
            {/* Logo/Brand */}
            <div className="mb-12" data-aos="fade-up">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Code size={24} className="text-white" />
                </div>
                <div>
                  <span className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Marlon Pecho
                  </span>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t.hero.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Auto-changing Title - Every 4 seconds */}
            <div className="relative min-h-[200px] sm:min-h-[240px] mb-10" data-aos="fade-up" data-aos-delay="100">
              {t.hero.slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    currentSlide === index 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
                >
                  <h1 
                    className={`text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    <span className="text-primary">{slide.title.split(' ')[0]}</span>
                    {' '}
                    {slide.title.split(' ').slice(1).join(' ')}
                  </h1>
                  <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed max-w-md`}>
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Available Badge */}
            <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
              <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  {t.hero.available}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mb-12" data-aos="fade-up" data-aos-delay="300">
              <a 
                href="#contact" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 text-lg"
              >
                {t.hero.connect}
                <ExternalLink size={20} />
              </a>
            </div>

            {/* Mobile Hero Image */}
            <div className="lg:hidden mb-8 rounded-2xl overflow-hidden shadow-2xl" data-aos="fade-up" data-aos-delay="400">
              {heroImages.length > 0 ? (
                <div className="relative aspect-video">
                  {heroImages.map((img, index) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt={img.title || 'Hero Image'}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              ) : (
                <div className={`aspect-video ${theme === 'dark' ? 'bg-[#1a1f2e]' : 'bg-gray-200'} flex items-center justify-center`}>
                  <Code size={48} className="text-primary/30" />
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="400">
              <a 
                href="#projects" 
                className={`px-6 py-3 border-2 ${theme === 'dark' ? 'border-gray-700 hover:border-primary text-gray-400 hover:text-primary' : 'border-gray-300 hover:border-primary text-gray-600 hover:text-primary'} rounded-xl font-medium transition-all duration-300`}
              >
                {t.hero.viewProjects}
              </a>
              <a 
                href="https://github.com/MP-make" 
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'} rounded-xl font-medium transition-all duration-300 flex items-center gap-2`}
              >
                <Github size={18} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#1e2432]' : 'bg-gray-100'}`} data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} data-aos="fade-up">
            {t.about.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {t.about.professionalSummary}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                {t.about.professionalDescription}
              </p>
              <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {t.about.experience}
              </h3>
              <div className="space-y-4">
                <div className={`${theme === 'dark' ? 'bg-[#0f1419] hover:bg-[#151a25]' : 'bg-white hover:bg-gray-50'} p-4 rounded-lg border border-primary/30 hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                  <h4 className="text-primary font-semibold flex items-center">
                    <Code className="mr-2" size={20} />
                    {t.about.fullStack}
                  </h4>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>
                    {t.about.fullStackDesc}
                  </p>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#0f1419] hover:bg-[#151a25]' : 'bg-white hover:bg-gray-50'} p-4 rounded-lg border border-primary/30 hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                  <h4 className="text-primary font-semibold flex items-center">
                    <Database className="mr-2" size={20} />
                    {t.about.dataManagement}
                  </h4>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>
                    {t.about.dataManagementDesc}
                  </p>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#0f1419] hover:bg-[#151a25]' : 'bg-white hover:bg-gray-50'} p-4 rounded-lg border border-primary/30 hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-lg`}>
                  <h4 className="text-primary font-semibold flex items-center">
                    <Smartphone className="mr-2" size={20} />
                    {t.about.uxui}
                  </h4>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>
                    {t.about.uxuiDesc}
                  </p>
                </div>
              </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {t.about.skills}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={skill.id}
                    className={`${theme === 'dark' ? 'bg-[#0f1419] hover:bg-[#151a25]' : 'bg-white hover:bg-gray-50'} p-4 rounded-lg border border-primary/30 hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-lg`}
                    data-aos="fade-up"
                    data-aos-delay={`${500 + index * 50}`}
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                      {getIconForSkill(skill.name)}
                      <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {skill.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={`py-20 px-4 ${theme === 'dark' ? 'bg-gradient-to-b from-[#1e2432] to-[#0f1419]' : 'bg-gradient-to-b from-gray-100 to-white'} relative overflow-hidden`} data-aos="fade-up">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(1, 195, 142, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(1, 195, 142, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} data-aos="fade-up">
              {t.projects.title} <span className="text-primary">Destacados</span>
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg max-w-2xl mx-auto`} data-aos="fade-up" data-aos-delay="100">
              {t.projects.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`group ${theme === 'dark' ? 'bg-[#1a1f2e]' : 'bg-white'} rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-primary/20 hover:border-primary/50' : 'border-gray-200 hover:border-primary/50'} transition-all duration-500 hover:shadow-2xl ${theme === 'dark' ? 'hover:shadow-primary/20' : 'hover:shadow-primary/10'} hover:-translate-y-2`} 
                data-aos="fade-up" 
                data-aos-delay={`${200 + index * 100}`}
              >
                {/* Status Badge */}
                <div className="p-4 pb-0 flex justify-end">
                  <div className={`${project.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'} text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg`}>
                    {project.status === 'completed' ? (
                      <>
                        <CheckCircle size={14} strokeWidth={3} />
                        {t.projects.completed}
                      </>
                    ) : (
                      <>
                        <Clock size={14} strokeWidth={3} />
                        {t.projects.inProgress}
                      </>
                    )}
                  </div>
                </div>

                {/* Carousel */}
                <div className="p-4 pt-2">
                  <div className="rounded-xl overflow-hidden">
                    <Carousel images={project.images?.map(img => img.image) || []} />
                  </div>
                </div>
                
                {/* Content */}
                <div className={`p-6 pt-2 space-y-4 ${theme === 'dark' ? 'bg-gradient-to-b from-[#1a1f2e] to-[#151a25]' : ''}`}>
                  <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} group-hover:text-primary transition-colors`}>
                    {project.title}
                  </h3>
                  
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className={`pt-4 border-t ${theme === 'dark' ? 'border-primary/10' : 'border-gray-200'}`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-3 font-bold uppercase tracking-wider flex items-center gap-2`}>
                      <Code size={12} className="text-primary" />
                      {t.projects.techStack}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                        project.technologies.map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className={`${theme === 'dark' ? 'bg-primary/10 border-primary/30' : 'bg-primary/5 border-primary/20'} text-primary border text-xs px-3 py-1 rounded-full font-medium hover:bg-primary/20 transition-colors`}
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-xs italic`}>
                          {t.projects.noTech}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {project.link && (
                    <div className="flex gap-3 pt-4">
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                      >
                        <ExternalLink size={16} />
                        {t.projects.viewDemo}
                      </a>
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center justify-center ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} text-primary border border-primary/30 hover:border-primary px-4 py-3 rounded-xl transition-all duration-300`}
                      >
                        <Github size={18} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* GitHub CTA */}
          <div className="mt-16 text-center" data-aos="fade-up">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              {t.projects.viewMore}
            </p>
            <a 
              href="https://github.com/MP-make" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-bold group"
            >
              <Github size={20} />
              {t.projects.visitGithub}
              <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 px-4 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-white'}`} data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t.contact.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {t.contact.connect}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                {t.contact.description}
              </p>
              <div className="space-y-4">
                <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Mail className="text-primary mr-3" size={20} />
                  <span>marlonpecho264@gmail.com</span>
                </div>
                <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Smartphone className="text-primary mr-3" size={20} />
                  <span>+51 907-326-121</span>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110">
                  <Github size={24} />
                </a>
                <a href="mailto:marlonpecho264@gmail.com" className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-110">
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
      <footer className={`${theme === 'dark' ? 'bg-[#0a0e14] border-primary/20' : 'bg-gray-100 border-gray-200'} py-8 px-4 border-t`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm`}>
              © 2025 Marlon Pecho. {t.footer.rights}
            </p>
            <div className="flex gap-6">
              <a href="https://github.com/MP-make" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-gray-500 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors text-sm`}>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/marlon-pecho-530443385/" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'text-gray-500 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors text-sm`}>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
