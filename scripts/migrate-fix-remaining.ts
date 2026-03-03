#!/usr/bin/env tsx

/**
 * Migration: Fix all 21 remaining content issues.
 *
 * 1. Fill center_sublabel for 17 books
 * 2. Rename "Tema" placeholder branches + assign icons for 4 books
 * 3. Add missing insights + exercise for Pai Rico, Pai Pobre
 * 4. Add missing insights + exercise for O Poder do Hábito
 * 5. Trim Jack Welch to 3 exercises + fix color_theme
 * 6. Fill exercise descriptions for Fazendo Ideias Acontecerem
 * 7. Create full content record for Pequenos Gigantes
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

// ═══════════════════════════════════════════════════════════
// 1. center_sublabel map
// ═══════════════════════════════════════════════════════════

const SUBLABEL_MAP: Record<string, string> = {
  'metas-como-conquistar-tudo': '21 passos para alcançar seus objetivos',
  'sam-walton-made-in-america': 'A história por trás do Walmart',
  'megatendencias': '10 tendências que transformaram o mundo',
  'made-in-japan': 'A história da Sony por Akio Morita',
  'o-poder-do-menos': 'Faça menos, conquiste mais',
  'o-milionario-instantaneo': '5 princípios para a riqueza',
  'como-dominar-a-arte-de-vender': 'Técnicas de vendas de alto desempenho',
  'criatividade-seria': 'Ferramentas práticas de pensamento criativo',
  'cinco-mentes-para-o-futuro': 'As 5 competências cognitivas essenciais',
  'sim-50-formas-cientificas-de-persuadir': 'A ciência por trás da persuasão',
  'bilionarios-por-acaso': 'A verdadeira história do Facebook',
  'marketing-3-0': 'Do produto ao espírito humano',
  'jack-direto-do-coracao': 'Liderança segundo Jack Welch',
  'a-arte-da-estrategia': 'Teoria dos jogos nos negócios',
  'trading-up': 'O fenômeno do novo luxo',
  'o-apresentador-excepcional': 'Domine a arte de apresentar',
  'tudo-conta': 'Cada detalhe importa',
}

// ═══════════════════════════════════════════════════════════
// 2. Branch renames for "Tema" placeholder books
// ═══════════════════════════════════════════════════════════

const BRANCH_RENAMES: Record<string, { title: string; icon: string }[]> = {
  'a-arte-da-estrategia': [
    { title: 'Fundamentos da Estratégia', icon: '♟️' },
    { title: 'Compromissos e Credibilidade', icon: '🔒' },
    { title: 'Cooperação e Competição', icon: '🤝' },
    { title: 'Votação e Negociação', icon: '⚖️' },
    { title: 'Leilões e Preços', icon: '💰' },
    { title: 'Sinais e Incentivos', icon: '📡' },
  ],
  'trading-up': [
    { title: 'O Fenômeno do Novo Luxo', icon: '💎' },
    { title: 'Espaços Emocionais', icon: '❤️' },
    { title: 'Escada de Benefícios', icon: '📈' },
    { title: 'Práticas dos Líderes', icon: '🏆' },
    { title: 'Casos de Sucesso', icon: '⭐' },
    { title: 'A Morte no Meio', icon: '⚠️' },
  ],
  'o-apresentador-excepcional': [
    { title: 'O Método OPEN', icon: '🎤' },
    { title: 'Preparação (UP!)', icon: '🎯' },
    { title: 'Linguagem Corporal', icon: '🎭' },
    { title: 'Pecados Mortais', icon: '🚫' },
    { title: 'Lidando com Perguntas', icon: '💬' },
    { title: 'Abertura e Fechamento', icon: '⚡' },
  ],
  'tudo-conta': [
    { title: 'Filosofia do Tudo Conta', icon: '🎯' },
    { title: 'Integridade e Caráter', icon: '⚖️' },
    { title: 'Comprometimento Total', icon: '🔥' },
    { title: 'Execução e Detalhes', icon: '⚙️' },
    { title: 'Relacionamentos e Serviço', icon: '🤝' },
    { title: 'Crescimento e Disciplina', icon: '📈' },
  ],
}

// ═══════════════════════════════════════════════════════════
// 3-4. Extra insights + exercises for incomplete books
// ═══════════════════════════════════════════════════════════

const EXTRA_INSIGHTS: Record<string, any[]> = {
  'pai-rico-pai-pobre': [
    {
      text: 'A principal diferença entre ricos e pobres é como lidam com o medo de perder dinheiro. Todos perdem dinheiro — os vencedores são inspirados pela perda, enquanto os perdedores são derrotados por ela.',
      source_chapter: 'Cap. 5 — Lições 5 e 6',
    },
    {
      text: 'A inteligência financeira resolve problemas e produz dinheiro. Dinheiro sem inteligência financeira é dinheiro que logo desaparece.',
      source_chapter: 'Cap. 3 — Lição 3',
    },
  ],
  'o-poder-do-habito': [
    {
      text: 'A força de vontade é o hábito angular mais importante. E como um músculo, ela se fortalece com o uso e se esgota quando sobrecarregada.',
      source_chapter: 'Cap. 5 — A Força de Vontade',
    },
    {
      text: 'Crises organizacionais são oportunidades de ouro para reformular hábitos institucionais, porque todos aceitam que algo precisa mudar.',
      source_chapter: 'Cap. 7 — Hábitos Organizacionais',
    },
  ],
}

const EXTRA_EXERCISES: Record<string, any> = {
  'pai-rico-pai-pobre': {
    title: 'Exercício 3 — Invista em Educação Financeira',
    icon: '📚',
    color_theme: 'orange',
    description:
      'Dedique esta semana a expandir sua inteligência financeira, aplicando o princípio de Kiyosaki de que o ativo mais valioso é o conhecimento.',
    checklist: [
      'Leia um artigo ou capítulo sobre investimentos que não conhece',
      'Identifique um ativo gerador de renda que possa começar com pouco capital',
      'Converse com alguém que já investe sobre como começou',
    ],
  },
  'o-poder-do-habito': {
    title: 'Exercício 3 — Desafio do Hábito Angular',
    icon: '🔑',
    color_theme: 'orange',
    description:
      'Identifique e ative um hábito angular que pode desencadear uma reação em cadeia positiva na sua vida.',
    checklist: [
      'Escolha um hábito angular (exercício, organização ou planejamento)',
      'Pratique-o por 7 dias consecutivos sem exceções',
      'Registre que outros comportamentos mudaram como efeito cascata',
    ],
  },
}

// ═══════════════════════════════════════════════════════════
// 5. Jack Welch: trim to 3 exercises, fix colors
// ═══════════════════════════════════════════════════════════

// Keep exercises at indices 0, 2, 3 — drop index 1 ("Diferenciação da Equipe")
// Fix colors: 0=accent, 2=green(keep), 3=orange(change from accent)

// ═══════════════════════════════════════════════════════════
// 6. Fazendo Ideias Acontecerem: fill exercise descriptions
// ═══════════════════════════════════════════════════════════

const FAZENDO_DESCRIPTIONS = [
  'Organize seus projetos criativos usando o sistema de Action Steps, Backburners e Referências de Scott Belsky para transformar ideias vagas em progresso concreto.',
  'Identifique e fortaleça sua rede de apoio criativo com doers, dreamers e incrementalists que ajudarão a executar suas melhores ideias.',
  'Pratique o difícil exercício de eliminar projetos medíocres para liberar energia criativa e foco para os que realmente importam.',
]

// ═══════════════════════════════════════════════════════════
// 7. Pequenos Gigantes: full content creation
// ═══════════════════════════════════════════════════════════

const PEQUENOS_GIGANTES_CONTENT = {
  summary_html: `<h2>A Ideia Central</h2>
<p>O que acontece quando empresários talentosos decidem <strong>não crescer</strong>? Em "Pequenos Gigantes", Bo Burlingham investiga empresas que recusaram deliberadamente o caminho do crescimento a todo custo para, em vez disso, perseguir a grandeza em outra dimensão — qualidade, cultura, impacto comunitário e satisfação pessoal.</p>

<div class="highlight-box">
"Existe uma alternativa ao crescimento pelo crescimento — e ela pode ser mais lucrativa, mais gratificante e mais sustentável do que qualquer estratégia de escala."
</div>

<h2>A Escolha de Não Crescer</h2>
<p>Burlingham desafia a suposição universal de que toda empresa deve buscar crescimento máximo. Ele apresenta empresas como a <strong>Anchor Brewing</strong> (cervejaria artesanal), <strong>Zingerman's</strong> (delicatessen em Ann Arbor) e <strong>CitiStorage</strong> (armazenamento em Nova York), que tiveram oportunidades concretas de expansão e disseram não.</p>
<p>Essas empresas não são pequenas por acidente ou por falta de ambição — são pequenas <strong>por escolha estratégica</strong>. Seus fundadores entenderam que crescer poderia destruir exatamente aquilo que as tornava excepcionais.</p>

<h2>O Conceito de Mojo</h2>
<p>Burlingham identifica que todas essas empresas compartilham algo que ele chama de <strong>"mojo"</strong> — uma combinação intangível de paixão, autenticidade e conexão profunda com clientes, funcionários e comunidade.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Intimidade com o cliente:</strong> Conhecem seus clientes pelo nome e entendem suas necessidades em um nível que grandes corporações jamais alcançam.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Cultura inabalável:</strong> Funcionários genuinamente amam o que fazem e sentem-se donos do negócio, mesmo quando não são.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Vínculo com a comunidade:</strong> A empresa é parte essencial do tecido social local, contribuindo de formas que vão além de empregos e impostos.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Paixão pelo ofício:</strong> Os fundadores são artesãos antes de serem empresários — a qualidade do produto é uma questão de honra pessoal.</div>
</div>

<h2>As Empresas-Modelo</h2>

<h3>Anchor Brewing — Cerveja como Arte</h3>
<p>Fritz Maytag salvou a cervejaria da falência e poderia ter se tornado um gigante da indústria. Em vez disso, manteve a produção artesanal, investiu em qualidade obsessiva e criou essencialmente o movimento de <strong>cervejas artesanais</strong> nos EUA. Cada garrafa era um reflexo de sua filosofia pessoal.</p>

<h3>Zingerman's — O Poder da Comunidade</h3>
<p>Ari Weinzweig e Paul Saginaw transformaram uma delicatessen em Ann Arbor em uma <strong>comunidade de negócios</strong> — em vez de franquiar, criaram negócios complementares (padaria, creamery, restaurante) todos sob o guarda-chuva Zingerman's, mantendo controle e qualidade total.</p>

<h3>Clif Bar — Recusando um Bilhão</h3>
<p>Gary Erickson estava literalmente na mesa de negociação para vender a Clif Bar por centenas de milhões de dólares quando percebeu que <strong>não conseguiria apertar a mão no acordo</strong>. Manteve a empresa, cresceu nos seus termos e preservou a cultura que havia construído.</p>

<h2>Por Que Empresas Escolhem Ser Pequenas</h2>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Controle sobre o destino:</strong> Sem investidores externos pressionando por retornos, o fundador pode tomar decisões de longo prazo.</div>
</div>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Relações profundas:</strong> É impossível conhecer pessoalmente cada cliente e funcionário quando se tem 10.000 empregados.</div>
</div>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Qualidade intransigente:</strong> Escalar frequentemente significa comprometer. Esses empresários preferem não comprometer.</div>
</div>

<h2>Lições para Qualquer Empreendedor</h2>
<p>Burlingham não argumenta que crescer é errado — ele argumenta que crescer <strong>não é a única definição de sucesso</strong>. As lições dos Pequenos Gigantes aplicam-se a negócios de qualquer tamanho:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Defina sucesso nos seus termos:</strong> Antes de crescer, pergunte-se o que realmente quer da vida e do negócio.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Cultive o mojo:</strong> Invista em cultura, relacionamentos e qualidade — esses são os ativos mais difíceis de replicar.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Saiba dizer não:</strong> Recusar oportunidades de crescimento que comprometam sua essência é um ato de força, não de fraqueza.</div>
</div>

<h2>Conclusão</h2>
<p>"Pequenos Gigantes" é um lembrete poderoso de que <strong>grandeza e tamanho são coisas diferentes</strong>. As empresas mais admiráveis do mundo não são necessariamente as maiores — são aquelas que sabem exatamente quem são, o que valorizam e por que existem.</p>

<div class="highlight-box">
"O verdadeiro luxo de ser dono de um negócio não é o dinheiro — é a liberdade de construir algo que reflita quem você realmente é."
</div>`,

  mindmap_json: {
    center_label: 'PEQUENOS GIGANTES',
    center_sublabel: 'Empresas que escolhem ser grandes em vez de crescer',
    branches: [
      {
        title: 'A Escolha de Não Crescer',
        icon: '🎯',
        items: [
          'Crescimento não é a única opção',
          'Pequeno por escolha estratégica',
          'Recusar investidores e aquisições',
          'Controle sobre o próprio destino',
        ],
      },
      {
        title: 'O Conceito de Mojo',
        icon: '✨',
        items: [
          'Paixão autêntica pelo ofício',
          'Conexão profunda com clientes',
          'Cultura inabalável e genuína',
          'Vínculo forte com a comunidade',
        ],
      },
      {
        title: 'Qualidade Intransigente',
        icon: '💎',
        items: [
          'Produto como extensão da identidade',
          'Escalar = comprometer qualidade',
          'Artesãos antes de empresários',
          'Honra pessoal em cada entrega',
        ],
      },
      {
        title: 'Cultura e Pessoas',
        icon: '👥',
        items: [
          'Funcionários amam o que fazem',
          'Senso de pertencimento real',
          'Relações pessoais com cada um',
          'Crescer preservando a cultura',
        ],
      },
      {
        title: 'Empresas-Modelo',
        icon: '⭐',
        items: [
          'Anchor Brewing: cerveja como arte',
          'Zingerman\'s: comunidade de negócios',
          'Clif Bar: recusou vender por bilhões',
          'CitiStorage: excelência no nicho',
        ],
      },
      {
        title: 'Lições Centrais',
        icon: '💡',
        items: [
          'Defina sucesso nos seus termos',
          'Grandeza ≠ tamanho',
          'Saiba dizer não a oportunidades',
          'Liberdade é o verdadeiro luxo',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Crescer não é a única definição de sucesso para um negócio. Existe uma alternativa ao crescimento pelo crescimento — e ela pode ser mais lucrativa, mais gratificante e mais sustentável.',
      source_chapter: 'Introdução — A Escolha',
    },
    {
      text: 'O "mojo" de uma empresa é aquela combinação intangível de paixão, autenticidade e conexão profunda com clientes, funcionários e comunidade que grandes corporações não conseguem replicar.',
      source_chapter: 'Cap. 2 — O Conceito de Mojo',
    },
    {
      text: 'Os Pequenos Gigantes não são pequenos por acidente ou falta de ambição — são pequenos por escolha estratégica. Seus fundadores entenderam que crescer poderia destruir exatamente aquilo que os tornava excepcionais.',
      source_chapter: 'Cap. 3 — A Decisão de Não Crescer',
    },
    {
      text: 'Gary Erickson estava na mesa de negociação para vender a Clif Bar por centenas de milhões quando percebeu que não conseguiria apertar a mão. Manteve a empresa e preservou sua alma.',
      source_chapter: 'Cap. 5 — Clif Bar',
    },
    {
      text: 'O verdadeiro luxo de ser dono de um negócio não é o dinheiro — é a liberdade de construir algo que reflita quem você realmente é.',
      source_chapter: 'Cap. 8 — Conclusão',
    },
    {
      text: 'É impossível conhecer pessoalmente cada cliente e funcionário quando se tem 10.000 empregados. Os Pequenos Gigantes escolhem relações profundas sobre métricas de escala.',
      source_chapter: 'Cap. 4 — Intimidade com o Cliente',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Defina Sucesso nos Seus Termos',
      icon: '🎯',
      color_theme: 'accent',
      description:
        'Antes de crescer, reflita sobre o que realmente quer da vida e do negócio, inspirado pela filosofia dos Pequenos Gigantes.',
      checklist: [
        'Escreva sua definição pessoal de sucesso (sem citar dinheiro ou tamanho)',
        'Liste 3 coisas que perderia se dobrasse o tamanho do seu negócio',
        'Identifique seu "mojo" — o que torna seu trabalho único e especial',
      ],
    },
    {
      title: 'Exercício 2 — Auditoria de Mojo',
      icon: '✨',
      color_theme: 'green',
      description:
        'Avalie a saúde do "mojo" do seu negócio ou carreira nas quatro dimensões dos Pequenos Gigantes.',
      checklist: [
        'Avalie de 1-10 sua intimidade com clientes — você conhece seus nomes?',
        'Avalie de 1-10 a paixão da sua equipe — eles amam o que fazem?',
        'Avalie de 1-10 seu vínculo com a comunidade local',
        'Identifique uma ação concreta para melhorar a dimensão mais fraca',
      ],
    },
    {
      title: 'Exercício 3 — Pratique Dizer Não',
      icon: '🚫',
      color_theme: 'orange',
      description:
        'Inspirado nos fundadores que recusaram crescer, identifique oportunidades que parecem tentadoras mas comprometeriam sua essência.',
      checklist: [
        'Liste 3 oportunidades de crescimento que você tem considerado',
        'Para cada uma, pergunte: isso fortalece ou dilui meu mojo?',
        'Escolha pelo menos uma para recusar conscientemente esta semana',
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════
// Main execution
// ═══════════════════════════════════════════════════════════

async function getBookAndContent(slug: string) {
  const { data: book } = await supabase
    .from('resumox_books')
    .select('id, slug, title')
    .eq('slug', slug)
    .single()
  if (!book) return null

  const { data: content } = await supabase
    .from('resumox_book_content')
    .select('id, mindmap_json, insights_json, exercises_json')
    .eq('book_id', book.id)
    .single()

  return { book, content }
}

async function updateContent(contentId: string, update: any, label: string) {
  if (DRY_RUN) {
    console.log(`  🔧 [DRY] ${label}`)
    return true
  }
  const { error } = await supabase
    .from('resumox_book_content')
    .update(update)
    .eq('id', contentId)
  if (error) {
    console.error(`  ❌ ${label}: ${error.message}`)
    return false
  }
  console.log(`  ✅ ${label}`)
  return true
}

async function main() {
  if (DRY_RUN) console.log('🔍 DRY RUN\n')

  let fixed = 0
  let errors = 0

  // ── 1 & 2: Fix center_sublabel + branch renames ──

  const allSlugs = new Set([
    ...Object.keys(SUBLABEL_MAP),
    ...Object.keys(BRANCH_RENAMES),
  ])

  for (const slug of allSlugs) {
    const result = await getBookAndContent(slug)
    if (!result?.content) continue

    const mm = { ...(result.content.mindmap_json as any) }
    let changed = false

    // Fix sublabel
    if (SUBLABEL_MAP[slug] && !mm.center_sublabel) {
      mm.center_sublabel = SUBLABEL_MAP[slug]
      changed = true
    }

    // Fix branch renames
    if (BRANCH_RENAMES[slug] && mm.branches) {
      const renames = BRANCH_RENAMES[slug]
      for (let i = 0; i < Math.min(renames.length, mm.branches.length); i++) {
        if (mm.branches[i].title === 'Tema' || mm.branches[i].icon === '🔷') {
          mm.branches[i] = {
            ...mm.branches[i],
            title: renames[i].title,
            icon: renames[i].icon,
          }
          changed = true
        }
      }
    }

    if (changed) {
      const ok = await updateContent(
        result.content.id,
        { mindmap_json: mm },
        `${result.book.title} → mindmap (sublabel + branches)`
      )
      ok ? fixed++ : errors++
    }
  }

  // ── 3 & 4: Add missing insights + exercises ──

  for (const slug of Object.keys(EXTRA_INSIGHTS)) {
    const result = await getBookAndContent(slug)
    if (!result?.content) continue

    const currentInsights = (result.content.insights_json as any[]) || []
    const currentExercises = (result.content.exercises_json as any[]) || []

    const newInsights = [...currentInsights, ...EXTRA_INSIGHTS[slug]]
    const newExercises = EXTRA_EXERCISES[slug]
      ? [...currentExercises, EXTRA_EXERCISES[slug]]
      : currentExercises

    const ok = await updateContent(
      result.content.id,
      { insights_json: newInsights, exercises_json: newExercises },
      `${result.book.title} → +${EXTRA_INSIGHTS[slug].length} insights, +${EXTRA_EXERCISES[slug] ? 1 : 0} exercício`
    )
    ok ? fixed++ : errors++
  }

  // ── 5: Jack Welch — trim to 3 exercises + fix colors ──

  {
    const result = await getBookAndContent('jack-direto-do-coracao')
    if (result?.content) {
      const exercises = (result.content.exercises_json as any[]) || []
      if (exercises.length === 4) {
        // Keep indices 0, 2, 3 — drop 1 ("Diferenciação da Equipe")
        const trimmed = [
          { ...exercises[0], color_theme: 'accent' }, // Auditoria de Franqueza
          { ...exercises[2], color_theme: 'green' }, // Work-Out Pessoal
          { ...exercises[3], color_theme: 'orange' }, // #1 ou #2 na Sua Carreira
        ]
        const ok = await updateContent(
          result.content.id,
          { exercises_json: trimmed },
          `${result.book.title} → exercises: 4→3, cores corrigidas`
        )
        ok ? fixed++ : errors++
      }
    }
  }

  // ── 6: Fazendo Ideias Acontecerem — fill descriptions ──

  {
    const result = await getBookAndContent('fazendo-ideias-acontecerem')
    if (result?.content) {
      const exercises = (result.content.exercises_json as any[]) || []
      const patched = exercises.map((ex: any, i: number) => ({
        ...ex,
        description: FAZENDO_DESCRIPTIONS[i] || ex.description,
      }))
      const ok = await updateContent(
        result.content.id,
        { exercises_json: patched },
        `Fazendo Ideias Acontecerem → descriptions preenchidas`
      )
      ok ? fixed++ : errors++
    }
  }

  // ── 7: Pequenos Gigantes — create content record ──

  {
    const { data: book } = await supabase
      .from('resumox_books')
      .select('id, title')
      .eq('slug', 'pequenos-gigantes')
      .single()

    if (book) {
      // Check if record now exists
      const { data: existing } = await supabase
        .from('resumox_book_content')
        .select('id')
        .eq('book_id', book.id)
        .single()

      if (!existing) {
        if (DRY_RUN) {
          console.log(`  🔧 [DRY] Pequenos Gigantes → criar registro completo`)
          fixed++
        } else {
          const { error } = await supabase.from('resumox_book_content').insert({
            book_id: book.id,
            summary_html: PEQUENOS_GIGANTES_CONTENT.summary_html,
            mindmap_json: PEQUENOS_GIGANTES_CONTENT.mindmap_json,
            insights_json: PEQUENOS_GIGANTES_CONTENT.insights_json,
            exercises_json: PEQUENOS_GIGANTES_CONTENT.exercises_json,
          })
          if (error) {
            console.error(`  ❌ Pequenos Gigantes: ${error.message}`)
            errors++
          } else {
            console.log(`  ✅ Pequenos Gigantes → registro completo criado`)
            fixed++
          }
        }
      } else {
        console.log(`  ⏭️  Pequenos Gigantes → registro já existe, pulando`)
      }
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`RESULTADO${DRY_RUN ? ' (DRY RUN)' : ''}`)
  console.log(`${'═'.repeat(60)}`)
  console.log(`  Corrigidos: ${fixed}`)
  console.log(`  Erros: ${errors}`)
  console.log(`${'═'.repeat(60)}`)
}

main()
