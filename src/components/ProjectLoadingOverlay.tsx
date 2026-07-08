'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  t?: {
    hero?: {
      viewProjects?: string;
    };
  };
}

export default function ProjectLoadingOverlay({ t }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        router.push('/proyectos');
      }, 400);
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 bg-transparent border border-border-color text-text-secondary px-5 py-2.5 rounded-full hover:border-cyan-500/50 hover:bg-hover-bg transition-all duration-300 hover:-translate-y-1 text-sm md:text-base shrink-0"
      >
        {t?.hero?.viewProjects || 'Ver Proyectos'}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </button>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {/* Spinning ring */}
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-border-color/30"
                />
                <motion.circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#loadingGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(progress / 100) * 263.9} ${263.9 - (progress / 100) * 263.9}`}
                  className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                />
                <defs>
                  <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Percentage in center */}
              <span className="absolute inset-0 flex items-center justify-center text-lg font-mono font-bold text-cyan-400">
                {Math.round(progress)}%
              </span>
            </div>

            <p className="mt-8 text-text-secondary text-sm font-mono tracking-wide">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Cargando proyectos...
              </motion.span>
            </p>

            {/* Mini progress bar */}
            <div className="mt-6 w-48 h-[2px] rounded-full bg-border-color/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={{ scaleX: progress / 100, transformOrigin: 'left' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
