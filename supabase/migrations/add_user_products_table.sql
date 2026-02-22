-- Migration: Add user_products table to track individual product purchases
-- Purpose: Support Order Bumps - each product (main + bumps) needs individual tracking
-- Date: 2025-12-19

-- Create user_products table to track each product purchased by a user
CREATE TABLE IF NOT EXISTS public.user_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users_access(id) ON DELETE CASCADE,

    -- Product information
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,

    -- Transaction information
    hotmart_transaction_id VARCHAR(255) NOT NULL,

    -- Order Bump tracking
    is_order_bump BOOLEAN DEFAULT false,
    parent_transaction_id VARCHAR(255), -- Reference to main product transaction if this is an order bump

    -- Purchase status
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, refunded, cancelled, chargeback

    -- Dates
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expiration_date TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_user_product_transaction UNIQUE(user_id, product_id, hotmart_transaction_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_products_user_id ON public.user_products(user_id);
CREATE INDEX IF NOT EXISTS idx_user_products_product_id ON public.user_products(product_id);
CREATE INDEX IF NOT EXISTS idx_user_products_transaction ON public.user_products(hotmart_transaction_id);
CREATE INDEX IF NOT EXISTS idx_user_products_status ON public.user_products(status);
CREATE INDEX IF NOT EXISTS idx_user_products_parent_transaction ON public.user_products(parent_transaction_id);

-- Composite index for quick access checks
CREATE INDEX IF NOT EXISTS idx_user_products_user_product_status ON public.user_products(user_id, product_id, status);

-- Trigger to update updated_at automatically
CREATE TRIGGER update_user_products_updated_at
    BEFORE UPDATE ON public.user_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policy
ALTER TABLE public.user_products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own products
CREATE POLICY "Users can view own products" ON public.user_products
    FOR SELECT
    USING (auth.jwt() ->> 'email' IN (
        SELECT email FROM public.users_access WHERE id = user_products.user_id
    ));

-- Comments
COMMENT ON TABLE public.user_products IS 'Tracks individual product purchases including order bumps';
COMMENT ON COLUMN public.user_products.is_order_bump IS 'Indicates if this product was purchased as an order bump';
COMMENT ON COLUMN public.user_products.parent_transaction_id IS 'Transaction ID of the main product if this is an order bump';
