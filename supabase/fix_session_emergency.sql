-- EMERGENCY FIX - Session Constraint Issue
-- Date: 2025-12-18
-- Use this if the v3 script fails
-- This is the simplest possible fix - just drops and recreates the constraint

-- Drop the bad constraint FIRST (constraint must be dropped before index)
ALTER TABLE public.user_sessions DROP CONSTRAINT IF EXISTS unique_active_session_per_user;

-- Then drop the index if it exists as a standalone index
DROP INDEX IF EXISTS public.unique_active_session_per_user;

-- Create the correct partial unique index
-- This only enforces uniqueness for active sessions
CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;

-- Verify it worked
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'user_sessions'
AND indexname = 'unique_active_session_per_user';
