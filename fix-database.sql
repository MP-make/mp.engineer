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

-- Habilitar RLS (Row Level Security)
ALTER TABLE portfolio_heroimage ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Allow public read access" ON portfolio_heroimage
    FOR SELECT USING (true);

-- Crear política para permitir todas las operaciones (para admin)
CREATE POLICY "Allow all operations" ON portfolio_heroimage
    FOR ALL USING (true) WITH CHECK (true);