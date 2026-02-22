-- Diagnostic query to see actual state of user_products for kriziarc9@gmail.com
-- This will help us understand what's currently in the database

-- Step 1: Show ALL entries for this user
SELECT
  '========== ALL ENTRIES FOR USER ==========' as section;

SELECT
  id,
  product_id,
  product_name,
  hotmart_transaction_id,
  is_order_bump,
  parent_transaction_id,
  status,
  purchase_date,
  created_at
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
ORDER BY created_at;

-- Step 2: Count by status
SELECT
  '========== COUNT BY STATUS ==========' as section;

SELECT
  is_order_bump,
  status,
  COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
GROUP BY is_order_bump, status
ORDER BY is_order_bump, status;

-- Step 3: Find potential duplicates (same product_id, different status)
SELECT
  '========== POTENTIAL DUPLICATES (same product, different entries) ==========' as section;

SELECT
  product_id,
  product_name,
  COUNT(*) as entry_count,
  STRING_AGG(DISTINCT status, ', ') as statuses,
  STRING_AGG(hotmart_transaction_id, ' | ') as transaction_ids
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
GROUP BY product_id, product_name
HAVING COUNT(*) > 1
ORDER BY product_id;

-- Step 4: Show locked order bumps with synthetic transaction IDs
SELECT
  '========== LOCKED ORDER BUMPS WITH SYNTHETIC IDs ==========' as section;

SELECT
  id,
  product_id,
  product_name,
  hotmart_transaction_id,
  parent_transaction_id,
  status,
  created_at
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND status = 'locked'
  AND is_order_bump = true
  AND hotmart_transaction_id LIKE '%-OB-%'
ORDER BY created_at;

-- Step 5: Show active order bumps
SELECT
  '========== ACTIVE ORDER BUMPS ==========' as section;

SELECT
  id,
  product_id,
  product_name,
  hotmart_transaction_id,
  parent_transaction_id,
  status,
  created_at
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = true
  AND status = 'active'
ORDER BY created_at;

-- Step 6: Find locked bumps that have active counterparts (these should be deleted)
SELECT
  '========== LOCKED BUMPS WITH ACTIVE COUNTERPARTS (TO DELETE) ==========' as section;

SELECT
  locked.id as locked_id,
  locked.product_id,
  locked.product_name,
  locked.hotmart_transaction_id as locked_transaction,
  locked.status as locked_status,
  active.id as active_id,
  active.hotmart_transaction_id as active_transaction,
  active.status as active_status,
  'SHOULD BE DELETED' as action
FROM user_products locked
INNER JOIN user_products active
  ON active.user_id = locked.user_id
  AND active.product_id = locked.product_id
  AND active.is_order_bump = true
  AND active.status = 'active'
  AND active.id != locked.id
WHERE locked.user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND locked.status = 'locked'
  AND locked.is_order_bump = true
ORDER BY locked.product_id;

-- Step 7: Summary
SELECT
  '========== SUMMARY ==========' as section;

SELECT
  'Total entries' as metric,
  COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')

UNION ALL

SELECT
  'Main products (active)' as metric,
  COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = false
  AND status = 'active'

UNION ALL

SELECT
  'Order bumps (active)' as metric,
  COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = true
  AND status = 'active'

UNION ALL

SELECT
  'Order bumps (locked)' as metric,
  COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND is_order_bump = true
  AND status = 'locked'

UNION ALL

SELECT
  'Duplicates to delete' as metric,
  COUNT(*) as count
FROM user_products locked
WHERE locked.user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND locked.status = 'locked'
  AND locked.is_order_bump = true
  AND EXISTS (
    SELECT 1
    FROM user_products active
    WHERE active.user_id = locked.user_id
      AND active.product_id = locked.product_id
      AND active.is_order_bump = true
      AND active.status = 'active'
      AND active.id != locked.id
  );
