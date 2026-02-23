# Debugging R2 Issues in Production

## Quick Diagnostics

### Step 1: Check Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify all R2 variables are set:
   - ✅ `R2_ACCOUNT_ID`
   - ✅ `R2_ACCESS_KEY_ID`
   - ✅ `R2_SECRET_ACCESS_KEY`
   - ✅ `R2_BUCKET_NAME`

**Important:** After adding/updating env vars, you must **redeploy** for changes to take effect!

### Step 2: Use the Debug API

Access the debug endpoint on your production site:

```
https://your-domain.vercel.app/api/debug/r2
```

This will show:
- ✅ Which env vars are set
- ✅ How URLs are being parsed
- ✅ R2 configuration status

**Example output:**
```json
{
  "r2Config": {
    "accountId": "abc12345... (32 chars)",
    "accessKeyId": "xyz98765... (42 chars)",
    "secretAccessKey": "****************... (64 chars)",
    "bucketName": "lt-neuroreset",
    "isConfigured": true
  },
  "checks": {
    "hasAccountId": true,
    "hasAccessKey": true,
    "hasSecretKey": true,
    "hasBucketName": true,
    "allConfigured": true
  }
}
```

### Step 3: Check Browser Console

Open browser DevTools (F12) and look for errors when accessing a PDF:

**Common errors:**

**Error 503:**
```
Cloudflare R2 não configurado
```
→ Environment variables not set in Vercel

**Error 500:**
```
Erro ao acessar arquivo
```
→ Check detailed logs below

**Error 404:**
```
File not found
```
→ File doesn't exist in the bucket or wrong path

## Detailed Debugging

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click on latest deployment
4. Click **Functions** tab
5. Look for errors in `/api/r2-content`

**What to look for:**
```
R2 content error: [error details]
```

### Common Issues & Solutions

#### Issue 1: "Cloudflare R2 não configurado"

**Cause:** Environment variables not set

**Solution:**
1. Go to Vercel Settings → Environment Variables
2. Add all R2 variables
3. **Redeploy** the project (important!)

#### Issue 2: "AccessDenied"

**Cause:** API token doesn't have permissions or wrong credentials

**Solution:**
1. Verify credentials in Cloudflare dashboard
2. Recreate API token with **Admin Read & Write** permissions
3. Update Vercel env vars
4. Redeploy

#### Issue 3: "NoSuchBucket"

**Cause:** Bucket name doesn't exist or is misspelled

**Solution:**
1. Check bucket exists in Cloudflare R2
2. Verify `R2_BUCKET_NAME` matches exactly (case-sensitive)
3. For explicit buckets, check URL format: `r2://bucket-name/path/file.pdf`

#### Issue 4: "NoSuchKey" or "File not found"

**Cause:** File doesn't exist at specified path

**Solution:**
1. Go to Cloudflare R2 dashboard
2. Navigate to bucket (e.g., `kit-inteligencia-emocional`)
3. Verify file exists at exact path
4. Check for:
   - Correct folder: `pdfs/`, not `pdf/`
   - Exact filename with spaces: `99 NeuroInteligencia Emocional.pdf`
   - Case sensitivity: filenames are case-sensitive

#### Issue 5: URLs with explicit bucket fail, legacy URLs work

**Cause:** `parseR2Url` function issue (should be fixed now)

**Solution:**
1. Verify you deployed the latest code with the bugfix
2. Check the fix is in `lib/r2.ts` line 35-39
3. Run test: `npx tsx scripts/test-parseR2Url.ts`

See: [BUGFIX-PARSER2URL.md](BUGFIX-PARSER2URL.md)

#### Issue 6: PDFs with spaces fail, test endpoint works

**Cause:** API route not decoding URL-encoded filenames

**Solution:**
1. Verify the fix is in `app/api/r2-content/route.ts` line 57
2. Check Vercel logs for `[R2-CONTENT]` messages
3. Should show decoded filenames with spaces

See: [BUGFIX-URL-ENCODING.md](BUGFIX-URL-ENCODING.md)

## Manual Testing (Local)

Run the debug script locally:

```bash
# Make sure .env.local has R2 credentials
npx tsx scripts/debug-r2-connection.ts
```

Expected output:
```
✅ R2 connection is working!
```

## Testing Specific Files

To test if a specific file exists and is accessible:

### Method 1: Via Browser

Visit:
```
https://your-domain.vercel.app/api/r2-content?key=kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf
```

(Note: URL encode spaces as `%20`)

### Method 2: Via cURL

```bash
curl -v "https://your-domain.vercel.app/api/r2-content?key=kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf"
```

**Success response:**
```
< HTTP/2 200
< content-type: application/pdf
[PDF content...]
```

**Failure responses:**

**401:**
```json
{"error":"Não autenticado"}
```
→ Not logged in

**503:**
```json
{"error":"Cloudflare R2 não configurado"}
```
→ R2 env vars not set

**500:**
```json
{"error":"Erro ao acessar arquivo"}
```
→ Check Vercel logs for details

## Checklist for Production Deployment

Before deploying R2 changes:

- [ ] All R2 env vars set in Vercel
- [ ] Env vars applied to **Production** environment
- [ ] Latest code deployed (with parseR2Url fix)
- [ ] Both buckets exist in Cloudflare:
  - [ ] `lt-neuroreset`
  - [ ] `kit-inteligencia-emocional`
- [ ] Files uploaded to correct buckets
- [ ] Filenames match exactly (including spaces)
- [ ] API token has Read permissions
- [ ] Account ID is correct
- [ ] Tested debug endpoint: `/api/debug/r2`
- [ ] Tested sample PDF in production

## Emergency Rollback

If PDFs completely stop working:

### Option 1: Revert URLs to Legacy Format

```sql
-- Temporarily revert Kit IE PDFs to legacy format
UPDATE product_contents
SET content_url = REPLACE(
  content_url,
  'r2://kit-inteligencia-emocional/pdfs/',
  'r2://pdfs/'
)
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478');
```

### Option 2: Use Public R2 URLs

Change URLs to direct R2 public URLs (if you have them configured):
```
https://pub-xxxxx.r2.dev/pdfs/file.pdf
```

## Getting Help

If still stuck, gather this info:

1. **Debug endpoint output:** `/api/debug/r2`
2. **Vercel function logs** (screenshot)
3. **Browser console error** (screenshot)
4. **Specific URL failing**
5. **Environment:** Production, Preview, or Development

## Clean Up

**⚠️ IMPORTANT:** Delete the debug endpoint before going live:

```bash
rm app/api/debug/r2/route.ts
```

Or protect it with authentication:

```typescript
// Add auth check
const { valid } = await getSessionFromCookie()
if (!valid || user?.email !== 'admin@example.com') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```
