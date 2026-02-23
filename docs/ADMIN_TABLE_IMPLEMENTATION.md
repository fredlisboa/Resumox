# Admin Users Table - Implementation Summary

## What Was Implemented

A complete admin management system with database table, API endpoints, UI, and permission checks.

## Files Created

### Database Migration
✅ **`supabase/migrations/add_admin_users_table.sql`**
- Creates `admin_users` table
- 3 admin roles: super_admin, admin, moderator
- 4 granular permissions
- Row Level Security policies
- Helper database functions (`is_admin`, `is_super_admin`, `has_permission`)
- Automatic timestamps with triggers

### API Routes
✅ **`app/api/admin/users/route.ts`**
- `GET` - List all admins (super admin only)
- `POST` - Add new admin by email or user_id
- `PATCH` - Update admin permissions/status
- `DELETE` - Remove admin (cannot remove self or super admins)
- All endpoints check super_admin permission

### Admin UI
✅ **`app/admin/users/page.tsx`**
- Table view of all admins
- Add new admin modal
- Toggle active/inactive status
- Delete admin functionality
- Permission badges
- Role badges with colors
- Access restricted to super admins

### Updated Files
✅ **`app/api/avisos/create/route.ts`**
- Updated `isAdmin()` function (lines 7-18)
- Now queries `admin_users` table
- Checks `can_create_avisos` permission
- Checks `is_active` status

### Documentation
✅ **`docs/ADMIN_SYSTEM_SETUP.md`** - Complete setup guide (26 KB)
✅ **`ADMIN_QUICK_START.md`** - Quick reference (4 KB)
✅ **`ADMIN_TABLE_IMPLEMENTATION.md`** - This summary

## Database Schema

```sql
admin_users (
    id UUID PRIMARY KEY,
    user_id UUID UNIQUE,              -- Links to auth.users
    role VARCHAR(50),                 -- super_admin, admin, moderator
    can_create_avisos BOOLEAN,        -- Permission: create notifications
    can_manage_users BOOLEAN,         -- Permission: manage users
    can_manage_contents BOOLEAN,      -- Permission: manage content
    can_view_analytics BOOLEAN,       -- Permission: view analytics
    notes TEXT,                       -- Admin notes
    created_by UUID,                  -- Who created this admin
    is_active BOOLEAN,                -- Active status
    created_at TIMESTAMP,             -- Auto-set
    updated_at TIMESTAMP              -- Auto-updated
)
```

## Admin Roles

| Role | Description | Can Manage Admins |
|------|-------------|------------------|
| **super_admin** | Full access, cannot be deactivated via UI | ✅ Yes |
| **admin** | Standard admin access | ❌ No |
| **moderator** | Limited access | ❌ No |

## Permissions

| Permission | Description | Default Admin | Default Moderator |
|------------|-------------|---------------|-------------------|
| `can_create_avisos` | Create/send notifications | ✅ | ✅ |
| `can_manage_users` | Manage user accounts | ✅ | ❌ |
| `can_manage_contents` | Manage product content | ✅ | ❌ |
| `can_view_analytics` | View analytics/reports | ✅ | ✅ |

## Setup Process

### Step 1: Apply Migration
```bash
# Via Supabase SQL Editor: Copy/paste the migration file and run
# Or via CLI: supabase db push
```

### Step 2: Get Your User ID
```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

### Step 3: Create Super Admin
```sql
INSERT INTO admin_users (user_id, role, can_create_avisos, can_manage_users, can_manage_contents, can_view_analytics)
VALUES ('YOUR-UUID-HERE'::UUID, 'super_admin', true, true, true, true);
```

### Step 4: Test
1. Log out and log back in
2. Visit `/admin/avisos` - should work
3. Visit `/admin/users` - should see yourself listed

## API Endpoints

### GET `/api/admin/users`
List all admins (super admin only)

**Response:**
```json
{
  "success": true,
  "admins": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "email": "admin@example.com",
      "role": "super_admin",
      "can_create_avisos": true,
      "can_manage_users": true,
      "can_manage_contents": true,
      "can_view_analytics": true,
      "is_active": true,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### POST `/api/admin/users`
Add new admin (super admin only)

**Request:**
```json
{
  "email": "newadmin@example.com",
  "role": "admin",
  "can_create_avisos": true,
  "can_manage_users": true,
  "can_manage_contents": true,
  "can_view_analytics": true
}
```

### PATCH `/api/admin/users`
Update admin (super admin only)

**Request:**
```json
{
  "admin_id": "uuid",
  "can_create_avisos": false,
  "is_active": false
}
```

### DELETE `/api/admin/users?admin_id=uuid`
Remove admin (super admin only)

## Database Functions

### `is_admin(user_id UUID)`
Returns true if user is an active admin

```sql
SELECT is_admin('user-uuid-here'::UUID);
-- Returns: true or false
```

### `is_super_admin(user_id UUID)`
Returns true if user is an active super admin

```sql
SELECT is_super_admin('user-uuid-here'::UUID);
-- Returns: true or false
```

### `has_permission(user_id UUID, permission TEXT)`
Returns true if user has specific permission

```sql
SELECT has_permission('user-uuid-here'::UUID, 'create_avisos');
-- Returns: true or false

-- Available permissions:
-- 'create_avisos', 'manage_users', 'manage_contents', 'view_analytics'
```

## Security Features

### Row Level Security (RLS)
- Enabled on `admin_users` table
- Super admins can view/manage all admins
- Regular admins can only view their own record
- Non-admins cannot access the table

### API Protection
- All endpoints check authentication
- Super admin endpoints verify role
- Permission-specific checks for each operation
- Cannot remove self or super admins

### Database Constraints
- `user_id` must be unique
- `role` must be valid enum value
- Foreign key to `auth.users` (cascading delete)
- Auto-updated timestamps

## UI Features

### Admin List Page (`/admin/users`)
- Table view with all admin users
- Email addresses (fetched from auth)
- Role badges with colors:
  - Purple: Super Admin
  - Blue: Admin
  - Green: Moderator
- Permission chips showing enabled permissions
- Active/Inactive status toggle
- Delete button (except for super admins)

### Add Admin Modal
- Email input (auto-finds user_id)
- Role selector (Admin or Moderator)
- Automatic permission defaults
- Form validation
- Success/error feedback

## How It Works

### Previous Behavior (Before Admin Table)

```typescript
// Old code in app/api/avisos/create/route.ts
async function isAdmin(userId: string): Promise<boolean> {
  return true  // Everyone was admin!
}
```

### New Behavior (With Admin Table)

```typescript
// New code in app/api/avisos/create/route.ts
async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('id, role, can_create_avisos, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  // Must be in admin_users table, active, and have permission
  return !!(data && data.can_create_avisos)
}
```

Now:
- Only users in `admin_users` table can access admin features
- Must have `is_active = true`
- Must have specific permission for the operation
- All enforced at database and API level

## Common Operations

### Add Admin via SQL
```sql
INSERT INTO admin_users (user_id, role, can_create_avisos, can_manage_users, can_manage_contents, can_view_analytics)
VALUES ('user-uuid'::UUID, 'admin', true, true, true, true);
```

### Update Permissions
```sql
UPDATE admin_users
SET can_manage_users = false,
    can_manage_contents = false
WHERE user_id = 'user-uuid'::UUID;
```

### Deactivate Admin
```sql
UPDATE admin_users
SET is_active = false
WHERE user_id = 'user-uuid'::UUID;
```

### Remove Admin
```sql
DELETE FROM admin_users
WHERE user_id = 'user-uuid'::UUID;
```

### List All Admins
```sql
SELECT
  au.role,
  au.can_create_avisos,
  au.can_manage_users,
  au.can_manage_contents,
  au.can_view_analytics,
  au.is_active,
  u.email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;
```

## TypeScript Types

```typescript
interface AdminUser {
  id: string
  user_id: string
  email: string | null
  role: 'super_admin' | 'admin' | 'moderator'
  can_create_avisos: boolean
  can_manage_users: boolean
  can_manage_contents: boolean
  can_view_analytics: boolean
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}
```

## Testing Checklist

- [ ] Migration applied successfully
- [ ] Super admin created
- [ ] Can access `/admin/avisos`
- [ ] Can access `/admin/users`
- [ ] Can add new admin via UI
- [ ] Can toggle admin status
- [ ] Can delete admin
- [ ] Non-admin users get 403
- [ ] Inactive admins cannot access features
- [ ] Database functions work correctly

## Rollback

If you need to remove the admin system:

```sql
-- Remove table
DROP TABLE IF EXISTS admin_users CASCADE;

-- Remove functions
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_super_admin(UUID);
DROP FUNCTION IF EXISTS has_permission(UUID, TEXT);
DROP FUNCTION IF EXISTS update_admin_users_updated_at();
```

Then revert the `isAdmin()` function in `app/api/avisos/create/route.ts` to return `true`.

## Future Enhancements

Possible additions:
- [ ] Audit log for admin actions
- [ ] Email notifications when admin added/removed
- [ ] Admin activity dashboard
- [ ] Role inheritance (admin inherits moderator permissions)
- [ ] Custom permission creation
- [ ] Time-limited admin access (expires_at field)
- [ ] Multi-factor authentication requirement for admins

## Integration Points

This admin system can be extended to protect:
- Content management endpoints
- User management endpoints
- Analytics endpoints
- Any future admin features

Just add the permission check to your API routes:

```typescript
import { supabaseAdmin } from '@/lib/supabase'

async function checkPermission(userId: string, permission: string) {
  const { data } = await (supabaseAdmin
    .from('admin_users') as any)
    .select('id')
    .eq('user_id', userId)
    .eq(`can_${permission}`, true)
    .eq('is_active', true)
    .single()

  return !!data
}
```

## Summary

✅ **Complete admin management system**
✅ **Database table with RLS**
✅ **Admin management UI**
✅ **API for CRUD operations**
✅ **Permission-based access control**
✅ **TypeScript type safety**
✅ **Comprehensive documentation**

The avisos creation endpoint now properly checks if users are admins using the `admin_users` table!
