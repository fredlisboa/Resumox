#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content
 * Books: Start With No, Seven Years to Seven Figures, Sacred Cows Make the Best Burgers, Power Thinking, Powerful Conversations
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
// Book 1: Start With No
// ============================================================

const book1: BookData = {
  slug: 'comece-pelo-nao',
  metadata: {
    title: 'Comece Pelo Não',
    original_title: 'Start With No: The Negotiating Tools That The Pros Don\'t Want You To Know',
    author: 'Jim Camp',
    year: 2002,
    category_slug: 'negocios',
    category_label: 'Estratégia de Negócios',
    category_emoji: '🎯',
    reading_time_min: 13,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A maioria das pessoas entra em uma negociação com medo de ouvir "não". <strong>Jim Camp</strong> propõe o oposto radical: comece pelo "não". Esqueça a abordagem baseada em emoções e "ganha-ganha" superficial. Uma negociação verdadeiramente eficaz começa quando você dá ao outro lado o direito de dizer "não" — e quando você mesmo está disposto a aceitar essa resposta. Essa liberdade cria um ambiente de respeito mútuo, onde decisões reais podem ser tomadas sem pressão ou manipulação.</p>
<p>O sistema Camp de negociação é construído sobre <strong>princípios baseados em decisões</strong>, não em emoções. Enquanto a abordagem "ganha-ganha" tradicional frequentemente leva a compromissos desnecessários, o método Camp ensina você a manter o controle emocional, focar na missão e permitir que o outro lado tome decisões informadas — o que, paradoxalmente, leva a resultados muito melhores para ambos os lados.</p>

<div class="highlight-box">
  "As melhores negociações são aquelas em que ambas as partes sentem que podem dizer 'não' a qualquer momento. Quando essa liberdade existe, as pessoas tomam decisões melhores."
</div>

<h2>Por Que "Ganha-Ganha" Pode Ser uma Armadilha</h2>
<p>Camp argumenta que a filosofia <strong>"ganha-ganha"</strong> tem uma falha fundamental: ela encoraja compromissos prematuros. Quando ambos os lados estão desesperados para chegar a um acordo, cedem cedo demais e acabam com resultados medíocres. A necessidade de agradar — o que Camp chama de <strong>"neediness"</strong> — é o maior inimigo de um negociador.</p>
<p>Quando você demonstra necessidade, o outro lado percebe e explora isso. Vendedores que baixam preços antes mesmo de serem pedidos, executivos que aceitam termos desfavoráveis para "fechar logo" — todos são vítimas da neediness. O antídoto? Estar genuinamente disposto a ir embora.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Elimine a necessidade:</strong> Nunca demonstre desespero para fechar um acordo. A pessoa mais disposta a ir embora tem mais poder na negociação.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Rejeite compromissos prematuros:</strong> Um acordo medíocre não é uma vitória. É melhor não ter acordo do que ter um acordo ruim.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Dê permissão para o "não":</strong> Quando o outro lado sabe que pode recusar, relaxa e toma decisões mais racionais e produtivas.</div>
</div>

<h2>O Sistema Camp de Negociação</h2>
<h3>Missão e Propósito</h3>
<p>Toda negociação eficaz começa com uma <strong>missão clara</strong>. Não um objetivo vago como "fechar o negócio", mas uma missão que descreve o que você quer alcançar para o outro lado. Camp enfatiza que sua missão deve ser centrada no <strong>mundo do adversário</strong> — nas necessidades, dores e desejos dele — não nos seus.</p>
<p>Uma boa missão de negociação responde: "Como posso ajudar o outro lado a resolver o problema dele?" Quando você foca nisso, a dinâmica muda completamente. Você deixa de ser um vendedor e se torna um <strong>solucionador de problemas</strong>.</p>

<h3>Controle Emocional</h3>
<p>O sistema Camp exige que você nunca tome decisões baseadas em emoções durante uma negociação. <strong>Medo, ansiedade, euforia e raiva</strong> são todos inimigos do bom negociador. A chave é reconhecer essas emoções quando surgem e se disciplinar para não agir impulsivamente.</p>

<div class="highlight-box">
  "Em uma negociação, as decisões devem ser tomadas com a cabeça fria. A emoção é o maior sabotador de qualquer acordo."
</div>

<h3>Perguntas Abertas e Escuta Ativa</h3>
<p>A ferramenta mais poderosa de um negociador não é a fala — é a <strong>pergunta</strong>. Camp ensina que perguntas abertas que começam com "como", "o que" e "por que" são infinitamente mais eficazes do que declarações ou propostas. Ao fazer perguntas, você permite que o outro lado revele suas reais necessidades, medos e prioridades.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>A regra das perguntas:</strong> Em vez de dizer "Nosso preço é X", pergunte "O que seria mais valioso para você neste acordo?" Quem pergunta controla a conversa.</div>
</div>

<h2>Os Pilares da Negociação Baseada em Decisões</h2>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Sem necessidade:</strong> Sua postura deve comunicar que você está ali para ajudar, não que precisa desesperadamente do acordo.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Missão centrada no adversário:</strong> Foque no mundo do outro lado — suas dores, medos, objetivos e prioridades.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Perguntas, não declarações:</strong> Use perguntas abertas para descobrir o que realmente importa para a outra parte.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Controle emocional:</strong> Nunca permita que emoções ditem suas decisões durante uma negociação.</div>
</div>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Orçamento de tempo e energia:</strong> Defina limites claros para quanto tempo e recursos você investirá em cada negociação.</div>
</div>

<h2>O Poder do "Não"</h2>
<p>O "não" não é o fim de uma negociação — é o <strong>começo</strong>. Quando alguém diz "não", está comunicando algo valioso: seus limites, suas prioridades, seus medos. Um negociador habilidoso usa o "não" como ponto de partida para entender melhor a outra parte.</p>
<p>Da mesma forma, quando <strong>você</strong> diz "não", estabelece limites saudáveis e evita compromissos que não servem seus interesses. A capacidade de dizer "não" sem medo é a base de toda negociação forte.</p>

<h3>O Efeito Colombo</h3>
<p>Camp recomenda uma técnica chamada <strong>"efeito Colombo"</strong> — inspirada no detetive da TV que fingia ser menos inteligente do que realmente era. Na negociação, isso significa nunca aparentar ser o mais esperto da sala. Quando você parece vulnerável ou "ingênuo", o outro lado baixa a guarda e revela informações valiosas que de outra forma manteria guardadas.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Não tente impressionar:</strong> O negociador que parece "menos esperto" frequentemente obtém mais informações e melhores resultados.</div>
</div>

<h2>Aplicação Prática</h2>
<p>O sistema Camp pode ser aplicado em praticamente qualquer situação: negociações salariais, contratos comerciais, compra de imóveis, resolução de conflitos familiares e até mesmo conversas difíceis no trabalho. A chave é sempre a mesma: <strong>foque no processo, não no resultado</strong>.</p>
<p>Quando você se concentra em fazer as perguntas certas, manter o controle emocional e dar liberdade para o "não", os resultados cuidam de si mesmos. O paradoxo é que, ao não se apegar ao resultado, você consegue resultados melhores.</p>

<h2>Conclusão</h2>
<p>"Comece Pelo Não" é um livro que desafia tudo o que você aprendeu sobre negociação. <strong>Jim Camp</strong> nos mostra que a verdadeira força em uma negociação não vem de táticas agressivas ou de estratégias de "ganha-ganha", mas da disciplina emocional, da clareza de missão e do respeito mútuo. Ao dar ao outro lado o direito de dizer "não", você paradoxalmente abre a porta para acordos mais sólidos e duradouros.</p>

<div class="highlight-box">
  "A negociação não é sobre vencer o outro lado. É sobre tomar decisões que criem valor real para todos os envolvidos — e isso começa quando ambos se sentem livres para dizer 'não'."
</div>`,

  mindmap_json: {
    center_label: 'COMECE PELO NÃO',
    center_sublabel: 'Negociação Baseada em Decisões',
    branches: [
      {
        title: 'Elimine a Necessidade',
        icon: '🚫',
        items: [
          'Nunca demonstre desespero',
          'Esteja disposto a ir embora',
          'Neediness é o inimigo',
          'Controle suas emoções',
        ],
      },
      {
        title: 'Missão Clara',
        icon: '🎯',
        items: [
          'Foque no mundo do adversário',
          'Entenda dores e desejos dele',
          'Seja um solucionador',
          'Missão antes do acordo',
        ],
      },
      {
        title: 'O Poder das Perguntas',
        icon: '❓',
        items: [
          'Use perguntas abertas',
          'Como, o quê, por quê',
          'Escuta ativa e profunda',
          'Quem pergunta controla',
        ],
      },
      {
        title: 'O "Não" como Ferramenta',
        icon: '✋',
        items: [
          'Dê permissão para o não',
          'Não é o começo, não o fim',
          'Liberdade gera confiança',
          'Limite saudável para ambos',
        ],
      },
      {
        title: 'Controle Emocional',
        icon: '🧘',
        items: [
          'Decisões com cabeça fria',
          'Reconheça emoções, não reaja',
          'Sem euforia nem pânico',
          'Processo acima do resultado',
        ],
      },
      {
        title: 'Armadilhas a Evitar',
        icon: '⚠️',
        items: [
          'Ganha-ganha superficial',
          'Compromissos prematuros',
          'Tentar impressionar',
          'Foco só no preço',
        ],
        full_width: true,
      },
    ],
  },

  insights_json: [
    {
      text: 'A pessoa mais disposta a ir embora de uma negociação tem o maior poder. Eliminar a necessidade de fechar um acordo é a habilidade mais valiosa que um negociador pode desenvolver.',
      source_chapter: 'Cap. 1 — A Armadilha do Ganha-Ganha',
    },
    {
      text: 'Quando você dá ao outro lado o direito de dizer "não", algo mágico acontece: a pressão diminui, a confiança aumenta e decisões melhores são tomadas por ambos os lados.',
      source_chapter: 'Cap. 2 — O Poder do Não',
    },
    {
      text: 'Sua missão de negociação deve ser centrada no mundo do adversário, não no seu. Quando você foca em resolver o problema do outro, seu próprio problema se resolve naturalmente.',
      source_chapter: 'Cap. 3 — Missão e Propósito',
    },
    {
      text: 'O negociador que faz perguntas controla a conversa. Quem fala demais revela demais. A pergunta certa no momento certo vale mais que mil argumentos brilhantes.',
      source_chapter: 'Cap. 5 — A Arte das Perguntas',
    },
    {
      text: 'Nunca tente ser o mais esperto da sala. O "efeito Colombo" ensina que parecer vulnerável faz o outro lado baixar a guarda e revelar informações preciosas.',
      source_chapter: 'Cap. 6 — O Efeito Colombo',
    },
    {
      text: 'A emoção é o maior sabotador de qualquer acordo. Medo, ansiedade, euforia — todas essas emoções devem ser reconhecidas e controladas, nunca usadas como base para decisões.',
      source_chapter: 'Cap. 4 — Controle Emocional',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Pratique Dizer "Não"',
      icon: '✋',
      color_theme: 'accent',
      description: 'Identifique uma situação esta semana em que você normalmente diria "sim" por medo ou necessidade de agradar, e pratique dizer "não" com respeito e clareza.',
      template_text: 'Situação: [DESCREVA]. Meu "não" será: [COMO DIRÁ]. O que espero ganhar: [BENEFÍCIO].',
      checklist: [
        'Identifiquei uma situação onde costumo ceder por pressão',
        'Preparei uma resposta "não" respeitosa e clara',
        'Disse "não" na prática e observei a reação',
        'Refleti sobre como me senti e o que aprendi',
      ],
    },
    {
      title: 'Exercício 2 — Mapeie Sua Próxima Negociação',
      icon: '🗺️',
      color_theme: 'green',
      description: 'Antes de sua próxima negociação (salarial, contrato, compra), prepare-se usando o sistema Camp: defina sua missão, liste perguntas abertas e identifique seu ponto de saída.',
      checklist: [
        'Escrevi minha missão focada no mundo do outro lado',
        'Listei 5 perguntas abertas (como, o quê, por quê)',
        'Defini meu ponto de saída (quando irei embora)',
        'Pratiquei eliminando sinais de necessidade',
      ],
    },
    {
      title: 'Exercício 3 — Desafio do Silêncio',
      icon: '🤐',
      color_theme: 'orange',
      description: 'Em sua próxima conversa importante, pratique o silêncio estratégico: faça uma pergunta e espere a resposta completa sem interromper, mesmo que o silêncio seja desconfortável.',
      checklist: [
        'Fiz uma pergunta aberta e esperei em silêncio',
        'Resisti à tentação de preencher o silêncio',
        'Observei as informações extras que surgiram',
        'Anotei o que aprendi com essa técnica',
      ],
    },
  ],
}

// ============================================================
// Book 2: Seven Years to Seven Figures
// ============================================================

const book2: BookData = {
  slug: 'sete-anos-para-sete-digitos',
  metadata: {
    title: 'Sete Anos Para Sete Dígitos',
    original_title: 'Seven Years to Seven Figures: The Fast-Track Plan to Becoming a Millionaire',
    author: 'Michael Masterson',
    year: 2006,
    category_slug: 'financas',
    category_label: 'Finanças & Investimentos',
    category_emoji: '💰',
    reading_time_min: 14,
    cover_gradient_from: '#0f3460',
    cover_gradient_to: '#533483',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p><strong>Michael Masterson</strong> faz uma promessa ousada: é possível acumular um patrimônio líquido de sete dígitos (um milhão de dólares ou mais) em sete anos ou menos. Não por meio de fórmulas mágicas ou investimentos passivos, mas através de um plano de ação estruturado que combina <strong>aumento radical de renda, investimentos ativos e empreendedorismo inteligente</strong>.</p>
<p>O livro não é para quem busca atalhos. Masterson é direto: construir riqueza exige trabalho duro, disciplina e a disposição de fazer da construção de patrimônio a <strong>prioridade número um</strong> da sua vida. A boa notícia? Ele já fez isso várias vezes — e apresenta casos reais de pessoas comuns que seguiram o mesmo caminho.</p>

<div class="highlight-box">
  "Enriquecer é como emagrecer. Todos querem, mas poucos estão dispostos a fazer o que é necessário. O segredo do sucesso é dedicação, trabalho duro e uma devoção incansável às coisas que você quer ver acontecer."
</div>

<h2>Invista Ativamente, Não Passivamente</h2>
<p>A primeira grande lição de Masterson é que é <strong>praticamente impossível</strong> acumular riqueza significativa apenas com investimentos passivos em ações ou fundos. Para isso funcionar, você precisaria de décadas de retornos consistentes acima da média — algo extremamente raro.</p>
<p>Em vez disso, Masterson defende o <strong>investimento ativo</strong>: colocar seu tempo, suas habilidades e sua energia nos investimentos, não apenas seu dinheiro. Isso significa participar diretamente dos negócios em que investe, entender profundamente o mercado e trabalhar para aumentar o valor dos seus ativos.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Investimento ativo vs. passivo:</strong> Warren Buffett não ficou rico por sorte. Cada decisão dele reflete décadas de aprendizado. Se você quer resultados em 7 anos, precisa se envolver ativamente.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Juros compostos são lentos:</strong> Os ganhos realmente impressionantes acontecem no final do período. Para 7 anos, juros compostos sozinhos não bastam.</div>
</div>

<h2>Aumente Radicalmente Sua Renda</h2>
<p>O caminho mais eficaz para a riqueza acelerada é <strong>aumentar dramaticamente sua renda</strong>. Masterson identifica três formas práticas de fazer isso:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Faça o que já faz, mas muito melhor:</strong> Torne-se excepcionalmente bom no seu trabalho atual e negocie uma remuneração que reflita seu novo valor.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Desenvolva uma habilidade de alto valor:</strong> Aprenda algo que impacte diretamente o lucro da empresa — vendas, marketing, copywriting — e posicione-se onde o dinheiro é gerado.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Crie fontes de renda adicionais:</strong> Consultoria, negócios paralelos, joint ventures. Transforme seu conhecimento em múltiplas fontes de receita.</div>
</div>

<h2>O Empreendedorismo "Galinha"</h2>
<p>Um dos conceitos mais práticos do livro é o que Masterson chama de <strong>"chicken entrepreneurship"</strong> — empreendedorismo cauteloso. A ideia é simples: não largue seu emprego para começar um negócio arriscado. Em vez disso, comece seu negócio paralelo enquanto mantém sua renda principal.</p>
<p>Masterson recomenda começar pequeno, testar a ideia, e só fazer a transição completa quando o negócio paralelo gerar renda significativa. Outro princípio-chave: <strong>50% de algo certo vale mais que 100% de uma aposta arriscada</strong>. Busque parcerias e arranjos de compartilhamento de lucros.</p>

<div class="highlight-box">
  "Comece pequeno e construa gradualmente. Isso limita seus riscos caso o novo negócio falhe. Em algum momento no futuro, você pode perceber que está ganhando mais com sua segunda fonte de renda do que com a primeira."
</div>

<h2>Três Veículos de Investimento</h2>
<h3>1. Invista no Negócio Onde Trabalha</h3>
<p>Negocie pacotes de participação nos lucros ou equity. Se você pode demonstrar que gera valor adicional para a empresa, propostas de compartilhamento de lucros são quase sempre aceitas por empregadores inteligentes.</p>

<h3>2. Comece um Negócio Paralelo</h3>
<p>Todo mundo deveria ter um negócio secundário que aproveite as habilidades que já possui. Além de gerar uma segunda fonte de renda, isso permite que você descubra o real valor de mercado das suas competências.</p>

<h3>3. Invista em Imóveis</h3>
<p>Masterson considera imóveis o veículo de investimento ideal para a maioria das pessoas. Diferente de ações, imóveis valorizam enquanto você trabalha em outros projetos. O segredo está em <strong>comprar bem</strong> — pesquisar o mercado, acompanhar oportunidades de execução hipotecária e entender profundamente a dinâmica de oferta e demanda da sua região.</p>

<h2>Histórias Reais de Sucesso</h2>
<p>O livro apresenta diversos estudos de caso de pessoas comuns que alcançaram sete dígitos em menos de sete anos. <strong>Alan Silver</strong> saiu do mercado de materiais de escritório para suplementos naturais e fez seu primeiro milhão em 4,5 anos. <strong>Justin Ford</strong> declarou falência em 1999 e se tornou milionário em 4 anos como copywriter e investidor imobiliário. <strong>Brad Solomon</strong> deixou a contabilidade e atingiu US$ 4 milhões em apenas 3 anos.</p>
<p>O padrão que emerge dessas histórias é claro: todos combinaram <strong>múltiplas fontes de renda</strong> com investimentos ativos em imóveis ou negócios próprios.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>O padrão do sucesso:</strong> Aumente sua renda → Invista ativamente → Crie múltiplas fontes → Reinvista em imóveis e negócios.</div>
</div>

<h2>A Importância de um Mentor</h2>
<p>Masterson enfatiza que ter um <strong>mentor</strong> pode encurtar drasticamente a curva de aprendizado. Ele recomenda identificar 5 líderes aposentados no seu setor, escrever notas genuínas de admiração e pedir conselhos. Não ofereça compensação — pessoas bem-sucedidas adoram compartilhar sabedoria quando o pedido é genuíno.</p>

<h2>Conclusão</h2>
<p>"Sete Anos Para Sete Dígitos" não é um livro de fórmulas mágicas. É um <strong>plano de ação realista e comprovado</strong> para quem está disposto a fazer da construção de riqueza a prioridade da sua vida. A combinação de aumento radical de renda, empreendedorismo cauteloso, investimentos ativos e mentoria pode levar qualquer pessoa determinada à independência financeira em um prazo surpreendentemente curto.</p>

<div class="highlight-box">
  "Você tem tudo o que precisa agora mesmo. Então vá em frente. Não importa quanto tempo leve — se você seguir esses princípios, a questão não é se você ficará rico, mas quando."
</div>`,

  mindmap_json: {
    center_label: 'SETE ANOS PARA SETE DÍGITOS',
    center_sublabel: 'O Plano Acelerado para Ser Milionário',
    branches: [
      {
        title: 'Invista Ativamente',
        icon: '📈',
        items: [
          'Participe dos seus investimentos',
          'Esqueça investimentos passivos',
          'Trabalhe seus ativos',
          'Conheça profundamente o mercado',
        ],
      },
      {
        title: 'Aumente Sua Renda',
        icon: '💰',
        items: [
          'Faça seu trabalho muito melhor',
          'Aprenda habilidades de alto valor',
          'Crie fontes de renda adicionais',
          'Aprenda copywriting e vendas',
        ],
      },
      {
        title: 'Empreendedorismo Cauteloso',
        icon: '🐔',
        items: [
          'Não largue o emprego ainda',
          'Comece pequeno e teste',
          '50% de algo certo vale mais',
          'Busque parcerias estratégicas',
        ],
      },
      {
        title: 'Três Veículos de Riqueza',
        icon: '🏠',
        items: [
          'Participação nos lucros',
          'Negócio paralelo próprio',
          'Investimento em imóveis',
          'Múltiplas fontes de renda',
        ],
      },
      {
        title: 'Mentalidade de Riqueza',
        icon: '🧠',
        items: [
          'Faça disso prioridade nº 1',
          'Poupe pelo menos 15%',
          'Gaste menos do que ganha',
          'Encontre um mentor',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'É praticamente impossível acumular riqueza significativa apenas com investimentos passivos. Você precisa investir ativamente — seu tempo, suas habilidades e sua energia, não apenas seu dinheiro.',
      source_chapter: 'Cap. 1 — Invista Ativamente',
    },
    {
      text: 'O caminho mais rápido para a riqueza é aumentar radicalmente sua renda. Aprenda uma habilidade de alto valor — especialmente vendas e marketing — que impacte diretamente o lucro de uma empresa.',
      source_chapter: 'Cap. 2 — Aumente Sua Renda',
    },
    {
      text: '50% de algo certo é uma aposta muito melhor do que 100% de uma aposta arriscada. Comece seu negócio paralelo sem largar o emprego — esse é o empreendedorismo cauteloso.',
      source_chapter: 'Cap. 2 — Empreendedorismo Galinha',
    },
    {
      text: 'Cada uma das fortunas que fiz levou menos de sete anos. A maioria, na verdade, levou cerca de três anos. O segredo não é um investimento mágico — é múltiplas fontes de renda combinadas.',
      source_chapter: 'Cap. 1 — A Promessa',
    },
    {
      text: 'Imóveis são o veículo de investimento ideal: valorizam enquanto você trabalha em outros projetos. O segredo está em comprar bem, não em esperar e torcer.',
      source_chapter: 'Cap. 3 — Retorno Acima da Média',
    },
    {
      text: 'Um mentor pode encurtar drasticamente sua curva de aprendizado. Identifique líderes aposentados, escreva notas genuínas de admiração e peça conselhos sem oferecer compensação.',
      source_chapter: 'Cap. 3 — O Papel do Mentor',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Seu Plano de Renda em 7 Anos',
      icon: '📊',
      color_theme: 'accent',
      description: 'Calcule quanto você precisa investir anualmente para atingir seu patrimônio-alvo em 7 anos, e identifique formas de aumentar sua renda para atingir esse valor.',
      template_text: 'Meu patrimônio-alvo em 7 anos: R$ [VALOR]. Para isso, preciso investir R$ [VALOR]/ano. Minha renda atual permite investir R$ [VALOR]/ano. O gap é de R$ [VALOR]. Para fechar esse gap, vou: [AÇÃO].',
      checklist: [
        'Defini meu patrimônio-alvo para 7 anos',
        'Calculei quanto preciso investir por ano',
        'Identifiquei o gap entre minha capacidade atual e a necessária',
        'Listei 3 formas concretas de aumentar minha renda',
      ],
    },
    {
      title: 'Exercício 2 — Identifique Seu Negócio Paralelo',
      icon: '🚀',
      color_theme: 'green',
      description: 'Liste suas habilidades profissionais e identifique qual delas pode ser transformada em um negócio paralelo — consultoria, produto digital, serviço — sem largar seu emprego.',
      checklist: [
        'Listei minhas 5 principais habilidades profissionais',
        'Identifiquei qual pode ser vendida como serviço/produto',
        'Pesquisei se há demanda no mercado',
        'Defini um primeiro passo concreto para começar esta semana',
      ],
    },
    {
      title: 'Exercício 3 — Encontre Seu Mentor',
      icon: '🤝',
      color_theme: 'orange',
      description: 'Identifique 3-5 profissionais bem-sucedidos no seu setor (preferencialmente aposentados ou semi-aposentados) e faça contato pedindo uma conversa de 15 minutos.',
      checklist: [
        'Listei 5 profissionais admiráveis no meu setor',
        'Escrevi uma mensagem genuína de admiração para cada um',
        'Enviei pelo menos 2 mensagens esta semana',
        'Marquei uma conversa com pelo menos 1 pessoa',
      ],
    },
  ],
}

// ============================================================
// Book 3: Sacred Cows Make the Best Burgers
// ============================================================

const book3: BookData = {
  slug: 'vacas-sagradas-fazem-os-melhores-hamburgueres',
  metadata: {
    title: 'Vacas Sagradas Fazem os Melhores Hambúrgueres',
    original_title: 'Sacred Cows Make the Best Burgers: Paradigm Busting Strategies For Developing Change-Ready People And Organizations',
    author: 'Robert Kriegel & David Brandt',
    year: 1996,
    category_slug: 'inovacao',
    category_label: 'Tecnologia & Inovação',
    category_emoji: '💡',
    reading_time_min: 14,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p><strong>"Vacas sagradas"</strong> são políticas, práticas e procedimentos ultrapassados que drenam a produtividade das organizações. Elas impedem empresas de se adaptarem às mudanças do mercado e de aproveitarem novas oportunidades. <strong>Robert Kriegel e David Brandt</strong> propõem um sistema de cinco passos para criar organizações <strong>"prontas para a mudança"</strong> — abertas a ideias, motivadas para agir e comprometidas com a evolução contínua.</p>
<p>O livro é um guia prático para quem quer eliminar práticas antiquadas e construir uma cultura organizacional ágil, inovadora e resiliente. E tudo começa com uma <strong>"caçada às vacas sagradas"</strong>.</p>

<div class="highlight-box">
  "Mudança raramente é aceita de bom grado. Implementamos sistemas fantásticos, estratégias brilhantes e tecnologias de ponta. Mas eles nunca parecem atingir as expectativas. Por quê? Porque quando se trata do essencial, as pessoas são os obstáculos."
</div>

<h2>Passo 1 — Identifique Suas Vacas Sagradas</h2>
<p>Uma vaca sagrada é um <strong>jeito enraizado de fazer negócios</strong> — algo que sufoca a criatividade e força as pessoas a agir de formas improdutivas simplesmente "porque sempre foi assim". O primeiro passo para a mudança é identificar todas as vacas sagradas na organização.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>A vaca do papel:</strong> Elimine toda papelada que não agrega valor ao cliente, aumenta a produtividade ou melhora o moral. Isso costuma eliminar 65-70% da burocracia.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>A vaca das reuniões:</strong> Reduza pela metade o tempo de todas as reuniões. Se não pode eliminar, encurte. Você dobra a produtividade instantaneamente.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>A vaca do especialista:</strong> Pense como um iniciante — faça as perguntas "bobas" que os especialistas ignoram. Você pode descobrir uma ideia genial.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>A vaca da concorrência:</strong> Em vez de competir de frente, encontre maneiras éticas de inclinar o campo a seu favor. Faça o oposto do que todos fazem.</div>
</div>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>A vaca do "sem erros":</strong> Empresas com medo de errar não inovam. Recompense tentativas corajosas e esforço, não apenas a ausência de falhas.</div>
</div>

<p>Para identificar vacas sagradas, use o <strong>"teste sem enrolação"</strong>: pergunte "Por que fazemos isso?", "O que aconteceria se parássemos?", "Alguém notaria se parássemos?" e "Alguém faz isso melhor?". Se a prática não agrega valor, elimine-a.</p>

<h2>Passo 2 — Crie um Ambiente Pronto para Mudança</h2>
<p>O momento ideal para criar um ambiente aberto à inovação é <strong>antes</strong> de as mudanças serem necessárias. Líderes eficazes são coaches, não chefes — constroem confiança em vez de comandar.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>De chefe a coach:</strong> Chefes ditam; coaches confiam. Chefes escondem informações; coaches compartilham. Chefes dizem "eu fiz"; coaches dizem "nós fizemos".</div>
</div>

<p>A confiança é fortalecida por quatro pilares: <strong>cuidado genuíno</strong> com as pessoas (investir em treinamento), <strong>respeito</strong> (criticar comportamentos, não pessoas), <strong>empatia</strong> (ver as coisas da perspectiva do outro) e <strong>reconhecimento</strong> (lembrar de dizer obrigado).</p>

<div class="highlight-box">
  "O jeito como a gestão trata os funcionários é exatamente como os funcionários tratarão os clientes. Clientes satisfeitos e leais são o coração das margens espetaculares do Wal-Mart." — Sam Walton
</div>

<h2>Passo 3 — Transforme Resistência em Prontidão</h2>
<p>A resistência à mudança vem de quatro fontes que precisam ser enfrentadas:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Medo:</strong> Combata com verificações de realidade — "Na escala de 1 a 10, qual a real probabilidade do pior cenário?" Desenvolva planos de contingência.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Impotência:</strong> Envolva as pessoas no planejamento das mudanças. Mesmo que a decisão venha de cima, permita que escolham como implementar.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Inércia:</strong> Faça demonstrações concretas do novo sistema em ação. Quebre tarefas complexas em pedaços menores e crie momentum.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Falta de relevância:</strong> Explique os benefícios pessoais da mudança com clareza. Nunca assuma que as pessoas vão descobrir sozinhas por que devem mudar.</div>
</div>

<h2>Passo 4 — Motive as Pessoas a Mudar</h2>
<p>A motivação para mudar requer quatro ingredientes:</p>
<p><strong>Senso de urgência</strong> — use fatos para mostrar por que a mudança é necessária agora. <strong>Inspiração</strong> — crie uma visão vívida e inspiradora do futuro que desperte paixão. <strong>Propriedade</strong> — dê às pessoas responsabilidade real e informação completa. <strong>Recompensas adequadas</strong> — combine reconhecimento intrínseco (liberdade, flexibilidade) com recompensas extrínsecas (bônus, presentes).</p>

<h2>Passo 5 — Desenvolva os 7 Traços da Prontidão Pessoal</h2>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Desenvoltura:</strong> A capacidade de fazer algo do nada, usando os recursos disponíveis criativamente.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Otimismo:</strong> Enquadrar experiências negativas em termos positivos e manter uma visão construtiva do futuro.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Espírito aventureiro:</strong> Amar desafios, estar disposto a correr riscos e buscar o desconhecido.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Determinação:</strong> O combustível que maximiza todos os outros traços — energia e desejo mental combinados.</div>
</div>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Adaptabilidade:</strong> Flexibilidade para mudar expectativas e resiliência para se recuperar de reveses.</div>
</div>

<div class="key-point">
  <div class="kp-num">6</div>
  <div class="kp-text"><strong>Confiança:</strong> Crença inabalável na sua capacidade de lidar com o que vier. Construída sobre autoestima e experiências positivas.</div>
</div>

<div class="key-point">
  <div class="kp-num">7</div>
  <div class="kp-text"><strong>Tolerância à ambiguidade:</strong> Aceitar que nem tudo pode ser planejado e que incerteza é parte natural dos negócios.</div>
</div>

<h2>Conclusão</h2>
<p>As vacas sagradas da sua organização estão consumindo recursos preciosos sem gerar valor. <strong>Kriegel e Brandt</strong> nos mostram que a mudança não precisa ser dolorosa — pode ser divertida, energizante e transformadora. Ao identificar e eliminar práticas obsoletas, criar um ambiente de confiança e desenvolver pessoas prontas para a mudança, qualquer organização pode se transformar em uma <strong>máquina de inovação</strong>.</p>

<div class="highlight-box">
  "Estar pronto para a mudança significa assumir riscos, desafiar convenções e perseguir sonhos. Quando você está pronto, faz mais do que achava possível e se torna mais do que pensava ser."
</div>`,

  mindmap_json: {
    center_label: 'VACAS SAGRADAS',
    center_sublabel: 'Estratégias para Organizações Prontas para Mudar',
    branches: [
      {
        title: 'Identifique as Vacas',
        icon: '🐄',
        items: [
          'Vaca do papel (burocracia)',
          'Vaca das reuniões',
          'Vaca do especialista',
          'Vaca do "sem erros"',
          'Aplique o teste sem enrolação',
        ],
      },
      {
        title: 'Ambiente de Mudança',
        icon: '🌱',
        items: [
          'De chefe a coach',
          'Construa confiança',
          'Compartilhe informação',
          'Reconheça esforços',
        ],
      },
      {
        title: 'Vença a Resistência',
        icon: '💪',
        items: [
          'Combata o medo com fatos',
          'Envolva na implementação',
          'Quebre a inércia',
          'Mostre benefícios pessoais',
        ],
      },
      {
        title: 'Motive para Mudar',
        icon: '🔥',
        items: [
          'Crie senso de urgência',
          'Inspire com uma visão',
          'Dê propriedade real',
          'Recompense adequadamente',
        ],
      },
      {
        title: '7 Traços Pessoais',
        icon: '⭐',
        items: [
          'Desenvoltura e otimismo',
          'Espírito aventureiro',
          'Determinação e adaptabilidade',
          'Confiança e tolerância',
        ],
        full_width: true,
      },
    ],
  },

  insights_json: [
    {
      text: 'Vacas sagradas são práticas enraizadas que sufocam a criatividade. A primeira e mais importante etapa de qualquer transformação é identificá-las e eliminá-las — mesmo que "sempre tenha sido assim".',
      source_chapter: 'Passo 1 — Identifique as Vacas Sagradas',
    },
    {
      text: 'Elimine toda papelada que não agrega valor ao cliente. Na maioria das organizações, isso remove 65-70% da burocracia de uma só vez.',
      source_chapter: 'Passo 1 — A Vaca do Papel',
    },
    {
      text: 'Pessoas não resistem à mudança tanto quanto resistem a serem mudadas. Envolva-as no processo de planejamento e a resistência se transforma em entusiasmo.',
      source_chapter: 'Passo 3 — Transforme Resistência em Prontidão',
    },
    {
      text: 'O jeito como a gestão trata os funcionários é exatamente como os funcionários tratarão os clientes. A cultura começa de cima para baixo.',
      source_chapter: 'Passo 2 — Ambiente de Confiança',
    },
    {
      text: 'Empresas que têm medo de errar não inovam. As descobertas mais profundas nascem das cinzas de fracassos anteriores. Recompense tentativas corajosas, não a ausência de erros.',
      source_chapter: 'Passo 1 — A Vaca do Sem Erros',
    },
    {
      text: 'Boas organizações reagem à mudança. Grandes organizações criam a mudança. A vantagem competitiva sustentável está em liderar o mercado, não em segui-lo.',
      source_chapter: 'Visão Geral — Organizações Prontas para Mudar',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Caçada às Vacas Sagradas',
      icon: '🐄',
      color_theme: 'accent',
      description: 'Identifique 3 práticas no seu trabalho ou vida pessoal que você mantém "porque sempre foi assim" e submeta cada uma ao teste: "O que aconteceria se eu parasse?"',
      checklist: [
        'Listei 3 práticas que faço no automático',
        'Apliquei o teste "o que aconteceria se parasse?" em cada uma',
        'Eliminei ou simplifiquei pelo menos 1 prática esta semana',
        'Observei o impacto (ou falta de impacto) da eliminação',
      ],
    },
    {
      title: 'Exercício 2 — Transforme Resistência em Aliados',
      icon: '🤝',
      color_theme: 'green',
      description: 'Identifique uma mudança que você quer implementar (no trabalho ou na vida) e envolva pelo menos 2 pessoas afetadas no planejamento da implementação.',
      checklist: [
        'Identifiquei uma mudança necessária',
        'Conversei com 2 pessoas afetadas sobre como implementar',
        'Incorporei pelo menos 1 sugestão delas no plano',
        'Comecei a implementação com apoio do grupo',
      ],
    },
    {
      title: 'Exercício 3 — Pense Como Iniciante',
      icon: '🔰',
      color_theme: 'orange',
      description: 'Escolha um processo que você conhece bem e faça 5 perguntas "bobas" sobre ele — aquelas que um novato faria. Anote qualquer insight surpreendente.',
      checklist: [
        'Escolhi um processo que conheço profundamente',
        'Fiz 5 perguntas "de iniciante" sobre ele',
        'Descobri pelo menos 1 ineficiência ou oportunidade',
        'Propus uma melhoria baseada na perspectiva do iniciante',
      ],
    },
  ],
}

// ============================================================
// Book 4: Power Thinking
// ============================================================

const book4: BookData = {
  slug: 'pensamento-poderoso',
  metadata: {
    title: 'Pensamento Poderoso',
    original_title: 'Power Thinking: How The Way You Think Can Change The Way You Lead',
    author: 'John Mangieri & Cathy Block',
    year: 2003,
    category_slug: 'mindset',
    category_label: 'Mentalidade & Mindset',
    category_emoji: '🧠',
    reading_time_min: 14,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Pouquíssimas pessoas aprendem formalmente <strong>como pensar</strong>. A maioria dos líderes e gestores tenta se virar com padrões de pensamento adquiridos por acaso na infância. <strong>John Mangieri e Cathy Block</strong> propõem algo diferente: analisar e sistematicamente melhorar a forma como você realmente pensa.</p>
<p><strong>"Pensamento poderoso"</strong> é a ciência e a arte de pensar melhor. Pensadores poderosos dominam três grandes domínios: <strong>Raciocínio</strong> (pensar antes de agir), <strong>Insight</strong> (usar instintos para gerar ideias superiores) e <strong>Autoconhecimento</strong> (atitudes e crenças claramente definidas). Ao aprimorar seus hábitos de pensamento em cada domínio, você se torna um líder melhor e ganha uma vantagem competitiva sustentável.</p>

<div class="highlight-box">
  "Estima-se que 74% dos graduados universitários nunca aprenderam formalmente como usar estratégias cognitivas. Ou seja, muitos líderes tentam ter sucesso neste mundo complexo usando padrões de pensamento que desenvolveram na infância."
</div>

<h2>O Domínio do Raciocínio</h2>
<p>O raciocínio opera na <strong>mente consciente</strong> — é onde decisões são tomadas e problemas são resolvidos após reflexão cuidadosa. Pensadores poderosos são excepcionais em quatro processos internos:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Árbitro imparcial:</strong> Analise prós e contras sem julgamento prematuro. Reformule a ideia do outro nas suas próprias palavras antes de responder.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Pensador irrestrito:</strong> Não deixe conhecimento prévio limitar seu pensamento. Cada decisão é única — evite pensamento em preto e branco.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Completador auspicioso:</strong> Substitua desculpas por análises racionais. Quando algo não dá certo, pergunte "o que preciso fazer diferente?" em vez de inventar justificativas.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Analista criterioso:</strong> Use o tempo como aliado. Não se deixe pressionar a decidir rápido demais — sempre há tempo suficiente para uma decisão inteligente.</div>
</div>

<p>E quatro processos externos de ação:</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Pioneiro audacioso:</strong> Estabeleça metas ousadas e use raciocínio reverso — trabalhe de trás para frente a partir do resultado desejado.</div>
</div>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Comunicador provocativo:</strong> Use a estratégia CAP — fale de forma Concisa, Acurada e Precisa. Nunca comece com "isso pode ser uma ideia boba, mas...".</div>
</div>

<h2>O Domínio do Insight</h2>
<p>Insight é a capacidade de <strong>saber e agir sem pensamento consciente prévio</strong>. É a intuição treinada. Pensadores poderosos são notáveis pela quantidade de insight que trazem para cada tarefa.</p>

<h3>Processos Internos</h3>
<p><strong>Decisor preparado:</strong> Tome decisões quando se sentir internamente pronto, não quando pressionado externamente. Use "bracketing" — agende um horário diário para pensar sobre desafios. Sua mente para de se preocupar em lembrar e começa a trabalhar em soluções.</p>
<p><strong>Performer sem estresse:</strong> Controle ansiedade mantendo-a em níveis que motivem sem paralisar. Lembre-se: <strong>há uma relação inversa entre preparação e ansiedade</strong>. Quanto mais se prepara, menos ansiedade sente.</p>
<p><strong>Produtor animado:</strong> Quando algo não sai como planejado, não duvide de si mesmo. Pule para a ação criando estratégias para resolver a situação. Pergunte: "Quais são os dois benefícios que resultarão desta mudança?"</p>

<h3>Processos Externos</h3>
<p><strong>Comprometedor intrépido:</strong> Faça a decisão certa e siga em frente com compromisso total. Aprenda a dizer "não" efetivamente para evitar se sobrecarregar.</p>
<p><strong>Gerador pontual:</strong> Quando se sentir sobrecarregado, comece pela tarefa mais fácil — isso cria momentum. Agrupe tarefas similares e crie linhas de montagem mentais.</p>

<div class="highlight-box">
  "Quando atletas atingem experiências de 'flow' durante um jogo, chamam de 'estar na zona'. Tudo que fazem nesse estado é bem-sucedido. O flow pode acontecer para você quando você reconhece as condições que o colocam no limite da sua competência."
</div>

<h2>O Domínio do Autoconhecimento</h2>
<p>O autoconhecimento é uma combinação de <strong>experiência, estratégia e insight</strong>. Pensadores poderosos usam quatro processos internos:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Observador válido:</strong> Conheça profundamente seus pontos fortes e fracos. Elimine auto-sabotagens reformulando seu diálogo interno de negativo para positivo.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Realista receptivo:</strong> Mantenha a mente aberta para novas ideias. Suas crenças devem ser robustas o suficiente para serem desafiadas regularmente.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Pilar de confiança:</strong> A autoconfiança sustenta tudo. Monitore se seu autorrespeito está subindo ou descendo — esse é seu indicador de saúde mental.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Fracassador bem-sucedido:</strong> Use adversidades como experiências de aprendizado. Pergunte sempre: "O que sei agora que não sabia antes?"</div>
</div>

<h2>Programa de Desenvolvimento em 6 Semanas</h2>
<p>Para se tornar um pensador poderoso, Mangieri e Block recomendam um programa de <strong>6 semanas</strong>: escolha um domínio para trabalhar, pratique uma ou duas estratégias diariamente, use lembretes visuais (cartões, post-its) e acompanhe seu progresso. Após 6 semanas, os novos hábitos de pensamento se tornam automáticos.</p>

<h2>Conclusão</h2>
<p>Pensar é uma <strong>habilidade que pode ser melhorada</strong>. A maioria das pessoas nunca aprendeu a pensar de forma eficaz — mas isso pode mudar. Ao dominar os três domínios do pensamento poderoso, você não apenas se torna um líder melhor, mas também uma pessoa mais confiante, feliz e realizada. O investimento em melhorar como você pensa é o investimento com o maior retorno que você pode fazer.</p>

<div class="highlight-box">
  "Excelência é uma arte. Nós somos o que repetidamente fazemos." — Aristóteles
</div>`,

  mindmap_json: {
    center_label: 'PENSAMENTO PODEROSO',
    center_sublabel: 'Os 3 Domínios do Pensamento Eficaz',
    branches: [
      {
        title: 'Raciocínio',
        icon: '🧮',
        items: [
          'Árbitro imparcial',
          'Pensador irrestrito',
          'Analista criterioso',
          'Pioneiro audacioso',
          'Comunicador CAP',
        ],
      },
      {
        title: 'Insight',
        icon: '💡',
        items: [
          'Decisor preparado',
          'Performer sem estresse',
          'Produtor animado',
          'Comprometedor intrépido',
        ],
      },
      {
        title: 'Autoconhecimento',
        icon: '🪞',
        items: [
          'Observador válido',
          'Realista receptivo',
          'Pilar de confiança',
          'Fracassador bem-sucedido',
        ],
      },
      {
        title: 'Hábitos de Ação',
        icon: '⚡',
        items: [
          'Comunicação concisa e precisa',
          'Perguntas inteligentes',
          'Planejamento + execução',
          'Flexibilidade e persistência',
        ],
      },
      {
        title: 'Programa de 6 Semanas',
        icon: '📅',
        items: [
          'Escolha 1 domínio por vez',
          'Pratique diariamente',
          'Use lembretes visuais',
          'Acompanhe o progresso',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Estima-se que 74% dos graduados universitários nunca aprenderam como direcionar seus pensamentos de forma eficaz. Muitos líderes tentam ter sucesso usando padrões de pensamento desenvolvidos na infância.',
      source_chapter: 'Introdução — O Problema do Pensamento',
    },
    {
      text: 'Há uma relação inversa entre preparação e ansiedade. Quanto mais você se prepara, menos ansiedade sente. Comprometa-se a expandir suas atividades de preparação para melhorar seus resultados.',
      source_chapter: 'Cap. 2 — O Domínio do Insight',
    },
    {
      text: 'Substitua desculpas por explicações racionais. Assumir responsabilidade genuína por um fracasso mostra que você é confiável e realmente quer o melhor para a organização.',
      source_chapter: 'Cap. 1 — O Completador Auspicioso',
    },
    {
      text: 'Nunca comece uma fala com "isso talvez seja uma ideia boba, mas...". Disclaimers enfraquecem sua mensagem e demonstram falta de convicção. Declare sua ideia diretamente.',
      source_chapter: 'Cap. 1 — O Comunicador Provocativo',
    },
    {
      text: 'Quando se sentir sobrecarregado, comece pela tarefa mais fácil. Isso cria momentum para enfrentar as tarefas mais difíceis em seguida. A ação gera energia, não o contrário.',
      source_chapter: 'Cap. 2 — O Gerador Pontual',
    },
    {
      text: 'Fracassadores bem-sucedidos usam adversidades como aprendizado. Pergunte sempre: "O que sei agora que não sabia antes?" e "Dentro da minha organização, outros têm atitude similar?"',
      source_chapter: 'Cap. 3 — O Fracassador Bem-sucedido',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Auditoria de Pensamento',
      icon: '🔍',
      color_theme: 'accent',
      description: 'Avalie suas habilidades atuais nos 3 domínios (Raciocínio, Insight, Autoconhecimento). Identifique seu ponto mais fraco e escolha 1 sub-habilidade para desenvolver nas próximas 6 semanas.',
      template_text: 'Meu domínio mais fraco: [DOMÍNIO]. A sub-habilidade que vou desenvolver: [SUB-HABILIDADE]. Meu plano diário: [AÇÃO].',
      checklist: [
        'Avaliei minha força em cada um dos 3 domínios',
        'Identifiquei meu ponto mais fraco',
        'Escolhi 1 sub-habilidade específica para trabalhar',
        'Criei um lembrete visual (cartão, post-it) para praticar diariamente',
      ],
    },
    {
      title: 'Exercício 2 — Comunicação CAP por 1 Semana',
      icon: '🗣️',
      color_theme: 'green',
      description: 'Durante 1 semana, pratique a comunicação Concisa, Acurada e Precisa em todas as suas interações profissionais. Elimine disclaimers e generalizações.',
      checklist: [
        'Eliminei disclaimers ("pode ser bobagem, mas...") das minhas falas',
        'Organizei mentalmente cada ponto antes de falar',
        'Usei verbos precisos e substantivos concretos',
        'Pedi feedback de um colega sobre minha clareza',
      ],
    },
    {
      title: 'Exercício 3 — Diário de Fracassos Produtivos',
      icon: '📝',
      color_theme: 'orange',
      description: 'Durante 1 semana, anote cada erro ou resultado inesperado e responda: "O que sei agora que não sabia antes?" Transforme fracassos em aprendizado concreto.',
      checklist: [
        'Anotei pelo menos 3 erros ou resultados inesperados',
        'Para cada um, escrevi o que aprendi',
        'Identifiquei 1 padrão recorrente nos meus erros',
        'Defini 1 ação concreta para quebrar esse padrão',
      ],
    },
  ],
}

// ============================================================
// Book 5: Powerful Conversations
// ============================================================

const book5: BookData = {
  slug: 'conversas-poderosas',
  metadata: {
    title: 'Conversas Poderosas',
    original_title: 'Powerful Conversations: How High Impact Leaders Communicate',
    author: 'Phil Harkins',
    year: 1999,
    category_slug: 'lideranca',
    category_label: 'Liderança & Gestão',
    category_emoji: '👑',
    reading_time_min: 13,
    cover_gradient_from: '#134e5e',
    cover_gradient_to: '#71b280',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Toda vez que duas pessoas se encontram para conversar, existe uma oportunidade para avançar uma agenda, aprender algo novo e fortalecer o relacionamento. <strong>Phil Harkins</strong> chama essas interações intencionais de <strong>"conversas poderosas"</strong> — o instrumento mais eficaz que um líder tem à disposição para gerar resultados excepcionais.</p>
<p>Líderes de alto impacto não apenas conversam — eles <strong>projetam</strong> suas conversas estrategicamente para criar mudança, construir confiança e mover organizações inteiras na direção certa. E a boa notícia: essa é uma habilidade que pode ser aprendida.</p>

<div class="highlight-box">
  "Líderes falam. É o que fazem. Liderança em si é, na verdade, uma série de conversas poderosas."
</div>

<h2>O Que São Líderes de Alto Impacto</h2>
<p>Líderes de alto impacto se distinguem por uma característica fundamental: <strong>alinhamento entre o que dizem e o que fazem</strong> — o eixo "Dizer-Fazer". Quando esse alinhamento existe, a confiança floresce. Quando há desconexão, a organização estagna.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Geram resultados:</strong> Fazem as coisas acontecerem através de comunicação clara, consistente e orientada para a ação.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>São confiáveis:</strong> Nunca fazem promessas que não podem ou não pretendem cumprir.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>São aprendizes constantes:</strong> Estão sempre em busca de ideias que podem elevar a organização a novos patamares.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Podem estar em qualquer nível:</strong> Alto impacto não requer título formal — é sobre como você se comunica e lidera.</div>
</div>

<h2>A Anatomia de uma Conversa Poderosa</h2>
<p>Toda conversa poderosa segue uma estrutura de três estágios, precedida por um <strong>preâmbulo</strong> que cria conexão emocional:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Agenda — "Quais são os fatos?":</strong> Traga fatores ocultos à tona. Examine o raciocínio por trás das decisões. O fator crítico aqui é a clareza.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Opções — "O que é possível?":</strong> Em vez de aceitar a primeira solução, explore todas as alternativas disponíveis. O fator crítico é a participação.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Ação — "Quem fará o quê?":</strong> Crie compromissos mutuamente compreendidos com métricas claras de sucesso. O fator crítico é o compromisso.</div>
</div>

<p>Ao final de cada conversa, avalie: a agenda avançou? Houve aprendizado compartilhado? O relacionamento se fortaleceu?</p>

<h2>Os Cinco Tipos de Conversas Poderosas</h2>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Foco e Determinação:</strong> Transforma estratégia teórica em força dinâmica. Clarifica ameaças, motiva com persistência e define o papel de cada um.</div>
</div>

<div class="key-point">
  <div class="kp-num">❤️</div>
  <div class="kp-text"><strong>Inteligência Emocional:</strong> Estabiliza em tempos de incerteza. Reconhece medos, expressa empatia e fornece uma visão de como chegar ao futuro.</div>
</div>

<div class="key-point">
  <div class="kp-num">🤝</div>
  <div class="kp-text"><strong>Influência Confiável:</strong> Constrói autoconfiança na organização. Define filosofia, delega detalhes e demonstra cuidado genuíno.</div>
</div>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Pensamento Conceitual:</strong> Impulsiona ideias quando os fatos são ambíguos. Valoriza intuição, desafia o status quo e busca soluções melhores.</div>
</div>

<div class="key-point">
  <div class="kp-num">⚙️</div>
  <div class="kp-text"><strong>Pensamento Sistêmico:</strong> Organiza e foca processos. Examina fundamentos, analisa fatos abertamente e move de dados para soluções deliberadamente.</div>
</div>

<h2>Conversas Ruins — E Como Evitá-las</h2>
<p>Conversas ruins são o oposto polar das conversas poderosas: ideias são expressas de forma ambígua, participantes estão desinteressados, ninguém diz o que realmente pensa. O resultado? Amargura, rumores e perda de otimismo.</p>
<p>Líderes de alto impacto reconhecem conversas ruins se formando e agem imediatamente: <strong>abandonam a agenda</strong> original, criam empatia validando preocupações legítimas, listam todos os problemas e começam pelos mais profundos (geralmente os últimos da lista). Depois, usam a técnica do <strong>"espelho"</strong> — repete para a pessoa seu próprio raciocínio, que frequentemente parece mesquinho quando refletido de volta.</p>

<div class="highlight-box">
  "Até os comunicadores mais poderosos não escapam completamente das conversas ruins. Todos nós temos momentos de irracionalidade, obstinação e explosões emocionais. Um conversador habilidoso reconhece esses sinais e toma medidas para reverter a espiral negativa."
</div>

<h2>Conversas Poderosas e Confiança</h2>
<p>A <strong>confiança</strong> é a moeda da liderança. Harkins identifica três níveis de confiança:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Nível 1 — Profissional:</strong> Compromissos são feitos e mantidos. O ambiente é funcional e eficiente.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Nível 2 — Pessoal:</strong> Compromissos + lealdade + respeito mútuo. As pessoas mal podem esperar para chegar ao trabalho.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Nível 3 — Total:</strong> Compromissos + lealdade + crenças compartilhadas. É aqui que acontecem as lendas do mundo dos negócios.</div>
</div>

<h2>Conversas Poderosas e Mudança</h2>
<p>Para implementar mudanças, líderes precisam de <strong>"campeões apaixonados"</strong> — pessoas diretamente impactadas que se sentem apaixonadas e comprometidas com a agenda de mudança. O processo segue três fases: <strong>Realizabilidade</strong> (o líder articula a visão), <strong>Credibilidade</strong> (gestores operacionais discutem o "como") e <strong>Transferibilidade</strong> (campeões apaixonados implementam).</p>

<h2>Conversas Poderosas e Retenção</h2>
<p>A pergunta mais importante que um líder pode fazer aos seus melhores talentos é: <strong>"O que é necessário para mantê-lo motivado, interessado e conectado à organização?"</strong> As respostas geralmente envolvem seis fatores: papel, compensação, carreira, equipe, cultura e equilíbrio vida-trabalho.</p>

<h2>Conclusão</h2>
<p>"Conversas Poderosas" revela que a ferramenta mais poderosa de um líder não é um plano estratégico ou uma planilha de resultados — é a <strong>qualidade de suas conversas</strong>. Ao dominar a arte de conversar com candor, clareza e compromisso, qualquer pessoa pode se tornar um líder de alto impacto, independentemente do seu cargo ou título.</p>

<div class="highlight-box">
  "Lembre-se de três palavras para guiá-lo nas conversas que virão: candor, clareza e compromisso. Apesar do risco, lidere com sua vulnerabilidade e coloque seus medos à frente. Cada dia trará oportunidades para avançar novas agendas e liderar com força."
</div>`,

  mindmap_json: {
    center_label: 'CONVERSAS PODEROSAS',
    center_sublabel: 'Como Líderes de Alto Impacto Se Comunicam',
    branches: [
      {
        title: 'Estrutura em 3 Estágios',
        icon: '📋',
        items: [
          'Agenda: quais são os fatos?',
          'Opções: o que é possível?',
          'Ação: quem fará o quê?',
          'Preâmbulo: conexão emocional',
        ],
      },
      {
        title: '5 Tipos de Conversa',
        icon: '🎭',
        items: [
          'Foco e determinação',
          'Inteligência emocional',
          'Influência confiável',
          'Pensamento conceitual',
          'Pensamento sistêmico',
        ],
      },
      {
        title: 'Confiança em 3 Níveis',
        icon: '🏗️',
        items: [
          'Nível 1: compromissos mantidos',
          'Nível 2: lealdade mútua',
          'Nível 3: crenças compartilhadas',
        ],
      },
      {
        title: 'Eixo Dizer-Fazer',
        icon: '⚖️',
        items: [
          'Alinhamento gera confiança',
          'Desconexão paralisa',
          'Prometa só o que cumprirá',
          'Consistência é a chave',
        ],
      },
      {
        title: 'Liderar Mudanças',
        icon: '🔄',
        items: [
          'Encontre campeões apaixonados',
          'Articule uma visão clara',
          'Da realizabilidade à ação',
          'Mantenha os campeões alinhados',
        ],
        full_width: true,
      },
    ],
  },

  insights_json: [
    {
      text: 'Líderes falam. É o que fazem. Liderança em si é uma série de conversas poderosas. O poder de suas conversas determina se você vence ou perde.',
      source_chapter: 'Cap. 1 — Líderes de Alto Impacto',
    },
    {
      text: 'O eixo fundamental de um líder de alto impacto é o Dizer-Fazer. Quando o que você diz é consistente com o que faz, a confiança floresce. Quando há desconexão, a organização vai a lugar nenhum.',
      source_chapter: 'Cap. 1 — O Eixo Dizer-Fazer',
    },
    {
      text: 'Conversas poderosas funcionam melhor — e são mais valiosas — quando as situações são as mais difíceis e as conversas as mais desafiadoras.',
      source_chapter: 'Cap. 4 — Conversas Ruins',
    },
    {
      text: 'Confiança tem três níveis: profissional (compromissos mantidos), pessoal (lealdade e respeito) e total (crenças compartilhadas). No nível 3, grandes lendas dos negócios são criadas.',
      source_chapter: 'Cap. 5 — Conversas e Confiança',
    },
    {
      text: 'Para implementar mudanças, você não precisa que todos sejam campeões. Concentre suas conversas poderosas nos poucos que têm paixão genuína — eles farão o trabalho pesado.',
      source_chapter: 'Cap. 6 — Conversas e Mudança',
    },
    {
      text: 'A pergunta mais importante para reter talentos: "O que será necessário para mantê-lo motivado, interessado e conectado à organização?" As respostas sempre envolvem papel, carreira, equipe e equilíbrio.',
      source_chapter: 'Cap. 7 — Conversas e Retenção',
    },
    {
      text: 'Três palavras para guiar todas as suas conversas: candor, clareza e compromisso. Lidere com vulnerabilidade e coloque seus medos à frente de você.',
      source_chapter: 'Conclusão — A Voz da Liderança',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Planeje Uma Conversa Poderosa',
      icon: '📋',
      color_theme: 'accent',
      description: 'Escolha uma conversa importante que precisa ter esta semana e planeje-a usando os 3 estágios: Agenda (o que preciso esclarecer?), Opções (o que é possível?) e Ação (quem faz o quê?).',
      template_text: 'Conversa com: [PESSOA]. Preâmbulo: [CONEXÃO]. Agenda: [FATOS]. Opções: [ALTERNATIVAS]. Ação: [COMPROMISSOS].',
      checklist: [
        'Escolhi uma conversa importante pendente',
        'Planejei os 3 estágios por escrito',
        'Conduzi a conversa seguindo a estrutura',
        'Avaliei: agenda avançou? Houve aprendizado? Relacionamento fortaleceu?',
      ],
    },
    {
      title: 'Exercício 2 — Auditoria do Eixo Dizer-Fazer',
      icon: '⚖️',
      color_theme: 'green',
      description: 'Revise as últimas 5 promessas ou compromissos que fez no trabalho. Quantas foram cumpridas integralmente? Identifique padrões e corrija desalinhamentos.',
      checklist: [
        'Listei as últimas 5 promessas que fiz no trabalho',
        'Marquei quais foram cumpridas integralmente',
        'Identifiquei o padrão nas que não foram cumpridas',
        'Defini 1 ação para realinhar meu eixo Dizer-Fazer',
      ],
    },
    {
      title: 'Exercício 3 — Resgate Uma Conversa Ruim',
      icon: '🔄',
      color_theme: 'orange',
      description: 'Identifique uma conversa recente que foi improdutiva e retome-a usando as técnicas do livro: valide as preocupações, liste os problemas e comece pelos mais profundos.',
      checklist: [
        'Identifiquei uma conversa recente que não foi produtiva',
        'Retomei contato validando as preocupações do outro',
        'Listei explicitamente os pontos problemáticos',
        'Conduzi a conversa para compromissos concretos',
      ],
    },
  ],
}

// ============================================================
// Main insertion logic
// ============================================================

const GRADIENTS = [
  { from: '#1a1a2e', to: '#16213e' },
  { from: '#0f3460', to: '#533483' },
  { from: '#2c3e50', to: '#3498db' },
  { from: '#1e3c72', to: '#2a5298' },
  { from: '#134e5e', to: '#71b280' },
]

async function insertBook(book: BookData, sortOrder: number) {
  console.log(`\n📖 Inserting: ${book.metadata.title} (slug: ${book.slug})`)

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

  console.log('=' .repeat(60))
  console.log('  RESUMOX — Inserting 5 New Books')
  console.log('=' .repeat(60))

  for (const book of books) {
    const id = await insertBook(book, sortOrder)
    if (id) {
      sortOrder++
      inserted++
    }
  }

  console.log('\n' + '=' .repeat(60))
  console.log(`  Done! Inserted ${inserted}/${books.length} books.`)
  console.log('=' .repeat(60))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nFATAL ERROR:', error)
    process.exit(1)
  })
