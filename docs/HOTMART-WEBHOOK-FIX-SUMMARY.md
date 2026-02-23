# Hotmart Webhook Duplicate Order Bump Fix - Summary

## Problem Analysis

### Issue Overview
The user `kriziarc9@gmail.com` purchased:
- 1 main product: **Kit Inteligencia Emocional** (HP3753209659)
- 4 order bumps purchased separately

However, the `user_products` table contained:
- 5 correct active entries (1 main + 4 bumps)
- 5 duplicate locked entries (created by duplicate webhook)

**Result**: User couldn't access order bump products despite purchasing them.

---

## Root Causes Identified

### 1. Duplicate Webhook Processing
**Problem**: Hotmart sent the same webhook for transaction `HP3753209659` **twice**:
- First webhook at `16:16:19` → Correctly processed
- Second webhook at `16:31:24` → Created duplicate locked entries

**Why it happened**: No idempotency check before creating locked order bumps.

### 2. Webhook Arrival Order
**Problem**: Order bump webhooks arrived **before** the main product webhook:
- Order bumps processed at `16:16:19-28` → Created as ACTIVE (no locked entry existed yet)
- Main product processed at `16:31:24` → Created new LOCKED entries for all bumps

**Expected flow**:
1. Main product webhook → Create main product (active) + all bumps (locked)
2. Order bump webhook → Update locked bump to active

**Actual flow**:
1. Order bump webhooks → Create bumps as active (no locked entry to update)
2. Main product webhook → Create main product + create NEW locked bumps (duplicates!)

### 3. Missing Deduplication Logic
The code had NO checks for:
- ✗ Existing main product before creating locked bumps
- ✗ Existing active order bumps before creating locked entries
- ✗ Already processed transactions (idempotency)

---

## Solutions Implemented

### Fix 1: Prevent Duplicate Locked Entries When Main Product Exists
**File**: `app/api/webhook/hotmart/route.ts` (lines 476-513)

**Changes**:
```typescript
// NEW: Check if main product already exists BEFORE creating locked bumps
const { data: existingMainProduct } = await supabaseAdmin
  .from('user_products')
  .select('id, status, hotmart_transaction_id')
  .eq('user_id', userId)
  .eq('product_id', productId)
  .eq('is_order_bump', false)
  .single()

if (existingMainProduct) {
  // Main product exists → Update it, but DON'T create locked bumps again
  // This prevents duplicates from duplicate webhooks
  return // Exit early
}
```

**What it fixes**: Duplicate webhooks for main product won't create duplicate locked entries.

---

### Fix 2: Skip Creating Locked Entries if Active Bump Already Exists
**File**: `app/api/webhook/hotmart/route.ts` (lines 564-578)

**Changes**:
```typescript
for (const orderBump of orderBumps) {
  // NEW: Check if order bump is already ACTIVE
  const { data: existingActiveOrderBump } = await supabaseAdmin
    .from('user_products')
    .select('id, status')
    .eq('user_id', userId)
    .eq('product_id', orderBump.product_id)
    .eq('status', 'active')
    .eq('is_order_bump', true)
    .single()

  if (existingActiveOrderBump) {
    continue // Skip creation if already active
  }
  // ... create locked entry
}
```

**What it fixes**: If order bump webhook arrives before main product, locked entry won't be created.

---

### Fix 3: Idempotency Check for Order Bump Activation
**File**: `app/api/webhook/hotmart/route.ts` (lines 612-630)

**Changes**:
```typescript
// NEW: Check if already processed this exact transaction
const { data: alreadyActiveOrderBump } = await supabaseAdmin
  .from('user_products')
  .select('id, status, hotmart_transaction_id')
  .eq('user_id', userId)
  .eq('product_id', productId)
  .eq('hotmart_transaction_id', transactionId)
  .eq('is_order_bump', true)
  .eq('status', 'active')
  .single()

if (alreadyActiveOrderBump) {
  return // Already processed, skip
}
```

**What it fixes**: Duplicate order bump webhooks won't be processed twice.

---

### Fix 4: Smart Duplicate Handling During Activation
**File**: `app/api/webhook/hotmart/route.ts` (lines 644-679)

**Changes**:
```typescript
// Find all existing order bumps (locked or active)
const { data: existingOrderBumps } = await supabaseAdmin
  .from('user_products')
  .select('*')
  .eq('user_id', userId)
  .eq('product_id', productId)
  .eq('is_order_bump', true)

const lockedOrderBump = existingOrderBumps?.find(ob => ob.status === 'locked')
const activeOrderBump = existingOrderBumps?.find(ob => ob.status === 'active')

if (lockedOrderBump) {
  // Update locked to active
  await update(lockedOrderBump.id)

  // NEW: If there's ALSO an active duplicate, delete it
  if (activeOrderBump && activeOrderBump.id !== lockedOrderBump.id) {
    await delete(activeOrderBump.id)
  }
}
```

**What it fixes**: Automatically cleans up duplicates during normal webhook processing.

---

## Database Cleanup Scripts

### Script 1: Fix Specific User (kriziarc9@gmail.com)
**File**: `fix-duplicate-user-products.sql`

**What it does**:
- Deletes locked order bump entries that have active counterparts
- Preserves all active entries (user keeps access)
- Safe to run multiple times (idempotent)

**Usage**:
```bash
psql your_database < fix-duplicate-user-products.sql
```

---

### Script 2: Comprehensive Cleanup (All Users)
**File**: `cleanup-duplicate-order-bumps.sql`

**What it does**:
1. **Phase 1**: Remove locked duplicates of active order bumps
2. **Phase 2**: Remove duplicate active entries (keep oldest)
3. **Verification**: Check no duplicates remain
4. **Reporting**: Show before/after state for all affected users

**Usage**:
```bash
psql your_database < cleanup-duplicate-order-bumps.sql
```

**Safe to run**: Yes, includes analysis phase and detailed logging.

---

## Testing & Verification

### Test Case 1: Duplicate Main Product Webhook
**Before fix**: Creates duplicate locked entries
**After fix**: Skips locked entry creation, updates main product only

### Test Case 2: Order Bump Before Main Product
**Before fix**: Creates active bump, then duplicate locked bump
**After fix**: Creates active bump, skips locked creation when main product arrives

### Test Case 3: Duplicate Order Bump Webhook
**Before fix**: Processes twice, may create duplicates
**After fix**: Detects already processed, returns early

---

## Deployment Steps

### Step 1: Backup Database
```bash
pg_dump -h your_host -U your_user -d your_db -t user_products > backup_user_products.sql
pg_dump -h your_host -U your_user -d your_db -t hotmart_webhooks > backup_hotmart_webhooks.sql
```

### Step 2: Run Cleanup Script
```bash
# For all users
psql your_database < cleanup-duplicate-order-bumps.sql

# Or for specific user only
psql your_database < fix-duplicate-user-products.sql
```

### Step 3: Deploy Code Changes
```bash
git add app/api/webhook/hotmart/route.ts
git commit -m "Fix: Prevent duplicate order bump entries from duplicate webhooks"
git push
```

### Step 4: Verify Fix
```bash
# Check no duplicates remain
psql your_database -c "
SELECT user_id, product_id, status, COUNT(*)
FROM user_products
WHERE is_order_bump = true
GROUP BY user_id, product_id, status
HAVING COUNT(*) > 1;
"
```

Expected result: `0 rows` (no duplicates)

---

## Monitoring

### Check Webhook Processing Logs
After deployment, monitor logs for:
- `⚠️  SKIPPING order bump creation - main product already exists`
- `⚠️  Order bump already ACTIVE, skipping`
- `⚠️  Order bump already ACTIVE with this transaction`

These indicate the fix is working correctly.

### Query for Active Users
```sql
SELECT
  ua.email,
  COUNT(*) FILTER (WHERE up.is_order_bump = false) as main_products,
  COUNT(*) FILTER (WHERE up.is_order_bump = true AND up.status = 'active') as active_bumps,
  COUNT(*) FILTER (WHERE up.is_order_bump = true AND up.status = 'locked') as locked_bumps
FROM users_access ua
JOIN user_products up ON ua.id = up.user_id
GROUP BY ua.email
HAVING COUNT(*) FILTER (WHERE up.is_order_bump = true AND up.status = 'locked') > 0;
```

This shows users with locked bumps (should decrease over time as they purchase).

---

## Summary of Changes

### Code Changes
- ✅ Added main product existence check before creating locked bumps
- ✅ Added active order bump check before creating locked entries
- ✅ Added idempotency check for order bump activation
- ✅ Added automatic duplicate cleanup during activation
- ✅ Improved logging for debugging

### Database Changes
- ✅ Cleanup script to remove duplicate locked entries
- ✅ Cleanup script to remove duplicate active entries
- ✅ Verification queries to ensure data integrity

### Impact
- ✅ **Prevents**: Future duplicate entries from duplicate webhooks
- ✅ **Fixes**: Existing users with duplicate locked entries
- ✅ **Maintains**: All user access (no data loss)
- ✅ **Improves**: Webhook processing resilience

---

## Files Modified

1. `app/api/webhook/hotmart/route.ts` - Main webhook processing logic
2. `fix-duplicate-user-products.sql` - Specific user cleanup script
3. `cleanup-duplicate-order-bumps.sql` - All users cleanup script
4. `HOTMART-WEBHOOK-FIX-SUMMARY.md` - This documentation

---

## Next Steps

1. ✅ Review code changes
2. ⏳ Test in staging environment (if available)
3. ⏳ Run cleanup scripts on production database
4. ⏳ Deploy code changes
5. ⏳ Monitor webhook processing logs
6. ⏳ Verify user access is working correctly

---

## Contact & Support

If issues persist after applying these fixes:
1. Check webhook logs for error messages
2. Query `hotmart_webhooks` table for duplicate entries
3. Query `user_products` table for duplicate entries
4. Check Hotmart webhook configuration for retry settings

---

**Document Version**: 1.0
**Date**: 2026-01-05
**Author**: Claude Code
