import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromCookie()
    const userEmail = session.valid ? session.user?.email : null

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('resumox_books')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category_slug', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
    }

    const { data: books, error, count } = await query

    if (error) {
      console.error('Error fetching books:', error)
      return NextResponse.json({ error: 'Erro ao buscar livros' }, { status: 500 })
    }

    // If user is authenticated, fetch their progress for these books
    let progressMap: Record<string, any> = {}
    if (userEmail && books && books.length > 0) {
      const bookIds = books.map((b: any) => b.id)
      const { data: progressData } = await supabase
        .from('resumox_user_progress')
        .select('book_id, status, progress_pct, current_tab')
        .eq('user_email', userEmail)
        .in('book_id', bookIds)

      if (progressData) {
        for (const p of progressData) {
          progressMap[p.book_id] = p
        }
      }
    }

    const booksWithProgress = (books || []).map((book: any) => ({
      ...book,
      progress: progressMap[book.id] || null,
    }))

    return NextResponse.json({
      books: booksWithProgress,
      total: count || 0,
      page,
      has_more: (count || 0) > offset + limit,
    })
  } catch (error) {
    console.error('Books API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
