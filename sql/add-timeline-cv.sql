-- Create portfolio_timeline table for experience & education
CREATE TABLE IF NOT EXISTS public.portfolio_timeline (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('work', 'education')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT portfolio_timeline_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.portfolio_timeline ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public Read Timeline" ON public.portfolio_timeline;
CREATE POLICY "Public Read Timeline" ON public.portfolio_timeline FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Timeline" ON public.portfolio_timeline;
CREATE POLICY "Admin All Timeline" ON public.portfolio_timeline FOR ALL USING (auth.role() = 'authenticated');

-- Insert default data
INSERT INTO public.portfolio_timeline (title, subtitle, description, date, type, sort_order) VALUES
('Desarrollador Full-Stack', 'Consigueventas - Agencia de Marketing Digital', 'Lidero el desarrollo y mantenimiento de ecosistemas web profesionales, desde sitios corporativos hasta e-commerce complejos. Mi enfoque principal es la optimización de performance y la creación de interfaces modernas que impulsan la conversión de clientes. Proyectos clave: pvelectronica.com.pe, effetha.com, consigueventas.com. Stack: Next.js, React, WordPress Avanzado.', '2025 — Presente', 'work', 1),
('Co-Founder & Desarrollador Principal', 'Ventify - Plataforma SaaS de Gestión de Ventas', 'Diseño y mantengo la arquitectura técnica de una solución SaaS que automatiza inventarios y ventas. He logrado que negocios locales incrementen su eficiencia operativa y sus ventas significativamente mediante la digitalización. Impacto: Arquitectura escalable y gestión de flujos de pago integrados. Stack: React, Firebase, Stripe, PostgreSQL.', '2024 — Presente', 'work', 2),
('Voluntario de Sistemas', 'Poder Judicial de Ica', 'Apoyo técnico especializado en el área de sistemas, colaborando en la gestión de infraestructura digital y soporte técnico dentro de la institución para optimizar los procesos judiciales electrónicos. Enfoque: Soporte de sistemas, gestión de redes y software institucional.', '2025 (Periodo de 6 meses)', 'work', 3),
('Desarrollador Web Freelance', 'Proyectos Independientes', 'Cuatro años brindando soluciones digitales a medida para pymes y emprendedores. Especializado en el despliegue rápido de sitios web funcionales, seguros y optimizados para SEO. Experiencia: Más de 10 proyectos entregados con éxito en diversos sectores.', '2021 — Presente', 'work', 4),
('Ingeniería de Sistemas e Informática', 'Universidad Tecnológica del Perú (UTP)', 'Formación técnica sólida con énfasis en ingeniería de software, seguridad de la información y gestión de proyectos tecnológicos en el Perú.', 'En curso (Ciclo Final)', 'education', 5);

-- Create portfolio_cv table to track CV file updates
CREATE TABLE IF NOT EXISTS public.portfolio_cv (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT portfolio_cv_pkey PRIMARY KEY (id)
);

ALTER TABLE public.portfolio_cv ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read CV" ON public.portfolio_cv;
CREATE POLICY "Public Read CV" ON public.portfolio_cv FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All CV" ON public.portfolio_cv;
CREATE POLICY "Admin All CV" ON public.portfolio_cv FOR ALL USING (auth.role() = 'authenticated');
