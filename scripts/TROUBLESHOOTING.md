# Test Scripts Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error: "NEXT_PUBLIC_SUPABASE_URL is not configured or invalid"

**Error Message:**
```
❌ Error: NEXT_PUBLIC_SUPABASE_URL is not configured or invalid in .env.local
Current value: your_supabase_url
Expected format: https://your-project.supabase.co
```

**Cause:** Your `.env.local` file has placeholder values instead of real credentials.

**Solution:**

1. **Check your `.env.local` file:**
   ```bash
   cat .env.local
   ```

2. **Update with real Supabase credentials:**
   ```bash
   # Open .env.local in your editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Replace placeholder values:**
   ```bash
   # BEFORE (placeholder):
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # AFTER (real values):
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Get your real credentials from Supabase:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API
   - Copy:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

---

### ❌ Error: "HOTMART_WEBHOOK_SECRET not configured"

**Error Message:**
```
❌ HOTMART_WEBHOOK_SECRET not configured. Please set it in .env.local
```

**Cause:** The webhook secret is missing from `.env.local`.

**Solution:**

1. **Get your webhook secret from Hotmart:**
   - Log in to Hotmart
   - Go to Tools → Webhooks
   - Copy the webhook secret

2. **Add to `.env.local`:**
   ```bash
   HOTMART_WEBHOOK_SECRET=your_actual_webhook_secret_here
   ```

---

### ❌ Error: "supabaseUrl is required"

**Error Message:**
```
Error: supabaseUrl is required.
```

**Cause:** Environment variables are not being loaded.

**Solution:**

This error should not occur anymore as we added dotenv loading. If you still see it:

1. **Verify `.env.local` exists:**
   ```bash
   ls -la .env.local
   ```

2. **Run from project root:**
   ```bash
   # Make sure you're in the project directory
   pwd
   # Should show: /home/fredlisboa/lt-entregaveis

   # Run test from root
   npx tsx scripts/test-order-bump-flow.ts
   ```

---

### ⚠️ Error: "Cannot connect to localhost:3000"

**Error Message:**
```
Error sending webhook: fetch failed
```

**Cause:** The Next.js development server is not running.

**Solution:**

1. **Start the dev server:**
   ```bash
   # In one terminal
   npm run dev
   ```

2. **Run tests in another terminal:**
   ```bash
   # In another terminal
   npx tsx scripts/test-order-bump-flow.ts
   ```

3. **Or test against production:**
   ```bash
   # Set WEBHOOK_TEST_URL in .env.local
   WEBHOOK_TEST_URL=https://your-production-domain.com/api/webhook/hotmart
   ```

---

### ⚠️ Warning: "No contents found"

**Cause:** The `product_contents` table is empty or doesn't have order bump content.

**Solution:**

1. **Check if contents exist:**
   ```sql
   SELECT COUNT(*) FROM product_contents WHERE is_active = true;
   ```

2. **Add test content:**
   ```sql
   -- Run the SQL from add-protocolo-descompresion-order-bump.sql
   -- Or add any test content with status='order_bump'
   ```

3. **Verify order bump status migration was run:**
   ```sql
   -- Check if constraint allows 'order_bump'
   SELECT * FROM product_contents WHERE status = 'order_bump';
   ```

   If this fails, run the migration:
   ```bash
   # Execute in Supabase SQL Editor
   # File: supabase/migrations/add_order_bump_status.sql
   ```

---

## Quick Checks

### ✅ Verify Environment Setup

```bash
# 1. Check .env.local exists and has real values
cat .env.local | grep -E "SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|WEBHOOK_SECRET"

# 2. Test environment loading
npx tsx -e "
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Has Service Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Has Webhook Secret:', !!process.env.HOTMART_WEBHOOK_SECRET);
"

# 3. Check dev server is running
curl -I http://localhost:3000

# 4. Check TypeScript compiles
npx tsc --noEmit
```

---

## Step-by-Step First Run

If this is your first time running the tests, follow these steps:

### 1. Set Up Environment Variables

```bash
# Copy example file (if it exists)
cp .env.local.example .env.local

# Edit with real credentials
nano .env.local
```

**Required variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key
HOTMART_WEBHOOK_SECRET=your_webhook_secret

# Optional
WEBHOOK_TEST_URL=http://localhost:3000/api/webhook/hotmart
DATABASE_URL=postgresql://...
```

### 2. Start Development Server

```bash
npm run dev
```

Wait for:
```
✓ Ready in XXXXms
○ Local: http://localhost:3000
```

### 3. Run Basic Check First

```bash
# Test with an existing user (if you have one)
npx tsx scripts/check-order-bump-status.ts user@example.com
```

### 4. Run Complete Flow Test

```bash
# This will create a test user and simulate purchases
npx tsx scripts/test-order-bump-flow.ts
```

### 5. Check Results

Expected output:
```
═══════════════════════════════════════════════════════
  🧪 ORDER BUMP FLOW COMPLETE TEST
═══════════════════════════════════════════════════════

✅ Webhook Main Product: Webhook processed successfully
✅ Webhook Order Bump: Webhook processed successfully
✅ User Creation: User created
✅ Order Bump Product: Order bump registered
✅ Order Bump Unlocking: Order bump content is UNLOCKED

🎉 ALL TESTS PASSED!
```

---

## Getting Help

If you're still stuck:

1. **Check the logs:**
   ```bash
   # Server logs
   # Look in the terminal where `npm run dev` is running

   # Database logs
   # Check Supabase Dashboard → Logs
   ```

2. **Enable debug mode:**
   ```bash
   # Add to .env.local
   DEBUG=true
   ```

3. **Review documentation:**
   - [TEST-ORDER-BUMPS.md](TEST-ORDER-BUMPS.md) - Full testing guide
   - [QUICK-REFERENCE-ORDER-BUMPS.md](../QUICK-REFERENCE-ORDER-BUMPS.md) - Quick reference
   - [ORDER-BUMP-FIX-SUMMARY.md](../ORDER-BUMP-FIX-SUMMARY.md) - Implementation details

4. **Manual database check:**
   ```sql
   -- Check users
   SELECT email, status_compra FROM users_access LIMIT 5;

   -- Check products
   SELECT user_id, product_id, is_order_bump, status FROM user_products LIMIT 5;

   -- Check contents
   SELECT product_id, title, status FROM product_contents WHERE status = 'order_bump';
   ```

---

**Last Updated:** 2025-12-20
