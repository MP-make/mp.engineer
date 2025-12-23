-- Alterar el campo image para permitir URLs más largas
ALTER TABLE portfolio_projectimage 
ALTER COLUMN image TYPE VARCHAR(500);

-- Verificar que el cambio se aplicó
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'portfolio_projectimage' 
AND column_name = 'image';

-- Agregar campo description a la tabla portfolio_skill
ALTER TABLE portfolio_skill 
ADD COLUMN IF NOT EXISTS description VARCHAR(500);

-- Verificar que el cambio se aplicó
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'portfolio_skill' 
ORDER BY ordinal_position;

-- Crear tabla para imágenes del Hero
CREATE TABLE IF NOT EXISTS portfolio_heroimage (
    id SERIAL PRIMARY KEY,
    image VARCHAR(500) NOT NULL,
    title VARCHAR(200),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas (por seguridad)
ALTER TABLE public.portfolio_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_skill ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_heroimage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projectimage ENABLE ROW LEVEL SECURITY;

-- --- POLÍTICAS PARA PROYECTOS ---
DROP POLICY IF EXISTS "Public Read Projects" ON public.portfolio_project;
CREATE POLICY "Public Read Projects" ON public.portfolio_project FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Select Projects" ON public.portfolio_project;
CREATE POLICY "Admin Select Projects" ON public.portfolio_project FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Insert Projects" ON public.portfolio_project;
CREATE POLICY "Admin Insert Projects" ON public.portfolio_project FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Update Projects" ON public.portfolio_project;
CREATE POLICY "Admin Update Projects" ON public.portfolio_project FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Delete Projects" ON public.portfolio_project;
CREATE POLICY "Admin Delete Projects" ON public.portfolio_project FOR DELETE USING (auth.role() = 'authenticated');

-- --- POLÍTICAS PARA SKILLS ---
DROP POLICY IF EXISTS "Public Read Skills" ON public.portfolio_skill;
CREATE POLICY "Public Read Skills" ON public.portfolio_skill FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Select Skills" ON public.portfolio_skill;
CREATE POLICY "Admin Select Skills" ON public.portfolio_skill FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Insert Skills" ON public.portfolio_skill;
CREATE POLICY "Admin Insert Skills" ON public.portfolio_skill FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Update Skills" ON public.portfolio_skill;
CREATE POLICY "Admin Update Skills" ON public.portfolio_skill FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Delete Skills" ON public.portfolio_skill;
CREATE POLICY "Admin Delete Skills" ON public.portfolio_skill FOR DELETE USING (auth.role() = 'authenticated');

-- --- POLÍTICAS PARA HERO IMAGES ---
DROP POLICY IF EXISTS "Public Read Hero" ON public.portfolio_heroimage;
CREATE POLICY "Public Read Hero" ON public.portfolio_heroimage FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Select Hero" ON public.portfolio_heroimage;
CREATE POLICY "Admin Select Hero" ON public.portfolio_heroimage FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Insert Hero" ON public.portfolio_heroimage;
CREATE POLICY "Admin Insert Hero" ON public.portfolio_heroimage FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Update Hero" ON public.portfolio_heroimage;
CREATE POLICY "Admin Update Hero" ON public.portfolio_heroimage FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Delete Hero" ON public.portfolio_heroimage;
CREATE POLICY "Admin Delete Hero" ON public.portfolio_heroimage FOR DELETE USING (auth.role() = 'authenticated');

-- --- POLÍTICAS PARA CONTACTO ---
-- (El admin necesita poder LEER y BORRAR mensajes recibidos)
DROP POLICY IF EXISTS "Admin Select Contacts" ON public.portfolio_contact;
CREATE POLICY "Admin Select Contacts" ON public.portfolio_contact FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Insert Contacts" ON public.portfolio_contact;
CREATE POLICY "Admin Insert Contacts" ON public.portfolio_contact FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Update Contacts" ON public.portfolio_contact;
CREATE POLICY "Admin Update Contacts" ON public.portfolio_contact FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Delete Contacts" ON public.portfolio_contact;
CREATE POLICY "Admin Delete Contacts" ON public.portfolio_contact FOR DELETE USING (auth.role() = 'authenticated');

-- (Opcional: Si el insert público no usa Service Key, descomentar esta línea)
-- CREATE POLICY "Public Insert Contact" ON public.portfolio_contact FOR INSERT WITH CHECK (true);

-- --- POLÍTICAS PARA IMÁGENES SECUNDARIAS ---
DROP POLICY IF EXISTS "Public Read ProjectImages" ON public.portfolio_projectimage;
CREATE POLICY "Public Read ProjectImages" ON public.portfolio_projectimage FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin Select ProjectImages" ON public.portfolio_projectimage;
CREATE POLICY "Admin Select ProjectImages" ON public.portfolio_projectimage FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Insert ProjectImages" ON public.portfolio_projectimage;
CREATE POLICY "Admin Insert ProjectImages" ON public.portfolio_projectimage FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Update ProjectImages" ON public.portfolio_projectimage;
CREATE POLICY "Admin Update ProjectImages" ON public.portfolio_projectimage FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin Delete ProjectImages" ON public.portfolio_projectimage;
CREATE POLICY "Admin Delete ProjectImages" ON public.portfolio_projectimage FOR DELETE USING (auth.role() = 'authenticated');