'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  type: 'work' | 'education';
}

interface TimelineProps {
  events: TimelineEvent[];
}

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const words = event.description.split(/\s+/);
  const preview = words.slice(0, 3).join(' ') + '...';

  return (
    <motion.div
      className="relative flex items-start"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="absolute left-6 w-4 h-4 bg-cyan-400 rounded-full border-4 border-slate-950 z-10 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]"></div>

      <div className="ml-20 bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-800 p-6 hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:-translate-y-1 transition-all duration-300 flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-200 mb-1">{event.title}</h3>
            <p className="text-cyan-400 font-medium text-sm sm:text-base">{event.subtitle}</p>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 mt-2 md:mt-0 shrink-0">{event.date}</span>
        </div>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base pt-1">{event.description}</p>
            </motion.div>
          ) : (
            <motion.p
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-500 text-sm italic"
            >
              {preview}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-400 transition-all duration-300 ease-out hover:border-cyan-400 hover:bg-cyan-500/10"
        >
          {expanded ? 'Cerrar' : 'Leer más'}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-all duration-300 ease-out ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="mt-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            event.type === 'work'
              ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/30'
              : 'bg-slate-700 text-slate-300 border border-slate-600'
          }`}>
            {event.type === 'work' ? '💼 Trabajo' : '🎓 Educación'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-slate-700 to-transparent"></div>

      <div className="space-y-10">
        {events.map((event, index) => (
          <TimelineCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}