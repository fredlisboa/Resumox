-- Complete fix for session constraint issues (Version 2)
-- Date: 2025-12-18
-- This script fixes the unique_active_session_per_user constraint issue
-- Run this in Supabase SQL Editor

-- Step 1: Deactivate all currently active sessions to prevent conflicts
UPDATE public.user_sessions
SET is_active = false
WHERE is_active = true;

-- Step 2: Drop any existing constraints or indexes with this name
-- This handles both constraint and index cases
DO $$
BEGIN
    -- Try to drop as index
    IF EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE indexname = 'unique_active_session_per_user'
        AND tablename = 'user_sessions'
    ) THEN
        DROP INDEX public.unique_active_session_per_user;
        RAISE NOTICE 'Dropped index unique_active_session_per_user';
    END IF;

    -- Try to drop as constraint
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_active_session_per_user'
    ) THEN
        ALTER TABLE public.user_sessions DROP CONSTRAINT unique_active_session_per_user;
        RAISE NOTICE 'Dropped constraint unique_active_session_per_user';
    END IF;
END $$;

-- Step 3: Create the correct partial unique index
-- This allows multiple inactive sessions but only one active session per user
CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;

-- Step 4: Clean up duplicate inactive sessions (keeps only most recent 5 per user)
WITH RankedSessions AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id
           ORDER BY created_at DESC
         ) AS rn
  FROM public.user_sessions
  WHERE is_active = false
)
DELETE FROM public.user_sessions
WHERE id IN (
  SELECT id FROM RankedSessions WHERE rn > 5
);

-- Step 5: Verification queries
DO $$
DECLARE
  duplicate_count INTEGER;
  index_exists BOOLEAN;
BEGIN
  -- Check for duplicate active sessions
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT user_id, COUNT(*) as active_count
    FROM public.user_sessions
    WHERE is_active = true
    GROUP BY user_id
    HAVING COUNT(*) > 1
  ) AS duplicates;

  -- Check if index exists
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'unique_active_session_per_user'
    AND tablename = 'user_sessions'
  ) INTO index_exists;

  -- Report results
  RAISE NOTICE '=== Verification Results ===';
  RAISE NOTICE 'Duplicate active sessions: %', duplicate_count;
  RAISE NOTICE 'Partial index exists: %', index_exists;

  IF duplicate_count = 0 AND index_exists THEN
    RAISE NOTICE 'SUCCESS: Migration completed successfully!';
  ELSE
    RAISE WARNING 'ISSUE: Please review the results above';
  END IF;
END $$;

-- Display session statistics
SELECT
  is_active,
  COUNT(*) as session_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_sessions
GROUP BY is_active
ORDER BY is_active DESC;

-- Show the index definition
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_sessions'
AND indexname = 'unique_active_session_per_user';
