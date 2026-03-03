#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content (Batch 3)
 * Books: Leading the Revolution, Think Twice, Amazon.com Get Big Fast, NIKE, Must-Win Battles
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
// Book 1: Leading the Revolution
// ============================================================

const book1: BookData = {
  slug: 'liderando-a-revolucao',
  metadata: {
    title: 'Liderando a Revolução',
    original_title: 'Leading the Revolution',
    author: 'Gary Hamel',
    year: 2000,
    category_slug: 'inovacao',
    category_label: 'Inovação e Criatividade',
    category_emoji: '💡',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#e94560',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Para sobreviver e prosperar, uma empresa precisa se reinventar continuamente — caso contrário, torna-se comercialmente irrelevante. <strong>Gary Hamel</strong> argumenta que, na nova economia, a vantagem competitiva sustentável vem de uma única fonte: a capacidade de desenvolver <strong>conceitos de negócio radicais e inovadores</strong> que revolucionam indústrias inteiras. As empresas que conseguem se reinventar regularmente sempre prosperam — geralmente às custas de concorrentes menos flexíveis.</p>
<p>O desafio fundamental dos negócios é reinventar continuamente a organização e as indústrias que ela serve. Resumindo: <strong>desenvolva novos conceitos e modelos de negócio revolucionários, ou morra</strong>. Essa é a verdadeira vantagem competitiva do novo milênio.</p>

<div class="highlight-box">
  "Na nova ordem industrial, a batalha não é democracia versus totalitarismo ou globalismo versus tribalismo, é inovação versus precedente." — Gary Hamel
</div>

<h2>O Fim do Incrementalismo</h2>
<p>Nos próximos anos, melhorar ligeiramente um modelo de negócio existente simplesmente não será suficiente. A realidade competitiva do mundo dos negócios moderno é que melhorias incrementais e sequenciais não funcionam mais. Todos os modelos de negócio existentes perdem rapidamente sua eficiência econômica.</p>
<p>A nova riqueza será criada por aqueles que conseguirem pegar seus antigos modelos de negócio e criar outros revolucionários que <strong>criem novos mercados</strong>, <strong>sirvam novos clientes</strong> e <strong>gerem fluxos de receita inteiramente novos</strong>.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Ideias revolucionárias vêm da previsão sortuda:</strong> Não surgem de sessões formais de planejamento, mas da mente de alguém com a mistura certa de desejo, curiosidade, ambição e oportunidade.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Modelos de negócio têm prazo de validade:</strong> Mais cedo ou mais tarde, todo modelo de negócio atinge o ponto de retornos decrescentes. E hoje, isso acontece mais cedo do que tarde.</div>
</div>

<h2>Modelos de Negócio Radicalmente Diferentes</h2>
<p>Um modelo de negócio é simplesmente um conceito de negócio colocado em prática. Quando um novo modelo surge, frequentemente torna os modelos antigos obsoletos. A inovação de conceito de negócio é "não-linear" — revolucionária e nova, não uma melhoria do que existia antes.</p>
<p>Os quatro componentes principais de um modelo de negócio são:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Interface com o Cliente:</strong> Como a empresa alcança os consumidores — canais de distribuição, suporte, marketing estratégico, interação com clientes e estrutura de preços.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Estratégia Central:</strong> A essência de como o negócio compete — missão, escopo de produto, alcance de mercado e base de diferenciação.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Recursos Estratégicos:</strong> Know-how, competências centrais, ativos estratégicos e processos nos quais o negócio tem expertise.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Rede de Valor:</strong> Recursos fornecidos por parceiros, aliados estratégicos ou fornecedores que a empresa pode acessar e utilizar.</div>
</div>

<h2>Os Princípios do Ativismo</h2>
<p>Revoluções nos negócios nunca vêm de cima para baixo. Há interesses demais para superar. Todas as verdadeiras revoluções começam de baixo e gradualmente se espalham para cima. Hamel propõe 8 passos para iniciar uma revolução empresarial interna:</p>
<p><strong>1. Gere um ponto de vista original</strong> — baseado em dados sólidos e que fale ao coração e ao intelecto. <strong>2. Escreva um manifesto</strong> — curto, apaixonado e focado em possibilidades futuras. <strong>3. Crie uma coalizão de aliados</strong> usando redes internas. <strong>4. Escolha batalhas iniciais cuidadosamente</strong> — consiga o apoio de alguém da alta gestão. <strong>5. Coopte ou neutralize outros líderes progressivamente.</strong> <strong>6. Encontre um tradutor</strong> que conecte a cultura da revolução com a linguagem da organização. <strong>7. Vença pequeno, vença cedo, vença frequentemente</strong> — resultados tangíveis constroem credibilidade. <strong>8. Isole, infiltre, integre</strong> — comece experimentando isoladamente, depois integre com o resto da organização.</p>

<div class="highlight-box">
  "Todo dia empresas são surpreendidas pelo futuro. Alguém, em algum lugar, estava prestando atenção. Para esses hereges e viciados em novidade, as oportunidades de amanhã são tão reais quanto o nascer do sol de hoje."
</div>

<h2>As 10 Regras de Design para Inovação Radical</h2>
<p>O papel da alta gestão não é construir estratégias. É construir uma organização que desenvolva continuamente novos conceitos de negócio. As 10 regras são:</p>
<p><strong>1. Tenha expectativas irracionais</strong> — metas ambiciosas e agressivas. <strong>2. Tenha uma definição de negócio elástica</strong> — deixe competências e ativos definirem o ritmo. <strong>3. Jure fidelidade a uma causa, não a um modelo de negócio.</strong> <strong>4. Ouça vozes novas e revolucionárias</strong> — especialmente jovens e outsiders. <strong>5. Crie um mercado interno de ideias dinâmico e aberto.</strong> <strong>6. Aloque capital como um capitalista de risco</strong> — invista em vários conceitos esperando que um gere retornos espetaculares. <strong>7. Dê incentivos para quem assume riscos.</strong> <strong>8. Encoraje experimentação de baixo risco.</strong> <strong>9. Divida a organização em células revolucionárias.</strong> <strong>10. Permita que empreendedores internos acumulem riqueza pessoal.</strong></p>

<h2>Inovação como Capacidade e Processo Organizacional</h2>
<p>Para inovar consistentemente, a organização precisa da combinação certa de <strong>habilidades de inovação</strong>, <strong>métricas de inovação</strong> (como o Índice de Criação de Riqueza), <strong>tecnologia da informação</strong> para colaboração e <strong>processos de gestão</strong> voltados para o futuro.</p>
<p>A inovação como processo envolve cinco elementos: <strong>Imaginar</strong> → <strong>Projetar</strong> → <strong>Experimentar</strong> → <strong>Avaliar</strong> → <strong>Escalar</strong>. Quanto mais rápido a organização executa esse ciclo, mais riqueza nova cria.</p>

<h2>O Portfólio de Inovação</h2>
<p>A joia da coroa de qualquer organização deve ser seu portfólio de inovação, composto por três divisões:</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Ideias:</strong> Conceitos de negócio credíveis mas ainda não testados. Empresas inovadoras terão centenas delas borbulhando o tempo todo.</div>
</div>

<div class="key-point">
  <div class="kp-num">🧪</div>
  <div class="kp-text"><strong>Experimentos:</strong> Conceitos sendo validados através de testes de mercado de baixo custo. A maioria falhará — e deve ser assim.</div>
</div>

<div class="key-point">
  <div class="kp-num">🚀</div>
  <div class="kp-text"><strong>Empreendimentos:</strong> Experimentos bem-sucedidos sendo escalados. A questão agora é se a receita pode ser gerada de forma lucrativa.</div>
</div>

<div class="highlight-box">
  "Uma empresa que não consegue reimaginar seu sentido mais profundo do que é, o que faz e como compete será em breve tornada obsoleta." — Gary Hamel
</div>`,

  mindmap_json: {
    center_label: 'LIDERANDO A REVOLUÇÃO',
    branches: [
      {
        label: 'Fim do Incrementalismo',
        items: [
          'Modelos de negócio perdem eficiência',
          'Nova riqueza vem de conceitos radicais',
          'Ideias surgem da previsão sortuda',
          'Retornos decrescentes são inevitáveis',
        ],
      },
      {
        label: 'Modelos de Negócio',
        items: [
          'Interface com o cliente',
          'Estratégia central',
          'Recursos estratégicos',
          'Rede de valor',
          'Eficiência, unicidade, fit e amplificadores',
        ],
      },
      {
        label: 'Princípios do Ativismo',
        items: [
          'Gere ponto de vista original',
          'Escreva um manifesto',
          'Crie coalizão de aliados',
          'Vença pequeno, cedo e sempre',
          'Isole, infiltre, integre',
        ],
      },
      {
        label: '10 Regras de Design',
        items: [
          'Expectativas irracionais',
          'Definição de negócio elástica',
          'Fidelidade à causa, não ao modelo',
          'Mercado interno de ideias aberto',
          'Experimentação de baixo risco',
        ],
      },
      {
        label: 'Inovação Organizacional',
        items: [
          'Habilidades de inovação',
          'Métricas (ex: Índice de Criação de Riqueza)',
          'TI para colaboração',
          'Processos de gestão voltados ao futuro',
        ],
      },
      {
        label: 'Portfólio de Inovação',
        items: [
          'Ideias: conceitos não testados',
          'Experimentos: validação de baixo custo',
          'Empreendimentos: escalar o que funciona',
          'Ciclo: Imaginar → Projetar → Experimentar → Avaliar → Escalar',
        ],
      },
    ],
  },

  insights_json: [
    {
      chapter: 'O Fim do Incrementalismo',
      icon: '⚡',
      text: 'Todos os modelos de negócio eventualmente atingem o ponto de retornos decrescentes. A verdadeira vantagem competitiva vem de criar modelos radicalmente novos, não de otimizar os existentes.',
    },
    {
      chapter: 'Modelos de Negócio Radicais',
      icon: '🏗️',
      text: 'A inovação de conceito de negócio consiste em contornar os concorrentes, não em atacá-los diretamente. O ideal é forçar concorrentes a abandonar seus modelos antigos.',
    },
    {
      chapter: 'Princípios do Ativismo',
      icon: '✊',
      text: 'Revoluções empresariais nunca vêm de cima para baixo. Começam como movimentos de base. Qualquer pessoa na organização pode ser o catalisador da mudança.',
    },
    {
      chapter: '10 Regras de Design',
      icon: '🎯',
      text: 'Organizações que se reinventam alocam capital como capitalistas de risco: investem em 10 conceitos esperando que um gere retornos espetaculares que compensem as perdas dos outros.',
    },
    {
      chapter: 'Inovação como Capacidade',
      icon: '📊',
      text: 'Métricas tradicionais são voltadas para otimização de lucros. A inovação requer novas métricas, como o Índice de Criação de Riqueza, que mede eficácia em criar nova riqueza vs rivais.',
    },
    {
      chapter: 'Portfólio de Inovação',
      icon: '🚀',
      text: 'A maioria dos experimentos de inovação deve falhar — caso contrário, as ideias testadas não são ousadas o suficiente. Organize seu portfólio em ideias, experimentos e empreendimentos.',
    },
  ],

  exercises_json: [
    {
      title: 'Auditoria do Modelo de Negócio',
      color_theme: 'accent',
      steps: [
        'Mapeie os 4 componentes do seu modelo de negócio atual: Interface com Cliente, Estratégia Central, Recursos Estratégicos e Rede de Valor.',
        'Para cada componente, avalie de 1 a 10 o nível de diferenciação em relação aos concorrentes.',
        'Identifique pelo menos 3 premissas do seu modelo que foram definidas há mais de 2 anos e que podem estar obsoletas.',
        'Desenvolva um conceito alternativo para o componente com menor pontuação.',
        'Apresente a ideia para 3 colegas e colete feedback honesto.',
      ],
    },
    {
      title: 'Manifesto de Inovação Pessoal',
      color_theme: 'green',
      steps: [
        'Identifique 3 coisas que estão mudando rapidamente no seu setor e 3 que estão mudando lentamente.',
        'Escreva um manifesto de 1 página sobre a oportunidade que essas descontinuidades representam.',
        'Liste 10 coisas que os clientes nunca dizem sobre sua empresa e imagine o que aconteceria se você invertesse cada uma.',
        'Compartilhe o manifesto com pelo menos 5 pessoas da organização.',
        'Defina 3 ações concretas para os próximos 30 dias baseadas nas reações que receber.',
      ],
    },
    {
      title: 'Construa seu Portfólio de Inovação',
      color_theme: 'orange',
      steps: [
        'Liste todas as ideias de novos conceitos de negócio que existem informalmente na sua equipe ou organização.',
        'Classifique cada uma como Ideia (não testada), Experimento (em validação) ou Empreendimento (sendo escalado).',
        'Para ideias promissoras sem experimento, defina um teste de baixo custo que possa ser realizado em até 4 semanas.',
        'Estabeleça critérios claros de "matar ou escalar" para cada experimento em andamento.',
        'Agende uma revisão mensal do portfólio para avaliar progresso e realocar recursos.',
      ],
    },
  ],
}

// ============================================================
// Book 2: Think Twice
// ============================================================

const book2: BookData = {
  slug: 'pense-duas-vezes',
  metadata: {
    title: 'Pense Duas Vezes',
    original_title: 'Think Twice: Harnessing the Power of Counterintuition',
    author: 'Michael Mauboussin',
    year: 2009,
    category_slug: 'psicologia',
    category_label: 'Psicologia e Comportamento',
    category_emoji: '🧠',
    reading_time_min: 13,
    cover_gradient_from: '#0f3460',
    cover_gradient_to: '#533483',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Por que pessoas inteligentes tomam decisões terrivelmente ruins, especialmente quando as apostas são altas? <strong>Michael Mauboussin</strong> explica que tudo se resume ao "software mental" pré-programado no cérebro humano. Simplesmente não somos bem equipados para lidar com muitos dos problemas mais urgentes de hoje. Vemos o mundo que queremos ver, em vez de deixar os fatos falarem por si. E a maioria de nós prefere fazer o que vem à mente primeiro, em vez de calibrar adequadamente as evidências disponíveis.</p>
<p>Para reduzir o número de erros que cometemos, precisamos <strong>pensar duas vezes</strong> sobre nossas escolhas. Isso envolve três passos: <strong>Preparar</strong> (aprender com erros passados), <strong>Reconhecer</strong> (identificar o problema no contexto correto) e <strong>Aplicar</strong> (usar ferramentas mentais para evitar armadilhas).</p>

<div class="highlight-box">
  "Pessoas inteligentes tomam decisões ruins porque têm as mesmas configurações de fábrica no software mental que o resto de nós, e o software não foi projetado para lidar com muitos dos problemas de hoje." — Michael Mauboussin
</div>

<h2>Erro 1: Pensamos que Nossos Problemas são Únicos</h2>
<p>Todos gostamos de pensar que nossos problemas são únicos, em vez de considerar cuidadosamente as experiências relevantes de outros. Executivos de fusões e aquisições, por exemplo, acreditam que podem vencer as probabilidades, embora a maioria das transações não crie valor para os acionistas da empresa adquirente.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Solução — Visão Externa:</strong> Incorpore uma visão externa em cada decisão. Identifique outras pessoas que resolveram o mesmo problema e adapte o que fizeram de certo. Selecione dados de referência, analise resultados e faça previsões ajustadas.</div>
</div>

<h2>Erro 2: Visão de Túnel</h2>
<p>Quando temos uma "âncora" mental — uma primeira aproximação do resultado esperado — frequentemente acabamos com visão de túnel. Agentes imobiliários, ao receber preços de listagem diferentes para a mesma casa, avaliaram consistentemente valores mais altos quando a listagem era mais alta.</p>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Solução — Liste alternativas:</strong> Faça uma decisão consciente de considerar outras alternativas, acolha a dissidência, rastreie decisões anteriores e sempre entenda os incentivos envolvidos.</div>
</div>

<h2>Erro 3: Confiança Excessiva em Especialistas</h2>
<p>Gostamos de acreditar que especialistas sabem mais do que realmente sabem. Porém, uma vez que princípios e processos ficam claros, computadores se tornam mais eficientes que especialistas na aplicação repetitiva. A sabedoria coletiva de uma multidão é frequentemente mais precisa do que um único especialista.</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Solução — Busque diversidade:</strong> Combine especialistas com tecnologia e sabedoria coletiva. Codifique funções repetitivas em algoritmos. Saiba quando usar cada abordagem.</div>
</div>

<h2>Erro 4: Pressão Social nas Decisões</h2>
<p>Não agimos objetivamente — tomamos pistas dos comportamentos das pessoas ao nosso redor. A inércia organizacional ("sempre fizemos assim") pode ser a gênese de decisões excepcionalmente ruins.</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Solução — Gerencie influências:</strong> Reconheça que a tomada de decisão é um exercício social. Analise a situação primeiro e os indivíduos depois. Cuidado com o "imperativo institucional" — a tendência de imitar cegamente o que os pares fazem.</div>
</div>

<h2>Erro 5: Simplificação Excessiva de Sistemas Complexos</h2>
<p>Quando empresas contratam CEOs "superstar" pagando prêmios enormes, frequentemente obtêm desempenho apenas médio. Superstars tipicamente têm um sistema de suporte otimizado para seus talentos. Fora dele, sua produtividade regride à média.</p>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Solução — Veja o sistema inteiro:</strong> Evite focar em apenas uma parte do sistema. Fique atento a sistemas fortemente acoplados. Desenvolva simulações quando possível.</div>
</div>

<h2>Erro 6: Relações Causais Imprecisas</h2>
<p>Formamos relações de causa e efeito imprecisas, especialmente para situações geradas por circunstâncias. O Boeing 787 Dreamliner é um caso clássico: a terceirização que funciona para PCs modulares foi desastrosa para aeronaves complexas.</p>

<div class="key-point">
  <div class="kp-num">6</div>
  <div class="kp-text"><strong>Solução — Considere circunstâncias:</strong> Reconheça que circunstâncias mudam constantemente. Desconfie de "melhores práticas" universais e de correlações espúrias.</div>
</div>

<h2>Erro 7: Pontos de Virada Ignorados</h2>
<p>Não estamos familiarizados com pontos de virada onde uma pequena mudança pode causar consequências enormes. A crise financeira de 2007-2009 foi um exemplo: a fórmula de David Li era precisa quando ativos agiam independentemente, mas correlações subjacentes causaram uma reação em cadeia catastrófica.</p>

<div class="key-point">
  <div class="kp-num">7</div>
  <div class="kp-text"><strong>Solução — Prepare-se para extremos:</strong> Estude a distribuição de resultados, procure transições de fase e desconfie de previsões que abrangem múltiplos domínios.</div>
</div>

<h2>Erro 8: Confundir Habilidade com Sorte</h2>
<p>Superestimamos o efeito da nossa habilidade nos resultados e minimizamos o impacto da sorte. O "efeito halo" nos leva a atribuir atributos de sucesso a organizações que simplesmente tiveram uma boa fase — e quando o desempenho regride à média, concluímos erroneamente que algo mudou.</p>

<div class="key-point">
  <div class="kp-num">8</div>
  <div class="kp-text"><strong>Solução — Avalie o mix de habilidade e sorte:</strong> Seja realista sobre o papel da sorte. Considere o tamanho da amostra. Fique atento ao efeito halo e à reversão à média.</div>
</div>

<h2>Como Melhorar Suas Decisões Imediatamente</h2>
<p>Mauboussin oferece 7 passos práticos: <strong>1.</strong> Aumente seu nível de consciência sobre erros comuns. <strong>2.</strong> Use empatia para aprender com experiências de outros. <strong>3.</strong> Reconheça o papel da sorte. <strong>4.</strong> Solicite feedback constante. <strong>5.</strong> Desenvolva um checklist de decisão. <strong>6.</strong> Faça "premortems" — imagine que a decisão falhou e antecipe as causas. <strong>7.</strong> Reconheça que há coisas que você simplesmente não pode saber antecipadamente.</p>

<div class="highlight-box">
  "Pensar duas vezes é uma história de oportunidade. Você pode reduzir seus erros pensando com mais clareza. E pode ver e capitalizar os erros que outras pessoas cometem. O pensador mais racional sempre vence a longo prazo." — Michael Mauboussin
</div>`,

  mindmap_json: {
    center_label: 'PENSE DUAS VEZES',
    branches: [
      {
        label: 'Processo de Decisão',
        items: [
          '1. Preparar: aprender com erros passados',
          '2. Reconhecer: identificar contexto correto',
          '3. Aplicar: usar ferramentas mentais',
        ],
      },
      {
        label: 'Erros de Perspectiva',
        items: [
          'Pensar que seu problema é único',
          'Visão de túnel por âncoras mentais',
          'Confiança excessiva em especialistas',
        ],
      },
      {
        label: 'Erros Sociais e Sistêmicos',
        items: [
          'Pressão social distorce decisões',
          'Simplificação de sistemas complexos',
          'Relações causais imprecisas',
          'Ignorar pontos de virada',
        ],
      },
      {
        label: 'Habilidade vs Sorte',
        items: [
          'Superestimamos habilidade própria',
          'Minimizamos impacto da sorte',
          'Efeito halo distorce análises',
          'Reversão à média é inevitável',
        ],
      },
      {
        label: 'Ferramentas Práticas',
        items: [
          'Diário de decisões',
          'Checklist de decisão',
          'Premortem (antecipar falhas)',
          'Buscar feedback constante',
        ],
      },
    ],
  },

  insights_json: [
    {
      chapter: 'Visão Interna vs Externa',
      icon: '👁️',
      text: 'As melhores decisões vêm da semelhança, não da singularidade. Há uma riqueza de informações úteis baseadas em situações similares às nossas — ignorar isso é prejudicial.',
    },
    {
      chapter: 'Visão de Túnel',
      icon: '🔍',
      text: 'Âncoras mentais distorcem decisões sem que percebamos. Em negociações, a primeira oferta tem efeito desproporcional no resultado final — especialmente em situações ambíguas.',
    },
    {
      chapter: 'Especialistas vs Coletivos',
      icon: '🤖',
      text: 'Especialistas são bons para situações nebulosas, mas computadores são melhores quando princípios ficam claros. A sabedoria coletiva frequentemente supera o especialista individual.',
    },
    {
      chapter: 'Sistemas Complexos',
      icon: '🕸️',
      text: 'Superstars corporativos frequentemente decepcionam em novos ambientes porque seu desempenho dependia de um sistema de suporte específico — não apenas de talento individual.',
    },
    {
      chapter: 'Circunstâncias vs Atributos',
      icon: '🔄',
      text: 'Teorias de negócio baseadas em atributos ("melhores práticas") falham porque ignoram circunstâncias. O caso Boeing 787 mostra que terceirização funciona para módulos, não para sistemas complexos.',
    },
    {
      chapter: 'Habilidade e Sorte',
      icon: '🎲',
      text: 'Um teste simples: se você pode perder de propósito, há habilidade envolvida. Quando resultados são bons por sorte, prepare-se para a reversão à média.',
    },
    {
      chapter: 'Melhoria Imediata',
      icon: '✅',
      text: 'Foque no processo da decisão, não no resultado. Em ambientes probabilísticos, decisões ruins podem ter bons resultados e vice-versa. Avalie o processo, não a sorte.',
    },
  ],

  exercises_json: [
    {
      title: 'Diário de Decisões Estratégicas',
      color_theme: 'accent',
      steps: [
        'Crie um diário dedicado exclusivamente a registrar suas decisões importantes.',
        'Para cada decisão, registre: a situação, as alternativas consideradas, os incentivos em jogo e o raciocínio usado.',
        'Após 30 dias, revise suas decisões passadas e analise se você consistentemente erra para um lado ou outro.',
        'Identifique padrões: em quais situações suas decisões foram melhores (calmo vs estressado, dados abundantes vs escassos).',
        'Desenvolva um plano pessoal de melhoria baseado nos padrões identificados.',
      ],
    },
    {
      title: 'Premortem de Projeto',
      color_theme: 'green',
      steps: [
        'Escolha um projeto ou decisão importante que você está prestes a tomar.',
        'Imagine que é daqui a 1 ano e o projeto falhou completamente. Escreva pelo menos 5 possíveis causas da falha.',
        'Para cada causa, avalie a probabilidade (alta/média/baixa) e o impacto.',
        'Desenvolva pelo menos uma ação preventiva para as 3 causas mais prováveis ou de maior impacto.',
        'Compartilhe a análise com a equipe e incorpore as ações preventivas ao plano do projeto.',
      ],
    },
    {
      title: 'Checklist de Vieses Cognitivos',
      color_theme: 'orange',
      steps: [
        'Crie uma lista com os 8 erros de decisão descritos no livro (problema único, visão de túnel, confiança em especialistas, pressão social, simplificação, causalidade falsa, pontos de virada, habilidade vs sorte).',
        'Para a próxima decisão importante, passe por cada item do checklist e pergunte: "Este viés está influenciando minha decisão?"',
        'Para cada viés identificado, aplique a solução correspondente (visão externa, listar alternativas, buscar diversidade, etc.).',
        'Peça a um colega que faça a mesma análise independentemente e compare os resultados.',
        'Refine seu checklist adicionando vieses específicos do seu setor ou função.',
      ],
    },
  ],
}

// ============================================================
// Book 3: Amazon.com - Get Big Fast
// ============================================================

const book3: BookData = {
  slug: 'amazon-com-crescer-rapido',
  metadata: {
    title: 'Amazon.com: Crescer Rápido',
    original_title: 'Amazon.com: Get Big Fast — Inside the Revolutionary Business Model That Changed the World',
    author: 'Robert Spector',
    year: 2000,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 15,
    cover_gradient_from: '#ff9900',
    cover_gradient_to: '#232f3e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Em poucos anos, a <strong>Amazon.com</strong> foi de zero a US$ 2,6 bilhões em vendas, de quatro pessoas em uma garagem a mais de 7.500 funcionários. <strong>Robert Spector</strong> conta a história de como <strong>Jeff Bezos</strong> identificou uma oportunidade colossal no nascimento da Internet, abandonou um emprego de sete dígitos em Wall Street e construiu o que viria a se tornar uma das empresas mais transformadoras da história dos negócios.</p>
<p>A história da Amazon é um estudo de caso sobre <strong>visão</strong>, <strong>obsessão pelo cliente</strong>, <strong>velocidade de execução</strong> e a coragem de priorizar o crescimento de longo prazo sobre lucros de curto prazo.</p>

<div class="highlight-box">
  "Quando algo está crescendo 2.300% ao ano, você tem que se mover rápido. Um senso de urgência se torna seu ativo mais valioso." — Jeff Bezos
</div>

<h2>A Origem: De Wall Street para uma Garagem</h2>
<p>Jeff Bezos nasceu em 1964 e se formou em engenharia elétrica e administração em Princeton com nota 3.9. Em 1990, aos 26 anos, era o vice-presidente mais jovem da história do Bankers Trust. Aos 28, tornou-se o vice-presidente sênior mais jovem da D.E. Shaw, uma sofisticada firma de hedge fund.</p>
<p>Em 1993, Bezos descobriu que o uso da Web estava crescendo 2.300% ao ano. Compilou uma lista de 20 produtos para vender online e <strong>livros</strong> ficaram no topo por sete razões: indústria grande e fragmentada, canais em mudança, vantagem competitiva de catálogo enorme, política de devolução fácil, crescimento do mail order, pouca concorrência online e o fato de que todos sabem o que é um livro.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>A decisão de empreender:</strong> Bezos usou o "teste do arrependimento" — aos 80 anos, não se arrependeria de ter tentado e falhado, mas se arrependeria de não ter participado dessa coisa chamada Internet.</div>
</div>

<h2>Construindo na Garagem</h2>
<p>Em julho de 1994, Bezos incorporou a Cadabra Inc. (renomeada para Amazon.com em 1995). Mudou-se para Seattle por três motivos: pool de talento técnico, estado com pouca população (menos imposto sobre vendas) e proximidade com distribuidores de livros.</p>
<p>Com apenas dois programadores, a equipe construiu toda a infraestrutura: banco de dados de um milhão de títulos, sistema de back office, base de clientes e armazenamento seguro de dados de cartão de crédito. O financiamento veio da família Bezos: US$ 10.000 em ações, US$ 44.000 em empréstimo e US$ 100.000 do pai.</p>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Mentalidade desde o dia 1:</strong> Bezos insistia que tudo fosse feito certo, pensando no crescimento futuro. Ele queria um modelo de negócio que funcionasse para a Amazon, não algo emprestado de outro software.</div>
</div>

<h2>O Lançamento e o Crescimento Explosivo</h2>
<p>A Amazon.com foi lançada em 16 de julho de 1995. Na primeira semana, recebeu US$ 12.438 em pedidos. Três dias após o lançamento, o Yahoo! perguntou se poderia incluir o site na lista "What's Cool". No primeiro mês, enviou pedidos para todos os 50 estados e 45 países.</p>
<p>Em outubro, registrou seu primeiro dia de 100 pedidos. Menos de um ano depois, chegou a 100 pedidos por hora. O primeiro ano completo (1996) fechou com US$ 15,7 milhões em vendas — contra uma projeção de US$ 6 milhões.</p>

<div class="highlight-box">
  "Nosso plano de negócios nem sequer começa a se parecer com o que realmente aconteceu." — Jeff Bezos
</div>

<h2>Obsessão pelo Cliente</h2>
<p>Bezos fez do atendimento ao cliente a prioridade número um. As três coisas que mais importam para o cliente online: <strong>seleção</strong>, <strong>conveniência</strong> e <strong>preço</strong>. A Amazon implementou:</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>1-Click Shopping:</strong> Compra com um clique. Recomendações personalizadas. Centro de filtro colaborativo. Programa de associados (5-15% de comissão). Política de devolução de 30 dias sem perguntas.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Cultura de frugalidade:</strong> Bezos construiu sua mesa com uma porta barata e quatro pernas de madeira — símbolo que persiste até hoje. "Gastamos dinheiro em coisas que importam para os clientes, não em nós mesmos."</div>
</div>

<h2>Get Big Fast: O IPO e a Expansão</h2>
<p>Em 1996, a Kleiner Perkins investiu US$ 8 milhões por 13% da empresa, avaliando-a em US$ 60 milhões. O mantra tornou-se <strong>"Get Big Fast"</strong> — estampado nas camisetas dos funcionários.</p>
<p>O IPO aconteceu em 15 de maio de 1997 a US$ 18 por ação. Ao final de 1997, as ações estavam em US$ 52 — e Bezos valia mais de US$ 500 milhões. As vendas de 1997 foram de US$ 147,8 milhões — crescimento de 838%.</p>
<p>Em 1998, a Amazon expandiu para vídeos, música, brinquedos e eletrônicos. Adquiriu empresas como Internet Movie Database, PlanetAll e Junglee. As vendas atingiram US$ 610 milhões, com 6,2 milhões de clientes. Ao final de 1998, as ações (pré-split) equivaliam a US$ 535 cada.</p>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>A filosofia de longo prazo:</strong> "Market share agora equivale a receita depois." Bezos aceitava perder dinheiro deliberadamente para construir escala, marca e base de clientes — apostando que os custos fixos altos seriam diluídos pelo volume.</div>
</div>

<h2>O Legado</h2>
<p>A Amazon.com mudou para sempre a forma como os negócios são feitos. Sua marca é reconhecida por mais de 52% dos adultos americanos. Como disse Bezos: <strong>"Não estamos tentando ser uma empresa de livros ou de música — estamos tentando ser uma empresa de clientes."</strong></p>

<div class="highlight-box">
  "Work Hard, Have Fun, and Make History." — O lema da Amazon.com
</div>`,

  mindmap_json: {
    center_label: 'AMAZON.COM: CRESCER RÁPIDO',
    branches: [
      {
        label: 'Jeff Bezos',
        items: [
          'Princeton (engenharia + administração)',
          'VP mais jovem do Bankers Trust (26 anos)',
          'Teste do arrependimento aos 80 anos',
          'Identifica Web crescendo 2.300%/ano',
        ],
      },
      {
        label: 'Por Que Livros',
        items: [
          'Indústria grande e fragmentada',
          'Catálogo online ilimitado vs loja física',
          'Todos sabem o que é um livro',
          'Fácil devolução e mail order crescente',
        ],
      },
      {
        label: 'Obsessão pelo Cliente',
        items: [
          'Seleção, conveniência e preço',
          '1-Click Shopping',
          'Recomendações personalizadas',
          'Devolução de 30 dias sem perguntas',
          'Programa de associados (5-15%)',
        ],
      },
      {
        label: 'Get Big Fast',
        items: [
          'Kleiner Perkins: US$8M por 13%',
          'IPO em maio/1997 a US$18/ação',
          'Market share agora = receita depois',
          'Perder dinheiro para construir escala',
        ],
      },
      {
        label: 'Expansão',
        items: [
          'Vídeos, música, brinquedos, eletrônicos',
          'Amazon.co.uk e Amazon.co.de',
          'Aquisições: IMDB, PlanetAll, Junglee',
          'US$610M em vendas em 1998',
        ],
      },
      {
        label: 'Cultura e Valores',
        items: [
          'Mesas de porta barata (frugalidade)',
          'Contratar os melhores (sem exceção)',
          'Work Hard, Have Fun, Make History',
          'Empresa de clientes, não de produtos',
        ],
      },
    ],
  },

  insights_json: [
    {
      chapter: 'A Decisão de Empreender',
      icon: '🎯',
      text: 'Use o "teste do arrependimento": aos 80 anos, você se arrependeria mais de ter tentado e falhado ou de nunca ter tentado? Bezos escolheu correr o risco — e isso fez toda a diferença.',
    },
    {
      chapter: 'A Construção',
      icon: '🏗️',
      text: 'Bezos contratava os melhores e mais inteligentes, independentemente de experiência prévia. Acreditava que em um mundo com tecnologia, capital e empreendedores abundantes, o recurso escasso são grandes equipes.',
    },
    {
      chapter: 'Obsessão pelo Cliente',
      icon: '👤',
      text: '"Nossos clientes são leais até o segundo em que alguém oferece um serviço melhor." Por isso a obsessão era com clientes, não com concorrentes — aprender com eles sim, mas nunca obcecar por eles.',
    },
    {
      chapter: 'Get Big Fast',
      icon: '📈',
      text: 'A Amazon escolheu deliberadamente crescer rápido sacrificando lucros de curto prazo. A lógica: custos fixos altos de venda online são amortizados sobre mais clientes, criando vantagem de escala impossível de alcançar depois.',
    },
    {
      chapter: 'Cultura Corporativa',
      icon: '🪑',
      text: 'A cultura corporativa é 30% intencional, 30% definida pelos primeiros funcionários e 40% acaso. Uma vez estabelecida, não muda. Por isso Bezos foi tão intencional desde o primeiro dia.',
    },
    {
      chapter: 'Visão de Longo Prazo',
      icon: '🔭',
      text: '"Lucros são como sangue — necessários para viver, mas não a razão de existir." A Amazon nunca fez projeções externas de lucratividade, focando em construir algo que o mundo nunca tinha visto.',
    },
  ],

  exercises_json: [
    {
      title: 'O Teste do Arrependimento',
      color_theme: 'accent',
      steps: [
        'Identifique uma oportunidade que você vem adiando por medo ou conforto.',
        'Imagine-se aos 80 anos olhando para trás. Escreva: do que você se arrependeria mais — de ter tentado e falhado, ou de nunca ter tentado?',
        'Liste os 3 maiores riscos de agir agora e os 3 maiores custos de não agir.',
        'Para cada risco, desenvolva uma estratégia de mitigação realista.',
        'Defina uma data limite (máximo 30 dias) para tomar uma decisão e comunicá-la a alguém de confiança.',
      ],
    },
    {
      title: 'Auditoria de Obsessão pelo Cliente',
      color_theme: 'green',
      steps: [
        'Liste as 3 coisas que mais importam para seus clientes (inspirado em Bezos: seleção, conveniência e preço).',
        'Para cada uma, avalie honestamente de 1 a 10 como sua empresa/produto entrega valor.',
        'Identifique o item com menor nota e liste 5 ações concretas para melhorar nos próximos 60 dias.',
        'Implemente um canal de feedback direto (e-mail, formulário) e leia pessoalmente as primeiras 50 respostas.',
        'Comprometa-se a gastar dinheiro apenas em coisas que importam para o cliente — identifique um gasto interno que pode ser cortado e redirecionado.',
      ],
    },
    {
      title: 'Plano Get Big Fast',
      color_theme: 'orange',
      steps: [
        'Defina qual métrica é o equivalente a "market share" no seu negócio (usuários, downloads, contratos, etc.).',
        'Calcule quanto custaria crescer 3x nessa métrica nos próximos 12 meses.',
        'Identifique quais investimentos de curto prazo (marketing, produto, equipe) teriam maior impacto no crescimento.',
        'Analise o trade-off: quanto de lucratividade de curto prazo você estaria disposto a sacrificar pelo crescimento?',
        'Crie um plano de 90 dias focado exclusivamente em crescimento acelerado da métrica escolhida.',
      ],
    },
  ],
}

// ============================================================
// Book 4: NIKE - A História Não Autorizada
// ============================================================

const book4: BookData = {
  slug: 'nike-a-historia',
  metadata: {
    title: 'Nike: A História Não Autorizada',
    original_title: 'NIKE: The Unauthorized Story of the Men Who Played There',
    author: 'Julie Strasser e Laurie Becklund',
    year: 1991,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 16,
    cover_gradient_from: '#111111',
    cover_gradient_to: '#f57c00',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A história da <strong>Nike</strong> é uma das mais fascinantes do empreendedorismo americano. De uma parceria informal entre um corredor e seu treinador — com US$ 500 cada um e um aperto de mão — nasceu uma empresa que revolucionou a indústria de calçados esportivos e se tornou um ícone cultural global. <strong>Julie Strasser</strong> e <strong>Laurie Becklund</strong> contam essa jornada turbulenta, divertida e instrutiva.</p>

<div class="highlight-box">
  De US$ 1.107 no primeiro pedido de 300 pares de tênis em 1964 a uma empresa pública de US$ 3 bilhões em faturamento. A Nike prova que paixão, persistência e uma pitada de loucura podem mudar o mundo.
</div>

<h2>Os Anos Tiger (1964-1971)</h2>
<p><strong>Phil Knight</strong>, apelidado de "Buck", era corredor na Universidade de Oregon sob o lendário treinador <strong>Bill Bowerman</strong>. Em Stanford, Knight escreveu um trabalho sobre como os japoneses poderiam fazer com tênis o que fizeram com câmeras — produzir qualidade rivalizando a Adidas por metade do preço.</p>
<p>Em 1962, Knight visitou o Japão e conheceu a Onitsuka Co., fabricante dos tênis Tiger. Apresentou-se como importador americano e, quando perguntaram o nome da empresa, respondeu <strong>"Blue Ribbon Sports"</strong> — o primeiro nome que veio à cabeça.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>A parceria fundadora:</strong> Knight e Bowerman formaram a Blue Ribbon Sports com US$ 500 cada, sem contratos, sem advogados, sem planos de negócio — apenas um aperto de mão e paixão por tênis de corrida.</div>
</div>

<p>O primeiro pedido foi de 300 pares a US$ 3,69 cada, vendidos a US$ 6,95. <strong>Jeff Johnson</strong>, o primeiro funcionário, vendeu 13 pares no primeiro dia numa corrida de rua. No primeiro ano, as vendas foram de US$ 20.000, dobrando a cada ano seguinte.</p>
<p>A Blue Ribbon era caótica: Knight trabalhava como contador de dia e vendia tênis à noite. Inventários eram inexistentes. Despesas iam no cartão de crédito de quem ainda tivesse limite. Mas o produto era bom e a paixão era real.</p>

<h2>Transição (1972-1976)</h2>
<p>Quando a Onitsuka ameaçou romper o contrato de exclusividade, Knight e Bowerman decidiram criar sua própria marca. Uma estudante de arte criou um logo que parecia uma marca de verificação — o famoso <strong>Swoosh</strong>. Jeff Johnson sugeriu o nome <strong>"Nike"</strong>, a deusa grega alada da vitória.</p>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>A sola waffle:</strong> Bowerman estava olhando para a máquina de waffles da esposa quando teve uma ideia: e se espigos quadrados fossem bons para tração? Após 3 tentativas (e uma máquina de waffles destruída), nasceu a lendária sola waffle da Nike.</div>
</div>

<p>Em 1972, a Blue Ribbon vendeu 250.000 pares de Nike e 50.000 botas de basquete, mesmo com caos na cadeia de suprimentos. A trading japonesa <strong>Nissho Iwai</strong> tornou-se a parceira financeira crucial, salvando a empresa da falência quando o banco congelou suas contas em 1974.</p>
<p>Knight criou o programa de futuros — descontos de 5-7% para varejistas que encomendassem com 6 meses de antecedência — gerando previsibilidade. As vendas saltaram para US$ 14 milhões em 1976.</p>

<h2>Os Anos Privados (1977-1980)</h2>
<p>De 1977 a 1980, a Nike foi de US$ 28 milhões a US$ 240 milhões. A empresa surfou a onda do boom da corrida — quase metade dos adultos americanos experimentaram o jogging. A estratégia era simples: <strong>usar endossos para criar e explorar a vantagem mental que existe em cada esporte</strong>.</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>As reuniões Buttface:</strong> A cada 6 meses, o grupo de gestão da Nike se reunia para reuniões barulhentas e irreverentes, onde ideias eram vaiadas ou aplaudidas com fervor. Jogavam videogame durante apresentações e bebiam tequila em jarras d'água.</div>
</div>

<p>Em 1978, a empresa foi rebatizada oficialmente para <strong>Nike Inc</strong>. Frank Rudy apresentou a ideia do <strong>solado a ar</strong> — uma almofada de ar para amortecer o impacto. O primeiro modelo, o Tailwind, custava US$ 50 (recorde na época), mas a primeira leva teve problemas de qualidade.</p>
<p>Em 1980, com US$ 270 milhões em vendas, a Nike abriu capital na Bolsa de Nova York a US$ 22 por ação. Phil Knight passou a valer US$ 178 milhões. Investidores originais de 1972 viram US$ 1 investido valer US$ 600.</p>

<h2>Os Anos Públicos (1981-1990)</h2>
<p>Em 1981, a Nike tinha US$ 458 milhões em receita, 140 modelos de tênis e 2.700 funcionários. Mas em 1983, pela primeira vez na história, as receitas ficaram estagnadas. A Reebok surgiu surfando a febre do aeróbico.</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Michael Jordan mudou tudo:</strong> A Nike superou Adidas e Converse para assinar com o novato da NBA por US$ 2,5 milhões em 5 anos, criando a linha Air Jordan. Mais de US$ 100 milhões em vendas em 1985 — o endosso atlético mais bem-sucedido da história comercial.</div>
</div>

<p>O contrato com Jordan chegou no momento perfeito: as ações da Nike haviam caído de US$ 23 para US$ 6,60. O Air Jordan literalmente salvou a empresa.</p>
<p>Em 1985, a Nike também desenvolveu o <strong>Nike Air</strong> (solado com bolsa de ar visível) e o primeiro <strong>tênis de cross-training</strong>, endossado por <strong>Bo Jackson</strong>. Em 1987, a linha Nike Air transformou completamente a empresa, registrando os maiores lucros trimestrais da história.</p>

<div class="highlight-box">
  A Nike completou sua transição de uma empresa tipo "Animal House" para uma corporação de US$ 3 bilhões gerida profissionalmente — mas nunca perdeu o espírito irreverente dos Buttfaces que a fundaram.
</div>`,

  mindmap_json: {
    center_label: 'NIKE: A HISTÓRIA',
    branches: [
      {
        label: 'Anos Tiger (1964-71)',
        items: [
          'Phil Knight + Bill Bowerman = Blue Ribbon',
          'US$500 cada, aperto de mão',
          'Importação de tênis Tiger do Japão',
          'Vendas dobravam a cada ano',
        ],
      },
      {
        label: 'Transição (1972-76)',
        items: [
          'Criação do Swoosh e nome Nike',
          'Sola waffle da máquina da esposa',
          'Nissho Iwai salva empresa da falência',
          'Programa de futuros (desconto 5-7%)',
        ],
      },
      {
        label: 'Crescimento (1977-80)',
        items: [
          'Boom da corrida nos EUA',
          'Reuniões Buttface irreverentes',
          'Solado a ar (Frank Rudy)',
          'IPO em 1980: US$22/ação',
        ],
      },
      {
        label: 'Michael Jordan',
        items: [
          'Contrato de US$2,5M em 5 anos',
          'Linha Air Jordan: US$100M em vendas',
          'Salvou Nike da crise de 1983-84',
          'Endosso mais bem-sucedido da história',
        ],
      },
      {
        label: 'Inovação de Produto',
        items: [
          'Sola waffle (Bowerman)',
          'Nike Air (bolsa de ar visível)',
          'Cross-training (Bo Jackson)',
          'Maximum Air (corrida longa)',
        ],
      },
      {
        label: 'Cultura e Valores',
        items: [
          'Atletas fazendo tênis para atletas',
          'Caos criativo e paixão',
          'Grass roots marketing',
          'De US$1.107 a US$3 bilhões',
        ],
      },
    ],
  },

  insights_json: [
    {
      chapter: 'Os Anos Tiger',
      icon: '🤝',
      text: 'A Nike nasceu de um aperto de mão entre um corredor e seu treinador. Sem planos de negócio, sem advogados, sem contratos formais — apenas paixão compartilhada e US$ 500 cada.',
    },
    {
      chapter: 'Transição',
      icon: '💡',
      text: 'A inovação mais icônica da Nike — a sola waffle — nasceu de Bowerman olhando para a máquina de waffles da esposa. As melhores ideias frequentemente vêm de observações cotidianas.',
    },
    {
      chapter: 'Sobrevivência Financeira',
      icon: '💰',
      text: 'A Blue Ribbon quase faliu várias vezes por problemas de fluxo de caixa. O programa de futuros (descontos para pedidos antecipados) resolveu o problema de previsibilidade e financiamento.',
    },
    {
      chapter: 'Michael Jordan',
      icon: '🏀',
      text: 'O contrato com Michael Jordan — US$ 2,5 milhões por 5 anos — é considerado o endosso atlético mais bem-sucedido da história comercial, gerando mais de US$ 100 milhões em vendas no primeiro ano.',
    },
    {
      chapter: 'Cultura Corporativa',
      icon: '🎉',
      text: 'As reuniões Buttface eram o oposto de qualquer reunião corporativa. Ideias vaiadas, videogames durante apresentações, tequila em jarras. Essa irreverência era o combustível criativo da Nike.',
    },
    {
      chapter: 'Endossos e Marketing',
      icon: '👟',
      text: 'A Nike foi a primeira empresa de calçados a ir atrás de times de basquete universitário, enquanto Converse e Adidas brigavam pelos jogadores da NBA. Pensar diferente criou vantagem competitiva.',
    },
  ],

  exercises_json: [
    {
      title: 'O Aperto de Mão Fundador',
      color_theme: 'accent',
      steps: [
        'Identifique uma pessoa com habilidades complementares às suas que compartilhe uma paixão em comum.',
        'Convide-a para uma conversa informal sobre uma oportunidade que ambos enxergam no mercado.',
        'Juntos, definam um "experimento mínimo" — algo que possam testar com investimento mínimo (como os US$ 500 de Knight e Bowerman).',
        'Estabeleçam papéis claros: quem cuida do produto e quem cuida do negócio.',
        'Definam um prazo de 90 dias para avaliar os primeiros resultados e decidir se continuam.',
      ],
    },
    {
      title: 'Encontre Sua Sola Waffle',
      color_theme: 'green',
      steps: [
        'Passe 1 dia observando objetos e processos do seu cotidiano com "olhos de inventor" — como Bowerman olhou para a máquina de waffles.',
        'Anote pelo menos 10 observações do tipo "e se aplicássemos esse princípio ao nosso produto/serviço?"',
        'Selecione as 3 ideias mais promissoras e faça um protótipo rápido (pode ser em papel, mockup digital ou modelo físico).',
        'Teste cada protótipo com 5 potenciais usuários e colete feedback.',
        'Itere no mais promissor e apresente à equipe com dados de validação.',
      ],
    },
    {
      title: 'Programa de Futuros para Seu Negócio',
      color_theme: 'orange',
      steps: [
        'Analise seu ciclo de vendas atual e identifique qual é o tempo médio entre pedido e entrega.',
        'Crie uma proposta de "desconto por antecipação" — ofereça 5-7% de desconto para clientes que se comprometam com pedidos com 3-6 meses de antecedência.',
        'Calcule o impacto financeiro: quanto de fluxo de caixa e previsibilidade isso geraria?',
        'Teste com seus 5 melhores clientes e meça a aceitação.',
        'Use os dados de pedidos antecipados para negociar melhores condições com fornecedores.',
      ],
    },
  ],
}

// ============================================================
// Book 5: Must-Win Battles
// ============================================================

const book5: BookData = {
  slug: 'batalhas-que-voce-precisa-vencer',
  metadata: {
    title: 'Batalhas que Você Precisa Vencer',
    original_title: 'Must-Win Battles: How to Win Them, Again and Again',
    author: 'Peter Killing, Thomas Malnight e Tracey Keys',
    year: 2006,
    category_slug: 'lideranca',
    category_label: 'Liderança e Gestão',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1b4332',
    cover_gradient_to: '#40916c',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p><strong>Batalhas que você precisa vencer (MWBs)</strong> são as três a cinco batalhas-chave que sua organização deve vencer no mercado para atingir suas metas de receita, lucro e outros objetivos de negócio. Diferente das inúmeras batalhas que seriam "bom vencer", estas são fundamentais para manter e renovar regularmente a vantagem competitiva da sua organização.</p>
<p><strong>Peter Killing</strong>, <strong>Thomas Malnight</strong> e <strong>Tracey Keys</strong> apresentam uma jornada estruturada em três fases para identificar, selecionar e vencer essas batalhas — combinando elementos intelectuais (escolher as batalhas certas) e emocionais (construir uma equipe eficaz).</p>

<div class="highlight-box">
  "Se você construir seus principais jogadores em uma equipe real, terá uma vantagem competitiva muito difícil para os concorrentes igualarem. Sua equipe, operando como equipe, deve ser capaz de implementar novas iniciativas mais rapidamente e com mais força que os concorrentes."
</div>

<h2>Fase 1: Preparar</h2>
<p>Antes de iniciar a jornada, é preciso preparar a equipe de liderança e a organização, estabelecendo uma base sólida:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Entenda o que são MWBs:</strong> Devem fazer diferença tangível nos objetivos, ser focadas no mercado (não internas), ser empolgantes e desafiadoras, ser específicas e mensuráveis, e ser vencíveis com um esforço extra. Prazo máximo: 2 anos.</div>
</div>

<p>Avalie quatro condições iniciais: <strong>1.</strong> Qual é a perspectiva operacional atual? (crise ou confiança?) <strong>2.</strong> A saúde da equipe de gestão? (alta performance, indivíduos ou disfuncional?) <strong>3.</strong> As prioridades estratégicas são apropriadas? (baseadas em fatos ou personalidades?) <strong>4.</strong> Qual a saúde geral da organização?</p>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>O líder certo é essencial:</strong> Deve ser capaz de "possuir" a jornada, fazer escolhas difíceis e ser um construtor de equipes. Quatro estilos de liderança: Comandante (decisivo), Diplomata (consenso), Pensador (dados) e Motivador (otimista).</div>
</div>

<h2>Fase 2: Construir a Equipe</h2>
<p>O evento de kick-off é o coração desta fase — uma reunião de aproximadamente uma semana, fora do escritório, com 10 a 40 gestores. São três clusters de atividades:</p>

<h3>Abrir Janelas</h3>
<p>Injetar pensamento fresco na organização. Três abordagens: <strong>1.</strong> Coloque tudo na mesa — esqueletos corporativos e segredos. <strong>2.</strong> Crie transparência total — compartilhe todos os dados. <strong>3.</strong> Gere perspectivas compartilhadas — cada um vê o negócio pelos olhos dos outros.</p>

<h3>Definir as MWBs</h3>
<p>Gere uma lista longa de batalhas potenciais, depois reduza para 3 a 5 através de checagens de realidade:</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>5 perguntas-chave:</strong> Esta batalha é significativa? É vencível? Como o sucesso será medido? Quais obstáculos devem ser superados? Como os stakeholders reagiriam?</div>
</div>

<p>Após a lista preliminar, divida os participantes em "crentes" e "cínicos" para testar cada MWB. Depois troque os papéis. Só finalize quando todos estiverem genuinamente a bordo.</p>

<h3>Comprometer-se com Uma Agenda</h3>
<p>Atribua um "dono" para cada MWB. Cada dono forma sua equipe e desenvolve um plano de ação com: definição de sucesso, desafios externos e internos, e primeiros passos. Defina regras de equipe e comportamentos aceitáveis.</p>

<div class="highlight-box">
  "Criar uma lista curta de MWBs é um processo tanto emocional quanto intelectual. As MWBs receberão a maior parte dos recursos, outras coisas terão que ser cortadas. Isso significa que haverá vencedores e perdedores na equipe de gestão."
</div>

<h2>Fase 3: Engajar a Organização</h2>
<p>Sem cuidado, em duas ou três semanas a pressão do dia a dia pode fazer parecer que o kick-off nunca aconteceu. Para evitar isso:</p>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Incorpore a agenda MWB:</strong> Comunique a todos, ajude as pessoas a construírem seus próprios planos de ação, institucionalize as MWBs nos processos formais (orçamento, planejamento, recompensas) e libere tempo e recursos eliminando itens menos relevantes.</div>
</div>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Alinhe a organização:</strong> A equipe de liderança deve tornar seu compromisso visível. As MWBs devem cascatear pelas unidades organizacionais. A equipe corporativa deve atuar como facilitadora, criando conexões e reportando progresso.</div>
</div>

<h2>As 8 Lições-Chave</h2>
<p><strong>1.</strong> O kick-off é apenas o ponto de partida. <strong>2.</strong> MWBs bem escolhidas criam excitação organizacional. <strong>3.</strong> Equilibre incentivos e sanções. <strong>4.</strong> Amplie o grupo de líderes da jornada. <strong>5.</strong> Nunca trate como solução rápida — requer persistência e disciplina. <strong>6.</strong> Evite MWBs superficiais que permitam agendas pessoais. <strong>7.</strong> Não perca momentum — os primeiros 45 dias são cruciais. <strong>8.</strong> Não se torne excessivamente confiante com os primeiros sucessos.</p>

<div class="highlight-box">
  "Como líder, seu trabalho mais importante é pegar aquele grupo de pessoas no topo e transformá-los em uma equipe. A jornada MWB é uma ferramenta para construir essa equipe, mas a chave é liderar simultaneamente uma jornada intelectual e emocional."
</div>`,

  mindmap_json: {
    center_label: 'BATALHAS QUE VOCÊ PRECISA VENCER',
    branches: [
      {
        label: 'O que são MWBs',
        items: [
          '3 a 5 batalhas-chave no mercado',
          'Tangíveis, mensuráveis, vencíveis',
          'Focadas no mercado (não internas)',
          'Prazo máximo de 2 anos',
        ],
      },
      {
        label: 'Fase 1: Preparar',
        items: [
          'Avaliar condições iniciais',
          'Saúde da equipe de gestão',
          'Prioridades estratégicas adequadas?',
          'Escolher o líder certo',
        ],
      },
      {
        label: 'Fase 2: Construir Equipe',
        items: [
          'Kick-off de ~1 semana fora do escritório',
          'Abrir janelas: transparência total',
          'Definir 3-5 MWBs (crentes vs cínicos)',
          'Comprometer-se com uma agenda',
        ],
      },
      {
        label: 'Fase 3: Engajar',
        items: [
          'Incorporar MWBs nos processos formais',
          'Cascatear pelas unidades organizacionais',
          'Primeiros 45 dias são cruciais',
          'Revisão a cada 6 meses',
        ],
      },
      {
        label: '8 Lições-Chave',
        items: [
          'Kick-off é apenas o início',
          'Equilibre incentivos e sanções',
          'Nunca trate como solução rápida',
          'Não perca momentum',
        ],
      },
      {
        label: 'Liderança',
        items: [
          'Possuir a jornada com credibilidade',
          'Fazer escolhas difíceis',
          'Construir equipe — o principal trabalho',
          'Jornada intelectual e emocional',
        ],
      },
    ],
  },

  insights_json: [
    {
      chapter: 'Conceito de MWBs',
      icon: '⚔️',
      text: 'Focar em must-win battles evita a síndrome do "sabor do mês" — onde uma teoria de gestão é adotada brevemente e depois abandonada pela próxima. MWBs dão continuidade e foco.',
    },
    {
      chapter: 'Fase 1: Preparar',
      icon: '🔍',
      text: 'Nenhuma jornada MWB é igual. Cada empresa parte de um ponto diferente. Entender as condições iniciais — saúde financeira, coesão da equipe, prioridades — é fundamental antes de agir.',
    },
    {
      chapter: 'Fase 2: O Kick-Off',
      icon: '🚀',
      text: 'A técnica crentes vs cínicos para testar MWBs é poderosa: atribua metade do grupo para defender e metade para atacar cada batalha. Depois troque os papéis. O resultado é uma validação robusta.',
    },
    {
      chapter: 'Fase 3: Engajamento',
      icon: '⏱️',
      text: 'Os primeiros 45 dias após o kick-off são a janela de oportunidade. Perca essa janela e o que restará será cinismo, ceticismo e fracasso contínuo.',
    },
    {
      chapter: 'Liderança',
      icon: '👑',
      text: 'O trabalho mais importante do líder é transformar o grupo de pessoas no topo em uma equipe real. Essa equipe funcionando como time é a vantagem competitiva sustentável mais difícil de copiar.',
    },
    {
      chapter: 'Os Últimos 10%',
      icon: '💯',
      text: 'Grande parte do sucesso está em "ir os últimos 10%" — fazer aquela última ligação, ter a conversa difícil pessoalmente. Não mande e-mail. Não delegue. Tudo o que o líder faz é amplificado mil vezes.',
    },
  ],

  exercises_json: [
    {
      title: 'Identifique Suas Must-Win Battles',
      color_theme: 'accent',
      steps: [
        'Reúna sua equipe e faça um brainstorm de todas as batalhas que sua empresa poderia travar no mercado nos próximos 12-24 meses.',
        'Para cada batalha, aplique o teste das 5 perguntas: É significativa? É vencível? Como medir sucesso? Quais obstáculos? Como stakeholders reagiriam?',
        'Reduza a lista para no máximo 5 batalhas. Se precisar de mais, suas MWBs não são específicas o suficiente.',
        'Divida a equipe em "crentes" e "cínicos" — debata cada MWB e depois troque os papéis.',
        'Finalize com um teste de comprometimento: peça a cada pessoa que avalie honestamente (1-10) sua confiança na vitória, individual e coletivamente.',
      ],
    },
    {
      title: 'Plano dos Primeiros 45 Dias',
      color_theme: 'green',
      steps: [
        'Imediatamente após definir suas MWBs, atribua um "dono" para cada uma.',
        'Cada dono tem 1 semana para montar sua equipe e apresentar um plano com: definição de sucesso, desafios e primeiros 3 passos.',
        'Na semana 2, comunique as MWBs para toda a organização com uma mensagem clara e inspiradora.',
        'Nas semanas 3-4, cada unidade organizacional deve criar seu próprio mini-plano mostrando como contribuirá.',
        'Na semana 6, faça a primeira revisão formal de progresso e ajuste o que for necessário.',
      ],
    },
    {
      title: 'Sessão "Abrir Janelas"',
      color_theme: 'orange',
      steps: [
        'Reserve 3 horas com sua equipe de liderança em um local fora do escritório.',
        'Comece com a pergunta: "Quais são os mitos e tabus da nossa organização e como eles nos limitam?"',
        'Peça que cada pessoa escreva anonimamente 2 "verdades inconvenientes" sobre a empresa.',
        'Discuta abertamente os resultados — sem atribuir culpa, focando em entendimento compartilhado.',
        'Encerre com a pergunta: "Onde queremos estar daqui a 2 anos?" e construa uma visão compartilhada.',
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
  console.log('  RESUMOX — Inserting 5 New Books (Batch 3)')
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
