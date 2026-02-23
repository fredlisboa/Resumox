-- Find duplicate ACTIVE order bumps for kriziarc9@gmail.com
-- The issue is multiple active entries for the same product

-- Step 1: Show all active order bumps grouped by product
SELECT
  '========== ALL ACTIVE ORDER BUMPS ==========' as section;

SELECT
  product_id,
  product_name,
  hotmart_transaction_id,
  status,
  created_at,
  id
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = true
  AND status = 'active'
ORDER BY product_id, created_at;

-- Step 2: Find products with multiple active entries
SELECT
  '========== PRODUCTS WITH MULTIPLE ACTIVE ENTRIES ==========' as section;

SELECT
  product_id,
  product_name,
  COUNT(*) as active_count,
  STRING_AGG(hotmart_transaction_id, ' | ' ORDER BY created_at) as transaction_ids,
  STRING_AGG(id::text, ' | ' ORDER BY created_at) as entry_ids
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = true
  AND status = 'active'
GROUP BY product_id, product_name
HAVING COUNT(*) > 1
ORDER BY product_id;

-- Step 3: Show which entries should be KEPT (oldest) vs DELETED (newer)
SELECT
  '========== DUPLICATE ENTRIES TO DELETE (keep oldest, delete newer) ==========' as section;

WITH ranked_entries AS (
  SELECT
    id,
    product_id,
    product_name,
    hotmart_transaction_id,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY created_at ASC) as rn
  FROM user_products
  WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
    AND is_order_bump = true
    AND status = 'active'
)
SELECT
  id,
  product_id,
  product_name,
  hotmart_transaction_id,
  created_at,
  CASE
    WHEN rn = 1 THEN 'KEEP (oldest)'
    ELSE 'DELETE (duplicate)'
  END as action
FROM ranked_entries
WHERE product_id IN (
  -- Only show products that have duplicates
  SELECT product_id
  FROM ranked_entries
  GROUP BY product_id
  HAVING COUNT(*) > 1
)
ORDER BY product_id, created_at;

-- Step 4: Count how many duplicates to delete
SELECT
  '========== SUMMARY ==========' as section;

WITH ranked_entries AS (
  SELECT
    id,
    product_id,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY created_at ASC) as rn
  FROM user_products
  WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
    AND is_order_bump = true
    AND status = 'active'
)
SELECT
  'Active order bumps with duplicates' as metric,
  COUNT(DISTINCT product_id) as count
FROM ranked_entries
WHERE product_id IN (
  SELECT product_id
  FROM ranked_entries
  GROUP BY product_id
  HAVING COUNT(*) > 1
)

UNION ALL

SELECT
  'Total duplicate entries to delete' as metric,
  COUNT(*) as count
FROM ranked_entries
WHERE rn > 1  -- Keep first (oldest), delete the rest

UNION ALL

SELECT
  'Entries after cleanup' as metric,
  COUNT(DISTINCT product_id) as count
FROM ranked_entries;
