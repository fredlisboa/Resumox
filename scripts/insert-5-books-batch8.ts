#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content
 * Books: Iacocca, My Years With General Motors, Direct From Dell,
 *        The 100 Absolutely Unbreakable Laws of Business Success,
 *        Leading the Charge
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

// ============================================================
// Book 1: Iacocca — Uma Autobiografia
// ============================================================

const book1: BookData = {
  slug: 'iacocca-uma-autobiografia',
  metadata: {
    title: 'Iacocca: Uma Autobiografia',
    original_title: 'Iacocca: An Autobiography',
    author: 'Lee Iacocca',
    year: 1984,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Lee Iacocca é um dos executivos mais icônicos da história corporativa americana. De origem humilde — filho de imigrantes italianos —, ele subiu dos níveis mais baixos da Ford Motor Company até se tornar presidente da empresa, criando o lendário <strong>Ford Mustang</strong>. Após ser demitido por Henry Ford II em uma disputa de egos, Iacocca assumiu a <strong>Chrysler à beira da falência</strong> e a transformou em uma empresa lucrativa, protagonizando uma das maiores viradas corporativas de todos os tempos.</p>
<p>Sua autobiografia é uma aula magistral sobre <strong>liderança, tomada de decisão, marketing e resiliência</strong>. Iacocca demonstra que o sucesso nos negócios depende de três coisas: pessoas certas, comunicação clara e coragem para agir quando necessário.</p>

<div class="highlight-box">
"A velocidade da chefe é a velocidade da equipe. Se você quer que as coisas aconteçam rápido, comece andando rápido."
</div>

<h2>Origens e Formação</h2>

<h3>O Legado do Imigrante</h3>
<p>Nicola Iacocca chegou à América em 1902, com apenas doze anos, pobre e sozinho. Ele ensinou a Lee dois princípios fundamentais: <strong>nunca entre em um negócio intensivo em capital</strong> (porque os banqueiros acabarão donos de tudo) e, quando os tempos ficarem difíceis, entre no ramo alimentício (porque as pessoas sempre precisarão comer). Seu pai também incutiu uma disciplina financeira rigorosa: pagar tudo à vista e devolver cada centavo emprestado.</p>
<p>A experiência da Grande Depressão marcou profundamente a família. Embora tenham sobrevivido, a lição sobre <strong>diversificação e prudência financeira</strong> nunca foi esquecida. Aos 15 anos, Lee já tinha decidido que seu futuro estava na indústria automobilística.</p>

<h3>A Escola da Comunicação</h3>
<p>Na escola, Iacocca descobriu o que considera a habilidade mais importante da vida: <strong>comunicar-se com clareza</strong>. Participar do time de debate o ensinou a expressar ideias com precisão e a pensar rapidamente sob pressão. A leitura voraz durante uma recuperação de febre reumática ampliou seu vocabulário e elevou suas notas. Iacocca também estabeleceu uma rotina que manteve por toda a vida: <strong>trabalhar duro de segunda a sexta, reservar o fim de semana para a família e planejar a semana seguinte no domingo à noite</strong>.</p>

<h2>A Ascensão na Ford</h2>

<h3>Do Chão de Fábrica ao Marketing</h3>
<p>Em 1946, Iacocca começou na Ford como engenheiro trainee na maior fábrica do mundo, a River Rouge. Mas rapidamente percebeu que preferia <strong>trabalhar com pessoas em vez de máquinas</strong>. Contra a vontade dos supervisores, migrou para vendas e levou cerca de três anos para encontrar seu ritmo.</p>
<p>Um mentor fundamental foi Charlie Becham, que lhe ensinou princípios diretos: <strong>"Ganhe dinheiro. Esqueça o resto. Isso é um sistema de lucro."</strong> E também: "Todo mundo erra. O problema é que a maioria não admite. Quando errar, vá se olhar no espelho."</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>A descoberta sobre dealers:</strong> Iacocca percebeu que os revendedores são os únicos clientes reais da montadora. Ouvi-los atentamente — mesmo quando o que dizem não agrada — é a chave do negócio automotivo.</div>
</div>

<h3>O Plano "56 por Mês"</h3>
<p>Quando as vendas do Ford 1956 estavam fracas, Iacocca criou uma oferta inovadora: <strong>20% de entrada e parcelas de $56 por mês durante três anos</strong>. Em três meses, o distrito da Filadélfia saltou do último lugar para o primeiro nas vendas nacionais. O conceito foi adotado pela sede e Iacocca foi promovido a gerente distrital. Essa capacidade de <strong>traduzir um problema de vendas em uma solução de marketing criativa</strong> se tornaria sua marca registrada.</p>

<h3>O Nascimento do Mustang</h3>
<p>Aos 36 anos, Iacocca era gerente geral da maior divisão da segunda maior empresa do mundo. Sua primeira grande jogada foi cancelar o <strong>Cardinal</strong> — um carro sem estilo projetado na Alemanha — apesar de $35 milhões já investidos. Em seu lugar, montou uma equipe para criar um carro que refletisse o espírito jovem da América dos anos 60.</p>
<p>O resultado foi o <strong>Ford Mustang</strong>, lançado em 17 de abril de 1964 na Feira Mundial de Nova York. A previsão era de 75.000 unidades no primeiro ano; as vendas reais foram <strong>417.174 carros</strong>. Nos dois primeiros anos, o Mustang gerou lucros líquidos de $1,1 bilhão. O segredo? Preço acessível ($2.368), design esportivo e uma lista enorme de opcionais que levava o cliente médio a gastar $1.000 extras.</p>

<div class="highlight-box">
"Se eu tivesse que resumir as qualidades de um bom gestor em uma única palavra, seria: decisão. Você pode usar os computadores mais sofisticados do mundo, reunir todos os gráficos e números, mas no final, precisa juntar todas as informações, definir um cronograma e agir."
</div>

<h2>O Sistema de Gestão de Iacocca</h2>

<h3>Revisões Trimestrais</h3>
<p>Uma das inovações mais impactantes de Iacocca foi o <strong>sistema de revisão trimestral</strong>. Cada executivo escrevia seus objetivos e metas para os próximos três meses. Ao final do período, uma sessão de avaliação revisava o progresso e definia novas metas. A disciplina de escrever as ideias no papel <strong>eliminava a vagueza e forçava a especificidade</strong>.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Defina metas por escrito:</strong> A revisão trimestral transforma intenções vagas em compromissos concretos e mensuráveis.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Aumente o diálogo:</strong> O sistema garante que gestores e funcionários conversem regularmente sobre prioridades e resultados.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Ninguém se perde:</strong> As revisões impedem que talentos fiquem invisíveis e que problemas se acumulem em silêncio.</div>
</div>

<h3>Decisão: Intuição Apoiada por Fatos</h3>
<p>Iacocca sempre se considerou um gestor conservador quanto a riscos: <strong>"Posso agir pela intuição, mas apenas quando meus palpites são sustentados pelos fatos."</strong> Ele alertava contra dois extremos: tomar decisões sem informação suficiente e esperar informação demais até que a decisão certa se torne errada por ter sido tomada tarde demais.</p>
<p>Apesar do que os livros-texto dizem, a maioria das decisões importantes nas corporações é tomada por <strong>indivíduos, não por comitês</strong>. A política de Iacocca era ser democrático até o ponto da decisão e depois se tornar "o comandante implacável": <strong>"Ouvi todo mundo. Agora, aqui está o que vamos fazer."</strong></p>

<h2>A Queda e a Redenção</h2>

<h3>A Demissão da Ford</h3>
<p>Apesar de ter levado a Ford a lucros recordes de $1,8 bilhão em dois anos, Iacocca foi demitido por Henry Ford II. A razão nunca foi totalmente explicada — Ford simplesmente disse: <strong>"Às vezes você simplesmente não gosta de alguém."</strong> Foi um golpe devastador. Iacocca passou por uma crise pessoal profunda, mas encontrou forças para recomeçar.</p>

<h3>A Virada da Chrysler</h3>
<p>Iacocca assumiu a Chrysler em estado crítico: a empresa perdia centenas de milhões de dólares e estava à beira da falência. Ele descobriu que os problemas eram ainda piores do que imaginava: <strong>35 vice-presidentes que funcionavam como feudos independentes</strong>, sem comunicação entre si, sem controles financeiros e sem planejamento de longo prazo.</p>
<p>Suas primeiras ações foram drásticas: cortou seu próprio salário para $1 por ano, demitiu executivos incompetentes, fechou fábricas deficitárias e recrutou talentos de primeira linha. Negociou com o Congresso americano um <strong>pacote de garantias de empréstimo de $1,2 bilhão</strong> — enfrentando oposição feroz de políticos e da imprensa. E lançou o <strong>K-Car e a minivan</strong>, que se tornaram sucessos estrondosos.</p>

<div class="highlight-box">
"Eu encontrei o mesmo tipo de coragem no chão de fábrica da Chrysler que encontrei nos livros de história. Os trabalhadores estavam dispostos a fazer sacrifícios porque sabiam que era a coisa certa."
</div>

<h2>Lições de Liderança</h2>

<h3>Pessoas São Tudo</h3>
<p>Para Iacocca, a chave do sucesso não é informação — são <strong>pessoas</strong>. O tipo que ele procurava para cargos de alta gestão eram os "castores ansiosos": pessoas que tentam fazer mais do que o esperado, que estão sempre se superando e ajudando os colegas. <strong>"Com 25 desses caras, eu poderia governar os Estados Unidos."</strong></p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Comunicação como superpoder:</strong> Iacocca fez o curso Dale Carnegie e aprendeu a fórmula clássica: diga o que vai dizer, diga, e depois diga o que já disse. Sempre termine pedindo ação.</div>
</div>

<h3>Equilíbrio Entre Números e Instinto</h3>
<p>Uma empresa saudável precisa de tensão criativa entre os "contadores de feijão" (financeiros conservadores) e o pessoal de vendas e marketing (agressivos e otimistas). Se os financeiros são fracos demais, a empresa gasta até a falência. Se são fortes demais, a empresa não inova e perde competitividade. O <strong>equilíbrio entre essas forças</strong> é o que mantém uma organização viva.</p>

<h2>Conclusão</h2>
<p>A trajetória de Lee Iacocca é uma demonstração poderosa de que <strong>liderança não é uma posição — é uma ação</strong>. Desde a criação do Mustang até o resgate da Chrysler, cada capítulo de sua vida profissional reforça os mesmos princípios: conheça seu mercado, cerque-se de pessoas excelentes, comunique-se com clareza, tome decisões com coragem e nunca subestime o poder da resiliência.</p>
<p>Mais do que uma autobiografia, este livro é um <strong>manual prático de liderança</strong> para qualquer pessoa que aspire a fazer a diferença em uma organização — seja ela uma startup, uma divisão corporativa ou uma empresa centenária à beira do abismo.</p>

<div class="highlight-box">
"Às vezes, a melhor coisa que você pode fazer é dar uma boa sacudida no sistema. Se você tiver a coragem de agir quando todo mundo está paralisado pelo medo, já está na frente."
</div>`,
  mindmap_json: {
    center_label: 'IACOCCA',
    center_sublabel: 'Liderança na Prática',
    branches: [
      {
        title: 'Origens e Valores',
        icon: '🏠',
        items: [
          'Filho de imigrantes italianos',
          'Disciplina financeira rígida',
          'Diversificação como proteção',
          'Trabalho duro como princípio',
        ],
      },
      {
        title: 'Ford e o Mustang',
        icon: '🚗',
        items: [
          'Do chão de fábrica ao topo',
          'Plano "56 por mês"',
          'Mustang: 417 mil vendas no 1º ano',
          'Lucro de $1,1 bilhão em 2 anos',
        ],
      },
      {
        title: 'Sistema de Gestão',
        icon: '📋',
        items: [
          'Revisões trimestrais por escrito',
          'Democrático até a decisão',
          'Intuição apoiada por fatos',
          'Tensão criativa entre áreas',
        ],
      },
      {
        title: 'Resgate da Chrysler',
        icon: '🔥',
        items: [
          'Salário de $1 por ano',
          'Garantia de $1,2 bi do governo',
          'K-Car e minivan salvaram a empresa',
          'Maior virada corporativa da história',
        ],
      },
      {
        title: 'Liderança e Pessoas',
        icon: '👥',
        items: [
          'Pessoas são o ativo principal',
          'Busque "castores ansiosos"',
          'Comunicação clara e direta',
          'Curso Dale Carnegie mudou tudo',
        ],
      },
      {
        title: 'Lições Atemporais',
        icon: '💎',
        items: [
          'Liderança é ação, não posição',
          'Coragem de agir sob pressão',
          'Resiliência diante da derrota',
          'Equilíbrio entre risco e prudência',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Se eu tivesse que resumir as qualidades de um bom gestor em uma única palavra, seria: decisão. No final, você precisa juntar todas as informações, definir um cronograma e agir.',
      source_chapter: 'Cap. 5 — A Chave da Gestão',
    },
    {
      text: 'A maioria das decisões importantes nas corporações é tomada por indivíduos, não por comitês. Minha política sempre foi ser democrático até o ponto da decisão. Depois, me torno o comandante implacável.',
      source_chapter: 'Cap. 5 — A Chave da Gestão',
    },
    {
      text: 'A chave do sucesso não é informação — são pessoas. Com 25 "castores ansiosos" — gente que tenta fazer mais do que o esperado — eu poderia governar os Estados Unidos.',
      source_chapter: 'Cap. 5 — A Chave da Gestão',
    },
    {
      text: 'Os revendedores são os únicos clientes reais da montadora. É apenas bom senso ouvi-los atentamente, mesmo quando o que dizem não agrada.',
      source_chapter: 'Cap. 3 — Primeiros Passos',
    },
    {
      text: 'Qualquer empresa precisa de tensão criativa entre os financeiros conservadores e o pessoal de vendas. Se um lado domina o outro, a empresa morre — seja por gastar demais ou por não inovar.',
      source_chapter: 'Cap. 4 — Os Contadores de Feijão',
    },
    {
      text: 'Decida sobre suas prioridades e dê tudo de si. Trabalhe duro de segunda a sexta, tire o fim de semana para a família, e delineie seus objetivos para a semana seguinte todo domingo à noite.',
      source_chapter: 'Cap. 2 — Dias de Escola',
    },
    {
      text: 'Às vezes, a coisa mais importante é simplesmente nunca desistir. Eu encontrei coragem no chão de fábrica — trabalhadores dispostos a fazer sacrifícios porque sabiam que era a coisa certa.',
      source_chapter: 'Cap. 14 — O Resgate da Chrysler',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Revisão Trimestral Pessoal',
      icon: '🎯',
      color_theme: 'accent',
      description:
        'Inspirado no sistema de gestão de Iacocca, defina suas metas pessoais e profissionais para os próximos 90 dias, por escrito.',
      template_text:
        'Nos próximos 90 dias, meus 3 objetivos principais são: [OBJETIVO 1], [OBJETIVO 2] e [OBJETIVO 3]. As ações concretas que vou tomar esta semana são: [AÇÕES].',
      checklist: [
        'Escrevi 3 metas claras e mensuráveis para os próximos 90 dias',
        'Defini ações semanais específicas para cada meta',
        'Marquei uma data no calendário para revisar o progresso em 30 dias',
        'Compartilhei minhas metas com alguém de confiança',
      ],
    },
    {
      title: 'Exercício 2 — Mapeie Seus "Castores Ansiosos"',
      icon: '🤝',
      color_theme: 'green',
      description:
        'Identifique as pessoas ao seu redor que naturalmente fazem mais do que o esperado. Essas são as pessoas que impulsionam resultados.',
      checklist: [
        'Listei 3-5 pessoas que consistentemente excedem expectativas',
        'Enviei uma mensagem de reconhecimento para pelo menos uma delas',
        'Identifiquei uma forma de dar mais responsabilidade a alguém do grupo',
        'Refleti sobre se EU sou um "castor ansioso" na minha organização',
      ],
    },
    {
      title: 'Exercício 3 — Decisão Sob Pressão',
      icon: '⚡',
      color_theme: 'orange',
      description:
        'Identifique uma decisão importante que você vem adiando. Aplique o método Iacocca: reúna os fatos disponíveis e decida esta semana.',
      checklist: [
        'Identifiquei a decisão que mais venho procrastinando',
        'Listei os fatos e dados que já tenho disponíveis',
        'Defini um prazo máximo de 48 horas para tomar a decisão',
        'Comuniquei minha decisão de forma clara e direta',
      ],
    },
  ],
}

// ============================================================
// Book 2: Meus Anos na General Motors
// ============================================================

const book2: BookData = {
  slug: 'meus-anos-na-general-motors',
  metadata: {
    title: 'Meus Anos na General Motors',
    original_title: 'My Years With General Motors',
    author: 'Alfred P. Sloan Jr.',
    year: 1963,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 15,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Alfred P. Sloan Jr. transformou a <strong>General Motors</strong> de uma coleção caótica de empresas independentes na maior corporação do mundo. Publicado em 1963, este livro é considerado o <strong>manual definitivo de gestão corporativa do século XX</strong>. Sloan não apenas construiu uma empresa gigantesca — ele inventou o modelo de gestão descentralizada que seria adotado por praticamente todas as grandes corporações do mundo.</p>
<p>A narrativa cobre desde a fundação da GM por William Durant em 1908 até as décadas de domínio absoluto da empresa na indústria automobilística. O que torna este livro excepcional é que não se trata de uma autobiografia convencional — é um <strong>estudo de caso detalhado</strong> sobre como estruturar, governar e escalar uma organização complexa mantendo agilidade e inovação.</p>

<div class="highlight-box">
"O objetivo primário da corporação é gerar lucro, não fabricar automóveis. Portanto, devemos nos concentrar em projetar e fabricar carros de máximo valor utilitário, em quantidade, ao menor custo possível."
</div>

<h2>A Fundação: Durant e o Caos Criativo</h2>

<h3>1908: O Ano que Mudou Tudo</h3>
<p>Dois eventos transformadores ocorreram em 1908: Henry Ford anunciou o <strong>Model T</strong> e William C. Durant fundou a <strong>General Motors Company</strong>. Em apenas dois anos, Durant reuniu 25 empresas — incluindo Buick, Oldsmobile e Cadillac — na consolidação corporativa mais ambiciosa da história.</p>
<p>Durant seguiu três princípios visionários: oferecer <strong>variedade de carros para diferentes gostos e níveis econômicos</strong>, diversificar para cobrir o máximo de possibilidades tecnológicas e integrar fabricantes de peças sob o mesmo guarda-chuva corporativo.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>O paradoxo de Durant:</strong> Brilhante em construir empresas, mas fraco em administrá-las. Perdeu o controle da GM duas vezes por má gestão financeira, apesar de ter criado um império bilionário.</div>
</div>

<h3>A Entrada de Sloan</h3>
<p>Alfred Sloan havia construído a Hyatt Roller Bearing Company como fornecedora de rolamentos para a indústria automotiva. Em 1916, Durant adquiriu a empresa por $13,5 milhões, e Sloan tornou-se diretor da GM. Quando Durant perdeu o controle pela segunda vez em 1920 — com $20 milhões em dívidas pessoais —, Pierre du Pont assumiu como presidente e Sloan tornou-se <strong>vice-presidente executivo</strong>, formando a base para a transformação que viria.</p>

<h2>A Revolução Organizacional</h2>

<h3>Descentralização com Coordenação</h3>
<p>O primeiro desafio de Sloan foi reestruturar a GM. A empresa era uma <strong>coleção descentralizada de unidades independentes</strong>, cada uma operando sem comunicação com as demais. A solução não foi centralizar tudo — nem manter o caos. Sloan criou um modelo intermediário revolucionário:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Divisões autônomas:</strong> Cada unidade tinha seu CEO responsável pelos resultados, com liberdade para operar.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Coordenação central:</strong> Uma organização central fornecia controle consultivo, serviços compartilhados e diretrizes estratégicas.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Comitês interdivisionais:</strong> Seis comitês coordenavam operações, vendas, compras, tecnologia, produção e manutenção.</div>
</div>

<p>Esse modelo — <strong>divisões operacionais autônomas coordenadas por uma estrutura central</strong> — se tornou o padrão de gestão corporativa adotado por empresas em todo o mundo até hoje.</p>

<h3>Política de Produto: Derrotando a Ford</h3>
<p>Enquanto Henry Ford insistia em um único modelo (o Model T) vendido pelo menor preço possível, Sloan desenvolveu uma estratégia completamente diferente. A GM produziria <strong>uma linha completa de carros escalonada por preço e qualidade</strong>:</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Cada marca da GM ocupava uma faixa de preço específica</strong>, do Chevrolet popular ao Cadillac premium, sem sobreposição. Cada carro era posicionado no topo de sua faixa para atrair compradores de baixo (por qualidade) e de cima (por preço).</div>
</div>

<p>Em 1921, a GM detinha apenas 12% do mercado americano contra 60% da Ford. Mas a estratégia de Sloan inverteu completamente o jogo. Quando Ford finalmente descontinuou o Model T em 1927, já era tarde demais — a GM já dominava o mercado.</p>

<div class="highlight-box">
"O cerne da política de produto reside em seu conceito de produção em massa de uma linha completa de carros escalonada em qualidade e preço. Isso diferenciou o conceito da General Motors do velho conceito do Ford Model T."
</div>

<h2>Controles Financeiros e Inovação</h2>

<h3>O Sistema Financeiro</h3>
<p>Nos anos 1920, a GM não tinha <strong>nenhum controle financeiro</strong>. Qualquer pedido de recursos era atendido com emissão de ações e empréstimos bancários, sem avaliação de mérito. Sloan implementou um sistema rigoroso onde cada divisão era <strong>responsável por seu próprio lucro e prejuízo</strong>, com relatórios regulares e metas de retorno sobre investimento.</p>
<p>A inovação financeira mais importante foi o conceito de <strong>taxa de retorno sobre capital investido</strong> como métrica universal. Pela primeira vez, era possível comparar o desempenho de divisões completamente diferentes usando o mesmo indicador objetivo.</p>

<h3>O Dilema do Motor Refrigerado a Ar</h3>
<p>Um episódio revelador foi o desenvolvimento do motor refrigerado a ar por Charles Kettering. A tecnologia prometia eliminar radiadores e reduzir custos, mas os protótipos falharam nos testes. A GM enfrentou um dilema: continuar investindo em tecnologia promissora mas não comprovada, ou focar nos produtos existentes durante um boom de mercado em 1923 — o <strong>primeiro ano de 4 milhões de veículos vendidos na história</strong>.</p>
<p>Sloan tomou a decisão pragmática: abandonou o motor a ar e investiu na evolução dos produtos existentes. Kettering ficou frustrado mas permaneceu na GM, onde desenvolveu aditivos para combustível, motores de alta compressão e o motor diesel que revolucionou as ferrovias — provando que <strong>manter grandes talentos é mais importante do que qualquer projeto individual</strong>.</p>

<h2>Estratégias de Crescimento</h2>

<h3>O Carro do Ano — Todo Ano</h3>
<p>Uma das estratégias mais geniais da GM foi a introdução de <strong>mudanças anuais de modelo</strong>. Em vez de vender o mesmo carro por décadas (como Ford), a GM criou o conceito de obsolescência planejada no design, fazendo os consumidores desejarem o modelo mais novo. Isso transformou o automóvel de uma compra utilitária em uma <strong>expressão de status e aspiração</strong>.</p>

<h3>Financiamento e Distribuição</h3>
<p>Sloan também revolucionou a <strong>distribuição e o financiamento</strong> de automóveis. A criação da GMAC permitiu que clientes comprassem carros a prazo — algo que Ford resistiu por anos. A rede de concessionárias foi profissionalizada com treinamento, padrões de qualidade e relatórios de desempenho.</p>

<h2>Conclusão</h2>
<p>"Meus Anos na General Motors" não é apenas a história de uma empresa — é o <strong>blueprint da gestão corporativa moderna</strong>. Os princípios de Sloan — descentralização coordenada, segmentação de mercado, controles financeiros rigorosos e inovação contínua — são tão relevantes hoje quanto eram há um século. Peter Drucker chamou este livro de "a melhor obra sobre gestão jamais escrita", e décadas depois, essa avaliação permanece verdadeira.</p>

<div class="highlight-box">
"Graças principalmente ao Sr. Durant, a General Motors tinha então as bases de uma grande empresa. Mas quanto a mim, reconheci que minha eleição à presidência era uma grande responsabilidade e uma oportunidade que poucos recebem. Resolvi fazer qualquer sacrifício pessoal pela causa."
</div>`,
  mindmap_json: {
    center_label: 'MEUS ANOS NA GENERAL MOTORS',
    center_sublabel: 'O Blueprint da Gestão Moderna',
    branches: [
      {
        title: 'Fundação da GM',
        icon: '🏗️',
        items: [
          'Durant reuniu 25 empresas em 1908',
          'Variedade de carros e preços',
          'Duas crises de controle financeiro',
          'Entrada da família du Pont',
        ],
      },
      {
        title: 'Modelo Organizacional',
        icon: '🏛️',
        items: [
          'Descentralização coordenada',
          'Divisões autônomas com CEO próprio',
          'Seis comitês interdivisionais',
          'Equilíbrio entre liberdade e controle',
        ],
      },
      {
        title: 'Estratégia de Produto',
        icon: '🚗',
        items: [
          'Linha completa por faixa de preço',
          'Sem sobreposição entre marcas',
          'Mudanças anuais de modelo',
          'Derrotou o Model T da Ford',
        ],
      },
      {
        title: 'Controles Financeiros',
        icon: '📊',
        items: [
          'Cada divisão com P&L próprio',
          'Retorno sobre capital investido',
          'Relatórios padronizados',
          'Orçamento baseado em mérito',
        ],
      },
      {
        title: 'Inovação Pragmática',
        icon: '⚙️',
        items: [
          'Pragmatismo sobre idealismo',
          'Reter talentos acima de tudo',
          'Kettering e o motor a ar',
          'Diesel revolucionou ferrovias',
        ],
      },
      {
        title: 'Legado Duradouro',
        icon: '🌟',
        items: [
          'Modelo copiado mundialmente',
          'Blueprint da gestão moderna',
          'GMAC criou o crédito automotivo',
          'De 12% para líder de mercado',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'O objetivo primário da corporação é gerar lucro, não fabricar automóveis. Portanto, devemos nos concentrar em projetar e fabricar carros de máximo valor utilitário, em quantidade, ao menor custo possível.',
      source_chapter: 'Cap. 2 — Política de Produto',
    },
    {
      text: 'O cerne da política de produto reside em seu conceito de produção em massa de uma linha completa de carros escalonada em qualidade e preço. Isso diferenciou o conceito da General Motors do velho conceito do Ford Model T.',
      source_chapter: 'Cap. 2 — Política de Produto',
    },
    {
      text: 'O modelo ideal de gestão não é nem centralização pura nem descentralização pura, mas um equilíbrio entre divisões operacionais autônomas e uma organização central que fornece coordenação estratégica.',
      source_chapter: 'Cap. 4 — Coordenação por Comitês',
    },
    {
      text: 'Durant era brilhante em construir empresas, mas fraco em administrá-las. Perdeu o controle da GM duas vezes por má gestão financeira — provando que visão sem disciplina é apenas um sonho.',
      source_chapter: 'Cap. 1 — Os Primórdios',
    },
    {
      text: 'A taxa de retorno sobre capital investido permite comparar o desempenho de divisões completamente diferentes usando o mesmo indicador objetivo — a primeira linguagem universal de gestão.',
      source_chapter: 'Cap. 5 — Controles Financeiros',
    },
    {
      text: 'Manter grandes talentos é mais importante do que qualquer projeto individual. Kettering ficou frustrado ao ver o motor a ar cancelado, mas permaneceu na GM e inventou tecnologias que revolucionaram indústrias inteiras.',
      source_chapter: 'Cap. 3 — O Dilema do Motor a Ar',
    },
    {
      text: 'Reconheci que minha eleição à presidência era uma grande responsabilidade e uma oportunidade que poucos recebem. Resolvi fazer qualquer sacrifício pessoal pela causa.',
      source_chapter: 'Cap. 3 — Sloan Assume a Presidência',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Mapeie Sua Estrutura Organizacional',
      icon: '🏛️',
      color_theme: 'accent',
      description:
        'Analise se sua empresa ou equipe tem o equilíbrio certo entre autonomia e coordenação, inspirado no modelo de Sloan.',
      template_text:
        'Áreas com autonomia suficiente: [LISTA]. Áreas que precisam de mais coordenação: [LISTA]. Uma ação para melhorar o equilíbrio: [AÇÃO].',
      checklist: [
        'Mapeei as decisões que são tomadas localmente vs. centralmente',
        'Identifiquei pelo menos uma área onde há sobreposição ou conflito',
        'Propus uma melhoria concreta na estrutura de comunicação',
        'Defini um indicador de desempenho compartilhado entre áreas',
      ],
    },
    {
      title: 'Exercício 2 — Segmentação de Mercado na Prática',
      icon: '🎯',
      color_theme: 'green',
      description:
        'Aplique o conceito de segmentação por faixas da GM ao seu produto ou serviço. Identifique oportunidades de escalonar sua oferta.',
      checklist: [
        'Listei os diferentes perfis de clientes que atendo',
        'Identifiquei pelo menos 3 faixas de preço/valor possíveis',
        'Verifiquei se há sobreposição ou canibalização entre ofertas',
        'Defini uma proposta de valor clara para cada segmento',
      ],
    },
    {
      title: 'Exercício 3 — Decisão Pragmática vs. Idealista',
      icon: '⚖️',
      color_theme: 'orange',
      description:
        'Identifique um projeto ou ideia que você está perseguindo por idealismo mas que pode não ser a melhor escolha pragmática agora.',
      checklist: [
        'Listei projetos em andamento que ainda não deram resultado',
        'Avaliei cada um: o mercado justifica continuar investindo?',
        'Tomei a decisão difícil de parar ou pivotar pelo menos um projeto',
        'Redirecionei os recursos liberados para algo com retorno comprovado',
      ],
    },
  ],
}

// ============================================================
// Book 3: Direto da Dell
// ============================================================

const book3: BookData = {
  slug: 'direto-da-dell',
  metadata: {
    title: 'Direto da Dell',
    original_title: 'Direct From Dell',
    author: 'Michael Dell',
    year: 1999,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 13,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Michael Dell fundou a <strong>Dell Computer</strong> em 1984 com apenas $1.000 de capital inicial. Em menos de 15 anos, a empresa se tornou a segunda maior fabricante de computadores do mundo, com mais de <strong>$18 bilhões em faturamento anual</strong>. O segredo? Uma abordagem radicalmente diferente de tudo o que a indústria praticava — o modelo de <strong>venda direta ao consumidor</strong>.</p>
<p>Este livro revela <strong>8 estratégias competitivas</strong> que transformaram a Dell em uma potência tecnológica. Embora demonstradas na indústria de computadores, essas estratégias são universais e aplicáveis em qualquer setor — desde que você tenha a curiosidade para pensar criativamente e a coragem para agir com base no que observa.</p>

<div class="highlight-box">
"A maior ameaça à Dell não viria de um concorrente. Viria de nós mesmos — de não conseguir manter o espírito empreendedor à medida que a empresa crescesse em tamanho e complexidade."
</div>

<h2>Estratégia 1: Cultura de Desafiante</h2>

<h3>Velocidade e Flexibilidade</h3>
<p>Empresas com uma cultura <strong>ágil e coesa</strong> têm uma vantagem competitiva significativa. Para Dell, construir essa cultura exige cinco pilares:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Objetivo comum:</strong> Todos devem entender e acreditar na missão da empresa. Na Dell, era a crença de que o modelo direto era superior.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Contrate à frente dos objetivos:</strong> Recrute pessoas com potencial de crescimento, não apenas com currículo passado.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Todos recrutam:</strong> A busca por talentos não pode ficar apenas no RH — deve envolver toda a empresa.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Estreite responsabilidades:</strong> Em vez de sobrecarregar os melhores com mais tarefas, estreite seu foco para que se aprofundem mais.</div>
</div>
<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Gestores imersos:</strong> Os melhores líderes estão nas trincheiras — visitando clientes, participando de reuniões e checando e-mails de todos os níveis.</div>
</div>

<h2>Estratégia 2: Mentalidade de Dono</h2>

<h3>Donos vs. Funcionários</h3>
<p>Donos têm três características que funcionários frequentemente não desenvolvem: <strong>senso de responsabilidade</strong> pelo negócio, <strong>accountability</strong> pelos resultados e <strong>participação nos frutos</strong> do sucesso. Para criar essa mentalidade em toda a empresa:</p>
<p>Torne o aprendizado uma necessidade, não uma opção. Encoraje pensamento inovador com soluções não óbvias. Permita experimentação inteligente — com tolerância para falhas. Comunique constantemente o que está acontecendo e o que está planejado. <strong>Elimine hierarquias</strong> desnecessárias. E unifique todos em torno de uma única métrica: na Dell, era o <strong>ROIC (Retorno sobre Capital Investido)</strong>.</p>

<div class="highlight-box">
"Não existiam aulas sobre como abrir e administrar um negócio no meu colégio, então eu claramente tinha muito a aprender. E aprendi, principalmente experimentando e cometendo um monte de erros. Uma das primeiras coisas que aprendi foi que há uma relação entre errar e aprender: quanto mais erros eu cometia, mais rápido aprendia."
</div>

<h2>Estratégia 3: Entenda a Experiência do Cliente</h2>

<h3>Resolva Problemas, Não Venda Produtos</h3>
<p>Se você ouvir com atenção, os clientes dirão exatamente como entregar mais valor. A Dell desenvolveu um <strong>relacionamento íntimo com cada cliente</strong>, indo muito além da simples venda de computadores. Isso significava conhecer os desafios operacionais do cliente, desenvolver produtos sob a perspectiva deles e tornar-se um <strong>defensor dos interesses do cliente</strong> dentro da empresa.</p>

<h3>Alto-tech com Alto-toque</h3>
<p>Michael Dell pessoalmente frequentava chatrooms na internet para ouvir o que usuários reais falavam sobre os produtos da Dell e dos concorrentes. <strong>"Na web, ninguém sabe que eu sou CEO"</strong>, ele dizia. Essa conexão direta com o mercado real, sem intermediários, era uma fonte inestimável de inteligência competitiva.</p>

<h2>Estratégia 4: Supere Expectativas com Valor Real</h2>
<p>Estar perto do cliente não é suficiente — é preciso usar essa informação <strong>inteligentemente para formar uma parceria</strong>. A Dell se posicionava como consultora confiável, ajudando clientes a economizar e a fazer escolhas melhores. A abordagem era multidimensional: olhar o panorama geral, criar economias para o cliente, separar fatos de hype e <strong>transformar clientes em professores</strong>.</p>

<h2>Estratégia 5: Alianças Poderosas com Fornecedores</h2>
<p>Além de estar perto dos clientes, Dell construiu <strong>alianças estratégicas com fornecedores</strong> tratando-os como extensões da própria empresa. Os princípios eram simples: definir claramente onde cada um agrega valor, manter a simplicidade, investir no sucesso mútuo e estabelecer objetivos explícitos.</p>

<h2>Estratégia 6: Integração Virtual</h2>

<h3>Informação no Lugar de Estoque</h3>
<p>Dell revolucionou a cadeia de suprimentos ao <strong>trocar estoque por informação</strong>. Em vez de acumular peças em depósitos, a empresa compartilhava dados de demanda em tempo real com fornecedores, permitindo <strong>just-in-time real</strong> — não apenas "a tempo", mas em tempo real. Isso reduziu custos dramaticamente e aumentou a velocidade de entrega.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Inverter a equação oferta/demanda:</strong> Em vez de fabricar e torcer para vender, a Dell primeiro recebia o pedido e depois fabricava — eliminando o risco de estoque encalhado.</div>
</div>

<h2>Estratégia 7: Diferenciação Sustentável</h2>
<p>Grandes empresas se orientam ao redor de um <strong>ponto de diferenciação</strong> que nenhum concorrente consegue igualar. Para a Dell, era o modelo direto: sem intermediários, sem lojas físicas, sem estoque. As regras de Dell para manter essa vantagem:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Foque nas necessidades do cliente, não na competição.</strong></div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Use as forças do concorrente contra ele.</strong> As lojas físicas dos rivais eram custos fixos que a Dell não tinha.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Identifique oportunidades e explore-as rapidamente.</strong></div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Execute com excelência.</strong> A melhor estratégia do mundo fracassa sem execução impecável.</div>
</div>

<h2>Estratégia 8: Prospere com a Mudança</h2>
<p>A internet representou uma <strong>mudança massiva</strong> na forma de fazer negócios — e uma oportunidade gigantesca para a Dell. A empresa abraçou a web antes de praticamente todos os concorrentes, usando-a para vendas diretas, suporte ao cliente e integração com fornecedores. O conselho de Dell: planeje a mudança como oportunidade de crescimento, quebre fronteiras tradicionais, reajuste prioridades e busque a <strong>integração virtual</strong> — onde tecnologia permite que parceiros operem como se fossem uma única empresa.</p>

<h2>Conclusão</h2>
<p>A história da Dell é uma prova de que é possível <strong>reinventar uma indústria inteira</strong> com um modelo de negócio superior. Os princípios de Michael Dell — proximidade obsessiva com o cliente, cultura de dono, alianças estratégicas e uso inteligente da tecnologia — são universais. Funcionam para uma startup de garagem com $1.000 de capital ou para uma multinacional de $18 bilhões.</p>

<div class="highlight-box">
"Sucesso não é estático — e sua cultura também não deveria ser. Preste atenção ao que seus melhores profissionais estão conquistando e construa uma infraestrutura que recompense a maestria. A melhor forma de manter pessoas talentosas é permitir que seus trabalhos evoluam junto com elas."
</div>`,
  mindmap_json: {
    center_label: 'DIRETO DA DELL',
    center_sublabel: '8 Estratégias que Revolucionaram uma Indústria',
    branches: [
      {
        title: 'Cultura de Desafiante',
        icon: '🔥',
        items: [
          'Objetivo comum entendido por todos',
          'Contrate à frente dos objetivos',
          'Gestores imersos nas trincheiras',
          'Estreite foco dos melhores talentos',
        ],
      },
      {
        title: 'Mentalidade de Dono',
        icon: '💪',
        items: [
          'Tolerância para experimentação',
          'Comunique constantemente',
          'Elimine hierarquias',
          'ROIC como métrica unificadora',
        ],
      },
      {
        title: 'Obsessão pelo Cliente',
        icon: '🎯',
        items: [
          'Resolva problemas, não venda produtos',
          'CEO em chatrooms anônimos',
          'Clientes como professores',
          'Alto-tech com alto-toque',
        ],
      },
      {
        title: 'Alianças Estratégicas',
        icon: '🤝',
        items: [
          'Fornecedores como extensões',
          'Informação no lugar de estoque',
          'Investimento em sucesso mútuo',
          'Integração virtual',
        ],
      },
      {
        title: 'Diferenciação',
        icon: '⚡',
        items: [
          'Modelo direto sem intermediários',
          'Força do concorrente contra ele',
          'Foco no cliente, não na competição',
          'Execução impecável',
        ],
      },
      {
        title: 'Abraçar a Mudança',
        icon: '🌐',
        items: [
          'Internet como oportunidade',
          'Vendas online antes de todos',
          'Mudança planejada como crescimento',
          'Quebrar fronteiras tradicionais',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'A maior ameaça à Dell não viria de um concorrente. Viria de nós mesmos — de não conseguir manter o espírito empreendedor à medida que a empresa crescesse em tamanho e complexidade.',
      source_chapter: 'Estratégia 1 — Cultura de Desafiante',
    },
    {
      text: 'Uma das primeiras coisas que aprendi foi que há uma relação entre errar e aprender: quanto mais erros eu cometia, mais rápido aprendia. Como podem imaginar, eu era muito eficiente.',
      source_chapter: 'Estratégia 1 — Cultura de Desafiante',
    },
    {
      text: 'Sucesso não é estático — e sua cultura também não deveria ser. A melhor forma de manter pessoas talentosas é permitir que seus trabalhos evoluam junto com elas.',
      source_chapter: 'Estratégia 1 — Cultura de Desafiante',
    },
    {
      text: 'Se você esperar até não haver risco, também não haverá oportunidade. Olhe para cada problema como uma chance de criar um negócio a partir dele.',
      source_chapter: 'Estratégia 2 — Mentalidade de Dono',
    },
    {
      text: 'Na web, ninguém sabe que eu sou CEO. Eu frequento chatrooms onde usuários reais discutem suas compras. É uma oportunidade tremenda de aprendizado.',
      source_chapter: 'Estratégia 3 — Experiência do Cliente',
    },
    {
      text: 'Os funcionários mais bem-sucedidos deveriam ser recompensados com um estreitamento de suas responsabilidades — não uma expansão. Isso permite que se aprofundem em novas oportunidades.',
      source_chapter: 'Estratégia 1 — Cultura de Desafiante',
    },
    {
      text: 'Em vez de fabricar e torcer para vender, primeiro recebíamos o pedido e depois fabricávamos. Trocamos estoque por informação — e isso mudou tudo.',
      source_chapter: 'Estratégia 6 — Integração Virtual',
    },
    {
      text: 'Conectar-se com o mundo exterior mantém você atento. Conectar-se com suas pessoas — seu ativo mais valioso — é a forma de manter seu negócio saudável e forte.',
      source_chapter: 'Estratégia 1 — Cultura de Desafiante',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Auditoria de Mentalidade de Dono',
      icon: '🔍',
      color_theme: 'accent',
      description:
        'Avalie se você e sua equipe agem como donos ou como funcionários. Identifique as lacunas e crie um plano para fechá-las.',
      template_text:
        'Eu me comporto como dono em: [ÁREAS]. Áreas onde ajo mais como funcionário: [ÁREAS]. Uma mudança concreta que posso fazer esta semana: [MUDANÇA].',
      checklist: [
        'Avaliei meu nível de responsabilidade pelo resultado final',
        'Identifiquei uma área onde estou "apenas cumprindo ordens"',
        'Propus uma melhoria sem ser solicitado',
        'Compartilhei uma ideia inovadora com a equipe',
      ],
    },
    {
      title: 'Exercício 2 — Ouça Seu Cliente Como o Dell',
      icon: '👂',
      color_theme: 'green',
      description:
        'Vá direto à fonte: encontre fóruns, redes sociais ou canais onde seus clientes falam sobre seu produto. Ouça sem se identificar.',
      checklist: [
        'Identifiquei 2-3 canais onde clientes discutem meu produto/serviço',
        'Passei pelo menos 30 minutos ouvindo sem intervir',
        'Anotei 3 reclamações ou sugestões recorrentes',
        'Transformei uma dessas observações em uma ação de melhoria',
      ],
    },
    {
      title: 'Exercício 3 — Elimine um Intermediário',
      icon: '✂️',
      color_theme: 'orange',
      description:
        'Identifique um intermediário, processo burocrático ou camada desnecessária entre você e seu cliente. Remova-o ou simplifique-o.',
      checklist: [
        'Mapeei todos os passos entre a criação do produto e a entrega ao cliente',
        'Identifiquei pelo menos um passo que não agrega valor real',
        'Testei uma forma de eliminar ou simplificar esse passo',
        'Medi o impacto em velocidade, custo ou satisfação do cliente',
      ],
    },
  ],
}

// ============================================================
// Book 4: As 100 Leis Absolutamente Inquebráveis do Sucesso nos Negócios
// ============================================================

const book4: BookData = {
  slug: 'as-100-leis-inquebraveis-do-sucesso',
  metadata: {
    title: 'As 100 Leis Absolutamente Inquebráveis do Sucesso nos Negócios',
    original_title: 'The 100 Absolutely Unbreakable Laws of Business Success',
    author: 'Brian Tracy',
    year: 2000,
    category_slug: 'mentalidade-riqueza',
    category_label: 'Mentalidade & Riqueza',
    category_emoji: '💰',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Brian Tracy — palestrante internacional, consultor de mais de 400 empresas e autor de dezenas de best-sellers — afirma que o sucesso <strong>nunca é acidental</strong>. É sempre o resultado direto da conformidade com leis e princípios comprovados que o governam. Assim como as leis da física e da matemática, essas leis sempre existiram — e quem as obedece prospera, enquanto quem as viola estagna ou fracassa.</p>
<p>Neste livro, Tracy compila <strong>100 leis divididas em 8 áreas fundamentais</strong>: vida, sucesso, negócios, liderança, dinheiro, vendas, negociação e gestão do tempo. A mensagem central é transformadora: quanto mais você alinhar sua vida e suas ações com essas leis, <strong>maior será seu sucesso — e não há limites</strong>.</p>

<div class="highlight-box">
"Quanto mais você incorporar esses princípios ao seu pensamento e tomada de decisão diários, mais eficaz você se tornará. Essas ideias funcionam. Funcionam virtualmente em todos os lugares, sob praticamente todas as circunstâncias. E quanto mais você as usar, melhor funcionarão para você. Não há limites."
</div>

<h2>As Leis da Vida</h2>

<h3>Causa e Efeito: A Lei Mestra</h3>
<p>Nada acontece por acaso. Para cada efeito, há sempre uma causa associada. O que você genuinamente acredita acaba se tornando sua realidade. Seus pensamentos irradiam energia mental real — tudo que você possui na vida <strong>fluiu em sua direção por causa da forma como pensou anteriormente</strong>. Para mudar o futuro, mude seus pensamentos.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Lei da Crença:</strong> O que você acredita com convicção se torna sua realidade. Crenças limitantes produzem resultados limitados.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Lei da Expectativa:</strong> Você atrai as pessoas, circunstâncias e oportunidades que mais pensa. Expectativas positivas geram resultados positivos.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Lei da Correspondência:</strong> Seu mundo exterior sempre será um reflexo preciso do seu mundo interior.</div>
</div>

<h2>As Leis do Sucesso</h2>

<h3>Controle, Responsabilidade e Direção</h3>
<p>Quanto mais você sente estar <strong>no controle de sua vida</strong>, melhor se sente. Para se libertar da sensação de impotência, defina objetivos e comece a se mover em direção a eles. Você se torna aquilo que pensa a maior parte do tempo — portanto, escolha seus pensamentos com cuidado e deliberação.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Lei da Compensação:</strong> Você será plenamente compensado por tudo que faz — positivo e negativo. Para ganhar mais, contribua mais. Sociedade recompensa quem serve grandes números de pessoas de formas significativas.</div>
</div>

<h3>Esforço, Preparação e Persistência</h3>
<p>Toda conquista que vale a pena requer <strong>trabalho duro</strong>. Pessoas de alto desempenho se preparam meticulosamente — prestando atenção a todos os pequenos detalhes que diferenciam vencedores de perdedores. Elas sempre têm coisas demais para fazer, o que as <strong>força a ser eficientes e focar no que importa</strong>. E acima de tudo, são decisivas: sabem o que querem e vão atrás agressivamente.</p>
<p>A persistência é a autodisciplina em ação. Se você está disposto a persistir mais do que qualquer pessoa e nunca desistir, demonstra tenacidade e fé inabalável em si mesmo. <strong>Nada pode se colocar no caminho de quem resolve agir consistentemente</strong>, mesmo diante de contratempos temporários.</p>

<h2>As Leis dos Negócios</h2>

<h3>O Propósito de Toda Empresa</h3>
<p>O propósito de qualquer negócio é simples: <strong>criar e manter clientes</strong>. Lucros são puramente uma medida de quão bem o negócio cumpre esse propósito. Clientes sempre agem em seu próprio interesse, esperando a melhor qualidade pelo menor preço possível.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Lei da Especialização:</strong> Produtos que tentam ser tudo para todos não vão a lugar algum. A especialização é o ponto de partida do marketing bem-sucedido.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Lei da Diferenciação:</strong> Sem um ponto claro de diferenciação, ninguém notará seu produto. Descreva sua USP em 25 palavras ou menos.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Lei da Excelência:</strong> Uma reputação de excelência permite cobrar premium — e clientes pagarão felizes pela promessa de maior satisfação ao longo do tempo.</div>
</div>

<h2>As Leis da Liderança</h2>

<h3>Integridade, Coragem e Visão</h3>
<p>Grandes líderes são <strong>completamente confiáveis</strong> porque suas ações externas alinham-se com suas intenções internas. Isso gera consistência e, por consequência, confiança. Eles tomam as ações certas apesar de seus medos — nem o medo de fracasso nem o medo de crítica os desvia do que sabem ser certo.</p>
<p>Líderes têm <strong>clareza de visão</strong>: onde outros veem problemas, eles veem oportunidades. Acreditam que o futuro é um território inexplorado com riquezas ilimitadas. São otimistas que inspiram outros à ação e são <strong>orientados por soluções</strong>, não por problemas.</p>

<div class="highlight-box">
"Líderes eficazes nunca estão satisfeitos. Estão continuamente escolhendo uma área de excelência, aprendendo o que é necessário para melhorar e inspirando outros à ação nessa direção."
</div>

<h2>As Leis do Dinheiro</h2>

<h3>O Caminho para a Independência Financeira</h3>
<p>Há dinheiro suficiente para todos. A chave é entender que dinheiro é simplesmente um <strong>meio de troca de valor</strong>. Para ganhar mais, aumente o valor do seu trabalho — através de habilidades superiores, hábitos de trabalho aprimorados e períodos mais longos de trabalho de alta qualidade.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Lei de Parkinson Financeira:</strong> Suas despesas sempre subirão para igualar sua renda — se você permitir. Para se tornar financeiramente independente, revogue essa lei: deixe seus gastos crescerem mais lentamente que sua renda e invista a diferença.</div>
</div>

<p>A verdadeira medida do sucesso financeiro não é quanto você ganha, mas <strong>quanto consegue guardar</strong>. Guarde 10% de tudo que ganha, compre seguro suficiente para emergências e invista até que sua renda de investimentos supere sua renda do trabalho. O poder dos <strong>juros compostos</strong> é uma das forças mais poderosas do universo — funciona em tempos bons e ruins.</p>

<h2>As Leis de Vendas e Negociação</h2>

<h3>Confiança é Tudo</h3>
<p>Em vendas, nada acontece até que alguém venda algo. E toda venda se baseia na <strong>confiança</strong> entre vendedor e comprador. Vendedores eficazes são solucionadores profissionais de problemas que ouvem com empatia, fazem perguntas sobre necessidades e constroem vínculos fortes com o cliente. A meta é que o cliente veja você como alguém que age em seu interesse — mas que é pago por outra pessoa.</p>

<h3>A Arte da Negociação</h3>
<p>Tudo é negociável. Boas negociações criam situações <strong>ganha-ganha</strong> para ambas as partes. Nunca se intimide com preços — assuma que qualquer valor foi escrito a lápis, não a caneta. Quem está com mais pressa para fechar o acordo sempre está na posição mais fraca. E a preparação meticulosa é responsável por <strong>80% do sucesso</strong> em qualquer negociação.</p>

<h2>As Leis da Gestão do Tempo</h2>

<h3>Foco e Prioridades</h3>
<p>Ser claro sobre o que você quer geralmente é responsável por 80% de suas realizações. Para alcançar grandes coisas, <strong>concentre-se nos 20% de atividades que entregam 80% do valor</strong>. Invista 10-12 minutos diários planejando seu dia e ganhe cerca de 2 horas de produtividade extra — um aumento de 25%.</p>
<p>Ninguém consegue fazer tudo. A chave é definir prioridades, selecionar a tarefa de maior valor e <strong>concentrar-se nela até completá-la</strong>. A capacidade de começar e terminar o que é mais importante determinará sua produtividade e seu sucesso mais do que qualquer outro fator.</p>

<div class="highlight-box">
"Sua recompensa pessoal em qualquer coisa é sempre determinada pelos resultados alcançados. Para ganhar mais, gere mais resultados de alta qualidade para mais pessoas — e você automaticamente será mais bem pago."
</div>

<h2>Conclusão</h2>
<p>As 100 leis de Brian Tracy não são teoria abstrata — são <strong>princípios testados pela história</strong> que funcionam para qualquer pessoa disposta a aplicá-los. O ponto de partida de toda mudança está dentro de você: mude a forma como pensa e você mudará tudo ao seu redor. O sucesso é previsível, e a única limitação real é a que você aceita para si mesmo.</p>`,
  mindmap_json: {
    center_label: 'AS 100 LEIS INQUEBRÁVEIS DO SUCESSO',
    center_sublabel: 'Princípios Universais do Sucesso',
    branches: [
      {
        title: 'Leis da Vida',
        icon: '🌍',
        items: [
          'Causa e efeito governam tudo',
          'Crenças criam realidade',
          'Exterior reflete o interior',
          'Expectativas atraem resultados',
        ],
      },
      {
        title: 'Leis do Sucesso',
        icon: '🏆',
        items: [
          'Controle gera bem-estar',
          'Persistência é autodisciplina',
          'Preparação precede performance',
          'Decisão alimenta progresso',
        ],
      },
      {
        title: 'Leis dos Negócios',
        icon: '💼',
        items: [
          'Criar e manter clientes',
          'Especializar para vencer',
          'Diferenciar ou desaparecer',
          'Excelência permite premium',
        ],
      },
      {
        title: 'Leis da Liderança',
        icon: '👑',
        items: [
          'Integridade gera confiança',
          'Coragem diante do medo',
          'Visão: problemas são oportunidades',
          'Otimismo inspira ação',
        ],
      },
      {
        title: 'Leis do Dinheiro',
        icon: '💰',
        items: [
          'Guarde 10% de tudo que ganha',
          'Revogue a Lei de Parkinson',
          'Juros compostos são poderosos',
          'Invista até renda passiva > ativa',
        ],
      },
      {
        title: 'Leis do Tempo',
        icon: '⏰',
        items: [
          '20% das ações geram 80% do valor',
          'Planeje 10 min, ganhe 2 horas',
          'Foco: complete o mais importante',
          'Urgência acelera resultados',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Nada acontece por acaso. Para cada efeito, há sempre uma causa. Tudo que você possui na vida fluiu em sua direção por causa da forma como pensou anteriormente. Para mudar o futuro, mude seus pensamentos.',
      source_chapter: 'Leis da Vida — Lei 1: Causa e Efeito',
    },
    {
      text: 'Suas despesas sempre subirão para igualar sua renda — se você permitir. Para se tornar financeiramente independente, revogue a Lei de Parkinson: deixe seus gastos crescerem mais lentamente que sua renda e invista a diferença.',
      source_chapter: 'Leis do Dinheiro — Lei 52: Parkinson',
    },
    {
      text: 'O propósito de qualquer negócio é criar e manter clientes. Lucros são puramente uma medida de quão bem o negócio cumpre esse propósito.',
      source_chapter: 'Leis dos Negócios — Lei 20: Propósito',
    },
    {
      text: 'Produtos que tentam ser tudo para todos não vão a lugar algum. A especialização é o ponto de partida do marketing bem-sucedido.',
      source_chapter: 'Leis dos Negócios — Lei 29: Especialização',
    },
    {
      text: 'A persistência é a autodisciplina em ação. Se você está disposto a persistir mais do que qualquer pessoa, demonstra fé inabalável em si mesmo. Nada pode se colocar no caminho.',
      source_chapter: 'Leis do Sucesso — Lei 19: Persistência',
    },
    {
      text: 'Em vendas, confiança é tudo. Pessoas nunca compram sem primeiro formar uma relação de confiança com o vendedor. A relação sempre sobrevive à transação.',
      source_chapter: 'Leis de Vendas — Lei 66: Confiança',
    },
    {
      text: 'A preparação meticulosa é responsável por 80% do sucesso em qualquer negociação. Quanto mais tempo você investiga antes, mais forte é sua posição.',
      source_chapter: 'Leis de Negociação — Lei 80: Preparação',
    },
    {
      text: 'Concentre-se nos 20% de atividades que entregam 80% do valor. Invista 10-12 minutos planejando seu dia e ganhe cerca de 2 horas de produtividade extra.',
      source_chapter: 'Leis do Tempo — Lei 89: Prioridades',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Auditoria de Crenças Limitantes',
      icon: '🧠',
      color_theme: 'accent',
      description:
        'Identifique 3 crenças sobre dinheiro, sucesso ou capacidade que podem estar limitando seus resultados. Substitua cada uma por uma crença fortalecedora.',
      template_text:
        'Crença limitante: [CRENÇA]. Nova crença: [CRENÇA POSITIVA]. Evidência de que a nova crença é verdadeira: [EVIDÊNCIA].',
      checklist: [
        'Identifiquei 3 crenças que podem estar me limitando',
        'Escrevi uma crença substituta positiva para cada uma',
        'Encontrei pelo menos uma evidência real que apoia a nova crença',
        'Li minhas novas crenças em voz alta pela manhã durante 7 dias',
      ],
    },
    {
      title: 'Exercício 2 — Regra dos 10% de Poupança',
      icon: '💰',
      color_theme: 'green',
      description:
        'Comece imediatamente a guardar 10% de toda renda que receber, aplicando a Lei da Poupança de Tracy.',
      checklist: [
        'Configurei uma transferência automática de 10% da minha renda',
        'Criei uma conta separada exclusiva para poupança/investimento',
        'Identifiquei um gasto desnecessário que posso cortar esta semana',
        'Pesquisei pelo menos uma opção de investimento para o dinheiro guardado',
      ],
    },
    {
      title: 'Exercício 3 — A Regra 80/20 na Prática',
      icon: '🎯',
      color_theme: 'orange',
      description:
        'Analise suas atividades da última semana e identifique os 20% que geraram 80% dos resultados. Elimine ou delegue o resto.',
      checklist: [
        'Listei todas as atividades que fiz na última semana',
        'Marquei quais geraram resultados reais e mensuráveis',
        'Identifiquei as 2-3 atividades de maior impacto',
        'Eliminei ou delegue pelo menos uma atividade de baixo valor',
        'Reservei mais tempo na agenda para as atividades de alto impacto',
      ],
    },
  ],
}

// ============================================================
// Book 5: Liderando a Investida
// ============================================================

const book5: BookData = {
  slug: 'liderando-a-investida',
  metadata: {
    title: 'Liderando a Investida',
    original_title: 'Leading the Charge',
    author: 'Tony Zinni e Tony Koltz',
    year: 2009,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 13,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Tony Zinni é um general quatro estrelas aposentado do Corpo de Fuzileiros Navais dos Estados Unidos e ex-Comandante do Comando Central Americano (CENTCOM). Em <strong>"Liderando a Investida"</strong>, ele transpõe décadas de experiência no campo de batalha para o mundo corporativo, argumentando que os métodos tradicionais de liderança estão fracassando diante de um mundo radicalmente transformado.</p>
<p>O livro identifica <strong>11 qualidades essenciais</strong> que os líderes do futuro precisarão desenvolver para ter sucesso em um ambiente cada vez mais fluido, imprevisível e conectado. A fusão entre princípios testados pelo tempo e a capacidade de inovar e se adaptar é a chave.</p>

<div class="highlight-box">
"Se você acordasse hoje após um cochilo de vinte anos estilo Rip Van Winkle, encontraria um mundo vastamente diferente — chocantemente transformado, cheio de crises, conflitos, ameaças e turbulências. Sua primeira reação seria: 'Quem esteve no comando? O que aconteceu com os líderes? Como puderam nos trazer até aqui?'"
</div>

<h2>Elemento 1: Autoconhecimento</h2>
<p>Antes de liderar outros, você precisa responder a perguntas difíceis: <strong>Quem é você? O que define você? Quais valores são mais importantes? Você vive esses valores plenamente?</strong> Sem essas respostas, você não conseguirá lidar com as pressões e demandas que são parte integral da liderança.</p>
<p>Líderes precisam manter equilíbrio entre <strong>integridade</strong> (obrigação de falar a verdade e aderir ao código pessoal) e <strong>lealdade</strong> (compromisso com a organização). Se você pede lealdade às pessoas, deve retribuir com integridade e honestidade absolutas.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Trabalho como vocação:</strong> Quem vê o trabalho como "emprego" busca apenas dinheiro. Quem vê como "profissão" entende os padrões. Mas quem vê como "vocação" é verdadeiramente dedicado. Os líderes excepcionais encontram sua vocação.</div>
</div>

<h2>Elemento 2: Padrões Éticos</h2>
<p>Bons líderes agem eticamente — é a abordagem inteligente e sustentável. Empresas bem-sucedidas não apenas lucram, mas entregam o produto certo, no preço certo, tratando <strong>funcionários, fornecedores e clientes da forma certa</strong>. Hoje, quando clientes podem descobrir qualquer coisa sobre uma empresa na velocidade de um motor de busca, não basta cumprir o mínimo da lei.</p>
<p>As pessoas buscam organizações que agem eticamente, líderes que compreendem sua <strong>responsabilidade social corporativa</strong> e consistência entre discurso e ação.</p>

<div class="highlight-box">
"Sempre soubemos que o egoísmo irresponsável era má moral; agora sabemos que é má economia."
— Franklin Roosevelt
</div>

<h2>Elemento 3: Interesse Genuíno pelas Pessoas</h2>
<p>Liderança hoje é mais <strong>participativa e inclusiva</strong>. Em vez de depender do cargo para conferir autoridade, você precisa conquistá-la. A nova geração chega com Facebook, YouTube, blogs e websites próprios — são mais assertivos e bem-informados do que qualquer geração anterior. Para liderá-los, você precisa:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Peça feedback constantemente:</strong> Ouvir é uma marca de respeito que a nova geração exige.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Cuide da pessoa inteira:</strong> Corpo, mente e espírito — não apenas o "recurso humano".</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Ofereça mentoria e coaching:</strong> Invista no desenvolvimento de carreira de cada pessoa.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Remova obstáculos:</strong> Seu papel como líder é liberar o caminho para que outros performem.</div>
</div>

<h2>Elemento 4: Consciência Ambiental</h2>
<p>Para ser um grande líder, você precisa <strong>sair do escritório e vivenciar o que está acontecendo no mercado</strong>. Se você depende de informações filtradas por outras pessoas, sempre estará ligeiramente desconectado da realidade. Ir ao campo permite detectar sinais de alerta precoce, entender complexidades, avaliar a concorrência e descobrir novos modelos de negócio.</p>

<h2>Elemento 5: Compreensão da Empresa</h2>
<p>Líderes eficazes entendem suas organizações <strong>completamente</strong> — não apenas sua área ou departamento. O ambiente inclui todo o espaço em que a empresa opera: stakeholders, parceiros, recursos, desafios, ameaças, concorrentes, reguladores e condições naturais. O líder que enxerga o ecossistema completo toma decisões superiores.</p>

<h2>Elemento 6: Velocidade e Agilidade</h2>
<p>No mundo militar, velocidade é frequentemente a diferença entre vida e morte. Nos negócios, é a diferença entre <strong>liderar o mercado e ser irrelevante</strong>. Líderes do futuro precisam tomar decisões rapidamente, iterar com agilidade e se adaptar a condições que mudam a cada semana.</p>

<h2>Elemento 7: Conhecimento de Domínio</h2>
<p>Grandes líderes têm um <strong>apetite insaciável por novas ideias</strong>. Reservam tempo para pensamento criativo, estudam campos diferentes do seu e cultivam a curiosidade como ferramenta estratégica. O conhecimento profundo do seu domínio, combinado com perspectivas amplas de outros campos, gera insights que nenhum concorrente pode replicar.</p>

<h2>Elemento 8: Comunicação</h2>
<p>Líderes são o <strong>rosto humano de suas organizações</strong>. Em tempos de crise, quando todos procuram orientação, a capacidade de comunicar com clareza, empatia e confiança se torna a competência mais valiosa. A comunicação do líder define o tom de toda a organização.</p>

<h2>Elemento 9: Tomada de Decisão</h2>
<p>Líderes tomam decisões que combinam <strong>intuição com conhecimento técnico</strong>. Não se trata de escolher entre dados e instinto — os melhores líderes integram ambos. Coletam informações rigorosas, mas não ficam paralisados pela análise. Reconhecem que a perfeição é inimiga do bom e que decidir tarde é frequentemente pior do que decidir imperfeitamente.</p>

<h2>Elemento 10: Gestão de Crises</h2>
<p>Grandes líderes <strong>conduzem um rumo calmo através de mares confusos</strong>. Quando as coisas dão errado, a maioria das pessoas na organização olha para o líder em busca de direção. Líderes eficazes respiram fundo, avaliam a situação realisticamente e inspiram todos a voltar ao trabalho. Demonstram resiliência e persistência como exemplo vivo.</p>

<h2>Elemento 11: Visão Estratégica</h2>
<p>Líderes são bons em <strong>pensar e agir estrategicamente</strong>. Antecipam oportunidades futuras, preparam recursos, pensam em todos os problemas e riscos potenciais. Quando a oportunidade surge, a organização está mais preparada do que qualquer outra para aproveitá-la.</p>

<div class="highlight-box">
"Um mundo novo e estranho tem emergido nas últimas duas décadas. Ninguém sabe para onde está indo. Muitos temem seus desafios, mas precisamos de líderes que vejam suas oportunidades. Seja um deles."
</div>

<h2>Conclusão</h2>
<p>Tony Zinni mostra que a liderança do futuro exige muito mais do que caráter — embora caráter continue sendo fundamental. Os líderes que prosperarão serão aqueles capazes de <strong>fundir princípios atemporais com capacidade de inovação e adaptação</strong>. Autoconhecimento, ética, interesse genuíno pelas pessoas, velocidade, visão estratégica e comunicação eficaz formam o kit de sobrevivência do líder do século XXI.</p>`,
  mindmap_json: {
    center_label: 'LIDERANDO A INVESTIDA',
    center_sublabel: '11 Elementos da Liderança do Futuro',
    branches: [
      {
        title: 'Fundação Pessoal',
        icon: '🪨',
        items: [
          'Autoconhecimento profundo',
          'Código pessoal de valores',
          'Equilíbrio integridade-lealdade',
          'Trabalho como vocação',
        ],
      },
      {
        title: 'Ética e Pessoas',
        icon: '🤝',
        items: [
          'Aja eticamente sempre',
          'Interesse genuíno pelas pessoas',
          'Feedback como marca de respeito',
          'Cuide da pessoa inteira',
        ],
      },
      {
        title: 'Consciência e Conhecimento',
        icon: '🔭',
        items: [
          'Saia do escritório e vá ao campo',
          'Entenda o ecossistema completo',
          'Apetite insaciável por ideias',
          'Conhecimento profundo do domínio',
        ],
      },
      {
        title: 'Velocidade e Decisão',
        icon: '⚡',
        items: [
          'Agilidade é vantagem competitiva',
          'Integre intuição com dados',
          'Decidir tarde é pior que imperfeito',
          'Itere e adapte rapidamente',
        ],
      },
      {
        title: 'Comunicação e Crise',
        icon: '📢',
        items: [
          'Líder é o rosto da organização',
          'Clareza, empatia e confiança',
          'Rumo calmo em mares turbulentos',
          'Resiliência como exemplo vivo',
        ],
      },
      {
        title: 'Visão Estratégica',
        icon: '🌟',
        items: [
          'Antecipe oportunidades futuras',
          'Prepare recursos com antecedência',
          'Fusão do testado com o inovador',
          'Veja oportunidades, não ameaças',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Se você acordasse após um cochilo de vinte anos, sua primeira reação ao ver este mundo seria: Quem esteve no comando? O que aconteceu com os líderes? Os métodos de ontem estão fracassando.',
      source_chapter: 'Introdução',
    },
    {
      text: 'Quem vê o trabalho como emprego busca apenas dinheiro. Quem vê como profissão entende os padrões. Mas quem vê como vocação é verdadeiramente dedicado. Os líderes excepcionais do futuro verão seu trabalho como vocação.',
      source_chapter: 'Elemento 1 — Autoconhecimento',
    },
    {
      text: 'Sempre soubemos que o egoísmo irresponsável era má moral; agora sabemos que é má economia. Quando organizações agem eticamente, têm uma força de trabalho orgulhosa, comprometida e saudável.',
      source_chapter: 'Elemento 2 — Padrões Éticos',
    },
    {
      text: 'A liderança hoje é mais participativa e inclusiva. Em vez de depender do cargo para conferir autoridade, você precisa conquistá-la. Esperar que as pessoas perguntem "quão alto" quando você diz "pule" simplesmente não funciona mais.',
      source_chapter: 'Elemento 3 — Interesse Genuíno',
    },
    {
      text: 'Os melhores líderes estão lá fora, no campo. Não confiam no fascínio hipnótico de estatísticas e dados. Valorizam os cheiros, sons e toques da linha de frente para sentir seu "campo de batalha".',
      source_chapter: 'Elemento 4 — Consciência Ambiental',
    },
    {
      text: 'Um mundo novo e estranho tem emergido nas últimas duas décadas. Ninguém sabe para onde está indo. Muitos temem seus desafios, mas precisamos de líderes que vejam suas oportunidades. Seja um deles.',
      source_chapter: 'Conclusão',
    },
    {
      text: 'Defina a si mesmo e seu código para viver e liderar. Nunca traia seu código. Viva-o e busque uma vida que importa para você. Pense no que deixa para trás — seu legado.',
      source_chapter: 'Elemento 1 — Autoconhecimento',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Defina Seu Código Pessoal de Liderança',
      icon: '📜',
      color_theme: 'accent',
      description:
        'Responda às perguntas fundamentais de Zinni para construir sua base como líder: Quem é você? O que define você? Quais valores são inegociáveis?',
      template_text:
        'Meus 3 valores inegociáveis são: [VALOR 1], [VALOR 2], [VALOR 3]. Minha vocação é: [VOCAÇÃO]. O legado que quero deixar: [LEGADO].',
      checklist: [
        'Escrevi meus 3 valores mais importantes',
        'Avaliei se estou vivendo esses valores no dia a dia',
        'Identifiquei uma situação recente onde comprometi um valor',
        'Defini uma ação concreta para alinhar comportamento e valores',
      ],
    },
    {
      title: 'Exercício 2 — Vá ao Campo Esta Semana',
      icon: '🏃',
      color_theme: 'green',
      description:
        'Saia do escritório e vivencie a realidade do seu mercado. Visite clientes, converse com a equipe operacional ou observe a concorrência pessoalmente.',
      checklist: [
        'Visitei um cliente ou ponto de contato com o público',
        'Conversei com pelo menos 3 pessoas da linha de frente',
        'Anotei 3 observações que não aparecem em relatórios',
        'Transformei uma observação em uma ação de melhoria',
      ],
    },
    {
      title: 'Exercício 3 — Peça Feedback de Baixo para Cima',
      icon: '🔄',
      color_theme: 'orange',
      description:
        'Peça feedback honesto às pessoas que você lidera. Pergunte: O que posso fazer melhor? O que devo parar de fazer? O que devo começar a fazer?',
      checklist: [
        'Pedi feedback a pelo menos 3 pessoas que lidero',
        'Ouvi sem me defender ou justificar',
        'Identifiquei o padrão mais recorrente nas respostas',
        'Comuniquei uma mudança concreta que farei com base no feedback',
        'Marquei data para pedir feedback novamente em 30 dias',
      ],
    },
  ],
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

async function main() {
  const books = [book1, book2, book3, book4, book5]

  // Get current book count for sort_order
  const { count } = await supabase
    .from('resumox_books')
    .select('*', { count: 'exact', head: true })

  let sortOrder = count || 0
  let inserted = 0

  console.log('='.repeat(60))
  console.log('  RESUMOX — Inserting 5 New Books (Batch 8)')
  console.log('='.repeat(60))

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
