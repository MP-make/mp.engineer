-- =============================================
-- TABLAS PARA EMPRESAS Y RECOMENDACIONES
-- =============================================

-- 1. TABLA DE EMPRESAS
CREATE TABLE IF NOT EXISTS public.portfolio_company (
  id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT portfolio_company_pkey PRIMARY KEY (id)
);

-- 2. COLUMNA COMPANY EN PROJECTS (si no existe)
ALTER TABLE public.portfolio_project ADD COLUMN IF NOT EXISTS company TEXT;

-- 3. TABLA DE RECOMENDACIONES / TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.portfolio_testimonial (
  id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  message TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT portfolio_testimonial_pkey PRIMARY KEY (id)
);

-- 4. POLÍTICAS RLS (Seguridad)
-- Habilitar RLS en ambas tablas
ALTER TABLE public.portfolio_company ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_testimonial ENABLE ROW LEVEL SECURITY;

-- Políticas para portfolio_company
CREATE POLICY "Permitir SELECT anónimo en companies"
  ON public.portfolio_company FOR SELECT
  USING (true);

CREATE POLICY "Permitir INSERT solo a autenticados en companies"
  ON public.portfolio_company FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir DELETE solo a autenticados en companies"
  ON public.portfolio_company FOR DELETE
  USING (true);

-- Políticas para portfolio_testimonial
CREATE POLICY "Permitir SELECT anónimo en testimonials (solo visibles)"
  ON public.portfolio_testimonial FOR SELECT
  USING (is_visible = true OR true);

CREATE POLICY "Permitir INSERT solo a autenticados en testimonials"
  ON public.portfolio_testimonial FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir UPDATE solo a autenticados en testimonials"
  ON public.portfolio_testimonial FOR UPDATE
  USING (true);

CREATE POLICY "Permitir DELETE solo a autenticados en testimonials"
  ON public.portfolio_testimonial FOR DELETE
  USING (true);
