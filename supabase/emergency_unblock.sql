-- ============================================
-- EMERGENCY UNBLOCK - RUN THIS NOW
-- ============================================
-- This will completely reset all rate limiting for the user

-- Step 1: Show current state BEFORE cleanup
SELECT 'BEFORE CLEANUP' as status;

SELECT 'User Status' as type, email, status_compra, bloqueado_ate, tentativas_login
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';

SELECT 'IP Blocks' as type, COUNT(*) as total_blocks
FROM public.ip_rate_limits
WHERE blocked_until > NOW();

SELECT 'Failed Attempts Last Hour' as type, COUNT(*) as count
FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com'
  AND attempted_at > NOW() - INTERVAL '1 hour'
  AND success = false;

-- Step 2: NUCLEAR CLEANUP
DELETE FROM public.ip_rate_limits;
DELETE FROM public.login_attempts WHERE email = 'frederiqueelisboa@gmail.com';
UPDATE public.users_access
SET bloqueado_ate = NULL, tentativas_login = 0
WHERE email = 'frederiqueelisboa@gmail.com';

-- Step 3: Verify AFTER cleanup
SELECT 'AFTER CLEANUP' as status;

SELECT 'User Status' as type, email, status_compra, bloqueado_ate, tentativas_login
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com';

SELECT 'IP Blocks Remaining' as type, COUNT(*) as total_blocks
FROM public.ip_rate_limits;

SELECT 'Login Attempts Remaining' as type, COUNT(*) as count
FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com';

-- All counts should be 0, and bloqueado_ate should be NULL
