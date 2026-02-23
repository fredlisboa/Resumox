# Testing Turnstile on Chrome Mobile Simulation

## Quick Test Steps

### 1. Start Development Server
```bash
npm run dev
```
Server should start at http://localhost:3000 (or next available port)

### 2. Test in Chrome DevTools Mobile Simulation

#### Option A: With DevTools Closed (Recommended First)
1. Open Chrome browser
2. Navigate to `http://localhost:3000/iemocional`
3. **DO NOT open DevTools yet**
4. The Turnstile widget should load and display
5. Complete the verification
6. Enter email and submit

#### Option B: With DevTools Open
1. Open Chrome browser
2. Navigate to `http://localhost:3000/iemocional`
3. Press `F12` to open DevTools
4. Click the "Toggle device toolbar" icon (or `Ctrl+Shift+M`)
5. Select a mobile device (e.g., "iPhone 12 Pro")
6. Refresh the page
7. Watch the Console tab for any errors

### 3. Understanding Console Messages

**Expected Console Output (Normal)**:
```
Turnstile success
```

**If You See Errors**:
```
Turnstile error: <error_code>
Verification error: <error_code>
Retry attempt 1/3...
```
This is normal - the widget will auto-retry.

**Critical Errors (Need Investigation)**:
```
[Cloudflare Turnstile] Error: 60010
CSP violation: ...
Failed to load resource: ...
```

## Common Issues and Solutions

### Issue 1: "Error: 60010" in Console
**Cause**: CSP blocking Turnstile scripts
**Solution**:
- Check that CSP headers are being served
- Verify wildcard domains are allowed
- Try closing DevTools and refreshing

### Issue 2: Widget Shows Loading Spinner Forever
**Cause**: Script not loading or initialization failed
**Solution**:
- Check network tab for failed requests to `challenges.cloudflare.com`
- Verify environment variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
- Check that no browser extensions are blocking scripts

### Issue 3: Widget Loads but Shows Error Message
**Cause**: Auto-retry in progress or verification failed
**Solution**:
- Wait for retry (up to 3 attempts)
- Check if domain is whitelisted in Cloudflare Turnstile dashboard
- Verify site key matches dashboard configuration

### Issue 4: Works on Real Device but Not Simulation
**This is EXPECTED** - See explanation below

## Why Chrome Simulation May Still Show Errors

Even with all fixes applied, Chrome DevTools mobile simulation may show errors that don't occur on real devices because:

1. **Different User Agent Handling**: Desktop Chrome pretends to be mobile but uses desktop security policies
2. **DevTools Inspector**: The presence of DevTools can interfere with Turnstile's bot detection
3. **Stricter CSP Enforcement**: Desktop Chrome enforces CSP differently than mobile Chrome
4. **Network Throttling**: If enabled, can cause timeouts

## Verification Checklist

Use this checklist to verify everything is working:

- [ ] Dev server is running without errors
- [ ] Navigate to login page (`/iemocional` or `/neuroreset`)
- [ ] Turnstile widget appears (loading spinner then checkbox)
- [ ] Widget completes verification (checkmark appears)
- [ ] Can enter email address
- [ ] Can submit form successfully
- [ ] No critical CSP errors in console (warnings are OK)

### On Real Android Device:
- [ ] Navigate to login page on actual Android phone
- [ ] Turnstile loads without errors
- [ ] Verification completes successfully
- [ ] Form submission works

## Testing on Production (Deployed)

After deploying to Vercel:

```bash
# Deploy to production
vercel --prod
```

Then test on:
1. **Real Android Chrome** (Primary test)
2. **Real iPhone Safari**
3. **Desktop Chrome with mobile simulation** (Secondary)

## Debug Mode

To enable detailed Turnstile debugging, open browser console and run:

```javascript
localStorage.setItem('cf_turnstile_debug', 'true')
```

Then refresh the page. You'll see more detailed logs from Turnstile.

## Expected Behavior Summary

| Environment | Expected Result |
|------------|----------------|
| Real Android Chrome | ✅ Works perfectly |
| Real iPhone Safari | ✅ Works perfectly |
| Chrome DevTools Simulation | ⚠️ May show errors but should still function |
| Desktop Chrome (no simulation) | ✅ Works perfectly |
| Firefox Mobile | ✅ Should work |

## Getting Help

If issues persist after following this guide:

1. Check [TURNSTILE-MOBILE-FIX.md](./TURNSTILE-MOBILE-FIX.md) for detailed explanations
2. Review console logs for specific error codes
3. Verify Cloudflare Turnstile dashboard settings
4. Check that domain is whitelisted for your site key
5. Ensure environment variables are correctly set

## Quick Fix Commands

```bash
# Rebuild the app
npm run build

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start fresh dev server
npm run dev
```
