'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  message: string;
  rating: number;
  image: string;
  is_visible: boolean;
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data.filter((t: Testimonial) => t.is_visible !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || testimonials.length === 0) return null;

  const prev = () => setCurrent(c => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent(c => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <motion.section
      className="mb-20 sm:mb-32"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4 px-4">
          <span className="gradient-title drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">Recomendaciones</span>
        </h2>
        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${current * 100}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {testimonials.map((t) => (
              <div key={t.id} className="min-w-full px-2 sm:px-8">
                <div className="bg-card-bg border border-border-subtle rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center hover:border-cyan-500/30 transition-all duration-500">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-4 border-2 border-cyan-500/30" />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-dim mx-auto mb-4 flex items-center justify-center border-2 border-cyan-500/30">
                      <span className="text-2xl sm:text-3xl font-bold text-primary">{t.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-border-color'} />
                    ))}
                  </div>
                  <p className="text-text-secondary text-base sm:text-lg leading-relaxed italic mb-6 max-w-2xl mx-auto">
                    &ldquo;{t.message}&rdquo;
                  </p>
                  <div>
                    <p className="text-text-primary font-bold text-lg">{t.name}</p>
                    <p className="text-text-muted text-sm">{[t.role, t.company].filter(Boolean).join(' — ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {testimonials.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 w-10 h-10 rounded-full bg-card-bg border border-border-color flex items-center justify-center text-text-secondary hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-10 shadow-lg">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 w-10 h-10 rounded-full bg-card-bg border border-border-color flex items-center justify-center text-text-secondary hover:text-cyan-400 hover:border-cyan-500/50 transition-all z-10 shadow-lg">
              <ChevronRight size={20} />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-cyan-400 w-6' : 'bg-border-color hover:bg-cyan-400/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
}
