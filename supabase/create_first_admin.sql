-- Quick Fix: Create First Admin User
-- Run this script in Supabase SQL Editor to fix the foreign key and create your admin user

-- Step 1: Fix the foreign key constraint
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users_access(id) ON DELETE CASCADE;

-- Step 2: Create your first admin user
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

-- Step 3: Verify it worked
SELECT 
    au.*,
    ua.email
FROM public.admin_users au
JOIN public.users_access ua ON ua.id = au.user_id
WHERE au.user_id = 'd4771c9f-168c-450c-84d3-8f0c88c5166f'::UUID;
