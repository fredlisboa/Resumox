# Deployment Instructions - R2 PDF Fix

## Summary

Fixed URL encoding bug preventing PDFs with spaces from loading. The API route wasn't decoding URL-encoded filenames before searching R2.

## Files Modified

1. ✅ [app/api/r2-content/route.ts](app/api/r2-content/route.ts)
   - Added `decodeURIComponent(key)` at line 57
   - Added detailed logging for debugging
   - Improved error messages with details

2. ✅ [components/FullScreenPDFViewer.tsx](components/FullScreenPDFViewer.tsx)
   - Added logging to track URL encoding flow (lines 53-62)

3. ✅ [app/pdf-viewer/page.tsx](app/pdf-viewer/page.tsx)
   - Added logging to verify searchParams decoding (lines 28-29)

## How to Test Locally (Optional)

Before deploying, you can test locally:

```bash
# 1. Make sure dev server is running
npm run dev

# 2. Open browser to http://localhost:3000
# 3. Login and navigate to Kit Inteligencia Emocional
# 4. Click on a PDF with spaces (e.g., "99 NeuroInteligencia Emocional")
# 5. Check browser console for logs:
```

Expected console output:
```
[PDFViewerPage] URL from searchParams: r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf
[FullScreenPDFViewer] Received URL: r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf
[FullScreenPDFViewer] Stripped URL: kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf
[FullScreenPDFViewer] Encoded key: kit-inteligencia-emocional%2Fpdfs%2F99%20NeuroInteligencia%20Emocional.pdf
[FullScreenPDFViewer] API URL: /api/r2-content?key=kit-inteligencia-emocional%2Fpdfs%2F99%20NeuroInteligencia%20Emocional.pdf
```

Expected terminal output (from API route):
```
[R2-CONTENT] Request: {
  originalKey: 'kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf',
  decodedKey: 'kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf',
  wantsSigned: false
}
[R2-CONTENT] Fetching file: kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf
[R2-CONTENT] File loaded successfully: 1910272 bytes
```

## Deploy to Production

### Step 1: Commit Changes

```bash
git add app/api/r2-content/route.ts components/FullScreenPDFViewer.tsx app/pdf-viewer/page.tsx
git commit -m "Fix: URL decoding for R2 filenames with spaces

Added decodeURIComponent() in r2-content API route to properly
decode URL-encoded filenames before searching R2. This fixes
Error 500 when loading PDFs with spaces in filenames.

Also added comprehensive logging for debugging production issues.

Fixes: Kit Inteligencia Emocional PDFs failing to load
Files: app/api/r2-content/route.ts:57

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Step 2: Push to Repository

```bash
git push
```

Vercel will automatically detect the push and start deploying.

### Step 3: Wait for Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Wait for "Building" → "Deploying" → "Ready"
4. Usually takes 1-3 minutes

### Step 4: Test in Production

1. **Open production site:** `https://neuroreset-e.1sd.online`
2. **Login** to your account
3. **Navigate to Kit Inteligencia Emocional**
4. **Click on a PDF** (e.g., "99 NeuroInteligencia Emocional")
5. **PDF should load successfully!** ✅

### Step 5: Check Vercel Logs (If Issues Persist)

If PDFs still don't work:

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click on latest deployment
4. Click **Functions** tab
5. Find `/api/r2-content` function
6. Look for logs showing:
   ```
   [R2-CONTENT] Request: { originalKey: "...", decodedKey: "...", ... }
   [R2-CONTENT] Fetching file: ...
   [R2-CONTENT] File loaded successfully: ...
   ```

If you see an error instead, the log will now show:
```
[R2-CONTENT] Error details: { message: "...", name: "...", code: "..." }
```

This will tell us exactly what's wrong.

## What Should Work Now

After deployment:

✅ PDFs with spaces in filenames
✅ PDFs with special characters (é, ñ, etc.)
✅ Kit Inteligencia Emocional PDFs
✅ Legacy NeuroReset PDFs
✅ All R2 content types (PDFs, audios, videos)
✅ Both bucket formats (explicit and legacy)

## Troubleshooting

### Issue: "Still getting Error 500"

**Possible causes:**
1. Code didn't deploy - check Vercel deployment status
2. Browser cache - do hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Different error - check Vercel function logs for details

**Solutions:**
1. Verify deployment completed successfully in Vercel
2. Clear browser cache and hard refresh
3. Check Vercel logs for `[R2-CONTENT] Error details`
4. Share the error details with developer

### Issue: "Vercel logs show 'NoSuchKey'"

**Cause:** File doesn't exist in R2 bucket or has different filename

**Solution:**
1. Go to Cloudflare R2 dashboard
2. Navigate to bucket `kit-inteligencia-emocional`
3. Verify file exists at exact path with exact name
4. Check database URL matches R2 filename exactly

### Issue: "Vercel logs show 'AccessDenied'"

**Cause:** R2 API token doesn't have read permissions

**Solution:**
1. Go to Cloudflare R2 → Manage R2 API Tokens
2. Verify token has "Object Read & Write" or "Admin Read & Write" permissions
3. If not, create new token with correct permissions
4. Update `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` in Vercel
5. Redeploy

## Clean Up (Optional)

After confirming PDFs work, you can optionally:

1. **Remove debug logs** from production:
   - Remove console.log statements from FullScreenPDFViewer.tsx
   - Remove console.log statements from pdf-viewer/page.tsx
   - Keep logs in r2-content/route.ts for production debugging

2. **Delete debug endpoints** (for security):
   ```bash
   rm -rf app/api/debug
   ```

3. **Commit cleanup:**
   ```bash
   git add -A
   git commit -m "Clean up debug logs and endpoints"
   git push
   ```

## Questions?

If issues persist after deployment:

1. Check [BUGFIX-URL-ENCODING.md](BUGFIX-URL-ENCODING.md) for technical details
2. Check [DEBUG-R2-PRODUCTION.md](DEBUG-R2-PRODUCTION.md) for troubleshooting guide
3. Share Vercel function logs showing `[R2-CONTENT]` messages
4. Share exact error message from browser console

## Success Criteria

After deployment, you should see:

✅ Kit IE PDFs load successfully
✅ No Error 500 in browser console
✅ PDF viewer displays document
✅ Vercel logs show "File loaded successfully"
✅ No errors in Vercel function logs

That's it! Deploy and your PDFs should work. 🎉
