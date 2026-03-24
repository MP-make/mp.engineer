import { motion } from 'framer-motion';

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

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Línea vertical con degradado */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-slate-700 to-transparent"></div>

      <div className="space-y-12">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className="relative flex items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Punto en la línea con brillo */}
            <div className="absolute left-6 w-4 h-4 bg-cyan-400 rounded-full border-4 border-slate-950 z-10 shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]"></div>

            {/* Tarjeta con glassmorphism premium */}
            <div className="ml-20 bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-800 p-6 hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-200 mb-1">{event.title}</h3>
                  <p className="text-cyan-400 font-medium">{event.subtitle}</p>
                </div>
                <span className="text-sm text-slate-400 mt-2 md:mt-0">{event.date}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{event.description}</p>
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
        ))}
      </div>
    </div>
  );
}