import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookie()
    if (!session.valid || !session.user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { book_id, rating } = await request.json()

    if (!book_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'book_id e rating (1-5) são obrigatórios' }, { status: 400 })
    }

    // Update rating in user progress (the trigger will update book rating_avg)
    const { error } = await supabase
      .from('resumox_user_progress')
      .upsert(
        {
          user_email: session.user.email,
          book_id,
          rating,
        },
        { onConflict: 'user_email,book_id' }
      )

    if (error) {
      console.error('Error saving rating:', error)
      return NextResponse.json({ error: 'Erro ao salvar avaliação' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Rating API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
