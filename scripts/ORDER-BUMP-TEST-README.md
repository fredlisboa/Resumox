# Order Bump Purchase Test

This document explains how to test Hotmart webhook order bump functionality.

## Overview

The test simulates a real-world scenario where a customer purchases:
- **Main Product**: ID `6557472`
- **Order Bump**: ID `6557473`

Both products are purchased in the same checkout session, with webhooks sent seconds apart.

## Test Script

### File
[scripts/test-order-bump-purchase.ts](./test-order-bump-purchase.ts)

### What It Does

1. **Generates unique identifiers** for the test:
   - Checkout session ID (shared between both products)
   - Main product transaction ID
   - Order bump transaction ID

2. **Sends two PURCHASE_APPROVED webhooks**:
   - First webhook: Main product (6557472)
   - Second webhook: Order bump (6557473) with reference to main product

3. **Both webhooks include**:
   - Same checkout session ID (`sck` field)
   - Same buyer email: `hotmartuser@gmail.com`
   - Proper HMAC signatures for authentication
   - Order bump flag on the second product

## Usage

### Run the Test

```bash
npm run test:order-bump
```

Or directly:

```bash
tsx scripts/test-order-bump-purchase.ts
```

### Check Results

After running the test, verify the results:

```bash
# Check all webhooks received
npm run check:webhooks

# Check specific user's products
npm run check:user-products hotmartuser@gmail.com

# Check for any errors
npm run check:errors
```

## Expected Results

### In Database

After a successful test, the database should contain:

1. **users_access table**:
   - One record for `hotmartuser@gmail.com`
   - `status_compra`: `'active'`
   - `product_id`: `'6557472'` (main product)

2. **user_products table**:
   - **Record 1** (Main Product):
     - `product_id`: `'6557472'`
     - `is_order_bump`: `false`
     - `parent_transaction_id`: `null`
     - `status`: `'active'`

   - **Record 2** (Order Bump):
     - `product_id`: `'6557473'`
     - `is_order_bump`: `true`
     - `parent_transaction_id`: Points to main product's transaction ID
     - `status`: `'active'`

3. **hotmart_webhooks table**:
   - Two webhook records with:
     - Same `subscriber_email`
     - Same checkout session ID in payload
     - Both marked as `processed: true`

### Console Output

The script will show:
- ✅ Success indicators for each webhook
- Transaction IDs and checkout session ID
- Summary with test results
- Next steps for verification

## Test Configuration

### Environment Variables Required

```env
HOTMART_WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_URL=http://localhost:3000/api/webhook/hotmart
```

### Test Data

- **Email**: `hotmartuser@gmail.com`
- **Main Product**: `6557472`
- **Order Bump Product**: `6557473`

You can modify these values in the script if needed.

## How Order Bump Detection Works

The webhook handler uses multiple strategies to detect order bumps:

1. **Explicit Flag**: Checks `order_bump.is_order_bump` in webhook payload
2. **Parent Transaction**: Uses `order_bump.parent_purchase_transaction`
3. **Checkout Session Matching**: Searches for other products with same `origin.sck`
4. **Time-based Detection**: Looks for webhooks within 5 minutes with same checkout session

## Troubleshooting

### Test Fails with "Invalid signature"

Check that your `HOTMART_WEBHOOK_SECRET` in `.env.local` matches the script's secret.

### Products Not Appearing in Database

1. Check webhook logs: `npm run check:webhooks`
2. Check for errors: `npm run check:errors`
3. Verify Supabase connection is working
4. Check that your local dev server is running on port 3000

### Order Bump Not Detected

1. Verify both webhooks have the same `origin.sck` value
2. Check webhook timing (should be within 5 minutes)
3. Review webhook handler logs in your terminal

### User Products Not Found

Make sure you're using the correct email when checking:

```bash
npm run check:user-products hotmartuser@gmail.com
```

## Related Files

- [test-order-bump-purchase.ts](./test-order-bump-purchase.ts) - Main test script
- [check-user-products.ts](./check-user-products.ts) - User products verification
- [check-webhook-results.ts](./check-webhook-results.ts) - Webhook logs viewer
- [app/api/webhook/hotmart/route.ts](../app/api/webhook/hotmart/route.ts) - Webhook handler

## Architecture Notes

### Order Bump Flow

```
1. User completes checkout with main product + order bump
   ↓
2. Hotmart sends first webhook (main product)
   → Creates/updates user in users_access
   → Creates entry in user_products (is_order_bump: false)
   ↓
3. Hotmart sends second webhook (order bump) ~2 seconds later
   → Updates user_products with new entry (is_order_bump: true)
   → Links to parent via parent_transaction_id
   → Both entries share same checkout session ID
```

### Why Multiple Products?

The `user_products` table allows tracking multiple products per user:
- Main products from different purchases
- Order bumps from any purchase
- Historical purchases (refunded, cancelled, etc.)

This is more flexible than the legacy `users_access.product_id` field, which only stores one product ID.

## Testing Tips

1. **Clean Database**: Before testing, you may want to delete previous test data for `hotmartuser@gmail.com`

2. **Test Variations**:
   - Run with only main product (comment out order bump webhook)
   - Test with different timing delays
   - Test with missing checkout session ID

3. **Integration Testing**: Run against your deployed webhook URL instead of localhost:
   ```bash
   WEBHOOK_URL=https://your-domain.com/api/webhook/hotmart npm run test:order-bump
   ```

4. **Monitor Real-time**: Keep your dev server logs open to see the webhook processing in action

## Success Criteria

✅ Test is successful when:
- Both webhooks return HTTP 200
- User exists in `users_access` with status `'active'`
- Two products exist in `user_products`
- Order bump product has correct parent reference
- Both products share same checkout session ID
- No errors in webhook logs
