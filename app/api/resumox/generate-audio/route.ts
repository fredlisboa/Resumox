import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuthentication } from '@/lib/admin-auth'
import { supabaseAdminUntyped } from '@/lib/supabase'
import { generateAudioForBook } from '@/lib/tts'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: NextRequest) {
  // Verificar autenticação admin
  const { valid, message } = await checkAdminAuthentication()
  if (!valid) {
    return NextResponse.json({ error: message }, { status: 403 })
  }

  let body: { slug?: string; force?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body JSON inválido' }, { status: 400 })
  }

  const { slug, force = false } = body
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'Campo "slug" é obrigatório' }, { status: 400 })
  }

  // Buscar livro com conteúdo
  const { data: book, error: bookError } = await supabaseAdminUntyped
    .from('resumox_books')
    .select('id, slug, title, audio_r2_key, audio_duration_min')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (bookError || !book) {
    return NextResponse.json({ error: `Livro "${slug}" não encontrado` }, { status: 404 })
  }

  // Verificar se já tem áudio
  if (book.audio_r2_key && !force) {
    return NextResponse.json({
      error: 'Livro já possui áudio. Use force=true para regenerar.',
      existing: {
        r2Key: book.audio_r2_key,
        durationMin: book.audio_duration_min,
      },
    }, { status: 409 })
  }

  // Buscar conteúdo
  const { data: content, error: contentError } = await supabaseAdminUntyped
    .from('resumox_book_content')
    .select('summary_html')
    .eq('book_id', book.id)
    .single()

  if (contentError || !content?.summary_html) {
    return NextResponse.json({ error: 'Conteúdo do livro não encontrado' }, { status: 404 })
  }

  try {
    const result = await generateAudioForBook(
      book.slug,
      book.id,
      content.summary_html,
      { supabase: supabaseAdminUntyped }
    )

    return NextResponse.json({
      success: true,
      slug: book.slug,
      title: book.title,
      r2Key: result.r2Key,
      durationMin: result.durationMin,
      fileSizeBytes: result.fileSizeBytes,
      textLength: result.textLength,
      message: 'Áudio gerado com sucesso',
    })
  } catch (err) {
    console.error(`[generate-audio] Erro para ${slug}:`, err)
    return NextResponse.json({
      error: 'Falha na geração do áudio',
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 })
  }
}
