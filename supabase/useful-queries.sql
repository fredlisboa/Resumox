-- Queries Úteis para Administração do HuskyApp

-- ============================================
-- USUÁRIOS E ACESSOS
-- ============================================

-- Ver todos os usuários ativos
SELECT
  email,
  product_name,
  data_compra,
  data_expiracao,
  ultimo_acesso,
  ultimo_ip
FROM public.users_access
WHERE status_compra = 'active'
ORDER BY data_compra DESC;

-- Verificar sessões ativas por usuário
SELECT
  u.email,
  s.ip_address,
  s.last_activity,
  s.expires_at,
  s.is_active
FROM public.user_sessions s
JOIN public.users_access u ON s.user_id = u.id
WHERE s.is_active = true
ORDER BY s.last_activity DESC;

-- Encontrar usuários com múltiplas sessões ativas
SELECT
  u.email,
  COUNT(s.id) as sessoes_ativas
FROM public.users_access u
JOIN public.user_sessions s ON s.user_id = u.id
WHERE s.is_active = true
  AND s.expires_at > NOW()
GROUP BY u.email, u.id
HAVING COUNT(s.id) > 1;

-- Ver tentativas de login falhadas (últimas 24h)
SELECT
  email,
  ip_address,
  COUNT(*) as tentativas,
  MAX(attempted_at) as ultima_tentativa
FROM public.login_attempts
WHERE
  success = false
  AND attempted_at > NOW() - INTERVAL '24 hours'
GROUP BY email, ip_address
ORDER BY tentativas DESC;

-- Usuários bloqueados
SELECT
  email,
  bloqueado_ate,
  tentativas_login,
  ultimo_acesso
FROM public.users_access
WHERE bloqueado_ate > NOW()
ORDER BY bloqueado_ate DESC;

-- ============================================
-- ESTATÍSTICAS
-- ============================================

-- Total de usuários por status
SELECT
  status_compra,
  COUNT(*) as total
FROM public.users_access
GROUP BY status_compra;

-- Usuários ativos nos últimos 7 dias
SELECT COUNT(DISTINCT user_id) as usuarios_ativos_7d
FROM public.user_sessions
WHERE last_activity > NOW() - INTERVAL '7 days';

-- Taxa de conversão de login (últimas 24h)
SELECT
  COUNT(*) FILTER (WHERE success = true) as logins_sucesso,
  COUNT(*) FILTER (WHERE success = false) as logins_falha,
  ROUND(
    COUNT(*) FILTER (WHERE success = true)::numeric /
    NULLIF(COUNT(*)::numeric, 0) * 100,
    2
  ) as taxa_sucesso_pct
FROM public.login_attempts
WHERE attempted_at > NOW() - INTERVAL '24 hours';

-- ============================================
-- CONTEÚDOS
-- ============================================

-- Listar todos os conteúdos por produto
SELECT
  product_id,
  content_type,
  title,
  order_index,
  is_active
FROM public.product_contents
ORDER BY product_id, order_index;

-- Contar conteúdos por tipo
SELECT
  product_id,
  content_type,
  COUNT(*) as total
FROM public.product_contents
WHERE is_active = true
GROUP BY product_id, content_type
ORDER BY product_id, content_type;

-- ============================================
-- WEBHOOKS HOTMART
-- ============================================

-- Ver últimos webhooks recebidos
SELECT
  event_type,
  subscriber_email,
  transaction_id,
  processed,
  created_at,
  error_message
FROM public.hotmart_webhooks
ORDER BY created_at DESC
LIMIT 20;

-- Webhooks não processados
SELECT
  id,
  event_type,
  subscriber_email,
  created_at,
  error_message
FROM public.hotmart_webhooks
WHERE processed = false
ORDER BY created_at ASC;

-- Eventos de reembolso/cancelamento
SELECT
  event_type,
  subscriber_email,
  transaction_id,
  created_at
FROM public.hotmart_webhooks
WHERE event_type IN ('PURCHASE_REFUNDED', 'PURCHASE_CANCELED', 'PURCHASE_CHARGEBACK')
ORDER BY created_at DESC;

-- ============================================
-- MANUTENÇÃO E LIMPEZA
-- ============================================

-- Limpar sessões expiradas (executar via cron)
UPDATE public.user_sessions
SET is_active = false
WHERE expires_at < NOW() AND is_active = true;

-- Limpar tentativas de login antigas (mais de 30 dias)
DELETE FROM public.login_attempts
WHERE attempted_at < NOW() - INTERVAL '30 days';

-- Limpar webhooks processados antigos (mais de 90 dias)
DELETE FROM public.hotmart_webhooks
WHERE processed = true
  AND created_at < NOW() - INTERVAL '90 days';

-- ============================================
-- ADMINISTRAÇÃO DE USUÁRIOS
-- ============================================

-- Adicionar novo usuário manualmente
INSERT INTO public.users_access (
  email,
  status_compra,
  product_id,
  product_name,
  data_compra,
  data_expiracao
) VALUES (
  'cliente@email.com',
  'active',
  'PRODUTO_001',
  'Nome do Produto',
  NOW(),
  NOW() + INTERVAL '1 year'
);

-- Reativar acesso de usuário
UPDATE public.users_access
SET
  status_compra = 'active',
  data_expiracao = NOW() + INTERVAL '1 year',
  bloqueado_ate = NULL,
  tentativas_login = 0
WHERE email = 'cliente@email.com';

-- Revogar acesso de usuário
UPDATE public.users_access
SET status_compra = 'cancelled'
WHERE email = 'cliente@email.com';

-- Desbloquear usuário
UPDATE public.users_access
SET
  bloqueado_ate = NULL,
  tentativas_login = 0
WHERE email = 'cliente@email.com';

-- Encerrar todas as sessões de um usuário
UPDATE public.user_sessions
SET is_active = false
WHERE user_id = (
  SELECT id FROM public.users_access WHERE email = 'cliente@email.com'
);

-- ============================================
-- CONTEÚDOS - ADMINISTRAÇÃO
-- ============================================

-- Adicionar novo conteúdo (vídeo)
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  thumbnail_url,
  duration,
  order_index
) VALUES (
  'PRODUTO_001',
  'video',
  'Aula 1: Título',
  'Descrição do conteúdo',
  'https://seu-cdn.com/video.mp4',
  'https://seu-cdn.com/thumb.jpg',
  1200,  -- duração em segundos
  1
);

-- Adicionar PDF
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index
) VALUES (
  'PRODUTO_001',
  'pdf',
  'Material Complementar',
  'PDF com exercícios',
  'https://seu-cdn.com/material.pdf',
  2
);

-- Desativar conteúdo
UPDATE public.product_contents
SET is_active = false
WHERE id = 'uuid-do-conteudo';

-- Reordenar conteúdos
UPDATE public.product_contents
SET order_index = 1
WHERE id = 'uuid-conteudo-1';

UPDATE public.product_contents
SET order_index = 2
WHERE id = 'uuid-conteudo-2';

-- ============================================
-- BACKUP E EXPORTAÇÃO
-- ============================================

-- Exportar lista de e-mails ativos (para campanha)
SELECT email
FROM public.users_access
WHERE status_compra = 'active'
  AND data_expiracao > NOW()
ORDER BY email;

-- Exportar relatório completo de usuários
SELECT
  email,
  status_compra,
  product_name,
  TO_CHAR(data_compra, 'DD/MM/YYYY') as data_compra,
  TO_CHAR(data_expiracao, 'DD/MM/YYYY') as data_expiracao,
  TO_CHAR(ultimo_acesso, 'DD/MM/YYYY HH24:MI') as ultimo_acesso,
  ultimo_ip,
  hotmart_transaction_id
FROM public.users_access
ORDER BY data_compra DESC;

-- ============================================
-- MONITORAMENTO DE FRAUDE
-- ============================================

-- IPs com múltiplos e-mails diferentes (suspeito)
SELECT
  ip_address,
  COUNT(DISTINCT email) as emails_diferentes,
  ARRAY_AGG(DISTINCT email) as emails
FROM public.login_attempts
WHERE attempted_at > NOW() - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(DISTINCT email) > 3
ORDER BY emails_diferentes DESC;

-- E-mails com múltiplos IPs (possível compartilhamento)
SELECT
  u.email,
  COUNT(DISTINCT s.ip_address) as ips_diferentes,
  ARRAY_AGG(DISTINCT s.ip_address) as ips
FROM public.users_access u
JOIN public.user_sessions s ON s.user_id = u.id
WHERE s.last_activity > NOW() - INTERVAL '7 days'
GROUP BY u.email
HAVING COUNT(DISTINCT s.ip_address) > 3
ORDER BY ips_diferentes DESC;

-- ============================================
-- CRON JOBS (Executar Periodicamente)
-- ============================================

-- Diariamente: Limpar dados antigos
SELECT cleanup_old_login_attempts();
SELECT deactivate_expired_sessions();

-- Semanalmente: Verificar contas expiradas
UPDATE public.users_access
SET status_compra = 'cancelled'
WHERE data_expiracao < NOW()
  AND status_compra = 'active';
