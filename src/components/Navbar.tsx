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
    <nav className={`fixed top-0 w-full ${theme === 'dark' ? 'bg-accent/80' : 'bg-white/80'} backdrop-blur-md border-b ${theme === 'dark' ? 'border-primary/20' : 'border-gray-200'} z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="#home" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-900'} font-bold text-xl hover:text-primary transition-colors`}>
              MP.Engineer
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#home" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.nav.home}</a>
            <a href="#about" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.nav.about}</a>
            <a href="#projects" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.nav.projects}</a>
            <a href="#contact" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary transition-colors`}>{t.nav.contact}</a>
            
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all duration-300`}
              >
                <Globe size={18} />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className={`absolute right-0 mt-2 w-32 rounded-xl ${theme === 'dark' ? 'bg-[#1e2432] border-primary/30' : 'bg-white border-gray-200'} border shadow-xl overflow-hidden`}>
                  <button
                    onClick={() => { setLanguage('es'); setIsLangOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${language === 'es' ? 'bg-primary/20 text-primary' : theme === 'dark' ? 'text-white hover:bg-primary/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setIsLangOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${language === 'en' ? 'bg-primary/20 text-primary' : theme === 'dark' ? 'text-white hover:bg-primary/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
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
                className={`flex items-center gap-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all duration-300`}
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                <ChevronDown size={14} className={`transition-transform ${isThemeOpen ? 'rotate-180' : ''}`} />
              </button>
              {isThemeOpen && (
                <div className={`absolute right-0 mt-2 w-32 rounded-xl ${theme === 'dark' ? 'bg-[#1e2432] border-primary/30' : 'bg-white border-gray-200'} border shadow-xl overflow-hidden`}>
                  <button
                    onClick={() => { setTheme('light'); setIsThemeOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${theme === 'light' ? 'bg-primary/20 text-primary' : theme === 'dark' ? 'text-white hover:bg-primary/10' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
                  >
                    <Sun size={16} /> {t.theme.light}
                  </button>
                  <button
                    onClick={() => { setTheme('dark'); setIsThemeOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'text-gray-700 hover:bg-gray-100'} transition-colors flex items-center gap-2`}
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
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all`}
            >
              <Globe size={20} />
            </button>
            {/* Mobile Theme */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 hover:bg-primary/20' : 'bg-gray-100 hover:bg-gray-200'} text-primary transition-all`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${theme === 'dark' ? 'bg-accent/90' : 'bg-white/90'} backdrop-blur-md rounded-lg mt-2 border ${theme === 'dark' ? 'border-primary/20' : 'border-gray-200'}`}>
              <a href="#home" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.nav.home}</a>
              <a href="#about" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.nav.about}</a>
              <a href="#projects" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.nav.projects}</a>
              <a href="#contact" className={`${theme === 'dark' ? 'text-customWhite' : 'text-gray-700'} hover:text-primary block px-3 py-2 rounded-md text-base font-medium`} onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;