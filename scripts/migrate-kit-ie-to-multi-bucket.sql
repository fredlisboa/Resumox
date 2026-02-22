-- Migration Script: Update Kit Inteligencia Emocional to use explicit R2 bucket
-- This script updates all PDF URLs for Kit Inteligencia Emocional products
-- to use the explicit bucket format: r2://kit-inteligencia-emocional/pdfs/filename.pdf
--
-- Date: 2025-12-30
-- Purpose: Enable multi-bucket R2 support for Kit Inteligencia Emocional
--
-- IMPORTANT: Backup your database before running this script!
-- Run this query first to backup:
-- CREATE TABLE product_contents_backup AS SELECT * FROM product_contents;

-- ============================================
-- STEP 1: Preview changes (run this first!)
-- ============================================

SELECT
  id,
  product_id,
  title,
  content_url AS current_url,
  CASE
    -- Only update URLs that start with r2://pdfs/ and belong to Kit IE products
    WHEN content_url LIKE 'r2://pdfs/%'
      AND product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
    THEN REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/')
    ELSE content_url
  END AS new_url,
  CASE
    WHEN content_url LIKE 'r2://pdfs/%'
      AND product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
    THEN '✅ WILL UPDATE'
    ELSE '⏭️ SKIP'
  END AS action
FROM product_contents
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
ORDER BY product_id, order_index;

-- ============================================
-- STEP 2: Execute migration (uncomment to run)
-- ============================================

/*
BEGIN;

-- Update all PDFs for Kit Inteligencia Emocional main product (6557472)
UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/'),
  updated_at = NOW()
WHERE
  product_id = '6557472'
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';

-- Update PDFs for Order Bump: Preguntas Poderosas (6557903)
UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/'),
  updated_at = NOW()
WHERE
  product_id = '6557903'
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';

-- Update PDFs for Order Bump: Ferramentas de Regulação (6558403)
UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/'),
  updated_at = NOW()
WHERE
  product_id = '6558403'
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';

-- Update PDFs for Order Bump: NeuroAfetividad Infantil (6558441)
UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/'),
  updated_at = NOW()
WHERE
  product_id = '6558441'
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';

-- Update PDFs for Order Bump: Metáforas Emocionales (6558460)
UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/'),
  updated_at = NOW()
WHERE
  product_id = '6558460'
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';

-- Update PDFs for Order Bump: Coloreando Emociones (6558478)
UPDATE product_contents
SET
  content_url = REPLACE(content_url, 'r2://pdfs/', 'r2://kit-inteligencia-emocional/pdfs/'),
  updated_at = NOW()
WHERE
  product_id = '6558478'
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://pdfs/%';

-- Verify the updates
SELECT
  product_id,
  COUNT(*) as total_updated,
  STRING_AGG(DISTINCT title, ', ') as titles
FROM product_contents
WHERE
  product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
  AND content_url LIKE 'r2://kit-inteligencia-emocional/pdfs/%'
GROUP BY product_id;

COMMIT;
*/

-- ============================================
-- STEP 3: Verify migration results
-- ============================================

-- Check all Kit IE PDFs after migration
SELECT
  id,
  product_id,
  title,
  content_url,
  CASE
    WHEN content_url LIKE 'r2://kit-inteligencia-emocional/pdfs/%' THEN '✅ MIGRATED'
    WHEN content_url LIKE 'r2://pdfs/%' THEN '⚠️ OLD FORMAT'
    ELSE '❓ OTHER'
  END AS migration_status
FROM product_contents
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
ORDER BY product_id, order_index;

-- Summary by product
SELECT
  product_id,
  COUNT(*) as total_pdfs,
  SUM(CASE WHEN content_url LIKE 'r2://kit-inteligencia-emocional/pdfs/%' THEN 1 ELSE 0 END) as migrated,
  SUM(CASE WHEN content_url LIKE 'r2://pdfs/%' THEN 1 ELSE 0 END) as old_format
FROM product_contents
WHERE product_id IN ('6557472', '6557903', '6558403', '6558441', '6558460', '6558478')
  AND content_type = 'pdf'
GROUP BY product_id;
