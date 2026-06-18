'use client';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import { Mail, Github, ExternalLink, MessageSquare, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contacto() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-surface-alt relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <Navbar />
      <main className="pt-20 pb-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-title mb-6 tracking-tight">
              {t.contact.title}
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              {t.contact.description}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-text-secondary mb-8">
                {t.contact.contactInfo}
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-tag-bg backdrop-blur-xl border border-border-color rounded-2xl hover:border-cyan-500/30 hover:bg-hover-bg transition-all duration-300">
                  <div className="p-3 bg-primary-dim border border-border-subtle rounded-xl">
                    <Mail className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{t.contact.email}</p>
                    <p className="text-text-secondary font-medium">marlonpecho264@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-tag-bg backdrop-blur-xl border border-border-color rounded-2xl hover:border-cyan-500/30 hover:bg-hover-bg transition-all duration-300">
                  <div className="p-3 bg-primary-dim border border-border-subtle rounded-xl">
                    <Github className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{t.contact.github}</p>
                    <a
                      href="https://github.com/MP-make"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary font-medium hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      MP-make
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-tag-bg backdrop-blur-xl border border-border-color rounded-2xl hover:border-cyan-500/30 hover:bg-hover-bg transition-all duration-300">
                  <div className="p-3 bg-primary-dim border border-border-subtle rounded-xl">
                    <MessageSquare className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{t.contact.whatsapp}</p>
                    <a
                      href="https://wa.me/51907326121"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary font-medium hover:text-cyan-400 transition-colors"
                    >
                      +51 907-326-121
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-tag-bg backdrop-blur-xl border border-border-color rounded-2xl hover:border-cyan-500/30 hover:bg-hover-bg transition-all duration-300">
                  <div className="p-3 bg-primary-dim border border-border-subtle rounded-xl">
                    <Linkedin className="text-cyan-400" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">{t.contact.linkedin}</p>
                    <a
                      href="https://www.linkedin.com/in/marlon-pecho-530443385/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary font-medium hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      Marlon Pecho
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-semibold text-text-secondary mb-6">
                  {t.contact.socialMedia}
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/MP-make"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-tag-bg backdrop-blur-xl border border-border-color text-cyan-400 hover:border-cyan-500/30 hover:bg-hover-bg transition-all duration-300 hover:scale-110"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/marlon-pecho-530443385/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-tag-bg backdrop-blur-xl border border-border-color text-cyan-400 hover:border-cyan-500/30 hover:bg-hover-bg transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="https://wa.me/51907326121"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-tag-bg backdrop-blur-xl border border-border-color text-cyan-400 hover:border-cyan-500/30 hover:bg-hover-bg transition-all duration-300 hover:scale-110"
                  >
                    <MessageSquare size={24} />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-text-secondary mb-8">
                {t.contact.sendMessage}
              </h2>
              <div className="bg-tag-bg backdrop-blur-xl border border-border-color rounded-2xl p-8">
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}