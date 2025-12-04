'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-accent/80 backdrop-blur-md border-b border-primary/20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="#home" className="text-customWhite font-bold text-xl hover:text-primary transition-colors">
              MP.Engineer
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#home" className="text-customWhite hover:text-primary transition-colors">Inicio</a>
            <a href="#about" className="text-customWhite hover:text-primary transition-colors">Sobre Mí</a>
            <a href="#projects" className="text-customWhite hover:text-primary transition-colors">Proyectos</a>
            <a href="#contact" className="text-customWhite hover:text-primary transition-colors">Contacto</a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-customWhite hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-accent/90 backdrop-blur-md rounded-lg mt-2 border border-primary/20">
              <a href="#home" className="text-customWhite hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Inicio</a>
              <a href="#about" className="text-customWhite hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Sobre Mí</a>
              <a href="#projects" className="text-customWhite hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Proyectos</a>
              <a href="#contact" className="text-customWhite hover:text-primary block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Contacto</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;