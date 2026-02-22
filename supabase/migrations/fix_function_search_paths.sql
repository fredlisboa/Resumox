-- Migration: Fix Function Search Path Mutable Warnings
-- Description: Sets search_path on all functions to prevent security vulnerabilities
-- Created: 2025-12-31

-- ============================================================================
-- FIX ADMIN FUNCTIONS
-- ============================================================================

-- Fix is_admin function
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    );
END;
$$;

-- Fix is_super_admin function
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = check_user_id
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$;

-- Fix has_permission function
CREATE OR REPLACE FUNCTION has_permission(check_user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    CASE permission_name
        WHEN 'create_avisos' THEN
            SELECT can_create_avisos INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        WHEN 'manage_users' THEN
            SELECT can_manage_users INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        WHEN 'manage_contents' THEN
            SELECT can_manage_contents INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        WHEN 'view_analytics' THEN
            SELECT can_view_analytics INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        ELSE
            has_perm := false;
    END CASE;

    RETURN COALESCE(has_perm, false);
END;
$$;

-- ============================================================================
-- FIX TRIGGER FUNCTIONS
-- ============================================================================

-- Fix update_admin_users_updated_at function
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix update_avisos_updated_at function
CREATE OR REPLACE FUNCTION update_avisos_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- FIX CLEANUP AND UTILITY FUNCTIONS
-- ============================================================================

-- Fix cleanup_old_login_attempts function
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM public.login_attempts
    WHERE attempted_at < NOW() - INTERVAL '24 hours';

    -- Clean expired IP blocks
    DELETE FROM public.ip_rate_limits
    WHERE blocked_until IS NOT NULL
    AND blocked_until < NOW() - INTERVAL '24 hours';
END;
$$;

-- Fix deactivate_expired_sessions function (if it exists)
CREATE OR REPLACE FUNCTION deactivate_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE public.user_sessions
    SET is_active = false
    WHERE expires_at < NOW()
    AND is_active = true;
END;
$$;

-- Fix update_updated_at_column function (generic trigger function)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Query to verify all functions have search_path set
DO $$
DECLARE
    func_record RECORD;
    func_config TEXT[];
    has_search_path BOOLEAN;
BEGIN
    RAISE NOTICE 'Verifying search_path configuration for all functions...';
    RAISE NOTICE '';

    FOR func_record IN
        SELECT
            n.nspname AS schema_name,
            p.proname AS function_name,
            pg_get_functiondef(p.oid) AS definition
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN (
            'is_admin',
            'is_super_admin',
            'has_permission',
            'update_admin_users_updated_at',
            'update_avisos_updated_at',
            'cleanup_old_login_attempts',
            'deactivate_expired_sessions',
            'update_updated_at_column'
        )
    LOOP
        -- Check if definition contains SET search_path
        has_search_path := func_record.definition LIKE '%SET search_path%';

        IF has_search_path THEN
            RAISE NOTICE '✓ Function %.% has search_path configured',
                func_record.schema_name, func_record.function_name;
        ELSE
            RAISE WARNING '✗ Function %.% is MISSING search_path configuration',
                func_record.schema_name, func_record.function_name;
        END IF;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE 'Verification complete!';
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION is_admin(UUID) IS 'Checks if user is an admin - SECURITY DEFINER with search_path set';
COMMENT ON FUNCTION is_super_admin(UUID) IS 'Checks if user is a super admin - SECURITY DEFINER with search_path set';
COMMENT ON FUNCTION has_permission(UUID, TEXT) IS 'Checks if user has specific permission - SECURITY DEFINER with search_path set';
COMMENT ON FUNCTION cleanup_old_login_attempts() IS 'Cleans up old login attempts and expired IP blocks - SECURITY DEFINER with search_path set';
COMMENT ON FUNCTION deactivate_expired_sessions() IS 'Deactivates expired user sessions - SECURITY DEFINER with search_path set';
