# Session Constraint Fix - Action Plan

## Problem Summary

Your application is experiencing login failures due to a **database constraint misconfiguration**. The error occurs because the `unique_active_session_per_user` constraint is checking both `user_id` AND `is_active` columns, when it should only enforce uniqueness for active sessions.

### Error Messages
```
duplicate key value violates unique constraint "unique_active_session_per_user"
- Key (user_id, is_active)=(xxx, f) already exists  ← UPDATE fails on inactive sessions
- Key (user_id, is_active)=(xxx, t) already exists  ← INSERT fails for new session
```

## Root Cause

The constraint was created as a **composite unique constraint** instead of a **partial unique index**:
- ❌ Wrong: `UNIQUE (user_id, is_active)` - prevents multiple rows with same user_id AND is_active values
- ✅ Correct: `UNIQUE INDEX ON user_sessions(user_id) WHERE is_active = true` - only enforces one active session per user

## Solution: Two-Part Fix

### Part 1: Database Migration (REQUIRED)

**You MUST apply the database migration to permanently fix this issue.**

#### Steps:

**Option A - Full Migration (Recommended):**
1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of [supabase/fix_session_constraint_v3.sql](supabase/fix_session_constraint_v3.sql)
4. Click **Run** to execute the migration
5. Verify the output shows "✓ SUCCESS: Migration completed successfully!"

**Option B - Emergency Fix (If Option A fails):**
1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of [supabase/fix_session_emergency.sql](supabase/fix_session_emergency.sql)
4. Click **Run** to execute
5. This just drops and recreates the constraint - quickest fix

#### What the Migration Does:
1. Deactivates all current active sessions (users will need to log in again)
2. Drops the incorrect constraint/index
3. Creates a correct partial unique index
4. Cleans up duplicate sessions
5. Verifies the fix was applied correctly

### Part 2: Code Improvement (COMPLETED)

✅ The code in [lib/auth.ts](lib/auth.ts#L161-L235) has been updated to:
- **DELETE** sessions instead of UPDATE (avoids constraint violation on UPDATE)
- Use aggressive retry logic with fallback to delete all sessions
- Better error logging to identify constraint issues
- Handle the constraint issue even if the migration hasn't been applied

## Why Both Parts Are Needed

1. **Code Fix (Temporary Workaround)**:
   - Allows the application to work even with the bad constraint
   - Deletes sessions instead of updating them (avoids UPDATE constraint violation)
   - But deletes session history, which is not ideal

2. **Database Migration (Permanent Fix)**:
   - Fixes the constraint at the source
   - Allows proper session history tracking
   - Better performance (partial index vs full constraint)
   - Proper security model

## Deployment Steps

### Option A: Quick Fix (Deploy Code Only)
If you need the app working immediately:

```bash
npm run build
# Deploy to Vercel/your hosting
```

This will allow logins to work, but **you still need to apply the database migration**.

### Option B: Complete Fix (Recommended)

1. **Apply Database Migration First** (see Part 1 above)
2. **Deploy the Updated Code**:
   ```bash
   npm run build
   # Deploy to Vercel/your hosting
   ```

## Verification

After applying both fixes:

### Check Database (in Supabase SQL Editor):

```sql
-- Verify the partial index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_sessions'
AND indexname = 'unique_active_session_per_user';

-- Should show: CREATE UNIQUE INDEX ... WHERE is_active = true
```

```sql
-- Check for duplicate active sessions (should return 0 rows)
SELECT user_id, COUNT(*) as active_count
FROM public.user_sessions
WHERE is_active = true
GROUP BY user_id
HAVING COUNT(*) > 1;
```

### Check Application:
1. Try logging in with a test user
2. Check logs - should NOT see constraint violation errors
3. Log in again with the same user (should work without errors)
4. Check Supabase - user should have only 1 active session

## Expected Behavior After Fix

- ✅ Users can log in successfully
- ✅ Each user has max ONE active session
- ✅ Users can have multiple inactive (historical) sessions
- ✅ New logins automatically replace old active sessions
- ✅ No constraint violation errors
- ✅ Session history is preserved

## Files Modified

1. **[lib/auth.ts](lib/auth.ts#L161-L235)** - Updated `createSession()` function
2. **[supabase/fix_session_constraint_v2.sql](supabase/fix_session_constraint_v2.sql)** - NEW migration script (recommended)
3. **[SESSION_FIX_ACTION_PLAN.md](SESSION_FIX_ACTION_PLAN.md)** - This document

## Troubleshooting

### Issue: Still seeing constraint errors after deploying code

**Solution**: You haven't applied the database migration yet. Apply the migration from [supabase/fix_session_constraint_v2.sql](supabase/fix_session_constraint_v2.sql).

### Issue: Migration fails with "index already exists"

**Solution**: The migration script handles this. If it still fails, manually run:
```sql
DROP INDEX IF EXISTS public.unique_active_session_per_user CASCADE;
-- Then re-run the migration
```

### Issue: Users getting logged out after fix

**Expected behavior**: The migration deactivates all sessions. Users need to log in again. This is normal and only happens once.

### Issue: Want to keep session history but it's being deleted

**Solution**: After applying the database migration, the code will stop deleting sessions. The DELETE strategy is only needed when the constraint is misconfigured.

## Technical Details

### Why UPDATE Fails with Bad Constraint

With constraint `UNIQUE (user_id, is_active)`:
```
Before UPDATE:
- Row 1: (user_id=123, is_active=false) ← exists
- Row 2: (user_id=123, is_active=true)

After UPDATE row 2 to is_active=false:
- Row 1: (user_id=123, is_active=false) ← exists
- Row 2: (user_id=123, is_active=false) ← duplicate! ❌
```

### Why Partial Index Works

With partial index `UNIQUE (user_id) WHERE is_active = true`:
```
Multiple inactive sessions: ✅ Allowed (not in index)
- (user_id=123, is_active=false)
- (user_id=123, is_active=false)
- (user_id=123, is_active=false)

One active session: ✅ Enforced (in index)
- (user_id=123, is_active=true) ← only one allowed
```

## Next Steps

1. ⚠️ **CRITICAL**: Apply the database migration from [supabase/fix_session_constraint_v2.sql](supabase/fix_session_constraint_v2.sql)
2. Deploy the updated code (already done if you've built)
3. Test login flow
4. Monitor logs for any remaining issues

## Questions?

- Check [SESSION_FIX_GUIDE.md](SESSION_FIX_GUIDE.md) for more technical details
- Review the migration script: [supabase/fix_session_constraint_v2.sql](supabase/fix_session_constraint_v2.sql)
- Check Supabase logs for any database-level errors
