# Admin System - Quick Start

Quick reference for setting up and using the admin system.

## 🚀 Quick Setup (3 Steps)

### 1. Run Migration

```bash
# Using Supabase SQL Editor (easiest)
# Copy/paste: supabase/migrations/add_admin_users_table.sql
# Then click "Run"
```

### 2. Get Your User ID

```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

Copy the `id` (UUID)

### 3. Make Yourself Super Admin

```sql
-- Replace YOUR-UUID-HERE with your ID from step 2
INSERT INTO admin_users (user_id, role, can_create_avisos, can_manage_users, can_manage_contents, can_view_analytics)
VALUES ('YOUR-UUID-HERE'::UUID, 'super_admin', true, true, true, true);
```

**Done!** Log out and log back in.

## 📍 Admin Pages

| URL | Purpose | Required Permission |
|-----|---------|-------------------|
| `/admin/avisos` | Create notifications | `can_create_avisos` |
| `/admin/users` | Manage admins | Super Admin only |

## 👥 Adding More Admins

**Easy Way (UI):**
1. Go to `/admin/users`
2. Click "Adicionar Admin"
3. Enter their email
4. Select role
5. Done!

**SQL Way:**
```sql
-- First get their user_id
SELECT id FROM auth.users WHERE email = 'newadmin@example.com';

-- Then insert
INSERT INTO admin_users (user_id, role, can_create_avisos, can_manage_users, can_manage_contents, can_view_analytics)
VALUES ('their-uuid-here'::UUID, 'admin', true, true, true, true);
```

## 🔑 Admin Roles

| Role | Access |
|------|--------|
| **super_admin** | Everything, can manage other admins |
| **admin** | Create notifications, manage users/content |
| **moderator** | Limited, usually just notifications |

## ✅ Permissions

- `can_create_avisos` → Create/send notifications
- `can_manage_users` → Manage user accounts
- `can_manage_contents` → Manage product content
- `can_view_analytics` → View analytics/reports

## 🔧 Common Tasks

**Check if someone is admin:**
```sql
SELECT is_admin('user-uuid-here'::UUID);
```

**Check specific permission:**
```sql
SELECT has_permission('user-uuid-here'::UUID, 'create_avisos');
```

**List all admins:**
```sql
SELECT
  au.role,
  au.can_create_avisos,
  au.is_active,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id;
```

**Deactivate admin:**
```sql
UPDATE admin_users
SET is_active = false
WHERE user_id = 'user-uuid-here'::UUID;
```

**Remove admin:**
```sql
DELETE FROM admin_users
WHERE user_id = 'user-uuid-here'::UUID;
```

## 🐛 Troubleshooting

**Problem:** "403 Forbidden" on admin pages

**Solution:**
```sql
-- Check if you're an admin
SELECT * FROM admin_users WHERE user_id = 'your-uuid-here';

-- If not found, add yourself (see step 3 above)
```

**Problem:** Can't add admin - "User not found"

**Solution:**
- User must have an account first
- Or use their user_id directly instead of email

**Problem:** Admin can't create notifications

**Solution:**
```sql
-- Enable the permission
UPDATE admin_users
SET can_create_avisos = true
WHERE user_id = 'their-uuid-here';
```

## 📚 Full Documentation

For detailed guide, see: [docs/ADMIN_SYSTEM_SETUP.md](docs/ADMIN_SYSTEM_SETUP.md)

## 🎯 What Changed in the Code

**Updated File:**
- [app/api/avisos/create/route.ts](app/api/avisos/create/route.ts#L7-L18) - Now checks admin_users table

**New Files:**
- `supabase/migrations/add_admin_users_table.sql` - Database schema
- `app/api/admin/users/route.ts` - Admin management API
- `app/admin/users/page.tsx` - Admin management UI

## ✨ Example: Complete Setup

```sql
-- 1. Find your user ID
SELECT id, email FROM auth.users WHERE email = 'you@example.com';
-- Result: 123e4567-e89b-12d3-a456-426614174000

-- 2. Make yourself super admin
INSERT INTO admin_users (user_id, role, can_create_avisos, can_manage_users, can_manage_contents, can_view_analytics)
VALUES ('123e4567-e89b-12d3-a456-426614174000'::UUID, 'super_admin', true, true, true, true);

-- 3. Verify
SELECT is_super_admin('123e4567-e89b-12d3-a456-426614174000'::UUID);
-- Should return: true

-- 4. Log out and back in
-- 5. Visit /admin/avisos - it works! 🎉
```

---

**Need Help?** Check [docs/ADMIN_SYSTEM_SETUP.md](docs/ADMIN_SYSTEM_SETUP.md) for complete guide.
