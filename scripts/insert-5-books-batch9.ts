#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content
 * Books: The Intelligent Investor, Made To Stick, The Speed of Trust,
 *        The Innovator's Solution, How To Think Like Leonardo da Vinci
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
// Book 1: O Investidor Inteligente
// ============================================================

const book1: BookData = {
  slug: 'o-investidor-inteligente',
  metadata: {
    title: 'O Investidor Inteligente',
    original_title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    year: 1949,
    category_slug: 'mentalidade-riqueza',
    category_label: 'Mentalidade & Riqueza',
    category_emoji: '💰',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Benjamin Graham é amplamente reconhecido como o <strong>pai do investimento em valor</strong>. Nascido em Londres em 1894, migrou para os Estados Unidos ainda jovem, formou-se na Universidade de Columbia e construiu uma carreira brilhante em Wall Street. Após perder toda sua fortuna no crash de 1929, Graham dedicou-se a desenvolver princípios sólidos de investimento que protegessem investidores de catástrofes semelhantes.</p>
<p>O conceito central de "O Investidor Inteligente" é que investir deve ser tratado como um <strong>negócio</strong> — com a mesma seriedade, análise e disciplina que se aplicaria ao comprar uma empresa inteira. Graham apresenta seis princípios fundamentais que, quando seguidos com rigor, produzem resultados consistentes ao longo do tempo, independentemente das condições de mercado.</p>

<div class="highlight-box">
"O investimento bem-sucedido pode se tornar substancialmente uma questão de técnicas e critérios que são aprendíveis, em vez de ser o produto de poderes mentais únicos e incomunicáveis."
</div>

<h2>Princípio 1: Conheça o Negócio em que Está Investindo</h2>
<p>Antes de considerar investir em qualquer empresa, Graham insiste que você precisa entender <strong>o que ela vende, como opera e como gera dinheiro</strong>. Sem uma compreensão sólida do ambiente competitivo da empresa, seus desafios, oportunidades, forças e fraquezas, você simplesmente não sabe o suficiente para investir nela.</p>
<p>Investimentos sólidos se valorizam ao longo do tempo por causa de suas <strong>operações comerciais de longo prazo</strong>, não por entrarem na moda do mercado. A chave é avaliar com precisão as possibilidades futuras da empresa — e isso só é viável se você entender em detalhes o que a empresa faz.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Investidores defensivos:</strong> Querem conservar seu capital acima de tudo. Buscam investimentos de longo prazo que crescerão com esforço mínimo — títulos governamentais, ações diversificadas de grandes empresas e fundos de investimento.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Investidores agressivos:</strong> Dedicam mais tempo à gestão de investimentos. Analisam tudo sobre um negócio antes de investir — incluindo ações de crescimento, títulos corporativos em níveis de barganha e emissões conversíveis excepcionais.</div>
</div>

<h2>Princípio 2: Conheça Quem Administra o Negócio</h2>
<p>Como você não vai operar o negócio pessoalmente, precisa de gestores que o administrem de forma <strong>competente, eficiente e honesta</strong>. Nunca invista em nada sem antes examinar cuidadosamente as competências e a integridade da equipe de gestão.</p>
<p>Graham destaca duas perguntas essenciais que todo acionista deve responder: A gestão é razoavelmente eficiente? Os interesses do acionista médio estão recebendo o devido reconhecimento? Para avaliar isso, observe se a empresa performa tão bem quanto seus pares, se está ganhando ou perdendo participação de mercado e se suas margens de lucro são competitivas.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>A ilusão do conselho de administração:</strong> Há uma percepção de que o conselho garante boa gestão. Na prática, o conselho raramente é independente — são os executivos que escolhem os diretores, não o contrário. Acionistas inteligentes participam ativamente das assembleias.</div>
</div>

<h2>Princípio 3: Invista para Lucros ao Longo do Tempo</h2>
<p>Graham traça uma linha clara entre <strong>investidores</strong> e <strong>especuladores</strong>. Investidores compram ações de empresas que acreditam que gerarão riqueza ao longo do tempo por meio de suas operações comerciais. Especuladores compram ações na esperança de vendê-las a um preço mais alto — essencialmente tentando ganhar dinheiro de outros acionistas.</p>
<p>Ao tentar "cronometrar" o mercado, o especulador perde interesse na qualidade dos títulos e foca apenas em vencer o mercado. O problema? O investidor, junto com seus pares, <strong>constitui</strong> o mercado. Na prática, está tentando vencer a si mesmo.</p>

<div class="highlight-box">
"O dinheiro real em investimentos terá que ser feito — como tem sido no passado — não comprando e vendendo, mas possuindo e mantendo títulos, recebendo juros e dividendos, e se beneficiando de seu aumento de valor a longo prazo."
</div>

<h2>Princípio 4: Tenha Confiança em Seu Próprio Raciocínio</h2>
<p>Quando você fez sua lição de casa, <strong>aja com base nela</strong>. Não se preocupe com o que outros dizem sobre seu investimento — você nunca sabe se fizeram sua própria análise ou estão apenas repetindo o que ouviram. Enquanto seus dados e seu raciocínio forem sólidos, não importa se a multidão concorda ou discorda.</p>
<p>Graham alerta sobre as diversas fontes de "conselho" financeiro: consultores profissionais (que ao menos são conservadores), empresas de serviços financeiros (que raramente explicam sua metodologia), corretoras (que ganham com comissões, não com seu sucesso) e bancos de investimento (que são vendedores disfarçados). O investidor inteligente forma sua própria opinião.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Coragem como virtude suprema:</strong> "Se você formou uma conclusão a partir dos fatos e sabe que seu julgamento é sólido, aja — mesmo que outros hesitem ou discordem. Você não está certo nem errado porque a multidão discorda de você. Está certo porque seus dados e seu raciocínio estão certos."</div>
</div>

<h2>Princípio 5: Escolha Investimentos pelo Valor Fundamental</h2>
<p>O sentimento geral do mercado é movido mais por <strong>oscilações de humor</strong> do que por pensamento racional. Portanto, as flutuações de mercado devem ser vistas como indicadores de que algo pode estar errado — ou certo — com seu investimento. Se os preços caem drasticamente, pode ser uma ótima oportunidade de comprar mais.</p>
<p>Graham apresenta a famosa parábola do <strong>Sr. Mercado</strong>: imagine que você possui uma participação em um pequeno negócio e todo dia um dos sócios, o Sr. Mercado, lhe diz quanto acha que sua participação vale — e se oferece para comprar ou vender nesse preço. Os humores do Sr. Mercado variam drasticamente. O valor do seu negócio muda tanto assim de um dia para o outro? Obviamente não. É o Sr. Mercado que varia.</p>

<h3>Como Avaliar uma Empresa</h3>
<p>Para ações ordinárias, Graham define: <strong>Valor = Lucros médios × Taxa de capitalização</strong>. Os lucros médios são projetados anos no futuro com base no histórico da empresa e fatores econômicos conhecidos. A taxa de capitalização reflete a "qualidade" da empresa em comparação aos seus pares. O investidor deve fazer seu próprio cálculo sistemático e minucioso antes de comparar o preço de mercado com o valor intrínseco.</p>

<h2>Princípio 6: Sempre Invista com Margem de Segurança</h2>
<p>Este é o princípio que <strong>permeia toda a filosofia de investimento</strong> de Graham. A margem de segurança é construída em torno do preço no qual você pode comprar uma ação com risco mínimo de queda. Frequentemente, isso estará abaixo do valor intrínseco da empresa, porque você precisa considerar o impacto de eventos externos imprevistos.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Calcule o valor intrínseco:</strong> Use uma metodologia consistente que permita comparações entre diferentes empresas.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Projete o poder de ganho:</strong> Estime os lucros esperados nos próximos 10 anos, considerando que parte será reinvestida.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Compare com títulos de renda fixa:</strong> Tudo que estiver acima da taxa de títulos é sua margem de segurança.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Diversifique em 20+ ações:</strong> Aumente a probabilidade de resultado favorável ao distribuir o risco.</div>
</div>

<div class="highlight-box">
"Na velha lenda, os sábios destilaram a história dos assuntos mortais em uma única frase: 'Isso também passará.' Confrontados com um desafio semelhante para destilar o segredo do investimento sólido em três palavras, arriscamos o lema: MARGEM DE SEGURANÇA."
</div>

<h2>Conclusão</h2>
<p>Benjamin Graham nos ensina que investir com inteligência não requer genialidade — requer <strong>disciplina, paciência e princípios sólidos</strong>. Conheça profundamente o negócio e quem o administra. Invista para o longo prazo, não para especulação. Confie em sua própria análise fundamentada. Escolha investimentos pelo valor intrínseco, ignorando a histeria do mercado. E acima de tudo, construa sempre uma margem de segurança generosa. Esses princípios, estabelecidos em 1949, permanecem tão válidos hoje quanto foram há mais de sete décadas — porque, como Graham bem observou, a natureza humana permanece essencialmente a mesma.</p>`,
  mindmap_json: {
    center_label: 'O INVESTIDOR INTELIGENTE',
    center_sublabel: '6 Princípios do Investimento em Valor',
    branches: [
      {
        title: 'Conheça o Negócio',
        icon: '🔍',
        items: [
          'Entenda como a empresa lucra',
          'Avalie o ambiente competitivo',
          'Defensivo vs. Agressivo',
          'Pense como dono, não trader',
        ],
      },
      {
        title: 'Gestão e Governança',
        icon: '👔',
        items: [
          'Gestão competente e honesta',
          'Interesses do acionista respeitados',
          'Participe das assembleias',
          'Compare com pares do setor',
        ],
      },
      {
        title: 'Longo Prazo',
        icon: '⏳',
        items: [
          'Investir ≠ especular',
          'Lucros via operações, não trades',
          'Paciência é vantagem competitiva',
          'Ignore flutuações de curto prazo',
        ],
      },
      {
        title: 'Raciocínio Próprio',
        icon: '🧠',
        items: [
          'Faça sua própria análise',
          'Desconfie de dicas quentes',
          'Coragem após pesquisa sólida',
          'Não siga a multidão cegamente',
        ],
      },
      {
        title: 'Valor Fundamental',
        icon: '💎',
        items: [
          'Parábola do Sr. Mercado',
          'Humor do mercado ≠ valor real',
          'Compre barato, venda caro',
          'Calcule o valor intrínseco',
        ],
      },
      {
        title: 'Margem de Segurança',
        icon: '🛡️',
        items: [
          'Compre abaixo do valor intrínseco',
          'Diversifique em 20+ ações',
          'Proteja-se de eventos imprevistos',
          'O princípio mais importante',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'O investimento bem-sucedido é substancialmente uma questão de técnicas e critérios que são aprendíveis. Princípios sólidos produziram resultados geralmente sólidos através de todas as vicissitudes e calamidades da história.',
      source_chapter: 'Introdução — A Ideia Central',
    },
    {
      text: 'O verdadeiro investidor pode tirar proveito do preço diário do mercado ou ignorá-lo. Flutuações de preço têm apenas um significado para ele: oferecem a oportunidade de comprar sabiamente quando os preços caem e vender sabiamente quando avançam muito.',
      source_chapter: 'Princípio 5 — Valor Fundamental vs. Popularidade',
    },
    {
      text: 'Boas gestões raramente são excessivamente remuneradas. Gestões ruins são sempre excessivamente remuneradas, porque valem menos que nada para os proprietários.',
      source_chapter: 'Princípio 2 — Conheça Quem Administra',
    },
    {
      text: 'Se você formou uma conclusão a partir dos fatos e sabe que seu julgamento é sólido, aja — mesmo que outros hesitem ou discordem. Você não está certo nem errado porque a multidão discorda. Está certo porque seus dados e seu raciocínio estão certos.',
      source_chapter: 'Princípio 4 — Confiança no Próprio Raciocínio',
    },
    {
      text: 'Na velha lenda, os sábios destilaram a história dos assuntos mortais em uma única frase: "Isso também passará." Para destilar o segredo do investimento sólido em três palavras: MARGEM DE SEGURANÇA.',
      source_chapter: 'Princípio 6 — Margem de Segurança',
    },
    {
      text: 'O investidor genuíno em ações ordinárias não precisa de grande equipamento de cérebros e conhecimento, mas precisa de algumas qualidades incomuns de caráter.',
      source_chapter: 'Princípio 1 — Conheça o Negócio',
    },
    {
      text: 'Investidores como um todo não são e não podem ser negociantes de títulos. São donos das maiores empresas do país. Ganham dinheiro não uns dos outros, mas dessas empresas. Suas energias devem ser dirigidas a assegurar os melhores resultados operacionais.',
      source_chapter: 'Princípio 3 — Invista para Lucros ao Longo do Tempo',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Análise do Sr. Mercado',
      icon: '📊',
      color_theme: 'accent',
      description:
        'Aplique a parábola do Sr. Mercado aos seus investimentos atuais. Separe o valor real das oscilações emocionais do mercado.',
      template_text:
        'Investimento: [AÇÃO/FUNDO]. Valor intrínseco estimado: [VALOR]. Preço atual: [PREÇO]. O Sr. Mercado está: [otimista/pessimista/justo]. Minha ação: [comprar mais/manter/vender].',
      checklist: [
        'Listei todos os meus investimentos atuais',
        'Estimei o valor intrínseco de pelo menos 3 investimentos',
        'Comparei o preço de mercado com minha estimativa de valor',
        'Identifiquei uma oportunidade onde o Sr. Mercado está pessimista demais',
      ],
    },
    {
      title: 'Exercício 2 — Construa Sua Margem de Segurança',
      icon: '🛡️',
      color_theme: 'green',
      description:
        'Revise seu portfólio atual e verifique se cada investimento tem uma margem de segurança adequada. Diversifique se necessário.',
      checklist: [
        'Verifiquei se tenho pelo menos 10-20 investimentos diferentes',
        'Calculei a margem de segurança de cada posição principal',
        'Identifiquei investimentos sem margem adequada',
        'Rebalanceei o portfólio eliminando posições arriscadas',
      ],
    },
    {
      title: 'Exercício 3 — Desafio do Investidor Independente',
      icon: '🎯',
      color_theme: 'orange',
      description:
        'Durante 30 dias, tome decisões de investimento baseadas exclusivamente em sua própria análise, sem seguir dicas de terceiros ou tendências do momento.',
      checklist: [
        'Escolhi uma empresa e pesquisei seus fundamentos por conta própria',
        'Ignorei deliberadamente as "dicas quentes" que recebi',
        'Documentei meu raciocínio por escrito antes de investir',
        'Avaliei se o resultado foi melhor que seguir a multidão',
        'Registrei as lições aprendidas no meu caderno de investimentos',
      ],
    },
  ],
}

// ============================================================
// Book 2: Ideias que Colam
// ============================================================

const book2: BookData = {
  slug: 'ideias-que-colam',
  metadata: {
    title: 'Ideias que Colam',
    original_title: 'Made To Stick',
    author: 'Chip Heath e Dan Heath',
    year: 2007,
    category_slug: 'comunicacao',
    category_label: 'Comunicação',
    category_emoji: '🗣',
    reading_time_min: 13,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Ideias "que colam" são aquelas altamente memoráveis e excepcionalmente duradouras em seu impacto. Todos no mundo dos negócios gostariam de desenvolver ideias assim — e a maioria dos pais também, quando tentam ensinar valores aos filhos. Mas o que exatamente faz uma ideia grudar?</p>
<p>Chip e Dan Heath, professores de Stanford e consultores de Duke, respectivamente, descobriram que não existe uma fórmula rígida, mas há um <strong>checklist de seis princípios</strong> que a maioria das ideias pegajosas bem-sucedidas tendem a usar. O acrônimo em inglês é <strong>SUCCESs</strong>: Simple, Unexpected, Concrete, Credible, Emotional, Story-based.</p>

<div class="highlight-box">
"Escrevemos este livro para ajudá-lo a fazer suas ideias colarem. Por 'colar', queremos dizer que suas ideias são compreendidas e lembradas, e têm um impacto duradouro — elas mudam as opiniões ou o comportamento do seu público."
</div>

<h2>Princípio 1: Simples</h2>
<p>O ideal é criar ideias que sejam ao mesmo tempo <strong>simples e profundas</strong>, como provérbios que existem em todas as culturas. Para chegar a algo profundo, você provavelmente precisará abrir mão de todos os pontos de apoio que poderia mencionar e encontrar uma forma simples de expressar <strong>um único ponto principal</strong>.</p>
<p>Simplificar não significa "emburrecer" ou transformar em um "sound bite" vazio. Significa chegar ao <strong>núcleo essencial</strong> da ideia, eliminando todos os elementos supérfluos que confundem em vez de amplificar.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>A campanha de Clinton:</strong> Em 1992, James Carville criou o slogan "É a economia, estúpido" — que se tornou o tema central da campanha, mesmo que Clinton quisesse falar sobre muitas outras coisas. Seus conselheiros sempre o traziam de volta a essa única ideia.</div>
</div>

<p>A Southwest Airlines foca em um único objetivo: ser A companhia aérea de menor tarifa. Herb Kelleher dizia: <strong>"Posso te ensinar o segredo de administrar esta companhia em trinta segundos."</strong> Se uma ideia ajuda a cortar custos, é bem-vinda. Se não, ninguém terá tempo para ouvi-la.</p>

<h2>Princípio 2: Inesperado</h2>
<p>Para fazer as pessoas prestarem atenção, você precisa <strong>violar suas expectativas</strong> e ser contraintuitivo. A surpresa funciona como gatilho inicial, mas não dura. Para uma ideia perdurar, ela precisa gerar <strong>interesse e curiosidade</strong> — abrir lacunas no conhecimento das pessoas e então preenchê-las.</p>
<p>A curiosidade é um motivador poderoso. As pessoas assistem a filmes ruins inteiros só para saber como termina. A curiosidade surge quando percebemos que há uma <strong>lacuna em nosso conhecimento</strong>. A chave para manter as pessoas imersas é alimentar essa curiosidade.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>O discurso de JFK:</strong> Em maio de 1961, Kennedy casualmente declarou o objetivo de "pousar um homem na lua antes do fim da década". Essa visão inesperada dirigiu o esforço sustentado de dezenas de milhares de pessoas por quase uma década.</div>
</div>

<h2>Princípio 3: Concreto</h2>
<p>O cérebro humano é muito mais apto a lembrar de <strong>imagens vívidas</strong> do que a interpretar mensagens abstratas. Ideias naturalmente pegajosas são cheias de imagens claras e brilhantes que as pessoas não esquecem. Ao traduzir tudo em imagens concretas, ambiguidade e abstrações ficam para trás.</p>
<p>Quando James Grant, diretor do UNICEF, visitava primeiros-ministros de países em desenvolvimento, levava um pacotinho com uma colher de chá de sal e oito de açúcar — os ingredientes básicos da terapia de reidratação oral. Ele dizia: <strong>"Sabe que isso custa menos que uma xícara de chá e pode salvar centenas de milhares de crianças no seu país?"</strong></p>

<h2>Princípio 4: Crível</h2>
<p>Ideias verdadeiramente pegajosas carregam suas <strong>próprias credenciais</strong>. Elas oferecem formas para as pessoas testarem por si mesmas se são verdadeiras. Às vezes, isso é feito melhor com uma pergunta retórica do que citando números.</p>
<p>Geoff Ainscow, do movimento Beyond Wars, usava uma demonstração com bolinhas de metal e um balde para ilustrar a proliferação nuclear. Uma bolinha para Hiroshima (clunk!). Dez para um submarino nuclear (barulho mais alto). Depois, 5.000 bolinhas para o arsenal mundial (um estrondo ensurdecedor seguido de <strong>silêncio absoluto</strong> na plateia).</p>

<h2>Princípio 5: Emocional</h2>
<p>Somos instintivamente programados para sentir coisas por <strong>outras pessoas</strong>, não por abstrações. É por isso que as pessoas doam mais para uma criança que conheceram do que para um país inteiro em dificuldade. Mensagens pegajosas se tornam pessoais — encontram formas de fazer os fatos ganharem vida através das emoções do ouvinte.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Associações positivas:</strong> Caridades não pedem para "doar à pobreza africana" — pedem para patrocinar uma criança específica. Isso personaliza a ideia e traz a ação para um nível realista.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Autointeresse:</strong> O WIIFY — "o que tem nisso para você?" — é central em toda publicidade eficaz. Foque nos benefícios específicos para a pessoa.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Auto-identidade:</strong> O Texas reduziu o lixo nas estradas em 72% com a campanha "Don't Mess with Texas", apelando à identidade texana em vez de dar sermões.</div>
</div>

<h2>Princípio 6: Baseado em Histórias</h2>
<p>Histórias são incrivelmente eficazes como ferramentas de ensino. Transmitem sabedoria de forma concisa, estabelecem relações causais que não são óbvias à primeira vista e fornecem contexto para ações futuras. As pessoas esquecem instruções, mas <strong>lembram de histórias por muito, muito tempo</strong>.</p>
<p>Histórias são poderosas porque contêm tanto <strong>estímulo</strong> (conhecimento sobre como agir) quanto <strong>inspiração</strong> (motivação para agir). Existem três enredos básicos: o <strong>desafio</strong> (David vs. Golias), a <strong>conexão</strong> (bom samaritano) e a <strong>criatividade</strong> (momento Eureka).</p>

<div class="highlight-box">
"Pessoas podem se distinguir criando ideias que fazem diferença. Você não precisa de poder, celebridade, firmas de relações públicas ou dólares de publicidade. Tudo que precisa é de uma grande ideia."
</div>

<h2>Juntando Tudo: A História de Jared e o Subway</h2>
<p>Jared Fogle, um estudante universitário de 193 quilos, criou sua própria "dieta Subway" e perdeu mais de 100 quilos. A história passou por todos os seis critérios: <strong>Simples</strong> (coma sanduíches e emagreça), <strong>Inesperado</strong> (perder peso com fast food?), <strong>Concreto</strong> (as calças gigantes), <strong>Crível</strong> (aconteceu de verdade), <strong>Emocional</strong> (transformação humana genuína) e <strong>Baseado em história</strong> (superação de obstáculos). O resultado? Aumento de 18% nas vendas do Subway em 2000.</p>

<h2>Conclusão</h2>
<p>Para fazer uma ideia colar, trabalhe os seis princípios: torne-a simples, inesperada, concreta, crível, emocional e conte-a como uma história. Não é preciso usar todos os seis em todas as situações, mas quanto mais princípios você ativar, mais pegajosa será sua mensagem. E às vezes, as melhores ideias pegajosas surgem espontaneamente — quando isso acontecer, não questione. <strong>Construa sobre o que funciona</strong>.</p>`,
  mindmap_json: {
    center_label: 'IDEIAS QUE COLAM',
    center_sublabel: '6 Princípios das Ideias Pegajosas',
    branches: [
      {
        title: 'Simples',
        icon: '🎯',
        items: [
          'Encontre o núcleo da ideia',
          'Elimine o supérfluo',
          'Use analogias e esquemas',
          'Formato pirâmide invertida',
        ],
      },
      {
        title: 'Inesperado',
        icon: '😲',
        items: [
          'Viole expectativas para atenção',
          'Abra lacunas de curiosidade',
          'Quebre padrões conhecidos',
          'Preencha as lacunas gradualmente',
        ],
      },
      {
        title: 'Concreto',
        icon: '🧱',
        items: [
          'Imagens vívidas e memoráveis',
          'Livre de jargões abstratos',
          'Ações tangíveis e visualizáveis',
          'Facilita compreensão de novatos',
        ],
      },
      {
        title: 'Crível',
        icon: '✅',
        items: [
          'Credenciais embutidas na ideia',
          'Detalhes verificáveis',
          'Estatísticas humanizadas',
          'Deixe o público testar sozinho',
        ],
      },
      {
        title: 'Emocional',
        icon: '❤️',
        items: [
          'Pessoalize a mensagem',
          'WIIFY: o que tem nisso pra mim?',
          'Apele à identidade do ouvinte',
          'Pessoas > abstrações',
        ],
      },
      {
        title: 'Baseado em Histórias',
        icon: '📖',
        items: [
          'Histórias ensinam e inspiram',
          'Enredo de desafio motiva ação',
          'Enredo de conexão une pessoas',
          'Enredo criativo provoca inovação',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Posso te ensinar o segredo de administrar esta companhia aérea em trinta segundos: somos A companhia de menor tarifa. Uma vez que você entenda isso, pode tomar qualquer decisão sobre o futuro desta empresa tão bem quanto eu.',
      source_chapter: 'Princípio 1 — Simples',
    },
    {
      text: 'Se as pessoas gostam de curiosidade, por que trabalham para resolvê-la? Por que não largam romances de mistério antes do último capítulo? A curiosidade surge quando percebemos que há uma lacuna em nosso conhecimento.',
      source_chapter: 'Princípio 2 — Inesperado',
    },
    {
      text: 'Dos seis traços da pegajosidade, a concretude é talvez o mais fácil de abraçar. A barreira é simples esquecimento — esquecemos que estamos voltando a falar de forma abstrata.',
      source_chapter: 'Princípio 3 — Concreto',
    },
    {
      text: 'Alguns detalhes vívidos podem ser mais persuasivos que uma barragem de estatísticas. Uma única história pode superar uma montanha de ceticismo. Um estudo de caso pode funcionar melhor que uma autoridade.',
      source_chapter: 'Princípio 4 — Crível',
    },
    {
      text: 'Se eu olhar para a massa, nunca agirei. Para fazer as pessoas se importarem, tire-lhes o chapéu analítico. Crie empatia por indivíduos específicos. Apele à identidade delas — não apenas a quem são agora, mas a quem gostariam de ser.',
      source_chapter: 'Princípio 5 — Emocional',
    },
    {
      text: 'Histórias têm o poder duplo incrível de estimular e inspirar. A parte mais difícil de usar histórias eficazmente é garantir que sejam simples — que reflitam sua mensagem central.',
      source_chapter: 'Princípio 6 — Baseado em Histórias',
    },
    {
      text: 'Pessoas podem se distinguir criando ideias que fazem diferença. Você não precisa de poder, celebridade ou dólares de publicidade. Tudo que precisa é de uma grande ideia — e com o insight certo, qualquer um de nós pode fazer uma ideia colar.',
      source_chapter: 'Conclusão',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Encontre o Núcleo da Sua Mensagem',
      icon: '🎯',
      color_theme: 'accent',
      description:
        'Escolha uma ideia ou projeto importante que você precisa comunicar. Aplique o princípio da simplicidade: elimine tudo que não é essencial até restar uma frase poderosa.',
      template_text:
        'Minha ideia completa: [PARÁGRAFO]. O núcleo essencial em uma frase: [FRASE]. Analogia que a torna memorável: [ANALOGIA].',
      checklist: [
        'Escrevi minha ideia completa em um parágrafo',
        'Eliminei todos os pontos secundários',
        'Resumi em uma única frase simples e profunda',
        'Testei a frase com alguém e verifiquei se entenderam imediatamente',
      ],
    },
    {
      title: 'Exercício 2 — Teste SUCCESs na Prática',
      icon: '📋',
      color_theme: 'green',
      description:
        'Escolha uma apresentação ou e-mail importante que precisa enviar esta semana e aplique pelo menos 4 dos 6 princípios SUCCESs.',
      checklist: [
        'Simplifiquei a mensagem ao máximo',
        'Adicionei um elemento inesperado ou surpreendente',
        'Incluí pelo menos uma imagem concreta ou exemplo vívido',
        'Adicionei uma história real que ilustra meu ponto',
        'Pedi feedback para verificar se a mensagem "colou"',
      ],
    },
    {
      title: 'Exercício 3 — Humanize Suas Estatísticas',
      icon: '🔢',
      color_theme: 'orange',
      description:
        'Pegue um dado numérico importante do seu trabalho e transforme-o em uma comparação concreta e emocional que qualquer pessoa entenderia.',
      checklist: [
        'Identifiquei uma estatística importante que uso no trabalho',
        'Criei uma analogia concreta (como o exemplo do time de futebol)',
        'Testei com alguém que não entende do assunto',
        'A pessoa reagiu emocionalmente ao ouvir a comparação',
      ],
    },
  ],
}

// ============================================================
// Book 3: A Velocidade da Confiança
// ============================================================

const book3: BookData = {
  slug: 'a-velocidade-da-confianca',
  metadata: {
    title: 'A Velocidade da Confiança',
    original_title: 'The Speed of Trust',
    author: 'Stephen M. Covey',
    year: 2006,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Confiança não é algo meramente "intangível" ou "bom de ter". É um <strong>ativo de negócios concreto</strong> que gera valor econômico quantificável. A fórmula de Stephen M. Covey é elegante em sua simplicidade: quando a confiança sobe, a velocidade de execução sobe e os custos caem. Quando a confiança desce, a velocidade cai e os custos sobem.</p>
<p>Covey — filho de Stephen R. Covey, autor de "Os 7 Hábitos das Pessoas Altamente Eficazes" — propõe um modelo mental de <strong>cinco ondas</strong>, como as ondulações criadas por uma gota caindo na água. A confiança sempre flui de dentro para fora: começa em você mesmo e se expande para relacionamentos, organizações, mercado e sociedade.</p>

<div class="highlight-box">
"A confiança nos impacta 24 horas por dia, 365 dias por ano. Contrário ao que a maioria acredita, confiança não é uma qualidade suave e ilusória que você tem ou não tem; é um ativo pragmático, tangível e acionável que você pode criar — muito mais rápido do que imagina."
</div>

<h2>Onda 1: Autoconfiança — Credibilidade</h2>
<p>Antes de construir confiança com outros, você precisa <strong>confiar em si mesmo</strong>. A autoconfiança é derivada de sua capacidade de definir e atingir metas e cumprir compromissos. Se você pratica o que prega, sente-se bem com suas ações — e essa consistência interior torna possível ser digno da confiança alheia.</p>
<p>A credibilidade é construída sobre <strong>4 Núcleos</strong>:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Integridade:</strong> Agir de acordo com seus valores pessoais em todas as circunstâncias. Inclui congruência (ser o mesmo por dentro e por fora), humildade (se importar mais com o que é certo do que com estar certo) e coragem (fazer o certo mesmo quando é difícil).</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Intenção:</strong> Seus motivos genuínos. A intenção que mais inspira confiança é quando você genuinamente se preocupa com o bem-estar dos outros e busca resultados ganha-ganha.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Capacidades:</strong> Seu conjunto único de talentos, habilidades, conhecimentos e aptidões (T-A-S-K-S: Talents, Attitudes, Skills, Knowledge, Style). Devem ser continuamente atualizados para permanecer relevantes.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Resultados:</strong> Seu histórico de realizações. Resultados dão credibilidade e classificam você como "produtor" em vez de "bom de conversa". Sem resultados tangíveis, não há confiança significativa.</div>
</div>

<h2>Onda 2: Confiança nos Relacionamentos — Comportamento Consistente</h2>
<p>Uma vez que confia em si mesmo, você aprende a interagir com outros de formas que <strong>aumentem em vez de destruam</strong> a confiança. O que você faz importa muito mais do que o que diz. Covey identifica 13 Comportamentos que líderes de alta confiança exibem consistentemente:</p>

<h3>Os 13 Comportamentos da Confiança</h3>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Fale direto:</strong> Seja honesto e franco. Diga a verdade e deixe as pessoas saberem onde você está, sem rodeios.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Demonstre respeito:</strong> Trate todos com dignidade — especialmente aqueles que nunca poderão fazer algo por você.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Seja transparente:</strong> Abra os livros. Mostre que não há agendas ocultas. Na dúvida, divulgue mais, não menos.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Corrija erros:</strong> Quando errar, reconheça, peça desculpas e faça restituição. A humildade de corrigir cria mais confiança do que nunca errar.</div>
</div>
<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Mostre lealdade:</strong> Dê crédito a quem merece. Fale dos outros como se estivessem presentes. Nunca divulgue informações confidenciais.</div>
</div>

<p>Os demais comportamentos completam o quadro: <strong>6) Entregue resultados</strong>, <strong>7) Melhore continuamente</strong>, <strong>8) Confronte a realidade</strong>, <strong>9) Esclareça expectativas</strong>, <strong>10) Assuma responsabilidade</strong>, <strong>11) Ouça primeiro</strong>, <strong>12) Cumpra compromissos</strong> e <strong>13) Estenda confiança</strong> — confie nos outros para inspirar confiança de volta.</p>

<div class="highlight-box">
"Leva vinte anos para construir sua reputação e cinco minutos para destruí-la."
— Warren Buffett
</div>

<h2>Onda 3: Confiança Organizacional — Alinhamento</h2>
<p>Quando você trabalha com pessoas em quem confia, <strong>mais coisas são feitas</strong>. A confiança organizacional vem do alinhamento — ter sistemas, estruturas e recompensas da organização alinhados com um objetivo consistente. Quando há desalinhamento, surgem "impostos" sobre o desempenho: burocracia, duplicação, politicagem, desengajamento e alta rotatividade.</p>
<p>Por outro lado, organizações de alta confiança colhem <strong>dividendos significativos</strong>: maior valor para acionistas, crescimento acelerado, inovação aprimorada, melhor colaboração e execução estratégica superior.</p>

<h2>Onda 4: Confiança de Mercado — Reputação</h2>
<p>Quando clientes, investidores e outros no mercado confiam em sua marca, eles <strong>compram mais, indicam mais e dão o benefício da dúvida</strong>. A reputação é construída aplicando os 4 Núcleos e os 13 Comportamentos no nível organizacional. Pergunte: nossa marca tem integridade? Demonstra boa intenção? Está associada à excelência? Entrega resultados?</p>

<h2>Onda 5: Confiança Social — Contribuição</h2>
<p>A confiança social aumenta quando você <strong>cria valor para os outros e para a sociedade</strong>. Quando você dá algo de volta, suspeita e cinismo são mitigados. Cada vez mais organizações veem fazer o bem como parte integral de seu modelo de negócios, reportando em "triplo resultado" — financeiro, social e ambiental.</p>

<h2>Conclusão</h2>
<p>Nada nos negócios é tão rápido ou tão lucrativo quanto a confiança. O primeiro trabalho de qualquer líder é <strong>inspirar confiança nos outros</strong>. Para isso, construa credibilidade (integridade + intenção + capacidades + resultados), pratique os 13 comportamentos consistentemente, alinhe os sistemas organizacionais e construa uma reputação sólida no mercado. A confiança não é algo que você tem ou não tem — é algo que você pode criar, restaurar e expandir deliberadamente.</p>`,
  mindmap_json: {
    center_label: 'A VELOCIDADE DA CONFIANÇA',
    center_sublabel: '5 Ondas e 13 Comportamentos',
    branches: [
      {
        title: 'Autoconfiança',
        icon: '🪞',
        items: [
          'Integridade: faça o que diz',
          'Intenção: sem agendas ocultas',
          'Capacidades: mantenha-se relevante',
          'Resultados: entregue consistentemente',
        ],
      },
      {
        title: 'Confiança Relacional',
        icon: '🤝',
        items: [
          'Fale direto e com respeito',
          'Seja transparente e leal',
          'Corrija erros rapidamente',
          'Cumpra cada compromisso',
        ],
      },
      {
        title: 'Confiança Organizacional',
        icon: '🏢',
        items: [
          'Alinhe sistemas e recompensas',
          'Elimine impostos da desconfiança',
          'Colha dividendos da alta confiança',
          'Crie ambiente seguro para crescer',
        ],
      },
      {
        title: 'Confiança de Mercado',
        icon: '📈',
        items: [
          'Reputação é ativo financeiro',
          'Clientes compram e indicam mais',
          'Marca com integridade e resultados',
          'Benefício da dúvida do mercado',
        ],
      },
      {
        title: 'Confiança Social',
        icon: '🌍',
        items: [
          'Contribua para a sociedade',
          'Triplo resultado: lucro + social + ambiental',
          'Inspire outros a contribuir',
          'Cidadania global começa em você',
        ],
      },
      {
        title: '13 Comportamentos-Chave',
        icon: '⚡',
        items: [
          'Ouça primeiro, fale direto',
          'Entregue resultados, melhore sempre',
          'Confronte realidade, assuma responsabilidade',
          'Estenda confiança a quem a merece',
        ],
        full_width: true,
      },
    ],
  },
  insights_json: [
    {
      text: 'Quando a confiança sobe, a velocidade sobe e os custos caem. Quando a confiança desce, a velocidade cai e os custos sobem. É simples assim, real assim, previsível assim.',
      source_chapter: 'Introdução — A Economia da Confiança',
    },
    {
      text: 'Procuro três coisas ao contratar pessoas. A primeira é integridade pessoal, a segunda é inteligência e a terceira é alto nível de energia. Mas se você não tem a primeira, as outras duas vão te destruir.',
      source_chapter: 'Onda 1 — Integridade',
    },
    {
      text: 'Leva vinte anos para construir sua reputação e cinco minutos para destruí-la. A confiança é estabelecida através da ação, não de palavras.',
      source_chapter: 'Onda 2 — Comportamento Consistente',
    },
    {
      text: 'A forma mais rápida de destruir confiança é dizer uma coisa e fazer outra. E inversamente, a forma mais poderosa de construir confiança é dizer o que vai fazer e então fazer exatamente isso.',
      source_chapter: 'Onda 2 — Comportamento 12: Cumpra Compromissos',
    },
    {
      text: 'Quase todo conflito é resultado de expectativas violadas. Discuta suas expectativas para que estejam claramente definidas. Duas pessoas podem discutir o mesmo resultado e sair com versões completamente diferentes.',
      source_chapter: 'Onda 2 — Comportamento 9: Esclareça Expectativas',
    },
    {
      text: 'Confie nos homens e eles serão verdadeiros com você; trate-os grandiosamente e eles se mostrarão grandes. Para ser confiável, você precisa aprender a confiar nos outros.',
      source_chapter: 'Onda 2 — Comportamento 13: Estenda Confiança',
    },
    {
      text: 'Desconfiança dobra o custo de fazer negócios. Sem a confiança do cliente, o resto não importa. Velocidade acontece quando as pessoas realmente confiam umas nas outras.',
      source_chapter: 'Onda 4 — Confiança de Mercado',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Auditoria dos 4 Núcleos',
      icon: '🔍',
      color_theme: 'accent',
      description:
        'Avalie honestamente sua credibilidade pessoal nos 4 Núcleos de Covey: Integridade, Intenção, Capacidades e Resultados. Identifique onde precisa fortalecer.',
      template_text:
        'Integridade (1-10): [NOTA]. Intenção (1-10): [NOTA]. Capacidades (1-10): [NOTA]. Resultados (1-10): [NOTA]. Meu núcleo mais fraco é: [NÚCLEO]. Ação para melhorá-lo: [AÇÃO].',
      checklist: [
        'Avaliei cada núcleo com uma nota honesta de 1 a 10',
        'Identifiquei meu núcleo mais fraco',
        'Pedi feedback a alguém de confiança sobre minha avaliação',
        'Defini uma ação concreta para fortalecer meu ponto mais fraco',
      ],
    },
    {
      title: 'Exercício 2 — Pratique 3 Comportamentos Esta Semana',
      icon: '🎯',
      color_theme: 'green',
      description:
        'Escolha 3 dos 13 Comportamentos que você menos pratica e comprometa-se a exercitá-los deliberadamente durante 7 dias.',
      checklist: [
        'Escolhi 3 comportamentos para praticar (ex: falar direto, ouvir primeiro, ser transparente)',
        'Pratiquei pelo menos um comportamento por dia',
        'Registrei situações específicas onde apliquei cada comportamento',
        'Observei como as pessoas reagiram diferente',
        'Avaliei se a confiança nos meus relacionamentos melhorou',
      ],
    },
    {
      title: 'Exercício 3 — Restaure uma Confiança Perdida',
      icon: '🔄',
      color_theme: 'orange',
      description:
        'Identifique um relacionamento profissional ou pessoal onde a confiança foi danificada. Use os princípios de Covey para iniciar a restauração.',
      checklist: [
        'Identifiquei um relacionamento com confiança abalada',
        'Diagnostiquei se o problema é de caráter (integridade/intenção) ou competência (capacidades/resultados)',
        'Tomei a iniciativa de conversar abertamente sobre o problema',
        'Fiz um compromisso específico e cumpri-o no prazo',
      ],
    },
  ],
}

// ============================================================
// Book 4: A Solução do Inovador
// ============================================================

const book4: BookData = {
  slug: 'a-solucao-do-inovador',
  metadata: {
    title: 'A Solução do Inovador',
    original_title: "The Innovator's Solution",
    author: 'Clayton Christensen e Michael Raynor',
    year: 2003,
    category_slug: 'criatividade',
    category_label: 'Criatividade & Inovação',
    category_emoji: '🎨',
    reading_time_min: 14,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Os mercados de capitais exigem que todas as empresas cresçam comercializando novas inovações. Aquelas que conseguem são recompensadas espetacularmente, mas na prática <strong>apenas uma empresa em dez</strong> consegue entregar crescimento consistente e lucrativo. Por quê? Não por falta de boas ideias ou bons gestores, mas porque a maioria das empresas acaba inadvertidamente <strong>diluindo o potencial disruptivo</strong> de suas ideias mais criativas.</p>
<p>Clayton Christensen, professor de Harvard e autor de "O Dilema da Inovação", apresenta neste livro a <strong>solução</strong>: nove decisões-chave que gestores devem tomar corretamente para criar crescimento, além de um template de 13 passos para inovação disruptiva.</p>

<div class="highlight-box">
"O dilema do inovador é que quando líderes de mercado se focam demais em seus clientes e negócios mais lucrativos, podem deixar de ver o potencial de inovações disruptivas que criam novos mercados de crescimento do zero."
</div>

<h2>Dois Tipos de Inovação</h2>
<p>A distinção fundamental que Christensen faz é entre <strong>inovações sustentadoras</strong> (que melhoram produtos existentes para clientes exigentes) e <strong>inovações disruptivas</strong> (que introduzem produtos mais simples, baratos e acessíveis para novos clientes). Em inovações sustentadoras, a empresa incumbente geralmente vence. Em inovações disruptivas, o novo entrante quase sempre prevalece.</p>

<h3>O Teste de Potencial Disruptivo</h3>
<p>Para determinar se uma nova ideia tem potencial disruptivo, Christensen propõe cinco perguntas:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Existe uma grande população</strong> de pessoas sem dinheiro, equipamento ou habilidade para fazer isso sozinhas?</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Clientes precisam ir a um local centralizado</strong> para usar o produto?</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Existem clientes dispostos</strong> a comprar um produto mais barato que faz menos?</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>É possível criar um modelo de negócios</strong> lucrativo vendendo produtos mais baratos?</div>
</div>
<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>A inovação é disruptiva para todos</strong> os incumbentes, ou algum a veria como sustentadora?</div>
</div>

<h2>As 9 Perguntas-Chave</h2>

<h3>1. Como vencer concorrentes poderosos?</h3>
<p>Não ataque de frente. Entre pelo <strong>extremo inferior do mercado</strong> com uma tecnologia disruptiva que gere lucros atrativos a preços de desconto. Depois, suba no mercado gradualmente.</p>

<h3>2. Que produtos desenvolver?</h3>
<p>Três quartos do dinheiro gasto em desenvolvimento resulta em fracassos comerciais. A razão? Empresas segmentam por <strong>demografia ou atributos de produto</strong> quando deveriam segmentar pelos <strong>trabalhos que os clientes querem realizar</strong>. Posicione seu produto disruptivo sobre um "job to be done" que muitas pessoas estão tentando realizar e que está sendo mal atendido.</p>

<h3>3. Quais clientes iniciais mirar?</h3>
<p>Os melhores clientes para uma inovação disruptiva são: <strong>não-consumidores</strong> (que precisam realizar um trabalho mas não usam os produtos disponíveis por serem caros ou complexos demais) e <strong>usuários insatisfeitos na base do mercado</strong> (que não querem pagar pelo upgrade premium).</p>

<div class="highlight-box">
"A Sony introduziu o rádio transistorizado para adolescentes que não podiam pagar os grandes rádios de válvula. Os fabricantes de válvulas ignoraram a ameaça porque a Sony não competia por seus clientes. Poucos anos depois, os transistores estavam em tudo e os fabricantes de válvulas haviam falido."
</div>

<h3>4. O que fazer internamente vs. terceirizar?</h3>
<p>No início de uma disrupção, a integração vertical faz sentido — a tecnologia ainda não é boa o suficiente para atrair fornecedores independentes. Após anos de melhorias, uma <strong>arquitetura aberta</strong> e modular se torna mais vantajosa pelo menor custo operacional.</p>

<h3>5. Como evitar virar commodity?</h3>
<p>Christensen revela um insight poderoso: quando a <strong>commoditização</strong> está em curso em uma parte da cadeia de valor, um processo recíproco de <strong>de-commoditização</strong> está acontecendo em outra parte. O "ponto doce" onde o dinheiro pode ser feito migra continuamente. Empresas que entendem isso se posicionam estrategicamente para o futuro.</p>

<h3>6-7. Estrutura organizacional e estratégia</h3>
<p>A estrutura certa depende de quão bem o novo produto se encaixa nos valores e processos da organização existente. Se ambos são incompatíveis, crie uma <strong>organização completamente autônoma</strong>. A melhor estratégia para um novo negócio raramente é óbvia no início — deve emergir de dados reais, não de planos deliberados.</p>

<h3>8. Fontes de financiamento</h3>
<p>Busque capital que é <strong>paciente para crescimento mas impaciente para lucro</strong>. Mostrar lucratividade cedo valida a estratégia, deflecte pressão de outras unidades e injeta realismo saudável no planejamento. Empresas que adiam a lucratividade para buscar escala tipicamente nunca chegam lá.</p>

<h3>9. O papel da liderança sênior</h3>
<p>Gestores seniores devem: coordenar ações entre unidades, quebrar a inércia de práticas estabelecidas, criar novos processos e garantir recursos adequados. <strong>Crescimento disruptivo sempre cria tensões internas</strong> — só a liderança sênior pode quebrá-las.</p>

<h2>Conclusão</h2>
<p>A solução para o dilema do inovador é que empresas se tornem hábeis em <strong>criar e aproveitar disrupções por conta própria</strong>. Isso requer mirar não-consumidores, segmentar por "jobs to be done", manter-se ágil na cadeia de valor e exigir lucratividade precoce. Comece antes de ser forçado, comece pequeno, e construa um motor de crescimento que gere negócios disruptivos em sequência.</p>`,
  mindmap_json: {
    center_label: 'A SOLUÇÃO DO INOVADOR',
    center_sublabel: '9 Perguntas-Chave da Disrupção',
    branches: [
      {
        title: 'Tipos de Inovação',
        icon: '💡',
        items: [
          'Sustentadora: melhora para clientes atuais',
          'Disruptiva: simples, barata, acessível',
          'Incumbente vence sustentação',
          'Entrante vence disrupção',
        ],
      },
      {
        title: 'Clientes e Produtos',
        icon: '🎯',
        items: [
          'Mire não-consumidores primeiro',
          'Segmente por "jobs to be done"',
          'Entre pela base do mercado',
          'Suba gradualmente no mercado',
        ],
      },
      {
        title: 'Cadeia de Valor',
        icon: '🔗',
        items: [
          'Integre no início da disrupção',
          'Abra arquitetura após melhorias',
          'Commoditização ↔ De-commoditização',
          'O ponto doce migra continuamente',
        ],
      },
      {
        title: 'Estratégia e Estrutura',
        icon: '🏗️',
        items: [
          'Organização autônoma se necessário',
          'Deixe estratégia emergir dos dados',
          'Minimize custos iniciais',
          'Valide com dados do mundo real',
        ],
      },
      {
        title: 'Financiamento',
        icon: '💰',
        items: [
          'Paciente para crescimento',
          'Impaciente para lucro',
          'Lucratividade precoce é essencial',
          'Comece pequeno e cedo',
        ],
      },
      {
        title: 'Liderança Sênior',
        icon: '👑',
        items: [
          'Quebre inércia de práticas antigas',
          'Coordene entre unidades de negócio',
          'Crie motor de crescimento disruptivo',
          'Intervenha pessoalmente quando necessário',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'O dilema do inovador: quando líderes de mercado se focam demais em seus clientes mais lucrativos, deixam de ver o potencial de inovações disruptivas que criam novos mercados do zero.',
      source_chapter: 'Introdução — O Dilema da Inovação',
    },
    {
      text: 'Três quartos do dinheiro gasto em desenvolvimento de produtos resulta em fracassos comerciais. A razão: empresas segmentam por demografia quando deveriam segmentar pelos trabalhos que os clientes estão tentando realizar.',
      source_chapter: 'Pergunta 2 — Que Produtos Desenvolver',
    },
    {
      text: 'A IBM decidiu terceirizar o microprocessador e o sistema operacional de seu PC. Essa decisão permitiu que Intel e Microsoft capturassem a maior parte dos lucros da nova indústria.',
      source_chapter: 'Pergunta 4 — Fazer Internamente vs. Terceirizar',
    },
    {
      text: 'Sempre que a commoditização está em curso em algum lugar da cadeia de valor, um processo recíproco de de-commoditização estará acontecendo em outro lugar da mesma cadeia. O ponto doce migra continuamente.',
      source_chapter: 'Pergunta 5 — Como Evitar Virar Commodity',
    },
    {
      text: 'Empresas que adiam a lucratividade para buscar escala tipicamente nunca chegam lá. Exija que sua estratégia de disrupção seja validada pela geração de lucros operacionais o mais cedo possível.',
      source_chapter: 'Pergunta 8 — Fontes de Financiamento',
    },
    {
      text: 'Os gestores que entregaram os melhores resultados no passado serão os menos propensos a ter sucesso no novo negócio disruptivo. Procure gestores que são solucionadores de problemas, não executores de processos.',
      source_chapter: 'Template — Passo 10: Encontre Novos Gestores',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Mapeie os "Jobs to Be Done"',
      icon: '🔍',
      color_theme: 'accent',
      description:
        'Observe seus clientes (ou potenciais clientes) por uma semana e identifique os trabalhos que estão tentando realizar — e que estão sendo mal atendidos pelas soluções existentes.',
      template_text:
        'Cliente observado: [QUEM]. Trabalho que tenta realizar: [JOB]. Solução atual: [SOLUÇÃO]. Frustração principal: [FRUSTRAÇÃO]. Oportunidade disruptiva: [IDEIA].',
      checklist: [
        'Observei pelo menos 5 clientes ou potenciais clientes',
        'Identifiquei os "trabalhos" que estão tentando fazer',
        'Encontrei pelo menos um trabalho mal atendido pelas soluções atuais',
        'Esbocei uma solução mais simples e barata para esse trabalho',
      ],
    },
    {
      title: 'Exercício 2 — Teste de Potencial Disruptivo',
      icon: '⚡',
      color_theme: 'green',
      description:
        'Aplique as 5 perguntas de Christensen a uma ideia de produto ou serviço que você está considerando desenvolver.',
      checklist: [
        'Respondi às 5 perguntas de potencial disruptivo honestamente',
        'Identifiquei os não-consumidores que poderia atingir',
        'Verifiquei se posso ser lucrativo nos preços de desconto necessários',
        'Confirmei que a inovação é disruptiva para TODOS os incumbentes',
        'Decidi se devo seguir como disrupção ou como inovação sustentadora',
      ],
    },
    {
      title: 'Exercício 3 — Onde Está o Ponto Doce da Sua Indústria?',
      icon: '💎',
      color_theme: 'orange',
      description:
        'Analise a cadeia de valor da sua indústria e identifique onde a commoditização está ocorrendo — e onde a de-commoditização está criando novas oportunidades de lucro.',
      checklist: [
        'Desenhei a cadeia de valor completa da minha indústria',
        'Identifiquei onde produtos estão se tornando commodities',
        'Identifiquei onde novas oportunidades de diferenciação estão surgindo',
        'Defini uma ação para me posicionar no ponto doce futuro',
      ],
    },
  ],
}

// ============================================================
// Book 5: Como Pensar Como Leonardo da Vinci
// ============================================================

const book5: BookData = {
  slug: 'como-pensar-como-leonardo-da-vinci',
  metadata: {
    title: 'Como Pensar Como Leonardo da Vinci',
    original_title: 'How To Think Like Leonardo da Vinci',
    author: 'Michael Gelb',
    year: 1999,
    category_slug: 'criatividade',
    category_label: 'Criatividade & Inovação',
    category_emoji: '🎨',
    reading_time_min: 13,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Leonardo da Vinci foi o <strong>maior polímata da história</strong> — com carreiras simultâneas como artista de classe mundial, arquiteto, cientista, inventor e engenheiro. Nas horas vagas, era cozinheiro talentoso e tocava instrumentos musicais em nível profissional. Se alguém pode exemplificar como aplicar criatividade e habilidades de aprendizado de forma produtiva, da Vinci é o modelo supremo.</p>
<p>Michael Gelb analisa como da Vinci alcançou tanto e extrai um sistema de <strong>sete princípios</strong> para desenvolvimento pessoal e profissional. A premissa: embora da Vinci fosse um gênio, a maioria das pessoas usa apenas uma fração de seu potencial cerebral. Ao imitar o sistema que ele usava, qualquer pessoa pode aguçar a mente, liberar a inteligência e expandir a autoexpressão criativa.</p>

<div class="highlight-box">
"Vagueei pelo campo em busca de respostas para coisas que não entendia. Essas questões e outros fenômenos estranhos ocuparam meu pensamento ao longo de toda a minha vida."
— Leonardo da Vinci
</div>

<h2>Princípio 1: Curiosità — A Busca por Aprendizado Contínuo</h2>
<p>Todos possuem uma curiosidade aguçada. O desafio está em <strong>refinar e desenvolver esse traço</strong> ao longo de toda uma carreira. Isso requer fazer "grandes perguntas" regularmente e buscar intensamente suas respostas.</p>
<p>Da Vinci manteve cerca de <strong>7.000 páginas de notas</strong> durante sua vida — e estudiosos acreditam que isso era apenas metade do que ele realmente escreveu. Ele anotava ideias, pensamentos, esboços e impressões sempre que lhe ocorriam. Seus cadernos incluíam planos para máquinas voadoras, helicópteros, paraquedas, escadas extensíveis, bicicletas, chaves ajustáveis, mergulho com snorkel e o primeiro palco giratório do mundo.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Exercício das 100 perguntas:</strong> Faça uma lista das 100 perguntas mais importantes para você em uma única sessão. Depois, identifique temas e selecione as 10 mais importantes. Qual delas te faz sentir mais incerteza?</div>
</div>

<h2>Princípio 2: Dimostrazione — Teste o Conhecimento na Prática</h2>
<p>Experiência em primeira mão é a <strong>melhor fonte de sabedoria</strong>. A disposição para aprender com erros e testar opiniões na prática é a base para desenvolver bom julgamento. Sem isso, uma pessoa fica refém de preconceitos e do conhecimento limitado que passa por sabedoria convencional.</p>
<p>Da Vinci escreveu: <strong>"A experiência nunca erra; é apenas o seu julgamento que erra ao prometer resultados que não são causados por seus experimentos."</strong> No mundo dos negócios, executivos seniores consistentemente apontam a falha em seguir sua própria experiência como a principal causa de suas piores decisões.</p>

<h2>Princípio 3: Sensazione — Afie os Sentidos Constantemente</h2>
<p>Os cinco sentidos — visão, audição, tato, paladar e olfato — são as chaves para criar valor em qualquer atividade. Ao <strong>refinar e melhorar os sentidos</strong>, você aumenta tanto sua inteligência quanto sua capacidade de aprender com o mundo ao redor.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Visão:</strong> Pratique focar em objetos próximos e distantes. Aumente o tempo visualizando resultados positivos. Aprenda a desenhar ou pintar.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Audição:</strong> Separe os sons ao redor em camadas — os mais altos, os sutis, os raros. Estude compositores e identifique padrões musicais.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Tato, paladar e olfato:</strong> Dedique dias inteiros focando em apenas um sentido. Amplie seu vocabulário sensorial além de "agradável" e "desagradável".</div>
</div>

<p>Da Vinci observou: <strong>"O ser humano médio olha sem ver, ouve sem escutar, toca sem sentir, come sem saborear, move-se sem consciência física e fala sem pensar."</strong></p>

<h2>Princípio 4: Sfumato — Seja Confortável com Ambiguidade</h2>
<p>A criatividade floresce quando você mantém a mente aberta diante da <strong>incerteza</strong>. A capacidade de abraçar a ambiguidade e funcionar produtivamente é uma característica do gênio — e um traço valioso em um mundo em rápida mudança.</p>
<p>Nos anos 1980, a American Management Association publicou um estudo concluindo que os gestores mais bem-sucedidos se distinguiam por <strong>"alta tolerância à ambiguidade e habilidade de decisão intuitiva"</strong>. Hoje, tolerância não é mais suficiente — a ambiguidade deve ser abraçada e apreciada.</p>

<div class="highlight-box">
"Os maiores gênios às vezes realizam mais quando trabalham menos."
— Leonardo da Vinci
</div>

<h2>Princípio 5: Arte/Scienza — Equilibre Ciência e Arte</h2>
<p>O conceito de ser "cérebro esquerdo" (lógico) ou "cérebro direito" (artístico) é bem conhecido. A vida de da Vinci mostra o que pode ser alcançado quando <strong>ambos os lados do cérebro são aproveitados</strong>. Ele deu origem às ideias modernas de "brainstorming" e desenvolveu o <strong>mapa mental</strong> como método de resolução de problemas.</p>
<p>As realizações de da Vinci são impressionantes: como artista, pintou a <strong>Mona Lisa</strong> e a <strong>Última Ceia</strong>. Como inventor, concebeu helicópteros, paraquedas e equipamentos hidráulicos. Como cientista, contribuiu para anatomia, botânica, geologia e física. Descobriu que o sol não se move 40 anos antes de Copérnico e escreveu sobre gravitação 200 anos antes de Newton.</p>

<h2>Princípio 6: Corporalità — Desenvolva o Equilíbrio Corpo-Mente</h2>
<p>Além de cultivar a capacidade de pensar com clareza, da Vinci estava em <strong>excelente saúde física</strong>. O estado do seu corpo influencia sua mente e seu desempenho. Um programa equilibrado de fitness inclui condicionamento aeróbico, treinamento de força e exercícios de flexibilidade.</p>
<p>Da Vinci aconselhava: evite raiva, mantenha a mente alegre, cubra-se bem à noite, exercite-se moderadamente, <strong>coma apenas quando quiser e coma alimentos simples</strong>, mastigue bem e mantenha os intestinos regulares.</p>

<h2>Princípio 7: Connessione — Mantenha a Perspectiva do Todo</h2>
<p>Apesar de vivermos em uma era de especialização, manter uma visão precisa do <strong>panorama geral</strong> é particularmente valioso. O maior sucesso e a felicidade interior virão para aqueles que entendem que todas as ações, padrões e relacionamentos fazem parte de uma totalidade que envolve a raça humana.</p>

<div class="key-point">
  <div class="kp-num">🔗</div>
  <div class="kp-text"><strong>Pensamento micro/macro:</strong> Focalize no nível molecular e depois mude para o macrocósmico — como o sistema se encaixa na sociedade como um todo. Isso gera uma perspectiva muito mais ampla e detalhada.</div>
</div>

<p>Gelb sugere criar um <strong>mapa mental mestre da sua vida</strong> ao longo de 7 dias: Dia 1 — logo pessoal; Dia 2 — metas específicas; Dia 3 — valores centrais; Dia 4 — propósito central; Dia 5 — realidades atuais; Dia 6 — conexões e prioridades; Dia 7 — estratégias de mudança.</p>

<div class="highlight-box">
"Tudo vem de tudo, e tudo é feito de tudo, e tudo retorna a tudo."
— Leonardo da Vinci
</div>

<h2>Conclusão</h2>
<p>Leonardo da Vinci poderia ser o <strong>santo padroeiro dos pensadores independentes</strong> e o modelo supremo do que o espírito humano é capaz de alcançar. Seus sete princípios — curiosidade insaciável, aprendizado pela experiência, refinamento dos sentidos, conforto com ambiguidade, equilíbrio entre arte e ciência, harmonia corpo-mente e visão do todo — formam um sistema completo para liberar o potencial que já existe dentro de cada um de nós.</p>`,
  mindmap_json: {
    center_label: 'COMO PENSAR COMO DA VINCI',
    center_sublabel: '7 Princípios do Gênio Cotidiano',
    branches: [
      {
        title: 'Curiosità',
        icon: '🔍',
        items: [
          'Faça grandes perguntas',
          'Mantenha um caderno de ideias',
          'Reserve tempo para contemplação',
          'Escrita de fluxo de consciência',
        ],
      },
      {
        title: 'Dimostrazione',
        icon: '🧪',
        items: [
          'Teste na prática, não na teoria',
          'Aprenda com erros e fracassos',
          'Questione fontes de informação',
          'Desenvolva pensamento independente',
        ],
      },
      {
        title: 'Sensazione',
        icon: '👁️',
        items: [
          'Afie os cinco sentidos diariamente',
          'Veja, não apenas olhe',
          'Ouça, não apenas escute',
          'Crie ambiente estimulante',
        ],
      },
      {
        title: 'Sfumato',
        icon: '🌫️',
        items: [
          'Abrace a incerteza',
          'Confie na intuição',
          'Alterne intensidade e descanso',
          'Cultive tolerância à confusão',
        ],
      },
      {
        title: 'Arte/Scienza',
        icon: '🎨',
        items: [
          'Equilibre lógica e imaginação',
          'Use mapas mentais para resolver',
          'Combine os dois lados do cérebro',
          'Brainstorming criativo e analítico',
        ],
      },
      {
        title: 'Corporalità + Connessione',
        icon: '🧘',
        items: [
          'Corpo saudável = mente afiada',
          'Fitness: aeróbico + força + flexibilidade',
          'Pense micro e macro simultaneamente',
          'Tudo está conectado a tudo',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Vagueei pelo campo em busca de respostas para coisas que não entendia. Essas questões e outros fenômenos estranhos ocuparam meu pensamento ao longo de toda a minha vida.',
      source_chapter: 'Princípio 1 — Curiosità',
    },
    {
      text: 'A experiência nunca erra; é apenas o seu julgamento que erra ao prometer resultados que não são causados por seus experimentos. No mundo dos negócios, a falha em seguir a própria experiência é a principal causa das piores decisões.',
      source_chapter: 'Princípio 2 — Dimostrazione',
    },
    {
      text: 'O ser humano médio olha sem ver, ouve sem escutar, toca sem sentir, come sem saborear, move-se sem consciência física e fala sem pensar. Os cinco sentidos são os ministros da alma.',
      source_chapter: 'Princípio 3 — Sensazione',
    },
    {
      text: 'Os maiores gênios às vezes realizam mais quando trabalham menos. É bom que você frequentemente interrompa o trabalho e faça uma pequena pausa, porque quando volta a ele, é um juiz melhor.',
      source_chapter: 'Princípio 4 — Sfumato',
    },
    {
      text: 'A maioria das invenções de negócios é inspirada pela pergunta "E se...?" A economia multibilionária do Vale do Silício foi inspirada pela pergunta: "E se encolhêssemos o tamanho dos chips?"',
      source_chapter: 'Princípio 1 — Curiosità (Aplicação nos Negócios)',
    },
    {
      text: 'Tudo vem de tudo, e tudo é feito de tudo, e tudo retorna a tudo. Tudo está conectado a tudo mais.',
      source_chapter: 'Princípio 7 — Connessione',
    },
    {
      text: 'O estado do seu corpo influencia sua mente. Se seu corpo é rígido ou colapsado, sua mente frequentemente seguirá. Muitas organizações estão introduzindo sessões de massagem, yoga e aikidô para ajudar pessoas a descobrir maior flexibilidade física e mental.',
      source_chapter: 'Princípio 6 — Corporalità',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — As 100 Perguntas da Vida',
      icon: '❓',
      color_theme: 'accent',
      description:
        'Sente-se e faça uma lista das 100 perguntas mais importantes para você em uma única sessão, sem censurar. Depois, identifique temas e selecione as 10 mais poderosas.',
      checklist: [
        'Reservei pelo menos 1 hora ininterrupta para este exercício',
        'Escrevi pelo menos 50 perguntas (idealmente 100)',
        'Identifiquei os temas recorrentes nas perguntas',
        'Selecionei as 10 perguntas mais importantes e as ranqueei',
        'Escolhi 1 pergunta e comecei a buscar respostas esta semana',
      ],
    },
    {
      title: 'Exercício 2 — Mapa Mental de um Desafio Atual',
      icon: '🗺️',
      color_theme: 'green',
      description:
        'Escolha um problema ou projeto atual e crie um mapa mental seguindo o método de da Vinci: tema central, palavras-chave irradiando, sub-ideias, conexões por cores e setas.',
      checklist: [
        'Escrevi o problema/desafio no centro de uma folha grande',
        'Desenhei pelo menos 5 ramos com palavras-chave',
        'Adicionei sub-ideias para cada ramo',
        'Conectei ideias relacionadas com setas ou cores',
        'Redesenhei o mapa após uma pausa para incubação',
      ],
    },
    {
      title: 'Exercício 3 — Dia dos Sentidos Aguçados',
      icon: '👂',
      color_theme: 'orange',
      description:
        'Escolha um dia desta semana e dedique-o inteiramente a aguçar um sentido específico. Registre tudo que perceber em um caderno.',
      checklist: [
        'Escolhi qual sentido vou focar (visão, audição, tato, paladar ou olfato)',
        'Mantive meu caderno comigo o dia todo',
        'Registrei pelo menos 20 observações detalhadas',
        'Descobri algo que nunca havia notado antes',
        'Compartilhei uma descoberta com alguém',
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
  console.log('  RESUMOX — Inserting 5 New Books (Batch 9)')
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
