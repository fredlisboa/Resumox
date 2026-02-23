-- Fix duplicate ACTIVE order bump entries for kriziarc9@gmail.com
-- This script removes duplicate active entries, keeping the oldest one for each product

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
  RAISE NOTICE '';
  RAISE NOTICE '========== BEFORE CLEANUP ==========';

  -- Show current state
  FOR rec IN
    SELECT
      product_id,
      product_name,
      hotmart_transaction_id,
      status,
      created_at
    FROM user_products
    WHERE user_id = v_user_id
      AND is_order_bump = true
      AND status = 'active'
    ORDER BY product_id, created_at
  LOOP
    RAISE NOTICE 'Product: % | Transaction: % | Created: %',
      rec.product_name, rec.hotmart_transaction_id, rec.created_at;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '========== DELETING DUPLICATES ==========';

  -- Delete duplicate active entries, keeping the oldest one for each product
  WITH ranked_entries AS (
    SELECT
      id,
      product_id,
      product_name,
      hotmart_transaction_id,
      created_at,
      ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY created_at ASC) as rn
    FROM user_products
    WHERE user_id = v_user_id
      AND is_order_bump = true
      AND status = 'active'
  )
  DELETE FROM user_products
  WHERE id IN (
    SELECT id
    FROM ranked_entries
    WHERE rn > 1  -- Delete all except the first (oldest) entry
  );

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % duplicate active order bump entries', v_deleted_count;

  RAISE NOTICE '';
  RAISE NOTICE '========== AFTER CLEANUP ==========';

  -- Show final state
  FOR rec IN
    SELECT
      product_id,
      product_name,
      hotmart_transaction_id,
      status,
      created_at
    FROM user_products
    WHERE user_id = v_user_id
      AND is_order_bump = true
      AND status = 'active'
    ORDER BY product_id, created_at
  LOOP
    RAISE NOTICE 'Product: % | Transaction: % | Created: %',
      rec.product_name, rec.hotmart_transaction_id, rec.created_at;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '========== FINAL SUMMARY ==========';

  -- Final counts
  SELECT COUNT(*) INTO v_deleted_count
  FROM user_products
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Total products: %', v_deleted_count;

  SELECT COUNT(*) INTO v_deleted_count
  FROM user_products
  WHERE user_id = v_user_id AND is_order_bump = false;

  RAISE NOTICE 'Main products: %', v_deleted_count;

  SELECT COUNT(*) INTO v_deleted_count
  FROM user_products
  WHERE user_id = v_user_id AND is_order_bump = true AND status = 'active';

  RAISE NOTICE 'Active order bumps: %', v_deleted_count;

  SELECT COUNT(*) INTO v_deleted_count
  FROM user_products
  WHERE user_id = v_user_id AND is_order_bump = true AND status = 'locked';

  RAISE NOTICE 'Locked order bumps: %', v_deleted_count;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Cleanup complete!';

END $$;
