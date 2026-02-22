import { NextResponse } from 'next/server'
import { supabaseAdminUntyped as supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('resumox_categories')
      .select('slug, label, emoji, sort_order, book_count')
      .gt('book_count', 0)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
    }

    return NextResponse.json({ categories: categories || [] })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
