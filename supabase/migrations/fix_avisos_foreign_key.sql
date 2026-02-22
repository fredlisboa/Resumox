-- Migration: Fix Avisos Foreign Key Constraint
-- Description: Updates avisos table to reference users_access instead of auth.users
-- Created: 2025-12-21

-- First, drop the existing foreign key constraint
ALTER TABLE public.avisos DROP CONSTRAINT IF EXISTS avisos_created_by_fkey;

-- Add new foreign key constraint to users_access table
ALTER TABLE public.avisos
ADD CONSTRAINT avisos_created_by_fkey
FOREIGN KEY (created_by) REFERENCES public.users_access(id);

-- Update any existing avisos that might have invalid created_by values
-- This ensures data integrity after the constraint change
UPDATE public.avisos
SET created_by = NULL
WHERE created_by IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM public.users_access ua
    WHERE ua.id = avisos.created_by
);

-- Comment explaining the change
COMMENT ON CONSTRAINT avisos_created_by_fkey ON public.avisos
IS 'Foreign key constraint updated to reference users_access table instead of auth.users for consistency with the authentication system';
