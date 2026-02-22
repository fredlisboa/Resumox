#!/usr/bin/env tsx

/**
 * Resumox — Import Pre-Generated Summaries
 *
 * Reads pre-generated markdown files (from resumos-gerados/) and inserts
 * books + content into Supabase. Skips PDF extraction and Claude API.
 *
 * Usage:
 *   tsx scripts/import-generated-summaries.ts
 *   tsx scripts/import-generated-summaries.ts --dry-run
 *   tsx scripts/import-generated-summaries.ts --file a-bias-for-action.md
 *   tsx scripts/import-generated-summaries.ts --dir /path/to/summaries
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync, readdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ============================================================
// CLI Args
// ============================================================

function parseArgs() {
  const args = process.argv.slice(2)
  const opts: Record<string, string | boolean> = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg === '--dir' && args[i + 1]) {
      opts.dir = args[++i]
    } else if (arg === '--file' && args[i + 1]) {
      opts.file = args[++i]
    }
  }

  return opts
}

// ============================================================
// Slug Generation (from resumox-import-pipeline.ts)
// ============================================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

// ============================================================
// Markdown Parser
// ============================================================

interface ParsedMetadata {
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

interface ParsedSummary {
  metadata: ParsedMetadata
  summary_html: string
  mindmap_json: object
  insights_json: object[]
  exercises_json: object[]
}

function parseGeneratedMarkdown(content: string, filename: string): ParsedSummary {
  const blocks: Record<string, string> = {}
  const blockRegex = /### Bloco \d+:\s*(\S+)\s*\n```(?:json|html)\n([\s\S]*?)\n```/g

  let match
  while ((match = blockRegex.exec(content)) !== null) {
    const blockName = match[1].toLowerCase()
    blocks[blockName] = match[2]
  }

  const requiredBlocks = ['metadados', 'summary_html', 'mindmap_json', 'insights_json', 'exercises_json']
  for (const name of requiredBlocks) {
    if (!blocks[name]) {
      throw new Error(`Missing block "${name}" in ${filename}`)
    }
  }

  let metadata: any
  try {
    metadata = JSON.parse(blocks['metadados'])
  } catch (e: any) {
    throw new Error(`Invalid JSON in metadados block of ${filename}: ${e.message}`)
  }

  if (!metadata.title) throw new Error(`Missing "title" in metadata of ${filename}`)
  if (!metadata.author) throw new Error(`Missing "author" in metadata of ${filename}`)

  let mindmap_json: object
  try {
    mindmap_json = JSON.parse(blocks['mindmap_json'])
  } catch (e: any) {
    throw new Error(`Invalid JSON in mindmap_json block of ${filename}: ${e.message}`)
  }

  let insights_json: object[]
  try {
    insights_json = JSON.parse(blocks['insights_json'])
  } catch (e: any) {
    throw new Error(`Invalid JSON in insights_json block of ${filename}: ${e.message}`)
  }

  let exercises_json: object[]
  try {
    exercises_json = JSON.parse(blocks['exercises_json'])
  } catch (e: any) {
    throw new Error(`Invalid JSON in exercises_json block of ${filename}: ${e.message}`)
  }

  return {
    metadata: {
      title: metadata.title,
      original_title: metadata.original_title || null,
      author: metadata.author,
      year: metadata.year || null,
      category_slug: metadata.category_slug || 'negocios',
      category_label: metadata.category_label || metadata.category_slug || 'Negócios',
      category_emoji: metadata.category_emoji || '🎯',
      reading_time_min: metadata.reading_time_min || 10,
      cover_gradient_from: metadata.cover_gradient_from || '#1a1a2e',
      cover_gradient_to: metadata.cover_gradient_to || '#16213e',
    },
    summary_html: blocks['summary_html'].trim(),
    mindmap_json,
    insights_json,
    exercises_json,
  }
}

// ============================================================
// Category Upsert
// ============================================================

async function upsertCategory(slug: string, label: string, emoji: string, dryRun: boolean): Promise<void> {
  const { data: existing } = await supabase
    .from('resumox_categories')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) return

  if (dryRun) {
    console.log(`  DRY RUN: Would create category "${slug}" (${label} ${emoji})`)
    return
  }

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

  if (error) throw new Error(`Failed to create category "${slug}": ${error.message}`)
  console.log(`  Created category "${slug}" (${label} ${emoji})`)
}

// ============================================================
// Database Insert
// ============================================================

async function insertBook(parsed: ParsedSummary, slug: string, sortOrder: number): Promise<string> {
  const { metadata } = parsed

  const { data: book, error: bookError } = await supabase
    .from('resumox_books')
    .insert({
      slug,
      title: metadata.title,
      original_title: metadata.original_title,
      author: metadata.author,
      year: metadata.year,
      category_slug: metadata.category_slug,
      category_label: metadata.category_label,
      category_emoji: metadata.category_emoji,
      reading_time_min: metadata.reading_time_min,
      audio_duration_min: null,
      audio_r2_key: null,
      pdf_r2_key: null,
      mindmap_image_r2_key: null,
      cover_gradient_from: metadata.cover_gradient_from,
      cover_gradient_to: metadata.cover_gradient_to,
      rating_avg: 0,
      rating_count: 0,
      is_featured: false,
      is_published: true,
      sort_order: sortOrder,
    })
    .select('id')
    .single()

  if (bookError) throw new Error(`Failed to insert book: ${bookError.message}`)

  const bookId = book.id

  const { error: contentError } = await supabase
    .from('resumox_book_content')
    .insert({
      book_id: bookId,
      summary_html: parsed.summary_html,
      mindmap_json: parsed.mindmap_json,
      insights_json: parsed.insights_json,
      exercises_json: parsed.exercises_json,
    })

  if (contentError) {
    await supabase.from('resumox_books').delete().eq('id', bookId)
    throw new Error(`Failed to insert content (book rolled back): ${contentError.message}`)
  }

  return bookId
}

// ============================================================
// Category Count Updater
// ============================================================

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

// ============================================================
// Main
// ============================================================

async function main() {
  const opts = parseArgs()

  const mdDir = opts.dir
    ? resolve(opts.dir as string)
    : resolve(__dirname, '../resumos-gerados')
  const dryRun = !!opts.dryRun

  if (!existsSync(mdDir)) {
    console.error(`Directory not found: ${mdDir}`)
    process.exit(1)
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  let mdFiles = readdirSync(mdDir)
    .filter((f) => f.endsWith('.md'))
    .sort()

  if (opts.file) {
    mdFiles = mdFiles.filter((f) => f === opts.file)
    if (mdFiles.length === 0) {
      console.error(`File not found: ${opts.file}`)
      process.exit(1)
    }
  }

  console.log('='.repeat(60))
  console.log('  RESUMOX — IMPORT GENERATED SUMMARIES')
  console.log('='.repeat(60))
  console.log(`  Directory: ${mdDir}`)
  console.log(`  Files: ${mdFiles.length}`)
  console.log(`  Dry run: ${dryRun ? 'YES' : 'no'}`)
  console.log('='.repeat(60))
  console.log('')

  const { data: existingBooks } = await supabase
    .from('resumox_books')
    .select('slug')

  const existingSlugs = new Set((existingBooks || []).map((b: any) => b.slug))

  const { count: currentBookCount } = await supabase
    .from('resumox_books')
    .select('*', { count: 'exact', head: true })

  let sortOrder = currentBookCount || 0
  let processed = 0
  let skipped = 0
  let errors = 0
  const categoriesEncountered = new Set<string>()

  for (let i = 0; i < mdFiles.length; i++) {
    const mdFile = mdFiles[i]
    const mdPath = resolve(mdDir, mdFile)

    console.log(`\n[${i + 1}/${mdFiles.length}] ${mdFile}`)

    try {
      console.log('  Parsing markdown...')
      const rawContent = readFileSync(mdPath, 'utf-8')
      const parsed = parseGeneratedMarkdown(rawContent, mdFile)

      console.log(`  Title: ${parsed.metadata.title}`)
      console.log(`  Author: ${parsed.metadata.author}`)
      console.log(`  Category: ${parsed.metadata.category_slug} (${parsed.metadata.category_label} ${parsed.metadata.category_emoji})`)

      const slug = generateSlug(parsed.metadata.title)
      console.log(`  Slug: ${slug}`)

      if (existingSlugs.has(slug)) {
        console.log(`  SKIPPED: Already exists in DB (slug: ${slug})`)
        skipped++
        continue
      }

      console.log('  Checking category...')
      await upsertCategory(
        parsed.metadata.category_slug,
        parsed.metadata.category_label,
        parsed.metadata.category_emoji,
        dryRun,
      )
      categoriesEncountered.add(parsed.metadata.category_slug)

      if (dryRun) {
        console.log(`  DRY RUN: Would insert book "${slug}" (sort_order: ${sortOrder})`)
        console.log(`    summary_html: ${parsed.summary_html.length} chars`)
        console.log(`    mindmap_json: ${JSON.stringify(parsed.mindmap_json).length} chars`)
        console.log(`    insights_json: ${(parsed.insights_json).length} items`)
        console.log(`    exercises_json: ${(parsed.exercises_json).length} items`)
        processed++
        sortOrder++
        continue
      }

      console.log('  Inserting into database...')
      const bookId = await insertBook(parsed, slug, sortOrder)
      existingSlugs.add(slug)
      sortOrder++

      console.log(`  SUCCESS: id=${bookId}`)
      processed++
    } catch (error: any) {
      console.error(`  ERROR: ${error.message}`)
      errors++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('  IMPORT COMPLETE')
  console.log('='.repeat(60))
  console.log(`  Processed: ${processed}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Total: ${processed + skipped + errors}`)
  console.log('='.repeat(60))

  if (!dryRun && processed > 0 && categoriesEncountered.size > 0) {
    console.log('\nUpdating category book counts...')
    await updateCategoryCounts(categoriesEncountered)
    console.log('Done.')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nFATAL ERROR:', error)
    process.exit(1)
  })
