'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Menu, X, Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const themeRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-400/20 group-hover:shadow-cyan-400/40 transition-all duration-300 group-hover:scale-105">
                <span className="font-bold text-sm">&lt;/&gt;</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-slate-200 font-bold text-lg group-hover:text-cyan-400 transition-colors">
                  Marlon Pecho
                </span>
                <p className="text-xs text-slate-400 -mt-0.5">
                  Full-Stack Developer
                </p>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.nav.home}</Link>
            <Link href="/sobre-mi" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.nav.about}</Link>
            <Link href="/proyectos" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.nav.projects}</Link>
            <Link href="/contacto" className="text-slate-300 hover:text-cyan-400 transition-colors">{t.nav.contact}</Link>
            
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900/40 backdrop-blur-md border border-slate-800 text-cyan-400 hover:border-cyan-400 transition-all duration-300"
              >
                <Globe size={18} />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800 shadow-xl overflow-hidden">
                  <button
                    onClick={() => { setLanguage('es'); setIsLangOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${language === 'es' ? 'bg-cyan-400/20 text-cyan-400' : 'text-slate-300 hover:bg-cyan-400/10'} transition-colors flex items-center gap-2`}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${language === 'en' ? 'bg-cyan-400/20 text-cyan-400' : 'text-slate-300 hover:bg-cyan-400/10'} transition-colors flex items-center gap-2`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false); }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900/40 backdrop-blur-md border border-slate-800 text-cyan-400 hover:border-cyan-400 transition-all duration-300"
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <ChevronDown size={14} className={`transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
              </button>
              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800 shadow-xl overflow-hidden">
                  <button
                    onClick={() => { setTheme('light'); setIsThemeOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${theme === 'light' ? 'bg-cyan-400/20 text-cyan-400' : 'text-slate-300 hover:bg-cyan-400/10'} transition-colors flex items-center gap-2`}
                  >
                    <Sun size={16} /> {t.theme.light}
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); setIsThemeOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${theme === 'dark' ? 'bg-cyan-400/20 text-cyan-400' : 'text-slate-300 hover:bg-cyan-400/10'} transition-colors flex items-center gap-2`}
                  >
                    <Moon size={16} /> {t.theme.dark}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language */}
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="p-2 rounded-lg bg-slate-900/40 backdrop-blur-md border border-slate-800 text-cyan-400 hover:border-cyan-400 transition-all"
            >
              <Globe size={20} />
            </button>
            {/* Mobile Theme */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-slate-900/40 backdrop-blur-md border border-slate-800 text-cyan-400 hover:border-cyan-400 transition-all"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-cyan-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-950/80 backdrop-blur-md rounded-lg mt-2 border border-slate-800">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</Link>
              <Link href="/sobre-mi" className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</Link>
              <Link href="/proyectos" className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.projects}</Link>
              <Link href="/contacto" className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;