ALTER TABLE public.portfolio_project
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
