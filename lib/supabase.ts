import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Tipos do banco de dados
export type Database = {
  public: {
    Tables: {
      users_access: {
        Row: {
          id: string
          email: string
          status_compra: 'active' | 'refunded' | 'cancelled' | 'chargeback'
          hotmart_transaction_id: string | null
          hotmart_subscriber_code: string | null
          product_id: string | null
          product_name: string | null
          data_compra: string | null
          data_expiracao: string | null
          ultimo_acesso: string | null
          ultimo_ip: string | null
          ultimo_user_agent: string | null
          tentativas_login: number
          bloqueado_ate: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users_access']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users_access']['Insert']>
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          ip_address: string
          user_agent: string | null
          location_country: string | null
          location_city: string | null
          expires_at: string
          last_activity: string
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_sessions']['Insert']>
      }
      login_attempts: {
        Row: {
          id: string
          email: string
          ip_address: string
          success: boolean
          attempted_at: string
          user_agent: string | null
        }
        Insert: Omit<Database['public']['Tables']['login_attempts']['Row'], 'id' | 'attempted_at'>
        Update: Partial<Database['public']['Tables']['login_attempts']['Insert']>
      }
      product_contents: {
        Row: {
          id: string
          product_id: string
          content_type: 'video' | 'audio' | 'pdf' | 'text' | 'image'
          title: string
          description: string | null
          content_url: string | null
          thumbnail_url: string | null
          file_size: number | null
          duration: number | null
          order_index: number
          metadata: Record<string, any> | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_contents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['product_contents']['Insert']>
      }
      hotmart_webhooks: {
        Row: {
          id: string
          event_type: string
          transaction_id: string | null
          subscriber_email: string | null
          payload: Record<string, any>
          processed: boolean
          processed_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['hotmart_webhooks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['hotmart_webhooks']['Insert']>
      }
      user_products: {
        Row: {
          id: string
          user_id: string
          product_id: string
          product_name: string | null
          hotmart_transaction_id: string
          status: 'active' | 'refunded' | 'cancelled' | 'chargeback'
          is_order_bump: boolean
          parent_transaction_id: string | null
          purchase_date: string | null
          expiration_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_products']['Insert']>
      }
    }
  }
}

// Use placeholder values during build if env vars are not available
// Supabase requires valid URL format even at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTE5MjgwMCwiZXhwIjoxOTYwNzY4ODAwfQ.placeholder'

// Cliente para uso no servidor (com service role)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Cliente para uso no navegador
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
