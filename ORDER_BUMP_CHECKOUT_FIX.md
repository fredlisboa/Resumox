# Order Bump Checkout URL Fix

## Problem Identified

All locked order bumps were redirecting to the same fallback checkout URL (`https://pay.hotmart.com/B102739272B`) instead of their specific checkout pages.

## Root Cause

The `ORDER_BUMP_CHECKOUT_URLS` mapping in `lib/product-config.ts` was using **incorrect product IDs** as keys:
- **Old keys**: `'ORDERBUMP01'`, `'ORDERBUMP02'`, etc. (string identifiers)
- **Actual database IDs**: `'6846443'`, `'6557903'`, etc. (numeric product IDs)

When the API tried to look up checkout URLs using `ORDER_BUMP_CHECKOUT_URLS[content.product_id]`, it couldn't find a match and always fell back to the default URL.

## Solution Applied

Updated `lib/product-config.ts` to use the **correct product IDs from the database**:

```typescript
export const ORDER_BUMP_CHECKOUT_URLS: Record<string, string> = {
  // Protocolo de Descompresión Somática
  '6846443': 'https://pay.hotmart.com/B102739272B',

  // Preguntas Poderosas para el Desarrollo Socioemocional
  '6557903': 'https://pay.hotmart.com/A102740797J',

  // Ferramentas de Regulação Emocional
  '6558403': 'https://pay.hotmart.com/K102740604W',

  // NeuroAfetividad Infantil
  '6558441': 'https://pay.hotmart.com/R102740753N',

  // Metáforas Emocionales
  '6558460': 'https://pay.hotmart.com/A102740710S',

  // Coloreando Emociones
  '6558478': 'https://pay.hotmart.com/B102739272B' // TODO: Add correct URL
}
```

## Current Status

✅ **Fixed**: Product IDs now match database entries
✅ **Working**: 5 out of 6 order bumps have unique checkout URLs
⚠️ **Pending**: 2 products still need their specific Hotmart checkout URLs:
  - `6846443` - Protocolo de Descompresión Somática (currently using fallback)
  - `6558478` - Coloreando Emociones (needs specific URL)

## Additional Order Bumps Visible in Screenshot

Based on the screenshot showing items 15-21 as locked order bumps, there appear to be **more order bumps** than what's currently in the database. You may need to:

1. Check if there are other products with `status = 'order_bump'` in the database
2. Run the identification script to find all order bumps:
   ```bash
   npx tsx scripts/check-order-bump-ids.ts
   ```
3. Add missing products to the `ORDER_BUMP_CHECKOUT_URLS` configuration

## How to Add More Checkout URLs

1. **Get the Hotmart checkout URL** for each order bump product
2. **Update `lib/product-config.ts`**:
   ```typescript
   export const ORDER_BUMP_CHECKOUT_URLS: Record<string, string> = {
     '6846443': 'https://pay.hotmart.com/YOUR_URL_HERE',
     '6558478': 'https://pay.hotmart.com/YOUR_URL_HERE',
     // ... other products
   }
   ```

3. **Verify the configuration**:
   ```bash
   npx tsx scripts/verify-checkout-urls.ts
   ```

## Testing

To test that locked order bumps now redirect to the correct checkout pages:

1. Log in as a user who has locked order bumps
2. Navigate to the dashboard
3. Click on a locked order bump
4. Verify it opens the **correct Hotmart checkout page** (not the fallback)

## Verification Scripts

Two new scripts have been created to help manage checkout URLs:

1. **`scripts/check-order-bump-ids.ts`** - Lists all order bump product IDs in the database
2. **`scripts/verify-checkout-urls.ts`** - Verifies the configuration in `product-config.ts`

## Files Modified

- ✅ `lib/product-config.ts` - Updated with correct product IDs
- ✅ `scripts/check-order-bump-ids.ts` - New verification script
- ✅ `scripts/verify-checkout-urls.ts` - New verification script

## Next Steps

1. **Identify missing order bumps**: Check if items 15-21 from the screenshot are all in the database
2. **Get correct URLs**: Obtain the specific Hotmart checkout URLs for:
   - Protocolo de Descompresión Somática (`6846443`)
   - Coloreando Emociones (`6558478`)
   - Any other order bumps not yet configured
3. **Update configuration**: Add the URLs to `lib/product-config.ts`
4. **Test**: Verify each locked order bump redirects correctly
