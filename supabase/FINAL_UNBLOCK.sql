-- ============================================
-- FINAL COMPLETE UNBLOCK - DO NOT CLICK LOGIN AFTER RUNNING THIS!
-- ============================================

-- STEP 1: Clear IP block
DELETE FROM public.ip_rate_limits WHERE ip_address = '179.108.104.96';

-- STEP 2: Clear user block
UPDATE public.users_access
SET bloqueado_ate = NULL, tentativas_login = 0
WHERE email = 'frederiqueelisboa@gmail.com';

-- STEP 3: Clear ALL login attempts for this user
DELETE FROM public.login_attempts WHERE email = 'frederiqueelisboa@gmail.com';

-- STEP 4: Verify everything is cleared (ALL should return 0 or NULL)
SELECT
  'IP Blocks' as check_type,
  COUNT(*) as count
FROM public.ip_rate_limits
WHERE ip_address = '179.108.104.96'

UNION ALL

SELECT
  'User Blocked Until' as check_type,
  CASE
    WHEN bloqueado_ate IS NULL THEN 0
    ELSE 1
  END as count
FROM public.users_access
WHERE email = 'frederiqueelisboa@gmail.com'

UNION ALL

SELECT
  'Login Attempts' as check_type,
  COUNT(*) as count
FROM public.login_attempts
WHERE email = 'frederiqueelisboa@gmail.com';

-- ALL COUNTS MUST BE 0 FOR SUCCESS!
