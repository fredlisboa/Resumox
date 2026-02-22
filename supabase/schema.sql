-- HuskyApp MVP - Supabase Database Schema
-- Execute este script no SQL Editor do Supabase

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de usuários/clientes (customers)
CREATE TABLE IF NOT EXISTS public.users_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,

    -- Status da compra (active, refunded, cancelled, chargeback)
    status_compra VARCHAR(50) NOT NULL DEFAULT 'active',

    -- Dados da Hotmart
    hotmart_transaction_id VARCHAR(255) UNIQUE,
    hotmart_subscriber_code VARCHAR(255),
    product_id VARCHAR(255),
    product_name VARCHAR(255),

    -- Controle de acesso
    data_compra TIMESTAMP WITH TIME ZONE,
    data_expiracao TIMESTAMP WITH TIME ZONE,
    ultimo_acesso TIMESTAMP WITH TIME ZONE,

    -- Segurança anti-fraude
    ultimo_ip INET,
    ultimo_user_agent TEXT,
    tentativas_login INT DEFAULT 0,
    bloqueado_ate TIMESTAMP WITH TIME ZONE,

    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Índices para performance
    CONSTRAINT email_lowercase CHECK (email = LOWER(email))
);

-- Tabela de sessões ativas
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users_access(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,

    -- Dados da sessão
    ip_address INET NOT NULL,
    user_agent TEXT,
    location_country VARCHAR(10),
    location_city VARCHAR(100),

    -- Controle de sessão
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de log de tentativas de login (Rate Limiting)
CREATE TABLE IF NOT EXISTS public.login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    success BOOLEAN DEFAULT false,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT
);

-- Tabela de bloqueio por IP (Rate Limiting mais seguro)
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

-- Tabela de webhooks da Hotmart
CREATE TABLE IF NOT EXISTS public.hotmart_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    transaction_id VARCHAR(255),
    subscriber_email VARCHAR(255),

    -- Payload completo
    payload JSONB NOT NULL,

    -- Status do processamento
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conteúdos do produto
CREATE TABLE IF NOT EXISTS public.product_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(255) NOT NULL,

    -- Tipo de conteúdo (video, audio, pdf, text, image)
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- URLs e arquivos
    content_url TEXT,
    thumbnail_url TEXT,
    file_size BIGINT,
    duration INT, -- em segundos para audio/video

    -- Ordenação
    order_index INT DEFAULT 0,

    -- Status do conteúdo (principal ou bonus)
    status VARCHAR(20) DEFAULT 'principal' CHECK (status IN ('principal', 'bonus')),

    -- Metadata
    metadata JSONB,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users_access(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users_access(status_compra);
CREATE INDEX IF NOT EXISTS idx_users_hotmart_transaction ON public.users_access(hotmart_transaction_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON public.user_sessions(is_active);
-- Partial unique index to ensure only one active session per user
-- Allows multiple inactive sessions (is_active = false) for the same user
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_session_per_user ON public.user_sessions(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON public.login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_time ON public.login_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_ip ON public.ip_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_blocked ON public.ip_rate_limits(blocked_until);
CREATE INDEX IF NOT EXISTS idx_webhooks_transaction ON public.hotmart_webhooks(transaction_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_processed ON public.hotmart_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_contents_product ON public.product_contents(product_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_access_updated_at BEFORE UPDATE ON public.users_access
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_contents_updated_at BEFORE UPDATE ON public.product_contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_rate_limits_updated_at BEFORE UPDATE ON public.ip_rate_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para limpar tentativas de login antigas (executar via cron)
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

-- Função para desativar sessões expiradas
CREATE OR REPLACE FUNCTION deactivate_expired_sessions()
RETURNS void AS $$
BEGIN
    UPDATE public.user_sessions
    SET is_active = false
    WHERE expires_at < NOW() AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE public.users_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_contents ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON public.users_access
    FOR SELECT
    USING (auth.jwt() ->> 'email' = email);

-- Policy: Conteúdos são públicos para usuários autenticados
CREATE POLICY "Authenticated users can view contents" ON public.product_contents
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Dados de exemplo (opcional - remover em produção)
-- INSERT INTO public.product_contents (product_id, content_type, title, description, content_url, order_index) VALUES
-- ('PRODUCT_001', 'video', 'Aula 1: Introdução', 'Bem-vindo ao curso', 'https://exemplo.com/video1.mp4', 1),
-- ('PRODUCT_001', 'pdf', 'Material Complementar', 'PDF com exercícios', 'https://exemplo.com/material.pdf', 2),
-- ('PRODUCT_001', 'audio', 'Meditação Guiada', 'Áudio de 15 minutos', 'https://exemplo.com/audio1.mp3', 3);

-- Comentários explicativos
COMMENT ON TABLE public.users_access IS 'Armazena dados de clientes autorizados via Hotmart';
COMMENT ON TABLE public.user_sessions IS 'Sessões ativas para controle anti-fraude';
COMMENT ON TABLE public.login_attempts IS 'Log de tentativas de login para rate limiting';
COMMENT ON TABLE public.ip_rate_limits IS 'Rate limiting baseado em IP para segurança aprimorada';
COMMENT ON TABLE public.hotmart_webhooks IS 'Histórico de webhooks recebidos da Hotmart';
COMMENT ON TABLE public.product_contents IS 'Conteúdos dos produtos (vídeos, PDFs, áudios)';
