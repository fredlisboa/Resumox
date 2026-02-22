import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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

    const body = await request.json()
    const { aviso_id, clicked } = body

    if (!aviso_id) {
      return NextResponse.json(
        { error: 'aviso_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o aviso existe e está ativo
    const { data: aviso, error: avisoError } = await supabaseAdmin
      .from('avisos')
      .select('id, total_read, total_clicked')
      .eq('id', aviso_id)
      .eq('status', 'sent')
      .eq('is_active', true)
      .single() as { data: any | null, error: any }

    if (avisoError || !aviso) {
      return NextResponse.json(
        { error: 'Aviso não encontrado' },
        { status: 404 }
      )
    }

    // Inserir ou atualizar registro de leitura
    const { data: existingRead } = await supabaseAdmin
      .from('aviso_reads')
      .select('id, clicked')
      .eq('aviso_id', aviso_id)
      .eq('user_id', user.id)
      .single() as { data: any | null, error: any }

    if (existingRead) {
      // Atualizar se foi clicado
      if (clicked && !existingRead.clicked) {
        const { error: updateError } = await (supabaseAdmin
          .from('aviso_reads') as any)
          .update({
            clicked: true,
            clicked_at: new Date().toISOString()
          })
          .eq('id', existingRead.id)

        if (updateError) {
          console.error('Error updating aviso read:', updateError)
        } else {
          // Incrementar contador de cliques no aviso
          await (supabaseAdmin
            .from('avisos') as any)
            .update({
              total_clicked: (aviso.total_clicked || 0) + 1
            })
            .eq('id', aviso_id)
        }
      }
    } else {
      // Criar novo registro de leitura
      const { error: insertError } = await (supabaseAdmin
        .from('aviso_reads') as any)
        .insert({
          aviso_id,
          user_id: user.id,
          clicked: clicked || false,
          clicked_at: clicked ? new Date().toISOString() : null
        })

      if (insertError) {
        console.error('Error inserting aviso read:', insertError)
        return NextResponse.json(
          { error: 'Erro ao marcar aviso como lido' },
          { status: 500 }
        )
      }

      // Incrementar contador de leituras no aviso
      const updates: any = {
        total_read: (aviso.total_read || 0) + 1
      }

      if (clicked) {
        updates.total_clicked = (aviso.total_clicked || 0) + 1
      }

      await (supabaseAdmin
        .from('avisos') as any)
        .update(updates)
        .eq('id', aviso_id)
    }

    return NextResponse.json({
      success: true,
      message: 'Aviso marcado como lido'
    })
  } catch (error) {
    console.error('Error in POST /api/avisos/mark-read:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
