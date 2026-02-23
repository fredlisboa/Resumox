# Session Constraint Fix - Migration Guide

## Problem Description

The application was experiencing database constraint violations during user login with error code `23505`:

```
duplicate key value violates unique constraint "unique_active_session_per_user"
```

### Root Cause

The constraint `UNIQUE (user_id, is_active)` in the `user_sessions` table was incorrectly defined as a table constraint. This prevented multiple inactive sessions (`is_active = false`) for the same user, which is unintended behavior.

**The constraint should only enforce uniqueness when `is_active = true`**, allowing:
- Only ONE active session per user
- MULTIPLE inactive sessions per user

### Technical Details

The original constraint definition:
```sql
CONSTRAINT unique_active_session_per_user UNIQUE (user_id, is_active)
```

This creates a composite unique index on BOTH `user_id` and `is_active`, meaning:
- ❌ Only one row can exist with `(user_id=123, is_active=true)`
- ❌ Only one row can exist with `(user_id=123, is_active=false)` ← **This is the problem!**

## Solution

Replace the table constraint with a **partial unique index** that only applies when `is_active = true`:

```sql
CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;
```

This allows:
- ✅ Only one row with `(user_id=123, is_active=true)`
- ✅ Many rows with `(user_id=123, is_active=false)`

## Migration Steps

### Option 1: Using the Migration SQL File (Recommended)

1. **Connect to your Supabase database** (or PostgreSQL instance):
   ```bash
   # Using Supabase CLI
   supabase db push

   # OR using psql
   psql -h your-db-host -U postgres -d your-database
   ```

2. **Run the migration file**:
   ```bash
   # If using psql
   psql -h your-db-host -U postgres -d your-database -f supabase/fix_session_constraint.sql

   # OR copy/paste the contents into Supabase SQL Editor
   ```

3. **Verify the fix**:
   ```sql
   -- Check that the constraint is now an index
   SELECT indexname, indexdef
   FROM pg_indexes
   WHERE tablename = 'user_sessions'
   AND indexname = 'unique_active_session_per_user';

   -- Expected result:
   -- indexname: unique_active_session_per_user
   -- indexdef: CREATE UNIQUE INDEX unique_active_session_per_user ON public.user_sessions USING btree (user_id) WHERE (is_active = true)
   ```

### Option 2: Manual SQL Execution

Execute these commands in your database:

```sql
-- Step 1: Drop the existing constraint
ALTER TABLE public.user_sessions
DROP CONSTRAINT IF EXISTS unique_active_session_per_user;

-- Step 2: Create the partial unique index
CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;
```

## Verification

After applying the migration, verify the fix works:

1. **Test multiple inactive sessions**:
   ```sql
   -- This should succeed (multiple inactive sessions for same user)
   INSERT INTO user_sessions (user_id, session_token, ip_address, expires_at, is_active)
   VALUES
     ('6e868c08-d3c4-4b7e-97c4-8117f7a58229', 'token1', '127.0.0.1', NOW() + INTERVAL '30 days', false),
     ('6e868c08-d3c4-4b7e-97c4-8117f7a58229', 'token2', '127.0.0.1', NOW() + INTERVAL '30 days', false);
   ```

2. **Test single active session**:
   ```sql
   -- This should succeed (first active session)
   INSERT INTO user_sessions (user_id, session_token, ip_address, expires_at, is_active)
   VALUES ('6e868c08-d3c4-4b7e-97c4-8117f7a58229', 'token3', '127.0.0.1', NOW() + INTERVAL '30 days', true);

   -- This should FAIL with constraint violation (second active session)
   INSERT INTO user_sessions (user_id, session_token, ip_address, expires_at, is_active)
   VALUES ('6e868c08-d3c4-4b7e-97c4-8117f7a58229', 'token4', '127.0.0.1', NOW() + INTERVAL '30 days', true);
   ```

3. **Check for duplicate active sessions**:
   ```sql
   SELECT user_id, is_active, COUNT(*)
   FROM public.user_sessions
   WHERE is_active = true
   GROUP BY user_id, is_active
   HAVING COUNT(*) > 1;

   -- Should return no rows
   ```

## Files Modified

1. **[supabase/fix_session_constraint.sql](supabase/fix_session_constraint.sql)** - Migration file to apply the fix
2. **[supabase/schema.sql](supabase/schema.sql)** - Updated schema for future deployments
   - Removed the constraint from table definition (line 58-61)
   - Added partial unique index in the indexes section (line 125)

## Impact

### Before Fix
- ❌ Users could not log in if they had an inactive session
- ❌ Race conditions caused login failures
- ❌ Error: `duplicate key value violates unique constraint`

### After Fix
- ✅ Users can log in multiple times (old sessions are marked inactive)
- ✅ Only one active session per user (enforced)
- ✅ Multiple inactive sessions allowed (session history preserved)
- ✅ No more constraint violation errors

## Rollback (if needed)

If you need to rollback the migration:

```sql
-- Drop the partial unique index
DROP INDEX IF EXISTS unique_active_session_per_user;

-- Recreate the old constraint (NOT RECOMMENDED - this will cause the original issue)
ALTER TABLE public.user_sessions
ADD CONSTRAINT unique_active_session_per_user UNIQUE (user_id, is_active);
```

**Note:** Rollback is not recommended as it will restore the original bug.

## Additional Notes

- The application code in [lib/auth.ts](lib/auth.ts) already handles the retry logic for constraint violations, but this fix eliminates the need for retries in most cases
- The fix is backward compatible and doesn't require any code changes
- Session history is preserved (inactive sessions remain in the database)
- Performance impact is negligible (partial indexes are efficient)

## Questions or Issues?

If you encounter any issues during migration, check:
1. Database permissions (you need ALTER TABLE and CREATE INDEX privileges)
2. Existing active sessions (run the verification query above)
3. Application logs for any remaining constraint violations

For persistent issues, you may need to manually clean up duplicate active sessions before applying the migration:

```sql
-- Find duplicate active sessions
SELECT user_id, COUNT(*) as session_count
FROM user_sessions
WHERE is_active = true
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Deactivate all but the most recent active session for each user
WITH ranked_sessions AS (
  SELECT id, user_id, created_at,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM user_sessions
  WHERE is_active = true
)
UPDATE user_sessions
SET is_active = false
WHERE id IN (
  SELECT id FROM ranked_sessions WHERE rn > 1
);
```
