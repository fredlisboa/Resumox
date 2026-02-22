# Order Bump Testing Guide

This guide explains how to test the complete order bump flow to ensure everything is working correctly.

## 📋 Test Scripts

### 1. **Complete Flow Test** (`test-order-bump-flow.ts`)

**Purpose:** Tests the entire order bump flow from webhook to content unlocking.

**What it does:**
- ✅ Simulates Hotmart webhook for main product purchase
- ✅ Simulates Hotmart webhook for order bump purchase
- ✅ Verifies database state (users, products, flags)
- ✅ Tests content unlocking logic
- ✅ Validates that purchased order bumps are unlocked
- ✅ Validates that unpurchased order bumps remain locked

**Usage:**
```bash
# Make sure you have .env.local configured first!
# The script automatically loads environment variables from .env.local

# Use default test email
npx tsx scripts/test-order-bump-flow.ts

# Use custom email
npx tsx scripts/test-order-bump-flow.ts test@example.com
```

**Requirements:**
- `.env.local` file must exist with proper configuration
- Server must be running on `localhost:3000` (or set `WEBHOOK_TEST_URL`)
- Required environment variables in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `HOTMART_WEBHOOK_SECRET`
- Database must be accessible

**Output Example:**
```
═══════════════════════════════════════════════════════
  🧪 ORDER BUMP FLOW COMPLETE TEST
═══════════════════════════════════════════════════════

📧 Test Email: test-1234567890@example.com
🔗 Webhook URL: http://localhost:3000/api/webhook/hotmart
🔑 Webhook Secret: Configured ✅

🧹 Cleaning up test data...
✅ Cleanup completed

📤 Sending webhook for MAIN PRODUCT...
✅ Webhook Main Product: Webhook processed successfully

📤 Sending webhook for ORDER BUMP...
✅ Webhook Order Bump: Webhook processed successfully

🔍 Verifying database state...
✅ User Creation: User created with ID: abc-123
✅ User Products: Found 2 product(s)
✅ Main Product: Main product registered: 6557972
✅ Order Bump Product: Order bump registered: ORDERBUMP01
✅ Order Bump Flag: is_order_bump flag is correct
✅ Order Bump Status: Status is active

🔓 Testing content unlocking logic...
✅ Active Products: User has 2 active product(s)
✅ Content Processing: Processed 15 content(s)
✅ Order Bump Unlocking: Order bump content is UNLOCKED (expected: UNLOCKED)

═══════════════════════════════════════════════════════
  📊 TEST SUMMARY
═══════════════════════════════════════════════════════

Total Tests: 10
Passed: 10
Failed: 0

🎉 ALL TESTS PASSED! The order bump flow is working correctly.
```

---

### 2. **Quick Status Check** (`check-order-bump-status.ts`)

**Purpose:** Quickly check the order bump status for a specific user.

**What it does:**
- 📧 Shows user information
- 📦 Lists all user products (main + order bumps)
- 📚 Shows content status (locked/unlocked)
- 📊 Provides summary and error detection

**Usage:**
```bash
# The script automatically loads environment variables from .env.local
npx tsx scripts/check-order-bump-status.ts user@example.com
```

**Requirements:**
- `.env.local` file must exist with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

**Output Example:**
```
═══════════════════════════════════════════════════════
  🔍 ORDER BUMP STATUS CHECK
═══════════════════════════════════════════════════════

📧 User Email: user@example.com

✅ User found
   ID: abc-123
   Status: active
   Main Product: 6557972

📦 User Products:

   1. 📌 MAIN PRODUCT ✅
      Product ID: 6557972
      Product Name: NeuroReset
      Transaction: HP-123456789
      Status: active
      Purchased: 12/20/2025, 10:30:00 AM

   2. 🔥 ORDER BUMP ✅
      Product ID: ORDERBUMP01
      Product Name: Protocolo de Descompresión
      Transaction: HP-987654321
      Status: active
      Purchased: 12/20/2025, 10:31:00 AM
      Parent Transaction: HP-123456789

📚 Content Status:
   Active Product IDs: 6557972, ORDERBUMP01

   📌 Main Contents: 12
      • NeuroReset - Calma Mental
      • Track01 - Dormir Profundo (Noite)
      ...

   🎁 Bonus Contents: 2
      • Bono 1: El Escudo Anti-Estrés
      • Bono 2: Gratitud Express

   🔥 Order Bump Contents: 1
      🔓 🔥 Protocolo de Descompresión Somática
         Product ID: ORDERBUMP01
         User owns: YES ✅
         Status: UNLOCKED

📊 SUMMARY:
   Total Contents: 15
   Unlocked: 15
   Locked: 0

   ✅ User owns 1 order bump(s) - should be UNLOCKED

═══════════════════════════════════════════════════════
```

---

## 🧪 Testing Scenarios

### Scenario 1: User Purchases Main Product Only

**Expected Behavior:**
- ✅ Main product content is unlocked
- 🔒 Order bump content remains locked
- 🔒 Clicking order bump redirects to checkout

**How to Test:**
1. Send webhook with main product only
2. Check content API response
3. Verify order bump shows `is_locked: true`

### Scenario 2: User Purchases Main Product + Order Bump

**Expected Behavior:**
- ✅ Main product content is unlocked
- ✅ Order bump content is unlocked
- ✅ All content is accessible

**How to Test:**
1. Send webhook with main product
2. Send webhook with order bump (same checkout session)
3. Check content API response
4. Verify order bump shows `is_locked: false`

### Scenario 3: Order Bump Detection Strategies

The webhook uses multiple strategies to detect order bumps:

**Strategy 1: Hotmart Flag**
```json
{
  "purchase": {
    "order_bump": {
      "is_order_bump": true,
      "parent_purchase_transaction": "HP-MAIN-123"
    }
  }
}
```

**Strategy 2: Checkout Session Matching**
- Multiple products with same `origin.sck` value
- First product = main product
- Subsequent products = order bumps

**How to Test:**
```bash
# Run the complete flow test
npx tsx scripts/test-order-bump-flow.ts

# Check logs for detection strategy used
# Look for: "✅ Order bump DETECTED via checkout session strategy"
```

---

## 🐛 Debugging

### Enable Detailed Logging

The webhook and content API now include detailed logging:

**Webhook Logs:**
```
[Hotmart Webhook] ===== ORDER BUMP DETECTION START =====
[Hotmart Webhook] Buyer email: user@example.com
[Hotmart Webhook] Product ID: ORDERBUMP01
[Hotmart Webhook] Checkout session (sck): SESSION-123
[Hotmart Webhook] Hotmart is_order_bump flag: false
[Hotmart Webhook] ✅ Order bump DETECTED via checkout session strategy
[Hotmart Webhook] ===== ORDER BUMP DETECTION RESULT =====
[Hotmart Webhook] Is Order Bump: ✅ YES
```

**Content API Logs:**
```
[Contents API] User: user@example.com
[Contents API] Active products: ["6557972", "ORDERBUMP01"]
[Contents API] Order Bump: Protocolo de Descompresión
[Contents API]   - Product ID: ORDERBUMP01
[Contents API]   - User owns: true
[Contents API]   - Is locked: false
```

### Check Database Directly

```sql
-- Check user products
SELECT
  product_id,
  product_name,
  is_order_bump,
  status,
  purchase_date
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'user@example.com');

-- Check product contents
SELECT
  product_id,
  title,
  status,
  is_active
FROM product_contents
WHERE status = 'order_bump';
```

### Common Issues

**Issue 1: Order Bump Remains Locked After Purchase**

**Cause:** Product IDs don't match

**Solution:**
1. Check webhook logs for registered `product_id`
2. Check `product_contents` table for content `product_id`
3. Ensure they match exactly

```bash
# Check what was registered
npx tsx scripts/check-order-bump-status.ts user@example.com
```

**Issue 2: Webhook Not Detecting Order Bump**

**Cause:** Missing checkout session or order bump flag

**Solution:**
1. Check webhook payload includes `origin.sck`
2. Check Hotmart settings for order bump configuration
3. Review webhook logs for detection strategy

**Issue 3: Content API Returns Empty**

**Cause:** No active products or expired products

**Solution:**
```sql
-- Check product status and expiration
SELECT
  product_id,
  status,
  expiration_date,
  purchase_date
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'user@example.com');
```

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Run complete flow test: `npx tsx scripts/test-order-bump-flow.ts`
- [ ] Verify all tests pass (10/10)
- [ ] Test with real Hotmart webhook (use test mode)
- [ ] Check logs show correct order bump detection
- [ ] Verify purchased order bumps are unlocked
- [ ] Verify unpurchased order bumps remain locked
- [ ] Test checkout redirect works for locked order bumps
- [ ] Verify database constraints allow 'order_bump' status
- [ ] Check frontend displays locked/unlocked states correctly

---

## 🚀 Production Testing

### Using Hotmart Test Mode

1. **Configure test webhook in Hotmart:**
   ```
   URL: https://yourdomain.com/api/webhook/hotmart
   Secret: [Your HOTMART_WEBHOOK_SECRET]
   Events: PURCHASE_APPROVED, PURCHASE_REFUNDED
   ```

2. **Make test purchase:**
   - Use Hotmart test credit card
   - Purchase main product + order bump
   - Monitor webhook logs

3. **Verify in production:**
   ```bash
   # SSH into production server
   ssh your-server

   # Check logs
   pm2 logs your-app --lines 100

   # Look for webhook processing logs
   # grep "Hotmart Webhook"
   ```

4. **Check user status:**
   ```bash
   npx tsx scripts/check-order-bump-status.ts test-user@example.com
   ```

---

## 📞 Support

If tests fail or you encounter issues:

1. Check the detailed logs in the test output
2. Review the "Common Issues" section above
3. Run the status check script for affected users
4. Check database state manually
5. Review webhook payload in `hotmart_webhooks` table

---

## 🔄 Changelog

### 2025-12-20
- ✅ Fixed content unlocking bug for purchased order bumps
- ✅ Added comprehensive logging to webhook
- ✅ Created complete flow test script
- ✅ Created quick status check script
- ✅ Updated documentation

---

**Last Updated:** 2025-12-20
