-- Migration: Add Cakto webhook support
-- This migration adds tables and columns needed for Cakto integration

-- 1. Create cakto_webhooks table for audit logging
CREATE TABLE IF NOT EXISTS cakto_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL,
  ref_id VARCHAR(100),
  subscriber_email VARCHAR(255),
  product_id VARCHAR(255),
  offer_id VARCHAR(255),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying by transaction
CREATE INDEX IF NOT EXISTS idx_cakto_webhooks_transaction_id ON cakto_webhooks(transaction_id);

-- Index for querying by email
CREATE INDEX IF NOT EXISTS idx_cakto_webhooks_email ON cakto_webhooks(subscriber_email);

-- Index for querying unprocessed webhooks
CREATE INDEX IF NOT EXISTS idx_cakto_webhooks_processed ON cakto_webhooks(processed) WHERE processed = FALSE;

-- 2. Add Cakto columns to users_access table
ALTER TABLE users_access
ADD COLUMN IF NOT EXISTS cakto_transaction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS cakto_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS nome VARCHAR(255);

-- Index for Cakto transaction lookups
CREATE INDEX IF NOT EXISTS idx_users_access_cakto_transaction ON users_access(cakto_transaction_id);

-- 3. Add Cakto column to user_products table
ALTER TABLE user_products
ADD COLUMN IF NOT EXISTS cakto_transaction_id VARCHAR(255);

-- Index for Cakto transaction lookups in user_products
CREATE INDEX IF NOT EXISTS idx_user_products_cakto_transaction ON user_products(cakto_transaction_id);

-- Comment for documentation
COMMENT ON TABLE cakto_webhooks IS 'Audit log for all Cakto webhook events';
COMMENT ON COLUMN users_access.cakto_transaction_id IS 'Transaction ID from Cakto purchases';
COMMENT ON COLUMN users_access.cakto_subscription_id IS 'Subscription ID for Cakto recurring purchases';
COMMENT ON COLUMN user_products.cakto_transaction_id IS 'Transaction ID from Cakto for this specific product';
