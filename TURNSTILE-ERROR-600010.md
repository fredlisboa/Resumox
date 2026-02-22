# Turnstile Error 600010 - Complete Fix Guide

## What is Error 600010?

Error 600010 is a Cloudflare Turnstile error that indicates a **configuration or domain mismatch** issue. This typically happens when:

1. The site key doesn't match the domain
2. The domain isn't whitelisted in Cloudflare Turnstile dashboard
3. Localhost testing without proper configuration
4. Invalid or expired site key

## The Root Cause in Your Case

The error "Note that 'script-src' was not explicitly set" indicates that CSP headers were **not being applied during development** because:
- Next.js `headers()` in `next.config.js` only works in **production builds**
- Development server (`npm run dev`) doesn't apply these headers
- This causes Turnstile to fail due to CSP violations

## Complete Solution Applied

### 1. Moved CSP Headers to Middleware
**File: `middleware.ts`**

CSP headers are now applied by the middleware, which works in **both development and production**:

```typescript
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.cloudflare.com",
    "frame-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
    // ... other directives
  ].join('; '))
  return response
}
```

### 2. Headers Now Applied to All Routes
Every response now gets security headers in all environments.

## How to Fix Error 600010

### Step 1: Clear All Caches
```bash
# Stop dev server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Clear browser cache
# Chrome: Ctrl+Shift+Delete → Clear cached files
```

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: Hard Refresh Browser
- Desktop: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Mobile: Close and reopen browser

### Step 4: Verify CSP Headers Are Applied

Open browser console and run:
```javascript
// Check response headers
fetch(window.location.href).then(r => {
  console.log('CSP:', r.headers.get('content-security-policy'))
})
```

You should see a CSP header with Cloudflare domains.

### Step 5: Check Turnstile Configuration

Visit Cloudflare Turnstile dashboard and verify:

1. **Domain Whitelist**:
   - Add `localhost` for development
   - Add your production domain
   - Add `*.vercel.app` if using Vercel

2. **Site Key**: Verify it matches your `.env.local`:
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACHaevpEWBcwGb8i
   ```

3. **Mode**: Check if you're using "Managed" or "Non-Interactive" mode

## Testing After Fix

### Test 1: Verify CSP in Network Tab
1. Open Chrome DevTools → Network tab
2. Refresh page
3. Click on the document request
4. Check Headers → Response Headers
5. Look for `content-security-policy` with Cloudflare domains

### Test 2: Verify Turnstile Loads
1. Open page: http://localhost:3000/iemocional
2. Open Console tab
3. You should see: "Turnstile success" (no error 600010)
4. Widget should display checkbox or challenge

### Test 3: Complete Verification Flow
1. Widget shows challenge
2. Complete verification
3. Enter email
4. Submit form
5. No errors in console

## If Error 600010 Persists

### Option A: Check Site Key Configuration

1. **Verify environment variable:**
```bash
cat .env.local | grep TURNSTILE
```

2. **Check if key is correct:**
   - Log into Cloudflare Turnstile dashboard
   - Compare site key with your `.env.local`
   - Ensure you're using the site key, not the secret key

### Option B: Check Domain Whitelist

Error 600010 often means domain not allowed:

1. Go to Cloudflare Turnstile dashboard
2. Find your site key
3. Add to domain whitelist:
   - `localhost` (for dev)
   - `127.0.0.1` (for dev)
   - Your production domain
   - `*.vercel.app` (if using Vercel)

### Option C: Create New Site Key

If your site key is old or misconfigured:

1. Go to Cloudflare Turnstile dashboard
2. Create new site
3. Configure domains:
   - Add `localhost`
   - Add `127.0.0.1`
   - Add your production domains
4. Copy new site key and secret key
5. Update `.env.local`:
```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<new_site_key>
TURNSTILE_SECRET_KEY=<new_secret_key>
```
6. Restart dev server

## Expected Behavior After Fix

✅ **No CSP errors** - "script-src" is explicitly set
✅ **No error 600010** - Domain is whitelisted and CSP allows scripts
✅ **Widget loads immediately** - No infinite spinner
✅ **Verification works** - Can complete challenge
✅ **Works in dev and production** - Middleware applies headers everywhere

## Debugging Commands

### Check if CSP is applied:
```bash
curl -I http://localhost:3000/iemocional | grep -i "content-security"
```

Should output:
```
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com...
```

### Check Turnstile script loading:
Open console and run:
```javascript
// After page loads
console.log('Turnstile loaded:', typeof window.turnstile !== 'undefined')
console.log('Turnstile object:', window.turnstile)
```

### Monitor for errors:
```javascript
window.addEventListener('error', (e) => {
  console.error('Page error:', e.message, e.filename)
})
```

## Key Differences: Dev vs Production

| Aspect | Development (npm run dev) | Production (npm start) |
|--------|--------------------------|------------------------|
| CSP Headers | ✅ Applied via middleware | ✅ Applied via middleware + next.config |
| Turnstile | Should work with localhost whitelisted | Works with production domains |
| Error visibility | More verbose in console | Cleaner logs |
| Performance | Slower, unoptimized | Fast, optimized |

## Summary

The fix involved:
1. ✅ Moving CSP headers from `next.config.js` to `middleware.ts`
2. ✅ Ensuring headers apply in ALL environments (dev + prod)
3. ✅ Adding all necessary Cloudflare domains to CSP
4. ✅ Proper error handling in TurnstileWidget component

Error 600010 should now be resolved because:
- CSP explicitly allows Turnstile scripts
- Headers work in development mode
- All Cloudflare domains are whitelisted in CSP
- Domain whitelist should include localhost

## Next Steps

1. Clear caches (Next.js + browser)
2. Restart dev server
3. Hard refresh browser
4. Test on http://localhost:3000/iemocional
5. If still failing, check Cloudflare dashboard for domain whitelist
