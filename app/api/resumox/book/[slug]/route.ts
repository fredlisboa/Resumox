import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getSessionFromCookie()
    const userEmail = session.valid ? session.user?.email : null

    // Fetch book
    const { data: book, error: bookError } = await supabase
      .from('resumox_books')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (bookError || !book) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 })
    }

    // Fetch content
    const { data: content } = await supabase
      .from('resumox_book_content')
      .select('*')
      .eq('book_id', book.id)
      .single()

    // Fetch user progress if authenticated
    let progress = null
    if (userEmail) {
      const { data: progressData } = await supabase
        .from('resumox_user_progress')
        .select('*')
        .eq('user_email', userEmail)
        .eq('book_id', book.id)
        .single()

      progress = progressData
    }

    // Fetch related books (same category, exclude current)
    const { data: relatedBooks } = await supabase
      .from('resumox_books')
      .select('*')
      .eq('category_slug', book.category_slug)
      .eq('is_published', true)
      .neq('id', book.id)
      .order('rating_avg', { ascending: false })
      .limit(5)

    return NextResponse.json({
      book,
      content,
      progress,
      related_books: relatedBooks || [],
    })
  } catch (error) {
    console.error('Book detail API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
