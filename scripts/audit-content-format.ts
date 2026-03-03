#!/usr/bin/env tsx

/**
 * Audit all books' content format in resumox_book_content
 * Checks if mindmap_json and insights_json match the expected schema.
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

interface Issue {
  field: string
  problem: string
  details?: string
}

function auditMindmap(data: any): Issue[] {
  const issues: Issue[] = []
  if (data === null) {
    issues.push({ field: 'mindmap_json', problem: 'NULL (sem conteúdo)' })
    return issues
  }

  // Check if it's an array instead of object (wrong format)
  if (Array.isArray(data)) {
    issues.push({ field: 'mindmap_json', problem: 'É um array em vez de objeto com {center_label, center_sublabel, branches}' })
    return issues
  }

  if (typeof data !== 'object') {
    issues.push({ field: 'mindmap_json', problem: `Tipo inesperado: ${typeof data}` })
    return issues
  }

  if (!data.center_label) {
    issues.push({ field: 'mindmap_json', problem: 'Falta center_label' })
  }
  if (!data.center_sublabel) {
    issues.push({ field: 'mindmap_json', problem: 'Falta center_sublabel' })
  }
  if (!Array.isArray(data.branches)) {
    // Check if branches data is at root level with wrong keys
    if (data.label || data.items) {
      issues.push({ field: 'mindmap_json', problem: 'Estrutura achatada com {label, items} em vez de {branches: [{title, icon, items}]}' })
    } else {
      issues.push({ field: 'mindmap_json', problem: 'Falta array "branches"' })
    }
    return issues
  }

  if (data.branches.length < 4) {
    issues.push({ field: 'mindmap_json', problem: `Apenas ${data.branches.length} branches (mínimo: 4)` })
  }

  for (let i = 0; i < data.branches.length; i++) {
    const b = data.branches[i]
    if (!b.title && b.label) {
      issues.push({ field: 'mindmap_json', problem: `Branch[${i}] usa "label" em vez de "title"` })
    }
    if (!b.title && !b.label) {
      issues.push({ field: 'mindmap_json', problem: `Branch[${i}] sem title` })
    }
    if (!b.icon) {
      issues.push({ field: 'mindmap_json', problem: `Branch[${i}] sem icon (emoji)` })
    }
    if (!Array.isArray(b.items) || b.items.length === 0) {
      issues.push({ field: 'mindmap_json', problem: `Branch[${i}] sem items` })
    }
  }

  return issues
}

function auditInsights(data: any): Issue[] {
  const issues: Issue[] = []
  if (data === null) {
    issues.push({ field: 'insights_json', problem: 'NULL (sem conteúdo)' })
    return issues
  }

  if (!Array.isArray(data)) {
    issues.push({ field: 'insights_json', problem: `Não é um array (tipo: ${typeof data})` })
    return issues
  }

  if (data.length === 0) {
    issues.push({ field: 'insights_json', problem: 'Array vazio' })
    return issues
  }

  if (data.length < 5) {
    issues.push({ field: 'insights_json', problem: `Apenas ${data.length} insights (mínimo: 5)` })
  }

  for (let i = 0; i < data.length; i++) {
    const ins = data[i]
    if (!ins.text) {
      if (ins.description) {
        issues.push({ field: 'insights_json', problem: `Insight[${i}] usa "description" em vez de "text"` })
      } else if (ins.title) {
        issues.push({ field: 'insights_json', problem: `Insight[${i}] usa "title" em vez de "text"` })
      } else {
        issues.push({ field: 'insights_json', problem: `Insight[${i}] sem campo "text"` })
      }
    }
    if (!ins.source_chapter) {
      if (ins.emoji || ins.title) {
        issues.push({ field: 'insights_json', problem: `Insight[${i}] sem "source_chapter" (tem campos extras: ${Object.keys(ins).join(', ')})` })
      } else {
        issues.push({ field: 'insights_json', problem: `Insight[${i}] sem "source_chapter"` })
      }
    }
    // Check for unexpected keys
    const expectedKeys = new Set(['text', 'source_chapter'])
    const extraKeys = Object.keys(ins).filter(k => !expectedKeys.has(k))
    if (extraKeys.length > 0) {
      issues.push({ field: 'insights_json', problem: `Insight[${i}] tem campos extras: ${extraKeys.join(', ')}` })
    }
  }

  return issues
}

function auditExercises(data: any): Issue[] {
  const issues: Issue[] = []
  if (data === null) {
    issues.push({ field: 'exercises_json', problem: 'NULL (sem conteúdo)' })
    return issues
  }

  if (!Array.isArray(data)) {
    issues.push({ field: 'exercises_json', problem: `Não é um array (tipo: ${typeof data})` })
    return issues
  }

  if (data.length !== 3) {
    issues.push({ field: 'exercises_json', problem: `${data.length} exercícios (esperado: 3)` })
  }

  const expectedColors = new Set(['accent', 'green', 'orange'])
  const seenColors = new Set<string>()

  for (let i = 0; i < data.length; i++) {
    const ex = data[i]
    if (!ex.title) {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] sem title` })
    }
    if (!ex.icon) {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] sem icon` })
    }
    if (!ex.color_theme) {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] sem color_theme` })
    } else if (!expectedColors.has(ex.color_theme)) {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] color_theme inválido: "${ex.color_theme}"` })
    } else {
      seenColors.add(ex.color_theme)
    }
    if (!ex.description && ex.description !== '') {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] sem description` })
    } else if (ex.description === '') {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] description vazia` })
    }
    if (!Array.isArray(ex.checklist) || ex.checklist.length === 0) {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] sem checklist` })
    }
    // Extra fields
    const expectedKeys = new Set(['title', 'icon', 'color_theme', 'description', 'template_text', 'checklist'])
    const extraKeys = Object.keys(ex).filter(k => !expectedKeys.has(k))
    if (extraKeys.length > 0) {
      issues.push({ field: 'exercises_json', problem: `Exercise[${i}] campos extras: ${extraKeys.join(', ')}` })
    }
  }

  return issues
}

async function main() {
  // Fetch all books with their content
  const { data: books, error: booksErr } = await supabase
    .from('resumox_books')
    .select('id, slug, title')
    .eq('is_published', true)
    .order('sort_order')

  if (booksErr || !books) {
    console.error('Erro ao buscar livros:', booksErr)
    process.exit(1)
  }

  console.log(`Auditando ${books.length} livros publicados...\n`)

  let totalWithIssues = 0
  const allResults: { slug: string; title: string; issues: Issue[] }[] = []

  for (const book of books) {
    const { data: content, error: contentErr } = await supabase
      .from('resumox_book_content')
      .select('mindmap_json, insights_json, exercises_json')
      .eq('book_id', book.id)
      .single()

    if (contentErr || !content) {
      allResults.push({
        slug: book.slug,
        title: book.title,
        issues: [{ field: 'resumox_book_content', problem: 'Registro não encontrado na tabela' }]
      })
      totalWithIssues++
      continue
    }

    const issues = [
      ...auditMindmap(content.mindmap_json),
      ...auditInsights(content.insights_json),
      ...auditExercises(content.exercises_json),
    ]

    allResults.push({ slug: book.slug, title: book.title, issues })
    if (issues.length > 0) totalWithIssues++
  }

  // Print results
  console.log('═'.repeat(80))
  console.log('RESULTADO DA VARREDURA')
  console.log('═'.repeat(80))

  // First: books with issues
  const booksWithIssues = allResults.filter(r => r.issues.length > 0)
  if (booksWithIssues.length > 0) {
    console.log(`\n❌ ${booksWithIssues.length} livro(s) com problemas:\n`)
    for (const r of booksWithIssues) {
      console.log(`  📕 ${r.title} (${r.slug})`)
      for (const issue of r.issues) {
        console.log(`     ⚠️  [${issue.field}] ${issue.problem}`)
      }
      console.log()
    }
  }

  // Summary: books OK
  const booksOk = allResults.filter(r => r.issues.length === 0)
  if (booksOk.length > 0) {
    console.log(`\n✅ ${booksOk.length} livro(s) OK:`)
    for (const r of booksOk) {
      console.log(`  📗 ${r.title}`)
    }
  }

  console.log(`\n${'═'.repeat(80)}`)
  console.log(`TOTAL: ${allResults.length} livros | ✅ ${booksOk.length} OK | ❌ ${booksWithIssues.length} com problemas`)
  console.log('═'.repeat(80))
}

main()
