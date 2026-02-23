# Actual Problem Found - Duplicate ACTIVE Entries

## What We Discovered

After running diagnostic queries, we found the **real issue** is different from what we initially thought:

### Initial Assumption (WRONG)
- Problem: Duplicate **LOCKED** entries preventing access
- Expected: User has active bumps + duplicate locked bumps
- Reality: This was NOT the issue

### Actual Problem (CORRECT)
- Problem: Duplicate **ACTIVE** entries for the same products
- Reality: Each order bump appears **TWICE** in active status
- Count: **8 active order bumps** (should be only 4)

## Current Database State

```
User: kriziarc9@gmail.com

Total entries: 10
├─ Main products (active): 1 ✅
├─ Order bumps (active): 8 ❌ PROBLEM (should be 4)
└─ Order bumps (locked): 1 ✅ (legitimate, not purchased yet)

Breakdown:
├─ 4 products have DUPLICATE active entries
├─ 4 duplicate entries need to be DELETED
└─ Result: Should have only 4 unique active order bumps
```

## Why This Happened

Looking at the webhook timeline and code logic:

1. **First webhook processing** (Order bumps arrived BEFORE main product):
   - Order bump webhooks processed → Created as ACTIVE (no locked entry existed)
   - Products: 6558460, 6558441, 6558478, 6557903 (all active)

2. **Second webhook processing** (Main product arrived):
   - Main product webhook processed → Created main product + all locked bumps
   - BUT: The code in `route.ts:608-729` for order bump activation had a flaw

3. **The Bug**: When processing order bump webhooks, the code did this:
   ```typescript
   const { data: existingOrderBump } = await supabaseAdmin
     .from('user_products')
     .select('*')
     .eq('user_id', userId)
     .eq('product_id', productId)
     .eq('is_order_bump', true)
     .single()  // ⚠️ PROBLEM: .single() throws error if multiple exist

   if (existingOrderBump) {
     // Update to active
   } else {
     // Insert new active entry ❌ This path was taken!
   }
   ```

4. **What Actually Happened**:
   - First order bump webhook → No entry exists → Insert active ✅
   - Duplicate/retry webhook → Entry exists, but `.single()` might have failed → Insert ANOTHER active ❌
   - OR: Race condition between webhooks

## The Fix Applied

### Code Changes ([route.ts:608-729](app/api/webhook/hotmart/route.ts#L608-L729))

The new code now:

1. **Checks for idempotency FIRST**:
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
     return // Already processed, exit early
   }
   ```

2. **Handles multiple existing entries**:
   ```typescript
   // NEW: Get ALL existing entries (not just .single())
   const { data: existingOrderBumps } = await supabaseAdmin
     .from('user_products')
     .select('*')
     .eq('user_id', userId)
     .eq('product_id', productId)
     .eq('is_order_bump', true)

   const lockedOrderBump = existingOrderBumps?.find(ob => ob.status === 'locked')
   const activeOrderBump = existingOrderBumps?.find(ob => ob.status === 'active')
   ```

3. **Auto-cleans duplicates**:
   ```typescript
   if (lockedOrderBump) {
     // Update locked to active
     await update(lockedOrderBump.id)

     // NEW: If duplicate active exists, delete it
     if (activeOrderBump && activeOrderBump.id !== lockedOrderBump.id) {
       await delete(activeOrderBump.id)
     }
   }
   ```

## Cleanup Scripts

### For This Specific User
**File**: [fix-duplicate-active-bumps.sql](fix-duplicate-active-bumps.sql)

```bash
psql your_database < fix-duplicate-active-bumps.sql
```

**What it does**:
- Finds all products with multiple active entries
- Keeps the OLDEST entry (first created)
- Deletes newer duplicates
- Safe to run multiple times (idempotent)

**Expected result**:
```
Deleted 4 duplicate active order bump entries
Final state:
- Main products: 1
- Active order bumps: 4 (down from 8)
- Locked order bumps: 1
```

### For All Users
**File**: [cleanup-duplicate-order-bumps.sql](cleanup-duplicate-order-bumps.sql)

```bash
psql your_database < cleanup-duplicate-order-bumps.sql
```

**What it does**:
- Phase 1: Delete duplicate locked entries (if any exist)
- Phase 2: Delete duplicate active entries (keep oldest)
- Reports before/after state for all affected users

## Verification

After running the cleanup, verify with:

```sql
-- Should return count = 4
SELECT COUNT(*) as active_order_bumps
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = true
  AND status = 'active';

-- Should return 0 rows (no duplicates)
SELECT product_id, COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = true
  AND status = 'active'
GROUP BY product_id
HAVING COUNT(*) > 1;
```

## Summary

| Metric | Before | After |
|--------|--------|-------|
| Total entries | 10 | 6 |
| Main products | 1 | 1 |
| Active order bumps | 8 ❌ | 4 ✅ |
| Locked order bumps | 1 | 1 |
| Duplicate entries | 4 | 0 |

## Files to Use

1. ✅ **Diagnosis**: [find-duplicate-actives.sql](find-duplicate-actives.sql) - See what's wrong
2. ✅ **Single User Fix**: [fix-duplicate-active-bumps.sql](fix-duplicate-active-bumps.sql) - Fix this user
3. ✅ **All Users Fix**: [cleanup-duplicate-order-bumps.sql](cleanup-duplicate-order-bumps.sql) - Fix everyone
4. ✅ **Code Fix**: [app/api/webhook/hotmart/route.ts](app/api/webhook/hotmart/route.ts) - Prevent future issues

## Next Steps

```bash
# 1. Diagnose (already done)
psql your_database < find-duplicate-actives.sql

# 2. Backup
pg_dump -t user_products > backup_user_products.sql

# 3. Fix this user
psql your_database < fix-duplicate-active-bumps.sql

# 4. Deploy code changes (prevents future duplicates)
git add app/api/webhook/hotmart/route.ts
git commit -m "Fix: Prevent duplicate active order bump entries"
git push
```

---

**Issue Type**: Duplicate ACTIVE entries (not locked)
**Root Cause**: Missing idempotency check + `.single()` error handling
**Impact**: User sees multiple entries for same product
**Fix**: Delete duplicates (keep oldest) + improve webhook processing
**Status**: ✅ Fix ready to deploy

---

**Last Updated**: 2026-01-05
