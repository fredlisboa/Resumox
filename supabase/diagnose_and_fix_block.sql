-- ============================================
-- DIAGNÓSTICO COMPLETO E CORREÇÃO DE BLOQUEIO
-- ============================================
-- Execute este script passo a passo para diagnosticar e corrigir o bloqueio

-- PASSO 1: Verificar status do usuário
-- ============================================
SELECT
  email,
  status_compra,
  bloqueado_ate,
  tentativas_login,
  ultimo_ip,
  ultimo_acesso,
  data_expiracao
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';

-- RESULTADO ESPERADO:
-- - status_compra deve ser 'active'
-- - bloqueado_ate deve ser NULL ou uma data no passado
-- - data_expiracao deve ser NULL ou uma data no futuro

-- PASSO 2: Verificar bloqueios de IP
-- ============================================
SELECT
  ip_address,
  blocked_reason,
  blocked_until,
  attempt_count,
  unique_emails_attempted,
  last_attempt
FROM public.ip_rate_limits
WHERE blocked_until > NOW()
ORDER BY blocked_until DESC;

-- RESULTADO ESPERADO:
-- Se aparecer algum IP aqui, é ESTE o problema!
-- Anote o IP que aparece bloqueado

-- PASSO 3: Verificar tentativas de login recentes
-- ============================================
SELECT
  email,
  ip_address,
  success,
  attempted_at,
  user_agent
FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com'
  AND attempted_at > NOW() - INTERVAL '2 hours'
ORDER BY attempted_at DESC;

-- RESULTADO ESPERADO:
-- Você verá todas as tentativas (sucesso = true ou false)
-- Anote o IP mais recente usado pelo usuário

-- PASSO 4: Ver TODOS os IPs bloqueados (incluindo expirados)
-- ============================================
SELECT
  ip_address,
  blocked_reason,
  blocked_until,
  attempt_count,
  unique_emails_attempted,
  last_attempt,
  CASE
    WHEN blocked_until > NOW() THEN 'BLOQUEADO'
    ELSE 'EXPIRADO'
  END as status
FROM public.ip_rate_limits
ORDER BY last_attempt DESC
LIMIT 20;

-- ============================================
-- CORREÇÃO: Execute os comandos abaixo
-- ============================================

-- FIX 1: Limpar bloqueio do usuário
UPDATE public.users_access
SET
  bloqueado_ate = NULL,
  tentativas_login = 0
WHERE email = 'frederiqueelisboa@gmail.com';

-- FIX 2: Remover TODOS os bloqueios de IP relacionados a este email
DELETE FROM public.ip_rate_limits
WHERE ip_address IN (
  SELECT DISTINCT ip_address
  FROM public.login_attempts
  WHERE email = 'frederiqueelisboa@gmail.com'
);

-- FIX 3: Limpar tentativas de login antigas (opcional, mas recomendado)
DELETE FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com'
  AND attempted_at < NOW() - INTERVAL '2 hours';

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar que não há mais bloqueios
SELECT COUNT(*) as bloqueios_ativos
FROM public.ip_rate_limits
WHERE blocked_until > NOW()
  AND ip_address IN (
    SELECT DISTINCT ip_address
    FROM public.login_attempts
    WHERE email = 'frederiqueelisboa@gmail.com'
  );

-- RESULTADO ESPERADO: 0

-- Verificar status final do usuário
SELECT
  email,
  status_compra,
  bloqueado_ate,
  tentativas_login
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';

-- RESULTADO ESPERADO:
-- - status_compra: 'active'
-- - bloqueado_ate: NULL
-- - tentativas_login: 0

-- ============================================
-- SE AINDA NÃO FUNCIONAR: LIMPEZA AGRESSIVA
-- ============================================

-- Use isto APENAS se os comandos acima não funcionarem
-- Isto remove TODOS os bloqueios de IP do sistema

-- Ver quantos IPs estão bloqueados no total
SELECT COUNT(*) as total_ips_bloqueados
FROM public.ip_rate_limits
WHERE blocked_until > NOW();

-- Se você quiser remover TODOS os bloqueios (cuidado!)
-- DELETE FROM public.ip_rate_limits;

-- ============================================
-- INFORMAÇÕES DE DEBUG
-- ============================================

-- Ver a tabela completa de rate limits
SELECT * FROM public.ip_rate_limits ORDER BY last_attempt DESC LIMIT 10;

-- Ver estatísticas de login das últimas 24h
SELECT
  COUNT(*) FILTER (WHERE success = true) as logins_sucesso,
  COUNT(*) FILTER (WHERE success = false) as logins_falha,
  COUNT(DISTINCT ip_address) as ips_unicos,
  COUNT(DISTINCT email) as emails_unicos
FROM public.login_attempts
WHERE attempted_at > NOW() - INTERVAL '24 hours';
