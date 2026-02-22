-- Migration: Add IP-based Rate Limiting
-- Description: Adds a new table for IP-based rate limiting to enhance security
-- Run this in Supabase SQL Editor

-- Create the IP rate limits table
CREATE TABLE IF NOT EXISTS public.ip_rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    blocked_until TIMESTAMP WITH TIME ZONE,
    blocked_reason VARCHAR(255), -- 'too_many_attempts', 'suspicious_activity'
    attempt_count INT DEFAULT 0,
    unique_emails_attempted INT DEFAULT 0,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_ip_rate_limit UNIQUE(ip_address)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_ip ON public.ip_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_blocked ON public.ip_rate_limits(blocked_until);

-- Add trigger for updated_at
CREATE TRIGGER update_ip_rate_limits_updated_at BEFORE UPDATE ON public.ip_rate_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update cleanup function to include IP rate limits
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
    DELETE FROM public.login_attempts
    WHERE attempted_at < NOW() - INTERVAL '24 hours';

    -- Limpar bloqueios de IP expirados
    DELETE FROM public.ip_rate_limits
    WHERE blocked_until IS NOT NULL
    AND blocked_until < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Add table comment
COMMENT ON TABLE public.ip_rate_limits IS 'Rate limiting baseado em IP para segurança aprimorada';
