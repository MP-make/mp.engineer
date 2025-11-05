'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-customWhite hover:text-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
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