-- Migration: Add html_content column to product_contents table
-- Purpose: Support HTML orientation items between course content
-- Date: 2025-12-19

-- Add the html_content column
ALTER TABLE public.product_contents
ADD COLUMN IF NOT EXISTS html_content TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.product_contents.html_content IS 'HTML content for orientation/guidance items displayed between course content';

-- Update content_type check constraint if it exists, or create it
-- First, drop the constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'product_contents_content_type_check'
    ) THEN
        ALTER TABLE public.product_contents
        DROP CONSTRAINT product_contents_content_type_check;
    END IF;
END $$;

-- Add the updated constraint including 'html_orientation'
ALTER TABLE public.product_contents
ADD CONSTRAINT product_contents_content_type_check
CHECK (content_type IN ('video', 'audio', 'pdf', 'text', 'image', 'html_orientation'));

-- Ensure html_content is nullable (it should be by default, but let's be explicit)
ALTER TABLE public.product_contents
ALTER COLUMN html_content DROP NOT NULL;
