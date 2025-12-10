'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface Translations {
  hero: {
    welcome: string;
    greeting: string;
    role: string;
    description: string;
    available: string;
    connect: string;
    viewProjects: string;
    slides: {
      title: string;
      subtitle: string;
    }[];
  };
  about: {
    title: string;
    professionalSummary: string;
    professionalDescription: string;
    experience: string;
    skills: string;
    fullStack: string;
    fullStackDesc: string;
    dataManagement: string;
    dataManagementDesc: string;
    uxui: string;
    uxuiDesc: string;
  };
  services: {
    title: string;
    subtitle: string;
    services: {
      title: string;
      description: string;
    }[];
  };
  projects: {
    title: string;
    subtitle: string;
    completed: string;
    inProgress: string;
    techStack: string;
    noTech: string;
    viewDemo: string;
    viewMore: string;
    visitGithub: string;
  };
  contact: {
    title: string;
    connect: string;
    description: string;
    name: string;
    email: string;
    message: string;
    send: string;
  };
  footer: {
    rights: string;
  };
  nav: {
    home: string;
    about: string;
    projects: string;
    contact: string;
    services: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
  };
}

const translations: Record<Language, Translations> = {
  es: {
    hero: {
      welcome: 'Bienvenido',
      greeting: 'Hola, soy',
      role: 'Desarrollador Full-Stack',
      description: 'Transformando ideas en experiencias digitales excepcionales. Especializado en crear soluciones web modernas, escalables y centradas en el usuario.',
      available: 'Disponible para proyectos',
      connect: 'Conectemos',
      viewProjects: 'Ver Proyectos',
      slides: [
        { title: 'Bienvenido a mi Portafolio', subtitle: 'Donde las ideas cobran vida digital' },
        { title: 'Desarrollador Full-Stack', subtitle: 'Especializado en React, Next.js y Python' },
        { title: '+5 Proyectos Completados', subtitle: 'Soluciones web modernas y escalables' },
        { title: 'Basado en Perú', subtitle: 'Disponible para proyectos remotos en todo el mundo' },
      ]
    },
    about: {
      title: 'Sobre Mí',
      professionalSummary: 'Resumen Profesional',
      professionalDescription: 'Como estudiante avanzado de Ingeniería de Sistemas, me especializo en desarrollo full-stack con enfoque en tecnologías modernas. Mi experiencia abarca desde gestión de datos backend hasta interfaces frontend intuitivas, siempre priorizando soluciones limpias, eficientes y escalables.',
      experience: 'Experiencia',
      skills: 'Habilidades',
      fullStack: 'Desarrollo Full-Stack',
      fullStackDesc: 'Construyendo aplicaciones web end-to-end usando frameworks y mejores prácticas modernas.',
      dataManagement: 'Gestión de Datos',
      dataManagementDesc: 'Diseñando e implementando soluciones eficientes de bases de datos y pipelines de procesamiento de datos.',
      uxui: 'Diseño UX/UI',
      uxuiDesc: 'Creando interfaces de usuario intuitivas con atención a la experiencia del usuario.',
    },
    services: {
      title: 'Servicios',
      subtitle: 'Lo que ofrezco',
      services: [
        { title: 'Desarrollo Web', description: 'Creación de sitios web modernos y escalables.' },
        { title: 'Gestión de Datos', description: 'Soluciones eficientes para bases de datos.' },
        { title: 'Diseño UX/UI', description: 'Interfaces intuitivas y centradas en el usuario.' },
      ]
    },
    projects: {
      title: 'Proyectos',
      subtitle: 'Soluciones innovadoras construidas con las últimas tecnologías',
      completed: 'COMPLETADO',
      inProgress: 'EN DESARROLLO',
      techStack: 'Stack Tecnológico',
      noTech: 'Sin tecnologías especificadas',
      viewDemo: 'Ver Demo',
      viewMore: '¿Quieres ver más de mi trabajo?',
      visitGithub: 'Visita mi GitHub',
    },
    contact: {
      title: 'Contacto',
      connect: 'Conectemos',
      description: 'Siempre estoy interesado en nuevas oportunidades y colaboraciones. ¡No dudes en contactarme!',
      name: 'Nombre',
      email: 'Correo electrónico',
      message: 'Mensaje',
      send: 'Enviar mensaje',
    },
    footer: {
      rights: 'Todos los derechos reservados.',
    },
    nav: {
      home: 'Inicio',
      about: 'Sobre Mí',
      projects: 'Proyectos',
      contact: 'Contacto',
      services: 'Servicios',
    },
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },
  },
  en: {
    hero: {
      welcome: 'Welcome',
      greeting: "Hi, I'm",
      role: 'Full-Stack Developer',
      description: 'Transforming ideas into exceptional digital experiences. Specialized in creating modern, scalable, and user-centered web solutions.',
      available: 'Available for projects',
      connect: "Let's Connect",
      viewProjects: 'View Projects',
      slides: [
        { title: 'Welcome to my Portfolio', subtitle: 'Where ideas come to digital life' },
        { title: 'Full-Stack Developer', subtitle: 'Specialized in React, Next.js and Python' },
        { title: '+5 Completed Projects', subtitle: 'Modern and scalable web solutions' },
        { title: 'Based in Peru', subtitle: 'Available for remote projects worldwide' },
      ]
    },
    about: {
      title: 'About Me',
      professionalSummary: 'Professional Summary',
      professionalDescription: 'As an advanced Systems Engineering student, I specialize in full-stack development with a focus on modern technologies. My experience spans from backend data management to intuitive frontend interfaces, always prioritizing clean, efficient, and scalable solutions.',
      experience: 'Experience',
      skills: 'Skills',
      fullStack: 'Full-Stack Development',
      fullStackDesc: 'Building end-to-end web applications using modern frameworks and best practices.',
      dataManagement: 'Data Management',
      dataManagementDesc: 'Designing and implementing efficient database solutions and data processing pipelines.',
      uxui: 'UX/UI Design',
      uxuiDesc: 'Creating intuitive user interfaces with attention to user experience.',
    },
    services: {
      title: 'Services',
      subtitle: 'What I offer',
      services: [
        { title: 'Web Development', description: 'Creating modern and scalable websites.' },
        { title: 'Data Management', description: 'Efficient solutions for databases.' },
        { title: 'UX/UI Design', description: 'Intuitive and user-centered interfaces.' },
      ]
    },
    projects: {
      title: 'Projects',
      subtitle: 'Innovative solutions built with the latest technologies',
      completed: 'COMPLETED',
      inProgress: 'IN PROGRESS',
      techStack: 'Tech Stack',
      noTech: 'No technologies specified',
      viewDemo: 'View Demo',
      viewMore: 'Want to see more of my work?',
      visitGithub: 'Visit my GitHub',
    },
    contact: {
      title: 'Contact',
      connect: "Let's Connect",
      description: "I'm always interested in new opportunities and collaborations. Don't hesitate to reach out!",
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send message',
    },
    footer: {
      rights: 'All rights reserved.',
    },
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      contact: 'Contact',
      services: 'Services',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
