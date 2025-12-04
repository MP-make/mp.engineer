'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import AuthProvider from './AuthProvider';
import { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}