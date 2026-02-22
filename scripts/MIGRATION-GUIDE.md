# Kit Inteligencia Emocional - Multi-Bucket Migration Guide

This guide walks you through migrating the Kit Inteligencia Emocional PDFs from the default R2 bucket to the dedicated `kit-inteligencia-emocional` bucket.

## Overview

**What this migration does:**
- Updates all PDF URLs for Kit Inteligencia Emocional products
- Changes from: `r2://pdfs/filename.pdf`
- Changes to: `r2://kit-inteligencia-emocional/pdfs/filename.pdf`

**Products affected:**
- `6557472` - Kit Inteligencia Emocional (main product)
- `6557903` - Preguntas Poderosas para el Desarrollo Socioemocional (Order Bump)
- `6558403` - Ferramentas de Regulação Emocional (Order Bump)
- `6558441` - NeuroAfetividad Infantil (Order Bump)
- `6558460` - Metáforas Emocionales (Order Bump)
- `6558478` - Coloreando Emociones (Order Bump)

**Total PDFs to migrate:** ~18 files

## Prerequisites

Before running the migration:

### 1. ✅ R2 Configuration Complete

Make sure you've completed the R2 setup from [QUICK-R2-SETUP.md](../QUICK-R2-SETUP.md):

```bash
# Verify R2 credentials are set
node -e "console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID ? 'SET ✓' : 'NOT SET ✗')"
```

### 2. ✅ Both Buckets Exist

Verify both buckets exist in your Cloudflare R2 dashboard:
- `lt-entregaveis` ✓
- `kit-inteligencia-emocional` ✓

### 3. ✅ Files Uploaded to Correct Bucket

Make sure all PDF files are uploaded to the `kit-inteligencia-emocional` bucket:

```
kit-inteligencia-emocional/
└── pdfs/
    ├── 99 NeuroInteligencia Emocional.pdf
    ├── R1 Rueda de las Emociones_v2.pdf
    ├── R2 Universo de las Emociones y Sensaciones_v2.pdf
    ├── R3 Baraja Divertidamente_v2.pdf
    ├── R4 Juego de las Caras Reconociendo y Expresando Sentimientos a traves del Juego_v2.pdf
    ├── R5 Semaforo Emocional_v2.pdf
    ├── R6 Teatro das Expressoes_v2.pdf
    ├── R7 Trilha das Emocoes_v2.pdf
    ├── R8 Adivinha a Emocao_v2.pdf
    ├── R9 Caixinha da Calma_v2.pdf
    ├── B1 Afirmaciones Positivas.pdf
    ├── B2 Emocionario Diccionario de las Emociones.pdf
    ├── B3 Descubre tu Perfil de Educador Emocional.pdf
    ├── B4 Mis Zonas de Regulacion.pdf
    ├── OB1 Preguntas Poderosas para el Desarrollo Socioemocional.pdf
    ├── OB2 Ferramentas de Regulacao Emocional.pdf
    ├── OB3 NeuroAfetividad Infantil.pdf
    ├── OB4 Metaforas Emocionales.pdf
    └── OB5 Coloreando Emociones.pdf
```

**⚠️ CRITICAL:** File names in the bucket must match **exactly** with the filenames in your database URLs!

### 4. ✅ Backup Database

**MANDATORY STEP:** Create a backup before migration!

```sql
-- Create backup table
CREATE TABLE product_contents_backup_20251230 AS
SELECT * FROM product_contents;

-- Verify backup
SELECT COUNT(*) FROM product_contents_backup_20251230;
```

## Migration Steps

### Step 1: Preview Changes

First, preview what will be changed without modifying anything:

```bash
# Open Supabase SQL Editor or your database tool
# Run the STEP 1 query from migrate-kit-ie-to-multi-bucket.sql
```

This will show you:
- Current URLs
- New URLs after migration
- Which records will be updated

**Expected output:**
- ~18 PDFs marked as "✅ WILL UPDATE"
- Other content types marked as "⏭️ SKIP"

### Step 2: Execute Migration

Once you've verified the preview looks correct:

1. Open `scripts/migrate-kit-ie-to-multi-bucket.sql`
2. Find the `STEP 2` section
3. **Uncomment** the migration code (remove `/*` and `*/`)
4. Run the entire STEP 2 block

```sql
BEGIN;

UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/'),
  updated_at = NOW()
WHERE
  product_id = '6557472'
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';

-- ... (rest of the updates)

COMMIT;
```

### Step 3: Verify Migration

After running the migration, verify the results:

```bash
# Run the STEP 3 verification queries
```

**Expected results:**
- All Kit IE PDFs show "✅ MIGRATED"
- Summary shows all PDFs in the `migrated` column
- `old_format` column should be 0

### Step 4: Test in Application

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Login with a Kit IE user account**

3. **Try accessing PDFs:**
   - Click on a PDF from the content list
   - Verify it loads correctly
   - Check browser console for any errors

4. **Test different PDFs:**
   - Main content PDF (e.g., "99 NeuroInteligencia Emocional")
   - Resource PDF (e.g., "R1 Rueda de las Emociones")
   - Bonus PDF (e.g., "B1 Afirmaciones Positivas")
   - Order Bump PDF (e.g., "OB1 Preguntas Poderosas")

### Step 5: Monitor for Issues

Check for any errors in:
- Browser console (F12)
- Server logs
- User reports

## Troubleshooting

### Issue: PDFs still showing "Error 500"

**Possible causes:**
1. R2 credentials not configured
2. Files not in the correct bucket
3. Filename mismatch

**Debug steps:**

```bash
# 1. Check R2 config
node -e "console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID ? 'SET ✓' : 'NOT SET ✗')"

# 2. Check a specific PDF URL in database
SELECT id, title, content_url FROM product_contents WHERE id = '62a98a35-abe0-4678-9ffe-9295de362657';

# 3. Verify file exists in R2 (check Cloudflare dashboard)
# Navigate to: kit-inteligencia-emocional/pdfs/
# Confirm: "99 NeuroInteligencia Emocional.pdf" exists
```

### Issue: Migration didn't update all PDFs

**Solution:**

```sql
-- Check which PDFs were not migrated
SELECT id, product_id, title, content_url
FROM product_contents
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';
```

Run the migration again for specific products that failed.

### Issue: Need to rollback

If something goes wrong, you can rollback:

1. Open `scripts/rollback-kit-ie-multi-bucket.sql`
2. Preview the rollback (STEP 1)
3. Uncomment and run STEP 2
4. Verify with STEP 3

**Or restore from backup:**

```sql
-- Delete current data
DELETE FROM product_contents
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478');

-- Restore from backup
INSERT INTO product_contents
SELECT * FROM product_contents_backup_20251230
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478');
```

## Post-Migration

### Update Documentation

Update any internal documentation that references the old URL format.

### Cleanup (Optional)

After confirming everything works for 7+ days:

```sql
-- Drop the backup table
DROP TABLE IF EXISTS product_contents_backup_20251230;
```

### Future Content

For new PDFs added to Kit Inteligencia Emocional, use the new format:

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
  'New Resource',
  'r2://kit-inteligencia-emocional/pdfs/new-resource.pdf',  -- ✅ Correct format
  true
);
```

## Checklist

Before migration:
- [ ] R2 credentials configured in `.env.local`
- [ ] Both buckets exist in Cloudflare
- [ ] All PDFs uploaded to `kit-inteligencia-emocional` bucket
- [ ] Filenames match exactly
- [ ] Database backup created

During migration:
- [ ] Preview changes (STEP 1)
- [ ] Execute migration (STEP 2)
- [ ] Verify results (STEP 3)

After migration:
- [ ] Restart dev server
- [ ] Test PDF loading in app
- [ ] Monitor for errors
- [ ] Update documentation

## Support

If you encounter issues:

1. Check [QUICK-R2-SETUP.md](../QUICK-R2-SETUP.md) for R2 configuration
2. Check [MULTI-BUCKET-R2-SETUP.md](../MULTI-BUCKET-R2-SETUP.md) for multi-bucket details
3. Review server logs and browser console
4. Verify files in Cloudflare R2 dashboard

## Files Reference

- **Migration script:** `scripts/migrate-kit-ie-to-multi-bucket.sql`
- **Rollback script:** `scripts/rollback-kit-ie-multi-bucket.sql`
- **This guide:** `scripts/MIGRATION-GUIDE.md`
- **R2 library:** `lib/r2.ts`
- **API route:** `app/api/r2-content/route.ts`
