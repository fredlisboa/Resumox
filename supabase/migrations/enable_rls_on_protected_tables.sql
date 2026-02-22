-- Enable RLS on tables that are currently unprotected
-- This fixes the security warnings from Supabase

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- These tables are accessed by backend code with service role key
-- so we need to enable RLS but allow service role to bypass it
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotmart_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;

-- product_contents_backup table (if it exists)
-- This is a backup table, so we should also protect it
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'product_contents_backup'
    ) THEN
        ALTER TABLE public.product_contents_backup ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- login_attempts: Only service role can access
-- No regular users should see login attempts (security sensitive)
CREATE POLICY "Service role only access" ON public.login_attempts
    FOR ALL
    USING (auth.role() = 'service_role');

-- hotmart_webhooks: Only service role can access
-- Webhooks contain sensitive payment information
CREATE POLICY "Service role only access" ON public.hotmart_webhooks
    FOR ALL
    USING (auth.role() = 'service_role');

-- ip_rate_limits: Only service role can access
-- Rate limiting data should not be visible to regular users
CREATE POLICY "Service role only access" ON public.ip_rate_limits
    FOR ALL
    USING (auth.role() = 'service_role');

-- product_contents_backup: Only service role can access (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'product_contents_backup'
    ) THEN
        EXECUTE 'CREATE POLICY "Service role only access" ON public.product_contents_backup
            FOR ALL
            USING (auth.role() = ''service_role'')';
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify RLS is enabled on all required tables
DO $$
DECLARE
    table_name TEXT;
    rls_enabled BOOLEAN;
BEGIN
    FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename IN ('login_attempts', 'hotmart_webhooks', 'ip_rate_limits', 'product_contents_backup')
    LOOP
        SELECT relrowsecurity INTO rls_enabled
        FROM pg_class
        WHERE relname = table_name;

        IF rls_enabled THEN
            RAISE NOTICE 'RLS is ENABLED on table: %', table_name;
        ELSE
            RAISE WARNING 'RLS is NOT enabled on table: %', table_name;
        END IF;
    END LOOP;
END $$;

COMMENT ON TABLE public.login_attempts IS 'Login attempts log for rate limiting - RLS enabled, service role only';
COMMENT ON TABLE public.hotmart_webhooks IS 'Hotmart webhook events - RLS enabled, service role only';
COMMENT ON TABLE public.ip_rate_limits IS 'IP-based rate limiting - RLS enabled, service role only';
