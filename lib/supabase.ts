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
      // ── Resumox tables ──
      resumox_books: {
        Row: {
          id: string
          slug: string
          title: string
          original_title: string | null
          author: string
          year: number | null
          category_slug: string
          category_label: string
          category_emoji: string
          reading_time_min: number
          audio_duration_min: number | null
          audio_r2_key: string | null
          pdf_r2_key: string | null
          mindmap_image_r2_key: string | null
          cover_gradient_from: string
          cover_gradient_to: string
          rating_avg: number
          rating_count: number
          is_featured: boolean
          is_published: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_books']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['resumox_books']['Insert']>
      }
      resumox_book_content: {
        Row: {
          id: string
          book_id: string
          summary_html: string
          mindmap_json: Record<string, any> | null
          insights_json: Record<string, any>[] | null
          exercises_json: Record<string, any>[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_book_content']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['resumox_book_content']['Insert']>
      }
      resumox_categories: {
        Row: {
          slug: string
          label: string
          emoji: string
          sort_order: number
          book_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_categories']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['resumox_categories']['Insert']>
      }
      resumox_user_progress: {
        Row: {
          id: string
          user_email: string
          book_id: string
          status: string
          current_tab: string
          progress_pct: number
          rating: number | null
          completed_at: string | null
          xp_earned: number
          checklist_state: Record<string, any>
          audio_position_sec: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_user_progress']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['resumox_user_progress']['Insert']>
      }
      resumox_user_stats: {
        Row: {
          user_email: string
          total_books_completed: number
          total_xp: number
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          favorite_category: string | null
          total_audio_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_user_stats']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['resumox_user_stats']['Insert']>
      }
      resumox_saved_insights: {
        Row: {
          id: string
          user_email: string
          book_id: string
          insight_text: string
          insight_source: string | null
          saved_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_saved_insights']['Row'], 'id' | 'saved_at'>
        Update: Partial<Database['public']['Tables']['resumox_saved_insights']['Insert']>
      }
      resumox_daily_activity: {
        Row: {
          id: string
          user_email: string
          activity_date: string
          books_opened: number
          books_completed: number
          xp_earned: number
          audio_minutes: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_daily_activity']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['resumox_daily_activity']['Insert']>
      }
      resumox_trails: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          emoji: string
          cover_gradient_from: string
          cover_gradient_to: string
          sort_order: number
          is_published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['resumox_trails']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['resumox_trails']['Insert']>
      }
      resumox_trail_books: {
        Row: {
          trail_id: string
          book_id: string
          position: number
        }
        Insert: Database['public']['Tables']['resumox_trail_books']['Row']
        Update: Partial<Database['public']['Tables']['resumox_trail_books']['Insert']>
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

// Untyped admin client for resumox tables (avoids Supabase generic type inference issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdminUntyped = supabaseAdmin as any

// Cliente para uso no navegador
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
