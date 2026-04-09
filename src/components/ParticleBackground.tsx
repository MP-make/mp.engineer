"use client";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    // Aseguramos que el contenedor no bloquee clics accidentales si sobresale, 
    // pero el canvas interno sí detectará el hover gracias a la config de tsParticles
    <div className="fixed inset-0 -z-10 bg-[#020617] pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#020617] to-[#020617] -z-10"></div>
      
      <Particles
        id="tsparticles"
        className="w-full h-full absolute inset-0 pointer-events-auto" // Reactivamos pointer events solo para el canvas
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          fpsLimit: 120,
          background: { color: { value: "transparent" } },
          particles: {
            color: { value: ["#00e1ff", "#ffffff", "#0ea5e9"] },
            links: {
              color: "#00e1ff",
              distance: 150,
              enable: true,
              opacity: 0.15,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.6,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "bounce" },
            },
            number: {
              // OPTIMIZACIÓN: Menos partículas por defecto, se ajusta por el área
              value: 60, 
              density: { enable: true, area: 1000 }, // Área más grande = menos densidad en móviles
            },
            opacity: { 
              value: { min: 0.1, max: 0.5 },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false,
              }
            },
            shape: { type: "circle" },
            size: { 
              value: { min: 1, max: 2.5 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5,
                sync: false,
              }
            },
          },
          interactivity: {
            // detectWindow asegura que el hover funcione incluso si hay divs transparentes encima
            detectsOn: "window", 
            events: {
              onHover: { enable: true, mode: "grab" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: {
                distance: 200,
                links: { opacity: 0.8, color: "#00e1ff" },
              },
              push: { quantity: 3 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}