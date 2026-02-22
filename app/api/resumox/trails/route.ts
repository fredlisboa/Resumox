import { NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getSessionFromCookie()
    const userEmail = session.valid ? session.user?.email : null

    // Fetch published trails
    const { data: trails, error: trailsError } = await supabase
      .from('resumox_trails')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (trailsError) {
      console.error('Error fetching trails:', trailsError)
      return NextResponse.json({ error: 'Erro ao buscar trilhas' }, { status: 500 })
    }

    if (!trails || trails.length === 0) {
      return NextResponse.json({ trails: [] })
    }

    // For each trail, fetch its books with positions
    const trailsWithBooks = await Promise.all(
      trails.map(async (trail: any) => {
        const { data: trailBooks } = await supabase
          .from('resumox_trail_books')
          .select('book_id, position')
          .eq('trail_id', trail.id)
          .order('position', { ascending: true })

        if (!trailBooks || trailBooks.length === 0) {
          return { ...trail, books: [], total_books: 0, completed_books: 0 }
        }

        const bookIds = trailBooks.map((tb: any) => tb.book_id)

        const { data: books } = await supabase
          .from('resumox_books')
          .select('*')
          .in('id', bookIds)
          .eq('is_published', true)

        // Sort books by trail position
        const positionMap = new Map<string, number>(trailBooks.map((tb: any) => [tb.book_id, tb.position]))
        const sortedBooks = (books || []).sort(
          (a: any, b: any) => (positionMap.get(a.id) ?? 0) - (positionMap.get(b.id) ?? 0)
        )

        // Get user progress if authenticated
        let completedBooks = 0
        let booksWithProgress = sortedBooks

        if (userEmail) {
          const { data: progressData } = await supabase
            .from('resumox_user_progress')
            .select('book_id, status, progress_pct, current_tab')
            .eq('user_email', userEmail)
            .in('book_id', bookIds)

          const progressMap: Record<string, any> = {}
          if (progressData) {
            for (const p of progressData) {
              progressMap[p.book_id] = p
              if (p.status === 'completed') completedBooks++
            }
          }

          booksWithProgress = sortedBooks.map((book: any) => ({
            ...book,
            progress: progressMap[book.id] || null,
          }))
        }

        return {
          ...trail,
          books: booksWithProgress,
          total_books: sortedBooks.length,
          completed_books: completedBooks,
        }
      })
    )

    return NextResponse.json({ trails: trailsWithBooks })
  } catch (error) {
    console.error('Trails API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
