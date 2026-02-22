# 🚀 Quick Migration - 5 Minutes

Fast guide to migrate Kit Inteligencia Emocional to multi-bucket R2.

## Before You Start (2 minutes)

1. **Add R2 credentials to `.env.local`:**
   ```bash
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=lt-neuroreset
   ```

2. **Verify buckets exist in Cloudflare:**
   - ✓ `lt-entregaveis`
   - ✓ `kit-inteligencia-emocional`

3. **Upload PDFs to `kit-inteligencia-emocional/pdfs/` folder**

## Migration (3 minutes)

### 1. Backup Database (30 seconds)

```sql
CREATE TABLE product_contents_backup AS SELECT * FROM product_contents;
```

### 2. Preview Changes (30 seconds)

Open `scripts/migrate-kit-ie-to-multi-bucket.sql` and run **STEP 1** query.

Check output - should show ~18 PDFs marked "✅ WILL UPDATE"

### 3. Run Migration (1 minute)

In the same file, **uncomment STEP 2** section and run it.

```sql
BEGIN;

UPDATE product_contents
SET content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/')
WHERE product_id = '6557472' AND content_type = 'pdf' AND content_url LIKE 'r2://pdfs/%';

-- ... (all 6 product updates)

COMMIT;
```

### 4. Verify (30 seconds)

Run **STEP 3** query - should show all PDFs as "✅ MIGRATED"

### 5. Test (1 minute)

```bash
npm run dev
```

Login and try opening a PDF from Kit Inteligencia Emocional.

## Done! ✅

PDFs should now load from the `kit-inteligencia-emocional` bucket.

## Need Help?

See full guide: [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)

## Rollback (if needed)

If something went wrong:

```sql
DROP TABLE product_contents;
CREATE TABLE product_contents AS SELECT * FROM product_contents_backup;
```

Or use: `scripts/rollback-kit-ie-multi-bucket.sql`
