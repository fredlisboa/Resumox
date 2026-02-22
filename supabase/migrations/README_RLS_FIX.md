# Fix RLS Security Warnings

This migration enables Row Level Security (RLS) on tables that are currently unprotected, fixing the security warnings shown in the Supabase dashboard.

## Tables Affected

1. `login_attempts` - Login attempts log
2. `hotmart_webhooks` - Hotmart webhook events
3. `ip_rate_limits` - IP-based rate limiting
4. `product_contents_backup` - Backup table (if exists)

## How to Apply

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `enable_rls_on_protected_tables.sql`
5. Click **Run** or press `Ctrl+Enter`

### Option 2: Supabase CLI

```bash
# Make sure you're in the project root
cd /home/fredlisboa/lt-entregaveis

# Apply the migration
supabase db push
```

## What This Migration Does

### 1. Enables RLS
Enables Row Level Security on all unprotected tables to prevent unauthorized access.

### 2. Creates Service Role Policies
Creates policies that only allow the service role (backend code) to access these tables:
- `login_attempts` - Security sensitive data
- `hotmart_webhooks` - Payment information
- `ip_rate_limits` - Rate limiting data
- `product_contents_backup` - Backup data

### 3. Verification
The migration includes verification code that will output confirmation messages.

## Backend Code Verification

✅ **Your code is already correct!** All backend operations use `supabaseAdmin` which uses the service role key:

- `lib/supabase.ts` - Defines `supabaseAdmin` with `SUPABASE_SERVICE_ROLE_KEY`
- `lib/auth.ts` - All database operations use `supabaseAdmin`
- `app/api/auth/login/route.ts` - Uses auth functions that use `supabaseAdmin`
- `app/api/webhook/hotmart/route.ts` - Uses `supabaseAdmin` directly

## After Migration

After running this migration, the security warnings in your Supabase dashboard will be resolved. The tables will still be fully accessible to your backend code because it uses the service role key.

## Testing

To verify the migration worked:

1. Check the Supabase dashboard - the RLS warnings should be gone
2. Test login flow - should work normally
3. Test webhook processing - should work normally
4. Check that regular anon key cannot access these tables (this is the security fix)

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Disable RLS on tables
ALTER TABLE public.login_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotmart_webhooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_rate_limits DISABLE ROW LEVEL SECURITY;

-- Drop policies
DROP POLICY IF EXISTS "Service role only access" ON public.login_attempts;
DROP POLICY IF EXISTS "Service role only access" ON public.hotmart_webhooks;
DROP POLICY IF EXISTS "Service role only access" ON public.ip_rate_limits;
```

**Note:** Rollback is not recommended as it will re-introduce the security vulnerabilities.
