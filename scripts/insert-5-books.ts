#!/usr/bin/env tsx

/**
 * ResumoX — Insert 5 New Books
 *
 * Inserts 5 pre-generated books into Supabase:
 *   - 4 from TypeScript exports (.ts files in resumos-gerados/)
 *   - 1 from Markdown (.md file in resumos-gerados/)
 *
 * Usage:
 *   npx tsx scripts/insert-5-books.ts
 *   npx tsx scripts/insert-5-books.ts --dry-run
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const GRADIENTS = [
  { from: '#1a1a2e', to: '#16213e' },
  { from: '#0f3460', to: '#533483' },
  { from: '#2c3e50', to: '#3498db' },
  { from: '#1e3c72', to: '#2a5298' },
  { from: '#134e5e', to: '#71b280' },
  { from: '#0b486b', to: '#3b8d99' },
  { from: '#2c3e50', to: '#fd746c' },
  { from: '#1f1c2c', to: '#928dab' },
  { from: '#232526', to: '#414345' },
  { from: '#0f2027', to: '#203a43' },
  { from: '#2b5876', to: '#4e4376' },
  { from: '#360033', to: '#0b8793' },
  { from: '#4a0e0e', to: '#c62828' },
  { from: '#1a237e', to: '#283593' },
  { from: '#004d40', to: '#00796b' },
  { from: '#33001a', to: '#990066' },
  { from: '#1b0a3c', to: '#5b247a' },
  { from: '#0d253f', to: '#01b4e4' },
  { from: '#2d1b69', to: '#6a3093' },
  { from: '#1c1c1c', to: '#434343' },
]

// ============================================================
// Markdown parser (same as import-generated-summaries.ts)
// ============================================================

function parseMdFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8')
  const blocks: Record<string, string> = {}
  const blockRegex = /### Bloco \d+:\s*(\S+)\s*\n```(?:json|html)\n([\s\S]*?)\n```/g

  let match
  while ((match = blockRegex.exec(content)) !== null) {
    blocks[match[1].toLowerCase()] = match[2]
  }

  const metadata = JSON.parse(blocks['metadados'])
  return {
    metadata: {
      title: metadata.title,
      original_title: metadata.original_title || null,
      author: metadata.author,
      year: metadata.year || null,
      category_slug: metadata.category_slug,
      category_label: metadata.category_label,
      category_emoji: metadata.category_emoji,
      reading_time_min: metadata.reading_time_min || 10,
    },
    summary_html: blocks['summary_html'].trim(),
    mindmap_json: JSON.parse(blocks['mindmap_json']),
    insights_json: JSON.parse(blocks['insights_json']),
    exercises_json: JSON.parse(blocks['exercises_json']),
  }
}

// ============================================================
// Main
// ============================================================

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
  }
  summary_html: string
  mindmap_json: object
  insights_json: object[]
  exercises_json: object[]
}

interface BookDefinition {
  sortOrder: number
  slug: string
  source: { type: 'ts'; file: string; exportName: string } | { type: 'md'; file: string }
}

const BOOK_DEFS: BookDefinition[] = [
  { sortOrder: 190, slug: 'father-son-co', source: { type: 'ts', file: 'father-son-co.ts', exportName: 'book1' } },
  { sortOrder: 191, slug: 'hot-flat-and-crowded', source: { type: 'ts', file: 'hot-flat-and-crowded.ts', exportName: 'book2' } },
  { sortOrder: 192, slug: 'group-genius', source: { type: 'ts', file: 'group-genius.ts', exportName: 'book3' } },
  { sortOrder: 193, slug: 'ill-make-you-an-offer-you-cant-refuse', source: { type: 'ts', file: 'ill-make-you-an-offer-you-cant-refuse.ts', exportName: 'book4' } },
  { sortOrder: 194, slug: 'in-pursuit-of-elegance', source: { type: 'md', file: 'in-pursuit-of-elegance.md' } },
]

async function loadBookData(def: BookDefinition): Promise<BookData> {
  const resumosDir = resolve(__dirname, '../resumos-gerados')

  if (def.source.type === 'ts') {
    const mod = await import(resolve(resumosDir, def.source.file))
    return mod[def.source.exportName]
  } else {
    return parseMdFile(resolve(resumosDir, def.source.file))
  }
}

async function upsertCategory(slug: string, label: string, emoji: string): Promise<void> {
  const { data: existing } = await supabase
    .from('resumox_categories')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) return

  const { data: maxRow } = await supabase
    .from('resumox_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1

  const { error } = await supabase
    .from('resumox_categories')
    .insert({ slug, label, emoji, sort_order: nextSortOrder, book_count: 0 })

  if (error) console.warn(`  Warning: Failed to create category "${slug}": ${error.message}`)
  else console.log(`  Created new category: ${slug}`)
}

async function updateCategoryCounts(categorySlugs: Set<string>): Promise<void> {
  for (const catSlug of categorySlugs) {
    const { count } = await supabase
      .from('resumox_books')
      .select('*', { count: 'exact', head: true })
      .eq('category_slug', catSlug)
      .eq('is_published', true)

    await supabase
      .from('resumox_categories')
      .update({ book_count: count || 0 })
      .eq('slug', catSlug)

    console.log(`  ${catSlug}: ${count || 0} books`)
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  console.log('='.repeat(60))
  console.log('  RESUMOX — INSERT 5 NEW BOOKS')
  console.log('='.repeat(60))
  console.log(`  Dry run: ${dryRun ? 'YES' : 'no'}`)
  console.log('')

  // Check for existing slugs
  const { data: existingBooks } = await supabase
    .from('resumox_books')
    .select('slug')

  const existingSlugs = new Set((existingBooks || []).map((b: any) => b.slug))

  let inserted = 0
  let skipped = 0
  const categoriesEncountered = new Set<string>()

  for (const def of BOOK_DEFS) {
    console.log(`\n[${def.sortOrder - 189}/${BOOK_DEFS.length}] ${def.slug}`)

    if (existingSlugs.has(def.slug)) {
      console.log(`  SKIPPED: Already exists in DB`)
      skipped++
      continue
    }

    try {
      console.log(`  Loading content from ${def.source.type === 'ts' ? def.source.file : def.source.file}...`)
      const data = await loadBookData(def)
      const gradient = GRADIENTS[def.sortOrder % 20]

      console.log(`  Title: ${data.metadata.title}`)
      console.log(`  Author: ${data.metadata.author}`)
      console.log(`  Category: ${data.metadata.category_slug}`)
      console.log(`  Gradient: ${gradient.from} -> ${gradient.to}`)
      console.log(`  Sort order: ${def.sortOrder}`)

      // Ensure category exists
      await upsertCategory(
        data.metadata.category_slug,
        data.metadata.category_label,
        data.metadata.category_emoji,
      )
      categoriesEncountered.add(data.metadata.category_slug)

      if (dryRun) {
        console.log(`  DRY RUN: Would insert "${def.slug}"`)
        console.log(`    summary_html: ${data.summary_html.length} chars`)
        console.log(`    mindmap branches: ${(data.mindmap_json as any).branches?.length || '?'}`)
        console.log(`    insights: ${data.insights_json.length} items`)
        console.log(`    exercises: ${data.exercises_json.length} items`)
        inserted++
        continue
      }

      // Insert book
      const { data: book, error: bookError } = await supabase
        .from('resumox_books')
        .insert({
          slug: def.slug,
          title: data.metadata.title,
          original_title: data.metadata.original_title,
          author: data.metadata.author,
          year: data.metadata.year,
          category_slug: data.metadata.category_slug,
          category_label: data.metadata.category_label,
          category_emoji: data.metadata.category_emoji,
          reading_time_min: data.metadata.reading_time_min,
          audio_duration_min: null,
          audio_r2_key: null,
          pdf_r2_key: null,
          mindmap_image_r2_key: null,
          cover_gradient_from: gradient.from,
          cover_gradient_to: gradient.to,
          rating_avg: 0,
          rating_count: 0,
          is_featured: false,
          is_published: true,
          sort_order: def.sortOrder,
        })
        .select('id')
        .single()

      if (bookError) throw new Error(`Failed to insert book: ${bookError.message}`)

      const bookId = book.id

      // Insert content
      const { error: contentError } = await supabase
        .from('resumox_book_content')
        .insert({
          book_id: bookId,
          summary_html: data.summary_html,
          mindmap_json: data.mindmap_json,
          insights_json: data.insights_json,
          exercises_json: data.exercises_json,
        })

      if (contentError) {
        await supabase.from('resumox_books').delete().eq('id', bookId)
        throw new Error(`Failed to insert content (book rolled back): ${contentError.message}`)
      }

      console.log(`  SUCCESS: id=${bookId}`)
      inserted++
    } catch (error: any) {
      console.error(`  ERROR: ${error.message}`)
    }
  }

  // Update category counts
  if (!dryRun && categoriesEncountered.size > 0) {
    console.log('\nUpdating category counts...')
    await updateCategoryCounts(categoriesEncountered)
  }

  console.log('\n' + '='.repeat(60))
  console.log('  COMPLETE')
  console.log('='.repeat(60))
  console.log(`  Inserted: ${inserted}`)
  console.log(`  Skipped: ${skipped}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
