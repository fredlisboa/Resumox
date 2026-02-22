-- Migration: Add RLS Policies for user_sessions Table
-- Description: Creates Row Level Security policies for user_sessions to resolve "RLS Enabled No Policy" warning
-- Created: 2025-12-31

-- ============================================================================
-- CREATE RLS POLICIES FOR user_sessions
-- ============================================================================

-- Policy 1: Users can view only their own sessions
CREATE POLICY "Users can view their own sessions"
    ON public.user_sessions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users_access
            WHERE users_access.id = user_sessions.user_id
            AND users_access.email = auth.jwt() ->> 'email'
        )
    );

-- Policy 2: Users can insert their own sessions (when logging in)
-- This is needed for the backend to create sessions for authenticated users
CREATE POLICY "Users can create their own sessions"
    ON public.user_sessions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users_access
            WHERE users_access.id = user_sessions.user_id
            AND users_access.email = auth.jwt() ->> 'email'
        )
    );

-- Policy 3: Users can update their own sessions (for activity tracking)
CREATE POLICY "Users can update their own sessions"
    ON public.user_sessions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users_access
            WHERE users_access.id = user_sessions.user_id
            AND users_access.email = auth.jwt() ->> 'email'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users_access
            WHERE users_access.id = user_sessions.user_id
            AND users_access.email = auth.jwt() ->> 'email'
        )
    );

-- Policy 4: Users can delete their own sessions (for logout)
CREATE POLICY "Users can delete their own sessions"
    ON public.user_sessions
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users_access
            WHERE users_access.id = user_sessions.user_id
            AND users_access.email = auth.jwt() ->> 'email'
        )
    );

-- Policy 5: Service role can manage all sessions (for backend operations)
-- This allows the backend with service_role to manage sessions without restrictions
CREATE POLICY "Service role full access to sessions"
    ON public.user_sessions
    FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify that RLS is enabled and policies exist
DO $$
DECLARE
    rls_enabled BOOLEAN;
    policy_count INTEGER;
BEGIN
    -- Check if RLS is enabled
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = 'user_sessions';

    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'user_sessions';

    RAISE NOTICE '====================================';
    RAISE NOTICE '=== user_sessions RLS Status ===';
    RAISE NOTICE '====================================';
    RAISE NOTICE 'RLS Enabled: %', rls_enabled;
    RAISE NOTICE 'Number of Policies: %', policy_count;
    RAISE NOTICE '====================================';

    IF rls_enabled AND policy_count >= 5 THEN
        RAISE NOTICE '✓ SUCCESS: RLS is properly configured on user_sessions';
    ELSIF NOT rls_enabled THEN
        RAISE WARNING '✗ ISSUE: RLS is not enabled on user_sessions';
    ELSIF policy_count < 5 THEN
        RAISE WARNING '✗ ISSUE: Expected at least 5 policies, found %', policy_count;
    END IF;
END $$;

-- Display all policies on user_sessions
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_sessions'
ORDER BY policyname;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "Users can view their own sessions" ON public.user_sessions IS
    'Allows authenticated users to view only their own session records';

COMMENT ON POLICY "Users can create their own sessions" ON public.user_sessions IS
    'Allows authenticated users to create session records for themselves during login';

COMMENT ON POLICY "Users can update their own sessions" ON public.user_sessions IS
    'Allows authenticated users to update their own sessions (e.g., last_activity timestamp)';

COMMENT ON POLICY "Users can delete their own sessions" ON public.user_sessions IS
    'Allows authenticated users to delete their own sessions during logout';

COMMENT ON POLICY "Service role full access to sessions" ON public.user_sessions IS
    'Allows backend service role to manage all sessions without restrictions';
