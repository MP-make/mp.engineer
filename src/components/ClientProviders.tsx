'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthProvider from './AuthProvider';
import { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}