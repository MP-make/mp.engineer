import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import { Code, Database, Smartphone, Mail, Github, ExternalLink, CheckCircle, Clock, Palette, Atom, Server, Zap } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { GitBranch, Cloud, Linkedin } from 'lucide-react';

export default function Home() {
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
            Marlon <span className="bg-gradient-to-r from-primary via-customWhite to-neonPurple bg-clip-text text-transparent font-black text-6xl md:text-8xl">Pecho</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary mb-4 leading-loose" data-aos="fade-up" data-aos-delay="400">
            Ingeniero de Sistemas & Desarrollador Full Stack
          </p>
          <p className="text-lg text-customWhite max-w-2xl mx-auto mb-8 leading-loose" data-aos="fade-up" data-aos-delay="600">
            Ingeniero de sistemas Marlon Pecho. Transformando ideas en soluciones digitales que impulsan negocios y cerrando brechas tecnológicas en Perú.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" data-aos="fade-up" data-aos-delay="800">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black mb-6 hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 glow" data-aos="fade-up" data-aos-delay="800">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-primary font-medium hover:text-secondary transition-colors">Disponible para proyectos</span>
            </div>
          </div>
          <div className="mt-8" data-aos="fade-up" data-aos-delay="1000">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="600">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">Python</span>
                  </div>
                  <p className="text-gray-300 text-sm">Desarrollo backend, scripting y análisis de datos</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">JavaScript</span>
                  </div>
                  <p className="text-gray-300 text-sm">Interactividad web y lógica del lado del cliente</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">HTML5</span>
                  </div>
                  <p className="text-gray-300 text-sm">Estructura semántica y accesibilidad web</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="900">
                  <div className="flex items-center space-x-2 mb-2">
                    <Palette size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">CSS3</span>
                  </div>
                  <p className="text-gray-300 text-sm">Diseño responsivo y animaciones modernas</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="1000">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">TypeScript</span>
                  </div>
                  <p className="text-gray-300 text-sm">Desarrollo tipado y mantenible</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="1100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">Next.js</span>
                  </div>
                  <p className="text-gray-300 text-sm">Aplicaciones web full-stack con SSR y optimización</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="1200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Atom size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">React</span>
                  </div>
                  <p className="text-gray-300 text-sm">Interfaces de usuario dinámicas y componentes reutilizables</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="1300">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">PostgreSQL</span>
                  </div>
                  <p className="text-gray-300 text-sm">Gestión de datos relacionales y consultas optimizadas</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="1400">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">Node.js</span>
                  </div>
                  <p className="text-gray-300 text-sm">APIs RESTful y servicios backend escalables</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-primary hover:bg-card/80 hover:-translate-y-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 glow" data-aos="fade-up" data-aos-delay="1500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server size={40} className="text-primary hover:text-secondary transition-all duration-300 filter hover:drop-shadow-[0_0_10px_rgba(1,195,142,0.8)] hover:scale-110 mb-2 glow" />
                    <span className="font-semibold">Django</span>
                  </div>
                  <p className="text-gray-300 text-sm">Framework web Python para desarrollo rápido y seguro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-card" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white" data-aos="fade-up" style={{ textShadow: '0 0 10px rgba(1, 195, 142, 0.5)' }}>Proyectos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Project 1: Ventify */}
            <div className="bg-card rounded-lg p-6 border border-primary hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 glow" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Ventify</h3>
                <span className="bg-primary text-accent px-2 py-1 rounded text-xs font-semibold flex items-center glow permanent-glow">
                  <CheckCircle size={12} className="mr-1" />
                  COMPLETADO
                </span>
              </div>
              <p className="text-gray-300 mb-4">Plataforma web completa para la venta de tickets de eventos. Sistema multi-rol (admin, proveedor, cliente) con dashboard de métricas, integración con Google Maps para ubicación de eventos y sistema de pago simulado seguro.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">🐍 Python</span>
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">Django</span>
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">PostgreSQL</span>
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">JavaScript</span>
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">HTML/CSS</span>
              </div>
              <div className="flex space-x-4 mb-3">
                <a href="https://ventify-one.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:text-secondary transition-colors glow">
                  <ExternalLink size={16} className="mr-1" />
                  Live Demo
                </a>
                <a href="https://github.com/Arcay322/Ventify" target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:text-secondary transition-colors glow">
                  <Github size={16} className="mr-1" />
                  Código
                </a>
              </div>
              <p className="text-sm text-gray-400">
                💼 Colaborador activo en el desarrollo
              </p>
            </div>

            {/* Project 2: Hotel-MP */}
            <div className="bg-card rounded-lg p-6 border border-primary hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 glow" data-aos="fade-up" data-aos-delay="400">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Hotel-MP</h3>
                <span className="bg-primary text-accent px-2 py-1 rounded text-xs font-semibold flex items-center glow permanent-glow">
                  <Clock size={12} className="mr-1" />
                  EN DESARROLLO
                </span>
              </div>
              <p className="text-gray-300 mb-4">Renovación digital del Hotel JW Marriott Lima. Sistema centralizado de gestión de reservas, panel de cliente con dashboard interactivo, gestión de servicios y notificaciones en tiempo real. Diseño elegante que refuerza la imagen de lujo del hotel.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">HTML5</span>
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">CSS3</span>
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">JavaScript</span>
                <span className="bg-primary/40 text-primary border-2 border-primary text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors glow">Supabase</span>
              </div>
              <div className="flex space-x-4 mb-3">
                <span className="px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold text-sm inline-flex items-center gap-2 glow">
                  🚧 Próximamente
                </span>
                <a href="https://github.com/MP-make/hotel-mp" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border-2 border-primary text-white font-semibold text-sm hover:border-primary transition-all inline-flex items-center gap-2 glow">
                  <Github size={16} />
                  Código
                </a>
              </div>
            </div>
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
