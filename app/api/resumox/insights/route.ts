import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromCookie()
    if (!session.valid || !session.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('book_id')

    let query = supabase
      .from('resumox_saved_insights')
      .select('*')
      .eq('user_email', session.user.email)
      .order('saved_at', { ascending: false })

    if (bookId) {
      query = query.eq('book_id', bookId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching insights:', error)
      return NextResponse.json({ error: 'Erro ao buscar insights' }, { status: 500 })
    }

    return NextResponse.json({ insights: data || [] })
  } catch (error) {
    console.error('Insights GET error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookie()
    if (!session.valid || !session.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { book_id, insight_text, insight_source } = await request.json()

    if (!book_id || !insight_text) {
      return NextResponse.json({ error: 'book_id e insight_text são obrigatórios' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('resumox_saved_insights')
      .upsert(
        {
          user_email: session.user.email,
          book_id,
          insight_text,
          insight_source: insight_source || null,
        },
        { onConflict: 'user_email,book_id,insight_text' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error saving insight:', error)
      return NextResponse.json({ error: 'Erro ao salvar insight' }, { status: 500 })
    }

    return NextResponse.json({ insight: data })
  } catch (error) {
    console.error('Insights POST error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSessionFromCookie()
    if (!session.valid || !session.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
    }

    const { error } = await supabase
      .from('resumox_saved_insights')
      .delete()
      .eq('id', id)
      .eq('user_email', session.user.email)

    if (error) {
      console.error('Error deleting insight:', error)
      return NextResponse.json({ error: 'Erro ao remover insight' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Insights DELETE error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
