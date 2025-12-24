import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

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
    <html lang="es" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-[#0f172a]">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
