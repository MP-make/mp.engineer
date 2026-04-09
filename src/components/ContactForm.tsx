'use client';

import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }

      setSubmitMessage('✅ Mensaje enviado correctamente. Te responderé pronto!');
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setSubmitMessage(
        error instanceof Error 
          ? `❌ ${error.message}` 
          : '❌ Error al enviar. Por favor intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-200">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="w-full px-4 py-3 bg-slate-900/40 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-200">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 bg-slate-900/40 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-slate-200">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Cuéntame sobre tu proyecto..."
            className="w-full px-4 py-3 bg-slate-900/40 border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none resize-none"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
        {submitMessage && (
          <p className={`text-sm ${submitMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {submitMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;