-- Migration: Add Avisos (Notifications) System
-- Description: Creates tables and infrastructure for push notifications and notification history
-- Created: 2025-12-21

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for storing notifications/avisos
CREATE TABLE IF NOT EXISTS public.avisos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Notification metadata
    title VARCHAR(255) NOT NULL,

    -- Short notification for mobile push (HTML allowed for formatting)
    short_notification TEXT NOT NULL,

    -- Full notification content (HTML allowed for rich formatting)
    full_content TEXT NOT NULL,

    -- Notification type/category for filtering
    notification_type VARCHAR(50) DEFAULT 'general' CHECK (notification_type IN ('general', 'announcement', 'update', 'urgent', 'event', 'promocion')),

    -- Priority level
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,

    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),

    -- Targeting (null = send to all users)
    target_user_ids UUID[],  -- Array of specific user IDs to send to
    target_product_ids VARCHAR(255)[],  -- Send to users with specific products

    -- Analytics
    total_recipients INT DEFAULT 0,
    total_sent INT DEFAULT 0,
    total_read INT DEFAULT 0,
    total_clicked INT DEFAULT 0,

    -- Push notification data
    push_notification_sent BOOLEAN DEFAULT false,
    push_notification_payload JSONB,  -- Store FCM/APNS payload

    -- Optional image/media
    image_url TEXT,
    thumbnail_url TEXT,

    -- Call to action
    cta_text VARCHAR(100),  -- e.g., "Ver más", "Abrir", "Comprar ahora"
    cta_url TEXT,  -- Link for the action button

    -- Additional metadata
    metadata JSONB,

    -- Audit fields
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for tracking individual user notification reads
CREATE TABLE IF NOT EXISTS public.aviso_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aviso_id UUID NOT NULL REFERENCES public.avisos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Read status
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP WITH TIME ZONE,

    -- Device info (optional, for analytics)
    device_type VARCHAR(50),  -- 'web', 'ios', 'android'

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one read per user per notification
    UNIQUE(aviso_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_avisos_status ON public.avisos(status);
CREATE INDEX IF NOT EXISTS idx_avisos_scheduled_for ON public.avisos(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_avisos_sent_at ON public.avisos(sent_at);
CREATE INDEX IF NOT EXISTS idx_avisos_created_at ON public.avisos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avisos_notification_type ON public.avisos(notification_type);
CREATE INDEX IF NOT EXISTS idx_avisos_priority ON public.avisos(priority);
CREATE INDEX IF NOT EXISTS idx_aviso_reads_user_id ON public.aviso_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_aviso_reads_aviso_id ON public.aviso_reads(aviso_id);
CREATE INDEX IF NOT EXISTS idx_aviso_reads_read_at ON public.aviso_reads(read_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_avisos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER avisos_updated_at_trigger
    BEFORE UPDATE ON public.avisos
    FOR EACH ROW
    EXECUTE FUNCTION update_avisos_updated_at();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aviso_reads ENABLE ROW LEVEL SECURITY;

-- Avisos policies
-- All authenticated users can read sent notifications
CREATE POLICY "Users can view sent notifications"
    ON public.avisos
    FOR SELECT
    TO authenticated
    USING (status = 'sent' AND is_active = true);

-- Only admins can insert/update/delete notifications
-- Note: You'll need to implement admin role checking based on your auth system
CREATE POLICY "Admins can manage notifications"
    ON public.avisos
    FOR ALL
    TO authenticated
    USING (
        -- Replace this with your admin check logic
        -- For now, allowing all authenticated users for testing
        -- In production, check user role from user_metadata or a separate admin table
        true
    );

-- Aviso reads policies
-- Users can only read their own read records
CREATE POLICY "Users can view their own read records"
    ON public.aviso_reads
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can create their own read records
CREATE POLICY "Users can mark notifications as read"
    ON public.aviso_reads
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own read records
CREATE POLICY "Users can update their read records"
    ON public.aviso_reads
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Comment on tables
COMMENT ON TABLE public.avisos IS 'Stores system notifications and push notifications';
COMMENT ON TABLE public.aviso_reads IS 'Tracks which users have read which notifications';

-- Comment on important columns
COMMENT ON COLUMN public.avisos.short_notification IS 'Short HTML text for mobile push notifications (recommended max 150 chars)';
COMMENT ON COLUMN public.avisos.full_content IS 'Full HTML content for detailed notification view';
COMMENT ON COLUMN public.avisos.target_user_ids IS 'Array of user IDs to send to (null = all users)';
COMMENT ON COLUMN public.avisos.target_product_ids IS 'Array of product IDs - sends to users owning these products';
COMMENT ON COLUMN public.avisos.push_notification_payload IS 'Stores the Firebase Cloud Messaging or Apple Push Notification Service payload';
