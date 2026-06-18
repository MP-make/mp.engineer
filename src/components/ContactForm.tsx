'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactForm = () => {
  const { t } = useLanguage();
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

      setSubmitMessage(`✅ ${t.contact.submitSuccess}`);
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setSubmitMessage(
        error instanceof Error 
          ? `❌ ${error.message}` 
          : `❌ ${t.contact.submitError}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-secondary">{t.contact.name}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.contact.name}
            className="w-full px-4 py-3 bg-input border border-border text-foreground placeholder-text-muted rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-secondary">{t.contact.email}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.contact.email}
            className="w-full px-4 py-3 bg-input border border-border text-foreground placeholder-text-muted rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-text-secondary">{t.contact.message}</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder={t.contact.message}
            className="w-full px-4 py-3 bg-input border border-border text-foreground placeholder-text-muted rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all outline-none resize-none"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? `${t.contact.send}...` : t.contact.send}
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