-- ============================================
-- SCRIPT PARA DESBLOQUEAR USUÁRIO
-- ============================================
-- Este script desbloqueia um usuário específico removendo:
-- 1. Bloqueios de IP
-- 2. Bloqueios do usuário
-- 3. Reset de tentativas de login

-- INSTRUÇÕES:
-- 1. Substitua 'cliente@email.com' pelo email do usuário
-- 2. Substitua '123.456.789.012' pelo IP do usuário (se souber)
-- 3. Execute no SQL Editor do Supabase

-- ============================================
-- OPÇÃO 1: Desbloquear por EMAIL
-- ============================================

-- Ver informações do usuário
SELECT
  email,
  status_compra,
  bloqueado_ate,
  tentativas_login,
  ultimo_ip,
  ultimo_acesso
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';

-- Desbloquear o usuário (resetar bloqueio e tentativas)
UPDATE public.users_access
SET
  bloqueado_ate = NULL,
  tentativas_login = 0
WHERE email = 'frederiqueelisboa@gmail.com';

-- Ver tentativas de login recentes deste email
SELECT
  email,
  ip_address,
  success,
  attempted_at,
  user_agent
FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com'
ORDER BY attempted_at DESC
LIMIT 10;

-- ============================================
-- OPÇÃO 2: Desbloquear por IP
-- ============================================

-- Ver IPs bloqueados atualmente
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

-- Remover bloqueio de IP específico (substitua o IP)
-- DELETE FROM public.ip_rate_limits
-- WHERE ip_address = '123.456.789.012';

-- ============================================
-- OPÇÃO 3: Desbloquear TODOS os IPs que tentaram
-- fazer login com este email (USE COM CUIDADO!)
-- ============================================

-- Ver todos os IPs que tentaram login com este email
SELECT DISTINCT
  ip_address,
  MAX(attempted_at) as ultima_tentativa
FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com'
GROUP BY ip_address
ORDER BY MAX(attempted_at) DESC;

-- Remover bloqueio de todos os IPs associados a este email
DELETE FROM public.ip_rate_limits
WHERE ip_address IN (
  SELECT DISTINCT ip_address
  FROM public.login_attempts
  WHERE email = 'frederiqueelisboa@gmail.com'
);

-- ============================================
-- OPÇÃO 4: DESBLOQUEAR TODOS OS IPs (EMERGÊNCIA)
-- USE APENAS EM CASO DE PROBLEMA GENERALIZADO
-- ============================================

-- Ver todos os IPs bloqueados
-- SELECT * FROM public.ip_rate_limits WHERE blocked_until > NOW();

-- DESBLOQUEAR TODOS (CUIDADO!)
-- DELETE FROM public.ip_rate_limits;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar se o usuário foi desbloqueado
SELECT
  email,
  status_compra,
  bloqueado_ate,
  tentativas_login
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';

-- Verificar se ainda há IPs bloqueados para este email
SELECT COUNT(*) as ips_bloqueados
FROM public.ip_rate_limits rl
WHERE rl.ip_address IN (
  SELECT DISTINCT ip_address
  FROM public.login_attempts
  WHERE email = 'frederiqueelisboa@gmail.com'
)
AND rl.blocked_until > NOW();
