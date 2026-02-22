# Aviso Creation Error Fix

## Problem Description
When trying to create an aviso through the admin interface at `/admin/avisos`, users were getting the error "Erro ao criar aviso" without any additional details in the console.

## Root Cause Analysis
After examining the code, I identified two main issues:

1. **Missing Required Field**: The `avisos` table in the database requires an `is_active` field (default: true), but this field was not being included in the insert operation in `app/api/avisos/create/route.ts`.

2. **Foreign Key Constraint Violation**: The `created_by` field in the `avisos` table references `auth.users(id)`, but the authentication system uses `users_access` table. The `user.id` returned by `getSessionFromCookie()` comes from the `users_access` table, not `auth.users`, causing a foreign key constraint violation.

3. **Error Handling**: The original error handling was not returning the specific Supabase error message, making debugging difficult.

## Solution Implemented

### 1. Added Missing `is_active` Field
```typescript
// Added to the insert payload:
is_active: true
```

### 2. Improved Array Handling
```typescript
// Changed from:
target_user_ids: target_user_ids || null,
target_product_ids: target_product_ids || null,

// To:
target_user_ids: target_user_ids && target_user_ids.length > 0 ? target_user_ids : null,
target_product_ids: target_product_ids && target_product_ids.length > 0 ? target_product_ids : null,
```

This ensures empty arrays are converted to `null` rather than being passed as empty arrays.

### 3. Enhanced Error Logging
```typescript
console.error('Error creating aviso:', {
  error: insertError,
  payload: {
    // ... full payload for debugging
  }
})

// And improved error response:
return NextResponse.json(
  { error: insertError.message || 'Erro ao criar aviso' },
  { status: 500 }
)
```

## Files Modified
- `app/api/avisos/create/route.ts` - Fixed the aviso creation endpoint
- `supabase/migrations/fix_avisos_foreign_key.sql` - Created migration to fix foreign key constraint

## Database Migration Required

To fully resolve the foreign key constraint issue, you need to run the following migration:

```sql
-- Run this in your Supabase SQL editor:
ALTER TABLE public.avisos DROP CONSTRAINT IF EXISTS avisos_created_by_fkey;

ALTER TABLE public.avisos
ADD CONSTRAINT avisos_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.users_access(id);
```

## Testing
The fix should now allow avisos to be created successfully. The main changes ensure:

1. All required database fields are provided
2. Empty arrays are properly handled
3. Better error messages are returned for debugging
4. Foreign key constraints are properly aligned with the authentication system

## Steps to Apply the Fix

1. **Apply the database migration**: Run the SQL in `supabase/migrations/fix_avisos_foreign_key.sql` in your Supabase SQL editor
2. **Test the API**: Try creating an aviso through the admin interface
3. **Check server logs**: Monitor for any remaining errors
4. **Verify data integrity**: Ensure existing avisos are not affected

## Additional Recommendations

1. **Check Admin Permissions**: Ensure the user creating the aviso has the `can_create_avisos` permission set to `true` in the `admin_users` table.

2. **Verify Database Schema**: Make sure the `avisos` table schema matches what's defined in `supabase/migrations/add_avisos_system.sql`.

3. **Test with Different Scenarios**:
   - Creating avisos with no targeting (send to all users)
   - Creating avisos with specific user targeting
   - Creating avisos with product targeting
   - Creating scheduled vs immediate avisos

4. **Monitor Server Logs**: Check the server logs for the detailed error messages that are now being logged when creation fails.

## Common Issues to Check

1. **Authentication**: Ensure the user is properly authenticated and has admin permissions
2. **Database Connectivity**: Verify Supabase connection is working
3. **Field Validation**: Check that all required fields (title, short_notification, full_content) are provided
4. **Data Types**: Ensure data types match database expectations (e.g., arrays for targeting fields)
