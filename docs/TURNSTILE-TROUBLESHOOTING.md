# Turnstile Infinite Loading Loop - Troubleshooting

## Issue
The Turnstile widget shows a loading spinner indefinitely on both PC and mobile.

## Root Cause
The custom TurnstileWidget component had a script detection loop that prevented the widget from rendering.

## Fix Applied
Simplified the TurnstileWidget component by removing the problematic script detection logic.

## Testing Steps

### 1. Clear Browser Cache
**Important**: The browser may have cached the old broken code.

**On Desktop Chrome:**
1. Press `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"

**On Mobile Chrome:**
1. Open Chrome Settings
2. Privacy and Security → Clear browsing data
3. Select "Cached images and files"
4. Clear data

### 2. Hard Refresh the Page
- **Desktop**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Mobile**: Pull down to refresh or close/reopen the browser

### 3. Test the Widget

Visit: http://localhost:3000/iemocional

**Expected Behavior:**
1. ✅ Turnstile widget appears immediately (no long loading)
2. ✅ Shows checkbox or challenge
3. ✅ Can complete verification
4. ✅ Can submit form

**If Still Loading:**
Check the browser console for errors.

## Common Issues After Fix

### Issue 1: Still Shows Loading Spinner
**Cause**: Browser cache
**Solution**:
```bash
# Stop dev server (Ctrl+C)
# Clear Next.js cache
rm -rf .next
# Restart
npm run dev
```

Then clear browser cache and hard refresh.

### Issue 2: "Invalid site key" Error
**Cause**: Environment variable not loaded
**Solution**:
```bash
# Verify .env.local has the site key
cat .env.local | grep TURNSTILE

# Should show:
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAACHaevpEWBcwGb8i
```

Restart dev server after confirming.

### Issue 3: CSP Errors in Console
**Expected**: Some CSP warnings are normal
**Action Needed**: Only if Turnstile doesn't load at all

Check if you see:
```
Content Security Policy: The page's settings blocked the loading of a resource at https://challenges.cloudflare.com/...
```

If yes, verify `next.config.js` headers are correctly configured.

### Issue 4: "Error: 60010" Still Appears
This error may appear but should auto-recover with the retry mechanism.

**If it doesn't recover:**
1. Check that your domain is whitelisted in Cloudflare Turnstile dashboard
2. Verify you're using the correct site key for your environment (dev vs production)
3. Check that localhost is allowed in Turnstile settings

## Verification Checklist

After applying the fix:

- [ ] Dev server is running without errors
- [ ] Cleared .next cache folder
- [ ] Cleared browser cache
- [ ] Hard refreshed the page
- [ ] Turnstile widget appears (not infinite spinner)
- [ ] Can complete verification
- [ ] Can submit login form

## Testing on Different Environments

### Localhost (Development)
```bash
npm run dev
# Visit: http://localhost:3000/iemocional
```

### Production Build (Local Test)
```bash
npm run build
npm start
# Visit: http://localhost:3000/iemocional
```

### Deployed (Vercel)
```bash
vercel --prod
# Visit your production URL
```

## Debug Commands

### Check if Turnstile script loads:
Open browser console and run:
```javascript
console.log(window.turnstile)
// Should show an object if loaded correctly
```

### Check CSP headers:
```bash
curl -I http://localhost:3000/iemocional | grep -i "content-security"
```

### Check environment variables:
```bash
npm run dev
# Look for "Environments: .env.local" in startup message
```

## Quick Fix Commands

```bash
# Full reset
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Just clear cache
rm -rf .next
npm run dev

# Force rebuild
npm run build
```

## Current Configuration

The simplified TurnstileWidget:
- ✅ No script detection loop
- ✅ Direct rendering
- ✅ Auto-retry on error
- ✅ Proper error handling
- ✅ Works with CSP headers

## Next Steps

1. **Test on localhost** - Visit http://localhost:3000/iemocional
2. **Clear cache if needed** - Follow steps above
3. **Test on real device** - Most reliable test
4. **Deploy and test** - Production environment

## Getting Help

If the issue persists after:
1. Clearing .next cache
2. Clearing browser cache
3. Hard refresh
4. Restarting dev server

Then check:
- Browser console for specific error messages
- Network tab for failed requests to cloudflare.com
- Environment variables are correctly set
- Turnstile site key is valid and active
