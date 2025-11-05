'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

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
      // Configurar EmailJS - Reemplazar con tus IDs reales de https://www.emailjs.com/
      await emailjs.send(
        'YOUR_SERVICE_ID',      // ← Obtener de EmailJS
        'YOUR_TEMPLATE_ID',     // ← Obtener de EmailJS
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'marlonpecho264@gmail.com'  // ← TU EMAIL
        },
        'YOUR_PUBLIC_KEY'       // ← Obtener de EmailJS
      );

      setSubmitMessage('✅ Mensaje enviado correctamente. Te responderé pronto!');
      setFormData({ name: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('❌ Error al enviar. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-secondary border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-secondary border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-secondary border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-secondary disabled:bg-secondary text-accent px-4 py-2 rounded-md font-semibold transition-colors"
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