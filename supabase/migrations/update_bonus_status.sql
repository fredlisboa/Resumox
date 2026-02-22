-- Script para atualizar o status dos conteúdos existentes
-- Marca como 'bonus' os itens que são bônus identificáveis

-- Atualizar baseado no título contendo palavras-chave de bônus
UPDATE public.product_contents
SET status = 'bonus'
WHERE
  (title ILIKE '%bônus%'
  OR title ILIKE '%bonus%'
  OR title ILIKE '%bono%'
  OR title ILIKE '%exclusivo%'
  OR title LIKE 'Bono%')
  AND status != 'bonus';

-- Atualizar baseado no product_id sendo order bump
UPDATE public.product_contents
SET status = 'bonus'
WHERE
  (product_id ILIKE '%ORDERBUMP%'
  OR product_id ILIKE '%BUMP%'
  OR product_id ILIKE '%BONUS%')
  AND status != 'bonus';

-- Verificação: contar quantos itens são principal vs bonus
SELECT
  status,
  COUNT(*) as total,
  ARRAY_AGG(DISTINCT content_type) as tipos
FROM public.product_contents
GROUP BY status;
