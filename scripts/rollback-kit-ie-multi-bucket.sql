-- Rollback Script: Revert Kit Inteligencia Emocional to legacy R2 format
-- This script reverts all PDF URLs for Kit Inteligencia Emocional products
-- from r2://kit-inteligencia-emocional/pdfs/filename.pdf back to r2://pdfs/filename.pdf
--
-- Date: 2025-12-30
-- Purpose: Rollback multi-bucket migration if needed
--
-- IMPORTANT: Only run this if you need to revert the migration!

-- ============================================
-- STEP 1: Preview rollback (run this first!)
-- ============================================

SELECT
  id,
  product_id,
  title,
  content_url AS current_url,
  CASE
    WHEN content_url LIKE 'r2://kit-inteligencia-emocional/pdfs/%'
    THEN REPLACE(content_url, 'r2://kit-inteligencia-emocional/pdfs/', 'r2://pdfs/')
    ELSE content_url
  END AS reverted_url,
  CASE
    WHEN content_url LIKE 'r2://kit-inteligencia-emocional/pdfs/%'
    THEN '✅ WILL REVERT'
    ELSE '⏭️ SKIP'
  END AS action
FROM product_contents
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
ORDER BY product_id, order_index;

-- ============================================
-- STEP 2: Execute rollback (uncomment to run)
-- ============================================

/*
BEGIN;

-- Revert all Kit Inteligencia Emocional PDFs back to legacy format
UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://kit-inteligencia-emocional/pdfs/', 'r2://pdfs/'),
  updated_at = NOW()
WHERE
  product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://kit-inteligencia-emocional/pdfs/%';

-- Verify the rollback
SELECT
  product_id,
  COUNT(*) as total_reverted,
  STRING_AGG(DISTINCT SUBSTRING(content_url FROM 1 FOR 50), ', ') as sample_urls
FROM product_contents
WHERE
  product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%'
GROUP BY product_id;

COMMIT;
*/

-- ============================================
-- STEP 3: Verify rollback results
-- ============================================

SELECT
  id,
  product_id,
  title,
  content_url,
  CASE
    WHEN content_url LIKE 'r2://pdfs/%' THEN '✅ LEGACY FORMAT'
    WHEN content_url LIKE 'r2://kit-inteligencia-emocional/pdfs/%' THEN '⚠️ STILL MULTI-BUCKET'
    ELSE '❓ OTHER'
  END AS format_status
FROM product_contents
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
ORDER BY product_id, order_index;
