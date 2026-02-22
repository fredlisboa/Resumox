-- Script para verificar os PDFs cadastrados no banco de dados
-- Execute este script no Supabase SQL Editor para ver os PDFs atuais

-- Ver todos os conteúdos do tipo PDF
SELECT
  id,
  product_id,
  title,
  description,
  content_url,
  file_size,
  order_index,
  is_active,
  created_at,
  updated_at
FROM product_contents
WHERE content_type = 'pdf'
ORDER BY product_id, order_index;

-- Ver contagem de PDFs por produto
SELECT
  product_id,
  COUNT(*) as total_pdfs,
  COUNT(CASE WHEN is_active = true THEN 1 END) as pdfs_ativos
FROM product_contents
WHERE content_type = 'pdf'
GROUP BY product_id;
