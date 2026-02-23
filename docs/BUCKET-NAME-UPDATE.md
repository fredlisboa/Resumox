# Bucket Name Update Summary

## Changes Made

The default R2 bucket name has been updated from `lt-entregaveis` to `lt-neuroreset` to match your Vercel environment configuration.

### Updated Files

#### Code Files
- ✅ [lib/r2.ts](lib/r2.ts) - Default bucket constant updated
- ✅ [.env.local](.env.local) - Environment variable updated
- ✅ [.env.local.example](.env.local.example) - Example file updated

#### Documentation Files
- ✅ [QUICK-R2-SETUP.md](QUICK-R2-SETUP.md)
- ✅ [MULTI-BUCKET-R2-SETUP.md](MULTI-BUCKET-R2-SETUP.md)
- ✅ [CLOUDFLARE-R2-SETUP.md](CLOUDFLARE-R2-SETUP.md)
- ✅ [scripts/MIGRATION-GUIDE.md](scripts/MIGRATION-GUIDE.md)
- ✅ [scripts/MIGRATION-QUICK-START.md](scripts/MIGRATION-QUICK-START.md)

## Bucket Structure

Your application now uses **two R2 buckets**:

### 1. `lt-neuroreset` (Default/Legacy)
- **Purpose:** NeuroReset content and legacy files
- **Used for:** Files with legacy URL format `r2://pdfs/file.pdf`
- **Environment variable:** `R2_BUCKET_NAME=lt-neuroreset`

### 2. `kit-inteligencia-emocional` (Explicit)
- **Purpose:** Kit Inteligencia Emocional content
- **Used for:** Files with explicit bucket URL `r2://kit-inteligencia-emocional/pdfs/file.pdf`
- **No env var needed** - bucket name is in the URL itself

## URL Format Examples

### Legacy Format (uses default bucket = lt-neuroreset)
```
r2://pdfs/neuroreset-module.pdf
r2://audios/track.mp3
```
These resolve to → `lt-neuroreset` bucket

### Explicit Format (specifies bucket in URL)
```
r2://lt-neuroreset/pdfs/neuroreset-module.pdf
r2://kit-inteligencia-emocional/pdfs/workbook.pdf
```
These use the bucket name from the URL

## What This Means for You

### ✅ No Breaking Changes
- Existing content with `r2://pdfs/file.pdf` format still works
- They now point to `lt-neuroreset` bucket (previously would have used `lt-entregaveis`)
- Multi-bucket support is fully functional

### 📝 Configuration Needed
Update your local `.env.local` with the R2 credentials:

```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=lt-neuroreset
```

### 🚀 Next Steps

1. **Add R2 credentials to `.env.local`** (same values as Vercel)
2. **Verify buckets exist in Cloudflare:**
   - `lt-neuroreset` ✓
   - `kit-inteligencia-emocional` ✓
3. **Run migration** for Kit IE content (see [scripts/MIGRATION-QUICK-START.md](scripts/MIGRATION-QUICK-START.md))
4. **Test locally** with `npm run dev`

## Backwards Compatibility

### ✅ Fully Compatible
All existing code and URLs continue to work:
- Legacy URLs (`r2://pdfs/file.pdf`) → use `lt-neuroreset`
- Explicit URLs work as expected
- No database changes required (unless migrating Kit IE)

## Questions?

- Multi-bucket setup: [MULTI-BUCKET-R2-SETUP.md](MULTI-BUCKET-R2-SETUP.md)
- Quick setup: [QUICK-R2-SETUP.md](QUICK-R2-SETUP.md)
- Migration guide: [scripts/MIGRATION-GUIDE.md](scripts/MIGRATION-GUIDE.md)
