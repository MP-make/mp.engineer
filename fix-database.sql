-- Alterar el campo image para permitir URLs más largas
ALTER TABLE portfolio_projectimage 
ALTER COLUMN image TYPE VARCHAR(500);

-- Verificar que el cambio se aplicó
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'portfolio_projectimage' 
AND column_name = 'image';