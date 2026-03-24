import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import { Mail, Smartphone, Github, ExternalLink } from 'lucide-react';

export default function Contacto() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-6">
              Contacto
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              ¿Tienes un proyecto en mente o quieres colaborar? Estoy disponible para discutir
              oportunidades de desarrollo web y soluciones tecnológicas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800">
                  <div className="p-3 bg-cyan-400/10 rounded-xl">
                    <Mail className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-slate-200 font-medium">marlonpecho264@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800">
                  <div className="p-3 bg-cyan-400/10 rounded-xl">
                    <Smartphone className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Teléfono</p>
                    <p className="text-slate-200 font-medium">+51 907-326-121</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800">
                  <div className="p-3 bg-cyan-400/10 rounded-xl">
                    <Github className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">GitHub</p>
                    <a
                      href="https://github.com/MP-make"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-200 font-medium hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      MP-make
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">
                  Redes Sociales
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/MP-make"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800 text-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/marlon-pecho-530443385/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800 text-cyan-400 hover:border-cyan-400 transition-all hover:scale-110"
                  >
                    <ExternalLink size={24} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-6">
                Envía un Mensaje
              </h2>
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}