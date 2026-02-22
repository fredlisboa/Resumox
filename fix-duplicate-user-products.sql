-- Fix duplicate user_products entries for kriziarc9@gmail.com
-- This script removes duplicate locked entries and ensures user has proper access

-- Step 1: Identify the user_id
DO $$
DECLARE
  v_user_id UUID;
  v_deleted_count INT;
  rec RECORD;
BEGIN
  -- Get the user_id for kriziarc9@gmail.com
  SELECT id INTO v_user_id
  FROM users_access
  WHERE email = 'kriziarc9@gmail.com';

  RAISE NOTICE 'User ID: %', v_user_id;

  -- Step 2: Delete duplicate locked entries that have corresponding active entries
  -- These are the problematic entries created by the duplicate webhook

  DELETE FROM user_products
  WHERE user_id = v_user_id
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
    );

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % duplicate locked order bump entries', v_deleted_count;

  -- Step 3: Verify final state
  RAISE NOTICE '=== Final user_products for this user ===';

  FOR rec IN
    SELECT
      product_id,
      product_name,
      hotmart_transaction_id,
      is_order_bump,
      parent_transaction_id,
      status,
      purchase_date
    FROM user_products
    WHERE user_id = v_user_id
    ORDER BY purchase_date, is_order_bump
  LOOP
    RAISE NOTICE 'Product: % | Transaction: % | Bump: % | Status: %',
      rec.product_name, rec.hotmart_transaction_id, rec.is_order_bump, rec.status;
  END LOOP;

  -- Step 4: Summary
  SELECT COUNT(*) INTO v_deleted_count
  FROM user_products
  WHERE user_id = v_user_id;

  RAISE NOTICE '=== Summary ===';
  RAISE NOTICE 'Total active products: %', v_deleted_count;

END $$;

-- Optional: View the current state before running the fix
-- Uncomment to see what will be affected:
/*
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
*/
