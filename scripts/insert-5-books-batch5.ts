#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content (Batch 5)
 * Books: Winners Never Cheat, Trade-Off, Who Says Elephants Can't Dance,
 *        The War For Talent, The Winner Within
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
// Book 1: Winners Never Cheat
// ============================================================

const book1: BookData = {
  slug: 'vencedores-nunca-trapaceiam',
  metadata: {
    title: 'Vencedores Nunca Trapaceiam',
    original_title: 'Winners Never Cheat: Even in Difficult Times',
    author: 'Jon M. Huntsman',
    year: 2005,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Jon M. Huntsman construiu uma empresa química multibilionária — a Huntsman Corporation — partindo literalmente do zero. Neste livro, ele apresenta <strong>nove valores fundamentais</strong> que guiaram sua vida e seus negócios, provando que é possível vencer no mundo dos negócios sem jamais comprometer a ética. Sua tese central é provocadora e simples: <strong>vencedores de verdade nunca trapaceiam</strong>, e trapaceiros nunca vencem de verdade.</p>
<p>Huntsman argumenta que a integridade nos negócios não é apenas uma questão moral — é uma <strong>vantagem competitiva sustentável</strong>. Enquanto a desonestidade pode trazer ganhos de curto prazo, apenas a conduta ética constrói a reputação, a confiança e os relacionamentos que sustentam o sucesso duradouro. Ele ilustra cada princípio com histórias reais de sua própria jornada, desde a infância humilde em uma família rural de Idaho até negociações bilionárias com gigantes industriais.</p>

<div class="highlight-box">
  "Não existem atalhos morais no jogo da vida ou dos negócios. Existem basicamente três tipos de pessoas: as que não têm sucesso, as que têm sucesso temporariamente e as que se tornam e permanecem bem-sucedidas. A diferença está inteiramente no caráter." — Jon Huntsman
</div>

<h2>Valor 1: Jogar Limpo desde a Infância</h2>
<p>Huntsman acredita que os valores fundamentais são aprendidos na infância — no quintal, no playground, nas interações com família e vizinhos. As <strong>regras básicas de decência</strong> que aprendemos quando crianças são as mesmas que devem guiar nossas decisões nos negócios: não mentir, não roubar, cumprir promessas, tratar os outros com respeito.</p>
<p>O problema, segundo ele, é que muitos adultos abandonam essas regras simples quando entram no mundo corporativo, como se os negócios operassem em uma dimensão moral diferente. Huntsman rejeita essa ideia completamente: <strong>não existe uma ética separada para os negócios</strong>. As mesmas regras do playground se aplicam na sala de reuniões.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Regras do playground:</strong> Não minta, não roube, não trapaceie. Cumpra suas promessas. Trate os outros como gostaria de ser tratado. Essas regras são suficientes para guiar qualquer decisão empresarial.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Caráter não é situacional:</strong> Se você é honesto apenas quando é conveniente, você não é honesto. A verdadeira integridade se revela nos momentos difíceis, quando trapacear seria mais fácil e lucrativo.</div>
</div>

<h2>Valor 2: Estabelecer Limites Morais Inegociáveis</h2>
<p>Cada pessoa precisa definir seus <strong>limites morais absolutos</strong> — linhas que jamais cruzará, independentemente da pressão ou da recompensa. Huntsman conta como recusou participar de esquemas antiéticos propostos pelo próprio presidente dos Estados Unidos (na era Nixon), arriscando sua carreira no processo.</p>
<p>Ele argumenta que, sem limites claros definidos antecipadamente, as pessoas são vulneráveis à <strong>"ladeira escorregadia"</strong> — pequenos compromissos éticos que se acumulam até que a pessoa se encontra em território moral inaceitável. O segredo é decidir seus limites antes de enfrentar a pressão, não durante.</p>

<div class="highlight-box">
  "Existe um ponto em que devemos traçar uma linha na areia e dizer: 'Não vou ultrapassar isso.' Se não definirmos esse ponto com antecedência, a areia simplesmente engole qualquer limite que tenhamos." — Jon Huntsman
</div>

<h2>Valor 3: Manter a Palavra como Lei</h2>
<p>Para Huntsman, sua palavra é seu contrato mais sagrado. Ele narra a célebre negociação com Charles Miller Smith, CEO da ICI, na qual fechou um acordo verbal de US$ 2,8 bilhões. Quando as condições de mercado mudaram dramaticamente a seu favor antes da assinatura formal, Huntsman <strong>manteve o preço original</strong> — custando-lhe aproximadamente US$ 200 milhões — simplesmente porque havia dado sua palavra.</p>
<p>Essa atitude não é ingenuidade, mas estratégia de longo prazo: a <strong>reputação de manter a palavra</strong> torna futuros negócios mais fáceis, rápidos e lucrativos. Pessoas querem fazer negócios com quem é confiável.</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Aperto de mão vale mais que contrato:</strong> A reputação de honrar compromissos verbais é um ativo inestimável. Huntsman perdeu US$ 200 milhões em uma negociação para manter sua palavra — e isso abriu portas para bilhões em futuros negócios.</div>
</div>

<h2>Valor 4: Tratar Todos com Dignidade</h2>
<p>Huntsman insiste que <strong>toda pessoa merece ser tratada com respeito e dignidade</strong>, independentemente de sua posição. Ele conta como a experiência de crescer pobre e ver sua mãe ser tratada com desprezo moldou sua determinação de tratar todos com consideração — do zelador ao CEO.</p>
<p>Nos negócios, isso se traduz em práticas concretas: nunca humilhar um adversário em uma negociação, não explorar a fraqueza de um parceiro, e sempre deixar a outra parte sair com sua dignidade intacta. <strong>Negociações onde todos saem bem</strong> criam relacionamentos duradouros e oportunidades futuras.</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Nunca esmague seu adversário:</strong> Quando você humilha alguém em uma negociação, ganha uma batalha mas perde a guerra. Permita que a outra parte mantenha sua dignidade e você terá um parceiro, não um inimigo.</div>
</div>

<h2>Valor 5: A Generosidade como Princípio de Vida</h2>
<p>Huntsman é um dos maiores filantropos dos Estados Unidos, tendo doado mais de US$ 1,5 bilhão ao longo de sua vida. Ele argumenta que a generosidade não é apenas um dever moral, mas uma <strong>fonte de realização pessoal</strong> que nenhuma conquista material pode igualar.</p>
<p>Sua filosofia é simples: quanto mais você dá, mais recebe — não necessariamente em dinheiro, mas em significado, propósito e conexões humanas. Ele encoraja todos a <strong>compartilhar seu tempo, talento e recursos</strong>, independentemente de quanto possuam, porque a generosidade transforma tanto quem dá quanto quem recebe.</p>

<div class="highlight-box">
  "A medida final de uma pessoa não é onde ela se posiciona em momentos de conforto e conveniência, mas onde ela se posiciona em tempos de desafio e controvérsia. O verdadeiro caráter se revela na adversidade." — Jon Huntsman
</div>

<h2>Valor 6: Coragem para Fazer o que É Certo</h2>
<p>Fazer a coisa certa frequentemente exige coragem, porque o caminho ético nem sempre é o mais fácil ou popular. Huntsman relata momentos em que precisou <strong>confrontar superiores, recusar ordens antiéticas</strong> e aceitar perdas financeiras significativas para manter seus princípios.</p>
<p>Ele distingue entre coragem física e <strong>coragem moral</strong> — esta última sendo muito mais rara e difícil. A coragem moral é a disposição de defender o que é certo mesmo quando isso significa ficar sozinho, perder dinheiro ou enfrentar críticas.</p>

<h2>Valor 7: Legado Além do Lucro</h2>
<p>Huntsman encerra argumentando que o verdadeiro sucesso não é medido pela riqueza acumulada, mas pelo <strong>legado deixado</strong>. Ele convida o leitor a imaginar o que será dito em seu funeral — e a viver de forma que essas palavras reflitam uma vida de integridade, generosidade e impacto positivo.</p>
<p>Para ele, a pergunta fundamental não é "quanto ganhei?", mas <strong>"que diferença fiz?"</strong>. Os vencedores de verdade são aqueles cuja riqueza — seja ela financeira, relacional ou espiritual — beneficia não apenas a si mesmos, mas toda a comunidade ao seu redor.</p>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>O teste do funeral:</strong> Imagine o que será dito sobre você no seu funeral. Se as palavras que você imagina não refletem como você vive hoje, é hora de mudar. O legado se constrói diariamente, uma decisão ética de cada vez.</div>
</div>`,

  mindmap_json: {
    center_label: 'VENCEDORES NUNCA TRAPACEIAM',
    center_sublabel: '9 Valores para o Sucesso Ético nos Negócios',
    branches: [
      {
        title: 'Fundamentos Éticos',
        icon: '⚖️',
        items: [
          'Regras do playground valem na sala de reuniões',
          'Caráter não é situacional',
          'Integridade é vantagem competitiva',
          'Não existe ética separada para negócios',
        ],
      },
      {
        title: 'Limites Morais',
        icon: '🛡️',
        items: [
          'Definir limites antes da pressão',
          'Evitar a ladeira escorregadia',
          'Coragem para recusar ordens antiéticas',
          'Linha na areia inegociável',
        ],
      },
      {
        title: 'Palavra & Confiança',
        icon: '🤝',
        items: [
          'Aperto de mão vale mais que contrato',
          'Reputação como ativo estratégico',
          'Honrar compromissos verbais sempre',
          'Confiança gera negócios futuros',
        ],
      },
      {
        title: 'Dignidade & Respeito',
        icon: '💎',
        items: [
          'Tratar todos com dignidade igual',
          'Nunca humilhar um adversário',
          'Negociações ganha-ganha duradouras',
          'Respeito independe de posição',
        ],
      },
      {
        title: 'Generosidade',
        icon: '🎁',
        items: [
          'Doar tempo, talento e recursos',
          'Generosidade como fonte de propósito',
          'Quanto mais dá, mais recebe',
          'Filantropia como estilo de vida',
        ],
      },
      {
        title: 'Legado & Propósito',
        icon: '🌟',
        items: [
          'Sucesso medido pelo impacto',
          'Teste do funeral como bússola',
          'Riqueza que beneficia a comunidade',
          'Legado construído diariamente',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Não existem atalhos morais no jogo da vida ou dos negócios. A diferença entre sucesso temporário e sucesso duradouro está inteiramente no caráter — e caráter é o que você faz quando ninguém está olhando.',
      source_chapter: 'Valor 1 — Jogar Limpo',
    },
    {
      text: 'Huntsman perdeu US$ 200 milhões ao manter sua palavra em uma negociação com a ICI. Essa "perda" construiu uma reputação que abriu portas para bilhões em futuros negócios. A integridade tem retorno exponencial no longo prazo.',
      source_chapter: 'Valor 3 — Manter a Palavra',
    },
    {
      text: 'Se você não definir seus limites morais antes de enfrentar a pressão, a areia simplesmente engole qualquer linha que você tente traçar no momento. Decisões éticas devem ser tomadas a frio, não sob pressão.',
      source_chapter: 'Valor 2 — Limites Morais',
    },
    {
      text: 'Quando você humilha alguém em uma negociação, ganha uma batalha mas perde a guerra. As melhores negociações são aquelas onde todos saem com dignidade — porque parceiros de longo prazo valem mais que vitórias de curto prazo.',
      source_chapter: 'Valor 4 — Dignidade nas Negociações',
    },
    {
      text: 'A medida final de uma pessoa não é onde ela se posiciona em momentos de conforto, mas onde ela se posiciona em tempos de adversidade. Coragem moral — defender o certo mesmo ficando sozinho — é a qualidade mais rara e mais valiosa na liderança.',
      source_chapter: 'Valor 6 — Coragem Moral',
    },
    {
      text: 'A pergunta fundamental não é "quanto ganhei?" mas "que diferença fiz?". Os vencedores de verdade são aqueles cuja riqueza beneficia não apenas a si mesmos, mas toda a comunidade ao redor.',
      source_chapter: 'Valor 7 — Legado',
    },
    {
      text: 'Huntsman recusou participar de esquemas antiéticos propostos na era Nixon, arriscando sua carreira. Isso prova que a integridade tem custo real — mas o custo de perdê-la é infinitamente maior.',
      source_chapter: 'Valor 2 — A Experiência Nixon',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Defina Seus Limites Inegociáveis',
      icon: '🛡️',
      color_theme: 'accent',
      description: 'Antes que a pressão chegue, defina claramente as linhas que você jamais cruzará nos negócios e na vida pessoal, seguindo o princípio de Huntsman.',
      checklist: [
        'Listei pelo menos 5 situações onde nunca comprometerei minha ética',
        'Escrevi meus limites morais em papel e guardei em local visível',
        'Identifiquei uma situação passada onde deveria ter sido mais firme',
        'Compartilhei meus valores com alguém de confiança como compromisso público',
      ],
    },
    {
      title: 'Exercício 2 — Auditoria de Dignidade',
      icon: '💎',
      color_theme: 'green',
      description: 'Avalie como você trata as pessoas ao seu redor, especialmente aquelas que não podem lhe oferecer nada em troca, aplicando o princípio da dignidade universal.',
      checklist: [
        'Refleti sobre como trato pessoas em posições inferiores à minha',
        'Identifiquei uma negociação onde posso ser mais justo com a outra parte',
        'Pratiquei um ato de respeito genuíno com alguém que normalmente ignoro',
        'Avaliei se minhas vitórias profissionais deixaram dignidade para o outro lado',
      ],
    },
    {
      title: 'Exercício 3 — Construa Seu Legado Hoje',
      icon: '🌟',
      color_theme: 'orange',
      description: 'Aplique o "teste do funeral" de Huntsman: imagine o que será dito sobre você e comece a viver de forma que essas palavras sejam verdadeiras.',
      checklist: [
        'Escrevi o que gostaria que dissessem no meu funeral',
        'Comparei essas palavras com meu comportamento atual',
        'Identifiquei uma área onde preciso mudar para alinhar ação e legado',
        'Defini uma ação concreta de generosidade para realizar esta semana',
      ],
    },
  ],
}

// ============================================================
// Book 2: Trade-Off
// ============================================================

const book2: BookData = {
  slug: 'trade-off',
  metadata: {
    title: 'Trade-Off',
    original_title: 'Trade-Off: Why Some Things Catch On, and Others Don\'t',
    author: 'Kevin Maney',
    year: 2009,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 13,
    cover_gradient_from: '#0d1b2a',
    cover_gradient_to: '#1b263b',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Kevin Maney revela uma dinâmica poderosa e frequentemente ignorada que determina o sucesso ou fracasso de produtos, serviços e tecnologias: o <strong>trade-off entre fidelidade e conveniência</strong>. Fidelidade é a qualidade total da experiência — o prazer, o prestígio, a exclusividade. Conveniência é a facilidade de acesso — o quão barato, rápido e acessível algo é.</p>
<p>A tese central é que <strong>quase nenhum produto consegue ser altamente fiel e altamente conveniente ao mesmo tempo</strong>. As empresas e tecnologias que vencem são aquelas que escolhem deliberadamente um dos lados — ou entregam uma experiência de fidelidade extraordinária, ou oferecem conveniência imbatível. As que ficam no meio-termo — a chamada <strong>"zona de falha"</strong> — quase sempre fracassam.</p>

<div class="highlight-box">
  "A maioria dos produtos e serviços que fracassam não falha porque é ruim. Falha porque fica presa no meio — nem fiel o suficiente para justificar o esforço, nem conveniente o suficiente para ser a escolha fácil." — Kevin Maney
</div>

<h2>Fidelidade: A Experiência que Cria Desejo</h2>
<p>Fidelidade é muito mais do que qualidade. É a <strong>experiência total</strong> que envolve um produto ou serviço — a aura, o prestígio, a exclusividade, a sensação de pertencer a algo especial. Um concerto ao vivo tem alta fidelidade porque é único, emocional e irreproduzível. Um Rolex tem alta fidelidade não porque marca as horas melhor, mas porque carrega <strong>status e identidade</strong>.</p>
<p>Maney identifica os componentes da fidelidade: qualidade excepcional, exclusividade, personalização, experiência sensorial rica e conexão emocional. A fidelidade funciona porque <strong>atende necessidades psicológicas profundas</strong> — pertencimento, identidade, status — que a conveniência não consegue satisfazer.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Fidelidade = experiência total:</strong> Não é apenas qualidade do produto, mas a combinação de exclusividade, emoção, status e identidade que a experiência proporciona. Quanto mais insubstituível a experiência, maior a fidelidade.</div>
</div>

<h2>Conveniência: A Força que Democratiza</h2>
<p>Conveniência é o oposto da fidelidade em quase todos os aspectos. É sobre <strong>facilidade, acessibilidade e baixo custo</strong>. O MP3 venceu o CD não por qualidade sonora superior (na verdade, é inferior), mas por ser infinitamente mais conveniente — você carrega milhares de músicas no bolso.</p>
<p>A conveniência funciona através de quatro mecanismos: redução de preço, eliminação de barreiras de acesso, economia de tempo e simplificação. Quando a conveniência atinge um nível crítico, ela <strong>redefine mercados inteiros</strong> — como o Walmart fez com o varejo ou a Amazon com o comércio eletrônico.</p>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Conveniência redefine mercados:</strong> Quando algo se torna fácil, barato e acessível o suficiente, cria uma nova massa de consumidores que antes não participava do mercado. A conveniência democratiza o acesso.</div>
</div>

<h2>A Zona de Falha: O Meio-Termo Mortal</h2>
<p>O insight mais poderoso de Maney é o conceito da <strong>zona de falha</strong> — o espaço perigoso onde um produto não é nem fiel o suficiente para ser especial, nem conveniente o suficiente para ser a escolha fácil. A maioria dos fracassos nos negócios acontece exatamente aqui.</p>
<p>Exemplos clássicos incluem o Starbucks quando tentou expandir demais (perdendo fidelidade sem ganhar conveniência real), companhias aéreas que tentam ser premium e econômicas ao mesmo tempo, e restaurantes que não são nem fast-food nem gastronomia de qualidade. <strong>O meio-termo é onde as margens desaparecem</strong> e os clientes ficam insatisfeitos.</p>

<div class="highlight-box">
  "A zona de falha é como um buraco negro nos negócios. Ela suga produtos, serviços e empresas inteiras que tentam ser tudo para todos. A clareza estratégica — escolher fidelidade ou conveniência — é a única forma de escapar." — Kevin Maney
</div>

<h2>A Miragem da Fidelidade: Quando a Tecnologia Engana</h2>
<p>Maney alerta para a <strong>miragem da fidelidade</strong> — a ilusão de que uma nova tecnologia pode oferecer tanto fidelidade quanto conveniência simultaneamente. Embora a tecnologia constantemente melhore ambas as dimensões, a dinâmica fundamental permanece: <strong>quanto mais acessível algo se torna, mais perde sua aura de exclusividade</strong>.</p>
<p>A tecnologia pode temporariamente criar a ilusão de ter ambos, mas o mercado eventualmente se ajusta. O iPhone inicialmente parecia oferecer fidelidade e conveniência, mas à medida que smartphones se tornaram commodity, a Apple precisou constantemente reinventar a fidelidade através de novos recursos e ecossistema exclusivo.</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>A miragem da fidelidade:</strong> A tecnologia pode temporariamente parecer oferecer fidelidade e conveniência ao mesmo tempo, mas o mercado sempre se ajusta. A exclusividade se dissolve quando todos têm acesso.</div>
</div>

<h2>Estratégias de Posicionamento</h2>
<p>Maney oferece um framework prático para posicionamento estratégico. Para quem escolhe <strong>fidelidade</strong>: invista em experiência, exclusividade e personalização; limite deliberadamente o acesso; cobre mais e entregue mais. Para quem escolhe <strong>conveniência</strong>: elimine toda fricção possível; escale massivamente; reduza preços através de eficiência.</p>
<p>A chave é a <strong>consistência da escolha</strong>. Cada decisão — de design de produto a estratégia de distribuição — deve reforçar o posicionamento escolhido. Empresas que tentam perseguir ambos acabam inevitavelmente na zona de falha.</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Consistência estratégica:</strong> Cada decisão deve reforçar sua posição no espectro fidelidade-conveniência. Misturar sinais é o caminho mais rápido para a zona de falha.</div>
</div>

<h2>O Efeito na Vida Pessoal</h2>
<p>Maney estende o framework para a vida pessoal. Nossas carreiras, relacionamentos e escolhas de estilo de vida também operam na dinâmica fidelidade-conveniência. <strong>Especialistas que oferecem experiência única</strong> (fidelidade) prosperam mais do que generalistas que tentam ser tudo para todos (zona de falha).</p>
<p>A lição final é que <strong>a clareza de posicionamento é libertadora</strong>. Quando você sabe exatamente o que oferece — seja nos negócios ou na vida — pode investir toda sua energia em ser excepcional naquilo, em vez de desperdiçar recursos tentando cobrir todas as bases.</p>

<div class="highlight-box">
  "Escolha ser extraordinário em uma dimensão em vez de medíocre em duas. O mercado recompensa a clareza e pune a ambiguidade. Não existe meio-termo sustentável entre fidelidade e conveniência." — Kevin Maney
</div>`,

  mindmap_json: {
    center_label: 'TRADE-OFF',
    center_sublabel: 'Fidelidade vs. Conveniência',
    branches: [
      {
        title: 'Fidelidade',
        icon: '💎',
        items: [
          'Experiência total única e emocional',
          'Exclusividade e personalização',
          'Status e identidade do consumidor',
          'Preço premium justificado',
        ],
      },
      {
        title: 'Conveniência',
        icon: '⚡',
        items: [
          'Facilidade, acessibilidade e baixo custo',
          'Eliminação de barreiras de acesso',
          'Escala massiva e eficiência',
          'Democratização de mercados',
        ],
      },
      {
        title: 'Zona de Falha',
        icon: '⚠️',
        items: [
          'Meio-termo mortal entre os dois extremos',
          'Margens desaparecem sem diferenciação',
          'Ser tudo para todos = nada para ninguém',
          'Maioria dos fracassos acontece aqui',
        ],
      },
      {
        title: 'Miragem da Fidelidade',
        icon: '🪞',
        items: [
          'Tecnologia cria ilusão temporária',
          'Exclusividade se dissolve com acesso',
          'Mercado sempre se ajusta',
          'Reinvenção constante necessária',
        ],
      },
      {
        title: 'Posicionamento',
        icon: '🎯',
        items: [
          'Escolher um lado deliberadamente',
          'Consistência em cada decisão',
          'Reforçar posição continuamente',
          'Clareza estratégica como vantagem',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'A maioria dos produtos que fracassam não falha porque é ruim. Falha porque fica presa no meio — nem fiel o suficiente para ser especial, nem conveniente o suficiente para ser a escolha fácil. O meio-termo é a armadilha mortal dos negócios.',
      source_chapter: 'A Zona de Falha',
    },
    {
      text: 'O MP3 venceu o CD não por qualidade superior — na verdade é inferior — mas por conveniência imbatível. Milhares de músicas no bolso derrotam qualidade sonora perfeita quando o que as pessoas querem é acesso fácil.',
      source_chapter: 'Conveniência como Força Disruptiva',
    },
    {
      text: 'Um Rolex não marca as horas melhor que um relógio de R$ 50. Sua fidelidade vem da experiência total: exclusividade, status, identidade. Fidelidade atende necessidades psicológicas que conveniência jamais alcança.',
      source_chapter: 'Fidelidade e Experiência',
    },
    {
      text: 'A tecnologia pode temporariamente parecer oferecer fidelidade e conveniência ao mesmo tempo, mas é uma miragem. Quando todos têm acesso, a exclusividade se dissolve e a empresa precisa reinventar constantemente seu diferencial.',
      source_chapter: 'A Miragem da Fidelidade',
    },
    {
      text: 'Cada decisão deve reforçar seu posicionamento no espectro fidelidade-conveniência. Misturar sinais — como uma marca de luxo fazendo promoções agressivas — é o caminho mais rápido para a zona de falha.',
      source_chapter: 'Estratégias de Posicionamento',
    },
    {
      text: 'Na vida pessoal, especialistas que oferecem experiência única prosperam mais do que generalistas que tentam ser tudo para todos. A clareza de posicionamento é libertadora tanto nos negócios quanto na carreira.',
      source_chapter: 'O Framework na Vida Pessoal',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Mapeie Seu Posicionamento',
      icon: '🗺️',
      color_theme: 'accent',
      description: 'Identifique onde seu produto, serviço ou carreira se posiciona no espectro fidelidade-conveniência e avalie se você está na zona de falha.',
      checklist: [
        'Desenhei o espectro fidelidade-conveniência e marquei minha posição atual',
        'Listei 3 concorrentes e posicionei cada um no espectro',
        'Identifiquei se estou na zona de falha (nem fiel nem conveniente o suficiente)',
        'Defini qual direção vou reforçar: mais fidelidade ou mais conveniência',
      ],
    },
    {
      title: 'Exercício 2 — Elimine os Sinais Misturados',
      icon: '🎯',
      color_theme: 'green',
      description: 'Audite todas as suas decisões de produto, preço e comunicação para garantir que cada uma reforça seu posicionamento escolhido.',
      checklist: [
        'Listei 5 decisões recentes sobre meu produto/serviço/carreira',
        'Avaliei se cada decisão reforça fidelidade OU conveniência (não ambos)',
        'Identifiquei pelo menos 2 sinais misturados que estou enviando ao mercado',
        'Criei um plano para eliminar inconsistências no meu posicionamento',
      ],
    },
    {
      title: 'Exercício 3 — Teste da Miragem',
      icon: '🪞',
      color_theme: 'orange',
      description: 'Avalie se a tecnologia está criando uma ilusão de que você pode ter fidelidade e conveniência simultaneamente, e planeje para quando a miragem se dissipar.',
      checklist: [
        'Identifiquei uma vantagem que a tecnologia me deu que pode ser temporária',
        'Avaliei o que acontece quando concorrentes replicarem minha vantagem tecnológica',
        'Defini como vou manter diferenciação quando a exclusividade se dissolver',
        'Planejei minha próxima reinvenção de fidelidade ou salto de conveniência',
      ],
    },
  ],
}

// ============================================================
// Book 3: Who Says Elephants Can't Dance?
// ============================================================

const book3: BookData = {
  slug: 'quem-disse-que-elefantes-nao-dancam',
  metadata: {
    title: 'Quem Disse que os Elefantes Não Dançam?',
    original_title: 'Who Says Elephants Can\'t Dance? Inside IBM\'s Historic Turnaround',
    author: 'Louis V. Gerstner Jr.',
    year: 2002,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 15,
    cover_gradient_from: '#0a192f',
    cover_gradient_to: '#172a45',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Em 1993, a IBM estava à beira do colapso — a gigante tecnológica que havia dominado a computação mundial por décadas perdia bilhões de dólares e muitos especialistas recomendavam desmembrá-la em pedaços menores. Louis Gerstner, um executivo de fora da indústria de tecnologia, assumiu o comando e realizou <strong>uma das maiores viradas corporativas da história</strong>, transformando a IBM de uma empresa de hardware em declínio em uma potência global de serviços e soluções integradas.</p>
<p>Este livro é o relato pessoal de Gerstner sobre como ele salvou a IBM — não através de uma visão tecnológica brilhante, mas através de <strong>disciplina operacional, foco obsessivo no cliente e coragem para desafiar a cultura institucional</strong>. Sua maior e mais controversa decisão foi manter a IBM unida quando todos queriam dividi-la, apostando que o valor da empresa estava exatamente em sua capacidade de oferecer soluções integradas.</p>

<div class="highlight-box">
  "Eu cheguei à IBM sem nenhum plano de 100 dias. Eu cheguei com um conjunto de prioridades que foram moldadas pela pergunta mais fundamental nos negócios: por que os clientes deveriam comprar de nós em vez dos concorrentes?" — Louis Gerstner
</div>

<h2>O Diagnóstico: Uma Gigante em Queda Livre</h2>
<p>Quando Gerstner chegou à IBM em abril de 1993, encontrou uma empresa em crise profunda. A IBM havia perdido US$ 8 bilhões nos três anos anteriores, suas ações despencaram, e <strong>a cultura interna estava paralisada por burocracia e arrogância</strong>. A empresa que havia inventado o computador pessoal estava perdendo para rivais menores e mais ágeis em praticamente todos os mercados.</p>
<p>Gerstner identificou quatro problemas críticos: uma cultura voltada para processos internos em vez de clientes; uma estrutura organizacional fragmentada que impedia soluções integradas; custos absurdamente altos; e uma <strong>mentalidade de "fortaleza sitiada"</strong> que tratava o mundo externo como inimigo em vez de mercado a ser servido.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>O paradoxo da IBM:</strong> A empresa mais admirada do mundo da tecnologia estava morrendo não por falta de talento ou tecnologia, mas por ter perdido completamente o contato com o que seus clientes realmente precisavam.</div>
</div>

<h2>A Decisão Mais Importante: Manter a IBM Unida</h2>
<p>A pressão para desmembrar a IBM era enorme — analistas de Wall Street, a mídia, até membros do próprio conselho defendiam a divisão. Mas Gerstner, após semanas visitando clientes, percebeu algo que os outros não viam: os clientes não queriam comprar peças separadas de tecnologia — queriam <strong>soluções completas que funcionassem juntas</strong>.</p>
<p>A decisão de manter a IBM integrada foi contrária a toda a sabedoria convencional da época, mas provou ser <strong>o golpe de gênio estratégico</strong> que definiu a virada. Gerstner apostou que a capacidade única da IBM de oferecer hardware, software e serviços de forma integrada seria sua maior vantagem competitiva — e estava certo.</p>

<div class="highlight-box">
  "Mantive a IBM unida não por sentimentalismo ou teimosia, mas porque os clientes me disseram que era exatamente isso que precisavam. A integração não era nosso problema — era nossa solução." — Louis Gerstner
</div>

<h2>Transformação Cultural: A Batalha Mais Difícil</h2>
<p>Gerstner descobriu que <strong>a cultura é o jogo inteiro</strong> — não apenas uma parte da estratégia. A cultura da IBM havia se tornado profundamente disfuncional: focada em política interna, avessa a riscos, obcecada por consenso e desconectada do mercado. Mudar isso foi a batalha mais longa e difícil da virada.</p>
<p>Ele implementou mudanças radicais: eliminou o código de vestimenta formal (o icônico terno azul), acabou com comitês desnecessários, exigiu que executivos visitassem clientes regularmente, e vinculou compensação ao <strong>desempenho real do negócio</strong> em vez de métricas internas. A mensagem era clara: a IBM existe para servir clientes, não para perpetuar sua própria burocracia.</p>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Cultura come estratégia no café da manhã:</strong> Gerstner aprendeu que você pode ter a melhor estratégia do mundo, mas se a cultura da organização resistir, nada acontece. Mudar a cultura é mais difícil — e mais importante — do que mudar a estratégia.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Execução supera visão:</strong> Gerstner rejeitou a ideia de que a IBM precisava de uma "grande visão". O que ela precisava era de execução disciplinada: cortar custos, servir clientes, entregar resultados. Visão sem execução é alucinação.</div>
</div>

<h2>A Aposta em Serviços: O Novo Motor de Crescimento</h2>
<p>Uma das decisões mais transformadoras de Gerstner foi apostar massivamente em <strong>serviços de tecnologia</strong> como o novo motor de crescimento da IBM. Ele percebeu que as empresas não queriam apenas comprar computadores — queriam alguém que resolvesse seus problemas tecnológicos de ponta a ponta.</p>
<p>A IBM Global Services cresceu de uma operação modesta para se tornar a <strong>maior empresa de serviços de TI do mundo</strong>, gerando mais receita do que o hardware. Essa mudança fundamental — de vendedora de produtos para provedora de soluções — redefiniu não apenas a IBM, mas toda a indústria de tecnologia.</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>De produtos para soluções:</strong> A IBM deixou de perguntar "que hardware podemos vender?" e passou a perguntar "que problema podemos resolver?". Essa mudança de mentalidade transformou uma empresa moribunda na maior provedora de serviços de TI do planeta.</div>
</div>

<h2>Liderança em Tempos de Crise</h2>
<p>Gerstner oferece lições valiosas sobre liderança em momentos críticos. Ele enfatiza que líderes em crise devem <strong>agir com velocidade e decisão</strong>, mesmo sem informação perfeita. Esperar por dados completos em uma crise é receita para o desastre — melhor tomar uma decisão 80% correta rapidamente do que uma decisão 100% correta tarde demais.</p>
<p>Outra lição crucial: líderes devem <strong>comunicar com honestidade brutal</strong>. Gerstner recusou-se a suavizar a realidade para os funcionários da IBM. Ele disse a verdade sobre a gravidade da situação, o que precisava mudar, e o que aconteceria com quem não se adaptasse. Essa honestidade, embora dolorosa, construiu credibilidade e urgência.</p>

<h2>O Legado: Elefantes Podem Dançar</h2>
<p>Em menos de uma década, Gerstner transformou a IBM de uma empresa que perdia bilhões em uma que gerava lucros recordes. Mais importante, ele provou que <strong>grandes organizações podem se reinventar</strong> — que tamanho não é necessariamente sinônimo de lentidão e que elefantes, de fato, podem dançar.</p>
<p>A lição final é que a virada da IBM não foi resultado de tecnologia revolucionária ou de uma estratégia brilhante. Foi resultado de <strong>liderança disciplinada, foco obsessivo no cliente e coragem para enfrentar a própria cultura</strong>. São princípios aplicáveis a qualquer organização, de qualquer tamanho, em qualquer setor.</p>

<div class="highlight-box">
  "Cultura não é apenas um aspecto do jogo — é o jogo. No final das contas, uma organização não é nada mais do que a capacidade coletiva de seu pessoal de criar valor." — Louis Gerstner
</div>`,

  mindmap_json: {
    center_label: 'ELEFANTES PODEM DANÇAR',
    center_sublabel: 'A Virada Histórica da IBM',
    branches: [
      {
        title: 'Diagnóstico da Crise',
        icon: '🔍',
        items: [
          'US$ 8 bilhões em perdas em 3 anos',
          'Cultura paralisada por burocracia',
          'Desconexão total com clientes',
          'Mentalidade de fortaleza sitiada',
        ],
      },
      {
        title: 'Decisão Estratégica',
        icon: '⚡',
        items: [
          'Manter a IBM unida contra toda pressão',
          'Integração como vantagem competitiva',
          'Clientes queriam soluções completas',
          'Rejeição do desmembramento',
        ],
      },
      {
        title: 'Transformação Cultural',
        icon: '🔄',
        items: [
          'Cultura come estratégia no café da manhã',
          'Foco externo em vez de político interno',
          'Eliminar burocracia e hierarquia',
          'Compensação vinculada a resultados reais',
        ],
      },
      {
        title: 'Aposta em Serviços',
        icon: '🎯',
        items: [
          'De vendedora de hardware a provedora de soluções',
          'IBM Global Services como motor de crescimento',
          'Resolver problemas, não apenas vender produtos',
          'Maior empresa de serviços de TI do mundo',
        ],
      },
      {
        title: 'Liderança na Crise',
        icon: '👑',
        items: [
          'Velocidade e decisão sobre perfeição',
          'Honestidade brutal com funcionários',
          'Execução disciplinada sobre visão grandiosa',
          'Decisão 80% correta rápida > 100% correta tarde',
        ],
      },
      {
        title: 'Legado & Lições',
        icon: '🌟',
        items: [
          'Grandes organizações podem se reinventar',
          'Tamanho não é sinônimo de lentidão',
          'Foco obsessivo no cliente como bússola',
          'Disciplina operacional vence tecnologia',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Gerstner chegou à IBM sem plano de 100 dias. Sua única pergunta era: por que os clientes deveriam comprar de nós? Essa simplicidade — foco no cliente, não em planos grandiosos — foi o que salvou a empresa.',
      source_chapter: 'O Diagnóstico Inicial',
    },
    {
      text: 'A decisão de manter a IBM unida foi contra toda a sabedoria convencional da época. Mas os clientes disseram a Gerstner que queriam soluções integradas — e ele ouviu. Às vezes, a resposta certa é a que todos os "especialistas" rejeitam.',
      source_chapter: 'A Decisão de Manter a IBM Unida',
    },
    {
      text: 'Cultura não é apenas um aspecto do jogo — é o jogo. Gerstner descobriu que a melhor estratégia do mundo é inútil se a cultura da organização resistir à mudança. Transformar cultura é o trabalho mais difícil e mais importante de um líder.',
      source_chapter: 'Transformação Cultural',
    },
    {
      text: 'A IBM parou de perguntar "que hardware podemos vender?" e passou a perguntar "que problema podemos resolver?". Essa mudança de mentalidade — de produtos para soluções — é aplicável a qualquer negócio em qualquer setor.',
      source_chapter: 'A Aposta em Serviços',
    },
    {
      text: 'Em uma crise, melhor tomar uma decisão 80% correta rapidamente do que uma decisão 100% correta tarde demais. A velocidade de decisão é uma vantagem competitiva que poucos líderes compreendem.',
      source_chapter: 'Liderança em Tempos de Crise',
    },
    {
      text: 'Gerstner eliminou o icônico terno azul da IBM não por capricho, mas como símbolo de que a cultura antiga havia morrido. Mudanças culturais precisam de gestos visíveis e simbólicos para serem levadas a sério.',
      source_chapter: 'Mudanças Simbólicas',
    },
    {
      text: 'Visão sem execução é alucinação. A IBM não precisava de uma grande visão — precisava de disciplina operacional, corte de custos e execução implacável. O glamour da estratégia é superestimado; a disciplina da execução é subestimada.',
      source_chapter: 'Execução sobre Visão',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Diagnóstico Cultural Honesto',
      icon: '🔍',
      color_theme: 'accent',
      description: 'Aplique o método de Gerstner: avalie honestamente a cultura da sua organização ou equipe, identificando onde ela está sabotando os resultados.',
      checklist: [
        'Listei 5 comportamentos culturais dominantes na minha organização/equipe',
        'Identifiquei quais desses comportamentos estão prejudicando os resultados',
        'Perguntei a 3 clientes o que eles realmente pensam sobre nosso atendimento',
        'Comparei a percepção interna com a percepção dos clientes',
      ],
    },
    {
      title: 'Exercício 2 — De Produtos para Soluções',
      icon: '🎯',
      color_theme: 'green',
      description: 'Transforme sua mentalidade de "o que vendo" para "que problema resolvo", seguindo a revolução de serviços que salvou a IBM.',
      checklist: [
        'Listei meus 3 principais produtos/serviços/habilidades',
        'Para cada um, identifiquei o problema real que o cliente quer resolver',
        'Encontrei uma forma de oferecer uma solução mais completa ao cliente',
        'Testei a nova abordagem com pelo menos um cliente esta semana',
      ],
    },
    {
      title: 'Exercício 3 — Velocidade de Decisão',
      icon: '⚡',
      color_theme: 'orange',
      description: 'Pratique o princípio de Gerstner de decidir rapidamente com informação imperfeita, em vez de esperar pela certeza total.',
      checklist: [
        'Identifiquei uma decisão que estou adiando por falta de informação completa',
        'Avaliei: tenho pelo menos 80% da informação necessária?',
        'Tomei a decisão e defini como vou corrigir se necessário',
        'Registrei o resultado para calibrar minha velocidade de decisão futura',
      ],
    },
  ],
}

// ============================================================
// Book 4: The War For Talent
// ============================================================

const book4: BookData = {
  slug: 'a-guerra-pelo-talento',
  metadata: {
    title: 'A Guerra pelo Talento',
    original_title: 'The War for Talent',
    author: 'Ed Michaels, Helen Handfield-Jones e Beth Axelrod',
    year: 2001,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1854',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A McKinsey & Company conduziu uma pesquisa abrangente com 77 grandes empresas americanas e 6.000 executivos para entender como as organizações de melhor desempenho gerenciam talento. A conclusão foi clara: <strong>o talento gerencial é o recurso mais escasso e valioso do mundo corporativo</strong>, e as empresas que vencem são aquelas que tratam a gestão de talentos como prioridade estratégica absoluta.</p>
<p>O livro apresenta <strong>cinco imperativos</strong> que separam as empresas vencedoras das medíocres na guerra pelo talento. Não se trata apenas de contratar bem — trata-se de criar uma organização inteira que atrai, desenvolve, energiza e retém as melhores pessoas. As empresas que dominam esses cinco imperativos consistentemente superam suas rivais em desempenho financeiro.</p>

<div class="highlight-box">
  "A guerra pelo talento não é apenas sobre recrutamento. É sobre criar uma mentalidade de talento que permeia toda a organização — desde o CEO até o gestor de linha. As empresas que vencem são aquelas onde os líderes tratam talento como o recurso estratégico mais importante." — Ed Michaels
</div>

<h2>Imperativo 1: Adotar uma Mentalidade de Talento</h2>
<p>O primeiro e mais fundamental imperativo é desenvolver uma <strong>mentalidade de talento</strong> em toda a organização, começando pelo topo. Isso significa que os líderes seniores devem acreditar profundamente que talento superior gera resultados superiores, e que atrair e reter talentos é responsabilidade de todos — não apenas do RH.</p>
<p>A pesquisa da McKinsey revelou uma diferença gritante: nas empresas de alto desempenho, <strong>os líderes dedicam 30-50% do seu tempo</strong> a questões de talento — recrutando, mentorando, avaliando e desenvolvendo pessoas. Nas empresas medianas, essa porcentagem caía para menos de 10%.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Talento é responsabilidade do líder, não do RH:</strong> Nas melhores empresas, os líderes tratam gestão de talentos como prioridade pessoal, dedicando até metade do seu tempo a recrutar, desenvolver e reter as melhores pessoas.</div>
</div>

<h2>Imperativo 2: Criar uma Proposta de Valor Irresistível para o Funcionário</h2>
<p>Assim como as empresas desenvolvem propostas de valor para clientes, precisam criar uma <strong>Employee Value Proposition (EVP)</strong> — uma proposta de valor irresistível que responda à pergunta: "Por que uma pessoa talentosa escolheria trabalhar aqui em vez de em qualquer outro lugar?"</p>
<p>A EVP vai muito além de salário e benefícios. Inclui oportunidades de crescimento, cultura inspiradora, trabalho significativo, liderança admirável e a marca da empresa como empregadora. As empresas vencedoras na guerra pelo talento são aquelas que <strong>personalizam a experiência</strong> para diferentes perfis de talento, reconhecendo que um jovem profissional ambicioso e um executivo experiente valorizam coisas diferentes.</p>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>EVP personalizada:</strong> A proposta de valor não pode ser genérica. As melhores empresas personalizam trabalho, remuneração e experiência para atrair e reter diferentes perfis de talento com necessidades distintas.</div>
</div>

<div class="highlight-box">
  "As pessoas talentosas não ficam em empregos ruins só por dinheiro. Elas ficam por crescimento, propósito e liderança inspiradora. Se você oferece apenas salário, vai perder seus melhores profissionais para quem oferece significado." — Helen Handfield-Jones
</div>

<h2>Imperativo 3: Reconstruir a Estratégia de Recrutamento</h2>
<p>O recrutamento tradicional — esperar a vaga abrir, publicar anúncio e filtrar currículos — é completamente inadequado para a guerra pelo talento. As empresas vencedoras praticam o que os autores chamam de <strong>"recrutamento perpétuo"</strong>: estão sempre buscando talentos, mesmo quando não há vagas abertas.</p>
<p>Além disso, as melhores empresas vão além dos canais tradicionais, usando suas redes de funcionários, buscando talentos em setores não convencionais, e fazendo do recrutamento <strong>responsabilidade de toda a liderança</strong>, não apenas do departamento de RH. Cada gestor é um recrutador.</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Recrutamento perpétuo:</strong> As melhores empresas não esperam vagas abrirem. Estão constantemente mapeando e atraindo talentos, construindo relacionamentos antes que a necessidade surja.</div>
</div>

<h2>Imperativo 4: Integrar o Desenvolvimento na Rotina</h2>
<p>O desenvolvimento de talentos nas empresas vencedoras não acontece em salas de treinamento — acontece <strong>no trabalho real, todos os dias</strong>. Os autores identificaram que as experiências mais transformadoras na carreira dos executivos são desafios reais: assumir um negócio em crise, liderar uma expansão internacional, ou gerenciar um projeto complexo e ambíguo.</p>
<p>As empresas que vencem na guerra pelo talento deliberadamente colocam seus melhores profissionais em <strong>posições desafiadoras que aceleram seu crescimento</strong>. Elas não protegem talentos — os desafiam. A filosofia é que o crescimento real vem de esticar as pessoas além de sua zona de conforto, com suporte adequado para evitar o fracasso.</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Desenvolvimento pelo desafio:</strong> As experiências mais transformadoras não são treinamentos formais, mas desafios reais no trabalho. Colocar pessoas talentosas em posições que as esticam é a forma mais eficaz de desenvolvê-las.</div>
</div>

<h2>Imperativo 5: Diferenciar e Afirmar Seus Profissionais</h2>
<p>O quinto imperativo é talvez o mais controverso: <strong>diferenciar radicalmente</strong> entre funcionários de alto desempenho (A players), desempenho médio (B players) e baixo desempenho (C players) — e tratar cada grupo de forma muito diferente.</p>
<p>Os A players devem receber as melhores oportunidades, a maior remuneração e o mais intenso desenvolvimento. Os B players devem ser valorizados e desenvolvidos para alcançar seu potencial. E os C players devem ser <strong>movidos para posições mais adequadas ou gentilmente retirados da organização</strong>. As empresas que tratam todos igualmente acabam perdendo seus melhores talentos e retendo os medíocres.</p>

<div class="highlight-box">
  "Tratar todos os funcionários igualmente parece justo, mas é na verdade profundamente injusto com seus melhores profissionais. Se os melhores não se sentem reconhecidos e diferenciados, eles vão embora — e os medíocres ficam." — Beth Axelrod
</div>

<h2>A Diferença nos Resultados</h2>
<p>A pesquisa da McKinsey demonstrou que as empresas que dominam os cinco imperativos apresentam <strong>resultados financeiros significativamente superiores</strong>. A correlação entre excelência em gestão de talentos e performance financeira é forte e consistente em todos os setores estudados.</p>
<p>A mensagem final é que a guerra pelo talento não é uma moda passageira — é uma <strong>realidade estrutural</strong> da economia do conhecimento. À medida que o trabalho se torna mais baseado em conhecimento e criatividade, a diferença de valor entre um profissional excelente e um mediano cresce exponencialmente. As empresas que não tratam talento como prioridade estratégica estão condenadas à mediocridade.</p>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>A diferença cresce exponencialmente:</strong> Na economia do conhecimento, um profissional excelente não é 10% melhor que um mediano — pode ser 10x mais produtivo. A guerra pelo talento não é moda, é realidade estrutural permanente.</div>
</div>`,

  mindmap_json: {
    center_label: 'A GUERRA PELO TALENTO',
    center_sublabel: '5 Imperativos para Vencer',
    branches: [
      {
        title: 'Mentalidade de Talento',
        icon: '🧠',
        items: [
          'Líderes dedicam 30-50% do tempo a talentos',
          'Responsabilidade do líder, não do RH',
          'Crença: talento superior = resultados superiores',
          'Permeia toda a organização',
        ],
      },
      {
        title: 'Proposta de Valor (EVP)',
        icon: '💎',
        items: [
          'Crescimento, propósito e liderança inspiradora',
          'Personalizada para diferentes perfis',
          'Vai muito além de salário e benefícios',
          'Marca empregadora como diferencial',
        ],
      },
      {
        title: 'Recrutamento Perpétuo',
        icon: '🎯',
        items: [
          'Buscar talentos mesmo sem vagas abertas',
          'Cada gestor é um recrutador',
          'Redes de funcionários como canal principal',
          'Buscar em setores não convencionais',
        ],
      },
      {
        title: 'Desenvolvimento pelo Desafio',
        icon: '🚀',
        items: [
          'Crescimento no trabalho real, não em sala de aula',
          'Posições desafiadoras aceleram crescimento',
          'Esticar além da zona de conforto',
          'Suporte adequado para evitar fracasso',
        ],
      },
      {
        title: 'Diferenciação Radical',
        icon: '⚖️',
        items: [
          'A/B/C players tratados diferentemente',
          'Melhores recebem melhores oportunidades',
          'Tratar todos igual perde os melhores',
          'C players movidos ou gentilmente retirados',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Nas empresas de alto desempenho, líderes dedicam 30 a 50% do seu tempo a questões de talento. Nas medianas, menos de 10%. Essa diferença de investimento de tempo explica boa parte da diferença de resultados.',
      source_chapter: 'Imperativo 1 — Mentalidade de Talento',
    },
    {
      text: 'Pessoas talentosas não ficam em empregos ruins só por dinheiro. Ficam por crescimento, propósito e liderança inspiradora. Se você oferece apenas salário, vai perder seus melhores profissionais para quem oferece significado.',
      source_chapter: 'Imperativo 2 — Proposta de Valor',
    },
    {
      text: 'O recrutamento tradicional — esperar a vaga abrir e publicar anúncio — é completamente inadequado. As empresas vencedoras praticam recrutamento perpétuo, construindo relacionamentos com talentos antes que a necessidade surja.',
      source_chapter: 'Imperativo 3 — Recrutamento',
    },
    {
      text: 'As experiências mais transformadoras na carreira dos executivos não são treinamentos formais, mas desafios reais: assumir um negócio em crise, liderar uma expansão, gerenciar um projeto ambíguo. O crescimento real vem de sair da zona de conforto.',
      source_chapter: 'Imperativo 4 — Desenvolvimento',
    },
    {
      text: 'Tratar todos os funcionários igualmente parece justo, mas é profundamente injusto com seus melhores profissionais. Se os melhores não se sentem reconhecidos e diferenciados, eles vão embora — e os medíocres ficam.',
      source_chapter: 'Imperativo 5 — Diferenciação',
    },
    {
      text: 'Na economia do conhecimento, um profissional excelente não é 10% melhor que um mediano — pode ser 10x mais produtivo. A diferença de valor cresce exponencialmente, tornando a guerra pelo talento uma realidade estrutural permanente.',
      source_chapter: 'A Diferença nos Resultados',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Audite Sua Mentalidade de Talento',
      icon: '🧠',
      color_theme: 'accent',
      description: 'Avalie quanto tempo e energia você realmente dedica a atrair, desenvolver e reter talentos, comparando com o padrão das empresas de alto desempenho.',
      checklist: [
        'Calculei que porcentagem do meu tempo dedico a questões de talento',
        'Identifiquei 3 pessoas-chave que preciso reter e não estou investindo o suficiente',
        'Defini uma ação concreta para aumentar meu tempo dedicado a talentos',
        'Assumi pessoalmente a responsabilidade por pelo menos uma contratação ativa',
      ],
    },
    {
      title: 'Exercício 2 — Construa Sua EVP',
      icon: '💎',
      color_theme: 'green',
      description: 'Crie sua Proposta de Valor para o Funcionário respondendo: por que uma pessoa talentosa escolheria trabalhar com você em vez de em qualquer outro lugar?',
      checklist: [
        'Listei 5 motivos pelos quais alguém talentoso deveria vir trabalhar comigo',
        'Perguntei a 3 funcionários por que ficam e o que os faria sair',
        'Identifiquei gaps entre minha EVP ideal e a realidade atual',
        'Criei um plano para fortalecer pelo menos 2 pontos da minha EVP',
      ],
    },
    {
      title: 'Exercício 3 — Mapeie Seus A/B/C Players',
      icon: '⚖️',
      color_theme: 'orange',
      description: 'Classifique honestamente sua equipe em A (excepcionais), B (sólidos) e C (abaixo do esperado), e defina ações diferenciadas para cada grupo.',
      checklist: [
        'Classifiquei cada membro da equipe como A, B ou C com critérios claros',
        'Defini ações de reconhecimento e desenvolvimento para os A players',
        'Criei um plano de crescimento para pelo menos 2 B players',
        'Tomei uma decisão sobre pelo menos um C player (mover ou desligar)',
        'Comuniquei expectativas claras a todos os membros da equipe',
      ],
    },
  ],
}

// ============================================================
// Book 5: The Winner Within
// ============================================================

const book5: BookData = {
  slug: 'o-vencedor-interior',
  metadata: {
    title: 'O Vencedor Interior',
    original_title: 'The Winner Within: A Life Plan for Team Players',
    author: 'Pat Riley',
    year: 1993,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1a0a0a',
    cover_gradient_to: '#2e1a1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Pat Riley, lendário técnico do Los Angeles Lakers e do New York Knicks, apresenta um framework completo sobre a <strong>dinâmica de equipes vencedoras</strong>, baseado em décadas de experiência no topo do basquete profissional. Sua tese central é que toda equipe — seja esportiva, empresarial ou pessoal — passa por um <strong>ciclo previsível de ascensão, triunfo, complacência e declínio</strong>, e que apenas a liderança excepcional pode quebrar esse ciclo.</p>
<p>Riley cunhou o termo <strong>"a doença do eu"</strong> (the disease of me) para descrever a força destrutiva que corrói equipes por dentro: quando membros individuais começam a priorizar seus próprios interesses acima do time. A cura para essa doença é <strong>"o pacto"</strong> — um compromisso coletivo que transforma um grupo de indivíduos talentosos em uma verdadeira equipe.</p>

<div class="highlight-box">
  "Ser parte de algo maior que você mesmo é a experiência mais poderosa na vida. Mas para conseguir isso, cada membro do time deve ter coragem para subordinar seus interesses pessoais ao bem do grupo. Isso é o que separa times campeões de grupos talentosos que nunca vencem nada." — Pat Riley
</div>

<h2>A Escalada Inocente: O Começo de Tudo</h2>
<p>Todo time começa com o que Riley chama de <strong>"escalada inocente"</strong> — um período de entusiasmo, energia e unidade natural. Quando um grupo se forma pela primeira vez, todos estão motivados, dispostos a sacrificar e focados no objetivo comum. Não há egos inflados, não há disputas políticas, não há complacência.</p>
<p>Essa fase é marcada por uma <strong>fome genuína</strong> de vencer e provar algo. Os papéis são aceitos sem reclamação, o esforço é máximo, e a química é natural. Riley compara isso ao time do Lakers de 1979-80, quando Magic Johnson chegou e todos jogaram com abandono e alegria — culminando no campeonato.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>A escalada inocente:</strong> Todo time começa com energia pura e unidade natural. A fome de vencer é genuína. O desafio não é começar forte — é sustentar essa energia quando o sucesso chegar.</div>
</div>

<h2>A Doença do Eu: O Inimigo Interno</h2>
<p>Após o primeiro grande sucesso, surge inevitavelmente <strong>"a doença do eu"</strong> — a mais destrutiva de todas as forças que ameaçam equipes. Quando o sucesso chega, membros do time começam a questionar: "Estou recebendo minha parte justa do crédito? Do dinheiro? Da atenção?" O foco muda do "nós" para o "eu".</p>
<p>Riley identifica os sintomas clássicos: jogadores reclamam do tempo de jogo, executivos disputam crédito por resultados, colaboradores sabotam colegas para parecerem melhores. A doença do eu não é causada por maldade — é uma <strong>reação humana natural ao sucesso</strong> que precisa ser conscientemente combatida.</p>

<div class="highlight-box">
  "O sucesso é um narcótico traiçoeiro. Ele sussurra para cada pessoa no time: 'Você é responsável por isso. Você merece mais.' Quando todos começam a ouvir essa voz, o time morre — não de uma vez, mas de uma série de pequenas traições ao compromisso coletivo." — Pat Riley
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Sintomas da doença do eu:</strong> Disputas por crédito, reclamações sobre reconhecimento, sabotagem sutil de colegas, foco em estatísticas individuais. O sucesso cria a ilusão de que a contribuição individual é mais importante que o time.</div>
</div>

<h2>O Pacto: A Cura Definitiva</h2>
<p>A resposta de Riley para a doença do eu é <strong>"o pacto"</strong> — um compromisso explícito e voluntário de cada membro do time de colocar os objetivos do grupo acima dos interesses pessoais. O pacto não é um documento formal; é uma <strong>decisão de caráter</strong> que cada pessoa deve renovar constantemente.</p>
<p>O pacto funciona porque transforma a motivação individual em motivação coletiva. Quando cada pessoa sabe que todos os outros estão igualmente comprometidos com o bem do grupo, <strong>a confiança se multiplica</strong> e o desempenho coletivo ultrapassa a soma dos talentos individuais. Riley chama isso de "o time como multiplicador".</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>O pacto como multiplicador:</strong> Quando cada membro confia que todos estão comprometidos com o grupo, o desempenho coletivo ultrapassa a soma dos talentos individuais. A confiança mútua é o multiplicador mais poderoso do desempenho.</div>
</div>

<h2>A Regra do Núcleo Vital</h2>
<p>Riley introduz o conceito do <strong>"núcleo vital"</strong> — a ideia de que em qualquer time, há um pequeno grupo de pessoas que faz a diferença desproporcional. O líder deve identificar esse núcleo e construir a cultura do time ao redor dele. Não são necessariamente os mais talentosos — são os que <strong>mais incorporam o pacto</strong>.</p>
<p>O núcleo vital estabelece o padrão de comportamento, atitude e esforço que todos os outros seguem. Quando o núcleo vital é forte e comprometido, ele puxa todo o time para cima. Quando o núcleo vital é contaminado pela doença do eu, <strong>todo o time desmorona</strong>.</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>O núcleo vital:</strong> Em todo time, um pequeno grupo define a cultura. Não são os mais talentosos, mas os mais comprometidos com o pacto. Proteger e fortalecer esse núcleo é a prioridade número um do líder.</div>
</div>

<h2>Complacência e Reinvenção</h2>
<p>Riley alerta que mesmo times que superam a doença do eu enfrentam outro inimigo: <strong>a complacência</strong>. Após vitórias consecutivas, é natural relaxar — e é exatamente quando os concorrentes mais famintos passam à frente. A complacência é o sucesso se tornando veneno lento.</p>
<p>A solução é a <strong>reinvenção contínua</strong>. Os melhores times e líderes não descansam sobre seus louros — eles constantemente elevam o padrão, redefinem objetivos e encontram novas motivações. Riley chamava isso de "a próxima montanha" — sempre ter um novo desafio para subir, mesmo após conquistar o pico anterior.</p>

<h2>A Dinastia: O Nível Máximo</h2>
<p>O objetivo final de Riley é construir uma <strong>dinastia</strong> — uma equipe que não apenas vence uma vez, mas vence repetidamente ao longo do tempo. A dinastia é rara porque exige que o time supere a doença do eu, renove o pacto constantemente, evite a complacência e se reinvente a cada temporada.</p>
<p>O Lakers da década de 1980, sob a liderança de Riley, é um exemplo: múltiplos campeonatos, mas cada um conquistado de maneira diferente, com diferentes jogadores assumindo papéis protagonistas em diferentes momentos. A dinastia não é repetição — é <strong>evolução constante com valores permanentes</strong>.</p>

<div class="highlight-box">
  "A excelência é um verbo, não um substantivo. Não é algo que você é — é algo que você faz, todos os dias, contra toda tentação de se acomodar. O momento em que você se senta para admirar o que conquistou é o momento em que começa a perder." — Pat Riley
</div>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Dinastia = evolução com valores:</strong> Vencer uma vez é talento. Vencer repetidamente exige caráter — superar a doença do eu, renovar o pacto, evitar a complacência e se reinventar a cada ciclo sem abandonar os valores fundamentais.</div>
</div>`,

  mindmap_json: {
    center_label: 'O VENCEDOR INTERIOR',
    center_sublabel: 'Construindo Equipes Campeãs',
    branches: [
      {
        title: 'Escalada Inocente',
        icon: '🏔️',
        items: [
          'Energia pura e unidade natural',
          'Fome genuína de vencer',
          'Papéis aceitos sem reclamação',
          'Química espontânea do time',
        ],
      },
      {
        title: 'A Doença do Eu',
        icon: '🦠',
        items: [
          'Sucesso muda foco de "nós" para "eu"',
          'Disputas por crédito e reconhecimento',
          'Sabotagem sutil entre membros',
          'Reação humana natural ao sucesso',
        ],
      },
      {
        title: 'O Pacto',
        icon: '🤝',
        items: [
          'Compromisso coletivo acima do individual',
          'Decisão de caráter renovada constantemente',
          'Confiança como multiplicador de desempenho',
          'Time supera soma dos talentos individuais',
        ],
      },
      {
        title: 'Núcleo Vital',
        icon: '💪',
        items: [
          'Pequeno grupo define a cultura do time',
          'Os mais comprometidos, não os mais talentosos',
          'Estabelecem padrão de comportamento',
          'Proteger o núcleo é prioridade do líder',
        ],
      },
      {
        title: 'Complacência & Reinvenção',
        icon: '🔄',
        items: [
          'Sucesso se torna veneno lento',
          'A próxima montanha como motivação',
          'Elevar o padrão constantemente',
          'Redefinir objetivos após cada conquista',
        ],
      },
      {
        title: 'Dinastia',
        icon: '🏆',
        items: [
          'Vencer repetidamente ao longo do tempo',
          'Evolução constante com valores permanentes',
          'Diferentes protagonistas a cada ciclo',
          'Excelência é verbo, não substantivo',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'O sucesso é um narcótico traiçoeiro. Ele sussurra para cada pessoa: "Você é responsável por isso. Você merece mais." Quando todos começam a ouvir essa voz, o time morre — não de uma vez, mas de pequenas traições ao compromisso coletivo.',
      source_chapter: 'A Doença do Eu',
    },
    {
      text: 'O pacto não é um documento formal — é uma decisão de caráter que cada membro deve renovar constantemente. Quando todos confiam que todos estão comprometidos, o desempenho coletivo ultrapassa a soma dos talentos individuais.',
      source_chapter: 'O Pacto',
    },
    {
      text: 'Em todo time, um pequeno grupo — o núcleo vital — define a cultura. Não são os mais talentosos, mas os mais comprometidos com o bem coletivo. Proteger esse núcleo é a prioridade número um do líder.',
      source_chapter: 'O Núcleo Vital',
    },
    {
      text: 'A excelência é um verbo, não um substantivo. Não é algo que você é — é algo que você faz, todos os dias, contra toda tentação de se acomodar. O momento em que você se senta para admirar o que conquistou é o momento em que começa a perder.',
      source_chapter: 'Complacência e Reinvenção',
    },
    {
      text: 'Todo time começa com energia pura — a escalada inocente. O desafio não é começar forte, é sustentar essa energia quando o sucesso chegar. A fome genuína de vencer é o recurso mais perecível de uma equipe.',
      source_chapter: 'A Escalada Inocente',
    },
    {
      text: 'Dinastia não é repetição — é evolução constante com valores permanentes. O Lakers venceu múltiplos campeonatos de maneiras diferentes, com diferentes protagonistas. A capacidade de se reinventar sem perder a essência é o que separa campeões de dinastias.',
      source_chapter: 'A Dinastia',
    },
    {
      text: 'Ser parte de algo maior que você mesmo é a experiência mais poderosa na vida. Mas para conseguir isso, cada membro deve ter coragem para subordinar seus interesses ao bem do grupo. Isso é o que separa times campeões de grupos talentosos que nunca vencem nada.',
      source_chapter: 'O Vencedor Interior',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Diagnóstico da Doença do Eu',
      icon: '🔍',
      color_theme: 'accent',
      description: 'Avalie honestamente se sua equipe está apresentando sintomas da "doença do eu" que Pat Riley identificou como o destruidor número um de times.',
      checklist: [
        'Identifiquei se há disputas por crédito na minha equipe',
        'Avaliei se membros priorizam visibilidade pessoal sobre resultados do time',
        'Verifiquei se o sucesso recente gerou complacência ou arrogância',
        'Conversei com pelo menos 2 membros do time sobre o clima da equipe',
      ],
    },
    {
      title: 'Exercício 2 — Construa Seu Pacto de Equipe',
      icon: '🤝',
      color_theme: 'green',
      description: 'Crie um pacto explícito com sua equipe, definindo os compromissos que cada membro assume para colocar o grupo acima dos interesses individuais.',
      checklist: [
        'Defini os 3-5 valores inegociáveis do nosso time',
        'Cada membro articulou seu compromisso pessoal com o grupo',
        'Identifiquei quem forma o núcleo vital da equipe',
        'Estabeleci um ritual para renovar o pacto regularmente',
      ],
    },
    {
      title: 'Exercício 3 — Planeje Sua Próxima Montanha',
      icon: '🏔️',
      color_theme: 'orange',
      description: 'Evite a complacência definindo "a próxima montanha" — um novo desafio ambicioso que mantenha a fome e a energia do time vivas.',
      checklist: [
        'Identifiquei o maior risco de complacência na minha equipe hoje',
        'Defini uma nova meta ambiciosa que energize todo o time',
        'Comuniquei a próxima montanha de forma inspiradora para a equipe',
        'Criei um mecanismo para medir se a energia do time está diminuindo',
      ],
    },
  ],
}

// ============================================================
// Insert function and main
// ============================================================

async function insertBook(book: BookData, sortOrder: number) {
  console.log(`\n📚 Processing: ${book.metadata.title} (${book.slug})`)

  // Check duplicate
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
  console.log('  RESUMOX — Inserting 5 New Books (Batch 5)')
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
