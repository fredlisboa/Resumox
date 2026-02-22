# Quick Fix Guide - Session Login Error

## The Error You're Seeing1
```
duplicate key value violates unique constraint "unique_active_session_per_user"
```

## Quick Fix Steps

### 1. Apply Database Migration NOW

**Go to Supabase Dashboard → SQL Editor → Run this:**

```sql
-- Emergency Fix (30 seconds)
DROP INDEX IF EXISTS public.unique_active_session_per_user CASCADE;
ALTER TABLE public.user_sessions DROP CONSTRAINT IF EXISTS unique_active_session_per_user;

CREATE UNIQUE INDEX unique_active_session_per_user
ON public.user_sessions (user_id)
WHERE is_active = true;
```

**OR use the full script:** [supabase/fix_session_constraint_v3.sql](supabase/fix_session_constraint_v3.sql)

### 2. Deploy Updated Code

The code is already fixed and built. Just deploy:

```bash
# If you haven't built yet:
npm run build

# Then deploy to your platform (Vercel, etc.)
```

### 3. Test

- Users can now log in
- No more constraint errors
- Each user = 1 active session max

## Why This Happened

The database constraint was checking `(user_id, is_active)` together instead of just `user_id` for active sessions only.

## Files Changed

- ✅ [lib/auth.ts](lib/auth.ts#L161-L235) - Code fix (already done)
- ⏳ Database migration (needs to be applied by you in Supabase)

## Full Details

See [SESSION_FIX_ACTION_PLAN.md](SESSION_FIX_ACTION_PLAN.md) for complete explanation.

## Emergency Scripts Available

1. **[supabase/fix_session_constraint_v3.sql](supabase/fix_session_constraint_v3.sql)** - Full migration with verification ← **Use this one**
2. **[supabase/fix_session_emergency.sql](supabase/fix_session_emergency.sql)** - Minimal fix (if v3 fails)

## Status

- ✅ Code updated and tested
- ✅ Build successful
- ⏳ **You need to apply the database migration**
