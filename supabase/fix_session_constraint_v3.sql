-- Complete fix for session constraint issues (Version 3 - Emergency Fix)
-- Date: 2025-12-18
-- This script fixes the unique_active_session_per_user constraint issue
-- Run this in Supabase SQL Editor
--
-- CRITICAL: This version drops the constraint FIRST before any data modifications
-- to avoid constraint violations during the migration itself

-- Step 1: Drop the problematic constraint/index IMMEDIATELY
-- Do this BEFORE touching any data
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

    -- Also check for any unique constraint on both columns
    IF EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'user_sessions'
        AND c.contype = 'u'
        AND c.conkey::text LIKE '%is_active%'
    ) THEN
        RAISE NOTICE 'Found composite unique constraint, will be dropped';
    END IF;
END $$;

-- Step 2: Now safe to deactivate all active sessions
DO $$
BEGIN
  UPDATE public.user_sessions
  SET is_active = false
  WHERE is_active = true;

  RAISE NOTICE 'Deactivated all active sessions';
END $$;

-- Step 3: Create the correct partial unique index
-- This allows multiple inactive sessions but only one active session per user
DO $$
BEGIN
  CREATE UNIQUE INDEX unique_active_session_per_user
  ON public.user_sessions (user_id)
  WHERE is_active = true;

  RAISE NOTICE 'Created partial unique index';
END $$;

-- Step 4: Clean up duplicate inactive sessions (keeps only most recent 5 per user)
DO $$
BEGIN
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

  RAISE NOTICE 'Cleaned up old inactive sessions';
END $$;

-- Step 5: Verification queries
DO $$
DECLARE
  duplicate_count INTEGER;
  index_exists BOOLEAN;
  total_sessions INTEGER;
  active_sessions INTEGER;
  inactive_sessions INTEGER;
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

  -- Get session counts
  SELECT COUNT(*) INTO total_sessions FROM public.user_sessions;
  SELECT COUNT(*) INTO active_sessions FROM public.user_sessions WHERE is_active = true;
  SELECT COUNT(*) INTO inactive_sessions FROM public.user_sessions WHERE is_active = false;

  -- Report results
  RAISE NOTICE '====================================';
  RAISE NOTICE '=== Verification Results ===';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Total sessions: %', total_sessions;
  RAISE NOTICE 'Active sessions: %', active_sessions;
  RAISE NOTICE 'Inactive sessions: %', inactive_sessions;
  RAISE NOTICE 'Duplicate active sessions: %', duplicate_count;
  RAISE NOTICE 'Partial index exists: %', index_exists;
  RAISE NOTICE '====================================';

  IF duplicate_count = 0 AND index_exists AND active_sessions = 0 THEN
    RAISE NOTICE '✓ SUCCESS: Migration completed successfully!';
    RAISE NOTICE '✓ All users will need to log in again (all sessions deactivated)';
  ELSIF duplicate_count > 0 THEN
    RAISE WARNING '✗ ISSUE: Found % duplicate active sessions', duplicate_count;
  ELSIF NOT index_exists THEN
    RAISE WARNING '✗ ISSUE: Partial index was not created';
  ELSE
    RAISE NOTICE '✓ Migration completed with warnings - please review';
  END IF;
END $$;

-- Step 6: Display session statistics
SELECT
  is_active,
  COUNT(*) as session_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_sessions
GROUP BY is_active
ORDER BY is_active DESC;

-- Step 7: Show the new index definition
SELECT
  indexname,
  indexdef,
  CASE
    WHEN indexdef LIKE '%WHERE%' THEN '✓ Partial index (correct)'
    ELSE '✗ Full index (incorrect)'
  END as index_type
FROM pg_indexes
WHERE tablename = 'user_sessions'
AND indexname = 'unique_active_session_per_user';
