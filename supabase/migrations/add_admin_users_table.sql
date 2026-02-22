-- Migration: Add Admin Users Table
-- Description: Creates a table to manage admin users with roles and permissions
-- Created: 2025-12-21

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for storing admin users
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Admin role/level
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),

    -- Permissions
    can_create_avisos BOOLEAN DEFAULT true,
    can_manage_users BOOLEAN DEFAULT false,
    can_manage_contents BOOLEAN DEFAULT false,
    can_view_analytics BOOLEAN DEFAULT true,

    -- Additional info
    notes TEXT,

    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_users_updated_at_trigger
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_users_updated_at();

-- Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only super admins can view all admin users
CREATE POLICY "Super admins can view all admin users"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

-- Admins can view their own record
CREATE POLICY "Admins can view their own record"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Only super admins can insert/update/delete admin users
CREATE POLICY "Super admins can manage admin users"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role = 'super_admin'
            AND is_active = true
        )
    );

-- Function to check if a user is an admin
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

-- Function to check if a user is a super admin
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

-- Function to check if user has specific permission
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

-- Comment on table
COMMENT ON TABLE public.admin_users IS 'Stores admin users with roles and permissions';

-- Comment on columns
COMMENT ON COLUMN public.admin_users.role IS 'Admin role: super_admin (full access), admin (standard), moderator (limited)';
COMMENT ON COLUMN public.admin_users.can_create_avisos IS 'Permission to create and send notifications';
COMMENT ON COLUMN public.admin_users.can_manage_users IS 'Permission to manage user accounts';
COMMENT ON COLUMN public.admin_users.can_manage_contents IS 'Permission to manage product contents';
COMMENT ON COLUMN public.admin_users.can_view_analytics IS 'Permission to view analytics and reports';

-- Example: Insert first super admin (replace with your user ID)
-- IMPORTANT: You need to get your user ID from auth.users table first
-- Run this query to get your user ID: SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
-- Then uncomment and update the INSERT below with your actual UUID

-- INSERT INTO public.admin_users (user_id, role, can_create_avisos, can_manage_users, can_manage_contents, can_view_analytics, notes)
-- VALUES (
--     'YOUR-USER-UUID-HERE'::UUID,
--     'super_admin',
--     true,
--     true,
--     true,
--     true,
--     'First super admin - created during migration'
-- );
