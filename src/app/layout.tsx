import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "MP.Engineer - Portafolio",
  description: "Portafolio profesional Marlon Pecho, Estudiante de Ingeniería de Sistemas Avanzados y Desarrollador Full-Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-slate-950">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
