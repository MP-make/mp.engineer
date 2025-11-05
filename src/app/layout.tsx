import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
