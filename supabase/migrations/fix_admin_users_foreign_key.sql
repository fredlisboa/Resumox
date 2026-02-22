-- Migration: Fix Admin Users Foreign Key Constraint
-- Description: Updates admin_users table to reference users_access instead of auth.users
-- Created: 2025-12-21

-- First, drop the existing foreign key constraint
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

-- Drop the created_by constraint as well
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_created_by_fkey;

-- Add new foreign key constraints to users_access table
ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users_access(id) ON DELETE CASCADE;

ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.users_access(id);

-- Update the RLS policies to work with users_access
-- Drop existing policies
DROP POLICY IF EXISTS "Super admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view their own record" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Recreate policies with updated logic
CREATE POLICY "Super admins can view all admin users"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            JOIN public.users_access ua ON ua.id = au.user_id
            WHERE ua.email = auth.jwt() ->> 'email'
            AND au.role = 'super_admin'
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can view their own record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users_access ua
            WHERE ua.id = user_id
            AND ua.email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Super admins can manage admin users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au
            JOIN public.users_access ua ON ua.id = au.user_id
            WHERE ua.email = auth.jwt() ->> 'email'
            AND au.role = 'super_admin'
            AND au.is_active = true
        )
    );

-- Update the helper functions to work with users_access
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS is_super_admin(UUID);
DROP FUNCTION IF EXISTS has_permission(UUID, TEXT);

-- Recreate functions
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = check_user_id
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = check_user_id
        AND role = 'super_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_permission(check_user_id UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    CASE permission_name
        WHEN 'create_avisos' THEN
            SELECT can_create_avisos INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        WHEN 'manage_users' THEN
            SELECT can_manage_users INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        WHEN 'manage_contents' THEN
            SELECT can_manage_contents INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        WHEN 'view_analytics' THEN
            SELECT can_view_analytics INTO has_perm
            FROM public.admin_users
            WHERE user_id = check_user_id AND is_active = true;
        ELSE
            has_perm := false;
    END CASE;

    RETURN COALESCE(has_perm, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now you can create your first admin user
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

-- Verify the admin user was created
SELECT 
    au.*,
    ua.email
FROM public.admin_users au
JOIN public.users_access ua ON ua.id = au.user_id
WHERE au.user_id = 'd4771c9f-168c-450c-84d3-8f0c88c5166f'::UUID;
