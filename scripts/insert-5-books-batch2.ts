#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content (Batch 2)
 * Books: Leading Change, Million Dollar Habits, Rich Dad's Guide To Investing,
 *        Guerrilla Marketing Excellence, Predictable Success
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
// Book 1: Leading Change (Liderando a Mudança)
// ============================================================

const book1: BookData = {
  slug: 'liderando-a-mudanca',
  metadata: {
    title: 'Liderando a Mudança',
    original_title: 'Leading Change',
    author: 'John P. Kotter',
    year: 1996,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A grande maioria das tentativas de transformar organizações falha. Não por falta de boas intenções ou mesmo de recursos, mas porque os líderes não compreendem — ou não executam — o <strong>processo de mudança</strong> de forma disciplinada e sequencial. <strong>John Kotter</strong>, professor da Harvard Business School, estudou centenas de iniciativas de transformação corporativa e destilou suas descobertas em um modelo de <strong>8 etapas</strong> que separa as mudanças que realmente acontecem daquelas que morrem no caminho.</p>
<p>O ponto crucial de Kotter é que <strong>liderança e gestão são coisas completamente diferentes</strong>. Gestores planejam, organizam e controlam. Líderes criam visão, comunicam essa visão e inspiram pessoas a agir. A maioria das organizações tem excesso de gestão e escassez de liderança — e é exatamente por isso que a mudança fracassa. Para transformar qualquer organização, você precisa de líderes em todos os níveis, não apenas no topo da hierarquia.</p>

<div class="highlight-box">
  "A taxa de mudança no mundo dos negócios não vai diminuir tão cedo. Se alguma coisa, a competição na maioria dos setores provavelmente vai acelerar nas próximas décadas."
</div>

<h2>Por Que a Mudança Fracassa</h2>
<p>Kotter identifica <strong>oito erros fatais</strong> que sabotam iniciativas de transformação. O mais comum — e mais destrutivo — é não criar um senso de urgência forte o suficiente. Quando as pessoas não sentem que a mudança é necessária <em>agora</em>, elas simplesmente não se movem. A complacência é o assassino silencioso de qualquer transformação.</p>
<p>Outros erros incluem não formar uma <strong>coalizão de liderança</strong> poderosa o bastante, subestimar o poder da visão, comunicar a visão de forma insuficiente, permitir que obstáculos bloqueiem a nova visão, não gerar vitórias de curto prazo, declarar vitória cedo demais e não ancorar as mudanças na cultura organizacional.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Complacência mata:</strong> Mais de 50% das empresas falham já na primeira etapa porque não criam urgência suficiente para tirar as pessoas da zona de conforto.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Gestão não é liderança:</strong> Gestores excelentes podem ser péssimos líderes de mudança. Transformação exige visão, comunicação e inspiração — não apenas planejamento e controle.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Sem coalizão, sem mudança:</strong> Um líder sozinho não transforma uma organização. É preciso reunir um grupo com poder, credibilidade e competência suficientes para conduzir o processo.</div>
</div>

<h2>O Processo de 8 Etapas</h2>
<h3>Etapa 1: Estabeleça um Senso de Urgência</h3>
<p>A mudança começa quando as pessoas sentem que o status quo é mais perigoso do que o desconhecido. Kotter recomenda <strong>examinar o mercado e a concorrência</strong>, identificar crises reais ou potenciais e discutir abertamente as ameaças. Fontes de complacência incluem: falta de uma crise visível, excesso de recursos, padrões de desempenho baixos e foco excessivo em objetivos funcionais estreitos.</p>

<h3>Etapa 2: Crie uma Coalizão de Liderança</h3>
<p>Reúna um grupo com <strong>poder posicional, expertise, credibilidade e capacidade de liderança</strong>. Nenhum indivíduo, por mais brilhante que seja, tem autoridade e influência suficientes para liderar sozinho uma grande mudança. Essa coalizão precisa operar como uma equipe, não como um comitê.</p>

<h3>Etapa 3: Desenvolva uma Visão e uma Estratégia</h3>
<p>Uma boa visão faz três coisas: <strong>clarifica a direção</strong>, motiva as pessoas a agir na direção certa e coordena as ações de milhares de indivíduos. A visão deve ser imaginável, desejável, viável, focada, flexível e comunicável. Se você não consegue explicar sua visão em cinco minutos ou menos, ela não está clara o suficiente.</p>

<div class="highlight-box">
  "Se você não consegue comunicar a visão para alguém em cinco minutos ou menos e obter uma reação de compreensão e interesse, você ainda não terminou."
</div>

<h3>Etapa 4: Comunique a Visão</h3>
<p>A maior parte das transformações subutiliza drasticamente a comunicação — por um fator de <strong>10, 100 ou até 1.000 vezes</strong>. A visão precisa ser comunicada repetidamente, usando todos os canais possíveis, e os líderes precisam <strong>dar o exemplo</strong>. Nada mina mais uma visão de mudança do que ações dos líderes que contradizem suas palavras.</p>

<h3>Etapa 5: Empodere Ação em Larga Escala</h3>
<p>Remova os obstáculos que impedem as pessoas de agir conforme a visão. Esses obstáculos podem ser <strong>estruturas organizacionais</strong>, sistemas de avaliação, gestores que resistem à mudança ou falta de treinamento. O objetivo é dar liberdade para que as pessoas experimentem, inovem e tomem riscos.</p>

<h3>Etapa 6: Gere Vitórias de Curto Prazo</h3>
<p>Transformações bem-sucedidas precisam de <strong>resultados visíveis</strong> nos primeiros 12 a 24 meses. Essas vitórias servem para provar que o sacrifício vale a pena, recompensar os agentes de mudança, silenciar os céticos e construir momento. Vitórias de curto prazo não acontecem por acaso — elas precisam ser planejadas e executadas deliberadamente.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Vitórias visíveis são combustível:</strong> Sem resultados tangíveis no curto prazo, a maioria das pessoas desiste antes que a transformação se consolide.</div>
</div>

<h3>Etapa 7: Consolide Ganhos e Produza Mais Mudança</h3>
<p>O erro mais perigoso aqui é <strong>declarar vitória cedo demais</strong>. Quando os líderes celebram como se a guerra estivesse ganha após a primeira batalha, a urgência desaparece e as forças de resistência empurram a organização de volta. Use a credibilidade das vitórias para atacar problemas maiores, contratar e promover pessoas alinhadas com a visão e revigorar o processo com novos projetos.</p>

<h3>Etapa 8: Ancore as Mudanças na Cultura</h3>
<p>A mudança só se torna permanente quando se torna <strong>"o jeito que fazemos as coisas aqui"</strong>. Isso significa que os novos comportamentos e práticas precisam estar conectados ao sucesso organizacional. Normas de grupo, valores compartilhados e processos de seleção e promoção devem todos reforçar a nova realidade.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Cultura é a última etapa, não a primeira:</strong> Muitos tentam mudar a cultura primeiro. Kotter mostra que a cultura muda depois que as pessoas veem que os novos comportamentos funcionam melhor.</div>
</div>

<h2>Liderança versus Gestão</h2>
<p>Kotter faz uma distinção fundamental: <strong>gestão lida com complexidade</strong> e <strong>liderança lida com mudança</strong>. Uma empresa precisa de ambas, mas na proporção certa. O problema é que a maioria das organizações tem sistemas excelentes de gestão — planejamento, orçamento, organização, controle — mas sistemas precários de desenvolvimento de líderes.</p>
<p>Gestores fazem as coisas acontecerem dentro do sistema existente. Líderes criam novos sistemas. Em um mundo onde a mudança é constante, a liderança se torna o <strong>diferenciador definitivo</strong> entre organizações que prosperam e aquelas que definham.</p>

<h2>A Organização do Futuro</h2>
<p>Kotter prevê que a organização do século XXI será uma <strong>organização de aprendizado</strong> que desenvolve líderes não apenas no topo, mas em todos os níveis. Ela terá menos hierarquia, mais agilidade e uma cultura que abraça a mudança como oportunidade, não como ameaça. O sucesso econômico será diretamente proporcional à capacidade de uma organização de criar líderes que conduzam as mudanças contínuas que serão exigidas.</p>

<div class="highlight-box">
  "No século XXI, o ritmo acelerado de mudança tornará a liderança de negócios a variável diferenciadora entre o sucesso e o fracasso."
</div>

<h2>Conclusão</h2>
<p>A mensagem de Kotter é clara e poderosa: <strong>mudança organizacional bem-sucedida segue um processo</strong>. Não há atalhos. Pular etapas cria a ilusão de velocidade, mas quase sempre produz resultados insatisfatórios. A sequência importa — as primeiras quatro etapas quebram o status quo, as etapas cinco a sete introduzem novas práticas, e a etapa oito torna as mudanças permanentes.</p>
<p>Em um mundo onde a velocidade da mudança só aumenta, a capacidade de liderar transformações não é mais um diferencial — é uma <strong>condição de sobrevivência</strong>. E essa capacidade começa com um senso de urgência genuíno, uma visão clara e a coragem de empoderar pessoas para agir.</p>

<div class="highlight-box">
  "O maior perigo em tempos de turbulência não é a turbulência em si — é agir com a lógica de ontem."
</div>`,
  mindmap_json: {
    center_label: "LIDERANDO A MUDANÇA",
    center_sublabel: "8 Etapas da Transformação",
    branches: [
      {
        title: "Quebrando o Status Quo",
        icon: "🔥",
        items: [
          "Crie senso de urgência real",
          "Monte coalizão de liderança",
          "Desenvolva visão clara",
          "Comunique a visão intensamente"
        ]
      },
      {
        title: "Introduzindo Novas Práticas",
        icon: "⚡",
        items: [
          "Empodere ação em larga escala",
          "Gere vitórias de curto prazo",
          "Consolide ganhos continuamente"
        ]
      },
      {
        title: "Tornando Permanente",
        icon: "🏛️",
        items: [
          "Ancore mudanças na cultura",
          "Conecte comportamentos ao sucesso",
          "Reforce via seleção e promoção",
          "Torne 'o jeito que fazemos'"
        ]
      },
      {
        title: "Liderança vs Gestão",
        icon: "👑",
        items: [
          "Gestão lida com complexidade",
          "Liderança lida com mudança",
          "Ambas são necessárias",
          "Líderes em todos os níveis"
        ]
      },
      {
        title: "Erros Fatais",
        icon: "⚠️",
        items: [
          "Complacência mata transformações",
          "Coalizão fraca demais",
          "Comunicação insuficiente da visão",
          "Declarar vitória cedo demais"
        ],
        full_width: true
      }
    ]
  },
  insights_json: [
    {
      text: "A taxa de mudança no mundo dos negócios não vai diminuir. A competição na maioria dos setores vai acelerar nas próximas décadas. A capacidade de liderar mudanças é o novo diferenciador.",
      source_chapter: "Cap. 1 — A Necessidade de Líderes de Negócio"
    },
    {
      text: "Mais de 50% das empresas falham na primeira etapa da mudança porque não criam urgência suficiente. A complacência é o assassino silencioso de qualquer transformação.",
      source_chapter: "Cap. 2 — Estabelecendo Urgência"
    },
    {
      text: "Se você não consegue comunicar a visão para alguém em cinco minutos ou menos e obter compreensão e interesse, você ainda não terminou de desenvolvê-la.",
      source_chapter: "Cap. 4 — Comunicando a Visão"
    },
    {
      text: "Nada mina mais uma visão de mudança do que ações dos líderes que contradizem suas palavras. O comportamento do líder é a comunicação mais poderosa.",
      source_chapter: "Cap. 4 — Comunicando a Visão"
    },
    {
      text: "Cultura muda por último, não primeiro. Os novos valores se enraízam quando as pessoas veem a conexão clara entre os novos comportamentos e o sucesso da organização.",
      source_chapter: "Cap. 8 — Ancorando Mudanças na Cultura"
    },
    {
      text: "Gestão lida com complexidade. Liderança lida com mudança. O mundo precisa desesperadamente de mais liderança — e menos excesso de gestão.",
      source_chapter: "Cap. 1 — Liderança versus Gestão"
    }
  ],
  exercises_json: [
    {
      title: "Exercício 1 — Mapa de Urgência da Sua Organização",
      icon: "🔥",
      color_theme: "accent",
      description: "Avalie honestamente o nível de complacência versus urgência na sua equipe ou organização. Identifique as forças que mantêm as pessoas na zona de conforto.",
      template_text: "Os sinais de complacência que observo são: [LISTA]. As crises ou ameaças reais que as pessoas não estão vendo são: [AMEAÇAS]. Para criar urgência genuína, vou: [AÇÕES].",
      checklist: [
        "Listei pelo menos 3 sinais de complacência na minha equipe",
        "Identifiquei 2 ameaças reais que estão sendo ignoradas",
        "Defini uma ação concreta para comunicar urgência esta semana",
        "Compartilhei dados de mercado ou concorrência com a equipe"
      ]
    },
    {
      title: "Exercício 2 — Monte Sua Coalizão de Mudança",
      icon: "🤝",
      color_theme: "green",
      description: "Identifique as pessoas-chave que você precisa ter ao seu lado para liderar qualquer mudança significativa na sua organização.",
      checklist: [
        "Listei 3-5 pessoas com poder, credibilidade e expertise",
        "Avaliei quem entre elas está disposta a se comprometer",
        "Agendei uma conversa individual com pelo menos 2 delas",
        "Defini como alinhar o grupo em torno de uma visão comum"
      ]
    },
    {
      title: "Exercício 3 — O Teste dos 5 Minutos",
      icon: "🎯",
      color_theme: "orange",
      description: "Teste a clareza da sua visão de mudança: você consegue explicá-la em 5 minutos e obter compreensão e interesse genuíno?",
      checklist: [
        "Escrevi minha visão de mudança em no máximo 1 parágrafo",
        "Expliquei a visão para alguém e cronometrei (máx 5 min)",
        "Pedi feedback honesto: a pessoa entendeu e se interessou?",
        "Refinei a visão com base no feedback recebido"
      ]
    }
  ]
}

// ============================================================
// Book 2: Million Dollar Habits (Hábitos de Um Milhão de Dólares)
// ============================================================

const book2: BookData = {
  slug: 'habitos-de-um-milhao-de-dolares',
  metadata: {
    title: 'Hábitos de Um Milhão de Dólares',
    original_title: 'Million Dollar Habits: Proven Power Practices to Double and Triple Your Income',
    author: 'Brian Tracy',
    year: 2004,
    category_slug: 'habitos',
    category_label: 'Hábitos & Comportamento',
    category_emoji: '🔄',
    reading_time_min: 15,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Existe uma correlação direta entre os <strong>hábitos que você escolhe</strong> e os resultados que alcança em todas as áreas da vida. <strong>Brian Tracy</strong> — que já trabalhou com mais de 500 corporações e treinou mais de 2 milhões de pessoas — argumenta que o segredo dos mais bem-sucedidos não é talento, sorte ou conexões, mas sim os hábitos que praticam diariamente. A boa notícia? Todos os hábitos são aprendidos através de prática e repetição, o que significa que você pode deliberadamente instalar em sua vida os mesmos hábitos dos milionários.</p>
<p>A maioria das pessoas comete o erro de tentar mudar os <strong>resultados</strong> (Ponto B) quando deveria mudar as <strong>decisões e escolhas</strong> (Ponto A). Se você se concentrar em tomar decisões melhores, automaticamente desenvolverá os hábitos que levam à saúde, felicidade e prosperidade. O controle está inteiramente nas suas mãos.</p>

<div class="highlight-box">
  "Tudo o que você é ou será depende de você. E o único limite real sobre o que pode ser, fazer e ter é o limite que você impõe à sua própria imaginação."
</div>

<h2>Os Princípios da Formação de Hábitos</h2>
<p>Tracy explica que os hábitos são formados seguindo um processo previsível. Primeiro, você toma uma <strong>decisão consciente</strong>. Depois, pratica repetidamente até que o comportamento se torne automático. O tempo necessário varia, mas a chave é a <strong>consistência</strong> — nunca permitir exceções durante a fase de formação do hábito.</p>
<p>Existem quatro objetivos universais que a maioria das pessoas compartilha: ser saudável e ter energia, ter relacionamentos excelentes, fazer um trabalho significativo e alcançar independência financeira. Os hábitos de um milhão de dólares são aqueles que, quando praticados consistentemente, levam você a conquistar todos esses quatro objetivos simultaneamente.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Hábitos são aprendidos:</strong> Bons e maus hábitos são resultado de prática e repetição. Você pode desaprender qualquer hábito ruim e substituí-lo pelo oposto.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Decisões determinam destino:</strong> Mude as decisões no Ponto A e os resultados no Ponto B mudam automaticamente.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Sem exceções:</strong> Durante a formação de um novo hábito, nunca permita uma exceção. Cada quebra reinicia o processo.</div>
</div>

<h2>Os Sete Passos Para Formar um Novo Hábito</h2>
<p>Tracy apresenta um método estruturado para instalar qualquer hábito desejado:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Decida com clareza:</strong> Defina exatamente qual hábito quer desenvolver. A vaguidão é inimiga da ação.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Nunca permita exceções:</strong> Pratique o novo comportamento toda vez que a situação surgir, sem desculpas.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Conte para os outros:</strong> Torne público seu compromisso. A pressão social ajuda na disciplina.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Visualize-se praticando:</strong> Crie uma imagem mental clara de você agindo com o novo hábito.</div>
</div>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Crie uma afirmação:</strong> Repita para si mesmo "Eu sou o tipo de pessoa que..." com o hábito desejado.</div>
</div>

<h2>O Hábito de Definir Metas</h2>
<p>Tracy considera a definição de metas o <strong>hábito mestre</strong> — o hábito que torna todos os outros possíveis. Apenas 3% das pessoas têm metas escritas com planos claros de como alcançá-las. Essas 3% realizam mais do que os outros 97% combinados. O método é simples: escreva suas metas, defina prazos, identifique obstáculos, liste o conhecimento necessário, identifique as pessoas que podem ajudar, faça um plano e aja imediatamente.</p>

<div class="highlight-box">
  "Pessoas bem-sucedidas decidem rápido e mudam devagar. As malsucedidas decidem devagar e mudam de ideia ao primeiro obstáculo."
</div>

<h2>Hábitos de Produtividade e Eficácia</h2>
<p>Os milionários compartilham hábitos específicos de <strong>gestão do tempo</strong>. O mais importante é o hábito de começar o dia pela tarefa mais importante e difícil — o que Tracy chama de <strong>"engolir o sapo"</strong>. Quando você completa a tarefa mais desafiadora logo cedo, o resto do dia flui com energia e sensação de realização.</p>
<p>Outros hábitos de produtividade incluem: planejar cada dia na noite anterior, trabalhar em blocos de tempo ininterrupto, aplicar a <strong>regra 80/20</strong> (focar nos 20% de atividades que geram 80% dos resultados) e eliminar implacavelmente as distrações.</p>

<h3>Hábitos Financeiros</h3>
<p>O hábito financeiro mais poderoso é simples: <strong>pague-se primeiro</strong>. Separe pelo menos 10% de toda renda que receber antes de pagar qualquer conta. Tracy argumenta que esse hábito único, praticado consistentemente ao longo de uma carreira, virtualmente garante independência financeira. Além disso, desenvolva o hábito de viver abaixo dos seus meios, investir regularmente e educar-se continuamente sobre finanças.</p>

<div class="key-point">
  <div class="kp-num">💰</div>
  <div class="kp-text"><strong>Pague-se primeiro:</strong> Separe 10% de toda renda antes de qualquer despesa. Esse único hábito transforma vidas financeiras ao longo de décadas.</div>
</div>

<h2>Hábitos de Relacionamento</h2>
<p>Tracy dedica atenção especial aos hábitos que constroem <strong>relacionamentos excepcionais</strong>. O hábito mais importante aqui é ser um excelente ouvinte — dar atenção total à outra pessoa sem interromper. Pessoas que praticam a escuta genuína são consideradas mais inteligentes, mais confiáveis e mais carismáticas.</p>
<p>Outros hábitos de relacionamento incluem: expressar apreciação constantemente, ser otimista e encorajador, manter sua palavra em todas as circunstâncias e tratar cada pessoa como se fosse a mais importante do mundo.</p>

<h2>Hábitos de Saúde e Bem-Estar</h2>
<p>Tracy enfatiza que sem saúde, nenhuma conquista tem valor. Os hábitos essenciais incluem: exercitar-se regularmente (pelo menos 30 minutos por dia), comer com moderação e qualidade, dormir o suficiente (7-8 horas) e manter o peso ideal. Ele argumenta que esses hábitos não apenas prolongam a vida, mas multiplicam a energia disponível para realizar todas as outras metas.</p>

<h2>O Hábito do Aprendizado Contínuo</h2>
<p>Um dos hábitos mais transformadores é dedicar pelo menos <strong>30 a 60 minutos por dia</strong> para aprender algo novo na sua área de atuação. Tracy chama isso de "hora do poder" e estima que, praticado consistentemente, esse hábito sozinho pode colocá-lo no topo da sua profissão em três a cinco anos.</p>

<div class="highlight-box">
  "Pessoas bem-sucedidas têm 'hábitos de sucesso' e pessoas malsucedidas não. Os bem-sucedidos fazem e dizem as coisas certas, do jeito certo, na hora certa — automaticamente."
</div>

<h2>Hábitos de Marketing e Negócios</h2>
<p>Para quem é empreendedor ou profissional de vendas, Tracy apresenta hábitos específicos: o hábito de pensar continuamente no cliente, de buscar feedback constantemente, de inovar e melhorar produtos e serviços e de construir uma reputação de <strong>excelência absoluta</strong>. Em vendas, o hábito mais importante é prospectar todos os dias, sem exceção.</p>

<h2>Conclusão</h2>
<p>A mensagem central de Brian Tracy é profundamente libertadora: <strong>você não é prisioneiro dos seus hábitos atuais</strong>. Cada hábito foi aprendido e pode ser substituído. Ao assumir controle total dos seus pensamentos, palavras e ações — começando hoje — você pode literalmente reescrever o roteiro da sua vida. Os hábitos de um milhão de dólares não são segredos guardados pela elite. São práticas simples, comprovadas e acessíveis a qualquer pessoa disposta a praticá-las com disciplina e consistência.</p>

<div class="highlight-box">
  "Você pode assumir o controle completo do seu destino tomando controle completo dos seus pensamentos, palavras e ações a partir de hoje."
</div>`,
  mindmap_json: {
    center_label: "HÁBITOS DE UM MILHÃO DE DÓLARES",
    center_sublabel: "Práticas Comprovadas de Sucesso",
    branches: [
      {
        title: "Formação de Hábitos",
        icon: "🧠",
        items: [
          "Decida com clareza absoluta",
          "Nunca permita exceções",
          "Visualize e afirme diariamente",
          "Pratique até ser automático"
        ]
      },
      {
        title: "Hábitos de Metas",
        icon: "🎯",
        items: [
          "Escreva metas com prazos",
          "Identifique obstáculos antecipadamente",
          "Faça plano e aja imediatamente",
          "Revise metas diariamente"
        ]
      },
      {
        title: "Produtividade",
        icon: "⚡",
        items: [
          "Engula o sapo primeiro",
          "Planeje na noite anterior",
          "Aplique a regra 80/20",
          "Elimine distrações"
        ]
      },
      {
        title: "Hábitos Financeiros",
        icon: "💰",
        items: [
          "Pague-se primeiro (10%)",
          "Viva abaixo dos seus meios",
          "Invista regularmente",
          "Eduque-se sobre finanças"
        ]
      },
      {
        title: "Relacionamentos e Saúde",
        icon: "❤️",
        items: [
          "Seja um ouvinte excepcional",
          "Expresse apreciação constante",
          "Exercite-se 30 min/dia",
          "Durma 7-8 horas por noite"
        ]
      },
      {
        title: "Aprendizado Contínuo",
        icon: "📚",
        items: [
          "30-60 min lendo por dia",
          "Hora do poder todo dia",
          "Top da profissão em 3-5 anos",
          "Busque feedback constantemente"
        ]
      }
    ]
  },
  insights_json: [
    {
      text: "Tudo o que você é ou será depende de você. O único limite real é o limite que você impõe à sua própria imaginação. Tome controle total dos seus pensamentos, palavras e ações.",
      source_chapter: "Cap. 1 — Princípios da Formação de Hábitos"
    },
    {
      text: "Apenas 3% das pessoas têm metas escritas com planos claros. Essas 3% realizam mais do que os outros 97% combinados. A definição de metas é o hábito mestre.",
      source_chapter: "Cap. 3 — O Hábito de Definir Metas"
    },
    {
      text: "Comece cada dia pela tarefa mais difícil e importante — 'engula o sapo' primeiro. O resto do dia flui com energia e sensação de realização.",
      source_chapter: "Cap. 5 — Hábitos de Produtividade"
    },
    {
      text: "Separe pelo menos 10% de toda renda antes de pagar qualquer conta. Esse único hábito, praticado ao longo de uma carreira, virtualmente garante independência financeira.",
      source_chapter: "Cap. 6 — Hábitos Financeiros"
    },
    {
      text: "Dedique 30 a 60 minutos por dia para aprender algo novo na sua área. Praticado consistentemente, esse hábito sozinho pode colocá-lo no topo da profissão em 3 a 5 anos.",
      source_chapter: "Cap. 7 — Aprendizado Contínuo"
    },
    {
      text: "Pessoas bem-sucedidas decidem rápido e mudam devagar. As malsucedidas decidem devagar e mudam de ideia ao primeiro obstáculo.",
      source_chapter: "Cap. 4 — Hábitos de Caráter e Liderança"
    },
    {
      text: "Durante a formação de um novo hábito, nunca permita uma exceção. Cada quebra reinicia o processo. A disciplina na fase inicial é o preço da liberdade futura.",
      source_chapter: "Cap. 2 — Os Sete Passos Para Formar um Hábito"
    }
  ],
  exercises_json: [
    {
      title: "Exercício 1 — Auditoria de Hábitos Pessoais",
      icon: "🔍",
      color_theme: "accent",
      description: "Faça um inventário honesto dos seus hábitos atuais em 4 áreas: saúde, finanças, produtividade e relacionamentos. Identifique qual hábito, se mudado, causaria maior impacto.",
      template_text: "O hábito que mais me prejudica atualmente é: [HÁBITO]. O hábito que quero instalar no lugar é: [NOVO HÁBITO]. Vou praticá-lo diariamente por [PERÍODO] sem exceções.",
      checklist: [
        "Listei meus 3 piores hábitos em cada área da vida",
        "Identifiquei o hábito com maior impacto negativo",
        "Defini o hábito substituto com clareza absoluta",
        "Comuniquei meu compromisso para pelo menos 1 pessoa",
        "Pratiquei o novo hábito hoje sem exceção"
      ]
    },
    {
      title: "Exercício 2 — Metas Escritas com o Método Tracy",
      icon: "📝",
      color_theme: "green",
      description: "Escreva 10 metas que deseja alcançar nos próximos 12 meses. Depois, escolha a meta mais impactante e crie um plano de ação imediato.",
      checklist: [
        "Escrevi 10 metas em papel com prazos específicos",
        "Selecionei a meta mais transformadora entre elas",
        "Identifiquei o maior obstáculo para essa meta",
        "Defini a primeira ação concreta e a executei hoje"
      ]
    },
    {
      title: "Exercício 3 — O Desafio 'Engula o Sapo' por 7 Dias",
      icon: "🐸",
      color_theme: "orange",
      description: "Durante 7 dias consecutivos, comece cada manhã executando a tarefa mais difícil e importante do dia antes de qualquer outra coisa.",
      checklist: [
        "Na noite anterior, identifiquei o 'sapo' do dia seguinte",
        "Completei a tarefa mais difícil antes das 10h da manhã",
        "Registrei como me senti após completar (energia, foco)",
        "Mantive o desafio por 7 dias consecutivos sem falhar"
      ]
    }
  ]
}

// ============================================================
// Book 3: Rich Dad's Guide To Investing
// ============================================================

const book3: BookData = {
  slug: 'guia-de-investimentos-do-pai-rico',
  metadata: {
    title: 'Guia de Investimentos do Pai Rico',
    original_title: "Rich Dad's Guide To Investing: What The Rich Invest In That The Poor And Middle Class Do Not",
    author: 'Robert Kiyosaki e Sharon Lechter',
    year: 2000,
    category_slug: 'mentalidade-riqueza',
    category_label: 'Mentalidade & Riqueza',
    category_emoji: '💰',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A pergunta que <strong>Robert Kiyosaki</strong> responde neste livro é direta: em que exatamente os ricos investem que os pobres e a classe média não investem? A resposta surpreenderá a maioria: os ricos investem em <strong>educação financeira, experiência empreendedora e fluxo de caixa excessivo</strong>. Enquanto a maioria das pessoas busca dicas de ações quentes ou o próximo fundo de investimento da moda, os verdadeiramente ricos constroem uma base de conhecimento, habilidades e estruturas que geram riqueza de forma previsível e crescente.</p>
<p>Kiyosaki classifica os investidores em três categorias progressivas: o <strong>investidor sofisticado</strong> (que entende leis tributárias e corporativas), o <strong>investidor interno</strong> (que constrói e possui negócios) e o <strong>investidor supremo</strong> (que cria negócios bem-sucedidos e vende participação ao público). Cada nível exige mais educação e experiência, mas também oferece retornos exponencialmente maiores.</p>

<div class="highlight-box">
  "Investir não é arriscado. Não ter educação financeira é arriscado. O investimento em si é apenas um veículo — é o motorista que determina se a viagem será segura ou perigosa."
</div>

<h2>Educação: O Primeiro Investimento dos Ricos</h2>
<h3>A Mentalidade do Investidor Rico</h3>
<p>A primeira diferença entre ricos e pobres não está no tamanho da carteira, mas na <strong>mentalidade</strong>. A maioria das pessoas tem três prioridades: primeiro segurança, depois conforto e por último riqueza. Para os ricos, a ordem é inversa — enriquecer é a prioridade número um. Essa mudança de prioridade não é ganância; é uma decisão estratégica que permite ajudar mais pessoas e ter mais impacto.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Abundância vs. Escassez:</strong> Pobres veem dinheiro como recurso escasso. Ricos sabem que há dinheiro abundante no mundo — ele flui para projetos viáveis e pessoas preparadas.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Plano antes de produto:</strong> Investir é um plano, não um produto. O plano determina quais produtos são adequados — não o contrário.</div>
</div>

<h3>Literacia Financeira</h3>
<p>Kiyosaki insiste que a educação financeira tem três pilares: entender o <strong>vocabulário dos investimentos</strong>, saber ler e usar <strong>números financeiros</strong> e compreender as <strong>leis tributárias e corporativas</strong>. Sem esses três pilares, qualquer conselho de investimento é inútil — porque a pessoa não tem base para avaliar se o conselho é bom ou ruim.</p>

<h3>As 7 Regras Básicas do Investimento</h3>
<p>O "Pai Rico" de Kiyosaki ensina sete regras fundamentais que todo investidor deveria seguir:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Saiba para que tipo de renda está trabalhando:</strong> Renda ganha, passiva ou de portfólio — cada uma é tributada de forma diferente.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Converta renda ganha em passiva ou de portfólio:</strong> Essa é a essência do jogo dos ricos — transformar trabalho em ativos que geram renda sem trabalho.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Mantenha sua renda ganha segura comprando ativos:</strong> Use a renda do trabalho para comprar ativos — nunca para financiar passivos que parecem ativos.</div>
</div>

<h2>Experiência: Construindo Negócios que Funcionam Sem Você</h2>
<p>O segundo pilar do investimento dos ricos é a <strong>experiência empreendedora</strong>. Kiyosaki argumenta que a diferença entre alguém que compra ações e um verdadeiro investidor é que o verdadeiro investidor sabe <strong>construir o negócio</strong> por trás das ações. Os cinco elementos fundamentais de qualquer negócio são:</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Os 5 blocos de um negócio:</strong> Fluxo de caixa, comunicação, sistemas, aspectos legais e produto. A maioria foca apenas no produto — os ricos dominam todos os cinco.</div>
</div>

<p>O objetivo não é apenas ter um negócio, mas criar um negócio que funcione <strong>sem a sua presença diária</strong>. Quando o dono precisa estar presente o tempo todo, ele não tem um negócio — tem um emprego. O verdadeiro investidor interno constrói sistemas, equipes e processos que operam de forma autônoma.</p>

<div class="highlight-box">
  "A diferença entre um dono de negócio e um autônomo é simples: se você parar de trabalhar e o dinheiro parar de entrar, você é autônomo. Se o dinheiro continuar entrando, você é dono de negócio."
</div>

<h2>Fluxo de Caixa Excessivo: As Três Fontes de Renda</h2>
<p>Os ricos estruturam suas vidas financeiras para ter <strong>três fontes distintas de renda</strong>:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Renda passiva:</strong> Retorno de ativos tangíveis como imóveis alugados. É a renda mais favorecida tributariamente.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Renda de portfólio:</strong> Ganhos com ativos financeiros — ações, títulos, fundos. Requer conhecimento para minimizar riscos.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Renda ganha:</strong> Salário ou honorários. A mais tributada e a menos escalável. Deve ser convertida nas outras duas o mais rápido possível.</div>
</div>

<p>O segredo não é apenas ter múltiplas fontes de renda, mas estruturá-las para que as rendas passiva e de portfólio <strong>cubram todas as despesas</strong>, deixando a renda ganha como excedente para novos investimentos. Quando suas rendas passivas superam suas despesas, você é financeiramente livre.</p>

<h2>O Triângulo B-I: A Estrutura do Investidor Interno</h2>
<p>Kiyosaki apresenta o conceito do <strong>Triângulo B-I</strong> — os cinco elementos que todo empreendedor-investidor precisa dominar. A maioria dos negócios falha não porque o produto é ruim, mas porque um ou mais dos outros elementos estão fracos:</p>
<p>Na base está o <strong>fluxo de caixa</strong> — sem controle financeiro, nada funciona. Depois vêm <strong>comunicação</strong> (vendas e marketing), <strong>sistemas</strong> (processos e tecnologia), <strong>aspectos legais</strong> (proteção e estruturação) e no topo o <strong>produto</strong>. A maioria dos empreendedores fracassa porque foca obsessivamente no produto e ignora os outros quatro pilares.</p>

<h2>O Investidor Supremo</h2>
<p>O nível mais alto de investimento é criar um negócio bem-sucedido e então <strong>vender uma participação ao público</strong> — através de um IPO ou venda para um grupo maior. Esse é o caminho que trilharam todos os maiores bilionários da história: Bill Gates, Warren Buffett, Jeff Bezos. Eles não ficaram ricos comprando ações — ficaram ricos criando as empresas cujas ações outros compram.</p>

<div class="highlight-box">
  "Os ricos não investem da mesma maneira que todos. Eles investem em educação, experiência e múltiplas fontes de renda — e isso os torna capazes de ver oportunidades onde outros veem apenas risco."
</div>

<h2>Conclusão</h2>
<p>A lição mais importante de Kiyosaki é que <strong>investir não é algo que você faz — é algo que você se torna</strong>. Não se trata de encontrar a ação certa ou o momento perfeito do mercado. Trata-se de construir uma base sólida de educação financeira, adquirir experiência empreendedora real e estruturar sua vida para gerar fluxo de caixa excessivo. Quando você faz isso, o risco diminui drasticamente porque você entende o que está fazendo — e é exatamente por isso que os ricos ficam cada vez mais ricos.</p>

<div class="highlight-box">
  "Quanto mais educação financeira e experiência você tem, mais fácil se torna distinguir um bom negócio de um mau negócio. E essa habilidade é o verdadeiro investimento dos ricos."
</div>`,
  mindmap_json: {
    center_label: "GUIA DE INVESTIMENTOS DO PAI RICO",
    center_sublabel: "O Que os Ricos Investem Diferente",
    branches: [
      {
        title: "Educação Financeira",
        icon: "📚",
        items: [
          "Vocabulário dos investimentos",
          "Leitura de números financeiros",
          "Leis tributárias e corporativas",
          "Mentalidade de abundância"
        ]
      },
      {
        title: "Experiência Empreendedora",
        icon: "🏗️",
        items: [
          "Construa negócios, não empregos",
          "Domine os 5 blocos do negócio",
          "Crie sistemas autônomos",
          "O negócio funciona sem você"
        ]
      },
      {
        title: "Fluxo de Caixa Excessivo",
        icon: "💰",
        items: [
          "Renda passiva (imóveis)",
          "Renda de portfólio (ações)",
          "Renda ganha (salário)",
          "Passivas cubram despesas"
        ]
      },
      {
        title: "3 Tipos de Investidor",
        icon: "📈",
        items: [
          "Sofisticado: entende leis",
          "Interno: constrói negócios",
          "Supremo: vende ao público"
        ]
      },
      {
        title: "O Triângulo B-I",
        icon: "🔺",
        items: [
          "Base: fluxo de caixa",
          "Comunicação e vendas",
          "Sistemas e processos",
          "Legal e produto no topo"
        ],
        full_width: true
      }
    ]
  },
  insights_json: [
    {
      text: "Investir não é arriscado. Não ter educação financeira é arriscado. O investimento em si é apenas um veículo — é o motorista que determina se a viagem será segura ou perigosa.",
      source_chapter: "Cap. 1 — Educação: O Primeiro Investimento"
    },
    {
      text: "A diferença entre um dono de negócio e um autônomo: se você parar de trabalhar e o dinheiro parar de entrar, você é autônomo. Se continuar entrando, você é dono de negócio.",
      source_chapter: "Cap. 2 — Experiência Empreendedora"
    },
    {
      text: "Pobres veem dinheiro como recurso escasso. Ricos sabem que há dinheiro abundante no mundo — ele flui naturalmente para projetos viáveis e pessoas preparadas.",
      source_chapter: "Cap. 1 — A Mentalidade do Investidor Rico"
    },
    {
      text: "A maioria dos negócios falha não porque o produto é ruim, mas porque o empreendedor foca obsessivamente no produto e ignora fluxo de caixa, comunicação, sistemas e aspectos legais.",
      source_chapter: "Cap. 2 — O Triângulo B-I"
    },
    {
      text: "Os maiores bilionários da história não ficaram ricos comprando ações. Ficaram ricos criando as empresas cujas ações outros compram.",
      source_chapter: "Cap. 3 — O Investidor Supremo"
    },
    {
      text: "Quando suas rendas passivas superam suas despesas, você é financeiramente livre. Esse é o verdadeiro objetivo — não um número mágico na conta bancária.",
      source_chapter: "Cap. 3 — Fluxo de Caixa Excessivo"
    }
  ],
  exercises_json: [
    {
      title: "Exercício 1 — Mapeie Suas Fontes de Renda",
      icon: "💡",
      color_theme: "accent",
      description: "Classifique toda a renda que você recebe hoje em três categorias: ganha (salário/trabalho), passiva (imóveis/royalties) e portfólio (investimentos). Identifique o desequilíbrio.",
      template_text: "Minha renda ganha mensal é R$[X]. Minha renda passiva é R$[Y]. Minha renda de portfólio é R$[Z]. Para cobrir minhas despesas só com renda passiva, preciso de R$[W] adicionais.",
      checklist: [
        "Listei todas as fontes de renda e classifiquei cada uma",
        "Calculei a porcentagem de cada tipo no meu total",
        "Identifiquei quanto preciso em renda passiva para cobrir despesas",
        "Defini uma ação para criar ou aumentar renda passiva este mês"
      ]
    },
    {
      title: "Exercício 2 — Educação Financeira em Ação",
      icon: "📖",
      color_theme: "green",
      description: "Dedique 30 minutos esta semana para aprender um conceito financeiro que você não domina: demonstração de resultados, balanço patrimonial ou fluxo de caixa.",
      checklist: [
        "Escolhi um conceito financeiro para estudar",
        "Dediquei 30 minutos para aprender sobre ele",
        "Apliquei o conceito às minhas próprias finanças",
        "Expliquei o conceito para outra pessoa (teste de compreensão)"
      ]
    },
    {
      title: "Exercício 3 — O Teste do 'Sem Você'",
      icon: "🔥",
      color_theme: "orange",
      description: "Se você tem um negócio ou trabalho autônomo, responda honestamente: se você tirasse 30 dias de férias, o dinheiro continuaria entrando? Se não, identifique o que precisa sistematizar.",
      checklist: [
        "Respondi honestamente ao teste 'sem você'",
        "Listei os processos que dependem exclusivamente de mim",
        "Identifiquei 1 processo que posso sistematizar ou delegar",
        "Criei um plano para automatizar esse processo esta semana"
      ]
    }
  ]
}

// ============================================================
// Book 4: Guerrilla Marketing Excellence
// ============================================================

const book4: BookData = {
  slug: 'excelencia-em-marketing-de-guerrilha',
  metadata: {
    title: 'Excelência em Marketing de Guerrilha',
    original_title: 'Guerrilla Marketing Excellence: The Fifty Golden Rules for Business Success',
    author: 'Jay Conrad Levinson',
    year: 1993,
    category_slug: 'comunicacao',
    category_label: 'Comunicação',
    category_emoji: '🗣',
    reading_time_min: 13,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p><strong>Jay Conrad Levinson</strong>, o pai do marketing de guerrilha, reuniu neste livro as <strong>50 regras de ouro</strong> que transformam negócios de qualquer tamanho em máquinas de vendas eficientes. A premissa é simples: você não precisa de um orçamento milionário para fazer marketing extraordinário. O que precisa é de <strong>conhecimento, criatividade e consistência</strong>. Guerrilheiros de marketing usam o bom senso e a inteligência para desenvolver estratégias que competem — e frequentemente vencem — empresas com orçamentos muito maiores.</p>
<p>Marketing não é um evento, é um <strong>processo contínuo</strong>. É a atividade mais crítica de qualquer empresa, e a chave para o sucesso ou fracasso a longo prazo. Sem marketing eficaz, qualquer empresa murcha e morre. Com marketing excelente, até empresas pequenas crescem, prosperam e se expandem.</p>

<div class="highlight-box">
  "O marketing de guerrilha não é sobre gastar mais dinheiro. É sobre investir mais tempo, energia, imaginação e conhecimento."
</div>

<h2>Paciência e Visão de Longo Prazo</h2>
<p>A primeira regra — e talvez a mais violada — é <strong>evitar a expectativa de resultados instantâneos</strong>. Marketing de guerrilha exige paciência. Todas as decisões devem ser baseadas no sucesso de longo prazo, não em picos temporários. Levinson observa que a maioria dos negócios abandona campanhas eficazes cedo demais, antes que elas tenham tempo de construir reconhecimento e confiança no mercado.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Sem resultados instantâneos:</strong> Baseie todas as decisões de marketing no sucesso de longo prazo. Consistência vence intensidade.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Mantenha o que funciona:</strong> Nunca mude uma campanha eficaz só porque você está cansado dela. Os clientes ainda estão respondendo.</div>
</div>

<h2>Conheça Seu Cliente Profundamente</h2>
<p>A rentabilidade do marketing aumenta dramaticamente quando você consegue <strong>identificar com precisão seu mercado-alvo</strong>. Marketing para "todo mundo" é marketing para ninguém. Levinson insiste que guerrilheiros transformam prospects em clientes ao saberem exatamente o que as pessoas certas desejam quando compram seu produto ou serviço.</p>
<p>Seu ativo mais valioso não é seu produto ou sua marca — é sua <strong>lista de clientes</strong>. Se você coleta e armazena detalhes suficientes sobre cada cliente, tem a base para todo o sucesso futuro do marketing. Clientes existentes devem receber apreciação genuína através de contato consistente e novos produtos ou serviços adaptados às suas necessidades.</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Venda soluções, não benefícios:</strong> Resolver um problema comum é muito mais eficaz do que promover benefícios genéricos.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Sua lista de clientes é ouro:</strong> Colete e armazene detalhes sobre cada cliente. Essa base é a chave para a rentabilidade futura.</div>
</div>

<h2>Marketing é Processo, Não Evento</h2>
<p>Empresas de sucesso encaram o marketing como um <strong>processo contínuo e ininterrupto</strong>, com lucros diretamente impulsionados pelo conhecimento acumulado. Quanto mais você sabe sobre seu mercado, melhores resultados pode gerar. O marketing mais rentável é aquele <strong>totalmente honesto e verdadeiro</strong> — porque a confiança é o ativo mais valioso que qualquer empresa pode construir.</p>

<div class="highlight-box">
  "O marketing não é destinado a gerar vendas. É destinado a gerar lucros. Há uma diferença gigantesca entre os dois."
</div>

<h3>Conquiste a Mente Antes da Carteira</h3>
<p>Levinson enfatiza um princípio crucial: antes de conquistar uma fatia do mercado, você precisa conquistar uma <strong>fatia da mente</strong> do prospect. Através de publicidade repetida e conscientização geral do mercado, sua empresa precisa se tornar a primeira opção que as pessoas lembram quando pensam no seu tipo de produto ou serviço. A fatia de vendas segue automaticamente.</p>

<h2>Execução e Forma</h2>
<h3>O Poder do Headline</h3>
<p>Uma das regras mais práticas: <strong>90% do tempo</strong> gasto desenvolvendo um anúncio deveria ser dedicado ao headline (para material impresso) ou à frase de abertura (para rádio/TV/digital). O headline é a porta de entrada. Se ele não captura atenção imediata, todo o resto é irrelevante.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>90% no headline:</strong> Dedique a esmagadora maioria do tempo criativo ao título ou frase de abertura. É ali que a venda começa — ou morre.</div>
</div>

<h3>Estilo com Substância</h3>
<p>Marketing eficaz tem <strong>estilo e substância</strong> simultaneamente. Captura atenção e mantém interesse pelo tempo necessário para fazer a venda. Mas atenção: nunca sacrifique lucros por originalidade. Levinson avisa que criatividade pela criatividade é uma armadilha. Mantenha-se com o marketing existente que funciona até que pare de produzir resultados.</p>

<h2>Armas do Guerrilheiro</h2>
<p>Levinson apresenta um arsenal de táticas que multiplicam o impacto do marketing:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Múltiplas armas:</strong> O uso combinado de várias ferramentas de marketing aumenta a eficácia de cada uma individualmente.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Pesquise seus clientes:</strong> Fazer pesquisas cria um vínculo com o cliente e forma a base para negócios repetidos e rentabilidade futura.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Cooperação acima de competição:</strong> O sucesso de longo prazo é mais baseado em cooperação com parceiros do que em competição destrutiva.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Suborno funciona:</strong> Todo mundo adora ser incentivado a comprar. Use ofertas, bônus e incentivos a seu favor.</div>
</div>

<h2>Credibilidade e Confiança</h2>
<p>A credibilidade da empresa potencializa os resultados de <strong>todo o marketing</strong> que ela realiza. Dados específicos aumentam a credibilidade de qualquer material de marketing — quanto mais concreto e mensurável, mais acreditável. Levinson também enfatiza que todos os materiais devem ser <strong>produzidos profissionalmente</strong>, porque até um toque de amadorismo perde vendas.</p>

<div class="highlight-box">
  "Empresas que focam no que podem dar às pessoas são mais bem-sucedidas do que empresas construídas em torno do que podem tirar delas."
</div>

<h2>O Vínculo Humano</h2>
<p>Uma das regras mais poderosas: <strong>crie um vínculo humano antes de buscar um vínculo comercial</strong>. As pessoas compram de quem elas gostam, conhecem e confiam. Empresas que demonstram genuinamente que se importam com seus clientes ao longo do tempo são as que prosperam. O marketing mais eficaz é aquele que trata cada cliente como uma pessoa, não como uma transação.</p>

<h2>Conclusão</h2>
<p>As 50 regras de ouro de Levinson se resumem a um princípio unificador: <strong>marketing excelente é o resultado de conhecimento, paciência e consistência</strong>, não de orçamentos grandiosos. O guerrilheiro de marketing investe tempo, energia e imaginação onde outros investem apenas dinheiro. Conhece profundamente seu cliente, vende soluções para problemas reais, mantém-se consistente por tempo suficiente para construir confiança e nunca sacrifica a verdade pela criatividade. Essas práticas transformam qualquer negócio, de qualquer tamanho, em uma força competitiva formidável.</p>

<div class="highlight-box">
  "O guerrilheiro de marketing substitui investimento financeiro por investimento de tempo, energia, imaginação e conhecimento — e frequentemente supera concorrentes com orçamentos muito maiores."
</div>`,
  mindmap_json: {
    center_label: "EXCELÊNCIA EM MARKETING DE GUERRILHA",
    center_sublabel: "50 Regras de Ouro do Marketing",
    branches: [
      {
        title: "Mentalidade Guerrilheira",
        icon: "🧠",
        items: [
          "Paciência e visão de longo prazo",
          "Processo contínuo, não evento",
          "Conhecimento substitui dinheiro",
          "Consistência vence intensidade"
        ]
      },
      {
        title: "Conheça Seu Cliente",
        icon: "🎯",
        items: [
          "Identifique mercado-alvo exato",
          "Venda soluções, não benefícios",
          "Lista de clientes é o maior ativo",
          "Pesquise e mantenha contato"
        ]
      },
      {
        title: "Execução Eficaz",
        icon: "⚡",
        items: [
          "90% do tempo no headline",
          "Estilo com substância",
          "Materiais profissionais sempre",
          "Dados concretos geram credibilidade"
        ]
      },
      {
        title: "Arsenal de Táticas",
        icon: "🛠️",
        items: [
          "Múltiplas armas combinadas",
          "Cooperação acima de competição",
          "Incentivos e ofertas funcionam",
          "Vínculo humano antes do comercial"
        ]
      },
      {
        title: "Princípios de Lucro",
        icon: "💰",
        items: [
          "Lucro, não apenas vendas",
          "Mente primeiro, carteira depois",
          "Nunca mude o que funciona",
          "Honestidade é o melhor marketing"
        ],
        full_width: true
      }
    ]
  },
  insights_json: [
    {
      text: "O marketing de guerrilha não é sobre gastar mais dinheiro. É sobre investir mais tempo, energia, imaginação e conhecimento. Criatividade e consistência substituem orçamento.",
      source_chapter: "Introdução — A Mentalidade Guerrilheira"
    },
    {
      text: "Marketing não é destinado a gerar vendas. É destinado a gerar lucros. Há uma diferença gigantesca entre os dois — e confundir os dois é um erro fatal.",
      source_chapter: "Regra 13 — Marketing e Lucros"
    },
    {
      text: "90% do tempo gasto desenvolvendo um anúncio deveria ser dedicado ao headline. É a porta de entrada: se não captura atenção imediata, todo o resto é irrelevante.",
      source_chapter: "Regra 30 — O Poder do Headline"
    },
    {
      text: "Antes de conquistar uma fatia do mercado, conquiste uma fatia da mente do prospect. Quando você é a primeira lembrança, a venda segue automaticamente.",
      source_chapter: "Regra 14 — Mente Antes da Carteira"
    },
    {
      text: "Empresas que focam no que podem dar às pessoas são mais bem-sucedidas do que empresas construídas em torno do que podem tirar delas.",
      source_chapter: "Regra 43 — Dar Antes de Receber"
    },
    {
      text: "Nunca sacrifique lucros por originalidade. Criatividade pela criatividade é uma armadilha. Mantenha o que funciona até que pare de produzir resultados.",
      source_chapter: "Regra 23 — Consistência sobre Criatividade"
    },
    {
      text: "Crie um vínculo humano antes de buscar um vínculo comercial. As pessoas compram de quem gostam, conhecem e confiam. Relacionamento precede transação.",
      source_chapter: "Regra 32 — O Vínculo Humano"
    }
  ],
  exercises_json: [
    {
      title: "Exercício 1 — Perfil Profundo do Seu Cliente Ideal",
      icon: "🎯",
      color_theme: "accent",
      description: "Crie um perfil detalhado do seu cliente ideal: quem é, o que teme, o que deseja e qual problema específico seu produto resolve para ele.",
      template_text: "Meu cliente ideal é [QUEM]. Seu maior problema é [PROBLEMA]. Meu produto resolve isso ao [SOLUÇÃO]. Ele compra porque [MOTIVAÇÃO].",
      checklist: [
        "Descrevi meu cliente ideal com detalhes demográficos e psicográficos",
        "Identifiquei o problema número 1 que meu produto/serviço resolve",
        "Reformulei minha mensagem focando na solução, não no produto",
        "Testei a nova mensagem com pelo menos 2 clientes reais"
      ]
    },
    {
      title: "Exercício 2 — Auditoria das Suas Armas de Marketing",
      icon: "🛠️",
      color_theme: "green",
      description: "Liste todas as ferramentas de marketing que você usa atualmente. Depois, identifique 3 novas armas de baixo custo que poderia adicionar ao seu arsenal.",
      checklist: [
        "Listei todas as armas de marketing que uso atualmente",
        "Avaliei a eficácia de cada uma (funciona / não funciona / não sei)",
        "Identifiquei 3 novas ferramentas de baixo custo para testar",
        "Implementei pelo menos 1 nova arma de marketing esta semana"
      ]
    },
    {
      title: "Exercício 3 — O Desafio do Headline",
      icon: "✍️",
      color_theme: "orange",
      description: "Reescreva o headline principal do seu material de marketing (site, anúncio, post). Crie 10 versões e teste a melhor com pessoas reais.",
      checklist: [
        "Escrevi 10 versões diferentes do headline principal",
        "Cada versão foca em uma dor ou desejo diferente do cliente",
        "Pedi opinião de pelo menos 3 pessoas sobre as versões",
        "Substituí o headline atual pelo vencedor"
      ]
    }
  ]
}

// ============================================================
// Book 5: Predictable Success
// ============================================================

const book5: BookData = {
  slug: 'sucesso-previsivel',
  metadata: {
    title: 'Sucesso Previsível',
    original_title: 'Predictable Success: Getting Your Organization on the Growth Track – and Keeping It There',
    author: 'Les McKeown',
    year: 2010,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 14,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Toda empresa passa por estágios regulares e previsíveis de crescimento e declínio — o famoso <strong>ciclo de vida organizacional</strong>. <strong>Les McKeown</strong>, que já iniciou e gerenciou 42 empresas, identificou que existe um ponto ideal nesse ciclo: a zona do <strong>Sucesso Previsível</strong>. Quando sua organização está nessa zona, você sabe por que é bem-sucedido e usa essa informação para sustentar e gerar ainda mais crescimento ao longo do tempo.</p>
<p>O verdadeiro desafio dos negócios não é chegar ao topo — é <strong>permanecer lá</strong>. A maioria das empresas passa pelo ponto ideal e continua avançando até entrar em declínio, sem perceber que ultrapassou o sweet spot. McKeown mostra como identificar em que estágio sua organização está e, mais importante, como voltar ou permanecer na zona do Sucesso Previsível.</p>

<div class="highlight-box">
  "Sucesso Previsível é um estado alcançável por qualquer grupo de pessoas — qualquer organização, divisão, departamento, projeto ou equipe — no qual eles consistentemente alcançam seus objetivos comuns."
</div>

<h2>Os 7 Estágios do Ciclo de Vida</h2>
<h3>Fase de Ascensão: Rumo ao Sucesso Previsível</h3>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Luta Inicial (Early Struggle):</strong> A organização luta para sobreviver. O foco é conseguir caixa e validar o mercado. Muitas morrem aqui.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Diversão (Fun):</strong> As vendas começam a decolar. A energia é contagiante, tudo parece possível. Crescimento rápido, mas caótico.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Turbulência (Whitewater):</strong> As dores de crescimento aparecem. O foco muda de vendas para rentabilidade. Sistemas e processos são necessários, mas causam tensão.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Sucesso Previsível:</strong> O ponto ideal. A organização alcança seus objetivos de forma consistente e sabe exatamente por quê. É aqui que você quer ficar.</div>
</div>

<h3>Fase de Declínio: O Caminho Para Baixo</h3>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Esteira (Treadmill):</strong> A organização torna-se avessa a riscos e dependente de processos. A burocracia começa a sufocar a criatividade.</div>
</div>

<div class="key-point">
  <div class="kp-num">6</div>
  <div class="kp-text"><strong>O Grande Rut:</strong> Processos e administração superam ação e resultados. A empresa funciona no automático, sem paixão.</div>
</div>

<div class="key-point">
  <div class="kp-num">7</div>
  <div class="kp-text"><strong>Estertor Final (Death Rattle):</strong> Reorganização por falência ou aquisição. A empresa perdeu sua razão de existir.</div>
</div>

<h2>A Luta Inicial: Sobrevivendo aos Primeiros Meses</h2>
<p>No estágio da Luta Inicial, a única pergunta que importa é: <strong>"Temos caixa para sobreviver?"</strong> A maioria das organizações morre aqui porque não consegue validar seu mercado rápido o suficiente. O fundador vende pessoalmente, faz de tudo, e cada dia é uma batalha pela sobrevivência. Para sair dessa fase, são necessários dois elementos: encontrar um mercado viável e ter caixa suficiente para sustentá-lo até que as vendas se estabilizem.</p>

<h2>A Fase da Diversão: O Crescimento Embriagante</h2>
<p>Quando as vendas começam a decolar, a empresa entra na fase mais emocionante: <strong>a Diversão</strong>. Todos estão energizados, o produto vende, os clientes chegam. O problema é que esse crescimento é frequentemente caótico e insustentável. O fundador e a equipe original operam por instinto e adrenalina, sem sistemas reais. Tudo depende das pessoas — e quando as pessoas-chave ficam sobrecarregadas, os problemas começam.</p>

<div class="highlight-box">
  "A fase da Diversão é embriagante, mas perigosa. O crescimento acelerado sem sistemas é como um avião sem instrumentos — funciona enquanto o tempo está bom."
</div>

<h2>A Turbulência: O Momento da Verdade</h2>
<p>A <strong>Turbulência</strong> é o estágio mais crítico e desconfortável. É aqui que a organização precisa instalar <strong>sistemas, processos e estruturas</strong> para sustentar o crescimento. Mas isso cria tensão brutal entre os "visionários" (que construíram a empresa na fase de Diversão) e os "operadores" (que foram contratados para trazer ordem ao caos).</p>
<p>A maioria das empresas fica presa nesse estágio por anos, oscilando entre caos e controle excessivo. A chave para atravessar a Turbulência é reconhecer que tanto a <strong>visão empreendedora</strong> quanto a <strong>disciplina operacional</strong> são necessárias — e criar estruturas que permitam ambas coexistir.</p>

<h2>Sucesso Previsível: O Sweet Spot</h2>
<p>Quando você chega ao Sucesso Previsível, três elementos estão em equilíbrio:</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Estrutura decisória robusta:</strong> A organização tem uma forma clara e eficaz de tomar e implementar decisões em todos os níveis.</div>
</div>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Mentalidade de proprietário:</strong> Cada pessoa sente responsabilidade pessoal pelos resultados, não apenas pelo cumprimento de tarefas.</div>
</div>

<div class="key-point">
  <div class="kp-num">🔥</div>
  <div class="kp-text"><strong>Motivação para usar sistemas:</strong> As pessoas usam processos porque entendem seu valor — não por obrigação ou medo.</div>
</div>

<p>O segredo de permanecer na zona de Sucesso Previsível é manter o <strong>equilíbrio dinâmico</strong> entre empreendedorismo e gestão. Quando a gestão começa a dominar excessivamente, a empresa desliza para a Esteira. Quando o empreendedorismo domina sem controle, volta para a Turbulência. O líder eficaz é aquele que constantemente ajusta esse equilíbrio.</p>

<h2>Os Estágios de Declínio</h2>
<h3>A Esteira: Quando Processos Sufocam</h3>
<p>Na Esteira, a organização se torna <strong>avessa a riscos</strong>. Processos e políticas que foram criados para ajudar se tornam fins em si mesmos. As pessoas passam mais tempo preenchendo relatórios do que gerando resultados. A inovação diminui porque cada nova ideia precisa passar por camadas de aprovação. Os melhores talentos começam a sair.</p>

<h3>O Grande Rut e o Estertor Final</h3>
<p>Se a Esteira não for revertida, a empresa entra no <strong>Grande Rut</strong> — um estado de complacência organizacional onde a administração burocrática supera totalmente a ação produtiva. Eventualmente, isso leva ao <strong>Estertor Final</strong>: falência, aquisição hostil ou dissolução.</p>

<div class="highlight-box">
  "Gerenciar uma organização que está em qualquer estado diferente do Sucesso Previsível é uma prova de nervos: a organização pode ou não ser bem-sucedida, e mesmo quando é, é difícil saber por quê."
</div>

<h2>Como Voltar ao Sucesso Previsível</h2>
<p>McKeown oferece esperança: é possível retornar ao Sucesso Previsível de qualquer estágio de declínio. A chave é <strong>diagnosticar honestamente</strong> onde sua organização está e então tomar ações específicas para cada estágio. Da Esteira, reintroduza risco calculado e empoderamento. Do Grande Rut, corte burocracia e reconecte as pessoas com o propósito original.</p>

<h2>Conclusão</h2>
<p>A mensagem central de McKeown é ao mesmo tempo simples e profunda: <strong>o Sucesso Previsível não é resultado da idade, tamanho ou recursos de uma organização</strong>. É resultado de um equilíbrio intencional entre visão empreendedora e disciplina operacional. Qualquer organização, equipe ou projeto pode alcançar esse estado — e mais importante, pode aprender a permanecer nele. O verdadeiro desafio da liderança não é subir ao topo do ciclo, mas ter a sabedoria de reconhecer quando você está ali e a disciplina de não ultrapassá-lo.</p>

<div class="highlight-box">
  "Sucesso Previsível nunca é o resultado direto da idade, recursos ou cultura de uma organização. O verdadeiro desafio é chegar lá — e ter a disciplina de ficar."
</div>`,
  mindmap_json: {
    center_label: "SUCESSO PREVISÍVEL",
    center_sublabel: "O Ciclo de Vida Organizacional",
    branches: [
      {
        title: "Fase de Ascensão",
        icon: "📈",
        items: [
          "Luta Inicial: sobreviver com caixa",
          "Diversão: vendas decolam",
          "Turbulência: dores de crescimento",
          "Sucesso Previsível: o sweet spot"
        ]
      },
      {
        title: "Fase de Declínio",
        icon: "📉",
        items: [
          "Esteira: burocracia sufoca",
          "Grande Rut: complacência total",
          "Estertor Final: falência ou aquisição"
        ]
      },
      {
        title: "3 Pilares do Sweet Spot",
        icon: "🏛️",
        items: [
          "Estrutura decisória robusta",
          "Mentalidade de proprietário",
          "Motivação para usar sistemas",
          "Equilíbrio dinâmico constante"
        ]
      },
      {
        title: "A Turbulência",
        icon: "🌊",
        items: [
          "Visionários vs operadores",
          "Caos vs controle excessivo",
          "Estágio mais crítico do ciclo",
          "Visão + disciplina coexistindo"
        ]
      },
      {
        title: "Como Voltar ao Topo",
        icon: "🔄",
        items: [
          "Diagnostique honestamente seu estágio",
          "Reintroduza risco da Esteira",
          "Corte burocracia do Grande Rut",
          "Reconecte com o propósito original"
        ],
        full_width: true
      }
    ]
  },
  insights_json: [
    {
      text: "Sucesso Previsível é um estado alcançável por qualquer grupo de pessoas no qual eles consistentemente alcançam seus objetivos comuns. Não depende de idade, tamanho ou recursos.",
      source_chapter: "Cap. 1 — O Que É Sucesso Previsível"
    },
    {
      text: "A fase da Diversão é embriagante mas perigosa. O crescimento acelerado sem sistemas é como um avião sem instrumentos — funciona enquanto o tempo está bom.",
      source_chapter: "Cap. 2 — A Fase da Diversão"
    },
    {
      text: "A maioria das empresas fica presa na Turbulência por anos, oscilando entre caos e controle excessivo, sem conseguir chegar ao equilíbrio do Sucesso Previsível.",
      source_chapter: "Cap. 3 — A Turbulência"
    },
    {
      text: "O verdadeiro desafio da liderança não é subir ao topo do ciclo de vida, mas ter a sabedoria de reconhecer quando você está ali e a disciplina de não ultrapassá-lo.",
      source_chapter: "Cap. 4 — Permanecendo no Sucesso Previsível"
    },
    {
      text: "Quando processos e políticas se tornam fins em si mesmos, a organização entrou na Esteira. Os melhores talentos saem primeiro porque são os que mais sofrem com a burocracia.",
      source_chapter: "Cap. 5 — Os Estágios de Declínio"
    },
    {
      text: "O equilíbrio entre visão empreendedora e disciplina operacional é o que mantém uma organização no sweet spot. Quando um domina o outro, o ciclo se move — para cima ou para baixo.",
      source_chapter: "Cap. 4 — O Equilíbrio Dinâmico"
    }
  ],
  exercises_json: [
    {
      title: "Exercício 1 — Diagnóstico do Estágio Atual",
      icon: "🔍",
      color_theme: "accent",
      description: "Identifique em qual dos 7 estágios do ciclo de vida sua organização, equipe ou projeto se encontra hoje. Seja brutalmente honesto.",
      template_text: "Minha organização/equipe está no estágio de [ESTÁGIO] porque observo estes sinais: [SINAIS]. Para avançar rumo ao Sucesso Previsível, a ação mais importante é: [AÇÃO].",
      checklist: [
        "Li a descrição de cada um dos 7 estágios",
        "Identifiquei pelo menos 3 sinais do estágio atual",
        "Conversei com 2 colegas para validar meu diagnóstico",
        "Defini 1 ação prioritária para mover em direção ao sweet spot"
      ]
    },
    {
      title: "Exercício 2 — Equilíbrio Visão vs. Operação",
      icon: "⚖️",
      color_theme: "green",
      description: "Avalie o equilíbrio entre empreendedorismo e gestão na sua organização. Identifique qual lado está dominando e o que fazer para reequilibrar.",
      checklist: [
        "Avaliei: temos mais energia empreendedora ou operacional?",
        "Identifiquei 2 sintomas do desequilíbrio atual",
        "Propus 1 mudança concreta para reequilibrar",
        "Discuti a proposta com um líder ou colega de confiança"
      ]
    },
    {
      title: "Exercício 3 — Teste Anti-Esteira",
      icon: "🔥",
      color_theme: "orange",
      description: "Identifique processos ou políticas na sua organização que se tornaram fins em si mesmos — burocracia que não gera valor. Proponha eliminar ou simplificar pelo menos um.",
      checklist: [
        "Listei 3 processos que consomem tempo sem gerar valor claro",
        "Calculei quanto tempo semanal é gasto neles",
        "Propus eliminar ou simplificar o processo mais burocrático",
        "Apresentei a proposta ao responsável pela área"
      ]
    }
  ]
}

// ============================================================
// Insert function
// ============================================================

async function insertBook(book: BookData, sortOrder: number): Promise<string | null> {
  console.log(`\n📚 Inserting: ${book.metadata.title} (${book.slug})`)

  // Check duplicates
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
  console.log('  RESUMOX — Inserting 5 New Books (Batch 2)')
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
