# Multi-Bucket R2 Setup Guide

This guide explains how to use multiple Cloudflare R2 buckets in your application.

## Overview

The system now supports **multiple R2 buckets** using explicit bucket names in URLs. This allows you to organize content across different buckets while using the same R2 account.

## URL Format

### New Format (Multi-Bucket)
```
r2://bucket-name/path/to/file.ext
```

Examples:
- `r2://lt-neuroreset/pdfs/module-1.pdf`
- `r2://kit-inteligencia-emocional/pdfs/workbook.pdf`
- `r2://kit-inteligencia-emocional/audios/meditation.mp3`

### Legacy Format (Single Bucket)
```
r2://path/to/file.ext
```

This format still works and uses the default bucket specified in `R2_BUCKET_NAME`.

Examples:
- `r2://pdfs/module-1.pdf` → uses default bucket
- `r2://audios/track-1.mp3` → uses default bucket

## How It Works

The system automatically detects the bucket name from the URL:

1. **Explicit bucket**: `r2://bucket-name/path/file.pdf`
   - Bucket: `bucket-name`
   - File path: `path/file.pdf`

2. **Default bucket**: `r2://path/file.pdf`
   - Bucket: Value from `R2_BUCKET_NAME` env variable
   - File path: `path/file.pdf`

## Environment Variables

You only need **one set of R2 credentials** to access all buckets in your account.

Add to your `.env.local`:

```bash
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=lt-neuroreset  # Default bucket for legacy URLs
```

### Getting Your Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. **Account ID**: Found at the top of the R2 page
4. **API Token**:
   - Click **Manage R2 API Tokens**
   - Create API Token with **Admin Read & Write** permissions
   - Copy the Access Key ID and Secret Access Key

## Creating Multiple Buckets

### In Cloudflare Dashboard

1. Go to **R2 Object Storage**
2. Click **Create bucket**
3. Enter bucket name (e.g., `kit-inteligencia-emocional`)
4. Choose region: **Automatic** (recommended)
5. Click **Create bucket**

Repeat for each bucket you need:
- `lt-neuroreset` (default/legacy bucket)
- `kit-inteligencia-emocional`
- Any other product-specific buckets

## Updating Database URLs

### Option 1: Update Existing Content

If you have existing content using the old format, you can update it:

```sql
-- Update PDFs from default bucket to specific bucket
UPDATE product_contents
SET content_url = REPLACE(
  content_url,
  'r2://pdfs/',
  'r2://kit-inteligencia-emocional/pdfs/'
)
WHERE product_id = '6557472';  -- Kit Inteligencia Emocional

-- Update audios
UPDATE product_contents
SET content_url = REPLACE(
  content_url,
  'r2://audios/',
  'r2://kit-inteligencia-emocional/audios/'
)
WHERE product_id = '6557472';
```

### Option 2: Insert New Content with Explicit Bucket

```sql
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index,
  is_active
) VALUES (
  '6557472',
  'pdf',
  'Workbook - Inteligencia Emocional',
  'Material complementar do curso',
  'r2://kit-inteligencia-emocional/pdfs/workbook-ie.pdf',
  1,
  true
);
```

## Uploading Files to Buckets

### Via Cloudflare Dashboard

1. Go to **R2 Object Storage**
2. Select your bucket (e.g., `kit-inteligencia-emocional`)
3. Click **Upload**
4. Upload your files maintaining the folder structure:
   ```
   kit-inteligencia-emocional/
   ├── pdfs/
   │   ├── workbook-ie.pdf
   │   └── guide.pdf
   └── audios/
       └── meditation.mp3
   ```

### Via CLI (Wrangler)

```bash
# Upload to specific bucket
wrangler r2 object put kit-inteligencia-emocional/pdfs/workbook.pdf --file=./workbook.pdf

# Upload to default bucket
wrangler r2 object put lt-neuroreset/pdfs/module-1.pdf --file=./module-1.pdf
```

## Bucket Organization Strategy

### Recommended Structure

**By Product:**
- `lt-neuroreset` - NeuroReset & legacy content (default)
- `kit-inteligencia-emocional` - Kit Inteligencia Emocional specific
- `neuroreset` - NeuroReset specific
- `other-product` - Other products

**File Organization within Each Bucket:**
```
bucket-name/
├── pdfs/
│   └── filename.pdf
├── audios/
│   └── filename.mp3
├── videos/
│   └── filename.mp4
└── images/
    └── filename.jpg
```

## Testing Your Setup

### 1. Verify Environment Variables

```bash
node -e "console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID ? 'SET ✓' : 'NOT SET ✗'); console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID ? 'SET ✓' : 'NOT SET ✗'); console.log('R2_SECRET_ACCESS_KEY:', process.env.R2_SECRET_ACCESS_KEY ? 'SET ✓' : 'NOT SET ✗');"
```

### 2. Test R2 Connection

```bash
npx tsx scripts/test-r2.ts
```

### 3. Test Multi-Bucket Access

Create a test file `test-multi-bucket.ts`:

```typescript
import { getFileFromR2, parseR2Url } from './lib/r2'

async function test() {
  // Test URL parsing
  console.log('Testing URL parsing:')
  console.log(parseR2Url('r2://kit-inteligencia-emocional/pdfs/test.pdf'))
  console.log(parseR2Url('r2://pdfs/test.pdf'))

  // Test file access
  try {
    const file = await getFileFromR2('r2://kit-inteligencia-emocional/pdfs/test.pdf')
    console.log('File loaded successfully:', file.length, 'bytes')
  } catch (error) {
    console.error('Error:', error)
  }
}

test()
```

Run: `npx tsx test-multi-bucket.ts`

## Troubleshooting

### Error: "Cloudflare R2 não configurado"

**Solution:** Make sure all R2 environment variables are set in `.env.local` and restart your dev server.

### Error: "Access Denied" or "Bucket not found"

**Possible causes:**
1. Bucket name in URL doesn't match actual bucket name in Cloudflare
2. API token doesn't have access to the bucket
3. Bucket doesn't exist

**Solution:**
- Verify bucket exists in Cloudflare dashboard
- Check bucket name spelling in URLs
- Ensure API token has **Admin Read & Write** or **Read** permissions

### PDFs not loading

**Debug steps:**
1. Check browser console for error messages
2. Verify file exists in the correct bucket and path
3. Test URL format: `r2://bucket-name/path/file.pdf`
4. Check that files are in the correct folder (e.g., `pdfs/` not `pdf/`)

### URL format confusion

**Remember:**
- ✅ `r2://kit-inteligencia-emocional/pdfs/file.pdf` (with bucket)
- ✅ `r2://pdfs/file.pdf` (default bucket)
- ❌ `r2://kit-inteligencia-emocional-pdfs/file.pdf` (wrong - no folder)
- ❌ `kit-inteligencia-emocional/pdfs/file.pdf` (missing r2:// prefix)

## Migration Checklist

If you're migrating from single bucket to multi-bucket:

- [ ] Create new buckets in Cloudflare dashboard
- [ ] Set R2 environment variables in `.env.local`
- [ ] Upload files to appropriate buckets
- [ ] Update database URLs to include bucket names
- [ ] Test file access in application
- [ ] Update documentation for content managers
- [ ] Restart development server: `npm run dev`

## Cost Considerations

**Good news:** Multiple buckets under the same account share the same pricing:

- Storage: $0.015 per GB/month (across all buckets)
- Class A Operations: $4.50 per million requests
- Class B Operations: $0.36 per million requests
- Egress: **$0.00** (free!)

Having multiple buckets does **not** increase costs.

## Best Practices

1. **Naming Convention**: Use lowercase, hyphens for bucket names
   - ✅ `kit-inteligencia-emocional`
   - ❌ `Kit_Inteligencia_Emocional`

2. **Folder Structure**: Keep consistent folder structure across buckets
   - All buckets should have `pdfs/`, `audios/`, `videos/` folders

3. **URL Format**: Always use explicit bucket names for new content
   - Easier to manage and migrate

4. **Default Bucket**: Use for shared content accessed by multiple products

5. **Backup**: Regularly backup bucket contents using Wrangler CLI

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Questions?** Check the main [CLOUDFLARE-R2-SETUP.md](./CLOUDFLARE-R2-SETUP.md) guide or open an issue.
