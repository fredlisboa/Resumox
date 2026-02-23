-- Comprehensive cleanup script for duplicate order bump entries
-- This script fixes all users who have duplicate locked entries due to duplicate webhook processing

-- PART 1: Identify and report duplicates
DO $$
DECLARE
  v_affected_users INT;
  v_total_duplicates INT;
BEGIN
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'DUPLICATE ORDER BUMP CLEANUP SCRIPT';
  RAISE NOTICE '==================================================';
  RAISE NOTICE '';

  -- Count users affected by duplicate locked order bumps
  SELECT COUNT(DISTINCT user_id) INTO v_affected_users
  FROM user_products
  WHERE status = 'locked'
    AND is_order_bump = true
    AND hotmart_transaction_id LIKE '%-OB-%'
    AND EXISTS (
      SELECT 1
      FROM user_products up2
      WHERE up2.user_id = user_products.user_id
        AND up2.product_id = user_products.product_id
        AND up2.status = 'active'
        AND up2.is_order_bump = true
        AND up2.id != user_products.id
    );

  SELECT COUNT(*) INTO v_total_duplicates
  FROM user_products
  WHERE status = 'locked'
    AND is_order_bump = true
    AND hotmart_transaction_id LIKE '%-OB-%'
    AND EXISTS (
      SELECT 1
      FROM user_products up2
      WHERE up2.user_id = user_products.user_id
        AND up2.product_id = user_products.product_id
        AND up2.status = 'active'
        AND up2.is_order_bump = true
        AND up2.id != user_products.id
    );

  RAISE NOTICE 'ANALYSIS:';
  RAISE NOTICE '  - Users affected: %', v_affected_users;
  RAISE NOTICE '  - Duplicate locked entries: %', v_total_duplicates;
  RAISE NOTICE '';
END $$;

-- PART 2: Clean up duplicates
DO $$
DECLARE
  v_deleted_count INT := 0;
  rec RECORD;
BEGIN
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'CLEANUP PHASE 1: Remove locked duplicates of active order bumps';
  RAISE NOTICE '==================================================';
  RAISE NOTICE '';

  -- Delete locked order bumps where an active version exists
  DELETE FROM user_products
  WHERE id IN (
    SELECT locked.id
    FROM user_products locked
    WHERE locked.status = 'locked'
      AND locked.is_order_bump = true
      AND locked.hotmart_transaction_id LIKE '%-OB-%'
      AND EXISTS (
        -- Check if there's an active entry for the same product
        SELECT 1
        FROM user_products active
        WHERE active.user_id = locked.user_id
          AND active.product_id = locked.product_id
          AND active.is_order_bump = true
          AND active.status = 'active'
          AND active.id != locked.id
      )
  );

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RAISE NOTICE '✅ Deleted % duplicate locked order bump entries', v_deleted_count;
  RAISE NOTICE '';

  -- PART 3: Handle multiple active entries (keep oldest)
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'CLEANUP PHASE 2: Remove duplicate active order bumps (keep oldest)';
  RAISE NOTICE '==================================================';
  RAISE NOTICE '';

  v_deleted_count := 0;

  -- Find and delete duplicate active entries, keeping the oldest one
  WITH ranked_entries AS (
    SELECT
      up.id,
      up.user_id,
      up.product_id,
      up.created_at,
      ROW_NUMBER() OVER (
        PARTITION BY up.user_id, up.product_id
        ORDER BY up.created_at ASC
      ) as rn
    FROM user_products up
    WHERE up.is_order_bump = true
      AND up.status = 'active'
  )
  DELETE FROM user_products
  WHERE id IN (
    SELECT id
    FROM ranked_entries
    WHERE rn > 1  -- Keep only the first (oldest) entry
  );

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RAISE NOTICE '✅ Deleted % duplicate active order bump entries', v_deleted_count;
  RAISE NOTICE '';

  -- PART 4: Report final state
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'FINAL STATE - User Products Summary';
  RAISE NOTICE '==================================================';
  RAISE NOTICE '';

  FOR rec IN
    SELECT
      ua.email,
      COUNT(*) FILTER (WHERE up.is_order_bump = false) as main_products,
      COUNT(*) FILTER (WHERE up.is_order_bump = true AND up.status = 'active') as active_bumps,
      COUNT(*) FILTER (WHERE up.is_order_bump = true AND up.status = 'locked') as locked_bumps,
      COUNT(*) as total_products
    FROM users_access ua
    LEFT JOIN user_products up ON ua.id = up.user_id
    WHERE ua.email IN (
      SELECT DISTINCT ua2.email
      FROM users_access ua2
      JOIN user_products up2 ON ua2.id = up2.user_id
      WHERE up2.is_order_bump = true
    )
    GROUP BY ua.email
    ORDER BY total_products DESC
    LIMIT 20
  LOOP
    RAISE NOTICE 'User: %', rec.email;
    RAISE NOTICE '  Main Products: %', rec.main_products;
    RAISE NOTICE '  Active Order Bumps: %', rec.active_bumps;
    RAISE NOTICE '  Locked Order Bumps: %', rec.locked_bumps;
    RAISE NOTICE '  Total: %', rec.total_products;
    RAISE NOTICE '';
  END LOOP;

  RAISE NOTICE '==================================================';
  RAISE NOTICE 'CLEANUP COMPLETE';
  RAISE NOTICE '==================================================';

END $$;

-- PART 5: Verify no duplicates remain
DO $$
DECLARE
  v_duplicates INT;
BEGIN
  SELECT COUNT(*) INTO v_duplicates
  FROM (
    SELECT user_id, product_id, is_order_bump, status, COUNT(*) as cnt
    FROM user_products
    WHERE is_order_bump = true AND status = 'active'
    GROUP BY user_id, product_id, is_order_bump, status
    HAVING COUNT(*) > 1
  ) dups;

  IF v_duplicates > 0 THEN
    RAISE WARNING '⚠️  WARNING: % duplicate entries still remain!', v_duplicates;
  ELSE
    RAISE NOTICE '✅ SUCCESS: No duplicate active order bumps found';
  END IF;
END $$;
