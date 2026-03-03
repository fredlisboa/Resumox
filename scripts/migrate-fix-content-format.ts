#!/usr/bin/env tsx

/**
 * Migration script: Fix mindmap_json, insights_json, and exercises_json
 * for all books with wrong schema format.
 *
 * Fixes:
 * 1. mindmap_json: array -> {center_label, center_sublabel, branches}
 * 2. mindmap_json branches: label -> title, add icon if missing
 * 3. mindmap_json: add center_label / center_sublabel if missing
 * 4. insights_json: {emoji, title, description} -> {text, source_chapter}
 * 5. exercises_json: add empty checklist if missing, move objective->description if empty
 * 6. exercises_json: remove extra fields (duration, objective, template_text_note, etc.)
 */

import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Emoji map for branch titles (best-effort assignment) ──

const BRANCH_EMOJI_MAP: Record<string, string> = {
  // Generic business/strategy
  'liderança': '👑', 'lideranca': '👑', 'líder': '👑', 'lider': '👑',
  'gestão': '🏢', 'gestao': '🏢', 'gerenciamento': '🏢', 'administração': '🏢',
  'estratégia': '♟️', 'estrategia': '♟️', 'planejamento': '📋',
  'inovação': '💡', 'inovacao': '💡', 'criatividade': '🎨', 'criativo': '🎨',
  'empreendedorismo': '🚀', 'empreendedor': '🚀', 'startup': '🚀',
  'negociação': '🤝', 'negociacao': '🤝', 'acordo': '🤝',
  'vendas': '🎯', 'venda': '🎯', 'persuasão': '🎯', 'persuasao': '🎯',
  'marketing': '📢', 'marca': '📢', 'branding': '📢',
  'comunicação': '🗣️', 'comunicacao': '🗣️', 'apresentação': '🗣️',
  'finanças': '💰', 'financas': '💰', 'dinheiro': '💰', 'investimento': '💰', 'riqueza': '💰',
  'produtividade': '⚡', 'eficiência': '⚡', 'eficiencia': '⚡', 'tempo': '⏰', 'timing': '⏰',
  'hábito': '🔄', 'habito': '🔄', 'rotina': '🔄', 'disciplina': '🔄',
  'mentalidade': '🧠', 'mindset': '🧠', 'pensamento': '🧠', 'mente': '🧠', 'psicologia': '🧠',
  'pessoas': '👥', 'equipe': '👥', 'time': '👥', 'talento': '👥', 'colaboração': '👥',
  'cultura': '🌍', 'valores': '🌍', 'propósito': '🌟', 'proposito': '🌟', 'missão': '🌟',
  'cliente': '❤️', 'clientes': '❤️', 'experiência': '❤️', 'experiencia': '❤️', 'serviço': '❤️',
  'tecnologia': '💻', 'digital': '💻', 'dados': '📊',
  'crescimento': '📈', 'escala': '📈', 'expansão': '📈',
  'mudança': '🔄', 'mudanca': '🔄', 'transformação': '🔄', 'adaptação': '🔄',
  'execução': '⚙️', 'execucao': '⚙️', 'ação': '⚡', 'acao': '⚡', 'implementação': '⚙️',
  'risco': '⚠️', 'desafio': '🏔️', 'obstáculo': '🏔️', 'problema': '🏔️',
  'decisão': '🎲', 'decisao': '🎲', 'julgamento': '⚖️',
  'aprendizado': '📚', 'educação': '📚', 'educacao': '📚', 'conhecimento': '📚',
  'qualidade': '✨', 'excelência': '✨', 'excelencia': '✨',
  'foco': '🎯', 'simplicidade': '✂️', 'simplificação': '✂️',
  'visão': '🔭', 'visao': '🔭', 'futuro': '🔭',
  'resiliência': '💪', 'resiliencia': '💪', 'perseverança': '💪', 'superação': '💪',
  'network': '🔗', 'networking': '🔗', 'relacionamento': '🔗', 'conexão': '🔗',
  'poder': '⚡', 'influência': '🎭', 'influencia': '🎭', 'autoridade': '🎭',
  'competição': '🏆', 'competicao': '🏆', 'vantagem': '🏆',
  'resultado': '📊', 'performance': '📊', 'métrica': '📊',
  'motivação': '🔥', 'motivacao': '🔥', 'paixão': '🔥', 'energia': '🔥',
  'bem-estar': '🌱', 'saúde': '🌱', 'saude': '🌱', 'equilíbrio': '⚖️',
}

const FALLBACK_EMOJIS = ['🔷', '🔶', '🟣', '🟢', '🔴', '🟡', '⭐', '💎']

function guessEmoji(branchTitle: string): string {
  const lower = branchTitle.toLowerCase()
  for (const [keyword, emoji] of Object.entries(BRANCH_EMOJI_MAP)) {
    if (lower.includes(keyword)) return emoji
  }
  // Hash-based fallback for consistency
  let hash = 0
  for (let i = 0; i < lower.length; i++) hash = ((hash << 5) - hash + lower.charCodeAt(i)) | 0
  return FALLBACK_EMOJIS[Math.abs(hash) % FALLBACK_EMOJIS.length]
}

// ── Fix functions ──

interface FixResult {
  mindmap_json?: any
  insights_json?: any
  exercises_json?: any
}

function fixMindmap(data: any, bookTitle: string): any | null {
  if (data === null) return null // Can't fix null

  // Case 1: It's an array (completely wrong structure)
  if (Array.isArray(data)) {
    return {
      center_label: bookTitle.toUpperCase(),
      center_sublabel: '',
      branches: data.map((item: any) => ({
        title: item.title || item.label || item.name || 'Tema',
        icon: item.icon || guessEmoji(item.title || item.label || item.name || ''),
        items: Array.isArray(item.items) ? item.items : [],
        ...(item.full_width ? { full_width: true } : {}),
      })),
    }
  }

  if (typeof data !== 'object') return null

  let changed = false
  const fixed = { ...data }

  // Fix missing center_label
  if (!fixed.center_label) {
    fixed.center_label = bookTitle.toUpperCase()
    changed = true
  }

  // Fix missing center_sublabel
  if (!fixed.center_sublabel && fixed.center_sublabel !== '') {
    fixed.center_sublabel = ''
    changed = true
  }

  // Fix branches
  if (Array.isArray(fixed.branches)) {
    const fixedBranches = fixed.branches.map((b: any) => {
      const branch: any = { ...b }
      let branchChanged = false

      // Fix label -> title
      if (!branch.title && branch.label) {
        branch.title = branch.label
        delete branch.label
        branchChanged = true
      }

      // Fix missing icon
      if (!branch.icon) {
        branch.icon = guessEmoji(branch.title || branch.label || '')
        branchChanged = true
      }

      if (branchChanged) changed = true
      return branch
    })
    fixed.branches = fixedBranches
  }

  return changed ? fixed : null
}

function fixInsights(data: any): any | null {
  if (!Array.isArray(data) || data.length === 0) return null

  let changed = false
  const fixed = data.map((insight: any) => {
    const result: any = {}

    // Fix description -> text
    if (!insight.text && insight.description) {
      result.text = insight.description
      changed = true
    } else if (insight.text) {
      result.text = insight.text
    } else {
      // Last resort: use title as text
      result.text = insight.title || ''
      changed = true
    }

    // Fix missing source_chapter
    if (insight.source_chapter) {
      result.source_chapter = insight.source_chapter
    } else {
      // Try to build from title if it looks like a chapter reference
      if (insight.title && insight.title !== result.text) {
        result.source_chapter = insight.title
      } else {
        result.source_chapter = 'Insight do livro'
      }
      changed = true
    }

    // Check if there were extra keys that we're stripping
    const extraKeys = Object.keys(insight).filter(
      (k) => !['text', 'source_chapter'].includes(k)
    )
    if (extraKeys.length > 0) changed = true

    return result
  })

  return changed ? fixed : null
}

function fixExercises(data: any): any | null {
  if (!Array.isArray(data) || data.length === 0) return null

  let changed = false
  const fixed = data.map((ex: any) => {
    const result: any = {
      title: ex.title,
      icon: ex.icon,
      color_theme: ex.color_theme,
      description: ex.description,
      checklist: ex.checklist,
    }

    // Fix empty description: use objective if available
    if ((!result.description || result.description === '') && ex.objective) {
      result.description = ex.objective
      changed = true
    }

    // Fix missing checklist
    if (!Array.isArray(result.checklist) || result.checklist.length === 0) {
      // If there's a steps array or similar, use that
      if (Array.isArray(ex.steps)) {
        result.checklist = ex.steps
        changed = true
      } else {
        // Generate from description
        result.checklist = ['Concluir este exercício']
        changed = true
      }
    }

    // Preserve template_text if it exists
    if (ex.template_text) {
      result.template_text = ex.template_text
    }

    // Check for extra fields being stripped
    const knownKeys = new Set(['title', 'icon', 'color_theme', 'description', 'template_text', 'checklist'])
    const extraKeys = Object.keys(ex).filter((k) => !knownKeys.has(k))
    if (extraKeys.length > 0) changed = true

    return result
  })

  return changed ? fixed : null
}

// ── Main ──

async function main() {
  if (DRY_RUN) console.log('🔍 DRY RUN — nenhuma alteração será feita\n')

  // Fetch all published books
  const { data: books, error: booksErr } = await supabase
    .from('resumox_books')
    .select('id, slug, title')
    .eq('is_published', true)
    .order('sort_order')

  if (booksErr || !books) {
    console.error('Erro ao buscar livros:', booksErr)
    process.exit(1)
  }

  console.log(`Processando ${books.length} livros...\n`)

  let fixedCount = 0
  let skippedCount = 0
  let errorCount = 0
  const fixedBooks: string[] = []
  const errorBooks: string[] = []

  for (const book of books) {
    const { data: content, error: contentErr } = await supabase
      .from('resumox_book_content')
      .select('id, mindmap_json, insights_json, exercises_json')
      .eq('book_id', book.id)
      .single()

    if (contentErr || !content) {
      // No content record — nothing to fix
      continue
    }

    const fixedMindmap = fixMindmap(content.mindmap_json, book.title)
    const fixedInsights = fixInsights(content.insights_json)
    const fixedExercises = fixExercises(content.exercises_json)

    if (!fixedMindmap && !fixedInsights && !fixedExercises) {
      skippedCount++
      continue
    }

    const update: any = {}
    const changes: string[] = []

    if (fixedMindmap) {
      update.mindmap_json = fixedMindmap
      changes.push('mindmap')
    }
    if (fixedInsights) {
      update.insights_json = fixedInsights
      changes.push('insights')
    }
    if (fixedExercises) {
      update.exercises_json = fixedExercises
      changes.push('exercises')
    }

    if (DRY_RUN) {
      console.log(`  🔧 ${book.title} → corrigir: ${changes.join(', ')}`)
      fixedCount++
      fixedBooks.push(book.title)
      continue
    }

    const { error: updateErr } = await supabase
      .from('resumox_book_content')
      .update(update)
      .eq('id', content.id)

    if (updateErr) {
      console.error(`  ❌ ${book.title}: ${updateErr.message}`)
      errorCount++
      errorBooks.push(book.title)
    } else {
      console.log(`  ✅ ${book.title} → ${changes.join(', ')}`)
      fixedCount++
      fixedBooks.push(book.title)
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`RESULTADO${DRY_RUN ? ' (DRY RUN)' : ''}`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`  Corrigidos: ${fixedCount}`)
  console.log(`  Sem alteração: ${skippedCount}`)
  console.log(`  Erros: ${errorCount}`)
  if (errorBooks.length > 0) {
    console.log(`\n  Livros com erro:`)
    errorBooks.forEach((b) => console.log(`    ❌ ${b}`))
  }
  console.log(`${'═'.repeat(60)}`)
}

main()
