# Quick R2 Setup for Two Buckets

## What You Need

You have content in **two R2 buckets**:
1. `lt-neuroreset` (legacy/NeuroReset bucket - default)
2. `kit-inteligencia-emocional` (Kit Inteligencia Emocional)

## Step 1: Get Cloudflare Credentials

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. Copy your **Account ID** (shown at top of page)
4. Click **Manage R2 API Tokens** → **Create API Token**
5. Set permissions: **Admin Read & Write**
6. Copy the **Access Key ID** and **Secret Access Key**

## Step 2: Update .env.local

Add these lines to your `.env.local` file:

```bash
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_here
R2_SECRET_ACCESS_KEY=your_secret_key_here
R2_BUCKET_NAME=lt-neuroreset
```

Replace `your_account_id_here`, `your_access_key_here`, and `your_secret_key_here` with the actual values from Step 1.

## Step 3: Verify Buckets Exist

Make sure both buckets exist in Cloudflare:
- ✅ `lt-neuroreset`
- ✅ `kit-inteligencia-emocional`

If not, create them:
1. R2 dashboard → **Create bucket**
2. Name: `kit-inteligencia-emocional`
3. Region: **Automatic**
4. Create

## Step 4: Upload Your PDFs

Upload files to the correct bucket with proper folder structure:

**For Kit Inteligencia Emocional:**
```
kit-inteligencia-emocional/
└── pdfs/
    ├── workbook.pdf
    ├── guide.pdf
    └── exercises.pdf
```

**For other content:**
```
lt-entregaveis/
└── pdfs/
    └── other-content.pdf
```

## Step 5: Update Database URLs

For Kit Inteligencia Emocional content, use this URL format:

```
r2://kit-inteligencia-emocional/pdfs/filename.pdf
```

Example SQL to update existing content:

```sql
-- Update Kit Inteligencia Emocional PDFs to use specific bucket
UPDATE product_contents
SET content_url = REPLACE(
  content_url,
  'r2://pdfs/',
  'r2://kit-inteligencia-emocional/pdfs/'
)
WHERE product_id = '6557472';
```

Or for new content:

```sql
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  content_url,
  is_active
) VALUES (
  '6557472',
  'pdf',
  'Workbook',
  'r2://kit-inteligencia-emocional/pdfs/workbook.pdf',
  true
);
```

## Step 6: Restart Server

```bash
npm run dev
```

## URL Format Examples

✅ **Correct formats:**
- `r2://kit-inteligencia-emocional/pdfs/workbook.pdf`
- `r2://lt-neuroreset/pdfs/module.pdf`
- `r2://pdfs/file.pdf` (uses default bucket)

❌ **Incorrect formats:**
- `r2://kit-inteligencia-emocional-pdfs/workbook.pdf` (no folder)
- `kit-inteligencia-emocional/pdfs/workbook.pdf` (missing r2://)
- `r2://Kit Inteligencia Emocional/pdfs/workbook.pdf` (spaces)

## Testing

1. **Check environment variables:**
```bash
node -e "console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID ? 'SET ✓' : 'NOT SET ✗')"
```

2. **Try accessing a PDF** in your dashboard

3. **Check browser console** for any errors

## Common Issues

### "Error 500: Erro ao acessar arquivo"

**Cause:** R2 credentials not set

**Fix:** Complete Step 2 above and restart server

### "Access Denied"

**Cause:** API token doesn't have permission or bucket doesn't exist

**Fix:**
- Verify buckets exist in Cloudflare dashboard
- Recreate API token with Admin Read & Write permissions

### PDF not loading

**Debug:**
1. Check file exists in correct bucket and path
2. Verify URL format in database
3. Check browser console for specific error
4. Ensure bucket name matches exactly (case-sensitive)

## Need More Help?

See detailed guides:
- [MULTI-BUCKET-R2-SETUP.md](./MULTI-BUCKET-R2-SETUP.md) - Complete multi-bucket guide
- [CLOUDFLARE-R2-SETUP.md](./CLOUDFLARE-R2-SETUP.md) - Original R2 setup guide
