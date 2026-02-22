-- Migration: Add 'order_bump' as a valid status option
-- Purpose: Allow marking content as order bump using status column
-- Date: 2025-12-20

-- Drop existing constraint if exists
ALTER TABLE public.product_contents
DROP CONSTRAINT IF EXISTS product_contents_status_check;

-- Add new constraint with 'order_bump' option
ALTER TABLE public.product_contents
ADD CONSTRAINT product_contents_status_check
CHECK (status IN ('principal', 'bonus', 'order_bump'));

-- Add comment
COMMENT ON COLUMN public.product_contents.status IS 'Status do conteúdo: principal (produto principal), bonus (bônus incluído), order_bump (bônus pago separadamente)';

-- Update existing 'bonus' content from ORDERBUMP product_id to order_bump status (if needed)
-- Uncomment the line below if you want to migrate existing data
-- UPDATE public.product_contents SET status = 'order_bump' WHERE product_id ILIKE '%ORDERBUMP%' OR product_id ILIKE '%BUMP%';
