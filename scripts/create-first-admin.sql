-- Create First Admin User
-- This script creates the first super admin user for the system
-- Run this in the Supabase SQL Editor

-- Check if user already exists in admin_users table
SELECT id, user_id, role, is_active
FROM public.admin_users
WHERE user_id = 'd4771c9f-168c-450c-84d3-8f0c88c5166f';

-- If the above query returns no results, run this INSERT statement:
INSERT INTO public.admin_users (
    user_id,
    role,
    can_create_avisos,
    can_manage_users,
    can_manage_contents,
    can_view_analytics,
    is_active,
    notes,
    created_by
)
VALUES (
    'd4771c9f-168c-450c-84d3-8f0c88c5166f'::UUID,
    'super_admin',
    true,
    true,
    true,
    true,
    true,
    'First admin user created via SQL script',
    'd4771c9f-168c-450c-84d3-8f0c88c5166f'::UUID
)
ON CONFLICT (user_id) DO NOTHING;

-- Verify the admin user was created
SELECT
    id,
    user_id,
    role,
    can_create_avisos,
    can_manage_users,
    can_manage_contents,
    can_view_analytics,
    is_active,
    notes,
    created_at,
    updated_at
FROM public.admin_users
WHERE user_id = 'd4771c9f-168c-450c-84d3-8f0c88c5166f';
