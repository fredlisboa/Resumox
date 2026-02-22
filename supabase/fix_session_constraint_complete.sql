-- Complete fix for session constraint issues
-- Date: 2025-12-18
-- This script fixes the unique_active_session_per_user constraint issue

-- Step 1: Deactivate all currently active sessions to prevent conflicts
UPDATE public.user_sessions
SET is_active = false
WHERE is_active = true;

-- Step 2: Drop any existing constraints or indexes with this name
DROP INDEX IF EXISTS public.unique_active_session_per_user;
ALTER TABLE public.user_sessions DROP CONSTRAINT IF EXISTS unique_active_session_per_user;

-- Step 3: Create the correct partial unique index
-- This allows multiple inactive sessions but only one active session per user
CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;

-- Step 4: Clean up any duplicate inactive sessions (optional, for data cleanup)
-- This keeps only the most recent inactive session for each user
DELETE FROM public.user_sessions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY user_id, is_active
             ORDER BY created_at DESC
           ) AS rn
    FROM public.user_sessions
    WHERE is_active = false
  ) AS ranked
  WHERE rn > 1
);

-- Verification queries (run these to check the fix worked)
-- Query 1: Check for any duplicate active sessions (should return 0 rows)
-- SELECT user_id, COUNT(*) as active_count
-- FROM public.user_sessions
-- WHERE is_active = true
-- GROUP BY user_id
-- HAVING COUNT(*) > 1;

-- Query 2: Verify the partial index exists
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'user_sessions'
-- AND indexname = 'unique_active_session_per_user';
