# Admin System Setup Guide

Complete guide for setting up the admin users system with roles and permissions.

## Overview

The admin system allows you to control who can access administrative features like creating notifications, managing users, and viewing analytics. It uses a dedicated `admin_users` table with granular permissions.

## Features

- **3 Admin Roles**: super_admin, admin, moderator
- **Granular Permissions**: Control access to specific features
- **Admin Management UI**: Add, update, and remove admins
- **Row Level Security**: Database-level access control
- **API Protection**: All admin endpoints check permissions

## Step 1: Apply the Database Migration

### Option A: Using psql

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the migration
\i supabase/migrations/add_admin_users_table.sql
```

### Option B: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd /home/fredlisboa/lt-entregaveis

# Apply migration
supabase db push
```

### Option C: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/add_admin_users_table.sql`
4. Click "Run"

## Step 2: Create Your First Super Admin

After running the migration, you need to add yourself as the first super admin.

### Get Your User ID

First, find your user ID from the users_access table:

```sql
-- Run this in Supabase SQL Editor
SELECT id, email FROM public.users_access WHERE email = 'your-email@example.com';
```

Copy the `id` (it's a UUID like `123e4567-e89b-12d3-a456-426614174000`)

**Important**: This project uses `users_access` table instead of `auth.users` for user management.

### Insert Super Admin Record

```sql
-- Replace 'YOUR-USER-UUID-HERE' with your actual UUID from above
INSERT INTO public.admin_users (
  user_id,
  role,
  can_create_avisos,
  can_manage_users,
  can_manage_contents,
  can_view_analytics,
  notes
) VALUES (
  'd4771c9f-168c-450c-84d3-8f0c88c5166f'::UUID,
  'super_admin',
  true,
  true,
  true,
  true,
  'First super admin - created manually'
);
```

**Example:**
```sql
INSERT INTO public.admin_users (
  user_id,
  role,
  can_create_avisos,
  can_manage_users,
  can_manage_contents,
  can_view_analytics,
  notes
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000'::UUID,
  'super_admin',
  true,
  true,
  true,
  true,
  'First super admin - created manually'
);
```

### Verify It Worked

```sql
SELECT
  au.*,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.role = 'super_admin';
```

You should see your admin record with your email.

## Step 3: Test Admin Access

1. **Log out and log back in** (to refresh your session)

2. **Test creating a notification**:
   - Navigate to `/admin/avisos`
   - You should be able to access the page (before you'd get a 403 error)
   - Try creating a test notification

3. **Test admin management**:
   - Navigate to `/admin/users`
   - You should see yourself listed as a Super Admin
   - Try adding another admin user

## Admin Roles Explained

### Super Admin
- **Full access** to everything
- Can manage other admins (add, edit, remove)
- Can create notifications
- Can manage users and content
- Can view analytics
- **Cannot be deactivated** via the UI

### Admin
- Can create notifications
- Can manage users and content (if permissions enabled)
- Can view analytics
- **Cannot** manage other admins
- Can be deactivated by super admins

### Moderator
- Limited permissions
- Typically can only create notifications
- Can view analytics
- **Cannot** manage users or content by default
- Can be deactivated by super admins

## Permissions Explained

Each admin can have these permissions enabled/disabled:

| Permission | Description | Default for Admin | Default for Moderator |
|------------|-------------|-------------------|----------------------|
| `can_create_avisos` | Create and send notifications | ✅ | ✅ |
| `can_manage_users` | Manage user accounts | ✅ | ❌ |
| `can_manage_contents` | Manage product contents | ✅ | ❌ |
| `can_view_analytics` | View analytics and reports | ✅ | ✅ |

## Managing Admins

### Via Admin UI (`/admin/users`)

**Add New Admin:**
1. Click "Adicionar Admin"
2. Enter user's email (they must have an account)
3. Select role (Admin or Moderator)
4. Click "Adicionar"

**Deactivate Admin:**
- Click the status badge (Ativo/Inativo) to toggle
- Inactive admins cannot access any admin features

**Remove Admin:**
- Click the trash icon
- Confirm the deletion
- Note: Cannot remove super admins or yourself

### Via API

**List All Admins (Super Admin only):**
```bash
curl -X GET https://your-app.com/api/admin/users \
  -H "Cookie: session=..."
```

**Add New Admin:**
```bash
curl -X POST https://your-app.com/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "email": "newadmin@example.com",
    "role": "admin",
    "can_create_avisos": true,
    "can_manage_users": true,
    "can_manage_contents": true,
    "can_view_analytics": true
  }'
```

**Update Admin:**
```bash
curl -X PATCH https://your-app.com/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "admin_id": "uuid-here",
    "can_create_avisos": false,
    "is_active": false
  }'
```

**Remove Admin:**
```bash
curl -X DELETE "https://your-app.com/api/admin/users?admin_id=uuid-here" \
  -H "Cookie: session=..."
```

### Via SQL (Advanced)

**Add Admin:**
```sql
INSERT INTO admin_users (user_id, role, can_create_avisos)
VALUES ('user-uuid-here'::UUID, 'admin', true);
```

**Update Permissions:**
```sql
UPDATE admin_users
SET can_manage_users = false,
    can_manage_contents = false
WHERE user_id = 'user-uuid-here'::UUID;
```

**Deactivate Admin:**
```sql
UPDATE admin_users
SET is_active = false
WHERE user_id = 'user-uuid-here'::UUID;
```

**Remove Admin:**
```sql
DELETE FROM admin_users
WHERE user_id = 'user-uuid-here'::UUID;
```

## How It Works

### API Protection

All admin API routes now check permissions. Example from `/api/avisos/create`:

```typescript
async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('id, role, can_create_avisos, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  return !!(data && data.can_create_avisos)
}
```

### Database Functions

The migration creates helpful database functions:

**Check if user is admin:**
```sql
SELECT is_admin('user-uuid-here'::UUID);
-- Returns: true or false
```

**Check if user is super admin:**
```sql
SELECT is_super_admin('user-uuid-here'::UUID);
-- Returns: true or false
```

**Check specific permission:**
```sql
SELECT has_permission('user-uuid-here'::UUID, 'create_avisos');
-- Returns: true or false

-- Available permissions:
-- - 'create_avisos'
-- - 'manage_users'
-- - 'manage_contents'
-- - 'view_analytics'
```

### Row Level Security

The admin_users table has RLS policies:

- **Super admins** can view and manage all admin users
- **Regular admins** can only view their own record
- **Regular users** cannot access the table at all

## Adding More Permissions

If you need additional permissions in the future:

1. **Add column to table:**
```sql
ALTER TABLE admin_users
ADD COLUMN can_manage_orders BOOLEAN DEFAULT false;
```

2. **Update the has_permission function:**
```sql
-- Add new WHEN case
WHEN 'manage_orders' THEN
    SELECT can_manage_orders INTO has_perm
    FROM public.admin_users
    WHERE user_id = check_user_id AND is_active = true;
```

3. **Update API checks** to use the new permission

## Troubleshooting

### "403 Forbidden" when accessing admin pages

**Cause**: You're not in the admin_users table

**Solution**:
1. Check if you're in the table: `SELECT * FROM admin_users WHERE user_id = 'your-uuid';`
2. If not, add yourself following Step 2 above
3. Log out and log back in to refresh your session

### "User not found" when adding admin by email

**Cause**: The user doesn't have an account yet

**Solution**:
1. The user must register first
2. Or add them by user_id instead of email:
```bash
curl -X POST /api/admin/users \
  -d '{"user_id": "their-uuid-here", "role": "admin"}'
```

### Cannot remove an admin

**Cause**: Either it's a super admin or you're trying to remove yourself

**Solution**:
- Super admins can only be removed via SQL
- To remove yourself, have another super admin do it
- Or use SQL: `DELETE FROM admin_users WHERE user_id = 'your-uuid';`

### Admin can access page but API returns 403

**Cause**: Permissions mismatch

**Solution**:
Check the specific permission required:
```sql
SELECT * FROM admin_users WHERE user_id = 'your-uuid';
```
Update the permission:
```sql
UPDATE admin_users
SET can_create_avisos = true
WHERE user_id = 'your-uuid';
```

## Security Best Practices

1. **Always have at least 2 super admins** - in case one is locked out
2. **Regularly review admin users** - remove those who no longer need access
3. **Use least privilege** - give admins only the permissions they need
4. **Monitor admin actions** - review created_by fields in avisos table
5. **Rotate super admins** - periodically review who has super admin access
6. **Document admin changes** - use the notes field to track why someone was made admin

## Database Schema

```sql
admin_users (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id),
  role VARCHAR(50),  -- 'super_admin', 'admin', 'moderator'
  can_create_avisos BOOLEAN,
  can_manage_users BOOLEAN,
  can_manage_contents BOOLEAN,
  can_view_analytics BOOLEAN,
  notes TEXT,
  created_by UUID,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Files Created

- `supabase/migrations/add_admin_users_table.sql` - Database schema
- `app/api/admin/users/route.ts` - API for managing admins
- `app/admin/users/page.tsx` - Admin management UI
- `app/api/avisos/create/route.ts` - Updated to use admin table
- `docs/ADMIN_SYSTEM_SETUP.md` - This guide

## Next Steps

After setup:

1. ✅ Create your super admin account
2. ✅ Test accessing `/admin/avisos`
3. ✅ Test accessing `/admin/users`
4. ⬜ Add other admin users as needed
5. ⬜ Review and adjust permissions for each admin
6. ⬜ Document who has admin access and why

## Support

If you encounter issues:

1. Check database migration was applied: `SELECT * FROM admin_users LIMIT 1;`
2. Verify your user_id: `SELECT id FROM auth.users WHERE email = 'your-email';`
3. Check if you're an admin: `SELECT is_admin('your-uuid'::UUID);`
4. Review server logs for API errors
5. Check browser console for frontend errors

## Complete Example: Adding Your First Admin

```sql
-- Step 1: Find your user ID
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';
-- Result: id = '123e4567-e89b-12d3-a456-426614174000'

-- Step 2: Add yourself as super admin
INSERT INTO admin_users (user_id, role, can_create_avisos, can_manage_users, can_manage_contents, can_view_analytics)
VALUES ('123e4567-e89b-12d3-a456-426614174000'::UUID, 'super_admin', true, true, true, true);

-- Step 3: Verify
SELECT
  au.role,
  au.can_create_avisos,
  au.is_active,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.user_id = '123e4567-e89b-12d3-a456-426614174000'::UUID;

-- Step 4: Test functions
SELECT is_admin('123e4567-e89b-12d3-a456-426614174000'::UUID);  -- Should return: true
SELECT is_super_admin('123e4567-e89b-12d3-a456-426614174000'::UUID);  -- Should return: true
SELECT has_permission('123e4567-e89b-12d3-a456-426614174000'::UUID, 'create_avisos');  -- Should return: true
```

Now log out, log back in, and visit `/admin/avisos` - it should work!
