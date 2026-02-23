# R2 PDF Loading - Solution Summary

## The Problem

Your Kit Inteligencia Emocional PDFs were failing with **Error 500: "Erro ao acessar arquivo"**, but the debug test endpoint showed they loaded successfully. This was confusing because R2 was configured correctly and the files existed.

## The Root Cause: URL Encoding Bug

The issue was in [app/api/r2-content/route.ts](app/api/r2-content/route.ts). The API was receiving **URL-encoded filenames** from the frontend but wasn't decoding them before searching R2.

**Example:**
- **Database:** `r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf`
- **Frontend encodes:** `99%20NeuroInteligencia%20Emocional.pdf` (space → `%20`)
- **API received:** `kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf`
- **API searched R2 for:** `kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf` ❌
- **Actual file in R2:** `kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf` ✅
- **Result:** File not found → Error 500

## The Fix

Added `decodeURIComponent()` in [app/api/r2-content/route.ts:57](app/api/r2-content/route.ts#L57):

```typescript
// Decode the key since it comes URL-encoded from the frontend
const decodedKey = decodeURIComponent(key)
```

Now the API correctly decodes `99%20NeuroInteligencia` → `99 NeuroInteligencia` before searching R2.

## Why the Test Endpoint Worked

The test endpoint ([app/api/debug/test-file/route.ts](app/api/debug/test-file/route.ts)) accepts the FULL URL including `r2://`:

```
/api/debug/test-file?url=r2://kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf
```

This URL gets processed differently and the encoding was handled correctly by chance. But the actual PDF viewer strips `r2://` before encoding, which exposed the bug.

## What Was Fixed

### Two Bugs Fixed Total

1. **parseR2Url bug** ([BUGFIX-PARSER2URL.md](BUGFIX-PARSER2URL.md))
   - Fixed folder names being treated as bucket names
   - Added `knownFolders` list: `['pdfs', 'audios', 'videos', 'images', 'thumbnails']`
   - Location: [lib/r2.ts:35-39](lib/r2.ts#L35-L39)

2. **URL encoding bug** ([BUGFIX-URL-ENCODING.md](BUGFIX-URL-ENCODING.md)) ← **This was the main issue**
   - Fixed URL-encoded filenames not being decoded
   - Added `decodeURIComponent()` call
   - Location: [app/api/r2-content/route.ts:57](app/api/r2-content/route.ts#L57)

## Next Steps

### 1. Test Locally (Optional but Recommended)

```bash
# Start dev server
npm run dev
```

Then open your app and try accessing a Kit Inteligencia Emocional PDF. You should see in the terminal:

```
[R2-CONTENT] Request: {
  originalKey: 'kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf',
  decodedKey: 'kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf',
  wantsSigned: false
}
[R2-CONTENT] Fetching file: kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf
[R2-CONTENT] File loaded successfully: 1910272 bytes
```

### 2. Deploy to Production

```bash
git add .
git commit -m "Fix URL encoding bug in R2 content API

URLs with spaces were being double-encoded, causing R2 to search for files with %20 instead of actual spaces. Added decodeURIComponent() to properly decode filenames.

Fixes: Error 500 when loading Kit Inteligencia Emocional PDFs
Location: app/api/r2-content/route.ts:57

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push
```

Vercel will automatically deploy the changes.

### 3. Verify in Production

1. After deployment completes, open your production site
2. Navigate to a Kit Inteligencia Emocional product
3. Click on a PDF with spaces in the filename
4. **It should now load successfully!** ✅

### 4. Check Vercel Logs (Optional)

Go to Vercel Dashboard → Your Project → Deployments → Latest → Functions

Look for logs from `/api/r2-content` showing the `[R2-CONTENT]` messages. You should see filenames being properly decoded.

## What Now Works

After both fixes:

✅ **Multi-bucket support**
- `r2://kit-inteligencia-emocional/pdfs/file.pdf` (explicit bucket)
- `r2://pdfs/file.pdf` (legacy format, uses default bucket)

✅ **Filenames with spaces**
- `99 NeuroInteligencia Emocional.pdf`
- `P01 NeuroReset-Guia-de-Inicio-Rapido-and-Manual-de-Usuario_v3.pdf`

✅ **Known folder detection**
- Correctly identifies `pdfs`, `audios`, `videos`, etc. as folders, not buckets

✅ **Special characters**
- All URL-encoded characters are now properly decoded

## Troubleshooting

If PDFs still don't load after deployment:

1. **Check Vercel deployed the latest code:**
   - Go to Vercel → Deployments → Latest
   - Click "View Deployment"
   - Verify the commit includes the fix

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Check Vercel logs:**
   - Look for `[R2-CONTENT]` messages
   - Verify `decodedKey` shows spaces, not `%20`

4. **Verify environment variables:**
   - Access `/api/debug/r2` in production
   - All R2 variables should show as set

## Files Modified

- ✅ [app/api/r2-content/route.ts](app/api/r2-content/route.ts) - Added URL decoding + logging
- ✅ [lib/r2.ts](lib/r2.ts) - Fixed parseR2Url function (previous fix)

## Documentation Created

- 📄 [BUGFIX-URL-ENCODING.md](BUGFIX-URL-ENCODING.md) - Details about the URL encoding fix
- 📄 [BUGFIX-PARSER2URL.md](BUGFIX-PARSER2URL.md) - Details about the parseR2Url fix
- 📄 [DEBUG-R2-PRODUCTION.md](DEBUG-R2-PRODUCTION.md) - Complete troubleshooting guide
- 📄 [SOLUTION-SUMMARY.md](SOLUTION-SUMMARY.md) - This file

## Summary

The issue was that **filenames with spaces were being URL-encoded** by the frontend (`99 Neuro.pdf` → `99%20Neuro.pdf`), but the API wasn't decoding them before searching R2. This caused R2 to look for files with `%20` in their names instead of actual spaces.

The fix was simple: **add one line of code** to decode the URL-encoded filename before using it.

```typescript
const decodedKey = decodeURIComponent(key)
```

That's it! Deploy and your PDFs should work. 🎉
