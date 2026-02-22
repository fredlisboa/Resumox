-- Adiciona coluna 'status' para diferenciar conteúdos principais de bônus
-- Migration: add_status_column.sql

-- Adicionar coluna status
ALTER TABLE public.product_contents
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'principal';

-- Adicionar constraint para garantir valores válidos
ALTER TABLE public.product_contents
ADD CONSTRAINT product_contents_status_check
CHECK (status IN ('principal', 'bonus'));

-- Atualizar registros existentes que são bônus (baseado no título)
UPDATE public.product_contents
SET status = 'bonus'
WHERE
  title ILIKE '%bônus%'
  OR title ILIKE '%bonus%'
  OR title ILIKE '%bono%'
  OR title ILIKE '%exclusivo%'
  OR product_id ILIKE '%ORDERBUMP%'
  OR product_id ILIKE '%BUMP%';

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_product_contents_status
ON public.product_contents(status);

-- Comentários
COMMENT ON COLUMN public.product_contents.status IS 'Status do conteúdo: principal ou bonus';
