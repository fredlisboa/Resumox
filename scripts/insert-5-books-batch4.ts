#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content (Batch 4)
 * Books: Direct From Dell, IACOCCA, Think Big Act Small, Flip the Funnel, Get Motivated
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
// Book 1: Direct From Dell
// ============================================================

const book1: BookData = {
  slug: 'direto-da-dell',
  metadata: {
    title: 'Direto da Dell',
    original_title: 'Direct From Dell: Strategies That Revolutionized an Industry',
    author: 'Michael Dell',
    year: 1999,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A Dell Computer cresceu de uma startup em 1984 (com US$ 1.000 de capital) para se tornar a segunda maior fabricante e vendedora de computadores do mundo (com mais de US$ 18 bilhões em faturamento anual) através de sua capacidade de <strong>abordar as coisas de maneira diferente</strong> de todos os outros no mesmo setor. A vantagem competitiva da Dell foi construída em torno de oito estratégias específicas que, embora demonstradas na indústria de computadores, são <strong>igualmente aplicáveis em todos os campos e indústrias</strong>.</p>
<p><strong>Michael Dell</strong> mostra que o sucesso não vem de fórmulas mágicas, mas de curiosidade para pensar criativamente e compromisso para agir com base no que se observa. Em uma era de novos modelos de negócios digitais, essas estratégias competitivas são ainda mais importantes porque são flexíveis e poderosas o suficiente para se adaptarem às exigências do novo mundo conectado.</p>

<div class="highlight-box">
  "A maior ameaça à Dell não viria de um concorrente. Viria do nosso próprio pessoal. Não tem sido fácil manter o espírito empreendedor que caracterizou a Dell à medida que nossa empresa cresceu." — Michael Dell
</div>

<h2>Estratégia 1: Cultura Veloz com Mentalidade de Desafiante</h2>
<p>Empresas com uma cultura ágil e flexível têm uma vantagem competitiva significativa. Para construir essa cultura, a Dell estabeleceu cinco pilares fundamentais:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Objetivo comum que todos entendem:</strong> Paixão e lealdade nos negócios são geradas quando as pessoas sentem que fazem parte de algo significativo. O objetivo comum da Dell é a crença de que o modelo de vendas diretas é superior.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Contratar à frente dos objetivos:</strong> Ao contratar pessoas com base na sua capacidade de crescer e se desenvolver, em vez do currículo passado, gera-se uma energia tremenda na organização.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Gestores imersos e pessoalmente envolvidos:</strong> Os melhores times de gestão estão intimamente envolvidos nos detalhes das operações diárias, encontrando-se com clientes e colaboradores constantemente.</div>
</div>

<h2>Estratégia 2: Senso de Propriedade</h2>
<p>Para construir uma empresa onde todos ajam como donos, a Dell implementou oito práticas essenciais: tornar o aprendizado uma necessidade, encorajar pensamento inovador, permitir experimentação inteligente, estar constantemente em busca de melhorias, conhecer os problemas o mais rápido possível, comunicar o que está acontecendo, <strong>banir completamente hierarquias</strong> e definir um único objetivo que todos possam seguir.</p>
<p>A Dell usa o <strong>Retorno sobre Capital Investido (ROIC)</strong> como sua métrica universal. Cada programa de compensação está vinculado a essa única métrica que todos entendem e trabalham para melhorar. As ações específicas incluem reduzir tempos de ciclo, eliminar desperdício, aumentar vendas e acelerar a cobrança de recebíveis.</p>

<div class="highlight-box">
  "Nosso sucesso se deve, em parte, não apenas à capacidade, mas à disposição de olhar as coisas de maneira diferente. A Dell é prova de que pessoas podem aprender a reconhecer e aproveitar oportunidades que outros estão convencidos de que não existem." — Michael Dell
</div>

<h2>Estratégia 3: Entender a Experiência do Cliente</h2>
<p>Se você ouvir com atenção, os clientes dirão como entregar mais valor resolvendo seus problemas. A Dell desenvolveu seis abordagens para isso: aprender sobre experiências de clientes fora do seu setor, desenvolver produtos da perspectiva do cliente, <strong>conhecer seus clientes intimamente</strong>, tornar-se o advogado do seu cliente, equilibrar alta tecnologia com toque pessoal e atender a um mercado de apenas um cliente.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>As três regras do modelo de vendas diretas:</strong> 1) Conheça seus clientes. 2) Saiba o que os clientes querem, do que não gostam e o que mais valorizam. 3) Saiba o que você pode fazer para ajudá-los a serem mais eficazes.</div>
</div>

<h2>Estratégia 4: Agregar Valor e Superar Expectativas</h2>
<p>Estar perto do cliente não é suficiente. Você precisa usar essas informações de forma inteligente para formar uma <strong>parceria</strong> com eles. Em vez de focar apenas em vender mais, olhe para como os clientes estão usando seus produtos. A partir dessa perspectiva mais ampla, identifique coisas que você pode fazer para economizar tempo e recursos do cliente.</p>
<p>Se você puder economizar dinheiro para eles, deixe a maior parte dos lucros adicionais ir para o resultado do cliente, não para o seu. Isso fortalece enormemente o valor da parceria e cria a situação definitiva de ganha-ganha.</p>

<h2>Estratégia 5: Alianças Fortes com Fornecedores</h2>
<p>A Dell demonstrou que quanto menos fornecedores você puder trabalhar, melhor. Seus sistemas serão mais simples, o volume de negócios mais significativo e o relacionamento mais eficiente. Para forjar alianças fortes:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Defina onde você agrega valor:</strong> Sua competência central será aquele aspecto do negócio onde você pode agregar mais valor do que qualquer outro. Em todas as outras áreas, recorra a especialistas.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Invista no sucesso mútuo:</strong> Em vez de usar o processo tradicional de licitação para obter o menor preço possível, traga fornecedores para seu planejamento de negócios. Confiança gera melhor valor a longo prazo.</div>
</div>

<h2>Estratégia 6: Integração Virtual com Parceiros</h2>
<p>Tratar fornecedores e parceiros como parte da Dell permite alavancar forças coletivas para obter vantagem competitiva para todos. O conceito de <strong>integração virtual</strong> significa trabalhar juntos (através da troca de ativos de informação) para melhorar a experiência total do cliente.</p>
<p>Em vez de ter fornecedores focados em quanto produto vão enviar (pensamento convencional de oferta/demanda), faça-os focar em quão rapidamente aquele produto se moverá pelo processo de fabricação até as mãos do consumidor. Troque informação por estoque — dê aos fornecedores melhor informação sobre a demanda diária para que possam prever com mais precisão.</p>

<h2>Estratégia 7: Diferenciação Sustentável</h2>
<p>Grandes negócios se orientam em torno de um ponto de diferenciação — uma vantagem competitiva sustentável que nenhum de seus concorrentes consegue igualar. Para alcançar isso:</p>

<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Foque nas necessidades do cliente, não na concorrência:</strong> Seus concorrentes representam o passado — o que as pessoas costumavam aceitar. Você precisa focar em onde os clientes estão hoje e o que provavelmente demandarão no futuro.</div>
</div>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Use as forças do concorrente contra ele:</strong> Estude o padrão de lucratividade do seu setor. Onde os concorrentes ganham dinheiro? Crie uma proposta de valor que ele não conseguirá responder sem reduzir seus próprios lucros — um judo financeiro.</div>
</div>

<h2>Estratégia 8: Prosperar com as Mudanças da Economia Conectada</h2>
<p>A Internet representa uma mudança significativa na forma de fazer negócios — e uma grande oportunidade. Não adianta se sentir desconfortável com a mudança, porque ela é uma constante. Portanto, não veja a mudança como uma ameaça. Olhe para ela como uma oportunidade e abrace-a como parte da sua estratégia competitiva.</p>
<p>A Internet nivela o campo de jogo — grandes empresas estão em igualdade de condições com pequenos operadores, reduzindo custos de comunicação, custos transacionais e abrindo novos caminhos de competição. Na era da Internet, o valor competitivo agora deriva de: facilidade de execução, personalização, conveniência e facilidade de lidar com sua empresa.</p>

<div class="highlight-box">
  "As três regras de ouro da Dell são: 1) Desdém pelo estoque, 2) Sempre ouça o cliente, e 3) Nunca venda indiretamente." — Michael Dell
</div>

<h2>Conclusão</h2>
<p>A história da Dell é a prova viva de que não é preciso ser um gênio ou visionário para pensar de forma não convencional. Você só precisa de um <strong>framework e um sonho</strong>. O sucesso não é estático — e sua cultura também não deveria ser. As oito estratégias de Michael Dell formam um sistema integrado onde cultura, pessoas, clientes, fornecedores e tecnologia trabalham em harmonia para criar valor sustentável.</p>
<p>O verdadeiro poder dessas estratégias está em sua simplicidade e adaptabilidade. Elas funcionam tanto para uma startup de garagem quanto para uma empresa de bilhões de dólares, porque se baseiam em princípios universais: ouvir, aprender, adaptar e executar com excelência.</p>

<div class="highlight-box">
  "Criamos uma parceria de confiança e comunicação entre nossos aliados mais significativos: nosso pessoal, nossos clientes e nossos fornecedores. Juntos, enfrentamos o futuro com um senso saudável de aventura, amor pelo aprendizado e disposição para abraçar a mudança." — Michael Dell
</div>`,

  mindmap_json: {
    center_label: 'DIRETO DA DELL',
    center_sublabel: '8 Estratégias que Revolucionaram uma Indústria',
    branches: [
      {
        title: 'Cultura & Pessoas',
        icon: '🏢',
        items: [
          'Cultura ágil com atitude desafiante',
          'Contratar à frente dos objetivos',
          'Banir hierarquias completamente',
          'Gestores imersos no dia a dia',
        ],
      },
      {
        title: 'Senso de Propriedade',
        icon: '🔑',
        items: [
          'Todos agem como donos',
          'ROIC como métrica universal',
          'Experimentação inteligente permitida',
          'Comunicação transparente e constante',
        ],
      },
      {
        title: 'Foco no Cliente',
        icon: '🎯',
        items: [
          'Conhecer clientes intimamente',
          'Desenvolver da perspectiva do cliente',
          'Mercado de um único cliente',
          'Superar expectativas sempre',
        ],
      },
      {
        title: 'Parcerias Estratégicas',
        icon: '🤝',
        items: [
          'Menos fornecedores = mais eficiência',
          'Integração virtual com parceiros',
          'Trocar informação por estoque',
          'Sucesso mútuo com fornecedores',
        ],
      },
      {
        title: 'Diferenciação',
        icon: '⚡',
        items: [
          'Foco no cliente, não na concorrência',
          'Judo financeiro contra competidores',
          'Execução consistente e disciplinada',
          'Modelo de vendas diretas',
        ],
      },
      {
        title: 'Economia Conectada',
        icon: '🌐',
        items: [
          'Internet como oportunidade de crescimento',
          'Integração virtual em tempo real',
          'Mudança como vantagem competitiva',
          'Hipercrescimento sustentável',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'A maior ameaça à Dell não viria de um concorrente — viria do próprio pessoal. Manter o espírito empreendedor à medida que a empresa cresce é o verdadeiro desafio da liderança.',
      source_chapter: 'Estratégia 1 — Cultura de Desafiante',
    },
    {
      text: 'Os funcionários mais bem-sucedidos devem ser recompensados com uma redução, não uma expansão, de suas responsabilidades. O trabalho original cresceu tanto que agora pode empregar duas pessoas.',
      source_chapter: 'Estratégia 1 — Crescimento Pessoal',
    },
    {
      text: 'Não existe fracasso — tudo que não sai exatamente como esperado pode ser convertido em uma experiência de aprendizado, desde que você observe as informações contidas.',
      source_chapter: 'Estratégia 2 — Senso de Propriedade',
    },
    {
      text: 'Qualquer um pode enganar um consumidor para comprar uma vez. A chave está no volume de compras repetidas e indicações. Se você atendeu suas necessidades rapidamente e completamente, eles não darão seus negócios futuros a mais ninguém.',
      source_chapter: 'Estratégia 3 — Experiência do Cliente',
    },
    {
      text: 'Olhar para concorrentes é como olhar no retrovisor. Conversar com clientes fornece o material de construção para o futuro. Seu modelo de negócio deve ser orientado para as necessidades do futuro.',
      source_chapter: 'Estratégia 7 — Diferenciação',
    },
    {
      text: 'As três regras de ouro da Dell: 1) Desdém pelo estoque, 2) Sempre ouça o cliente, 3) Nunca venda indiretamente. Simplicidade é a base da execução excepcional.',
      source_chapter: 'Estratégia 5 — Alianças com Fornecedores',
    },
    {
      text: 'Planejamento é nada sem execução. A vantagem competitiva não vem de uma grande jogada mítica, mas da boa execução de uma estratégia viável, aprendizado contínuo e fluxo de informações.',
      source_chapter: 'Estratégia 7 — Execução',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Mapeie Sua Cadeia de Valor',
      icon: '🔍',
      color_theme: 'accent',
      description: 'Identifique onde você realmente agrega valor único e onde deveria recorrer a parceiros especializados, seguindo o modelo Dell de competência central.',
      checklist: [
        'Listei todas as atividades que minha empresa/eu executo',
        'Marquei as 3 atividades onde agrego mais valor único',
        'Identifiquei 2 atividades que um parceiro faria melhor',
        'Defini um plano para fortalecer uma parceria estratégica',
      ],
    },
    {
      title: 'Exercício 2 — Imersão no Cliente',
      icon: '🎧',
      color_theme: 'green',
      description: 'Como Michael Dell que frequentava chats anônimos para ouvir clientes, mergulhe esta semana na experiência real dos seus clientes.',
      checklist: [
        'Conversei com 3 clientes sobre sua experiência completa',
        'Anotei pelo menos 5 pontos de dor ou frustração',
        'Identifiquei 1 melhoria que posso implementar esta semana',
        'Compartilhei os aprendizados com minha equipe',
      ],
    },
    {
      title: 'Exercício 3 — Elimine Uma Hierarquia',
      icon: '🔥',
      color_theme: 'orange',
      description: 'A Dell baniu hierarquias para que a informação fluísse livremente. Identifique uma barreira burocrática na sua organização e elimine-a.',
      checklist: [
        'Identifiquei um processo que cria gargalo de informação',
        'Propus uma forma de eliminar ou simplificar essa barreira',
        'Implementei a mudança por pelo menos 1 semana',
        'Medi o impacto na velocidade de decisão',
      ],
    },
  ],
}

// ============================================================
// Book 2: IACOCCA — An Autobiography
// ============================================================

const book2: BookData = {
  slug: 'iacocca-uma-autobiografia',
  metadata: {
    title: 'Iacocca: Uma Autobiografia',
    original_title: 'IACOCCA: An Autobiography',
    author: 'Lee Iacocca',
    year: 1984,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 15,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p><strong>Lee Iacocca</strong> é uma das figuras mais icônicas da história empresarial americana. Filho de imigrantes italianos, ele subiu dos degraus mais baixos da Ford Motor Company até se tornar seu presidente, foi demitido por Henry Ford II em uma disputa de egos, e então realizou uma das maiores viradas corporativas da história ao salvar a Chrysler da falência. Sua autobiografia é uma masterclass em <strong>liderança, resiliência, gestão de pessoas e tomada de decisão</strong> sob pressão extrema.</p>
<p>A mensagem central é simples mas poderosa: aplique-se, obtenha toda a educação que puder, mas então, <strong>faça algo</strong>. Não fique parado — faça as coisas acontecerem. Com trabalho duro e determinação, em uma sociedade livre, você pode se tornar tão grande quanto quiser ser.</p>

<div class="highlight-box">
  "Se eu tivesse que resumir as qualidades que fazem um bom gestor, eu diria que tudo se resume à capacidade de decisão. Você pode usar os computadores mais sofisticados e reunir todos os gráficos e números, mas no final, você tem que juntar toda a informação, estabelecer um cronograma e agir." — Lee Iacocca
</div>

<h2>Raízes e Formação</h2>
<p>O pai de Lee, Nicola Iacocca, chegou à América em 1902, aos doze anos — pobre, sozinho e assustado. Ele incutiu dois princípios em Lee: <strong>nunca entre em um negócio intensivo em capital</strong> (porque os banqueiros acabarão sendo donos de você) e quando os tempos ficarem difíceis, entre no negócio de comida (porque as pessoas sempre precisarão comer).</p>
<p>Na escola, Lee aprendeu que a coisa mais importante era <strong>saber se comunicar</strong>. Ele aprendeu a escrever com clareza, falar em público e aumentar seu vocabulário. Entrar na equipe de debates foi um movimento brilhante — ensinou-o a expressar ideias bem e a pensar rapidamente.</p>

<h2>A História da Ford: Do Mustang ao Topo</h2>
<p>Em agosto de 1946, Lee começou a trabalhar na Ford como engenheiro estudante. Logo percebeu que gostava mais de trabalhar com pessoas do que com máquinas. Quando as vendas dos Fords de 1956 estavam lentas, Lee teve uma ideia inovadora: oferecer os carros com 20% de entrada seguido de três anos de pagamentos mensais de US$ 56. Em três meses, o distrito de vendas da Filadélfia saiu do último lugar para o primeiro no país.</p>

<div class="key-point">
  <div class="kp-num">🚗</div>
  <div class="kp-text"><strong>O Mustang:</strong> Lançado em 17 de abril de 1964, o Mustang criou pandemonium por toda a América. A previsão era vender 75.000 unidades no primeiro ano — as vendas reais foram 417.174 carros. Nos dois primeiros anos, o Mustang gerou US$ 1,1 bilhão em lucros líquidos.</div>
</div>

<p>Lee também revitalizou a divisão Lincoln-Mercury, que era a mais fraca da família Ford. Até 1970, a divisão estava gerando mais de US$ 1 bilhão em lucro líquido. Lee Iacocca foi nomeado presidente da Ford Motor Company em 10 de dezembro de 1970.</p>

<h2>A Gestão como Arte da Decisão</h2>
<p>Uma das primeiras medidas de Lee como Gerente Geral da divisão Ford foi introduzir um <strong>sistema de revisão trimestral</strong> no qual todos os executivos tinham a oportunidade de sentar e escrever seus objetivos e metas para os próximos três meses. A disciplina de escrever as ideias no papel forçava todos a serem específicos e eliminar toda vagueza.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Decisividade acima de tudo:</strong> A política de Lee sempre foi ser democrático até o ponto da decisão. Então ele se tornava o comandante implacável: "Ok, ouvi todo mundo. Agora aqui está o que vamos fazer."</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Pessoas, não informação:</strong> A chave para o sucesso não é informação — são pessoas. Lee buscava os "eager beavers" — os que tentam fazer mais do que se espera deles, sempre se superando e ajudando os outros.</div>
</div>

<h2>A Demissão e a Chrysler</h2>
<p>Em 13 de julho de 1978, Lee foi chamado por Henry Ford e informado que estava demitido. Isso aconteceu quando a empresa havia acabado de completar seus dois anos mais lucrativos da história, com mais de US$ 1,8 bilhão em vendas totais. A demissão não teve nada a ver com desempenho — foi puramente um <strong>conflito de personalidade</strong>.</p>
<p>Quando Lee chegou à Chrysler, encontrou uma empresa que nem funcionava como empresa — havia 35 vice-presidentes operando independentemente, sem sistemas de controle financeiro, sem reuniões entre departamentos. A fabricação produzia carros sem nem consultar o pessoal de vendas. O resultado: quase 100.000 veículos não vendidos estacionados ao ar livre, deteriorando — US$ 600 milhões em estoque acabado.</p>

<div class="highlight-box">
  "No final, todas as operações de negócios podem ser reduzidas a três palavras: pessoas, produto e lucros. A menos que você tenha uma boa equipe de pessoas, você não pode fazer as outras duas." — Lee Iacocca
</div>

<h2>A Virada da Chrysler</h2>
<p>Lee começou reduzindo seu próprio salário para <strong>US$ 1,00 por ano</strong>. Não fez isso para ser mártir — fez para dar o exemplo. Ele queria poder olhar nos olhos das pessoas (como os delegados sindicais) e dizer que todos precisavam fazer sua parte. O princípio era simples: se todos estão sofrendo igualmente, você pode mover uma montanha.</p>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Construir a equipe:</strong> Lee usou um caderno detalhado onde rastreava as carreiras de centenas de executivos da Ford. Ele voltou a esse caderno para encontrar pessoas de primeira linha para a Chrysler.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Garantia governamental:</strong> O Congresso aprovou a garantia de empréstimo por 271 a 136, e o Senado por 53 a 44. O governo estimou que a falência da Chrysler custaria ao país US$ 2,7 bilhões apenas no primeiro ano.</div>
</div>

<p>Com toda a reestruturação, a Chrysler agora precisava vender 1,1 milhão de carros por ano para empatar — em vez dos 2,3 milhões necessários anteriormente. Em 1982, a empresa voltou a dar lucro. Em 1983, o lucro foi de <strong>US$ 925 milhões</strong> — o melhor de toda a história da Chrysler. A empresa pagou todos os empréstimos garantidos sete anos antes do vencimento, em 13 de julho de 1983 — exatamente cinco anos após a demissão de Lee da Ford.</p>

<h2>Lições de Liderança</h2>
<p>Lee aprendeu que ser líder é, acima de tudo, <strong>saber se comunicar</strong>. No curso Dale Carnegie sobre oratória, ele aprendeu que mesmo que você conheça seu assunto profundamente, sua audiência não conhece. Então comece dizendo o que vai dizer. Depois diga. Finalmente, diga o que já disse. E sempre termine pedindo à audiência para fazer algo.</p>
<p>Sobre correr riscos: sempre que tomou riscos, foi depois de se certificar de que a pesquisa e os estudos de mercado apoiavam seus instintos. Ele agia por intuição — mas apenas se suas intuições eram apoiadas pelos fatos. Decisões demais são atrasadas porque gestores querem certeza absoluta, mas a certeza não existe.</p>

<div class="highlight-box">
  "As pessoas me dizem: 'Você é um sucesso estrondoso. Como fez isso?' Eu volto ao que meus pais me ensinaram. Aplique-se. Obtenha toda a educação que puder, mas então, por Deus, faça algo! Não fique parado, faça as coisas acontecerem." — Lee Iacocca
</div>

<h2>Conclusão</h2>
<p>A história de Lee Iacocca é uma das mais inspiradoras do mundo dos negócios. De filho de imigrantes a presidente da segunda maior empresa do mundo, demitido injustamente e depois responsável por uma das maiores viradas corporativas da história — tudo se resume a alguns princípios atemporais: <strong>decisividade, comunicação, pessoas certas nos lugares certos e a coragem de agir quando a situação exige</strong>. Em tempos de crise, todos devem estar dispostos a fazer sacrifícios iguais. Quando isso acontece, milagres empresariais são possíveis.</p>`,

  mindmap_json: {
    center_label: 'IACOCCA',
    center_sublabel: 'A Autobiografia de um Líder Americano',
    branches: [
      {
        title: 'Formação & Valores',
        icon: '🏠',
        items: [
          'Filho de imigrantes italianos',
          'Comunicação como habilidade #1',
          'Disciplina e trabalho duro',
          'Nunca dependa de capital alheio',
        ],
      },
      {
        title: 'A Era Ford',
        icon: '🚗',
        items: [
          'Plano de financiamento "56 por mês"',
          'Criação do icônico Mustang',
          'Virada da Lincoln-Mercury',
          'Presidente da Ford aos 46 anos',
        ],
      },
      {
        title: 'Gestão & Decisão',
        icon: '⚡',
        items: [
          'Revisão trimestral de metas',
          'Democrático até a decisão',
          'Pessoas são o ativo #1',
          'Intuição apoiada por fatos',
        ],
      },
      {
        title: 'A Virada da Chrysler',
        icon: '🔄',
        items: [
          'Salário de US$ 1 por ano',
          'Sacrifício igual para todos',
          'Garantia governamental aprovada',
          'Lucro recorde em 3 anos',
        ],
      },
      {
        title: 'Comunicação',
        icon: '🗣',
        items: [
          'Curso Dale Carnegie de oratória',
          'Diga o que vai dizer, diga, repita',
          'Sempre peça ação da audiência',
          'Comerciais pessoais da Chrysler',
        ],
      },
      {
        title: 'Lições de Vida',
        icon: '💎',
        items: [
          'Aplique-se e faça algo',
          'Nunca pare de aprender',
          'Resiliência após adversidade',
          'Resultados falam mais que palavras',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Se eu tivesse que resumir as qualidades que fazem um bom gestor, eu diria que tudo se resume à decisividade. Você pode reunir todos os gráficos e números, mas no final tem que juntar toda a informação, estabelecer um cronograma e agir.',
      source_chapter: 'Cap. 5 — A Chave da Gestão',
    },
    {
      text: 'A chave para o sucesso não é informação — são pessoas. O tipo de pessoa que busco são os "eager beavers" — os que tentam fazer mais do que se espera deles. Com vinte e cinco desses, eu poderia governar os Estados Unidos.',
      source_chapter: 'Cap. 5 — Sobre Pessoas',
    },
    {
      text: 'As pessoas podem aceitar muita dor se todos estiverem passando pelo mesmo. Se todos estão sofrendo igualmente, você pode mover uma montanha. Isso era cooperação e democracia no seu melhor.',
      source_chapter: 'Cap. 20 — Igualdade de Sacrifício',
    },
    {
      text: 'Todos cometem erros. O problema é que a maioria das pessoas não admite. Quando um cara estraga tudo, ele nunca admite que é culpa dele. Se você errar, não me dê desculpas — vá se olhar no espelho.',
      source_chapter: 'Cap. 3 — Primeiros Passos',
    },
    {
      text: 'Todos os problemas da Chrysler realmente se resumiam a uma coisa — ninguém estava reunindo toda a equipe e apontando-os na direção certa. A empresa era simplesmente uma coleção de indivíduos talentosos em vez de uma equipe coerente.',
      source_chapter: 'Cap. 14 — A Bordo de um Navio Afundando',
    },
    {
      text: 'A decisão correta é errada se for tomada tarde demais. E não existe certeza absoluta. Há momentos em que até o melhor gestor é como o garotinho com o cão grande, esperando para ver onde o cão quer ir para poder levá-lo lá.',
      source_chapter: 'Cap. 5 — A Chave da Gestão',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Revisão Trimestral Pessoal',
      icon: '📋',
      color_theme: 'accent',
      description: 'Adote o sistema que Iacocca usou na Ford: escreva seus objetivos para os próximos 90 dias. A disciplina de colocar no papel elimina vagueza e força especificidade.',
      checklist: [
        'Escrevi 3-5 objetivos específicos para os próximos 90 dias',
        'Defini métricas claras de sucesso para cada objetivo',
        'Identifiquei os recursos e pessoas necessários',
        'Agendei uma revisão para daqui a 90 dias',
      ],
    },
    {
      title: 'Exercício 2 — Construa Seu Caderno de Talentos',
      icon: '📓',
      color_theme: 'green',
      description: 'Assim como Iacocca mantinha um caderno rastreando centenas de executivos, comece a mapear os talentos ao seu redor.',
      checklist: [
        'Listei 10 pessoas talentosas que conheço profissionalmente',
        'Anotei os pontos fortes únicos de cada uma',
        'Identifiquei quem eu chamaria para um projeto desafiador',
        'Contatei pelo menos uma pessoa para fortalecer o relacionamento',
      ],
    },
    {
      title: 'Exercício 3 — Comunique-se Como Líder',
      icon: '🎤',
      color_theme: 'orange',
      description: 'Iacocca transformou sua comunicação com o curso Dale Carnegie. Esta semana, pratique a técnica de "diga o que vai dizer, diga e repita" em uma apresentação ou conversa importante.',
      checklist: [
        'Preparei uma comunicação usando a estrutura de 3 partes',
        'Pratiquei falar sobre um tema por 2 minutos sem notas',
        'Terminei pedindo uma ação específica da audiência',
        'Pedi feedback honesto sobre minha clareza de comunicação',
      ],
    },
  ],
}

// ============================================================
// Book 3: Think Big, Act Small
// ============================================================

const book3: BookData = {
  slug: 'pense-grande-aja-pequeno',
  metadata: {
    title: 'Pense Grande, Aja Pequeno',
    original_title: 'Think Big, Act Small',
    author: 'Jason Jennings',
    year: 2005,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Mais de 72.000 empresas americanas foram analisadas para identificar aquelas que cresceram receitas e lucros em 10% ou mais, por pelo menos dez anos consecutivos, sem contar aquisições. Isso eliminou 99,99% das empresas e gerou uma lista de apenas <strong>27 empresas</strong>. Dessas, nove foram selecionadas e pesquisadores se reuniram com CEOs, líderes, gerentes, trabalhadores, clientes e fornecedores de cada uma para identificar o que estavam fazendo certo.</p>
<p>O fio condutor em todas as descobertas é que cada empresa <strong>pensa grande mas age pequeno</strong>. Elas criam grandes ideias sobre como resolver os problemas dos clientes, mas nunca param de agir como startups — mantêm-se humildes, tratam cada funcionário como um dono e têm gestores que sujam as mãos na linha de frente.</p>

<div class="highlight-box">
  "Nossas descobertas genuinamente nos surpreenderam. Não descobrimos nenhuma tática mirabolante ou método ultrassecreto. Na verdade, porque cada empresa dominou os fundamentos melhor que todas as outras, seu crescimento dramático e consistente ocorre naturalmente, até organicamente." — Jason Jennings
</div>

<h2>Bloco 1: Seja Sempre Humilde</h2>
<p>As pessoas que lideram empresas de crescimento constante são <strong>genuinamente humildes</strong>. Elas não buscam status de celebridade. Deixam seus egos em casa e vão trabalhar. Líderes humildes compartilham sete atributos-chave: veem seu papel como guardiões, agem com transparência, são acessíveis, têm grande ética de trabalho, defendem princípios, não têm tempo para distrações superficiais e não possuem escritórios luxuosos.</p>

<h2>Bloco 2: Suje as Mãos nos Detalhes</h2>
<p>Sujar as mãos não significa passar um ou dois dias por ano fazendo trabalho da linha de frente. Significa estar <strong>intimamente envolvido no funcionamento do negócio diariamente</strong>, mantendo contato frequente com três grupos: seus clientes (entrando nas trincheiras e interagindo), seus trabalhadores (transformando-os de engrenagens em membros valorizados) e seus fornecedores (transformando-os em parceiros).</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Exemplo — SAS Institute:</strong> Apesar de empregar quase 10.000 pessoas, o CEO Jim Goodnight continua atuando como programador. Ele visita clientes, identifica suas necessidades e ajuda a escrever o código para resolver seus problemas.</div>
</div>

<h2>Bloco 3: Metas Curtas, Horizonte Longo</h2>
<p>Empresas de crescimento consistente não têm planos inflexíveis de cinco anos. Em vez disso, concentram-se em <strong>executar seus objetivos de curto prazo de forma lucrativa</strong> enquanto mantêm vigilância constante sobre desenvolvimentos de longo prazo. Planos rígidos podem resultar em alocação errada de recursos, negligência das operações diárias, ganância e dificuldade de mudar de curso.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Imagine e visualize coisas grandes</strong> — e depois volte ao trabalho. Preste atenção ao que está tentando fazer hoje e coloque todos os ativos operando na máxima eficiência.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Não persiga crescimento para atingir um número "mágico"</strong> — concentre-se em qualidade. Nunca troque qualidade por mais crescimento.</div>
</div>

<h2>Bloco 4: Deixe o Obsoleto Para Trás</h2>
<p>Empresas de alto crescimento não perdem tempo tentando defender as decisões de ontem ou ressuscitar os campeões de vendas do passado. Elas <strong>abandonam completamente o que não funciona</strong> para dedicar mais tempo, atenção e recursos ao que funciona. Isso inclui seu logo (se ninguém acredita nele), sua abordagem tradicional (se o mercado mudou), e até seu plano de remuneração (se recompensa crescimento de receita em vez de crescimento de lucro).</p>

<h2>Bloco 5: Todos Pensando e Agindo como Donos</h2>
<p>Quando as pessoas pensam e agem como donos em vez de funcionários contratados, elas tomam melhores decisões, são mais inovadoras e trabalham mais duro. Para conseguir isso: desenvolva um apetite institucional voraz por conhecimento, tenha regras organizacionais invioláveis, defina sucesso como <strong>criar valor na mente do cliente</strong>, compense as pessoas generosamente com base no valor que agregam e deixe as pessoas correr riscos e aprender com seus fracassos.</p>

<div class="highlight-box">
  "Volume é vaidade e lucro é sanidade. Somos muito mais interessados em ser sãos do que em ser vaidosos." — Pat Tracy, CEO, Dot Foods
</div>

<h2>Bloco 6: Invente e Reinvente Seu Negócio</h2>
<p>Empresas que pensam grande e agem pequeno constantemente se reinventam. Elas pegam o que aprenderam em uma indústria e usam esse conhecimento para criar negócios novos em outras indústrias. Algumas formas práticas: descubra como transformar o "asfalto" do seu negócio em novas estradas, desenvolva modelos de precificação alternativos, examine os menores centros de receita e descubra como transformá-los em unidades de negócio completas.</p>

<h2>Bloco 7: Soluções Ganha-Ganha</h2>
<p>Empresas de alto crescimento não veem as vendas como um confronto adversarial. Elas <strong>diagnosticam autenticamente</strong> as necessidades reais dos clientes e criam soluções ganha-ganha. Tenha uma regra de "Não" — ninguém pode dizer não a um cliente sem aprovação de um líder sênior. Nunca corte comissões dos vendedores. Sempre pergunte: "Isso é um ganha-ganha para todos?"</p>

<h2>Bloco 8: Escolha Seus Competidores</h2>
<p>Grandes empresas não tentam ser tudo para todos. Elas <strong>estreitam seu foco</strong> e se tornam absolutamente excelentes em algo que ressoa com o mercado. Antes de entrar em qualquer nova linha de negócios, descubra quem já tem a maioria dos clientes, como estão em termos de lucro e o que será necessário para melhorar o que já fazem.</p>

<h2>Blocos 9 e 10: Comunidade e Liderança Caseira</h2>
<p>Grandes empresas têm uma comunidade de pessoas felizes em ajudá-las a competir com sucesso. Elas proporcionam senso de pertencimento e interação social que são muito valiosos. E quanto à liderança, essas empresas não precisam contratar CEOs externos — elas <strong>cultivam consistentemente seus próprios líderes</strong> internamente, garantindo que os valores da organização perdurem.</p>

<div class="highlight-box">
  "Para construir uma organização com foco equilibrado, camaradagem e a capacidade de prosperar a longo prazo, pense grande, aja pequeno." — Brian Solon, pesquisador-chefe
</div>

<h2>Conclusão</h2>
<p>Os dez blocos de construção revelados pela pesquisa de Jason Jennings não são táticas secretas — são <strong>fundamentos executados com maestria</strong>. A diferença entre empresas comuns e empresas extraordinárias não está em estratégias complexas, mas na disciplina de fazer o básico excepcionalmente bem, todos os dias. Humildade, proximidade com o cliente, metas realistas, inovação contínua e tratamento de todos como donos — esses são os verdadeiros pilares do crescimento sustentável.</p>`,

  mindmap_json: {
    center_label: 'PENSE GRANDE, AJA PEQUENO',
    center_sublabel: '10 Blocos para Crescimento Sustentável',
    branches: [
      {
        title: 'Humildade & Presença',
        icon: '🙏',
        items: [
          'Líderes genuinamente humildes',
          'Sujar as mãos nos detalhes',
          'Acessíveis para qualquer pessoa',
          'Sem escritórios luxuosos',
        ],
      },
      {
        title: 'Metas & Execução',
        icon: '🎯',
        items: [
          'Metas curtas, horizonte longo',
          'Execução sobre planejamento',
          'Qualidade acima de crescimento',
          'Abandonar o que não funciona',
        ],
      },
      {
        title: 'Mentalidade de Dono',
        icon: '🔑',
        items: [
          'Todos agem como proprietários',
          'Apetite voraz por conhecimento',
          'Correr riscos e aprender com falhas',
          'Compensar por valor agregado',
        ],
      },
      {
        title: 'Inovação & Reinvenção',
        icon: '💡',
        items: [
          'Reinventar o negócio constantemente',
          'Transformar subprodutos em receita',
          'Modelos de precificação alternativos',
          'Pensar como outsider',
        ],
      },
      {
        title: 'Clientes & Competição',
        icon: '🤝',
        items: [
          'Soluções ganha-ganha sempre',
          'Escolher seus competidores',
          'Diagnosticar necessidades reais',
          'Foco estreito de excelência',
        ],
      },
      {
        title: 'Comunidade & Liderança',
        icon: '👥',
        items: [
          'Construir comunidade de stakeholders',
          'Liderança cultivada internamente',
          'Senso de pertencimento como vantagem',
          'Valores da organização perdurem',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'A humildade realmente prepara essas organizações para vencer no jogo de receita e crescimento. Se fossem incapazes de manter seus valores humildes, cada uma teria se distraído como as centenas de milhares de empresas que perecem anualmente.',
      source_chapter: 'Bloco 1 — Seja Sempre Humilde',
    },
    {
      text: 'Quando líderes e empresas sujam as mãos, eles conseguem detectar tendências melhor, aprender e agir sobre o que os clientes realmente querem, e ganhar o respeito e confiança de clientes, funcionários e fornecedores.',
      source_chapter: 'Bloco 2 — Suje as Mãos',
    },
    {
      text: 'Na indústria de tecnologia tudo muda tão rápido. Se você se prendesse a um plano de cinco anos, seu produto seria irrelevante quando chegasse ao final. Imagine ignorar os estágios iniciais da Internet ou tecnologia wireless.',
      source_chapter: 'Bloco 3 — Metas Curtas, Horizonte Longo',
    },
    {
      text: 'Volume é vaidade e lucro é sanidade. As melhores empresas são muito mais interessadas em ser sãs do que em ser vaidosas.',
      source_chapter: 'Bloco 3 — Dot Foods',
    },
    {
      text: 'Empresas que consistentemente crescem receitas provam a proposição de pensar grande e agir pequeno ao não permitir que os campeões de vendas de ontem, uma filosofia do mesmo e egos enormes atrapalhem o objetivo principal.',
      source_chapter: 'Bloco 4 — Deixe o Obsoleto Para Trás',
    },
    {
      text: 'Nossa empresa não estaria aqui hoje se tivéssemos ficado apenas no nosso negócio original. A capacidade de reinvenção é o que separa empresas que prosperam daquelas que perecem.',
      source_chapter: 'Bloco 6 — Invente e Reinvente',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Teste de Humildade do Líder',
      icon: '🪞',
      color_theme: 'accent',
      description: 'Avalie-se nos 7 atributos de líderes humildes identificados pela pesquisa. Seja brutalmente honesto sobre onde você precisa melhorar.',
      checklist: [
        'Avaliei minha acessibilidade (escala 1-10) para clientes e funcionários',
        'Verifiquei se meu espaço de trabalho me mantém acessível',
        'Identifiquei uma distração superficial que posso eliminar',
        'Passei pelo menos 1 hora esta semana na linha de frente do negócio',
      ],
    },
    {
      title: 'Exercício 2 — Abandone Um "Campeão de Ontem"',
      icon: '🗑️',
      color_theme: 'green',
      description: 'Identifique um produto, processo ou prática que já foi bem-sucedido mas hoje drena recursos sem retorno proporcional. Tome a decisão de abandoná-lo.',
      checklist: [
        'Listei 3 produtos/processos que não justificam mais seu custo',
        'Escolhi um para descontinuar ou transformar radicalmente',
        'Calculei os recursos que serão liberados com essa decisão',
        'Redirecionei esses recursos para algo com mais potencial',
      ],
    },
    {
      title: 'Exercício 3 — Dia de Imersão no Cliente',
      icon: '🔥',
      color_theme: 'orange',
      description: 'Como os CEOs das empresas estudadas que "sujam as mãos", reserve um dia inteiro esta semana para trabalhar na linha de frente e interagir diretamente com clientes.',
      checklist: [
        'Agendei um dia inteiro para trabalhar na linha de frente',
        'Atendi pelo menos 5 clientes diretamente',
        'Registrei insights e problemas que observei',
        'Compartilhei minhas descobertas com a equipe de liderança',
      ],
    },
  ],
}

// ============================================================
// Book 4: Flip the Funnel
// ============================================================

const book4: BookData = {
  slug: 'inverta-o-funil',
  metadata: {
    title: 'Inverta o Funil',
    original_title: 'Flip the Funnel: How to Use Existing Customers to Gain New Ones',
    author: 'Joseph Jaffe',
    year: 2010,
    category_slug: 'comunicacao',
    category_label: 'Comunicação',
    category_emoji: '🗣',
    reading_time_min: 13,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A visão convencional de marketing é que você precisa gastar dinheiro para adquirir novos clientes. Com isso em mente, empresas gastam bilhões usando o <strong>funil de vendas tradicional</strong> — anuncie amplamente para criar Consciência, depois trabalhe com quem mostra Interesse, para alimentar o Desejo e, finalmente, leve-os à Ação de compra. Dinheiro entra em uma ponta do funil e clientes satisfeitos (esperançosamente) saem na outra.</p>
<p><strong>Joseph Jaffe</strong> propõe uma ideia revolucionária: e se você invertesse esse funil? E se, em vez de gastar todo esse dinheiro tentando adquirir novos clientes, você investisse a mesma quantia em <strong>tornar os clientes que já tem mais felizes</strong>, proporcionando-lhes uma experiência superior? Poderia o foco intensivo em retenção de clientes se tornar o principal processo pelo qual você também conquista novos clientes?</p>

<div class="highlight-box">
  "Tudo isso é sobre crescer seu negócio enquanto encolhe seu orçamento; sobre conseguir mais com menos em um momento em que os negócios precisam e até exigem isso. É sobre eliminar desperdício e focar dólares nas pessoas que realmente importam: seus clientes." — Joseph Jaffe
</div>

<h2>O Funil Tradicional Está Quebrado</h2>
<p>O modelo AIDA (Atenção-Interesse-Desejo-Ação) que guiou o marketing por décadas tem problemas sérios. Ele assume que as pessoas são lineares e previsíveis — o que é obviamente falso. A quantidade de dinheiro gasta no topo do funil (gerando consciência) quase sempre supera o gasto na parte inferior (interagindo com compradores qualificados). E o pior: o funil não diz nada sobre <strong>retenção ou negócios repetidos</strong>.</p>
<p>Existem apenas quatro métricas simples que determinam se um negócio sobrevive:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Conseguir mais pessoas para comprar.</strong></div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Fazer clientes existentes comprarem com mais frequência.</strong></div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Fazer clientes existentes gastarem mais.</strong></div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Fazer clientes existentes recomendarem você aos amigos.</strong></div>
</div>

<p>A maioria dos orçamentos de marketing é alocada apenas ao ponto 1. E se você redirecionasse parte desse investimento para os pontos 2, 3 e 4?</p>

<h2>O Funil Invertido: O Modelo ADIA</h2>
<p>O funil invertido substitui o AIDA tradicional por um novo modelo focado no cliente:</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>A — Reconhecimento (Acknowledgment):</strong> Agradeça seus clientes pela preferência e destaque sua importância. Um simples e-mail de agradecimento, uma ligação de cortesia ou inscrição gratuita na comunidade de clientes.</div>
</div>

<div class="key-point">
  <div class="kp-num">🗣</div>
  <div class="kp-text"><strong>D — Diálogo:</strong> Vá além de ser uma corporação sem rosto. Inicie conversas bidirecionais com seus clientes. Estabeleça clubes de clientes, fóruns e hubs onde possam se conectar entre si.</div>
</div>

<div class="key-point">
  <div class="kp-num">🎁</div>
  <div class="kp-text"><strong>I — Incentivo (Incentivization):</strong> Reconheça e recompense pessoas por suas compras repetidas e sua influência nas compras de outros. Elimine o intermediário — dê o dinheiro do marketing diretamente aos seus influenciadores.</div>
</div>

<div class="key-point">
  <div class="kp-num">🚀</div>
  <div class="kp-text"><strong>A — Ativação:</strong> Ative o poder coletivo das multidões. Forme uma parceria autêntica com seus clientes para construir uma comunidade digital vibrante, alimentada por lealdade e boca a boca.</div>
</div>

<h2>Por Que Clientes Abandonam Você</h2>
<p>Empresas facilitam a debandada de clientes ao cometer cinco erros: <strong>falta de cuidado ou negligência</strong> (dando a impressão de que não se importam), <strong>péssimo atendimento</strong> (prometendo uma coisa e entregando outra), <strong>perda de contato</strong> (parando de estudar o que motiva seus clientes), <strong>falha no acompanhamento</strong> (nunca perguntando o que os clientes mais valorizam) e <strong>falta de inovação</strong> (caindo incrementalmente atrás de concorrentes que continuam melhorando).</p>

<div class="highlight-box">
  "Todo o processo de gestão de churn é falho no melhor caso e suicida no pior. Nenhum nível de churn é aceitável. Nunca. Churn, em qualquer forma, é intolerável. Empresas precisam ser obcecadas em reduzir o churn a zero." — Joseph Jaffe
</div>

<h2>A Experiência do Cliente é Tudo</h2>
<p>A experiência do cliente é definida como a <strong>soma total de todos os pontos de contato, interações e encontros</strong> entre o cliente, a empresa e suas ofertas ao longo de um período de tempo. Ela é importante porque sustenta a lealdade, que por sua vez gera três resultados: disposição para recomprar, relutância em mudar para concorrentes e probabilidade de recomendar.</p>
<p>A tecnologia deve ser usada para <strong>enriquecer o relacionamento com o cliente</strong>, não para reduzi-lo. Empresas que criam sites que são becos sem saída de atendimento ao cliente ou linhas 0800 com labirintos de opções estão usando a tecnologia para cortar custos, não para construir relacionamentos.</p>

<h2>Construindo a Infraestrutura de Boca a Boca</h2>
<p>Existem cinco níveis de maturidade da experiência do cliente: Interessado, Investido, Comprometido, Engajado e Incorporado. A maioria das empresas foca em mover clientes do nível 1 para o nível 2. O funil invertido sugere que o melhor caminho é mover clientes do nível 2 para os níveis 3, 4 e 5. Para isso, construa uma infraestrutura de boca a boca com cinco elementos: desabafos e elogios, respostas, avaliações, recomendações e referências.</p>

<h2>Os Três Pilares da Ativação</h2>
<p>A rede de boca a boca que você precisa construir é baseada em três pilares:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Conteúdo:</strong> Crie um repositório onde clientes possam documentar suas experiências, boas ou ruins. Quanto mais criam, mais incentivos ganham.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Conversação:</strong> Deixe os clientes interagirem entre si e comunicarem seus sentimentos. Esteja preparado para a honestidade brutal.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Recomendações:</strong> Permita que clientes construam sua credibilidade individual endossando alguns produtos e não outros. Recompense-os quando outros agem com base em suas referências.</div>
</div>

<div class="highlight-box">
  "Inverter o funil não é um experimento passageiro ou uma moda. É uma mudança sísmica e irreversível em termos de como empresas conduzem negócios, se relacionam com clientes e equilibram os objetivos de manter os caixas tocando e os clientes cantando seus louvores." — Joseph Jaffe
</div>

<h2>Conclusão</h2>
<p>A proposta de Jaffe é elegantemente simples: <strong>invista nos clientes que você já tem</strong>. Faça-os tão felizes que se tornem seus melhores vendedores. Crie uma experiência tão notável que eles não apenas voltem, mas tragam amigos. Isso não é apenas boca a boca com esteroides — é uma mudança fundamental de uma abordagem de fora para dentro para uma abordagem de <strong>dentro para fora</strong> que pode transformar qualquer negócio.</p>`,

  mindmap_json: {
    center_label: 'INVERTA O FUNIL',
    center_sublabel: 'Use Clientes Existentes para Ganhar Novos',
    branches: [
      {
        title: 'O Problema do Funil',
        icon: '⚠️',
        items: [
          'Modelo AIDA está quebrado',
          'Gastos desproporcionais no topo',
          'Ignora retenção e repetição',
          'Assume comportamento linear',
        ],
      },
      {
        title: 'O Funil Invertido (ADIA)',
        icon: '🔄',
        items: [
          'Reconhecimento do cliente',
          'Diálogo bidirecional contínuo',
          'Incentivos para influenciadores',
          'Ativação do poder coletivo',
        ],
      },
      {
        title: 'Por Que Clientes Saem',
        icon: '🚪',
        items: [
          'Negligência e falta de cuidado',
          'Atendimento abaixo da promessa',
          'Perda de contato com necessidades',
          'Falta de inovação contínua',
        ],
      },
      {
        title: 'Experiência do Cliente',
        icon: '⭐',
        items: [
          'Soma de todos os pontos de contato',
          'Tecnologia para enriquecer, não cortar',
          'Base da lealdade e recompra',
          'Diferenciador competitivo #1',
        ],
      },
      {
        title: 'Infraestrutura de Boca a Boca',
        icon: '📣',
        items: [
          'Fóruns de desabafos e elogios',
          'Sistema de avaliações abertas',
          'Recomendações e referências',
          'Resposta em tempo real',
        ],
      },
      {
        title: '3 Pilares de Ativação',
        icon: '🏛️',
        items: [
          'Conteúdo gerado por clientes',
          'Conversação entre a comunidade',
          'Recomendações com credibilidade',
          'Rede autossustentável de boca a boca',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Todo o processo de gestão de churn é falho no melhor caso e suicida no pior. Nenhum nível de churn é aceitável. Nunca. Empresas precisam ser obcecadas em reduzir o churn a zero.',
      source_chapter: 'Parte 1 — O Estado Atual do Marketing',
    },
    {
      text: 'Tudo o que fazemos com e para nossos clientes impacta a experiência do cliente; por sua vez, nossos clientes transmitem essa experiência para suas redes pessoais e sociais, magnificando o número de pessoas expostas.',
      source_chapter: 'Parte 2 — Marketing como Deveria Ser',
    },
    {
      text: 'Investir em seus clientes paga dividendos tremendos. O pensamento convencional dizia que custa 5 a 10 vezes mais adquirir um novo cliente do que reter um existente. Com a Internet, esses números só favorecem mais a retenção.',
      source_chapter: 'Parte 3 — Como Chegar Lá',
    },
    {
      text: 'Seres humanos querem ter conversas com outros seres humanos. Eles não querem ter um debate acalorado com uma lata de refrigerante ou uma TV. O que as pessoas querem são soluções para seus problemas.',
      source_chapter: 'Parte 2 — Canais de Atendimento',
    },
    {
      text: 'Se uma empresa pode ver seu atendimento ao cliente como uma chance perfeita para se conectar profundamente com seu sangue vital, isso se torna uma obsessão cultural em vez de um mero departamento.',
      source_chapter: 'Parte 2 — Atendimento como Diferenciador',
    },
    {
      text: 'A ideia por trás de inverter o funil é que uma empresa pode crescer sua base de clientes concentrando-se expressamente em retenção, experiência do cliente, construção de relacionamento e efeitos em rede do boca a boca orientado pelo cliente.',
      source_chapter: 'Parte 3 — Conclusão',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Audite Seu Funil de Gastos',
      icon: '📊',
      color_theme: 'accent',
      description: 'Mapeie quanto do seu orçamento de marketing vai para aquisição vs. retenção de clientes. A maioria das empresas descobre um desequilíbrio chocante.',
      checklist: [
        'Calculei quanto invisto em aquisição de novos clientes',
        'Calculei quanto invisto em retenção e fidelização',
        'Calculei receita gerada por compras repetidas vs. novos clientes',
        'Identifiquei pelo menos 10% do orçamento de aquisição para redirecionar à retenção',
      ],
    },
    {
      title: 'Exercício 2 — Crie Seu Primeiro Loop de Reconhecimento',
      icon: '💌',
      color_theme: 'green',
      description: 'Implemente o primeiro passo do funil invertido: reconheça e agradeça seus clientes de forma significativa esta semana.',
      checklist: [
        'Enviei uma mensagem personalizada de agradecimento para 10 clientes',
        'Perguntei sobre a experiência deles com meu produto/serviço',
        'Ofereci algo de valor sem pedir nada em troca',
        'Anotei o feedback recebido para melhorias futuras',
      ],
    },
    {
      title: 'Exercício 3 — Desafio Zero Churn',
      icon: '🎯',
      color_theme: 'orange',
      description: 'Jaffe diz que nenhum nível de churn é aceitável. Identifique os últimos 5 clientes que você perdeu e descubra por quê.',
      checklist: [
        'Identifiquei os 5 últimos clientes que deixaram de comprar',
        'Contatei pelo menos 3 para entender os motivos',
        'Classifiquei as razões nas 5 categorias de Jaffe',
        'Criei um plano de ação para eliminar a causa #1 de abandono',
      ],
    },
  ],
}

// ============================================================
// Book 5: Get Motivated
// ============================================================

const book5: BookData = {
  slug: 'motive-se',
  metadata: {
    title: 'Motive-se',
    original_title: 'Get Motivated: Overcome Any Obstacle, Achieve Any Goal, and Accelerate Your Success With Motivational DNA',
    author: 'Tamara Lowe',
    year: 2009,
    category_slug: 'psicologia',
    category_label: 'Psicologia',
    category_emoji: '🧠',
    reading_time_min: 13,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>O que motiva grandes realizadores? Por que pessoas de sucesso têm sucesso? Para responder a essas perguntas, <strong>Tamara Lowe</strong> conduziu um estudo de oito anos com mais de 10.000 pessoas de alto desempenho e descobriu que motivação não é "tamanho único". Motivação é como DNA — é <strong>única para cada indivíduo</strong> e precisa ser personalizada para as necessidades e preferências de cada pessoa para ser eficaz.</p>
<p>O DNA Motivacional consiste em três fatores e seis elementos que se combinam de formas previsíveis: <strong>Impulsos</strong> (conexão ou produção), <strong>Necessidades</strong> (estabilidade ou variedade) e <strong>Recompensas</strong> (internas ou externas). Para motivar outros ou se auto-motivar, descubra o DNA da pessoa que deseja motivar e forneça exatamente o que ela precisa.</p>

<div class="highlight-box">
  "Motivação é uma das maiores chaves para o sucesso em todas as áreas de nossas vidas. Educação é importante, mas motivação é mais importante. Talento conta, mas motivação conta mais. Motivação é o poder que cria ação. É o combustível do sucesso." — Tamara Lowe
</div>

<h2>As Quatro Leis da Motivação</h2>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Todos são motivados de formas diferentes:</strong> Não existe uma única coisa que todos achem motivadora. Cada membro de uma equipe responderá a formas de motivação de maneira diferente e única.</div>
</div>

<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Indivíduos têm um tipo motivacional distinto e único:</strong> Nosso DNA motivacional inerente determina o que achamos motivador e o que não funciona.</div>
</div>

<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>O que motiva uma pessoa pode desmotivar outra:</strong> Como todos temos DNA motivacional único, o que energiza alguns, outros recebem com um bocejo.</div>
</div>

<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Nenhum tipo motivacional é "melhor" que outro:</strong> Assim como não existe "melhor" tipo sanguíneo, não existe DNA motivacional inerentemente melhor. Grandes realizadores podem ter qualquer tipo.</div>
</div>

<h2>Os Três Componentes do DNA Motivacional</h2>
<h3>Impulsos (Drives)</h3>
<p><strong>Impulsos</strong> são as forças internas que mobilizam uma pessoa a agir. Pessoas competitivas têm um impulso de "produção" — focam em tarefas, conquistas e resultados. São solucionadores de problemas e pensadores estratégicos. Pessoas mais cooperativas têm um impulso de "conexão" — valorizam relacionamentos altamente, querem ser apreciadas e celebram o sucesso dos outros.</p>

<h3>Necessidades (Needs)</h3>
<p>Indivíduos que precisam de <strong>estabilidade</strong> valorizam rotinas, sistemas, regras e ordem. Eles refinam e melhoram processos. Aqueles que apreciam mudança têm uma forte necessidade de <strong>variedade</strong> — podem lidar com mudanças constantes e são frequentemente percebidos como divertidos e entusiastas.</p>

<h3>Recompensas (Awards)</h3>
<p>Algumas pessoas são altamente motivadas quando outros expressam <strong>apreciação interna</strong> — sentem-se validadas quando colegas reconhecem sua contribuição. Outros indivíduos anseiam por <strong>reconhecimento externo</strong>, compensação financeira e oportunidades de avanço.</p>

<h2>Os Oito Tipos Motivacionais</h2>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>O Diretor (Produção-Estabilidade-Interno):</strong> Pensadores estratégicos que movem projetos adiante. Vivem ou morrem pelos resultados. Motive-os com metas desafiadoras e acompanhamento consistente.</div>
</div>

<div class="key-point">
  <div class="kp-num">🏆</div>
  <div class="kp-text"><strong>O Campeão (Produção-Variedade-Externo):</strong> Envolventes e carismáticos. As pessoas adoram segui-los. Motive-os mantendo-os ocupados, criando competições e tornando tudo divertido.</div>
</div>

<div class="key-point">
  <div class="kp-num">🤝</div>
  <div class="kp-text"><strong>O Relacionador (Conexão-Variedade-Interno):</strong> Amigáveis, extrovertidos e fáceis de gostar. Fazem compromissos para criar situações ganha-ganha. Motive-os com colaboração e propósito.</div>
</div>

<div class="key-point">
  <div class="kp-num">🔍</div>
  <div class="kp-text"><strong>O Refinador (Conexão-Variedade-Externo):</strong> Veem o quadro geral mas adoram trabalhar nos detalhes. Leais e deliberados. Valorizam pagamento justo e expressões sinceras de apreciação.</div>
</div>

<p>Além desses, existem o <strong>Visionário</strong> (Produção-Variedade-Interno), que adora organizar pessoas e projetos criativos; o <strong>Chefe</strong> (Produção-Estabilidade-Externo), que anseia resultados tangíveis com precisão; o <strong>Apoiador</strong> (Conexão-Estabilidade-Interno), prático, leal e dependável; e o <strong>Explorador</strong> (Conexão-Variedade-Externo), animado, espontâneo e aventureiro.</p>

<h2>Os Seis Elementos Que Motivam Todos</h2>
<h3>Produtores</h3>
<p><strong>Produtores</strong> são personalidades "Tipo A" clássicas — rápidos, eficientes e altamente competentes. São líderes naturais com atitude de "eu consigo". Para motivá-los: dê autonomia, eleve progressivamente a barra, esqueça microgerenciamento e elimine burocracia desnecessária.</p>

<h3>Conectores</h3>
<p><strong>Conectores</strong> adoram ter pessoas ao redor e envolvidas em seus projetos. Preferem trabalhar em grupos e que o local de trabalho funcione como um ambiente familiar. Para motivá-los: dê uma visão clara, instruções detalhadas, coloque-os em equipes e mantenha-os longe de conflitos.</p>

<h3>Estabilizadores</h3>
<p><strong>Estabilizadores</strong> são a cola que mantém organizações unidas. Analisam situações e descobrem como colocar as coisas nos trilhos. Use fatos e lógica ao conversar com eles, garanta recursos suficientes e permita que trabalhem em seu próprio ritmo.</p>

<h3>Variáveis</h3>
<p><strong>Variáveis</strong> são divertidos e adoram ser o centro das atenções. São espíritos livres que acham mudança e desafios estimulantes. Dê-lhes liberdade para encontrar soluções criativas, reconhecimento público e oportunidades de crescimento pessoal.</p>

<h3>Internos e Externos</h3>
<p><strong>Internos</strong> são idealistas "orientados por missão" que tentam tornar o mundo um lugar melhor. Respeite suas crenças e permita-lhes defender as causas que são apaixonados. <strong>Externos</strong> querem deixar um legado de conquistas — adoram troféus, promoções e salários maiores. Elogie-os publicamente e dê-lhes metas desafiadoras com incentivos impressionantes.</p>

<div class="highlight-box">
  "Para sustentar a motivação, você deve cooperar com seus padrões motivacionais. Se você trabalhar o sistema, o sistema funcionará para você. Seja paciente. A vida não é uma corrida de velocidade. É um esporte de resistência." — Tamara Lowe
</div>

<h2>Alcançando Seus Objetivos</h2>
<p>Uma vez que você entende como se manter motivado, tem tudo o que precisa para alcançar seus objetivos. Os três componentes essenciais são: <strong>começar forte</strong> (seja claro e conciso sobre o que está tentando alcançar, faça inventário dos seus recursos, identifique restrições e crie alianças), <strong>sustentar a ação</strong> (coopere com seus próprios padrões motivacionais únicos) e <strong>terminar primeiro em tudo</strong> (seja o melhor no seu campo trabalhando mais duro e mais inteligentemente).</p>

<div class="highlight-box">
  "O passado é passado. Acabou. Ontem não determina seu amanhã. O que você faz hoje determina seu futuro. Continue com o sistema. Não se preocupe com contratempos. O fracasso não é final a menos que você desista." — Tamara Lowe
</div>

<h2>Conclusão</h2>
<p>A grande contribuição de Tamara Lowe é demonstrar que motivação não é genérica — é <strong>tão pessoal quanto seu DNA biológico</strong>. Ao entender seus próprios impulsos, necessidades e recompensas, você pode criar um ambiente que maximiza sua energia e produtividade. E ao entender o DNA motivacional daqueles ao seu redor, pode inspirá-los de forma muito mais eficaz. A chave é simples: descubra o que move cada pessoa e forneça exatamente isso.</p>`,

  mindmap_json: {
    center_label: 'MOTIVE-SE',
    center_sublabel: 'DNA Motivacional — O Combustível do Sucesso',
    branches: [
      {
        title: '4 Leis da Motivação',
        icon: '📜',
        items: [
          'Todos são motivados diferentemente',
          'Cada pessoa tem tipo único',
          'O que motiva um pode desmotivar outro',
          'Nenhum tipo é melhor que outro',
        ],
      },
      {
        title: 'DNA: 3 Componentes',
        icon: '🧬',
        items: [
          'Impulsos: Conexão ou Produção',
          'Necessidades: Estabilidade ou Variedade',
          'Recompensas: Internas ou Externas',
          '8 combinações motivacionais',
        ],
      },
      {
        title: 'Produtores & Conectores',
        icon: '⚡',
        items: [
          'Produtores: autonomia e desafios',
          'Conectores: equipe e colaboração',
          'Tipo A vs. orientados a pessoas',
          'Estilos de comunicação distintos',
        ],
      },
      {
        title: 'Estabilizadores & Variáveis',
        icon: '🔄',
        items: [
          'Estabilizadores: fatos e lógica',
          'Variáveis: liberdade e criatividade',
          'Rotina vs. aventura',
          'Perfeccionismo vs. espontaneidade',
        ],
      },
      {
        title: 'Internos & Externos',
        icon: '🏅',
        items: [
          'Internos: missão e propósito',
          'Externos: reconhecimento público',
          'Valores vs. resultados tangíveis',
          'Apreciação vs. compensação financeira',
        ],
      },
      {
        title: 'Alcançar Objetivos',
        icon: '🎯',
        items: [
          'Comece forte e com clareza',
          'Sustente cooperando com seu DNA',
          'Termine primeiro em tudo',
          'Equilíbrio em 5 áreas da vida',
        ],
      },
    ],
  },

  insights_json: [
    {
      text: 'Motivação é uma das maiores chaves para o sucesso em todas as áreas de nossas vidas. Educação é importante, mas motivação é mais importante. Talento conta, mas motivação conta mais. É o combustível do sucesso.',
      source_chapter: 'Introdução — A Nova Ciência do Sucesso',
    },
    {
      text: 'O que motiva uma pessoa pode desmotivar outra. Por isso, a forma como abordamos a motivação dos outros precisa ser personalizada em vez de genérica. Motivação tamanho único simplesmente não funciona.',
      source_chapter: 'Cap. 1 — As 4 Leis da Motivação',
    },
    {
      text: 'Produtores são frequentemente impacientes, exigentes e opinativos. Podem parecer rudes, mas se você quer que algo seja feito, entregue a um produtor. Eles adoram desafios que outros veem como impossíveis.',
      source_chapter: 'Cap. 2 — DNA dos Campeões: Produtores',
    },
    {
      text: 'Conectores são superb em fornecer atendimento ao cliente. São bons ouvintes com altos níveis de empatia. Use conectores para construir pontes com clientes e certifique-se de que toda equipe tenha pelo menos um.',
      source_chapter: 'Cap. 2 — DNA dos Campeões: Conectores',
    },
    {
      text: 'Para sustentar a motivação, você deve cooperar com seus padrões motivacionais. Se você trabalhar o sistema, o sistema funcionará para você. Não se preocupe com contratempos. O fracasso não é final a menos que você desista.',
      source_chapter: 'Cap. 4 — Alcance Estratégico de Objetivos',
    },
    {
      text: 'Mesmo crianças criadas pelos mesmos pais no mesmo lar terão fatores motivacionais completamente diferentes. Você deve tratar cada pessoa de forma diferente para manter-se conectado com ela.',
      source_chapter: 'Cap. 3 — Como Motivar Seus Filhos',
    },
    {
      text: 'Internos são idealistas que tentam tornar o mundo melhor. Dinheiro entra na equação apenas como recurso para fazer coisas boas. São muito mais interessados em fazer a diferença do que em fazer dinheiro.',
      source_chapter: 'Cap. 2 — DNA dos Campeões: Internos',
    },
  ],

  exercises_json: [
    {
      title: 'Exercício 1 — Descubra Seu DNA Motivacional',
      icon: '🧬',
      color_theme: 'accent',
      description: 'Responda às três perguntas do DNA Motivacional para descobrir seu tipo único e entender como se auto-motivar de forma mais eficaz.',
      checklist: [
        'Respondi: Sou mais cooperativo ou competitivo? (Conexão ou Produção)',
        'Respondi: Prefiro constância ou mudança? (Estabilidade ou Variedade)',
        'Respondi: Valorizo mais apreciação sincera ou bônus financeiro? (Interno ou Externo)',
        'Identifiquei meu tipo entre os 8 perfis motivacionais',
        'Listei 3 formas de alinhar meu trabalho ao meu DNA',
      ],
    },
    {
      title: 'Exercício 2 — Mapeie o DNA da Sua Equipe',
      icon: '👥',
      color_theme: 'green',
      description: 'Aplique o framework do DNA Motivacional para mapear cada membro da sua equipe e criar incentivos personalizados.',
      checklist: [
        'Identifiquei o tipo motivacional de cada membro da equipe',
        'Anotei o que motiva e desmotiva cada pessoa',
        'Criei pelo menos um incentivo personalizado para cada tipo',
        'Conversei com um membro sobre o que mais o motiva no trabalho',
      ],
    },
    {
      title: 'Exercício 3 — Meta de 90 Dias com DNA',
      icon: '🎯',
      color_theme: 'orange',
      description: 'Selecione um objetivo desafiador para os próximos 90 dias e crie um plano de ataque que use as forças do seu DNA Motivacional.',
      checklist: [
        'Defini um objetivo claro e desafiador para 90 dias',
        'Identifiquei os 3 maiores obstáculos e formas de superá-los',
        'Criei um plano que coopera com meu DNA motivacional',
        'Identifiquei 2 pessoas que podem me ajudar',
        'Defini como vou sustentar minha motivação ao longo do caminho',
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
  console.log('  RESUMOX — Inserting 5 New Books (Batch 4)')
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
