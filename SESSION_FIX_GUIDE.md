# Session Constraint Fix Guide

## Problem Description

The application was experiencing login failures with the following error:

```
duplicate key value violates unique constraint "unique_active_session_per_user"
```

This error occurred in two scenarios:
1. When trying to deactivate existing sessions: `Key (user_id, is_active)=(xxx, f) already exists`
2. When trying to create a new session: `Key (user_id, is_active)=(xxx, t) already exists`

## Root Cause

The `unique_active_session_per_user` constraint was incorrectly configured as a composite constraint on both `user_id` AND `is_active` columns, instead of a partial index on `user_id` WHERE `is_active = true`.

This caused:
- Multiple inactive sessions for the same user to violate the constraint
- The UPDATE operation to fail when trying to set `is_active = false` on already inactive sessions
- The INSERT operation to fail when trying to create a new active session

## Solution

The fix involves two parts:

### 1. Database Schema Fix

Execute the migration script to fix the database constraint:

```bash
# Connect to your Supabase project SQL editor and run:
/home/fredlisboa/lt-entregaveis/supabase/fix_session_constraint_complete.sql
```

What this script does:
- Deactivates all currently active sessions to prevent conflicts
- Drops the incorrect constraint/index
- Creates a correct partial unique index that only enforces uniqueness on active sessions
- Cleans up any duplicate inactive sessions

### 2. Code Logic Fix

Updated [lib/auth.ts](lib/auth.ts#L160-L245) to:
- Remove the `.eq('is_active', true)` filter when deactivating sessions
- Deactivate ALL sessions for a user (not just active ones)
- This prevents UPDATE operations from trying to set duplicate inactive rows

## Changes Made

### File: `lib/auth.ts`

**Before:**
```typescript
// Desativar sessões anteriores do mesmo usuário
const { error: updateError } = await supabaseAdmin
  .from('user_sessions')
  .update({ is_active: false })
  .eq('user_id', userId)
  .eq('is_active', true)  // ❌ This caused issues
```

**After:**
```typescript
// Desativar TODAS as sessões anteriores do usuário (ativas ou não)
const { error: updateError } = await supabaseAdmin
  .from('user_sessions')
  .update({ is_active: false })
  .eq('user_id', userId)  // ✅ No filter on is_active
```

### File: `supabase/fix_session_constraint_complete.sql` (NEW)

Complete migration script that:
1. Deactivates all active sessions
2. Drops incorrect constraints
3. Creates correct partial index
4. Cleans up duplicate data

## How to Apply the Fix

1. **Apply Database Migration:**
   - Open Supabase Dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/fix_session_constraint_complete.sql`
   - Execute the script

2. **Deploy Code Changes:**
   ```bash
   npm run build
   # Deploy to your hosting platform (Vercel, etc.)
   ```

3. **Verify the Fix:**
   - Existing users should be logged out (all sessions deactivated)
   - New login attempts should succeed without constraint errors
   - Multiple login attempts should work correctly

## Verification Queries

After applying the fix, run these queries in Supabase SQL Editor to verify:

```sql
-- Should return the partial index definition
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_sessions'
AND indexname = 'unique_active_session_per_user';

-- Should return 0 rows (no duplicate active sessions)
SELECT user_id, COUNT(*) as active_count
FROM public.user_sessions
WHERE is_active = true
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Check session distribution
SELECT
  is_active,
  COUNT(*) as session_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_sessions
GROUP BY is_active;
```

## Expected Behavior After Fix

- ✅ Users can log in successfully
- ✅ Each user can have only ONE active session at a time
- ✅ Users can have multiple inactive (historical) sessions
- ✅ New logins automatically deactivate previous sessions
- ✅ No constraint violation errors during login/logout

## Technical Details

### Partial Index Explanation

A partial unique index is created with:
```sql
CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;
```

This means:
- **Enforced:** Only one row per `user_id` WHERE `is_active = true`
- **Allowed:** Multiple rows per `user_id` WHERE `is_active = false`

### Why This Design?

- **Security:** Only one active session per user prevents session hijacking
- **History:** Keep inactive sessions for audit trails and session history
- **Performance:** Partial index is smaller and faster than full table index

## Troubleshooting

If you still see errors after applying the fix:

1. **Check if migration was applied:**
   ```sql
   SELECT indexname FROM pg_indexes
   WHERE tablename = 'user_sessions'
   AND indexname = 'unique_active_session_per_user';
   ```

2. **Manually clean up sessions:**
   ```sql
   UPDATE public.user_sessions SET is_active = false WHERE is_active = true;
   ```

3. **Check for orphaned constraints:**
   ```sql
   SELECT conname, contype FROM pg_constraint
   WHERE conrelid = 'public.user_sessions'::regclass;
   ```

## Prevention

To prevent similar issues in the future:

1. Always test database migrations in a staging environment first
2. Use partial indexes for conditional uniqueness constraints
3. Monitor session creation errors in production logs
4. Consider adding database tests for constraint behavior

## Related Files

- [lib/auth.ts](lib/auth.ts) - Session management logic
- [app/api/auth/login/route.ts](app/api/auth/login/route.ts) - Login endpoint
- [supabase/schema.sql](supabase/schema.sql) - Original schema definition
- [supabase/fix_session_constraint_complete.sql](supabase/fix_session_constraint_complete.sql) - Complete fix migration
