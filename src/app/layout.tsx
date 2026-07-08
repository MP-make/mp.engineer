import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from 'next/font/google';
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import ParticleBackground from "@/components/ParticleBackground";
import LockoutGuard from "@/components/LockoutGuard";
import RouteLoadingBar from "@/components/RouteLoadingBar";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Marlon Pecho - Portafolio",
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
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased relative overflow-x-hidden bg-background">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
              } catch(e) {}
            })();
          `}
        </Script>
        <ClientProviders>
          <RouteLoadingBar />
          <LockoutGuard>
            {children}
          </LockoutGuard>
          <ParticleBackground />
        </ClientProviders>
      </body>
    </html>
  );
}
