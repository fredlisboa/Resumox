#!/usr/bin/env tsx

/**
 * Resumox Audio Generation Script
 *
 * Generates TTS audio for book summaries using Microsoft Edge TTS (free).
 * Processes books that don't have audio yet, uploads MP3 to R2, and updates DB.
 *
 * Usage:
 *   tsx scripts/resumox-generate-audio.ts
 *   tsx scripts/resumox-generate-audio.ts --dry-run
 *   tsx scripts/resumox-generate-audio.ts --slug "o-investidor-inteligente"
 *   tsx scripts/resumox-generate-audio.ts --start-from 50
 *   tsx scripts/resumox-generate-audio.ts --force
 *   tsx scripts/resumox-generate-audio.ts --voice "pt-BR-FabioNeural"
 *
 * Required env vars (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *
 * Prerequisites:
 *   pip install edge-tts
 *   sudo apt install ffmpeg (optional, for accurate duration)
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

config({ path: resolve(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'
import {
  generateAudioForBook,
  checkTTSPrerequisites,
  DEFAULT_VOICE,
} from '../lib/tts'

// ============================================================
// Configuration
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DELAY_BETWEEN_BOOKS_MS = 2_000

// ============================================================
// CLI Args
// ============================================================

interface CliOptions {
  dryRun: boolean
  skipUpload: boolean
  force: boolean
  startFrom: number
  slug: string | null
  voice: string
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const opts: CliOptions = {
    dryRun: false,
    skipUpload: false,
    force: false,
    startFrom: 0,
    slug: null,
    voice: DEFAULT_VOICE,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg === '--skip-upload') {
      opts.skipUpload = true
    } else if (arg === '--force') {
      opts.force = true
    } else if (arg === '--start-from' && args[i + 1]) {
      opts.startFrom = parseInt(args[++i]) || 0
    } else if (arg === '--slug' && args[i + 1]) {
      opts.slug = args[++i]
    } else if (arg === '--voice' && args[i + 1]) {
      opts.voice = args[++i]
    } else if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }
  }

  return opts
}

function printUsage() {
  console.log(`
Usage: tsx scripts/resumox-generate-audio.ts [options]

Options:
  --slug <slug>       Generate audio for a specific book only
  --start-from <n>    Skip the first N books (for resuming)
  --force             Regenerate audio even if already exists
  --dry-run           Show what would be generated without doing it
  --skip-upload       Generate MP3 locally but skip R2 upload and DB update
  --voice <voice>     Edge TTS voice (default: ${DEFAULT_VOICE})
  --help, -h          Show this help message

Examples:
  tsx scripts/resumox-generate-audio.ts --dry-run
  tsx scripts/resumox-generate-audio.ts --slug "a-vontade-de-agir"
  tsx scripts/resumox-generate-audio.ts --start-from 100 --force
`)
}

// ============================================================
// Logging
// ============================================================

const LOG_DIR = resolve(__dirname, '../logs')

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true })
}

function logResult(entry: {
  slug: string
  status: string
  r2Key?: string
  durationMin?: number
  fileSizeBytes?: number
  textLength?: number
  error?: string
}) {
  ensureLogDir()
  const logFile = resolve(LOG_DIR, `resumox-audio-${new Date().toISOString().split('T')[0]}.jsonl`)
  writeFileSync(logFile, JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n', { flag: 'a' })
}

// ============================================================
// Helpers
// ============================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ============================================================
// Main
// ============================================================

async function main() {
  const opts = parseArgs()

  // Verificar variáveis de ambiente
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar configuradas em .env.local')
    process.exit(1)
  }

  if (!opts.dryRun && !opts.skipUpload) {
    const r2Vars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']
    const missing = r2Vars.filter(v => !process.env[v])
    if (missing.length > 0) {
      console.error(`Variáveis de R2 não configuradas: ${missing.join(', ')}`)
      process.exit(1)
    }
  }

  // Verificar pré-requisitos
  if (!opts.dryRun) {
    const errors = await checkTTSPrerequisites()
    const critical = errors.filter(e => e.includes('edge-tts'))
    if (critical.length > 0) {
      console.error('\nPré-requisitos faltando:')
      errors.forEach(e => console.error(`  ✗ ${e}`))
      process.exit(1)
    }
    if (errors.length > 0) {
      console.warn('\nAvisos (não críticos):')
      errors.forEach(e => console.warn(`  ⚠ ${e}`))
    }
  }

  // Query livros
  let query = supabase
    .from('resumox_books')
    .select('id, slug, title, author, audio_r2_key, audio_duration_min')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (!opts.force) {
    query = query.is('audio_r2_key', null)
  }

  if (opts.slug) {
    query = query.eq('slug', opts.slug)
  }

  const { data: books, error: booksError } = await query

  if (booksError) {
    console.error(`Erro ao buscar livros: ${booksError.message}`)
    process.exit(1)
  }

  if (!books || books.length === 0) {
    if (opts.slug) {
      console.log(`Livro "${opts.slug}" não encontrado ou já possui áudio (use --force para regenerar)`)
    } else {
      console.log('Todos os livros já possuem áudio!')
    }
    process.exit(0)
  }

  // Aplicar start-from
  let booksToProcess = books
  if (opts.startFrom > 0) {
    booksToProcess = books.slice(opts.startFrom)
  }

  // Banner
  console.log('\n' + '='.repeat(60))
  console.log('  RESUMOX AUDIO GENERATION')
  console.log('='.repeat(60))
  console.log(`  Livros a processar: ${booksToProcess.length}`)
  console.log(`  Voz: ${opts.voice}`)
  console.log(`  Dry run: ${opts.dryRun ? 'SIM' : 'não'}`)
  console.log(`  Skip upload: ${opts.skipUpload ? 'SIM' : 'não'}`)
  console.log(`  Force: ${opts.force ? 'SIM' : 'não'}`)
  console.log(`  Start from: ${opts.startFrom}`)
  if (opts.slug) console.log(`  Slug específico: ${opts.slug}`)
  console.log('='.repeat(60))
  console.log('')

  let processed = 0
  let skipped = 0
  let errors = 0
  const startTime = Date.now()

  for (let i = 0; i < booksToProcess.length; i++) {
    const book = booksToProcess[i]
    const idx = opts.startFrom + i + 1
    const total = opts.startFrom + booksToProcess.length

    console.log(`\n[${idx}/${total}] ${book.title}`)
    console.log(`  Slug: ${book.slug}`)

    // Verificar se já tem áudio (redundante com query, mas seguro para --force)
    if (book.audio_r2_key && !opts.force) {
      console.log(`  PULADO: já possui áudio (${book.audio_r2_key})`)
      logResult({ slug: book.slug, status: 'skipped_existing' })
      skipped++
      continue
    }

    // Buscar conteúdo HTML
    const { data: content, error: contentError } = await supabase
      .from('resumox_book_content')
      .select('summary_html')
      .eq('book_id', book.id)
      .single()

    if (contentError || !content?.summary_html) {
      console.error(`  ERRO: conteúdo não encontrado para book_id=${book.id}`)
      logResult({ slug: book.slug, status: 'error', error: 'content not found' })
      errors++
      continue
    }

    try {
      console.log(`  Gerando áudio...`)
      const result = await generateAudioForBook(
        book.slug,
        book.id,
        content.summary_html,
        {
          dryRun: opts.dryRun,
          skipUpload: opts.skipUpload,
          voice: opts.voice,
          supabase,
        }
      )

      if (opts.dryRun) {
        console.log(`  DRY RUN: ${result.textLength} chars de texto`)
      } else {
        console.log(`  SUCESSO: ${result.r2Key}`)
        console.log(`  Duração: ${result.durationMin} min | Tamanho: ${formatBytes(result.fileSizeBytes)}`)
      }

      logResult({
        slug: book.slug,
        status: opts.dryRun ? 'dry_run' : 'success',
        r2Key: result.r2Key,
        durationMin: result.durationMin,
        fileSizeBytes: result.fileSizeBytes,
        textLength: result.textLength,
      })
      processed++
    } catch (error: any) {
      console.error(`  ERRO: ${error.message}`)
      logResult({ slug: book.slug, status: 'error', error: error.message })
      errors++
    }

    // Delay entre livros (exceto no último)
    if (i < booksToProcess.length - 1 && !opts.dryRun) {
      await sleep(DELAY_BETWEEN_BOOKS_MS)
    }
  }

  // Sumário
  const elapsed = Math.round((Date.now() - startTime) / 1000)
  const elapsedMin = Math.floor(elapsed / 60)
  const elapsedSec = elapsed % 60

  console.log('\n' + '='.repeat(60))
  console.log('  GERAÇÃO COMPLETA')
  console.log('='.repeat(60))
  console.log(`  Processados: ${processed}`)
  console.log(`  Pulados: ${skipped}`)
  console.log(`  Erros: ${errors}`)
  console.log(`  Total: ${processed + skipped + errors}`)
  console.log(`  Tempo: ${elapsedMin}m ${elapsedSec}s`)
  console.log('='.repeat(60))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nERRO FATAL:', error)
    process.exit(1)
  })
