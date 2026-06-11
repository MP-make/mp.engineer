-- Agregar columna project_type a portfolio_project
ALTER TABLE portfolio_project 
ADD COLUMN IF NOT EXISTS project_type VARCHAR(20) DEFAULT 'personal' NOT NULL;

-- Actualizar proyectos existentes a 'personal' si no tienen tipo
UPDATE portfolio_project SET project_type = 'personal' WHERE project_type IS NULL;

-- Índice para filtrar por tipo
CREATE INDEX IF NOT EXISTS idx_project_type ON portfolio_project(project_type);
