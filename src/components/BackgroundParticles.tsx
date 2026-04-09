'use client';

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const particlesOptions = {
  background: {
    color: {
      value: "#0a0f1c",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#00e1ff",
    },
    links: {
      color: "#00e1ff",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.2,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};

export default function BackgroundParticles() {
  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <Particles
    id="tsparticles"
    init={particlesInit}
    options={particlesOptions as any}
    className="absolute inset-0 opacity-20 pointer-events-none"
    />
  );
}