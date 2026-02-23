# Quick Fix Guide - Hotmart Duplicate Order Bumps

## TL;DR - What You Need to Do

### Option 1: Quick Fix (Fix Current Issue Only)
```bash
# Step 1: Diagnose the issue (safe, read-only)
psql your_database < find-duplicate-actives.sql

# Step 2: Backup database
pg_dump -t user_products > backup_user_products.sql

# Step 3: Run cleanup for specific user (CORRECT VERSION)
psql your_database < fix-duplicate-active-bumps.sql

# Done! User should now have access
```

### Option 2: Complete Fix (Fix Current + Prevent Future)
```bash
# Step 1: Backup database
pg_dump -t user_products > backup_user_products.sql

# Step 2: Run comprehensive cleanup
psql your_database < cleanup-duplicate-order-bumps.sql

# Step 3: Deploy code changes
git add app/api/webhook/hotmart/route.ts
git commit -m "Fix: Prevent duplicate order bump entries"
git push

# Done! All users fixed + future issues prevented
```

---

## The Problem (In Plain English)

**What happened:**
- User bought 1 main product + 4 order bumps
- Hotmart sent duplicate webhook for main product
- System created duplicate "locked" entries for order bumps
- User couldn't access order bumps (showed as locked instead of active)

**Why it happened:**
- Webhooks arrived in wrong order (bumps before main product)
- No check for duplicate webhooks
- No check for existing active entries before creating locked ones

**How we fix it:**
- Delete duplicate locked entries (SQL cleanup)
- Add duplicate prevention logic (code changes)

---

## Files Created

### 1. Code Changes
- **File**: `app/api/webhook/hotmart/route.ts`
- **What**: Prevents future duplicate entries
- **Deploy**: Yes, push to production after testing

### 2. Database Cleanup Scripts

#### Quick Fix (Single User)
- **File**: `fix-duplicate-user-products.sql`
- **What**: Fixes kriziarc9@gmail.com only
- **Safe**: Yes, won't touch other users
- **Run**: Once

#### Complete Cleanup (All Users)
- **File**: `cleanup-duplicate-order-bumps.sql`
- **What**: Fixes all users with duplicates
- **Safe**: Yes, includes verification
- **Run**: Once

### 3. Documentation
- **File**: `HOTMART-WEBHOOK-FIX-SUMMARY.md`
- **What**: Detailed explanation of problem and solution
- **Read**: Yes, for full understanding

- **File**: `WEBHOOK-FLOW-DIAGRAM.md`
- **What**: Visual flow diagrams (before/after)
- **Read**: Yes, helpful for understanding

- **File**: `QUICK-FIX-GUIDE.md`
- **What**: This file
- **Read**: You're already reading it!

---

## Verification Steps

### Check if User Has Duplicates
```sql
SELECT
  product_id,
  product_name,
  status,
  hotmart_transaction_id,
  is_order_bump
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'kriziarc9@gmail.com')
ORDER BY created_at;
```

**Look for**:
- Multiple entries for same product_id
- Both "active" and "locked" status for same product

### Check How Many Users Affected
```sql
SELECT COUNT(DISTINCT user_id) as affected_users
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
  );
```

**Expected**: Number of users with duplicate locked entries

### Verify Fix Worked
```sql
-- Should return 0 rows after cleanup
SELECT
  user_id,
  product_id,
  COUNT(*) as duplicates
FROM user_products
WHERE is_order_bump = true AND status = 'active'
GROUP BY user_id, product_id
HAVING COUNT(*) > 1;
```

**Expected**: `0 rows` (no duplicates remain)

---

## Common Questions

### Q: Will this delete user access?
**A**: No. The cleanup only deletes duplicate locked entries. Active entries (which grant access) are preserved.

### Q: What if script fails halfway?
**A**: All operations are in transactions. If it fails, nothing changes. You can safely re-run.

### Q: Do I need to stop the application?
**A**: No. The cleanup script is safe to run on live database.

### Q: What about future purchases?
**A**: Deploy the code changes to prevent future duplicates.

### Q: Can I test this first?
**A**: Yes! Test on staging environment if you have one. Or run the SELECT queries to see what would be deleted before running DELETE.

---

## Rollback Plan

### If Something Goes Wrong

#### Step 1: Restore from backup
```bash
psql your_database < backup_user_products.sql
```

#### Step 2: Review what happened
```bash
# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-*.log

# Check application logs
tail -f /var/log/your_app/production.log
```

#### Step 3: Contact support
- Provide logs from Step 2
- Describe what went wrong
- We'll help debug

---

## Timeline (Recommended)

### Production Deployment

**Day 1 (Today)**:
1. ✅ Review code changes
2. ✅ Test cleanup script on staging (if available)
3. ✅ Backup production database
4. ✅ Run cleanup script on production
5. ✅ Verify user access restored

**Day 2**:
1. Deploy code changes to staging
2. Test with test purchase
3. Verify no duplicates created

**Day 3**:
1. Deploy code changes to production
2. Monitor webhook logs
3. Check for any errors

**Day 4+**:
1. Monitor for duplicate entries
2. Review webhook logs weekly
3. All done!

---

## Support

### Need Help?

**Before asking**:
1. Read `HOTMART-WEBHOOK-FIX-SUMMARY.md` for full details
2. Check PostgreSQL logs for errors
3. Run verification queries above

**Include in support request**:
- Database logs showing error
- Number of users affected (from query above)
- Screenshot of `user_products` table for affected user

---

## Quick Reference

### File Locations
```
/home/fredlisboa/lt-entregaveis/
├── app/api/webhook/hotmart/route.ts        # Code changes (deploy)
├── fix-duplicate-user-products.sql          # Quick fix (run once)
├── cleanup-duplicate-order-bumps.sql        # Complete cleanup (run once)
├── HOTMART-WEBHOOK-FIX-SUMMARY.md           # Full documentation (read)
├── WEBHOOK-FLOW-DIAGRAM.md                  # Visual diagrams (read)
└── QUICK-FIX-GUIDE.md                       # This file (start here)
```

### Key Commands
```bash
# Backup
pg_dump -t user_products > backup_user_products.sql

# Restore
psql your_database < backup_user_products.sql

# Run cleanup
psql your_database < cleanup-duplicate-order-bumps.sql

# Deploy code
git add app/api/webhook/hotmart/route.ts && git commit -m "Fix duplicates" && git push
```

---

**Last Updated**: 2026-01-05
**Urgency**: Medium (affects user access)
**Complexity**: Low (straightforward fix)
**Risk**: Low (safe cleanup, includes backups)
