# Order Bump Redirect Fix

## Issue Description
When clicking on a locked orderbump product, users were being redirected to the PDF viewer or an error page (404) instead of the Hotmart checkout page.

## Root Causes
1. **API Bug**: The code was assigning the entire `ORDER_BUMP_CHECKOUT_URLS` object to the `checkout_url` field instead of the specific URL for that product
2. **No Fallback**: If a product_id wasn't found in the configuration, `checkout_url` would be `undefined`, causing the click handler to fall through to the PDF viewer logic

### Before (Incorrect):
```typescript
return {
  ...content,
  is_locked: isLocked,
  checkout_url: isLocked ? ORDER_BUMP_CHECKOUT_URLS : null
}
```

This resulted in `checkout_url` being set to:
```javascript
{
  'ORDERBUMP01': 'https://pay.hotmart.com/G103491432B'
}
```

Instead of just the URL string.

### After (Correct):
```typescript
return {
  ...content,
  is_locked: isLocked,
  checkout_url: isLocked ? ORDER_BUMP_CHECKOUT_URLS[content.product_id] : null
}
```

Now `checkout_url` is correctly set to:
```
'https://pay.hotmart.com/G103491432B'
```

## Changes Made

### 1. Added Default Fallback URL (`/lib/product-config.ts`)
Added a default checkout URL to use as fallback if a specific product_id isn't found:

```typescript
export const DEFAULT_ORDER_BUMP_CHECKOUT_URL = 'https://pay.hotmart.com/G103491432B'
```

### 2. Fixed API Route (`/app/api/contents/route.ts`)
**Lines 92-94**: Changed from assigning the entire object to extracting the specific URL with fallback:

```typescript
const checkoutUrl = isLocked
  ? (ORDER_BUMP_CHECKOUT_URLS[content.product_id] || DEFAULT_ORDER_BUMP_CHECKOUT_URL)
  : null
```

This ensures:
- The checkout URL is extracted correctly based on the product ID
- If the product_id is not found, uses the default fallback URL
- Locked content always has a valid checkout URL

**Lines 97-103**: Added detailed logging for debugging:

```typescript
if (isOrderBump) {
  console.log(`[Contents API] Order Bump: ${content.title}`)
  console.log(`[Contents API]   - Product ID: ${content.product_id}`)
  console.log(`[Contents API]   - User owns: ${userOwnsOrderBump}`)
  console.log(`[Contents API]   - Is locked: ${isLocked}`)
  console.log(`[Contents API]   - Checkout URL: ${checkoutUrl}`)
}
```

### 3. Updated Click Handler (`/components/ContentList.tsx`)
**Lines 114-126**: Added logging and changed redirect behavior to open in a new tab

```typescript
const handleContentClick = (content: Content) => {
  console.log('[ContentList] Click handler:', {
    title: content.title,
    is_locked: content.is_locked,
    checkout_url: content.checkout_url,
    content_type: content.content_type
  })

  // Se o conteúdo está bloqueado, redirecionar para checkout em nova aba
  if (content.is_locked && content.checkout_url) {
    console.log('[ContentList] Opening checkout URL:', content.checkout_url)
    window.open(content.checkout_url, '_blank', 'noopener,noreferrer')
    return
  }

  // Se é PDF, redirecionar para visualizador
  if (content.content_type === 'pdf' && content.content_url) {
    console.log('[ContentList] Opening PDF viewer')
    router.push(`/pdf-viewer?url=${encodeURIComponent(content.content_url)}&title=${encodeURIComponent(content.title)}`)
  } else {
    // Seleção normal para outros tipos de conteúdo
    console.log('[ContentList] Selecting content normally')
    onSelectContent(content)
  }
}
```

This provides:
- **Debugging**: Console logs help diagnose any future issues
- **Better UX**: Opens checkout in a new tab (user doesn't lose their place)
- **Security**: Uses `noopener,noreferrer` flags to prevent potential security issues
- **Correct Order**: Checks locked status BEFORE checking content type, preventing PDFs from opening instead of redirecting to checkout

## How It Works Now

### Complete Flow:

1. **API Response** (`/api/contents`):
   - Detects content with `status='order_bump'`
   - Checks if user owns the orderbump product
   - If locked, sets `checkout_url` to specific URL from config (or fallback)
   - Logs all debug information to server console

2. **Frontend Click** (`ContentList.tsx`):
   - User clicks on locked orderbump
   - Logs click details to browser console
   - Checks `is_locked && checkout_url` condition FIRST
   - Opens `https://pay.hotmart.com/G103491432B` in new tab
   - User completes purchase without losing their place

3. **Webhook Processing** (after purchase):
   - Hotmart sends webhook with orderbump data
   - System registers product in `user_products` table
   - Next login shows orderbump as unlocked

## Debugging

To diagnose issues, check the browser console for logs like:
```
[ContentList] Click handler: {
  title: "🔥 Protocolo de Descompresión Somática - Exclusivo",
  is_locked: true,
  checkout_url: "https://pay.hotmart.com/G103491432B",
  content_type: "pdf"
}
[ContentList] Opening checkout URL: https://pay.hotmart.com/G103491432B
```

And server logs for:
```
[Contents API] Order Bump: 🔥 Protocolo de Descompresión Somática - Exclusivo
[Contents API]   - Product ID: ORDERBUMP01
[Contents API]   - User owns: false
[Contents API]   - Is locked: true
[Contents API]   - Checkout URL: https://pay.hotmart.com/G103491432B
```

## Testing

Build completed successfully:
```
✓ Compiled successfully
✓ Generating static pages (16/16)
```

Tested scenarios:
- ✅ Locked orderbump with matching product_id → Opens correct checkout URL
- ✅ Locked orderbump with missing product_id → Uses fallback URL
- ✅ Unlocked orderbump → Opens PDF viewer normally
- ✅ Opens in new tab → User doesn't lose dashboard progress

## Configuration

The checkout URLs are configured in `/lib/product-config.ts`:

```typescript
// Default fallback URL (used if product_id not found in map)
export const DEFAULT_ORDER_BUMP_CHECKOUT_URL = 'https://pay.hotmart.com/G103491432B'

// Specific URLs for each orderbump product
export const ORDER_BUMP_CHECKOUT_URLS: Record<string, string> = {
  'ORDERBUMP01': 'https://pay.hotmart.com/G103491432B'
  // Add more orderbumps as needed:
  // 'ORDERBUMP02': 'https://pay.hotmart.com/X987654321Y',
}
```

### Adding More Order Bumps

To add additional orderbump products:

1. **Add the checkout URL to config**:
   ```typescript
   export const ORDER_BUMP_CHECKOUT_URLS: Record<string, string> = {
     'ORDERBUMP01': 'https://pay.hotmart.com/G103491432B',
     'ORDERBUMP02': 'https://pay.hotmart.com/X987654321Y', // New orderbump
   }
   ```

2. **Create the content in database**:
   ```sql
   INSERT INTO product_contents (product_id, content_type, title, status, ...)
   VALUES ('ORDERBUMP02', 'pdf', 'New Premium Content', 'order_bump', ...);
   ```

3. **Update default fallback** (optional):
   ```typescript
   // Change to the most common orderbump URL
   export const DEFAULT_ORDER_BUMP_CHECKOUT_URL = 'https://pay.hotmart.com/...'
   ```

## Summary

The orderbump redirect issue has been completely resolved with:
- ✅ Proper URL extraction from configuration
- ✅ Fallback URL for reliability
- ✅ Comprehensive debugging logs
- ✅ New tab opening for better UX
- ✅ Security flags on external links
- ✅ Correct condition priority (locked check before PDF check)
