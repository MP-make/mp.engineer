import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import ParticleBackground from "@/components/ParticleBackground";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "MP.Engineer - Portafolio",
  description: "Portafolio profesional Marlon Pecho, Estudiante de Ingeniería de Sistemas Avanzados y Desarrollador Full-Stack.",
  icons: {
    icon: '/faviconlimpio.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-slate-950 relative overflow-x-hidden">
        <ClientProviders>
          {children}
        </ClientProviders>
        <ParticleBackground />
      </body>
    </html>
  );
}
