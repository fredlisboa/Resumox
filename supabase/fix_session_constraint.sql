-- Migration: Fix unique_active_session_per_user constraint to allow multiple inactive sessions
-- Date: 2025-12-18
-- Issue: The current constraint prevents multiple inactive sessions for the same user
-- Solution: Replace the constraint with a partial unique index that only applies to active sessions

-- Step 1: Drop the existing constraint
ALTER TABLE public.user_sessions
DROP CONSTRAINT IF EXISTS unique_active_session_per_user;

-- Step 2: Create a partial unique index that only enforces uniqueness for active sessions
-- This allows multiple inactive sessions (is_active = false) for the same user
-- but ensures only one active session (is_active = true) per user
CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;

-- Verification query (optional - can be run separately to check the fix)
-- SELECT user_id, is_active, COUNT(*)
-- FROM public.user_sessions
-- GROUP BY user_id, is_active
-- HAVING COUNT(*) > 1;
