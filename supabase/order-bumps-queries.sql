-- ============================================================================
-- QUERIES ÚTEIS PARA GERENCIAR ORDER BUMPS
-- ============================================================================

-- 1. LISTAR TODOS OS PRODUTOS DE UM USUÁRIO
-- Substitua 'user@example.com' pelo email do usuário
SELECT
    ua.email,
    up.product_id,
    up.product_name,
    up.is_order_bump,
    up.parent_transaction_id,
    up.status,
    up.purchase_date,
    up.expiration_date,
    up.hotmart_transaction_id
FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE ua.email = 'user@example.com'
ORDER BY up.is_order_bump, up.purchase_date DESC;

-- 2. CONTAR PRODUTOS POR USUÁRIO
SELECT
    ua.email,
    COUNT(*) as total_products,
    SUM(CASE WHEN up.is_order_bump = false THEN 1 ELSE 0 END) as main_products,
    SUM(CASE WHEN up.is_order_bump = true THEN 1 ELSE 0 END) as order_bumps,
    SUM(CASE WHEN up.status = 'active' THEN 1 ELSE 0 END) as active_products
FROM users_access ua
LEFT JOIN user_products up ON ua.id = up.user_id
GROUP BY ua.email
ORDER BY total_products DESC;

-- 3. VERIFICAR PRODUTOS DE UMA TRANSAÇÃO ESPECÍFICA
-- Mostra todos os produtos (principal + bumps) de uma compra
SELECT
    ua.email,
    up.product_id,
    up.product_name,
    up.is_order_bump,
    up.parent_transaction_id,
    up.hotmart_transaction_id,
    up.status
FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE up.hotmart_transaction_id = 'HP123456789'
   OR up.parent_transaction_id = 'HP123456789'
ORDER BY up.is_order_bump;

-- 4. LISTAR USUÁRIOS COM ORDER BUMPS
SELECT
    ua.email,
    COUNT(DISTINCT up.product_id) as total_products,
    STRING_AGG(DISTINCT up.product_id, ', ') as products_list
FROM users_access ua
JOIN user_products up ON ua.id = up.user_id
WHERE up.is_order_bump = true
  AND up.status = 'active'
GROUP BY ua.email
ORDER BY total_products DESC;

-- 5. VERIFICAR SE UM USUÁRIO TEM ACESSO A UM PRODUTO ESPECÍFICO
-- Substitua os valores pelos dados desejados
SELECT
    ua.email,
    up.product_id,
    up.product_name,
    up.status,
    up.expiration_date,
    CASE
        WHEN up.status != 'active' THEN 'Produto não está ativo'
        WHEN up.expiration_date IS NOT NULL AND up.expiration_date < NOW() THEN 'Produto expirado'
        ELSE 'Tem acesso'
    END as access_status
FROM users_access ua
JOIN user_products up ON ua.id = up.user_id
WHERE ua.email = 'user@example.com'
  AND up.product_id = 'ORDERBUMP01';

-- 6. LISTAR WEBHOOKS RECEBIDOS COM PRODUTOS
-- Útil para debug
SELECT
    hw.event_type,
    hw.transaction_id,
    hw.subscriber_email,
    hw.payload->>'data'->>'product'->>'id' as product_id,
    hw.payload->>'data'->>'order_bump'->>'is_order_bump' as is_order_bump,
    hw.processed,
    hw.error_message,
    hw.created_at
FROM hotmart_webhooks hw
ORDER BY hw.created_at DESC
LIMIT 50;

-- 7. LISTAR PRODUTOS ÓRFÃOS (order bumps sem produto principal)
-- Identifica possíveis problemas de sincronização
SELECT
    ua.email,
    up.product_id as bump_product,
    up.parent_transaction_id,
    up.purchase_date
FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE up.is_order_bump = true
  AND NOT EXISTS (
      SELECT 1
      FROM user_products main
      WHERE main.user_id = up.user_id
        AND main.hotmart_transaction_id = up.parent_transaction_id
        AND main.is_order_bump = false
  );

-- 8. ESTATÍSTICAS DE CONVERSÃO DE ORDER BUMPS
-- Mostra quantos usuários compraram bumps
WITH product_stats AS (
    SELECT
        ua.id as user_id,
        ua.email,
        COUNT(CASE WHEN up.is_order_bump = false THEN 1 END) as main_products_count,
        COUNT(CASE WHEN up.is_order_bump = true THEN 1 END) as bumps_count
    FROM users_access ua
    LEFT JOIN user_products up ON ua.id = up.user_id AND up.status = 'active'
    GROUP BY ua.id, ua.email
)
SELECT
    COUNT(*) as total_users,
    COUNT(CASE WHEN bumps_count > 0 THEN 1 END) as users_with_bumps,
    ROUND(
        COUNT(CASE WHEN bumps_count > 0 THEN 1 END)::numeric /
        COUNT(*)::numeric * 100,
        2
    ) as bump_conversion_rate,
    AVG(bumps_count) as avg_bumps_per_user
FROM product_stats
WHERE main_products_count > 0;

-- 9. REMOVER PRODUTOS DE UM USUÁRIO ESPECÍFICO (CUIDADO!)
-- USE APENAS PARA TESTES - Não executar em produção sem backup
-- DELETE FROM user_products
-- WHERE user_id IN (
--     SELECT id FROM users_access WHERE email = 'test@example.com'
-- );

-- 10. LISTAR PRODUTOS EXPIRADOS OU INATIVOS
SELECT
    ua.email,
    up.product_id,
    up.product_name,
    up.status,
    up.expiration_date,
    CASE
        WHEN up.status != 'active' THEN up.status
        WHEN up.expiration_date < NOW() THEN 'expired'
        ELSE 'active'
    END as current_status
FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE up.status != 'active'
   OR (up.expiration_date IS NOT NULL AND up.expiration_date < NOW())
ORDER BY ua.email, up.purchase_date DESC;

-- 11. REATIVAR UM PRODUTO ESPECÍFICO (após reembolso cancelado, por exemplo)
-- Substitua os valores
-- UPDATE user_products
-- SET status = 'active',
--     expiration_date = NOW() + INTERVAL '1 year'
-- WHERE user_id = (SELECT id FROM users_access WHERE email = 'user@example.com')
--   AND product_id = 'ORDERBUMP01'
--   AND hotmart_transaction_id = 'HP123456789';

-- 12. LISTAR TODOS OS PRODUTOS DISPONÍVEIS NO SISTEMA
-- (produtos únicos que já foram vendidos)
SELECT
    product_id,
    product_name,
    COUNT(DISTINCT user_id) as total_buyers,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_purchases,
    MIN(purchase_date) as first_sale,
    MAX(purchase_date) as last_sale,
    BOOL_OR(is_order_bump) as is_bump_product
FROM user_products
GROUP BY product_id, product_name
ORDER BY total_buyers DESC;

-- 13. AUDITORIA: Verificar integridade dos dados
-- Encontra inconsistências entre users_access e user_products
SELECT
    'Users without products' as issue_type,
    COUNT(*) as count
FROM users_access ua
WHERE NOT EXISTS (
    SELECT 1 FROM user_products up WHERE up.user_id = ua.id
)
UNION ALL
SELECT
    'Products without users' as issue_type,
    COUNT(*) as count
FROM user_products up
WHERE NOT EXISTS (
    SELECT 1 FROM users_access ua WHERE ua.id = up.user_id
);

-- 14. HISTÓRICO DE MUDANÇAS DE STATUS DE UM PRODUTO
-- Requer tabela de histórico (não implementada ainda)
-- Esta query é um exemplo de como poderia funcionar com auditoria
SELECT
    ua.email,
    up.product_id,
    up.status,
    up.updated_at,
    up.created_at
FROM user_products up
JOIN users_access ua ON up.user_id = ua.id
WHERE ua.email = 'user@example.com'
  AND up.product_id = 'ORDERBUMP01'
ORDER BY up.updated_at DESC;
