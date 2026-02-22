-- Script para ver os conteúdos existentes e product_id
-- Execute este script no Supabase SQL Editor

-- Ver todos os products cadastrados
SELECT DISTINCT
  product_id,
  COUNT(*) as total_contents,
  STRING_AGG(DISTINCT content_type, ', ') as content_types
FROM product_contents
GROUP BY product_id;

-- Ver todos os conteúdos por product
SELECT
  product_id,
  content_type,
  title,
  content_url,
  order_index,
  is_active
FROM product_contents
ORDER BY product_id, order_index;

-- Ver usuários e seus produtos
SELECT
  email,
  product_id,
  product_name,
  status_compra,
  data_compra
FROM users_access
WHERE status_compra = 'active'
ORDER BY data_compra DESC;
