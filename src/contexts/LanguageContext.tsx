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
    personal: string;
    company: string;
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
    contactInfo: string;
    socialMedia: string;
    sendMessage: string;
    whatsapp: string;
    github: string;
    linkedin: string;
    submitSuccess: string;
    submitError: string;
  };
  aboutPage: {
    title: string;
    description: string;
    downloadCV: string;
    experienceEducation: string;
    technologiesSkills: string;
    ctaTitle: string;
    ctaDesc: string;
    contactNow: string;
    yearsExp: string;
    projectsCompleted: string;
    satisfiedClients: string;
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
  project: {
    header: {
      landing: string;
      panels: string;
      roles: string;
      auth: string;
      name: string;
      role: string;
    };
    hero: {
      titlePlaceholder: string;
      descriptionPlaceholder: string;
      techPlaceholder: string;
      linkPlaceholder: string;
      githubPlaceholder: string;
      viewDemo: string;
      github: string;
      backHome: string;
    };
    sections: {
      landing: string;
      panels: string;
      roles: string;
      auth: string;
      landingTextPlaceholder: string;
      panelsTextPlaceholder: string;
      roleDescriptionPlaceholder: string;
      authTextPlaceholder: string;
      addRole: string;
      addImages: string;
    };
    edit: {
      edit: string;
      save: string;
      cancel: string;
    };
    loading: {
      loading: string;
      notFound: string;
      comingSoon: string;
    };
  };
}

const translations: Record<Language, Translations> = {
  es: {
    hero: {
      welcome: 'Bienvenido',
      greeting: 'Hola, soy',
      role: 'Desarrollador Full-Stack',
      description: 'Creando arquitecturas escalables con lógica robusta en Java y Python, optimización de bases de datos relacionales y experiencias frontend modernas.',
      available: 'Disponible para proyectos',
      connect: 'Conectemos',
      viewProjects: 'Ver Proyectos',
      slides: [
        { title: 'Bienvenido a mi Portafolio', subtitle: 'Creando arquitecturas escalables con Java, Python y bases de datos relacionales' },
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
      personal: 'Proyectos Personales',
      company: 'Proyectos de Empresa',
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
      contactInfo: 'Información de Contacto',
      socialMedia: 'Redes Sociales',
      sendMessage: 'Enviá un Mensaje',
      whatsapp: 'WhatsApp',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      submitSuccess: 'Mensaje enviado correctamente. Te responderé pronto!',
      submitError: 'Error al enviar. Por favor intenta nuevamente.',
    },
    aboutPage: {
      title: 'Sobre Mí',
      description: 'Soy Marlon Pecho, estudiante de Ingeniería de Sistemas Avanzados apasionado por el desarrollo web. Me especializo en crear soluciones digitales innovadoras que combinan diseño moderno con funcionalidad robusta.',
      downloadCV: 'Descargar CV',
      experienceEducation: 'Experiencia & Educación',
      technologiesSkills: 'Tecnologías & Habilidades',
      ctaTitle: '¿Listo para trabajar juntos?',
      ctaDesc: 'Si tienes un proyecto en mente o quieres discutir oportunidades de colaboración para llevar tus ideas al siguiente nivel, no dudes en contactarme.',
      contactNow: 'Contactar Ahora',
      yearsExp: 'Años de Experiencia',
      projectsCompleted: 'Proyectos Completados',
      satisfiedClients: 'Clientes Satisfechos',
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
    project: {
      header: {
        landing: 'Landing',
        panels: 'Paneles',
        roles: 'Roles',
        auth: 'Autenticación',
        name: 'Marlon Pecho',
        role: 'Desarrollador Full-Stack',
      },
      hero: {
        titlePlaceholder: 'Título del proyecto',
        descriptionPlaceholder: 'Descripción del proyecto',
        techPlaceholder: 'Tecnologías separadas por coma',
        linkPlaceholder: 'Enlace del proyecto',
        githubPlaceholder: 'Enlace de GitHub',
        viewDemo: 'Ver Demo',
        github: 'GitHub',
        backHome: 'Volver al inicio',
      },
      sections: {
        landing: 'Landing',
        panels: 'Paneles',
        roles: 'Roles',
        auth: 'Autenticación',
        landingTextPlaceholder: 'Escribe aquí la introducción...',
        panelsTextPlaceholder: 'Describe la galería o paneles del proyecto...',
        roleDescriptionPlaceholder: 'Descripción del rol',
        authTextPlaceholder: 'Describe las características de autenticación y seguridad...',
        addRole: 'Agregar Rol',
        addImages: 'Agregar Imágenes',
      },
      edit: {
        edit: 'Editar',
        save: 'Guardar',
        cancel: 'Cancelar',
      },
      loading: {
        loading: 'Cargando proyecto...',
        notFound: 'Proyecto no encontrado',
        comingSoon: 'Página Próximamente',
      },
    },
  },
  en: {
    hero: {
      welcome: 'Welcome',
      greeting: "Hi, I'm",
      role: 'Full-Stack Developer',
      description: 'Building scalable architectures with robust logic in Java and Python, relational database optimization, and modern frontend experiences.',
      available: 'Available for projects',
      connect: "Let's Connect",
      viewProjects: 'View Projects',
      slides: [
        { title: 'Welcome to my Portfolio', subtitle: 'Building scalable architectures with Java, Python and relational databases' },
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
      personal: 'Personal Projects',
      company: 'Company Projects',
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
      contactInfo: 'Contact Information',
      socialMedia: 'Social Media',
      sendMessage: 'Send a Message',
      whatsapp: 'WhatsApp',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      submitSuccess: 'Message sent successfully. I will reply soon!',
      submitError: 'Error sending. Please try again.',
    },
    aboutPage: {
      title: 'About Me',
      description: "I'm Marlon Pecho, an advanced Systems Engineering student passionate about web development. I specialize in creating innovative digital solutions that combine modern design with robust functionality.",
      downloadCV: 'Download CV',
      experienceEducation: 'Experience & Education',
      technologiesSkills: 'Technologies & Skills',
      ctaTitle: 'Ready to work together?',
      ctaDesc: "If you have a project in mind or want to discuss collaboration opportunities to take your ideas to the next level, don't hesitate to contact me.",
      contactNow: 'Contact Now',
      yearsExp: 'Years of Experience',
      projectsCompleted: 'Projects Completed',
      satisfiedClients: 'Satisfied Clients',
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
    project: {
      header: {
        landing: 'Landing',
        panels: 'Panels',
        roles: 'Roles',
        auth: 'Authentication',
        name: 'Marlon Pecho',
        role: 'Full-Stack Developer',
      },
      hero: {
        titlePlaceholder: 'Project Title',
        descriptionPlaceholder: 'Project Description',
        techPlaceholder: 'Technologies separated by comma',
        linkPlaceholder: 'Project Link',
        githubPlaceholder: 'GitHub Link',
        viewDemo: 'View Demo',
        github: 'GitHub',
        backHome: 'Back to Home',
      },
      sections: {
        landing: 'Landing',
        panels: 'Panels',
        roles: 'Roles',
        auth: 'Authentication',
        landingTextPlaceholder: 'Write the introduction here...',
        panelsTextPlaceholder: 'Describe the gallery or panels of the project...',
        roleDescriptionPlaceholder: 'Role description',
        authTextPlaceholder: 'Describe the authentication and security features...',
        addRole: 'Add Role',
        addImages: 'Add Images',
      },
      edit: {
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
      },
      loading: {
        loading: 'Loading project...',
        notFound: 'Project not found',
        comingSoon: 'Page Coming Soon',
      },
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
