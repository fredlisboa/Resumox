#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX by PARSING generated .md files
 * Books: Momentos da Verdade, O Paradoxo da Estrategia, Competicao Descomplicada,
 *        Guerra Executiva, Coragem nos Negocios (Guts)
 */

import { config } from 'dotenv'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

interface BookData {
  metadata: {
    title: string
    original_title: string | null
    author: string
    year: number | null
    category_slug: string
    category_label: string
    category_emoji: string
    reading_time_min: number
    cover_gradient_from: string
    cover_gradient_to: string
  }
  slug: string
  summary_html: string
  mindmap_json: object
  insights_json: object[]
  exercises_json: object[]
}

// ============================================================
// .md file parser
// ============================================================

function extractBlock(content: string, blockHeader: string, language: string): string {
  // Match: ### Bloco N: <blockHeader>\n```<language>\n...\n```
  const escapedHeader = blockHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(
    `###\\s+Bloco\\s+\\d+:\\s+${escapedHeader}\\s*\\n\`\`\`${language}\\n([\\s\\S]*?)\\n\`\`\``,
    'm'
  )
  const match = content.match(regex)
  if (!match) {
    throw new Error(`Could not find block "${blockHeader}" (language: ${language}) in file`)
  }
  return match[1].trim()
}

function parseMdFile(filePath: string): BookData {
  const content = readFileSync(filePath, 'utf-8')
  const fileBasename = basename(filePath, '.md')
  const slug = fileBasename

  // Bloco 1: Metadados (JSON)
  const metadataRaw = extractBlock(content, 'Metadados', 'json')
  const metadataObj = JSON.parse(metadataRaw)
  const metadata: BookData['metadata'] = {
    title: metadataObj.title,
    original_title: metadataObj.original_title ?? null,
    author: metadataObj.author,
    year: metadataObj.year ?? null,
    category_slug: metadataObj.category_slug,
    category_label: metadataObj.category_label,
    category_emoji: metadataObj.category_emoji,
    reading_time_min: metadataObj.reading_time_min,
    cover_gradient_from: metadataObj.cover_gradient_from,
    cover_gradient_to: metadataObj.cover_gradient_to,
  }

  // Bloco 2: summary_html (HTML)
  const summary_html = extractBlock(content, 'summary_html', 'html')

  // Bloco 3: mindmap_json (JSON)
  const mindmapRaw = extractBlock(content, 'mindmap_json', 'json')
  const mindmap_json = JSON.parse(mindmapRaw)

  // Bloco 4: insights_json (JSON)
  const insightsRaw = extractBlock(content, 'insights_json', 'json')
  const insights_json = JSON.parse(insightsRaw)

  // Bloco 5: exercises_json (JSON)
  const exercisesRaw = extractBlock(content, 'exercises_json', 'json')
  const exercises_json = JSON.parse(exercisesRaw)

  return {
    metadata,
    slug,
    summary_html,
    mindmap_json,
    insights_json,
    exercises_json,
  }
}

// ============================================================
// Insert Function
// ============================================================

async function insertBook(book: BookData, sortOrder: number) {
  console.log(`\n📚 Inserting: ${book.metadata.title} (${book.slug})`)

  // Check for duplicates
  const { data: existing } = await supabase
    .from('resumox_books')
    .select('id, slug')
    .eq('slug', book.slug)
    .maybeSingle()

  if (existing) {
    console.log(`  ⚠️ Already exists (id: ${existing.id}). Skipping.`)
    return null
  }

  // Insert book
  const { data: bookRow, error: bookError } = await supabase
    .from('resumox_books')
    .insert({
      slug: book.slug,
      title: book.metadata.title,
      original_title: book.metadata.original_title,
      author: book.metadata.author,
      year: book.metadata.year,
      category_slug: book.metadata.category_slug,
      category_label: book.metadata.category_label,
      category_emoji: book.metadata.category_emoji,
      reading_time_min: book.metadata.reading_time_min,
      audio_duration_min: null,
      audio_r2_key: null,
      pdf_r2_key: null,
      mindmap_image_r2_key: null,
      cover_gradient_from: book.metadata.cover_gradient_from,
      cover_gradient_to: book.metadata.cover_gradient_to,
      cover_image_r2_key: null,
      rating_avg: 0,
      rating_count: 0,
      is_featured: false,
      is_published: true,
      sort_order: sortOrder,
    })
    .select('id')
    .single()

  if (bookError) {
    console.error(`  ❌ Error inserting book: ${bookError.message}`)
    return null
  }

  console.log(`  ✅ Book inserted (id: ${bookRow.id})`)

  // Insert content
  const { error: contentError } = await supabase
    .from('resumox_book_content')
    .insert({
      book_id: bookRow.id,
      summary_html: book.summary_html,
      mindmap_json: book.mindmap_json,
      insights_json: book.insights_json,
      exercises_json: book.exercises_json,
    })

  if (contentError) {
    console.error(`  ❌ Error inserting content: ${contentError.message}`)
    // Rollback
    await supabase.from('resumox_books').delete().eq('id', bookRow.id)
    return null
  }

  console.log(`  ✅ Content inserted`)
  return bookRow.id
}

// ============================================================
// Main
// ============================================================

const MD_FILES = [
  'momentos-da-verdade.md',
  'o-paradoxo-da-estrategia.md',
  'competicao-descomplicada.md',
  'guerra-executiva.md',
  'coragem-nos-negocios-guts-robert-lutz.md',
]

async function main() {
  const resumosDir = resolve(__dirname, '../resumos-gerados')

  console.log('='.repeat(60))
  console.log('  RESUMOX — Inserting 5 New Books (Batch 10)')
  console.log('  Reading from .md files in resumos-gerados/')
  console.log('='.repeat(60))

  // Parse all .md files first
  const books: BookData[] = []
  for (const file of MD_FILES) {
    const filePath = resolve(resumosDir, file)
    try {
      console.log(`\n📄 Parsing: ${file}`)
      const book = parseMdFile(filePath)
      console.log(`  ✅ Parsed "${book.metadata.title}" by ${book.metadata.author}`)
      books.push(book)
    } catch (err: any) {
      console.error(`  ❌ Failed to parse ${file}: ${err.message}`)
      process.exit(1)
    }
  }

  // Get current book count for sort_order
  const { count } = await supabase
    .from('resumox_books')
    .select('*', { count: 'exact', head: true })

  let sortOrder = count || 0
  let inserted = 0

  for (const book of books) {
    const id = await insertBook(book, sortOrder)
    if (id) {
      sortOrder++
      inserted++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`  Done! Inserted ${inserted}/${books.length} books.`)
  console.log('='.repeat(60))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nFATAL ERROR:', error)
    process.exit(1)
  })
