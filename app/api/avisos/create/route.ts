import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await (supabaseAdmin
    .from('admin_users') as any)
    .select('id, role, can_create_avisos, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  // User must be in admin_users table, active, and have permission to create avisos
  return !!(data && data.can_create_avisos)
}

// GET: Check if user has permission to create avisos
export async function GET() {
  try {
    // Verificar autenticação
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se é admin com permissão para criar avisos
    const adminStatus = await isAdmin(user.id)
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Não autorizado - apenas administradores podem criar avisos' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário tem permissão para criar avisos'
    })
  } catch (error) {
    console.error('Error in GET /api/avisos/create:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    const adminStatus = await isAdmin(user.id)
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Não autorizado - apenas administradores podem criar avisos' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      short_notification,
      full_content,
      notification_type = 'general',
      priority = 'normal',
      scheduled_for,
      target_user_ids,
      target_product_ids,
      image_url,
      thumbnail_url,
      cta_text,
      cta_url,
      send_push = false,
      metadata
    } = body

    // Validações
    if (!title || !short_notification || !full_content) {
      return NextResponse.json(
        { error: 'title, short_notification e full_content são obrigatórios' },
        { status: 400 }
      )
    }

    // Determinar status inicial
    let status = 'draft'
    let sent_at = null

    if (scheduled_for) {
      const scheduledDate = new Date(scheduled_for)
      const now = new Date()

      if (scheduledDate > now) {
        status = 'scheduled'
      } else {
        // Se a data agendada já passou, enviar imediatamente
        status = 'sent'
        sent_at = new Date().toISOString()
      }
    } else {
      // Se não tem agendamento, enviar imediatamente
      status = 'sent'
      sent_at = new Date().toISOString()
    }

    // Calcular total de destinatários
    let total_recipients = 0

    if (target_user_ids && Array.isArray(target_user_ids) && target_user_ids.length > 0) {
      total_recipients = target_user_ids.length
    } else if (target_product_ids && Array.isArray(target_product_ids) && target_product_ids.length > 0) {
      // Contar usuários que têm algum dos produtos
      const { data: productUsers } = await supabaseAdmin
        .from('user_products')
        .select('user_id')
        .eq('status', 'active')
        .in('product_id', target_product_ids) as { data: any[] | null, error: any }

      if (productUsers) {
        // Remover duplicados
        const uniqueUsers = new Set(productUsers.map(u => u.user_id))
        total_recipients = uniqueUsers.size
      }
    } else {
      // Contar todos os usuários ativos
      const { count } = await supabaseAdmin
        .from('auth.users')
        .select('id', { count: 'exact', head: true })

      total_recipients = count || 0
    }

    // Criar aviso
    const { data: aviso, error: insertError } = await supabaseAdmin
      .from('avisos')
      .insert({
        title,
        short_notification,
        full_content,
        notification_type,
        priority,
        scheduled_for: scheduled_for || null,
        sent_at,
        status,
        target_user_ids: target_user_ids && target_user_ids.length > 0 ? target_user_ids : null,
        target_product_ids: target_product_ids && target_product_ids.length > 0 ? target_product_ids : null,
        total_recipients,
        image_url: image_url || null,
        thumbnail_url: thumbnail_url || null,
        cta_text: cta_text || null,
        cta_url: cta_url || null,
        metadata: metadata || null,
        created_by: user.id,
        push_notification_sent: false,
        is_active: true
      } as any)
      .select()
      .single() as { data: any | null, error: any }

    if (insertError) {
      console.error('Error creating aviso:', {
        error: insertError,
        payload: {
          title,
          short_notification,
          full_content,
          notification_type,
          priority,
          scheduled_for: scheduled_for || null,
          sent_at,
          status,
          target_user_ids: target_user_ids && target_user_ids.length > 0 ? target_user_ids : null,
          target_product_ids: target_product_ids && target_product_ids.length > 0 ? target_product_ids : null,
          total_recipients,
          image_url: image_url || null,
          thumbnail_url: thumbnail_url || null,
          cta_text: cta_text || null,
          cta_url: cta_url || null,
          metadata: metadata || null,
          created_by: user.id,
          push_notification_sent: false,
          is_active: true
        }
      })
      return NextResponse.json(
        { error: insertError.message || 'Erro ao criar aviso' },
        { status: 500 }
      )
    }

    // Se deve enviar push notification imediatamente
    if (send_push && status === 'sent') {
      // TODO: Implementar envio de push notification
      // Chamar serviço de push notification (Firebase Cloud Messaging, etc.)
      console.log('TODO: Send push notification for aviso:', aviso.id)
    }

    return NextResponse.json({
      success: true,
      aviso,
      message: status === 'sent' ? 'Aviso criado e enviado com sucesso' : 'Aviso criado com sucesso'
    })
  } catch (error) {
    console.error('Error in POST /api/avisos/create:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
