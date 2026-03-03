#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content
 * Books: Maximum Achievement, In Pursuit of Elegance, Conversational Capital, The Change Function, Collaboration
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
// Book 1: Maximum Achievement
// ============================================================

const book1: BookData = {
  slug: 'realizacao-maxima',
  metadata: {
    title: 'Realização Máxima',
    original_title: 'Maximum Achievement: Strategies and Skills That Will Unlock Your Hidden Powers to Succeed',
    author: 'Brian Tracy',
    year: 1993,
    category_slug: 'psicologia',
    category_label: 'Psicologia',
    category_emoji: '🧠',
    reading_time_min: 14,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Existe uma ligação direta entre a <strong>qualidade dos seus pensamentos</strong> e a qualidade da sua vida. Suas circunstâncias externas e conquistas são um reflexo preciso daquilo que você pensa a maior parte do tempo. <strong>Brian Tracy</strong> apresenta em "Realização Máxima" um sistema completo para desbloquear os reservatórios ocultos de potencial que existem dentro de cada ser humano.</p>
<p>O caminho para ser feliz e bem-sucedido — por qualquer definição que você estabeleça — está em encontrar a combinação certa de pensamentos e ações, e então integrar esses pensamentos e realizar essas ações de forma consistente na sua vida. Quando você consegue fazer isso regularmente, a felicidade e o sucesso se tornam consequências naturais.</p>

<div class="highlight-box">
  "A maior revolução da minha vida é a descoberta de que os indivíduos podem mudar os aspectos externos de suas vidas mudando as atitudes internas de suas mentes." — William James
</div>

<h2>Os 7 Ingredientes do Sucesso</h2>
<p>Tracy identifica sete ingredientes que, juntos, compõem qualquer definição de sucesso que uma pessoa possa ter:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Paz de espírito:</strong> O resultado natural de viver uma vida alinhada com seus valores e convicções mais importantes.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Saúde e energia:</strong> O corpo tem uma tendência natural para a boa saúde. Muitas vezes, basta parar de fazer o que é prejudicial.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Relacionamentos amorosos:</strong> Sem outras pessoas envolvidas, qualquer conquista pode parecer vazia.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Liberdade financeira:</strong> Quando você tem reservas suficientes para não se preocupar com contas, alcançou a verdadeira liberdade.</div>
</div>

<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Metas e ideais dignos:</strong> Para alcançar felicidade interior, você precisa de um senso claro de direção.</div>
</div>

<div class="key-point">
  <div class="kp-num">6</div>
  <div class="kp-text"><strong>Autoconhecimento:</strong> Quando você entende as experiências que moldaram suas atitudes, tem a chave para conquistar ainda mais.</div>
</div>

<div class="key-point">
  <div class="kp-num">7</div>
  <div class="kp-text"><strong>Realização pessoal:</strong> A sensação profunda que vem de alcançar tudo aquilo de que você é capaz.</div>
</div>

<h2>As 7 Leis do Domínio Mental</h2>
<p>Tracy apresenta sete leis fundamentais que governam a mente e determinam o nível de sucesso de cada pessoa. Ao dominar essas leis, você pode literalmente criar na realidade qualquer vida que consiga imaginar.</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Lei do Controle:</strong> Você se sente positivo quando está no controle da sua vida, e negativo quando sente que forças externas a controlam.</div>
</div>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Lei da Crença:</strong> Aquilo que você acredita apaixonadamente ser verdade eventualmente se torna sua realidade.</div>
</div>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Lei da Atração:</strong> Você atrai para sua vida todas as pessoas e situações que estão em sintonia com seus pensamentos dominantes.</div>
</div>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Lei da Equivalência Mental:</strong> Qualquer coisa que você pense de forma consistente, vívida e com emoção intensa, eventualmente se torna sua realidade.</div>
</div>

<p>As outras leis — <strong>Causa e Efeito</strong>, <strong>Expectativas</strong> e <strong>Correspondência</strong> — completam o sistema. Juntas, elas demonstram que ao mudar seus pensamentos, você muda suas circunstâncias externas.</p>

<h2>O Programa Mestre: Reprogramando Seu Autoconceito</h2>
<p>O <strong>Programa Mestre</strong> do seu subconsciente é o seu autoconceito — o conjunto de crenças sobre você mesmo e sua vida. Você sempre age de forma consistente com suas crenças internas. Portanto, para mudar como você age, primeiro mude o que acredita.</p>
<p>O autoconceito tem três partes: o <strong>ideal do eu</strong> (como você gostaria de ser), a <strong>autoimagem</strong> (como você se vê atualmente) e a <strong>autoestima</strong> (como você se sente sobre si mesmo). Tracy apresenta a fórmula:</p>
<p><strong>Desempenho = (Atributos Inatos + Atributos Adquiridos) × Atitude</strong></p>
<p>A atitude funciona como um multiplicador. Mesmo com atributos modestos, uma atitude poderosa pode gerar resultados extraordinários. Para reprogramar seu autoconceito, Tracy recomenda:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Visualize imagens vívidas</strong> de si mesmo alcançando seus objetivos. O subconsciente não distingue entre uma experiência real e algo vividamente imaginado.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Use afirmações positivas</strong> no presente e na primeira pessoa, que substituem informações antigas por novos padrões de pensamento.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Aja como se já tivesse alcançado</strong> seus objetivos. Isso reforça seus sentimentos internos e fortalece seu comportamento positivo.</div>
</div>

<h2>A Habilidade Mestre: Definir e Alcançar Metas</h2>
<p>Tracy é categórico: <strong>a habilidade mestre do sucesso é definir metas</strong> e fazer planos específicos e concretos para alcançá-las. Ele apresenta 12 passos para a realização de metas, começando por desenvolver um desejo ardente e uma crença inabalável, passando por escrever a meta claramente, listar benefícios, identificar obstáculos, e culminando na decisão de nunca desistir.</p>

<div class="highlight-box">
  "Sucesso é igual a metas, e todo o resto é comentário." — Brian Tracy
</div>

<h3>A Mente Superconsciente</h3>
<p>Tracy introduz o conceito da <strong>mente superconsciente</strong> — um vasto reservatório de conhecimento e inteligência disponível a toda a raça humana. Para acessá-la: defina seu problema claramente por escrito, reúna informações, revise-as conscientemente e então entregue o problema ao subconsciente. As respostas virão por intuição, encontros inesperados ou eventos imprevisíveis que resolvem a questão completamente.</p>

<h2>A Decisão Mestre: Responsabilidade Total</h2>
<p>Antes de ativar seus poderes superiores, você precisa aceitar <strong>responsabilidade completa e total</strong> por quem você é, onde está e por tudo que se tornará. As emoções negativas — raiva, culpa, medo — são a principal causa do baixo desempenho. A pessoa que aceita total responsabilidade recusa-se a entreter emoções negativas e avança com confiança e entusiasmo.</p>

<h3>O Objetivo Mestre: Paz Interior</h3>
<p>O objetivo mestre de qualquer vida é alcançar <strong>paz interior</strong>. Isso é feito organizando cada aspecto da vida para gerar a maior felicidade para você e para as pessoas mais próximas. Tracy identifica sete causas que impedem a paz interior: preocupação, falta de metas claras, tarefas inacabadas, medo do fracasso, medo da rejeição, negação e raiva.</p>

<h2>Dominando os Relacionamentos</h2>
<p>Tracy afirma que pelo menos <strong>85% do sucesso na vida</strong> é determinado pela capacidade de se relacionar bem com outras pessoas. Ele apresenta sete comportamentos essenciais: ser agradável, aceitar as pessoas como são, expressar apreciação, fazer os outros se sentirem importantes, expressar admiração sincera, dar atenção total e aplicar o princípio do bumerangue — qualquer emoção que você expressa aos outros eventualmente retorna para você.</p>

<h3>O Poder do Amor</h3>
<p>O livro se encerra com uma verdade poderosa: <strong>os maiores realizadores do mundo são aqueles que continuamente procuram maneiras de demonstrar amor, gentileza e afeto</strong> às pessoas ao seu redor. O amor é a força mais poderosa do universo e a chave para realizar seu maior potencial.</p>

<div class="highlight-box">
  "Não importa qual seja a pergunta, o amor é a resposta. Sempre foi, e sempre será." — Brian Tracy
</div>

<h2>Conclusão</h2>
<p>"Realização Máxima" é um sistema completo para transformar sua vida de dentro para fora. A mensagem central é simples mas profunda: <strong>você se torna aquilo que pensa a maior parte do tempo</strong>. Ao dominar as leis mentais, reprogramar seu autoconceito, definir metas claras, aceitar responsabilidade total e nutrir relacionamentos com amor, você desbloqueia os poderes ocultos que já existem dentro de você. O sucesso não é um acidente — é o resultado previsível de pensamentos e ações consistentes e direcionados.</p>`,
  mindmap_json: {
    center_label: 'REALIZAÇÃO MÁXIMA',
    center_sublabel: 'Desbloqueie Seus Poderes Ocultos',
    branches: [
      {
        title: '7 Leis Mentais',
        icon: '🧠',
        items: [
          'Lei do Controle',
          'Lei da Crença',
          'Lei da Atração',
          'Lei da Equivalência Mental',
          'Lei da Correspondência',
        ],
      },
      {
        title: 'Programa Mestre',
        icon: '💡',
        items: [
          'Autoconceito é a chave',
          'Visualize seus objetivos',
          'Afirmações positivas diárias',
          'Aja como se já alcançou',
        ],
      },
      {
        title: 'Metas & Ação',
        icon: '🎯',
        items: [
          'Desejo ardente pela meta',
          'Escreva com clareza e detalhes',
          'Liste obstáculos e soluções',
          'Nunca desista jamais',
        ],
      },
      {
        title: 'Responsabilidade Total',
        icon: '⚡',
        items: [
          'Elimine emoções negativas',
          'Perdoe e siga em frente',
          'Pare de culpar os outros',
          'Busque paz interior',
        ],
      },
      {
        title: 'Relacionamentos',
        icon: '❤️',
        items: [
          '85% do sucesso é relacional',
          'Faça os outros se sentirem importantes',
          'Princípio do bumerangue',
          'Amor é a força suprema',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Você se torna aquilo que pensa a maior parte do tempo. Ao mudar seus pensamentos dominantes, você literalmente muda as circunstâncias da sua vida.',
      source_chapter: 'Cap. 1 — As 7 Leis do Domínio Mental',
    },
    {
      text: 'O subconsciente não consegue distinguir entre uma experiência real e algo que é vividamente imaginado. Use isso a seu favor através da visualização intensa.',
      source_chapter: 'Cap. 2 — O Programa Mestre',
    },
    {
      text: 'Desempenho é igual a atributos inatos mais atributos adquiridos, multiplicados pela atitude. A atitude é o maior multiplicador de resultados.',
      source_chapter: 'Cap. 2 — O Programa Mestre',
    },
    {
      text: 'Sucesso é igual a metas, e todo o resto é comentário. A habilidade mestre da vida é definir objetivos claros e fazer planos concretos para alcançá-los.',
      source_chapter: 'Cap. 4 — A Habilidade Mestre',
    },
    {
      text: 'A pessoa que aceita responsabilidade total por sua vida recusa-se a entreter emoções negativas. Ao aceitar responsabilidade pelo futuro, você libera os freios mentais do passado.',
      source_chapter: 'Cap. 6 — A Decisão Mestre',
    },
    {
      text: 'Pelo menos 85% do seu sucesso na vida será determinado pela sua capacidade de se relacionar bem com outras pessoas, seja no contexto pessoal ou profissional.',
      source_chapter: 'Cap. 8 — Dominando os Relacionamentos Humanos',
    },
    {
      text: 'Não importa qual seja a pergunta, o amor é a resposta. Os maiores realizadores são aqueles que continuamente demonstram amor, gentileza e afeto às pessoas ao redor.',
      source_chapter: 'Cap. 11 — O Poder do Amor',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Reprogramação do Autoconceito',
      icon: '🧠',
      color_theme: 'accent',
      description: 'Crie uma afirmação poderosa no presente sobre quem você quer ser e repita-a em voz alta pela manhã e à noite, com convicção e emoção.',
      template_text: 'Eu sou [QUALIDADE]. Eu atraio [RESULTADO DESEJADO]. Eu mereço [META ESPECÍFICA] e estou agindo diariamente para conquistá-la.',
      checklist: [
        'Escrevi minha afirmação pessoal em um cartão 3x5',
        'Li em voz alta com emoção ao acordar',
        'Li em voz alta com emoção antes de dormir',
        'Visualizei por 2 minutos o resultado sendo alcançado',
      ],
    },
    {
      title: 'Exercício 2 — Definição de Metas com os 12 Passos',
      icon: '🎯',
      color_theme: 'green',
      description: 'Escolha sua meta mais importante e aplique o sistema de 12 passos de Brian Tracy para criar um plano de ação concreto.',
      checklist: [
        'Escrevi minha meta principal com prazo específico',
        'Listei 3 benefícios tangíveis de alcançá-la',
        'Identifiquei os 3 maiores obstáculos',
        'Defini uma ação que posso executar hoje',
        'Compartilhei minha meta com alguém de confiança',
      ],
    },
    {
      title: 'Exercício 3 — Lista do Perdão Total',
      icon: '🔥',
      color_theme: 'orange',
      description: 'Libere emoções negativas que estão travando seu progresso. Escreva o nome de todas as pessoas que te magoaram e perdoe cada uma delas conscientemente.',
      checklist: [
        'Listei todas as pessoas que me magoaram',
        'Para cada nome, disse em voz alta: "Eu te perdoo por tudo"',
        'Identifiquei situações em que eu preciso me perdoar',
        'Substituí um pensamento negativo recorrente por um positivo',
      ],
    },
  ],
}

// ============================================================
// Book 2: In Pursuit of Elegance
// ============================================================

const book2: BookData = {
  slug: 'em-busca-da-elegancia',
  metadata: {
    title: 'Em Busca da Elegância',
    original_title: 'In Pursuit of Elegance: Why the Best Ideas Have Something Missing',
    author: 'Matthew E. May',
    year: 2009,
    category_slug: 'criatividade',
    category_label: 'Criatividade & Inovação',
    category_emoji: '🎨',
    reading_time_min: 13,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>De tempos em tempos, certos eventos, produtos e serviços capturam a atenção pública porque exibem um traço raro — <strong>elegância</strong>. A elegância tem o poder de cortar o ruído de fundo e entregar uma experiência profunda que muda mentes, abala mercados e altera nossas visões das coisas, muitas vezes para sempre.</p>
<p><strong>Matthew May</strong>, que passou quase uma década como consultor sênior na Universidade Toyota, revela que o aspecto mais notável da elegância é que <strong>o que não está lá é tão importante — senão mais importante — do que o que está</strong>. Ideias elegantes são sempre descomplicadas, mas isso não é tudo. Existem quatro elementos-chave que, combinados, criam a elegância.</p>

<div class="highlight-box">
  "O poder total da elegância é alcançado quando o máximo impacto é extraído com o mínimo de recursos. O que não está lá pode ser tão ou mais poderoso do que o que está." — Matthew May
</div>

<h2>Os Quatro Elementos da Elegância</h2>

<h3>1. Simetria</h3>
<p>A <strong>simetria</strong> é um princípio organizador na ciência, nos negócios e na sociedade. A natureza usa padrões simétricos em toda parte. Para que uma solução seja considerada elegante, ela precisa ser simétrica — deve funcionar em qualquer situação e sob quaisquer circunstâncias.</p>
<p>May apresenta exemplos fascinantes: quando Montana aboliu o limite de velocidade em 1995, permitindo que motoristas viajassem a qualquer velocidade que considerassem segura, as mortes no trânsito caíram. Quando o limite foi reimpostado em 2000, as fatalidades aumentaram mais de 111%. Da mesma forma, quando a Toyota reduziu as descrições de cargo de 100 para apenas 3 em uma fábrica problemática da GM, e instilou apenas dois ideais — <strong>respeito pelas pessoas e melhoria contínua</strong> — o absenteísmo caiu de 20% para 3% e a qualidade disparou.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Lição da simetria:</strong> Às vezes, o problema que você está tentando resolver não precisa de uma solução imposta de fora. Observe os padrões subjacentes e o que parece precisar de controle pode já estar funcionando bem.</div>
</div>

<h3>2. Sedução</h3>
<p>Somos todos naturalmente curiosos. Procuramos padrões em toda parte e prestamos atenção quando algo que esperamos estar lá não está. É por isso que <strong>soluções elegantes frequentemente têm uma peça que está faltando</strong>. A ausência dessa peça nos seduz a querer mais.</p>
<p>O exemplo perfeito é o lançamento do <strong>iPhone</strong> em 2007. Steve Jobs apresentou um telefone sem a única característica que todo outro celular tinha: um teclado físico. Os críticos previram o maior fracasso da Apple, mas a empresa fez apenas o anúncio na MacWorld — sem campanha publicitária multimilionária, sem comerciais, sem preços introdutórios. Mesmo assim, mais de 20 milhões de americanos expressaram interesse em comprar, independentemente do preço.</p>

<div class="highlight-box">
  "Foco significa dizer não a centenas de outras boas ideias que existem. Você precisa escolher com cuidado. Na verdade, tenho tanto orgulho de muitas coisas que não fizemos quanto das que fizemos." — Steve Jobs
</div>

<h3>3. Subtração</h3>
<p>Soluções elegantes são sempre descomplicadas e focadas. Elas vão direto ao ponto porque <strong>tudo que não agrega valor foi deliberadamente subtraído</strong>. Isso vai contra a natureza humana, pois nosso primeiro instinto é sempre adicionar mais e mais às coisas.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>In-N-Out Burger:</strong> Apenas 4 itens no cardápio oficial — mas um "cardápio secreto" permite personalização. A simplicidade cria mística e evita o "inchaço de funcionalidades".</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Lance Armstrong:</strong> Seu treinador substituiu sessões de 6 horas por 4 horas mais focadas, com cadência de pedalada mais alta. Menos treino, mais resultado — 7 vitórias no Tour de France.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>First Direct:</strong> Um banco sem agências, apenas por telefone. Subtrair a parte mais visível da operação bancária se tornou uma ideia elegante e sustentável com mais de 1,2 milhão de clientes.</div>
</div>

<p>Artistas entenderam o valor da subtração há séculos. Quando Michelangelo foi perguntado como criou a estátua de Davi, respondeu: <strong>"Vi Davi através da pedra, e simplesmente cinzelei tudo que não era Davi."</strong></p>

<h3>4. Sustentabilidade</h3>
<p>Ideias elegantes têm simplicidade incomum e poder surpreendente. Elas também são <strong>sustentáveis</strong> — podem ser mantidas indefinidamente, sem exigir compensações contínuas. A elegância é duradoura e atemporal, não bem-intencionada mas insustentável.</p>
<p>May conta a história de uma locadora de vídeo que enfrentava o problema de clientes não rebobinando as fitas. Em vez de multas, rewinders ou marcações, a solução elegante foi simplesmente <strong>alugar as fitas sem rebobinar</strong>. Todo mundo precisava rebobinar antes de assistir, então ninguém reclamava. Custo zero, justo para todos, sustentável e simétrico.</p>

<h2>O Inimigo da Elegância</h2>
<p>O inimigo da elegância não é a complexidade, mas o <strong>excesso</strong>. A maioria das empresas, quando enfrenta um problema, tem duas reações naturais: agir imediatamente (pegar a primeira ideia "boa o suficiente") e adicionar mais (mais regras, mais complicação). Ambas trabalham diretamente contra a busca pela elegância.</p>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Princípio Toyota — Genchi Genbutsu:</strong> "Vá e veja." Quando problemas surgem, observe o que está acontecendo em primeira mão. Tente ver o problema de diferentes perspectivas antes de agir.</div>
</div>

<h2>Conclusão</h2>
<p>A elegância não é questão de inteligência superior. É questão de <strong>diligência de cientista, atenção obsessiva aos detalhes e engenhosidade de artista</strong> dentro dos limites claros de um meio escolhido. A mensagem central de May é revolucionária em sua simplicidade: em um mundo onde tendemos a adicionar quando deveríamos subtrair, e a agir quando deveríamos observar, a busca pela elegância nos ensina que <strong>o máximo impacto vem do mínimo esforço</strong> — e que o que está faltando pode ser exatamente o que torna algo extraordinário.</p>

<div class="highlight-box">
  "A perfeição é alcançada não quando não há mais nada a adicionar, mas quando não resta mais nada a retirar." — Antoine de Saint-Exupéry
</div>`,
  mindmap_json: {
    center_label: 'EM BUSCA DA ELEGÂNCIA',
    center_sublabel: 'Máximo Impacto, Mínimo Esforço',
    branches: [
      {
        title: 'Simetria',
        icon: '🔄',
        items: [
          'Funciona em qualquer situação',
          'Padrões equilibrados e repetidos',
          'Menos regras, mais autonomia',
          'Exemplo: Toyota e Montana',
        ],
      },
      {
        title: 'Sedução',
        icon: '✨',
        items: [
          'O ausente atrai curiosidade',
          'Deixe algo para a imaginação',
          'Crie lacunas de conhecimento',
          'Exemplo: iPhone sem teclado',
        ],
      },
      {
        title: 'Subtração',
        icon: '✂️',
        items: [
          'Remova o que não agrega valor',
          'O inimigo é o excesso',
          'Menos pode ser revolucionário',
          'Exemplo: In-N-Out e Armstrong',
        ],
      },
      {
        title: 'Sustentabilidade',
        icon: '♻️',
        items: [
          'Ideias duradouras e atemporais',
          'Sem compensações contínuas',
          'Máximo efeito, mínimo esforço',
          'Exemplo: First Direct bank',
        ],
      },
      {
        title: 'Armadilhas a Evitar',
        icon: '⚠️',
        items: [
          'Agir antes de observar',
          'Adicionar em vez de subtrair',
          'Aceitar o "bom o suficiente"',
          'Conhecimento pode ser viés',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'O poder total da elegância é alcançado quando o máximo impacto é extraído com o mínimo de recursos. O que não está lá pode ser tão ou mais poderoso do que o que está.',
      source_chapter: 'Visão Geral — A Importância da Elegância',
    },
    {
      text: 'O inimigo da elegância não é a complexidade, mas o excesso. Quando você remove itens desnecessários para criar elegância, também obtém subprodutos muito úteis.',
      source_chapter: 'Elemento 3 — Subtração',
    },
    {
      text: 'Elegância requer a presença de complexidade. Assim como a luz requer escuridão e a confiança requer incerteza, sem complexidade não se pode falar em elegância.',
      source_chapter: 'Elemento 1 — Simetria',
    },
    {
      text: 'A perfeição é alcançada não quando não há mais nada a adicionar, mas quando não resta mais nada a retirar.',
      source_chapter: 'Elemento 3 — Subtração',
    },
    {
      text: 'Foco não significa dizer sim ao que você precisa focar. Significa dizer não a centenas de outras boas ideias. Você precisa escolher com cuidado.',
      source_chapter: 'Elemento 2 — Sedução',
    },
    {
      text: 'A tendência de pegar o que é "bom o suficiente" e implementar imediatamente, em vez de parar e procurar a melhor solução possível, trabalha diretamente contra a busca pela elegância.',
      source_chapter: 'Elemento 4 — Sustentabilidade',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Sua Lista de "Parar de Fazer"',
      icon: '🪞',
      color_theme: 'accent',
      description: 'Inspirado por Jim Collins: imagine que você herdou R$20 milhões mas tem apenas 10 anos de vida. O que você pararia de fazer? Identifique 3 coisas para subtrair da sua rotina esta semana.',
      checklist: [
        'Listei 3 atividades que não agregam valor à minha vida',
        'Eliminei ou reduzi pelo menos 1 atividade esta semana',
        'Redirecionei o tempo ganho para algo que realmente importa',
      ],
    },
    {
      title: 'Exercício 2 — Aplique a Subtração no Trabalho',
      icon: '✂️',
      color_theme: 'green',
      description: 'Escolha um projeto, processo ou produto e pergunte: "O que meu cliente adoraria que eu eliminasse, reduzisse ou parasse de adicionar?"',
      checklist: [
        'Identifiquei um processo com excesso de etapas',
        'Listei 3 elementos que podem ser removidos sem perda de valor',
        'Implementei uma simplificação concreta esta semana',
        'Medi o impacto da mudança no resultado final',
      ],
    },
    {
      title: 'Exercício 3 — Observe Antes de Agir',
      icon: '👁️',
      color_theme: 'orange',
      description: 'Pratique o genchi genbutsu da Toyota. Na próxima vez que enfrentar um problema, resista ao impulso de agir. Observe primeiro, pergunte "por que isso está acontecendo?" e só depois busque a solução.',
      checklist: [
        'Identifiquei um problema recorrente na minha rotina',
        'Observei a situação por 24 horas sem intervir',
        'Anotei 3 possíveis causas raiz do problema',
        'Formulei uma solução elegante baseada na observação',
      ],
    },
  ],
}

// ============================================================
// Book 3: Conversational Capital
// ============================================================

const book3: BookData = {
  slug: 'capital-conversacional',
  metadata: {
    title: 'Capital Conversacional',
    original_title: 'Conversational Capital: How to Create Stuff People Love to Talk About',
    author: 'Bertrand Cesvet, Tony Babinski e Eric Alper',
    year: 2008,
    category_slug: 'comunicacao',
    category_label: 'Comunicação',
    category_emoji: '🗣',
    reading_time_min: 13,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p><strong>Capital conversacional</strong> é a arte de reunir todos os elementos necessários para criar endossos positivos de boca a boca, construídos desde a base. É sobre injetar intensidade em produtos e serviços comuns para transformá-los em <strong>experiências que os consumidores amam e comentam com entusiasmo</strong>. Na prática, o capital conversacional é o Santo Graal para qualquer negócio que aspira à liderança.</p>
<p>Marcas com alto grau de capital conversacional sempre superam aquelas que não possuem essa vantagem competitiva. Isso é especialmente verdadeiro no cenário atual, onde a comunicação de massa está perdendo eficácia. Os consumidores se tornaram desconfiados do estilo "de cima para baixo" e respondem muito melhor às mensagens horizontais (de pessoa para pessoa) ou que borbulham "de baixo para cima".</p>

<div class="highlight-box">
  "Boca a boca é moeda valiosa. Como qualquer moeda, acreditamos que seu valor pode ser gerenciado. Construa-o adequadamente e você terá um ativo que aumenta o valor da sua marca. Ignore-o e você terá um passivo — mesmo investindo milhões em publicidade tradicional." — Cesvet, Babinski e Alper
</div>

<h2>Capital Conversacional vs. Buzz</h2>
<p>É crucial entender que capital conversacional é <strong>diferente de buzz</strong>:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Buzz é fabricado</strong> e precisa de cobertura de mídia para se espalhar. Capital conversacional é embutido na experiência e depende de endossos entre pares.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Buzz tem vida curta</strong> — as pessoas passam para a próxima novidade. Capital conversacional tem um lugar duradouro na mente dos consumidores.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Buzz é sobre fazer barulho.</strong> Capital conversacional é sobre fazer algo tão bem feito que tem integridade e significado completos.</div>
</div>

<h2>Os 8 Motores do Capital Conversacional</h2>
<p>O boca a boca positivo acontece quando certos fatores-chave estão presentes na história de uma marca. Esses fatores são chamados de <strong>motores do capital conversacional</strong> — ou "amplificadores de experiência".</p>

<h3>1. Rituais</h3>
<p>Comportamentos ou ritos específicos que repetidamente designam certas atividades como "preferidas" ou "interessantes". Exemplos: a interação dos palhaços do <strong>Cirque du Soleil</strong> com a plateia antes do show; a forma como consumidores comem biscoitos Oreo removendo uma das bolachas primeiro; a fatia de limão da cerveja Corona. Bons rituais emergem organicamente — de baixo para cima, não de cima para baixo.</p>

<h3>2. Ofertas Exclusivas</h3>
<p>Quando clientes podem co-criar a experiência que desejam. <strong>Starbucks</strong> permite que cada cliente especifique exatamente o sabor desejado. <strong>iTunes</strong> permite comprar faixas individuais. <strong>BMW</strong> permite configurar cada MINI Cooper de forma única. A exclusividade gera diferenciação poderosa.</p>

<h3>3. Mitos</h3>
<p>Narrativas de origem que encapsulam quem você é e os valores que defende. A <strong>Apple</strong> foi fundada por dois jovens sem dinheiro mas cheios de ideias — e transformou o ideal do pensamento independente em sua marca registrada. Mitos eficazes projetam o que sua marca fundamentalmente representa.</p>

<h3>4. Peculiaridades Sensoriais</h3>
<p>Itens que desafiam os sentidos de formas memoráveis. Os relógios <strong>Rolex</strong> são maiores e mais pesados, reforçando a percepção de valor. A <strong>Abercrombie & Fitch</strong> cria um ambiente anti-varejo com luz baixa e música alta. A <strong>Nordstrom</strong> tem um pianista no átrio e corredores amplos e iluminados.</p>

<h3>5. Ícones</h3>
<p>Signos e símbolos com associações mentais ricas e evocativas. A garrafa da <strong>Coca-Cola</strong>, as três listras da <strong>adidas</strong>, a lona azul e amarela do Cirque du Soleil. Mesmo uma marca tardia como a <strong>Target</strong> se posicionou como ícone do "chique acessível".</p>

<h3>6. Tribalismo</h3>
<p>Quando clientes sentem que pertencem a um clube exclusivo. A <strong>Harley-Davidson</strong> promove convenções pelo mundo. O <strong>Alamo Drafthouse</strong> reinventou o cinema permitindo que cinéfilos se reúnam, interajam e assistam filmes em um ambiente acolhedor. Tribos se formam quando pessoas se relacionam entre si — não quando uma empresa cria um programa de afinidade.</p>

<h3>7. Endossos</h3>
<p>Não é sobre celebridades pagas — é sobre encorajar consumidores a <strong>defender sua marca de forma livre e espontânea</strong>. Endosso entre pares é a forma mais persuasiva e poderosa de marketing que existe. Pessoas locais com boas experiências têm credibilidade genuína.</p>

<h3>8. Continuidade</h3>
<p>Credibilidade vem quando três fatores se alinham: <strong>quem você é</strong>, <strong>quem você diz ser</strong> e <strong>quem os outros dizem que você é</strong>. Quanto menor a distância entre esses três fatores, mais integrado você é e mais provável é que o boca a boca positivo esteja acontecendo. Reputação é sempre conquistada, nunca ditada.</p>

<div class="highlight-box">
  "Não basta mais entregar satisfação do cliente. As experiências precisam ser significativas. As pessoas não podem apenas gostar de uma experiência — elas precisam amá-la." — Cesvet, Babinski e Alper
</div>

<h2>Implementando o Capital Conversacional</h2>
<p>A implementação envolve quatro passos: <strong>montar a equipe certa</strong> (4-5 pessoas, multidisciplinar, colaborativa), <strong>realizar uma auditoria</strong> de capital conversacional (onde você está no espectro — do boca a boca negativo ao "sweet spot"?), <strong>projetar uma solução</strong> criativa e <strong>implementá-la</strong> em cinco estágios: empacotar ideias, construir protótipo, monitorar progresso, fazer o lançamento e melhorar continuamente.</p>

<h2>Conclusão</h2>
<p>Em um mundo onde o marketing tradicional perde eficácia a cada dia, o capital conversacional oferece uma alternativa poderosa e mensurável. A chave não é criar buzz artificial, mas <strong>projetar experiências tão significativas que as pessoas simplesmente não consigam parar de falar sobre elas</strong>. Usando os 8 motores de forma deliberada — rituais, ofertas exclusivas, mitos, peculiaridades sensoriais, ícones, tribalismo, endossos e continuidade — qualquer marca pode transformar consumidores satisfeitos em verdadeiros defensores apaixonados.</p>`,
  mindmap_json: {
    center_label: 'CAPITAL CONVERSACIONAL',
    center_sublabel: 'Crie Coisas Que as Pessoas Amam Comentar',
    branches: [
      {
        title: 'Experiência & Rituais',
        icon: '🎭',
        items: [
          'Rituais emergem de baixo para cima',
          'Ofertas exclusivas e co-criação',
          'Mitos de origem poderosos',
          'Peculiaridades sensoriais marcantes',
        ],
      },
      {
        title: 'Identidade & Comunidade',
        icon: '🏛️',
        items: [
          'Ícones visuais reconhecíveis',
          'Tribalismo entre consumidores',
          'Endossos autênticos de pares',
          'Senso de pertencimento exclusivo',
        ],
      },
      {
        title: 'Continuidade',
        icon: '🔗',
        items: [
          'Quem você é de verdade',
          'Quem você diz ser',
          'Quem os outros dizem que você é',
          'Alinhe os três fatores',
        ],
      },
      {
        title: 'CC vs. Buzz',
        icon: '⚡',
        items: [
          'Buzz é fabricado e efêmero',
          'CC é embutido na experiência',
          'CC é duradouro e autêntico',
          'CC depende de endosso entre pares',
        ],
      },
      {
        title: 'Implementação',
        icon: '🚀',
        items: [
          'Monte equipe multidisciplinar',
          'Faça auditoria de CC',
          'Projete solução criativa',
          'Implemente e melhore sempre',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Boca a boca é moeda valiosa. Construa-o adequadamente e você terá um ativo que aumenta o valor da sua marca. Ignore-o e terá um passivo — mesmo investindo milhões em publicidade.',
      source_chapter: 'Cap. 1 — Definindo Capital Conversacional',
    },
    {
      text: 'Buzz é fabricado e tem vida curta. Capital conversacional é embutido na experiência e depende de endossos autênticos entre pares — é duradouro e significativo.',
      source_chapter: 'Cap. 1 — Definindo Capital Conversacional',
    },
    {
      text: 'Faz mais sentido econômico investir em capital conversacional do que em marketing tradicional. O marketing tradicional apenas diz que o consumidor terá algo especial. O capital conversacional entrega.',
      source_chapter: 'Cap. 2 — Os 8 Motores do Capital Conversacional',
    },
    {
      text: 'Credibilidade vem quando se alinham três fatores: quem você é, quem você diz ser e quem os outros dizem que você é. Quanto menor a distância entre eles, mais forte o boca a boca positivo.',
      source_chapter: 'Cap. 2 — Motor 8: Continuidade',
    },
    {
      text: 'Os consumidores são exigentes, mas também podem ser perdoadores quando amam você. As experiências não podem mais ser apenas satisfatórias — para gerar conversa, as pessoas precisam amá-las.',
      source_chapter: 'Cap. 3 — Implementando Capital Conversacional',
    },
    {
      text: 'Capital conversacional depende de ousar ser diferente — e nadar em águas traiçoeiras sem salva-vidas. Você precisa ser duro consigo mesmo e positivo ao mesmo tempo.',
      source_chapter: 'Cap. 3 — Projetando uma Solução',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Auditoria dos 8 Motores',
      icon: '🔍',
      color_theme: 'accent',
      description: 'Avalie seu produto, serviço ou marca pessoal em cada um dos 8 motores do capital conversacional. Dê uma nota de 0 a 10 e identifique seus pontos fracos.',
      checklist: [
        'Avaliei cada um dos 8 motores com uma nota de 0 a 10',
        'Identifiquei os 2 motores mais fracos',
        'Listei uma ação concreta para fortalecer cada motor fraco',
        'Defini um prazo para implementar as melhorias',
      ],
    },
    {
      title: 'Exercício 2 — Crie um Ritual para Sua Marca',
      icon: '🎭',
      color_theme: 'green',
      description: 'Pense em como você pode introduzir um ritual na experiência do seu cliente. Algo que seja memorável, compartilhável e que emerja de forma natural.',
      checklist: [
        'Observei como meus melhores clientes já usam meu produto',
        'Identifiquei um comportamento que pode virar ritual',
        'Testei o ritual com 3 clientes esta semana',
        'Coletei feedback sobre a experiência',
      ],
    },
    {
      title: 'Exercício 3 — O Triângulo da Continuidade',
      icon: '🔺',
      color_theme: 'orange',
      description: 'Confronte a realidade: há distância entre quem você é, quem diz ser e quem os outros dizem que você é? Peça feedback honesto e identifique as lacunas.',
      checklist: [
        'Escrevi quem eu realmente sou (valores e práticas)',
        'Escrevi quem eu digo ser (mensagem e posicionamento)',
        'Pedi a 3 pessoas que descrevam como me veem',
        'Comparei as 3 respostas e identifiquei as lacunas',
      ],
    },
  ],
}

// ============================================================
// Book 4: The Change Function
// ============================================================

const book4: BookData = {
  slug: 'a-funcao-da-mudanca',
  metadata: {
    title: 'A Função da Mudança',
    original_title: 'The Change Function: Why Some Technologies Take Off and Others Crash and Burn',
    author: 'Pip Coburn',
    year: 2006,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 13,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Por que algumas tecnologias novas têm sucesso no mercado enquanto outras fracassam? Bilhões de dólares em investimentos dependem dessa pergunta. <strong>Pip Coburn</strong> revela que a resposta não está em determinar se a nova tecnologia é tecnicamente superior. Em vez disso, ela repousa diretamente na <strong>mentalidade de quem está desenvolvendo</strong> a tecnologia.</p>
<p>A maioria das indústrias tem uma <strong>mentalidade centrada no fornecedor</strong>: "se construirmos, eles virão". Mas produtos bem-sucedidos geralmente emergem de uma <strong>mentalidade centrada no usuário</strong>. Consumidores só adotam produtos novos quando a dor de adotar a nova solução é <strong>menor</strong> que a dor de conviver com a situação atual.</p>

<div class="highlight-box">
  "Não se trata de tornar a tecnologia disponível. Trata-se de tornar a tecnologia relevante — e tornar essa tecnologia relevante o mais indolor possível de adotar." — Pip Coburn
</div>

<h2>O Problema da Indústria de Tecnologia</h2>
<p>A indústria de tecnologia tem um problema embutido que todos tentam ignorar. Cerca de <strong>75% dos bilhões de dólares</strong> gastos anualmente em desenvolvimento de novas tecnologias são engavetados antes que esses produtos vejam a luz do dia. Os tecnologistas olham para os produtos revolucionários e afirmam que o sistema funciona bem. Eles se apoiam em duas leis:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Lei de Moore:</strong> Dispositivos eletrônicos sempre ficam mais baratos e poderosos ao longo do tempo, até se tornarem acessíveis para a maioria.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Lei de Grove:</strong> Se você criar uma tecnologia disruptiva 10 vezes melhor que suas predecessoras, o mercado a aceitará.</div>
</div>

<p>O problema é que a maioria dos consumidores <strong>não são tecnologistas</strong>. No mundo real, muitas pessoas odeiam mudança. Elas não querem ser educadas sobre como usar novas tecnologias. Simplesmente querem realizar as coisas que precisam da forma mais fácil possível.</p>

<h2>A Fórmula da Mudança</h2>
<p>Coburn apresenta uma equação poderosa:</p>
<p><strong>Crise > Esforço = Adoção</strong></p>
<p>Consumidores adotam novos produtos <strong>somente quando</strong> a dor da situação atual (a crise) é maior que o esforço total percebido para adotar a nova solução. Para desenvolver um produto de sucesso:</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Aumente a crise:</strong> Não comece com tecnologia legal. Comece identificando o que as pessoas atualmente detestam fazer. Encontre uma crise existente e amplifique-a.</div>
</div>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Reduza o esforço:</strong> Torne a adoção da nova tecnologia indolor. Consumidores querem tecnologia que funcione da forma como já pensam, não produtos que exijam reeducação.</div>
</div>

<h2>Estudos de Caso: Fracassos e Sucessos</h2>
<h3>Fracassos Tecnológicos</h3>

<div class="key-point">
  <div class="kp-num">❌</div>
  <div class="kp-text"><strong>Picturephones (1964):</strong> Previsto para gerar US$5 bilhões/ano para a AT&T. Nunca decolou porque não endereçava nenhuma crise real do consumidor.</div>
</div>

<div class="key-point">
  <div class="kp-num">❌</div>
  <div class="kp-text"><strong>Webvan:</strong> Avaliada em US$8 bilhões, prometia entregar supermercado em casa. Os consumidores não queriam aprender a comprar online — e valorizavam estar fisicamente na loja.</div>
</div>

<div class="key-point">
  <div class="kp-num">❌</div>
  <div class="kp-text"><strong>Iridium/Globalstar:</strong> Gastaram juntos US$5,7 bilhões em comunicação global por satélite. Uma solução procurando um problema para resolver.</div>
</div>

<h3>Sucessos Tecnológicos</h3>

<div class="key-point">
  <div class="kp-num">✅</div>
  <div class="kp-text"><strong>TVs de Tela Plana:</strong> Coincidem com a chegada do HD. Simplesmente plugam e funcionam — dor de adoção praticamente zero.</div>
</div>

<div class="key-point">
  <div class="kp-num">✅</div>
  <div class="kp-text"><strong>E-mail Móvel Empresarial:</strong> Permite acessar conhecimento e resolver problemas em tempo real. Simples de usar, endereça a crise de estar desconectado.</div>
</div>

<div class="key-point">
  <div class="kp-num">✅</div>
  <div class="kp-text"><strong>Salesforce.com:</strong> Trabalha ao lado dos clientes para desenvolver software que eles realmente querem usar. Mentalidade iterativa e intensamente focada no usuário.</div>
</div>

<h2>As 10 Perguntas Essenciais</h2>
<p>Coburn apresenta 10 perguntas que todo desenvolvedor de tecnologia deveria responder. As respostas revelam se a mentalidade é centrada no fornecedor ou no usuário:</p>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Pergunta-chave:</strong> "Qual é a crise específica do usuário que você pretende resolver? Que serviço você está vendendo?" Se a equipe fica confusa com essa pergunta, é um sinal vermelho gigante.</div>
</div>

<h2>Colocando a Função da Mudança em Ação</h2>
<p>Coburn propõe três ações concretas para aumentar as chances de desenvolver tecnologias bem-sucedidas:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Use iteração e co-design com consumidores:</strong> Tente coisas pequenas e baratas para descobrir rapidamente o que não funciona. Protótipos rápidos com pessoas reais evitam erros caros.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Crie crises-guia e desenvolva soluções reais:</strong> Especifique detalhadamente as crises dos consumidores e teste soluções. Contrate sociólogos, consultores de mudança e futuristas.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Observe o comportamento do consumidor:</strong> Crie personas detalhadas. Faça membros da equipe viverem como essas personas por um mês. Isso gera a empatia que sustenta grandes produtos.</div>
</div>

<div class="highlight-box">
  "Você só será acidentalmente bem-sucedido se seu foco for no que pode criar. O sucesso sistêmico vem para aqueles que conseguem ver o mundo pelos olhos dos outros — entender suas crises e ajudá-los a encontrar formas menos dolorosas de mudar." — Pip Coburn
</div>

<h2>Conclusão</h2>
<p>"A Função da Mudança" é um chamado para que a indústria de tecnologia — e qualquer pessoa criando produtos ou serviços — abandone a mentalidade de "construa e eles virão". O sucesso comercial não é imprevisível nem loteria. É o resultado previsível de <strong>entender profundamente a crise do usuário e tornar a adoção o mais indolor possível</strong>. Quando a crise supera o esforço, a mudança acontece naturalmente.</p>`,
  mindmap_json: {
    center_label: 'A FUNÇÃO DA MUDANÇA',
    center_sublabel: 'Crise > Esforço = Adoção',
    branches: [
      {
        title: 'A Equação',
        icon: '📐',
        items: [
          'Crise deve superar o esforço',
          'Dor atual vs. dor da mudança',
          'Consumidores odeiam mudar',
          'Relevância supera tecnologia',
        ],
      },
      {
        title: 'Mentalidade Errada',
        icon: '🚫',
        items: [
          '"Se construirmos, eles virão"',
          'Lei de Moore não é suficiente',
          'Lei de Grove não garante adoção',
          '75% dos produtos fracassam',
        ],
      },
      {
        title: 'Mentalidade Certa',
        icon: '✅',
        items: [
          'Centrada no usuário',
          'Identifique crises existentes',
          'Minimize dor de adoção',
          'Iteração e co-design',
        ],
      },
      {
        title: 'Fracassos Clássicos',
        icon: '💥',
        items: [
          'Picturephones: sem crise real',
          'Webvan: alto esforço de adoção',
          'Iridium: solução sem problema',
          'Tablet PCs: teclado bastava',
        ],
      },
      {
        title: 'Ações Práticas',
        icon: '🛠️',
        items: [
          'Prototipe rápido e barato',
          'Observe comportamento real',
          'Crie personas detalhadas',
          'Contrate especialistas em mudança',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Não se trata de tornar a tecnologia disponível. Trata-se de tornar a tecnologia relevante e tornar essa tecnologia relevante o mais indolor possível de adotar.',
      source_chapter: 'Cap. 1 — Conceitos Essenciais da Função da Mudança',
    },
    {
      text: 'Cerca de 75% do dinheiro gasto em desenvolvimento de produtos resulta em produtos que não têm sucesso comercial. A indústria aceita isso como normal — mas não deveria.',
      source_chapter: 'Cap. 1 — Conceitos Essenciais da Função da Mudança',
    },
    {
      text: 'Consumidores adotam novas tecnologias somente quando a dor de adotar a nova solução é menor que a dor de conviver com o status quo. Não importa quão avançada seja a tecnologia.',
      source_chapter: 'Cap. 1 — Conceitos Essenciais da Função da Mudança',
    },
    {
      text: 'Há muitos que preferem pensar que o sucesso comercial das tecnologias é imprevisível. Isso fornece uma ótima justificativa para o fracasso: "criamos tecnologia legal, mas a aplicação nunca apareceu".',
      source_chapter: 'Cap. 2 — Estudos de Caso',
    },
    {
      text: 'Cada produto segundo seu fabricante é fácil de usar. Mas tantos produtos que deveriam ser fáceis simplesmente não são. O "fator exasperação" faz muitos potenciais compradores irem embora para nunca mais voltar.',
      source_chapter: 'Cap. 3 — As 10 Perguntas',
    },
    {
      text: 'Você só será acidentalmente bem-sucedido se seu foco for no que pode criar. O sucesso sistêmico vem para aqueles que veem o mundo pelos olhos dos outros.',
      source_chapter: 'Cap. 4 — Colocando a Função da Mudança em Ação',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Mapeie a Crise do Seu Usuário',
      icon: '🔍',
      color_theme: 'accent',
      description: 'Identifique a crise real que seu produto ou serviço resolve. Pergunte-se: "Qual dor meu cliente sente HOJE que é tão grande que ele está disposto a mudar?"',
      template_text: 'A crise do meu usuário é [DOR ESPECÍFICA]. A dor de adotar minha solução é [LISTA DE ESFORÇOS]. A crise é maior que o esforço? [SIM/NÃO].',
      checklist: [
        'Descrevi a crise do meu usuário em uma frase',
        'Listei 3 dores de adoção do meu produto',
        'Comparei crise vs. esforço honestamente',
        'Identifiquei uma forma de reduzir a dor de adoção',
      ],
    },
    {
      title: 'Exercício 2 — Observe Antes de Construir',
      icon: '👀',
      color_theme: 'green',
      description: 'Saia do escritório e observe como seus potenciais usuários resolvem o problema que você quer atacar. Não pergunte — observe. Anote tudo.',
      checklist: [
        'Observei 3 pessoas usando a solução atual (concorrente ou manual)',
        'Anotei frustrações e workarounds que elas fazem',
        'Identifiquei uma dor que elas nem percebem que têm',
        'Usei as observações para ajustar minha proposta',
      ],
    },
    {
      title: 'Exercício 3 — O Teste das 10 Perguntas',
      icon: '⚡',
      color_theme: 'orange',
      description: 'Aplique as 10 perguntas de Pip Coburn ao seu próprio projeto. Responda honestamente e identifique se sua mentalidade é centrada no fornecedor ou no usuário.',
      checklist: [
        'Respondi todas as 10 perguntas por escrito',
        'Identifiquei respostas que revelam mentalidade de fornecedor',
        'Reformulei pelo menos 2 respostas com foco no usuário',
        'Compartilhei as respostas com um colega para validação',
      ],
    },
  ],
}

// ============================================================
// Book 5: Collaboration
// ============================================================

const book5: BookData = {
  slug: 'colaboracao',
  metadata: {
    title: 'Colaboração',
    original_title: 'Collaboration: How Leaders Avoid the Traps, Create Unity, and Reap Big Results',
    author: 'Morten Hansen',
    year: 2009,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Todo mundo ama a ideia de colaboração, mas o objetivo às vezes se confunde. O propósito da colaboração <strong>não é simplesmente derrubar silos e fazer as pessoas trabalharem juntas</strong>. Para valer a pena, a colaboração precisa gerar resultados. Precisa ser disciplinada e eficaz. <strong>Morten Hansen</strong>, professor em Berkeley e ex-professor em Harvard, apresenta um sistema prático de <strong>colaboração disciplinada</strong> que amplifica os resultados individuais — enquanto a colaboração mal feita pode ser pior que nenhuma colaboração.</p>

<div class="highlight-box">
  "A ideia de colaboração disciplinada pode ser resumida em uma frase: a prática de liderança de avaliar adequadamente quando colaborar (e quando não colaborar) e instilar nas pessoas tanto a disposição quanto a habilidade de colaborar quando necessário." — Morten Hansen
</div>

<h2>Os 3 Passos da Colaboração Disciplinada</h2>

<h3>Passo 1: Avalie as Oportunidades</h3>
<p>Pergunte: <strong>"Qual é o potencial positivo da colaboração?"</strong> Lembre-se: o verdadeiro objetivo não é fazer as pessoas trabalharem juntas, mas gerar resultados melhores. Os três benefícios financeiros potenciais são:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Inovação:</strong> Ao colaborar com pessoas diferentes, você pode criar inovações melhores do que qualquer um geraria sozinho.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Crescimento de vendas:</strong> Aumente receitas por cross-selling — uma unidade vende aos clientes da outra. Produtos podem ser agrupados em soluções.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Eficiência operacional:</strong> Reduza custos e melhore a qualidade das decisões transferindo soluções de uma parte do negócio para outra.</div>
</div>

<p>Hansen apresenta a fórmula do <strong>Prêmio de Colaboração</strong>: PC = Retorno do Projeto − Custos de Oportunidade − Custos de Colaboração. Se o resultado for positivo, colabore. Se for negativo, diga não.</p>

<h3>Passo 2: Identifique as 4 Barreiras</h3>
<p>Uma vez que você decide que vale a pena colaborar, pergunte: <strong>"Quais são as barreiras prováveis?"</strong> Quatro barreiras surgem repetidamente:</p>

<div class="key-point">
  <div class="kp-num">🚫</div>
  <div class="kp-text"><strong>Barreira "Não inventado aqui":</strong> As pessoas não buscam ajuda externa. Cultura insular, medo de admitir problemas, autossuficiência valorizada demais.</div>
</div>

<div class="key-point">
  <div class="kp-num">🚫</div>
  <div class="kp-text"><strong>Barreira do Acúmulo:</strong> As pessoas retêm informações, ajuda e esforço. Competição interna, falta de incentivos, "conhecimento é poder".</div>
</div>

<div class="key-point">
  <div class="kp-num">🚫</div>
  <div class="kp-text"><strong>Barreira da Busca:</strong> É difícil encontrar quem tem o que você precisa. Empresas grandes, distância física, sobrecarga de informação.</div>
</div>

<div class="key-point">
  <div class="kp-num">🚫</div>
  <div class="kp-text"><strong>Barreira da Transferência:</strong> Mesmo com boa vontade, é difícil transferir conhecimento tácito. Vínculos fracos entre unidades impedem comunicação efetiva.</div>
</div>

<h3>Passo 3: Aplique as 3 Alavancas</h3>
<p>Com as barreiras identificadas, use uma combinação de três alavancas para superá-las:</p>

<h3>Alavanca 1: Unificação</h3>
<p>Crie um <strong>objetivo unificador central</strong> que leve as pessoas a se comprometerem com uma causa maior que seus objetivos individuais. Um bom objetivo unificador atende a quatro critérios: articula um destino comum, é simples e concreto, desperta paixão e coloca a competição do lado de fora. Exemplos: "Coloque um homem na Lua" (Kennedy); "Seja #1 ou #2 em todo negócio globalmente" (Welch).</p>

<h3>Alavanca 2: Gestão em T</h3>
<p>A <strong>gestão em T</strong> significa que cada gestor precisa entregar resultados em duas dimensões: a <strong>vertical</strong> (performance da sua própria unidade) e a <strong>horizontal</strong> (resultados gerados por colaboração entre unidades). Tipicamente, 15-20% do tempo é dedicado à colaboração entre unidades.</p>
<p>Para expandir a gestão em T: mude o sistema de recompensas (50% do bônus baseado em contribuições entre unidades), use critérios de promoção em T, recrute gestores em T e treine para comportamento colaborativo.</p>

<div class="highlight-box">
  "A solução não é fazer as pessoas colaborarem mais, mas fazer as pessoas certas colaborarem nos projetos certos." — Morten Hansen
</div>

<h3>Alavanca 3: Redes Ágeis</h3>
<p>Empresas colaborativas funcionam com <strong>redes</strong> — relacionamentos informais que cortam todas as linhas formais de hierarquia. Hansen desmonta quatro mitos sobre networking e apresenta seis regras:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Construa para fora, não para dentro:</strong> Conecte-se com pessoas de outras áreas e de fora da empresa.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Construa uma rede diversa, não grande:</strong> Qualidade supera quantidade. Busque pessoas com expertise diferente da sua.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Vínculos fracos são surpreendentemente melhores:</strong> Conhecer muitas pessoas que você contata raramente é mais útil que poucos amigos íntimos.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Desenvolva pontes:</strong> Conecte-se com pessoas que são nós centrais em diferentes redes. Elas podem fazer as conexões certas para você.</div>
</div>

<h2>Liderança Colaborativa</h2>
<p>Para que a colaboração disciplinada funcione, líderes precisam dar o exemplo com três comportamentos: <strong>redefinir sucesso</strong> para metas maiores (não agendas pessoais estreitas), <strong>envolver outros</strong> em decisões inclusivas e <strong>ser responsável</strong> — assumir responsabilidade pelos erros e exigir o mesmo dos outros.</p>
<p>Hansen identifica cinco barreiras pessoais à liderança colaborativa: fome de poder, arrogância, defensividade, medo e ego. Superar essas barreiras é o primeiro passo para criar uma cultura genuinamente colaborativa.</p>

<h2>Conclusão</h2>
<p>Colaboração mal feita é pior que nenhuma colaboração. O segredo é a <strong>disciplina</strong>: avaliar quando colaborar, identificar as barreiras específicas da sua organização e aplicar as alavancas certas para superá-las. O resultado — combinar performance descentralizada com performance colaborativa — é difícil de superar. E como Hansen ressalta, isso não se aplica apenas a corporações: governos, ONGs, escolas, hospitais e qualquer organização humana pode colher os frutos da colaboração disciplinada.</p>

<div class="highlight-box">
  "Colaboração ruim é pior que nenhuma colaboração. Funcionários correm de reunião em reunião para coordenar trabalho, mas muito pouco é realizado. Infighting consome o trabalho. A pergunta essencial é: qual é a diferença entre boa e má colaboração?" — Morten Hansen
</div>`,
  mindmap_json: {
    center_label: 'COLABORAÇÃO',
    center_sublabel: '3 Passos da Colaboração Disciplinada',
    branches: [
      {
        title: 'Avalie Oportunidades',
        icon: '🔍',
        items: [
          'Inovação por colaboração',
          'Cross-selling entre unidades',
          'Eficiência operacional',
          'Calcule o Prêmio de Colaboração',
        ],
      },
      {
        title: '4 Barreiras',
        icon: '🚧',
        items: [
          '"Não inventado aqui"',
          'Acúmulo de informações',
          'Dificuldade de busca',
          'Problemas de transferência',
        ],
      },
      {
        title: 'Alavanca: Unificação',
        icon: '🎯',
        items: [
          'Objetivo unificador central',
          'Simples, concreto, apaixonante',
          'Competição do lado de fora',
          'Linguagem de colaboração',
        ],
      },
      {
        title: 'Alavanca: Gestão em T',
        icon: '📊',
        items: [
          'Vertical + horizontal',
          'Bônus por contribuição entre unidades',
          'Promoção por comportamento em T',
          'Recrute colaboradores naturais',
        ],
      },
      {
        title: 'Alavanca: Redes Ágeis',
        icon: '🌐',
        items: [
          'Construa para fora',
          'Diversidade supera tamanho',
          'Vínculos fracos são valiosos',
          'Desenvolva pontes entre redes',
        ],
      },
      {
        title: 'Liderança Colaborativa',
        icon: '👑',
        items: [
          'Redefina sucesso em metas maiores',
          'Tome decisões inclusivas',
          'Assuma responsabilidade total',
          'Supere ego, medo e arrogância',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'O verdadeiro objetivo da colaboração não é fazer as pessoas trabalharem juntas. É gerar resultados melhores. Colaboração disciplinada amplifica resultados individuais.',
      source_chapter: 'Passo 1 — Avalie as Oportunidades',
    },
    {
      text: 'A chave para ser bem-sucedido com colaboração é saber quando dizer não a ela. Se você seleciona projetos que não têm caso de negócio sólido, aumenta as chances dos projetos que aceita serem vencedores.',
      source_chapter: 'Passo 1 — Avalie as Oportunidades',
    },
    {
      text: 'A solução não é fazer as pessoas colaborarem mais, mas fazer as pessoas certas colaborarem nos projetos certos.',
      source_chapter: 'Passo 3 — Alavanca 2: Gestão em T',
    },
    {
      text: 'Diferentes situações têm diferentes barreiras. Não avaliar quais barreiras existem é o mesmo que atirar dardos no escuro — você não tem ideia do que está acertando.',
      source_chapter: 'Passo 2 — As 4 Barreiras',
    },
    {
      text: 'Quando se trata de networking, vínculos fracos são surpreendentemente melhores que vínculos fortes. Conhecer muitas pessoas que você contata raramente forma pontes para recursos que você não acessa normalmente.',
      source_chapter: 'Passo 3 — Alavanca 3: Redes Ágeis',
    },
    {
      text: 'Colaboração ruim é pior que nenhuma colaboração. Funcionários correm de reunião em reunião, infighting consome o trabalho. Em tempos difíceis, a capacidade de se unir pode ser a diferença entre sobreviver ou não.',
      source_chapter: 'Introdução — Colaboração Disciplinada',
    },
    {
      text: 'Líderes colaborativos redefinem sucesso de agendas pessoais estreitas para metas maiores. Envolvem outros em decisões inclusivas e assumem responsabilidade pelos erros da equipe.',
      source_chapter: 'Liderança Colaborativa',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Calcule Seu Prêmio de Colaboração',
      icon: '📐',
      color_theme: 'accent',
      description: 'Para o próximo projeto colaborativo que você considerar, aplique a fórmula: PC = Retorno - Custos de Oportunidade - Custos de Colaboração. Decida se vale a pena.',
      template_text: 'Retorno estimado: [R$X]. Custo de oportunidade: [R$Y]. Custo de colaboração: [R$Z]. Prêmio de Colaboração: [R$X - R$Y - R$Z].',
      checklist: [
        'Estimei o retorno potencial do projeto colaborativo',
        'Calculei o custo de oportunidade (o que deixo de fazer)',
        'Estimei o custo de colaboração (tempo, conflitos, atrasos)',
        'Tomei a decisão: colaborar ou dizer não',
      ],
    },
    {
      title: 'Exercício 2 — Diagnóstico das 4 Barreiras',
      icon: '🔍',
      color_theme: 'green',
      description: 'Avalie sua equipe ou organização nas 4 barreiras de colaboração. Identifique qual barreira é a mais forte e planeje como superá-la.',
      checklist: [
        'Avaliei a barreira "não inventado aqui" (nota 1-10)',
        'Avaliei a barreira do acúmulo (nota 1-10)',
        'Avaliei a barreira da busca (nota 1-10)',
        'Avaliei a barreira da transferência (nota 1-10)',
        'Identifiquei a barreira mais forte e planejei uma ação',
      ],
    },
    {
      title: 'Exercício 3 — Construa Sua Rede em T',
      icon: '🌐',
      color_theme: 'orange',
      description: 'Analise sua rede profissional atual. Ela é voltada para dentro ou para fora? É diversa ou homogênea? Identifique 3 pessoas de áreas diferentes para se conectar esta semana.',
      checklist: [
        'Mapeei minha rede atual (quantas pessoas, de onde são)',
        'Identifiquei se minha rede é interna ou externa demais',
        'Listei 3 pessoas de áreas diferentes para me conectar',
        'Iniciei contato com pelo menos 1 pessoa esta semana',
      ],
    },
  ],
}

// ============================================================
// Insertion Function
// ============================================================

async function insertBook(book: BookData, sortOrder: number) {
  console.log(`\n📖 Processing: ${book.metadata.title} (${book.slug})`)

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
  console.log('  RESUMOX — Inserting 5 New Books (Batch 6)')
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
