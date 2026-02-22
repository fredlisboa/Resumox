# Order Bump Quick Reference Card

## 🚀 Quick Commands

```bash
# IMPORTANT: Scripts auto-load .env.local - make sure it exists!

# Test complete flow
npx tsx scripts/test-order-bump-flow.ts

# Check user status
npx tsx scripts/check-order-bump-status.ts user@example.com

# Run TypeScript check
npx tsc --noEmit

# Check production logs
grep "Hotmart Webhook" logs/production.log
grep "Contents API" logs/production.log
```

## ⚙️ Required Environment Variables

Make sure `.env.local` exists with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
HOTMART_WEBHOOK_SECRET=your_webhook_secret
```

---

## 📊 Database Tables

### `product_contents` (Content Catalog)
```sql
-- Add new order bump content
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  status,  -- Set to 'order_bump'
  ...
) VALUES ('ORDERBUMP01', 'pdf', 'Exclusive Content', 'order_bump', ...);

-- List all order bumps
SELECT * FROM product_contents WHERE status = 'order_bump';
```

### `user_products` (Purchase History)
```sql
-- Check user's products
SELECT
  product_id,
  product_name,
  is_order_bump,
  status,
  purchase_date
FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'user@example.com');

-- Find all order bump purchases
SELECT * FROM user_products WHERE is_order_bump = true;
```

---

## 🔍 Key Concepts

### Two Different `status` Columns

| Table | Column | Values | Purpose | Set By |
|-------|--------|--------|---------|---------|
| `product_contents` | `status` | `principal`, `bonus`, `order_bump` | Content type | Manual (SQL) |
| `user_products` | `status` | `active`, `refunded`, `cancelled` | Purchase state | Webhook |

### Content Unlocking Logic

```typescript
// Order bump is locked ONLY if user doesn't own it
const isOrderBump = content.status === 'order_bump'
const userOwnsOrderBump = isOrderBump && activeProductIds.includes(content.product_id)
const isLocked = isOrderBump && !userOwnsOrderBump
```

---

## 🐛 Debugging Checklist

When an order bump isn't working:

### 1. Check Webhook Logs
```bash
# Look for order bump detection
grep "ORDER BUMP DETECTION" logs/app.log

# Check if product was registered
grep "Product registered successfully" logs/app.log
```

### 2. Verify Database
```sql
-- Did webhook create user_products record?
SELECT * FROM user_products
WHERE user_id = (SELECT id FROM users_access WHERE email = 'user@example.com')
AND is_order_bump = true;

-- Does product_id match?
SELECT product_id FROM product_contents WHERE status = 'order_bump';
SELECT product_id FROM user_products WHERE is_order_bump = true;
```

### 3. Check Content API
```bash
# Look for unlocking decision
grep "User owns:" logs/app.log
grep "Is locked:" logs/app.log
```

### 4. Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Order bump stays locked | Product IDs don't match | Ensure `product_contents.product_id` matches `user_products.product_id` |
| Webhook not detected | Missing checkout session | Check `origin.sck` in webhook payload |
| Content not showing | Product inactive | Check `is_active = true` in `product_contents` |
| All content locked | User has no active products | Check `user_products.status = 'active'` |

---

## 📋 Deployment Checklist

Before deploying:

- [ ] Run tests: `npx tsx scripts/test-order-bump-flow.ts`
- [ ] Check TypeScript: `npx tsc --noEmit`
- [ ] Verify migration: `add_order_bump_status.sql` executed
- [ ] Test with sample user
- [ ] Check logs show detection
- [ ] Deploy code
- [ ] Monitor production logs
- [ ] Test with real webhook

---

## 🔗 Related Files

- **Main Logic:** [app/api/contents/route.ts](app/api/contents/route.ts)
- **Webhook:** [app/api/webhook/hotmart/route.ts](app/api/webhook/hotmart/route.ts)
- **Tests:** [scripts/test-order-bump-flow.ts](scripts/test-order-bump-flow.ts)
- **Status Check:** [scripts/check-order-bump-status.ts](scripts/check-order-bump-status.ts)
- **Full Documentation:** [scripts/TEST-ORDER-BUMPS.md](scripts/TEST-ORDER-BUMPS.md)
- **Summary:** [ORDER-BUMP-FIX-SUMMARY.md](ORDER-BUMP-FIX-SUMMARY.md)

---

## 💡 Tips

1. **Always check both tables** - Remember there are two `status` columns
2. **Product IDs must match exactly** - Case-sensitive!
3. **Use test scripts** - Don't guess, verify with tests
4. **Monitor logs** - They now show detailed order bump detection
5. **Check checkout session** - This is how order bumps are detected

---

**Quick Help:** Run `npx tsx scripts/check-order-bump-status.ts user@email.com` to see everything about a user's order bumps!
