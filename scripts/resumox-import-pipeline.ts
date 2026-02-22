#!/usr/bin/env tsx

/**
 * Resumox Book Import Pipeline
 *
 * Processes PDF book summaries and generates all content for the Resumox platform:
 * 1. Extracts text from PDFs via pdfjs-dist
 * 2. Uses Claude API to generate summary_html, mindmap_json, insights_json, exercises_json
 * 3. Categorizes the book and assigns metadata
 * 4. Uploads the PDF to Cloudflare R2
 * 5. Inserts into resumox_books + resumox_book_content in Supabase
 *
 * Usage:
 *   tsx scripts/resumox-import-pipeline.ts --dir ./pdfs
 *   tsx scripts/resumox-import-pipeline.ts --dir ./pdfs --dry-run
 *   tsx scripts/resumox-import-pipeline.ts --dir ./pdfs --skip-upload
 *   tsx scripts/resumox-import-pipeline.ts --dir ./pdfs --start-from 50
 *   tsx scripts/resumox-import-pipeline.ts --dir ./pdfs --file "specific-book.pdf"
 *
 * Required env vars (in .env.local):
 *   ANTHROPIC_API_KEY - Claude API key
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve, basename, extname } from 'path'
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// ============================================================
// Configuration
// ============================================================

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 5000
const RATE_LIMIT_DELAY_MS = 1500 // Delay between API calls

// Available categories (from DB)
const CATEGORIES: Record<string, { label: string; emoji: string }> = {
  financas: { label: 'Finanças & Investimentos', emoji: '💰' },
  marketing: { label: 'Marketing & Vendas', emoji: '📣' },
  lideranca: { label: 'Liderança & Gestão', emoji: '👑' },
  empreendedorismo: { label: 'Empreendedorismo', emoji: '🚀' },
  produtividade: { label: 'Produtividade & Hábitos', emoji: '⚡' },
  mindset: { label: 'Mentalidade & Mindset', emoji: '🧠' },
  inovacao: { label: 'Tecnologia & Inovação', emoji: '💡' },
  biografias: { label: 'Biografias de Negócios', emoji: '📚' },
  negocios: { label: 'Estratégia de Negócios', emoji: '🎯' },
}

// Color gradient palette for book covers
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
// CLI Args
// ============================================================

function parseArgs() {
  const args = process.argv.slice(2)
  const opts: Record<string, string | boolean> = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg === '--skip-upload') {
      opts.skipUpload = true
    } else if (arg === '--dir' && args[i + 1]) {
      opts.dir = args[++i]
    } else if (arg === '--file' && args[i + 1]) {
      opts.file = args[++i]
    } else if (arg === '--start-from' && args[i + 1]) {
      opts.startFrom = args[++i]
    } else if (arg === '--concurrency' && args[i + 1]) {
      opts.concurrency = args[++i]
    }
  }

  return opts
}

// ============================================================
// PDF Text Extraction
// ============================================================

async function extractTextFromPDF(pdfPath: string): Promise<string> {
  // Dynamic import to avoid issues with pdfjs-dist in Node
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

  const data = new Uint8Array(readFileSync(pdfPath))
  const doc = await pdfjsLib.getDocument({ data }).promise

  const pages: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item: any) => item.str)
      .join(' ')
    pages.push(text)
  }

  return pages.join('\n\n')
}

// ============================================================
// Slug Generation
// ============================================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .replace(/\s+/g, '-')            // Spaces to hyphens
    .replace(/-+/g, '-')             // Collapse hyphens
    .replace(/^-|-$/g, '')           // Trim hyphens
    .slice(0, 80)
}

// ============================================================
// Claude API Content Generation
// ============================================================

const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!anthropic) throw new Error('ANTHROPIC_API_KEY not configured')

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })

      const textBlock = response.content.find((b) => b.type === 'text')
      return textBlock?.text || ''
    } catch (error: any) {
      if (attempt === MAX_RETRIES) throw error
      const isRateLimit = error?.status === 429
      const delay = isRateLimit ? RETRY_DELAY_MS * 2 : RETRY_DELAY_MS
      console.warn(`  Retry ${attempt}/${MAX_RETRIES} (${isRateLimit ? 'rate limit' : 'error'})...`)
      await sleep(delay)
    }
  }

  throw new Error('Max retries exceeded')
}

function extractJSON(text: string): string {
  // Try to find JSON in code fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (fenceMatch) return fenceMatch[1].trim()

  // Try to find raw JSON (object or array)
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  if (jsonMatch) return jsonMatch[1].trim()

  return text.trim()
}

interface BookMetadata {
  title: string
  original_title: string | null
  author: string
  year: number | null
  category_slug: string
  category_label: string
  category_emoji: string
  reading_time_min: number
}

interface GeneratedContent {
  metadata: BookMetadata
  summary_html: string
  mindmap_json: object
  insights_json: object[]
  exercises_json: object[]
}

async function generateBookContent(pdfText: string, pdfFilename: string): Promise<GeneratedContent> {
  const categoryList = Object.entries(CATEGORIES)
    .map(([slug, c]) => `- ${slug}: ${c.label} ${c.emoji}`)
    .join('\n')

  // Step 1: Extract metadata + categorize
  console.log('  [1/4] Generating metadata...')
  const metadataPrompt = `Analyze this book summary text and extract/determine the following information.
Return ONLY a JSON object (no markdown fences, no explanation) with these fields:

{
  "title": "Title in PT-BR (translated if needed)",
  "original_title": "Original title in the original language, or null if already in PT-BR",
  "author": "Author name",
  "year": 1999,
  "category_slug": "one of the slugs below",
  "reading_time_min": 12
}

Available categories:
${categoryList}

Choose the BEST matching category. Estimate reading_time_min based on text length (typically 8-15 min for a summary).

PDF filename for context: ${pdfFilename}`

  const metadataRaw = await callClaude(
    'You are a book metadata extraction assistant. Return only valid JSON, no markdown fences or extra text.',
    `${metadataPrompt}\n\nText:\n${pdfText.slice(0, 6000)}`
  )

  await sleep(RATE_LIMIT_DELAY_MS)

  let metadata: BookMetadata
  try {
    const parsed = JSON.parse(extractJSON(metadataRaw))
    const catSlug = parsed.category_slug in CATEGORIES ? parsed.category_slug : 'negocios'
    metadata = {
      title: parsed.title || pdfFilename.replace('.pdf', ''),
      original_title: parsed.original_title || null,
      author: parsed.author || 'Autor desconhecido',
      year: parsed.year || null,
      category_slug: catSlug,
      category_label: CATEGORIES[catSlug].label,
      category_emoji: CATEGORIES[catSlug].emoji,
      reading_time_min: parsed.reading_time_min || 10,
    }
  } catch {
    console.warn('  Warning: Could not parse metadata, using defaults')
    metadata = {
      title: pdfFilename.replace('.pdf', ''),
      original_title: null,
      author: 'Autor desconhecido',
      year: null,
      category_slug: 'negocios',
      category_label: CATEGORIES.negocios.label,
      category_emoji: CATEGORIES.negocios.emoji,
      reading_time_min: 10,
    }
  }

  // Step 2: Generate summary_html
  console.log('  [2/4] Generating summary HTML...')
  const summaryHtml = await callClaude(
    `You are a book summary writer for a Brazilian PT-BR learning platform called Resumox.
Write engaging, well-structured HTML summaries of business/self-help books.

Use these HTML patterns for formatting:
- <h2> for main sections
- <h3> for subsections
- <p> for paragraphs
- <strong> for emphasis
- <div class="highlight-box">quote or highlight</div> for key quotes
- <div class="key-point"><div class="kp-num">emoji or number</div><div class="kp-text"><strong>Label:</strong> text</div></div> for key points

The summary should be comprehensive (2000-4000 words), covering all major concepts from the book.
Write in PT-BR (Brazilian Portuguese). If the source is in another language, translate and adapt.
Return ONLY the HTML content, no wrapping tags like <html> or <body>.`,
    `Generate a complete PT-BR summary for this book: "${metadata.title}" by ${metadata.author}

Source text:
${pdfText.slice(0, 12000)}`
  )

  await sleep(RATE_LIMIT_DELAY_MS)

  // Step 3: Generate mindmap_json + insights_json
  console.log('  [3/4] Generating mindmap & insights...')
  const mindmapAndInsightsRaw = await callClaude(
    `You generate structured learning content in JSON format for a book summary platform.
Return ONLY a JSON object (no markdown fences) with two keys: "mindmap" and "insights".

The "mindmap" must follow this exact structure:
{
  "center_label": "BOOK TITLE (caps)",
  "center_sublabel": "Core theme subtitle",
  "branches": [
    {
      "title": "Branch Name",
      "icon": "emoji",
      "items": ["Point 1", "Point 2", "Point 3", "Point 4"],
      "full_width": false
    }
  ]
}
Include 4-6 branches, each with 3-5 items. One branch may have "full_width": true.

The "insights" must be an array of 4-6 objects:
[
  { "text": "Insight text in PT-BR", "source_chapter": "Cap. X or section name" }
]

All text must be in PT-BR.`,
    `Book: "${metadata.title}" by ${metadata.author}

Source text:
${pdfText.slice(0, 10000)}`
  )

  await sleep(RATE_LIMIT_DELAY_MS)

  let mindmap_json: object = { center_label: metadata.title.toUpperCase(), center_sublabel: '', branches: [] }
  let insights_json: object[] = []

  try {
    const parsed = JSON.parse(extractJSON(mindmapAndInsightsRaw))
    if (parsed.mindmap) mindmap_json = parsed.mindmap
    if (parsed.insights) insights_json = parsed.insights
  } catch {
    console.warn('  Warning: Could not parse mindmap/insights JSON')
  }

  // Step 4: Generate exercises_json
  console.log('  [4/4] Generating exercises...')
  const exercisesRaw = await callClaude(
    `You generate practical exercise content for a book summary learning platform.
Return ONLY a JSON array (no markdown fences) of 2-4 exercises.

Each exercise must follow this structure:
{
  "title": "Exercise title in PT-BR",
  "icon": "emoji",
  "color_theme": "accent" | "green" | "orange",
  "description": "Brief description of the exercise in PT-BR",
  "template_text": "Optional template text for writing exercises",
  "checklist": ["Step 1 in PT-BR", "Step 2 in PT-BR", "Step 3 in PT-BR"]
}

Exercises should be practical and actionable, helping the reader apply the book's concepts.
Alternate color_themes across exercises. All text in PT-BR.`,
    `Book: "${metadata.title}" by ${metadata.author}

Key concepts from the book:
${pdfText.slice(0, 6000)}`
  )

  await sleep(RATE_LIMIT_DELAY_MS)

  let exercises_json: object[] = []
  try {
    exercises_json = JSON.parse(extractJSON(exercisesRaw))
    if (!Array.isArray(exercises_json)) exercises_json = []
  } catch {
    console.warn('  Warning: Could not parse exercises JSON')
  }

  return {
    metadata,
    summary_html: summaryHtml.trim(),
    mindmap_json,
    insights_json,
    exercises_json,
  }
}

// ============================================================
// R2 Upload
// ============================================================

async function uploadPdfToR2(pdfPath: string, slug: string): Promise<string> {
  const { uploadFileToR2 } = await import('../lib/r2')

  const fileBuffer = readFileSync(pdfPath)
  const key = `resumox/pdfs/${slug}.pdf`

  await uploadFileToR2({
    key,
    body: fileBuffer,
    contentType: 'application/pdf',
    metadata: {
      'upload-type': 'resumox-import',
      'created-at': new Date().toISOString(),
    },
  })

  return `r2://${key}`
}

// ============================================================
// Database Insert
// ============================================================

async function insertBookToDb(
  content: GeneratedContent,
  slug: string,
  pdfR2Key: string | null,
  sortOrder: number
): Promise<string> {
  const gradient = GRADIENTS[sortOrder % GRADIENTS.length]

  // Insert book
  const { data: book, error: bookError } = await supabase
    .from('resumox_books')
    .insert({
      slug,
      title: content.metadata.title,
      original_title: content.metadata.original_title,
      author: content.metadata.author,
      year: content.metadata.year,
      category_slug: content.metadata.category_slug,
      category_label: content.metadata.category_label,
      category_emoji: content.metadata.category_emoji,
      reading_time_min: content.metadata.reading_time_min,
      audio_duration_min: null,
      audio_r2_key: null,
      pdf_r2_key: pdfR2Key,
      mindmap_image_r2_key: null,
      cover_gradient_from: gradient.from,
      cover_gradient_to: gradient.to,
      rating_avg: 0,
      rating_count: 0,
      is_featured: false,
      is_published: true,
      sort_order: sortOrder,
    })
    .select('id')
    .single()

  if (bookError) {
    throw new Error(`Failed to insert book: ${bookError.message}`)
  }

  const bookId = book.id

  // Insert content
  const { error: contentError } = await supabase
    .from('resumox_book_content')
    .insert({
      book_id: bookId,
      summary_html: content.summary_html,
      mindmap_json: content.mindmap_json,
      insights_json: content.insights_json,
      exercises_json: content.exercises_json,
    })

  if (contentError) {
    // Rollback book if content fails
    await supabase.from('resumox_books').delete().eq('id', bookId)
    throw new Error(`Failed to insert content: ${contentError.message}`)
  }

  return bookId
}

// ============================================================
// Logging
// ============================================================

const LOG_DIR = resolve(__dirname, '../logs')

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true })
}

function logResult(entry: { file: string; status: string; slug?: string; error?: string }) {
  ensureLogDir()
  const logFile = resolve(LOG_DIR, `resumox-import-${new Date().toISOString().split('T')[0]}.jsonl`)
  writeFileSync(logFile, JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n', { flag: 'a' })
}

// ============================================================
// Helpers
// ============================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================================
// Main Pipeline
// ============================================================

async function main() {
  const opts = parseArgs()

  if (!opts.dir) {
    console.error('Usage: tsx scripts/resumox-import-pipeline.ts --dir <pdf-directory>')
    console.error('')
    console.error('Options:')
    console.error('  --dir <path>         Directory containing PDF files')
    console.error('  --file <name>        Process only a specific PDF file')
    console.error('  --dry-run            Generate content but skip DB insert and R2 upload')
    console.error('  --skip-upload        Skip R2 upload (insert DB with null pdf_r2_key)')
    console.error('  --start-from <n>     Skip the first N files (for resuming)')
    process.exit(1)
  }

  const pdfDir = resolve(opts.dir as string)
  if (!existsSync(pdfDir)) {
    console.error(`Directory not found: ${pdfDir}`)
    process.exit(1)
  }

  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set in .env.local')
    process.exit(1)
  }

  // Get list of PDFs
  let pdfFiles = readdirSync(pdfDir)
    .filter((f) => extname(f).toLowerCase() === '.pdf')
    .sort()

  if (opts.file) {
    pdfFiles = pdfFiles.filter((f) => f === opts.file)
    if (pdfFiles.length === 0) {
      console.error(`File not found: ${opts.file}`)
      process.exit(1)
    }
  }

  const startFrom = parseInt(opts.startFrom as string) || 0
  if (startFrom > 0) {
    pdfFiles = pdfFiles.slice(startFrom)
  }

  console.log('=' .repeat(60))
  console.log('  RESUMOX IMPORT PIPELINE')
  console.log('=' .repeat(60))
  console.log(`  PDFs directory: ${pdfDir}`)
  console.log(`  Total PDFs: ${pdfFiles.length}`)
  console.log(`  Dry run: ${opts.dryRun ? 'YES' : 'no'}`)
  console.log(`  Skip upload: ${opts.skipUpload ? 'YES' : 'no'}`)
  console.log(`  Start from: ${startFrom}`)
  console.log('=' .repeat(60))
  console.log('')

  // Get existing slugs to skip duplicates
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

  for (let i = 0; i < pdfFiles.length; i++) {
    const pdfFile = pdfFiles[i]
    const pdfPath = resolve(pdfDir, pdfFile)
    const idx = startFrom + i + 1

    console.log(`\n[${idx}/${startFrom + pdfFiles.length}] Processing: ${pdfFile}`)

    try {
      // Step 1: Extract text
      console.log('  Extracting text from PDF...')
      const pdfText = await extractTextFromPDF(pdfPath)

      if (pdfText.trim().length < 100) {
        console.warn('  SKIPPED: PDF has very little text content')
        logResult({ file: pdfFile, status: 'skipped', error: 'too little text' })
        skipped++
        continue
      }

      // Step 2: Generate content via Claude
      console.log('  Generating content via Claude API...')
      const content = await generateBookContent(pdfText, pdfFile)

      // Step 3: Generate slug and check for duplicates
      const slug = generateSlug(content.metadata.title)
      if (existingSlugs.has(slug)) {
        console.log(`  SKIPPED: "${content.metadata.title}" already exists (slug: ${slug})`)
        logResult({ file: pdfFile, status: 'skipped_duplicate', slug })
        skipped++
        continue
      }

      console.log(`  Title: ${content.metadata.title}`)
      console.log(`  Author: ${content.metadata.author}`)
      console.log(`  Category: ${content.metadata.category_slug}`)
      console.log(`  Slug: ${slug}`)

      if (opts.dryRun) {
        // Save generated content to a file for review
        ensureLogDir()
        const previewPath = resolve(LOG_DIR, `preview-${slug}.json`)
        writeFileSync(previewPath, JSON.stringify(content, null, 2))
        console.log(`  DRY RUN: Content saved to ${previewPath}`)
        logResult({ file: pdfFile, status: 'dry_run', slug })
        processed++
        continue
      }

      // Step 4: Upload PDF to R2
      let pdfR2Key: string | null = null
      if (!opts.skipUpload) {
        console.log('  Uploading PDF to R2...')
        pdfR2Key = await uploadPdfToR2(pdfPath, slug)
        console.log(`  Uploaded: ${pdfR2Key}`)
      }

      // Step 5: Insert into database
      console.log('  Inserting into database...')
      const bookId = await insertBookToDb(content, slug, pdfR2Key, sortOrder)
      existingSlugs.add(slug)
      sortOrder++

      console.log(`  SUCCESS: ${content.metadata.title} (id: ${bookId})`)
      logResult({ file: pdfFile, status: 'success', slug })
      processed++
    } catch (error: any) {
      console.error(`  ERROR: ${error.message}`)
      logResult({ file: pdfFile, status: 'error', error: error.message })
      errors++

      // If rate limited, wait longer before continuing
      if (error?.status === 429) {
        console.log('  Rate limited, waiting 30s...')
        await sleep(30000)
      }
    }
  }

  // Print summary
  console.log('\n' + '=' .repeat(60))
  console.log('  IMPORT COMPLETE')
  console.log('=' .repeat(60))
  console.log(`  Processed: ${processed}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Errors: ${errors}`)
  console.log(`  Total: ${processed + skipped + errors}`)
  console.log('=' .repeat(60))

  // Update category book counts
  if (!opts.dryRun && processed > 0) {
    console.log('\nUpdating category book counts...')
    for (const catSlug of Object.keys(CATEGORIES)) {
      const { count } = await supabase
        .from('resumox_books')
        .select('*', { count: 'exact', head: true })
        .eq('category_slug', catSlug)
        .eq('is_published', true)

      await supabase
        .from('resumox_categories')
        .update({ book_count: count || 0 })
        .eq('slug', catSlug)
    }
    console.log('Category counts updated.')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nFATAL ERROR:', error)
    process.exit(1)
  })
