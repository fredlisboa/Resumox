#!/usr/bin/env tsx

/**
 * Insert book: As 48 Leis do Poder (The 48 Laws of Power) by Robert Greene
 */

import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

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

const book: BookData = {
  slug: 'as-48-leis-do-poder',
  metadata: {
    title: 'As 48 Leis do Poder',
    original_title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    year: 1998,
    category_slug: 'psicologia',
    category_label: 'Psicologia',
    category_emoji: '🧠',
    reading_time_min: 14,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Robert Greene passou anos estudando as vidas de figuras históricas como Luís XIV, Maquiavel, Sun Tzu, Bismarck, Catarina de Médici e centenas de outros estrategistas, cortesãos e líderes. O resultado é uma obra monumental que destila <strong>3.000 anos de história do poder</strong> em 48 leis práticas e implacáveis.</p>
<p>A premissa de Greene é direta: o poder é um jogo social inevitável. Você pode fingir que não participa, mas isso apenas o coloca em desvantagem. As 48 leis não são um convite à manipulação irresponsável — são um <strong>manual de compreensão da natureza humana</strong>, das dinâmicas de influência e das estratégias que governam todas as interações sociais, desde cortes renascentistas até salas de reunião modernas.</p>

<div class="highlight-box">
"O jogo do poder é inevitável. Você não pode optar por não jogar — apenas por não estar preparado. E quem não está preparado será sempre peão no jogo de alguém."
</div>

<h2>O Domínio das Aparências</h2>

<h3>Nunca Ofusque o Mestre (Lei 1)</h3>
<p>A primeira lei é possivelmente a mais importante para quem está começando uma carreira ou entrando em uma nova organização. Faça seus superiores se sentirem <strong>confortavelmente superiores</strong>. Se você revelar talentos demais, pode inspirar medo e insegurança — em vez de gratidão. Nicolau Fouquet, ministro das finanças de Luís XIV, ofereceu ao rei uma festa tão espetacular em seu palácio Vaux-le-Vicomte que ofuscou a própria corte. O resultado? Fouquet foi preso e passou o resto da vida na cadeia.</p>
<p>A reversa é igualmente poderosa: se você fizer o mestre brilhar, será recompensado com confiança e proximidade. <strong>Galileu</strong> dedicou a descoberta das luas de Júpiter aos Médici, chamando-as de "Estrelas Mediceanas". O resultado foi mecenato vitalício.</p>

<h3>Diga Sempre Menos do Que o Necessário (Lei 4)</h3>
<p>Pessoas poderosas impressionam e intimidam dizendo menos. Quanto mais você fala, mais provável é que diga algo tolo ou reveele informações que podem ser usadas contra você. O silêncio faz as pessoas se sentirem desconfortáveis — e quando estão desconfortáveis, tentam preencher o vazio, revelando suas próprias fraquezas e intenções.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>O poder do mistério:</strong> Luís XIV era mestre em dizer pouco. Quando cortesãos vinham com pedidos elaborados, ele frequentemente respondia apenas: "Verei." Essa resposta mantinha todos em suspense, fortalecendo seu controle sobre a corte.</div>
</div>

<h3>Proteja Sua Reputação com a Vida (Lei 5)</h3>
<p>A reputação é a pedra angular do poder. Através dela, você pode intimidar e vencer sem precisar agir. Construa uma reputação baseada em uma qualidade marcante — generosidade, honestidade, astúcia — e depois <strong>defenda-a ferozmente</strong>. Quando sua reputação é sólida, ela trabalha por você mesmo quando você não está presente. Quando é destruída, você fica vulnerável a ataques de todos os lados.</p>

<h2>A Arte da Estratégia</h2>

<h3>Oculte Suas Intenções (Lei 3)</h3>
<p>Mantenha as pessoas no escuro, incapazes de prever seus movimentos. Use cortinas de fumaça — ações falsas, distrações, histórias enganosas — para desviar a atenção de seus verdadeiros objetivos. Quando suas intenções são transparentes, você perde toda vantagem estratégica. <strong>Bismarck</strong> era mestre nisso: fingia apoiar políticas que secretamente planejava sabotar, mantendo seus adversários permanentemente desorientados.</p>

<h3>Faça Outros Trabalharem por Você (Lei 7)</h3>
<p>Use a sabedoria, o conhecimento e o trabalho dos outros para avançar sua causa. Essa estratégia não apenas economiza tempo e energia — confere a você uma <strong>aura de eficiência e velocidade</strong> quase sobrenatural. Thomas Edison não inventou a lâmpada sozinho; ele montou uma equipe de engenheiros brilhantes em Menlo Park e depois ficou com o crédito. O mundo lembra o nome dele, não dos engenheiros.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Economia de energia:</strong> Nunca faça você mesmo o que outros podem fazer por você. Sua energia é limitada — concentre-a onde gera mais impacto.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>O crédito é o poder:</strong> Quem leva o crédito detém a narrativa. A narrativa é mais poderosa do que o trabalho em si.</div>
</div>

<h3>Esmague Completamente Seu Inimigo (Lei 15)</h3>
<p>Se você deixar uma brasa acesa, ela pode reacender o fogo. Todos os grandes líderes — de Moisés a Mao Tsé-tung — entenderam que um inimigo derrotado pela metade é mais perigoso do que um intacto. Quando enfrentar uma ameaça, <strong>não pare até eliminá-la completamente</strong>. Misericórdia com inimigos é crueldade consigo mesmo, porque eles voltarão mais fortes e mais ressentidos.</p>

<div class="highlight-box">
"Aplique este princípio de forma simbólica: quando negociar, não deixe migalhas de ressentimento. Quando competir, vença tão decisivamente que o adversário não tenha energia para uma revanche."
</div>

<h2>O Jogo Social</h2>

<h3>Corteje a Atenção a Todo Custo (Lei 6)</h3>
<p>O mundo julga pela aparência. Se você for invisível, será ignorado. Prefira ser atacado e caluniado a ser ignorado — <strong>a atenção negativa é infinitamente melhor que nenhuma atenção</strong>. P.T. Barnum entendeu isso perfeitamente: criava controvérsias deliberadas sobre seus espetáculos, sabendo que cada polêmica atrairia mais público.</p>

<h3>Aprenda a Usar a Ausência (Lei 16)</h3>
<p>O excesso de presença diminui seu valor. Depois de estabelecer sua imagem, <strong>afaste-se por um tempo</strong>. A ausência cria respeito e admiração. Napoleão entendeu esse princípio ao contrário: na Ilha de Elba, sua ausência da França criou tamanha saudade que ele pôde retornar triunfante. Mas quando ficou presente demais após Waterloo, tornou-se dispensável.</p>

<h3>Conheça Com Quem Está Lidando (Lei 19)</h3>
<p>Existem diferentes tipos de pessoas no jogo do poder, e cada uma requer uma abordagem diferente. A pior coisa que você pode fazer é <strong>ofender a pessoa errada</strong>. Alguns adversários parecem fracos mas guardam rancor por décadas. Outros parecem insignificantes mas têm conexões poderosas. Antes de agir contra alguém, estude profundamente quem é essa pessoa e quais são suas redes de influência.</p>

<h2>O Poder do Tempo e da Paciência</h2>

<h3>Aja com Ousadia (Lei 28)</h3>
<p>Se você já decidiu agir, aja com ousadia total. A hesitação cria problemas — a ousadia os elimina. Erros cometidos com audácia são corrigidos com audácia. A timidez é perigosa porque demonstra <strong>falta de convicção</strong>. Quando Cortés chegou ao México com apenas 500 homens, queimou seus navios para que não houvesse possibilidade de recuo. Essa ousadia extrema paralisou os astecas e motivou seus soldados.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>A audácia como ferramenta:</strong> Pessoas ousadas irradiam confiança, e confiança atrai seguidores. Quanto mais ousado seu primeiro movimento, mais respeito você conquista — mesmo que o resultado não seja perfeito.</div>
</div>

<h3>Planeje Até o Final (Lei 29)</h3>
<p>A maioria das pessoas planeja apenas o próximo passo. Pessoas poderosas <strong>visualizam o final do caminho</strong> antes de dar o primeiro passo. Planeje cenários, antecipe obstáculos e prepare respostas. Quando você sabe onde quer chegar, cada desvio se torna uma correção de rota — não uma derrota.</p>

<h3>Domine a Arte do Timing (Lei 35)</h3>
<p>Nunca demonstre pressa — a pressa revela falta de controle. Aprenda a <strong>farejar o espírito de cada época</strong> e a adaptar-se ao ritmo certo. Os grandes mestres do poder sabem quando esperar e quando atacar. Tokugawa Ieyasu esperou pacientemente por décadas enquanto seus rivais se destruíam mutuamente. Quando finalmente agiu, unificou o Japão praticamente sem resistência.</p>

<h2>Defesa e Adaptação</h2>

<h3>Descubra o Ponto Fraco de Cada Pessoa (Lei 33)</h3>
<p>Todo ser humano tem uma fraqueza — uma insegurança, uma necessidade incontrolável, uma emoção que não consegue dominar. Encontre essa brecha e você terá a <strong>chave da influência</strong>. Pode ser vaidade, medo, ganância ou a necessidade desesperada de ser amado. Quando você sabe o que uma pessoa mais deseja ou teme, pode guiá-la como uma marionete.</p>

<h3>Pense Como Quiser, Mas Comporte-se Como os Outros (Lei 38)</h3>
<p>Compartilhar abertamente ideias não convencionais fará com que as pessoas o vejam como ameaça. Aprenda a mesclar-se na multidão. <strong>Guarde seus pensamentos mais ousados para si mesmo</strong> e revele-os apenas para aliados de confiança. Sócrates foi condenado à morte não por suas ideias, mas por expressá-las publicamente de forma que ameaçava a ordem vigente.</p>

<h3>Assuma a Ausência de Forma (Lei 48)</h3>
<p>A última lei é talvez a mais profunda. Não se apegue a planos rígidos, identidades fixas ou estratégias permanentes. <strong>A água assume a forma do recipiente</strong> e, mesmo sendo suave, desgasta a pedra mais dura. Ser flexível e adaptável é a mais poderosa posição estratégica. Quando seu adversário não pode prever suas ações porque você não tem forma fixa, ele não pode se defender.</p>

<div class="highlight-box">
"Nada no mundo é mais suave e mais fraco que a água; no entanto, para dissolver o que é duro e inflexível, nada pode superá-la. O fraco vence o forte, o suave vence o duro. Todos sabem disso, mas poucos praticam."
— Lao Tzu, citado por Greene
</div>

<h2>Armadilhas do Poder</h2>

<h3>Erros Fatais a Evitar</h3>
<p>Greene alerta que o maior perigo não é ser atacado por inimigos — é a <strong>autocomplacência</strong>. O poder corrompe especialmente porque nos faz acreditar que somos invulneráveis. Os reis mais poderosos caíram não por inimigos externos, mas por perder o contato com a realidade.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Não confie demais em amigos (Lei 2):</strong> Amigos podem trair por inveja. Ex-inimigos convertidos em aliados são frequentemente mais leais, pois têm mais a provar.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Não construa fortalezas (Lei 18):</strong> O isolamento é perigoso. Quem se isola perde informações e aliados — os dois recursos mais valiosos no jogo do poder.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Evite os infelizes (Lei 10):</strong> A infelicidade é contagiosa. Pessoas perpetuamente infelizes drenam sua energia e mancham sua reputação por associação.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Não ultrapasse a marca (Lei 47):</strong> Na vitória, saiba quando parar. A arrogância após uma conquista planta as sementes da próxima derrota.</div>
</div>

<h2>Conclusão</h2>
<p>As 48 Leis do Poder não são um manual para vilões — são um <strong>mapa da realidade das relações humanas</strong>. Greene nos mostra que o poder existe em todas as interações: entre colegas, entre amigos, entre parceiros e entre nações. Ignorar essas dinâmicas não nos torna virtuosos — nos torna vulneráveis.</p>
<p>O verdadeiro mestre do poder, segundo Greene, não é aquele que domina os outros pela força, mas aquele que <strong>compreende tão profundamente a natureza humana</strong> que pode navegar qualquer situação social com elegância e eficácia. Ele sabe quando avançar e quando recuar, quando falar e quando calar, quando ser visível e quando desaparecer.</p>
<p>A sabedoria final do livro é paradoxal: o maior poder é aquele que <strong>não precisa ser exercido</strong>. Quando você domina as 48 leis, as pessoas naturalmente gravitam em sua direção — não por medo, mas por admiração pela sua competência em navegar o mundo com maestria.</p>

<div class="highlight-box">
"O supremo poder é fazer com que as pessoas trabalhem para você voluntariamente — não por coerção, mas porque acreditam que seus interesses e os seus estão alinhados."
</div>`,

  mindmap_json: {
    center_label: 'AS 48 LEIS DO PODER',
    center_sublabel: '3.000 Anos de Estratégia do Poder',
    branches: [
      {
        title: 'Domínio das Aparências',
        icon: '🎭',
        items: [
          'Nunca ofusque o mestre',
          'Diga menos que o necessário',
          'Proteja sua reputação',
          'Corteje a atenção',
        ],
      },
      {
        title: 'Estratégia e Planejamento',
        icon: '♟️',
        items: [
          'Oculte suas intenções',
          'Planeje até o final',
          'Esmague o inimigo totalmente',
          'Domine a arte do timing',
        ],
      },
      {
        title: 'Ousadia e Ação',
        icon: '⚔️',
        items: [
          'Aja sempre com ousadia',
          'Queime os navios',
          'Concentre suas forças',
          'Surpreenda com imprevisibilidade',
        ],
      },
      {
        title: 'Jogo Social',
        icon: '👑',
        items: [
          'Conheça com quem lida',
          'Use a ausência estrategicamente',
          'Descubra pontos fracos',
          'Comporte-se como os outros',
        ],
      },
      {
        title: 'Armadilhas a Evitar',
        icon: '⚠️',
        items: [
          'Não confie demais em amigos',
          'Não se isole em fortalezas',
          'Evite os perpetuamente infelizes',
          'Na vitória, saiba parar',
        ],
        full_width: true,
      },
      {
        title: 'Adaptação e Fluidez',
        icon: '🌊',
        items: [
          'Assuma a ausência de forma',
          'Flexibilidade vence rigidez',
          'A água desgasta a pedra',
          'Não se prenda a planos fixos',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'O jogo do poder é inevitável. Você não pode optar por não jogar — apenas por não estar preparado. E quem não está preparado será sempre peão no jogo de alguém.',
      source_chapter: 'Prefácio',
    },
    {
      text: 'Faça seus superiores se sentirem confortavelmente superiores. Se você revelar talentos demais, pode inspirar medo e insegurança — em vez de gratidão. Fouquet ofuscou Luís XIV e passou o resto da vida na cadeia.',
      source_chapter: 'Lei 1 — Nunca Ofusque o Mestre',
    },
    {
      text: 'Quanto mais você fala, mais provável é que diga algo tolo. O silêncio faz as pessoas se sentirem desconfortáveis — e quando estão desconfortáveis, revelam suas próprias fraquezas e intenções.',
      source_chapter: 'Lei 4 — Diga Sempre Menos Que o Necessário',
    },
    {
      text: 'Se você deixar uma brasa acesa, ela pode reacender o fogo. Um inimigo derrotado pela metade é mais perigoso do que um intacto. Misericórdia com inimigos é crueldade consigo mesmo.',
      source_chapter: 'Lei 15 — Esmague Completamente Seu Inimigo',
    },
    {
      text: 'A hesitação cria problemas — a ousadia os elimina. Erros cometidos com audácia são corrigidos com audácia. Cortés queimou seus navios para que não houvesse possibilidade de recuo.',
      source_chapter: 'Lei 28 — Aja com Ousadia',
    },
    {
      text: 'Todo ser humano tem uma fraqueza — uma insegurança, uma necessidade incontrolável, uma emoção que não consegue dominar. Encontre essa brecha e você terá a chave da influência.',
      source_chapter: 'Lei 33 — Descubra o Ponto Fraco de Cada Pessoa',
    },
    {
      text: 'Nada no mundo é mais suave e mais fraco que a água; no entanto, para dissolver o que é duro e inflexível, nada pode superá-la. O fraco vence o forte, o suave vence o duro.',
      source_chapter: 'Lei 48 — Assuma a Ausência de Forma',
    },
    {
      text: 'O supremo poder é fazer com que as pessoas trabalhem para você voluntariamente — não por coerção, mas porque acreditam que seus interesses e os seus estão alinhados.',
      source_chapter: 'Conclusão',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Mapeie Sua Dinâmica de Poder',
      icon: '🗺️',
      color_theme: 'accent',
      description:
        'Analise as relações de poder no seu ambiente profissional. Identifique quem detém influência real (não apenas formal), quais são as alianças e quais são os pontos de tensão.',
      template_text:
        'No meu ambiente, quem tem poder real é: [PESSOA]. Minha posição na dinâmica é: [POSIÇÃO]. Uma aliança que preciso fortalecer: [ALIANÇA]. Uma ameaça que preciso monitorar: [AMEAÇA].',
      checklist: [
        'Desenhei um mapa das relações de poder no meu ambiente',
        'Identifiquei quem influencia decisões além da hierarquia formal',
        'Avaliei minha posição atual nessa dinâmica',
        'Defini uma ação para melhorar meu posicionamento esta semana',
      ],
    },
    {
      title: 'Exercício 2 — Pratique a Arte do Silêncio Estratégico',
      icon: '🤐',
      color_theme: 'green',
      description:
        'Durante 3 dias, pratique conscientemente dizer menos. Em reuniões e conversas, reduza suas palavras e observe o efeito sobre os outros.',
      checklist: [
        'Em uma reunião, esperei 5 segundos antes de responder a cada pergunta',
        'Observei alguém preencher o silêncio revelando informações úteis',
        'Resisti à tentação de explicar demais em pelo menos uma situação',
        'Anotei como as pessoas reagiram ao meu silêncio',
        'Identifiquei uma situação onde falar menos me deu vantagem',
      ],
    },
    {
      title: 'Exercício 3 — Aja com Ousadia em Uma Decisão Adiada',
      icon: '🔥',
      color_theme: 'orange',
      description:
        'Identifique uma decisão que você vem adiando por medo ou hesitação. Aplique a Lei 28: tome a decisão com ousadia total esta semana.',
      checklist: [
        'Identifiquei uma decisão importante que venho adiando',
        'Analisei o pior cenário possível e preparei uma resposta',
        'Agi com ousadia — tomei a decisão sem hesitar',
        'Registrei o resultado e o que aprendi com a experiência',
      ],
    },
  ],
}

// ============================================================
// Insert Function
// ============================================================

async function insertBook(bookData: BookData, sortOrder: number) {
  console.log(`\n📚 Inserting: ${bookData.metadata.title} (${bookData.slug})`)

  // Check for duplicates
  const { data: existing } = await supabase
    .from('resumox_books')
    .select('id, slug')
    .eq('slug', bookData.slug)
    .maybeSingle()

  if (existing) {
    console.log(`  ⚠️ Already exists (id: ${existing.id}). Skipping.`)
    return null
  }

  // Insert book
  const { data: bookRow, error: bookError } = await supabase
    .from('resumox_books')
    .insert({
      slug: bookData.slug,
      title: bookData.metadata.title,
      original_title: bookData.metadata.original_title,
      author: bookData.metadata.author,
      year: bookData.metadata.year,
      category_slug: bookData.metadata.category_slug,
      category_label: bookData.metadata.category_label,
      category_emoji: bookData.metadata.category_emoji,
      reading_time_min: bookData.metadata.reading_time_min,
      audio_duration_min: null,
      audio_r2_key: null,
      pdf_r2_key: null,
      mindmap_image_r2_key: null,
      cover_gradient_from: bookData.metadata.cover_gradient_from,
      cover_gradient_to: bookData.metadata.cover_gradient_to,
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
      summary_html: bookData.summary_html,
      mindmap_json: bookData.mindmap_json,
      insights_json: bookData.insights_json,
      exercises_json: bookData.exercises_json,
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

async function main() {
  // Get current book count for sort_order
  const { count } = await supabase
    .from('resumox_books')
    .select('*', { count: 'exact', head: true })

  const sortOrder = count || 0

  console.log('='.repeat(60))
  console.log('  RESUMOX — Inserting: As 48 Leis do Poder')
  console.log('='.repeat(60))

  const id = await insertBook(book, sortOrder)

  console.log('\n' + '='.repeat(60))
  if (id) {
    console.log(`  ✅ Done! Book inserted successfully (id: ${id}).`)
  } else {
    console.log(`  ❌ Failed to insert book.`)
  }
  console.log('='.repeat(60))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nFATAL ERROR:', error)
    process.exit(1)
  })
