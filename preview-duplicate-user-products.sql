-- Preview what will be deleted for kriziarc9@gmail.com
-- This script DOES NOT delete anything, just shows what would be deleted

-- Show current state
SELECT
  'CURRENT STATE - All entries for user' as info;

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

-- Show what will be deleted
SELECT
  '' as separator,
  'ENTRIES TO BE DELETED (duplicate locked)' as info;

SELECT
  id,
  product_id,
  product_name,
  hotmart_transaction_id,
  is_order_bump,
  parent_transaction_id,
  status,
  'WILL BE DELETED' as action
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND status = 'locked'
  AND is_order_bump = true
  AND parent_transaction_id = 'HP3753209659'
  AND hotmart_transaction_id LIKE 'HP3753209659-OB-%'
  AND EXISTS (
    -- Check if there's an active entry for the same product
    SELECT 1
    FROM user_products up2
    WHERE up2.user_id = user_products.user_id
      AND up2.product_id = user_products.product_id
      AND up2.status = 'active'
      AND up2.is_order_bump = true
  )
ORDER BY product_id;

-- Show what will remain
SELECT
  '' as separator,
  'ENTRIES THAT WILL REMAIN' as info;

SELECT
  id,
  product_id,
  product_name,
  hotmart_transaction_id,
  is_order_bump,
  parent_transaction_id,
  status,
  'WILL REMAIN' as action
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND NOT (
    status = 'locked'
    AND is_order_bump = true
    AND parent_transaction_id = 'HP3753209659'
    AND hotmart_transaction_id LIKE 'HP3753209659-OB-%'
    AND EXISTS (
      SELECT 1
      FROM user_products up2
      WHERE up2.user_id = user_products.user_id
        AND up2.product_id = user_products.product_id
        AND up2.status = 'active'
        AND up2.is_order_bump = true
    )
  )
ORDER BY is_order_bump, status, product_id;

-- Summary
SELECT
  '' as separator,
  'SUMMARY' as info;

SELECT
  'Total entries before cleanup' as metric,
  COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')

UNION ALL

SELECT
  'Entries to be deleted' as metric,
  COUNT(*) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
  AND status = 'locked'
  AND is_order_bump = true
  AND parent_transaction_id = 'HP3753209659'
  AND hotmart_transaction_id LIKE 'HP3753209659-OB-%'
  AND EXISTS (
    SELECT 1
    FROM user_products up2
    WHERE up2.user_id = user_products.user_id
      AND up2.product_id = user_products.product_id
      AND up2.status = 'active'
      AND up2.is_order_bump = true
  )

UNION ALL

SELECT
  'Entries after cleanup' as metric,
  COUNT(*) - (
    SELECT COUNT(*)
    FROM user_products
    WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
      AND status = 'locked'
      AND is_order_bump = true
      AND parent_transaction_id = 'HP3753209659'
      AND hotmart_transaction_id LIKE 'HP3753209659-OB-%'
      AND EXISTS (
        SELECT 1
        FROM user_products up2
        WHERE up2.user_id = user_products.user_id
          AND up2.product_id = user_products.product_id
          AND up2.status = 'active'
          AND up2.is_order_bump = true
      )
  ) as count
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com');
