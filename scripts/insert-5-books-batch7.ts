#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content
 * Books: Getting Everything You Can Out Of All You've Got, The Brand You 50,
 *        Ben & Jerry's: The Inside Scoop, The Breakthrough Company,
 *        How To Grow When Markets Don't
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
// Book 1: Getting Everything You Can Out Of All You've Got
// ============================================================

const book1: BookData = {
  slug: 'extraindo-o-maximo-de-tudo-que-voce-tem',
  metadata: {
    title: 'Extraindo o Máximo de Tudo que Você Tem',
    original_title: "Getting Everything You Can Out Of All You've Got",
    author: 'Jay Abraham',
    year: 2000,
    category_slug: 'carreira',
    category_label: 'Carreira & Negócios',
    category_emoji: '💼',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Jay Abraham é um dos maiores especialistas em marketing dos Estados Unidos, tendo consultado mais de 10.000 clientes em 400 empresas diferentes, incluindo IBM, Microsoft e Citibank. Em <strong>"Extraindo o Máximo de Tudo que Você Tem"</strong>, ele revela 21 estratégias práticas para superar a concorrência, organizadas em três grandes pilares: maximizar o que você já possui, multiplicar seus resultados e continuar crescendo indefinidamente.</p>
<p>A premissa central é surpreendentemente simples: a maioria das pessoas e empresas está sentada sobre uma montanha de <strong>ativos ocultos, oportunidades inexploradas e possibilidades ignoradas</strong>. O caminho para o sucesso financeiro e profissional não está em buscar algo novo do zero, mas em extrair todo o potencial daquilo que você já tem em mãos.</p>

<div class="highlight-box">
"Você é mais rico do que imagina. Todo mundo tem ativos dos quais nem tem consciência. Quanto antes você descobrir esses ativos, melhor."
</div>

<h2>Seção 1: Maximize o Que Você Tem</h2>

<h3>Enxergue o Quadro Completo</h3>
<p>A maioria das pessoas comete o erro de complicar os negócios mais do que o necessário. Na realidade, existem apenas <strong>três formas práticas</strong> de aumentar qualquer negócio:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Aumentar o número de clientes</strong> — atrair mais pessoas para comprarem de você.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Aumentar o valor médio por venda</strong> — fazer cada cliente gastar mais a cada transação.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Aumentar a frequência de compra</strong> — fazer os clientes comprarem com mais frequência.</div>
</div>

<p>Se você melhorar cada uma dessas três dimensões em apenas 10%, o resultado combinado será um crescimento total de 33%. E frequentemente, isso resulta em uma <strong>duplicação da renda pessoal</strong> sem praticamente nenhuma diferença nos custos operacionais.</p>

<h3>Crie Avanços Revolucionários</h3>
<p>Além de buscar ganhos incrementais, você deve estar atento a <strong>ideias revolucionárias</strong> — formas completamente diferentes e originais de fazer as mesmas coisas. Avanços revolucionários criam saltos quânticos e dramáticos em vez de pequenos ganhos. Para cultivar essa mentalidade:</p>
<p>Seja oportunista. Sempre que notar um problema, pergunte: "Qual é a oportunidade negligenciada aqui?" Pense em termos de <strong>possibilidades</strong>, não de limitações. Seja receptivo a abordagens novas e fora do padrão da indústria. E mantenha um fluxo constante de informações de alta qualidade entrando em sua mente — você ficará surpreso com quantas ideias pode adaptar de outros campos.</p>

<h3>Faça um Inventário de Seus Pontos Fortes</h3>
<p>Para avançar para onde você quer chegar, primeiro precisa saber exatamente onde está hoje. Faça uma <strong>análise estratégica pessoal e profissional</strong> que inclua: seus ativos e pontos fortes, como seu negócio gera receita atualmente, potencial para parcerias, sua proposta única de venda (USP), análise de concorrentes e custos de aquisição de clientes versus valor vitalício.</p>
<p>Na prática, menos de 5% das empresas fazem essa análise detalhada. A maioria dos empresários gasta seu tempo trabalhando <strong>no</strong> negócio em vez de trabalhar <strong>sobre</strong> o negócio.</p>

<h3>Coloque as Necessidades do Cliente em Primeiro Lugar</h3>
<p>Qualquer negócio que genuinamente coloque as necessidades do cliente à frente de suas próprias preferências vai prosperar. Em vez de ser apaixonado pelo produto, seja apaixonado pela ideia de <strong>atender as necessidades dos seus clientes</strong>. Aja como um consultor confiável, não apenas como um vendedor. Não hesite em recomendar uma solução mais barata se for melhor para o cliente.</p>

<div class="highlight-box">
"É impressionante quantas pessoas e empresas fazem de tudo para fechar uma venda única, em vez de dedicar tempo para entender o resultado desejado pelo cliente. Quando você toma essa abordagem, pode acabar com uma venda inicial menor, mas terá conquistado um novo amigo que se lembrará de você na próxima vez."
</div>

<h3>Calcule o Valor Vitalício do Cliente</h3>
<p>A melhor oferta para um cliente de primeira vez deve refletir o <strong>valor vitalício</strong> desse cliente — não apenas o lucro de uma venda única. Quando você calcula quanto lucro terá ao longo de toda a relação com um cliente, percebe que o lucro da transação inicial é realmente de pouca importância. Portanto, facilite ao máximo para as pessoas começarem um relacionamento com você. Ofereça períodos introdutórios gratuitos, incentivos e até empate no primeiro negócio em antecipação ao retorno de longo prazo.</p>

<h3>Desenvolva sua USP e Use Reversão de Risco</h3>
<p>Sua <strong>Proposta Única de Venda (USP)</strong> é o que diferencia você de todos os outros — seja preço, serviço, qualidade, exclusividade ou seleção. Bons negócios alinham tudo com sua USP.</p>
<p>Além disso, em toda transação, alguém assume o risco. Negócios inteligentes criam formas de <strong>assumir o risco pelo cliente</strong>: garantias do tipo "satisfação ou seu dinheiro de volta em dobro", períodos de teste gratuitos e bônus que o cliente pode manter independentemente da compra. Surpreendentemente, empresas que aumentam a garantia geralmente <strong>aumentam seus lucros</strong>.</p>

<h3>Venda Cruzada e Teste Tudo</h3>
<p>Muitas empresas limitam involuntariamente quanto negócio seus clientes fazem com elas. Em vez disso, ofereça produtos relacionados, pacotes combinados, opções de volume e versões premium. E acima de tudo, <strong>teste cada variável</strong> do seu marketing: preço, título, formato, USP, garantia e método de entrega. Qualquer pessoa pode produzir os mesmos resultados de um gênio do marketing — se simplesmente testar tudo primeiro.</p>

<h2>Seção 2: Multiplique Seu Máximo</h2>

<h3>Alianças Anfitrião-Beneficiário</h3>
<p>Em vez de fazer marketing para o público geral, faça ofertas para pessoas que já estão prontas para comprar. Como encontrá-las? Configurando uma <strong>aliança anfitrião-beneficiário</strong>. Pergunte: "Quem já tem um relacionamento forte com as pessoas que provavelmente comprariam meu produto?" Contate essas empresas e proponha uma promoção conjunta sem riscos para elas.</p>

<h3>Gere Indicações Sistematicamente</h3>
<p>Indicações são sempre a forma mais barata, eficaz e de maior alavancagem de construir um negócio. Configure um <strong>programa formal de indicações</strong>: prepare o terreno sugerindo tipos de pessoas que poderiam se beneficiar, forneça modelos e faça ofertas especiais acessíveis apenas por indicação. Clientes gerados por indicação compram mais, ficam mais tempo, negociam menos e, por sua vez, indicam seus próprios contatos.</p>

<h3>Reative Clientes Inativos</h3>
<p>Sua base de clientes inativos é um recurso enorme e frequentemente inexplorado. A maioria das pessoas para de comprar por razões que não são irreparáveis. Contate-os sinceramente, convide-os de volta com ofertas especiais e pergunte como pode servir suas necessidades novamente. Qualquer empresa que corte sua taxa de abandono pela metade gerará um aumento significativo nas receitas — frequentemente <strong>20% ou mais</strong>.</p>

<div class="highlight-box">
"Pode custar uma fortuna adquirir um novo cliente — mas custa quase nada reconquistar um antigo. Quando você reconhece que mais de 80% dos clientes perdidos não saem por uma razão irreparável, pode agir imediatamente e recuperar muitos — até a maioria — desses clientes."
</div>

<h3>Marketing Direto, Pré-Qualificação e Networking</h3>
<p>Use <strong>mala direta</strong> (física ou digital) com títulos poderosos, provas de validação e chamadas à ação claras. <strong>Pré-qualifique</strong> seus prospectos para focar o marketing nas pessoas mais propensas a comprar — isso gera eficiência cirúrgica. Use <strong>telemarketing</strong> como follow-up e explore a internet para testar ofertas, distribuir amostras e construir comunidades.</p>
<p>Considere também o <strong>bartering</strong> (troca comercial) para aumentar seu poder de compra, e mantenha contato constante com seus clientes tratando-os como amigos valiosos. Quanto mais forte sua rede de relacionamentos, mais difícil será para um concorrente tirá-los de você.</p>

<h2>Seção 3: Continue a Crescer e Melhorar</h2>

<h3>Estabeleça Novas Metas e Pense Grande</h3>
<p>Onde você quer levar seu negócio no futuro? Suas chances de chegar lá aumentam quando você define metas específicas, torna-as alcançáveis e tem a confiança de elevá-las cada vez mais. Use <strong>engenharia reversa</strong>: se sabe onde está e onde quer chegar, calcule precisamente o que precisa acontecer para fazer essa jornada.</p>
<p>Surpreendentemente, a maioria das pessoas, assim que tem um pouco de sucesso, para imediatamente de fazer o que as tornou bem-sucedidas. Não tenha medo de crescer. Não coloque um teto artificial em quanto você pode ganhar. Não há limites reais exceto aqueles que <strong>você impõe a si mesmo</strong>.</p>

<h3>Conheça Seus Verdadeiros Ativos</h3>
<p>Você é mais rico do que imagina. Pergunte-se: que expertise você desenvolveu? Que habilidades você demonstrou que adicionaram valor? O que você realizou que outros gostariam de copiar? Quem adoraria adquirir sua experiência? Frequentemente, existem dezenas de empresas que amariam ter acesso à sua expertise. Venda suas ideias por contrato, alugue sua expertise através de seminários ou licencie suas ideias com compensação baseada nos benefícios gerados.</p>

<div class="highlight-box">
"Ninguém é cem vezes mais inteligente que os outros. Então por que certos super realizadores alcançam mais? Eles têm uma estratégia filosófica melhor."
</div>

<h2>Conclusão</h2>
<p>O livro de Jay Abraham é um manual prático e abrangente para qualquer pessoa que queira extrair o máximo potencial de seus recursos existentes. A mensagem central é clara: <strong>você já possui os ativos necessários para o sucesso</strong>. O que falta é a perspicácia para enxergar as oportunidades, o conhecimento de estratégias comprovadas e a habilidade de alavancá-las juntas.</p>
<p>Não dependa de uma única abordagem. Ataque seu mercado de múltiplas posições. Coloque em prática múltiplas estratégias de sucesso. E acima de tudo, comece agora — porque a diferença entre onde você está e onde poderia estar é simplesmente a decisão de agir.</p>

<div class="highlight-box">
"Uma abordagem que é comum como terra em uma indústria pode ter o poder de uma bomba atômica em uma indústria não relacionada."
</div>`,
  mindmap_json: {
    center_label: 'EXTRAINDO O MÁXIMO DE TUDO QUE VOCÊ TEM',
    center_sublabel: '21 Estratégias para Superar a Concorrência',
    branches: [
      {
        title: 'Maximize o Que Tem',
        icon: '🎯',
        items: [
          'Veja o quadro completo',
          'Crie avanços revolucionários',
          'Inventarie seus pontos fortes',
          'Coloque o cliente primeiro',
          'Calcule valor vitalício',
        ],
      },
      {
        title: 'USP & Risco Zero',
        icon: '🛡️',
        items: [
          'Desenvolva proposta única',
          'Assuma o risco pelo cliente',
          'Ofereça garantias imbatíveis',
          'Venda cruzada e add-ons',
          'Teste absolutamente tudo',
        ],
      },
      {
        title: 'Multiplique Resultados',
        icon: '🚀',
        items: [
          'Alianças anfitrião-beneficiário',
          'Sistema formal de indicações',
          'Reative clientes inativos',
          'Pré-qualifique prospectos',
          'Marketing direto eficaz',
        ],
      },
      {
        title: 'Canais de Crescimento',
        icon: '📡',
        items: [
          'Telemarketing como follow-up',
          'Internet para testar ofertas',
          'Bartering comercial',
          'Networking constante',
        ],
      },
      {
        title: 'Crescimento Contínuo',
        icon: '📈',
        items: [
          'Estabeleça metas elevadas',
          'Use engenharia reversa',
          'Pense grande sem limites',
          'Conheça seus verdadeiros ativos',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Existem apenas três formas de crescer qualquer negócio: mais clientes, maior valor por venda e mais frequência de compra. Melhorar cada uma em apenas 10% resulta em crescimento total de 33%.',
      source_chapter: 'Seção 1 — Veja o Quadro Completo',
    },
    {
      text: 'Menos de 5% das empresas fazem uma análise estratégica detalhada de si mesmas, porque a maioria gasta seu tempo trabalhando no negócio em vez de sobre o negócio.',
      source_chapter: 'Seção 1 — Inventarie Seus Pontos Fortes',
    },
    {
      text: 'Uma abordagem que é comum como terra em uma indústria pode ter o poder de uma bomba atômica em uma indústria não relacionada.',
      source_chapter: 'Seção 1 — Crie Avanços Revolucionários',
    },
    {
      text: 'Empresas que aumentam a garantia geralmente aumentam seus lucros — porque isso as pressiona a entregar o que prometeram e porque a maioria das pessoas é justa e não abusa de garantias genuínas.',
      source_chapter: 'Seção 1 — Reversão de Risco',
    },
    {
      text: 'Pode custar uma fortuna adquirir um novo cliente, mas custa quase nada reconquistar um antigo. Mais de 80% dos clientes perdidos não saem por uma razão irreparável.',
      source_chapter: 'Seção 2 — Reative Clientes Inativos',
    },
    {
      text: 'Depender de uma única abordagem para todos os seus novos clientes é um desastre esperando para acontecer. Ataque seu mercado de múltiplas posições e terá toda a vantagem.',
      source_chapter: 'Seção 3 — Pense Grande',
    },
    {
      text: 'Ninguém é cem vezes mais inteligente que os outros. Então por que certos super realizadores alcançam mais? Eles têm uma estratégia filosófica melhor.',
      source_chapter: 'Seção 3 — Conheça Seus Verdadeiros Ativos',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Análise dos Três Pilares do Crescimento',
      icon: '🔍',
      color_theme: 'accent',
      description:
        'Analise seu negócio ou carreira usando os três únicos caminhos de crescimento: mais clientes, maior valor por transação e mais frequência.',
      template_text:
        'Número atual de clientes: [X]. Meta +10%: [Y]. Valor médio por venda: R$ [X]. Meta +10%: R$ [Y]. Frequência de compra: [X]/ano. Meta +10%: [Y]/ano. Crescimento combinado projetado: [Z]%.',
      checklist: [
        'Calculei meu número atual de clientes/oportunidades',
        'Defini como aumentar 10% em cada pilar',
        'Identifiquei a ação mais rápida para cada pilar',
        'Criei um cronograma de 30 dias para implementação',
      ],
    },
    {
      title: 'Exercício 2 — Programa de Indicações Formal',
      icon: '🤝',
      color_theme: 'green',
      description:
        'Monte um sistema estruturado de indicações que transforme seus melhores clientes em promotores ativos do seu trabalho.',
      checklist: [
        'Listei meus 10 melhores clientes/contatos para pedir indicações',
        'Criei um template de abordagem para solicitar indicações',
        'Defini um incentivo ou benefício para quem indicar',
        'Fiz o primeiro pedido de indicação esta semana',
        'Registrei os resultados para medir eficácia',
      ],
    },
    {
      title: 'Exercício 3 — Reversão de Risco Ousada',
      icon: '🛡️',
      color_theme: 'orange',
      description:
        'Crie uma oferta tão irresistível que elimine todo o risco para o cliente, assumindo a responsabilidade total pelo resultado.',
      template_text:
        'Minha garantia atual: [DESCREVA]. Nova garantia ousada: [DESCREVA]. Risco assumido: [QUEM ASSUME]. Bônus para o cliente se não ficar satisfeito: [DESCREVA].',
      checklist: [
        'Identifiquei o principal medo do meu cliente ao comprar',
        'Criei uma garantia que elimina esse medo completamente',
        'Testei a nova oferta com pelo menos 3 prospectos',
        'Comparei resultados com e sem a garantia ousada',
      ],
    },
  ],
}

// ============================================================
// Book 2: The Brand You 50
// ============================================================

const book2: BookData = {
  slug: 'voce-marca-50',
  metadata: {
    title: 'Você: A Marca — 50 Formas de se Transformar',
    original_title: 'The Brand You 50',
    author: 'Tom Peters',
    year: 1999,
    category_slug: 'carreira',
    category_label: 'Carreira & Negócios',
    category_emoji: '💼',
    reading_time_min: 13,
    cover_gradient_from: '#1a0a2e',
    cover_gradient_to: '#2d1b69',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Tom Peters, um dos pensadores de negócios mais influentes do mundo, lança um alerta provocador: <strong>o paradigma do emprego vitalício em uma corporação acabou</strong>. Na nova economia baseada no conhecimento, cada pessoa precisa agir como um contratado independente, agregar valor tangível, depender de suas habilidades constantemente atualizadas e ser julgada exclusivamente pelo seu histórico de projetos.</p>
<p>Em "Você: A Marca — 50 Formas de se Transformar", Peters apresenta 50 dicas práticas para que qualquer pessoa — empregada ou autônoma — construa sua marca pessoal usando o mesmo framework que empresas utilizam para construir valor de marca. A gestão de carreira na nova economia deve ser construída em torno de quatro pilares:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Histórico de projetos impressionantes</strong> — que entregaram resultados notáveis e mensuráveis.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Diferenciação</strong> — conquistar ou fazer algo que se destaque de todos os outros.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Agregar valor contínuo</strong> — através de capacitação e expansão da rede de contatos.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Foco inabalável em resultados tangíveis</strong> — e ignorar todo o resto.</div>
</div>

<div class="highlight-box">
"A unidade fundamental da nova economia não é a corporação, mas o indivíduo. Tarefas não são designadas através de uma cadeia estável de gestão, mas são executadas autonomamente por contratados independentes."
</div>

<h2>Construindo os Alicerces da Sua Marca</h2>

<h3>Ninguém Pode Criar Sua Marca — Só Você</h3>
<p>Não existe mais ninguém que possa gerenciar sua carreira por você. A era dos gestores, planos de carreira e até mentores que decidem por você acabou. A única forma de avançar é ser <strong>proativo e assumir responsabilidade</strong> pelo que você se torna e pelo que realiza.</p>

<h3>Diferencie-se ou Desapareça</h3>
<p>Se você não reinventar sua carreira agora enquanto ainda tem opções, um tsunami vai fazer a reconfiguração por você. A economia da atenção é um sistema de estrelas — se não há nada muito especial no seu trabalho, não importa quão arduamente você se esforce, <strong>você não será notado</strong> e, cada vez mais, não será bem pago.</p>

<h3>Tire uma Foto do Estado Atual</h3>
<p>Para avaliar o valor atual da sua marca: desenvolva um anúncio de 1/4 de página para as Páginas Amarelas, crie uma declaração de posicionamento em 8 palavras ou menos, e resuma sua marca em um adesivo de para-choque. Faça uma avaliação formal: quais habilidades-chave você oferece? Que novas habilidades adquiriu nos últimos 12 meses? Como seu currículo será melhorado nos próximos 90 dias?</p>

<h2>Projetos, Foco e Diferenciação</h2>

<h3>Foque no Projeto, Não no Emprego</h3>
<p>Sua marca é definida pelos projetos em que trabalha e pelos resultados alcançados. No momento em que você começa a pensar "emprego", encontra limites. Como presidente da empresa de serviços profissionais da qual é dono (e que detém sua marca), foque em produzir resultados em projetos tão impressionantes que você vai se gabar deles para todos.</p>

<h3>Obsessão pelo Único Traço de Diferenciação</h3>
<p>A desordem mata o potencial de realizar algo impressionante. Encontre <strong>o único projeto</strong> no qual pode apostar sua carreira — às custas de todas as outras possibilidades. Selecionar um entre a vasta gama de possibilidades será excruciante, mas necessário. Até que você estreite seu foco, nunca produzirá uma performance de classe mundial.</p>

<div class="highlight-box">
"É fácil decidir o que você vai fazer. O difícil é decidir o que você não vai fazer."
— Michael Dell
</div>

<h3>Construa um Portfólio de Projetos Impressionantes</h3>
<p>Seja obcecado pelos projetos que definirão sua vida. Liste seus projetos atuais, descreva o resultado verdadeiramente impressionante para cada um, classifique-os por paixão e impacto, escolha o melhor, faça uma descrição de uma página, mostre para amigos e <strong>execute sem desvios</strong>.</p>

<h2>Networking, Design e Marca Pessoal</h2>

<h3>O Crescimento da Sua Marca Depende do Networking</h3>
<p>O sucesso do programa Marca Você depende da sua capacidade de fazer <strong>networking produtivo</strong> com pessoas de habilidades complementares. Mantenha um sistema de rastreamento escrito, vincule sua rede à agenda, reserve alguns minutos por dia para networking e busque ativamente novas pessoas.</p>
<p>A <strong>diversidade da sua rede</strong> agrega valor. Se você conversa com as mesmas pessoas o tempo todo, nunca será exposto a ideias novas e desafiadoras. Deliberadamente, recrute "freaks" para sua rede — pessoas que fazem coisas que você admira.</p>

<h3>Obsessão com Design e Credibilidade</h3>
<p>Sua Marca Você comunica constantemente pistas de design. O design influencia fortemente como as pessoas percebem quem você é. Um cartão de visitas impressionante, um site deslumbrante e habilidades de apresentação polidas são fundamentais. E acima de tudo, <strong>credibilidade transforma uma marca em sinônimo de confiança</strong> — isso requer dizer a verdade, mesmo quando é desvantajoso para você.</p>

<h2>Renovação, Liderança e Poder</h2>

<h3>Renove Sua Marca Todos os Dias</h3>
<p>Todo dia, você precisa fazer algo que amplie suas reservas de experiência, force a aquisição de uma nova habilidade ou fortaleça a Marca Você para o futuro — ou você automaticamente fica para trás. Desenvolva um <strong>plano formal de reinvestimento</strong> que detalhe novas habilidades, pessoas, projetos e atividades que vão enriquecer seu currículo.</p>

<h3>Lidere, Seja Otimista e Busque o Poder de Realizar</h3>
<p>Pessoas da Marca Você assumem o controle de suas vidas sendo dependentes de um portfólio expansível de habilidades, obcecadas com diferenciação, dedicadas a construir redes e totalmente orientadas a projetos. Esses são exatamente os traços de <strong>grandes líderes</strong>.</p>
<p>Trate o otimismo praticado como uma competência central. Sorria mais, exercite-se, vista-se bem — faça o que for necessário para se sentir bem, porque você será mais eficaz quando se sente bem.</p>

<div class="highlight-box">
"Estamos fartos de reclamar de chefes ou empresas ruins. É — como nós vemos — a nossa vida. Para viver... ou perder. Para formar... ou permitir ser formado. Este é o momento mais legal em séculos para deixar sua marca."
</div>

<h2>Conclusão</h2>
<p>Tom Peters nos convoca a uma revolução pessoal: parar de pensar como empregado e começar a pensar como <strong>uma marca</strong>. Na nova economia, sua segurança profissional reside exclusivamente em suas habilidades, sua diferenciação, sua rede de contatos e sua disposição de correr atrás dos grandes projetos. A essência da Marca Você é um compromisso com o crescimento a qualquer custo — um compromisso com a expressão livre e a excelência pessoal.</p>
<p>A pergunta que fica é simples: <strong>você está disposto a fazer o que for preciso para conseguir a oportunidade que deseja?</strong></p>`,
  mindmap_json: {
    center_label: 'VOCÊ: A MARCA — 50 FORMAS',
    center_sublabel: 'Transforme-se em uma Marca Pessoal',
    branches: [
      {
        title: 'Fundamentos da Marca',
        icon: '🏗️',
        items: [
          'Só você cria sua marca',
          'Diferencie-se ou desapareça',
          'Segurança = branding pessoal',
          'Fotografe o estado atual',
        ],
      },
      {
        title: 'Projetos & Foco',
        icon: '🎯',
        items: [
          'Foque no projeto, não no emprego',
          'Portfólio de projetos impressionantes',
          'Um único traço de diferenciação',
          'Execute sem desvios',
        ],
      },
      {
        title: 'Networking & Design',
        icon: '🌐',
        items: [
          'Networking produtivo e formal',
          'Diversidade na rede de contatos',
          'Design comunica sua marca',
          'Credibilidade gera confiança',
        ],
      },
      {
        title: 'Presença & PR',
        icon: '📣',
        items: [
          'Cartão de visitas memorável',
          'Site profissional deslumbrante',
          'Seja sua própria agência de PR',
          'Marketing boca-a-boca proativo',
        ],
      },
      {
        title: 'Liderança & Crescimento',
        icon: '⚡',
        items: [
          'Renove-se todos os dias',
          'Plano formal de reinvestimento',
          'Otimismo como competência',
          'Compromisso com excelência',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Na nova economia, sua segurança profissional vem de habilidades comercializáveis, diferenciação em relação aos outros e uma rede de pessoas trabalhando em outros projetos.',
      source_chapter: 'Dica 3 — Segurança Profissional',
    },
    {
      text: 'Sua marca é definida pelos projetos em que trabalha e pelos resultados alcançados. No momento em que você começa a pensar "emprego", encontra limites como "não é meu trabalho fazer isso".',
      source_chapter: 'Dica 5 — Foco no Projeto',
    },
    {
      text: 'É fácil decidir o que você vai fazer. O difícil é decidir o que você NÃO vai fazer. Até estreitar seu foco do numeroso ao único, nunca produzirá performance de classe mundial.',
      source_chapter: 'Dica 18 — Diferenciação',
    },
    {
      text: 'Se você conversa com as mesmas pessoas o tempo todo, nunca será exposto a ideias novas e desafiadoras. Deliberadamente recrute "freaks" para sua rede — pessoas que fazem coisas que você admira.',
      source_chapter: 'Dica 23 — Diversidade na Rede',
    },
    {
      text: 'O maior obstáculo para a Marca Você está entre suas orelhas. É aprender a pensar de forma independente. E isso não tem absolutamente nada a ver com se você planeja ficar na empresa atual por mais 6 meses ou 16 anos.',
      source_chapter: 'Dica 7 — Imagem Mental de Empresa',
    },
    {
      text: 'Você se torna aquilo que coloca na sua agenda. Portanto, planeje seu negócio ao redor da realização de projetos que são sua assinatura — a custo de todas as outras opções.',
      source_chapter: 'Dica 13 — Alocação de Tempo',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Auditoria da Marca Pessoal',
      icon: '🔎',
      color_theme: 'accent',
      description:
        'Faça um diagnóstico completo do estado atual da sua marca pessoal respondendo às 7 perguntas de avaliação de Tom Peters.',
      template_text:
        'Minha declaração de posicionamento em 8 palavras: [ESCREVA]. Habilidades-chave atuais: [LISTE]. Nova habilidade adquirida nos últimos 12 meses: [DESCREVA]. Como meu currículo melhora nos próximos 90 dias: [EXPLIQUE].',
      checklist: [
        'Escrevi minha declaração de posicionamento em 8 palavras',
        'Listei minhas 3 habilidades-chave mais reconhecidas',
        'Identifiquei 1 lacuna de habilidade para preencher',
        'Defini como meu currículo será diferente em 90 dias',
      ],
    },
    {
      title: 'Exercício 2 — Projeto Assinatura',
      icon: '🚀',
      color_theme: 'green',
      description:
        'Identifique e comprometa-se com um único projeto que será a peça central do seu portfólio profissional nos próximos meses.',
      checklist: [
        'Listei meus 5 projetos atuais ou potenciais',
        'Classifiquei cada um por paixão e impacto potencial',
        'Selecionei o projeto #1 que definirá minha marca',
        'Escrevi uma descrição de 1 página do projeto',
        'Compartilhei com 2 pessoas de confiança para feedback',
      ],
    },
    {
      title: 'Exercício 3 — Expansão Radical de Rede',
      icon: '🌪️',
      color_theme: 'orange',
      description:
        'Quebre sua bolha profissional adicionando deliberadamente pessoas de áreas completamente diferentes à sua rede de contatos.',
      checklist: [
        'Identifiquei 3 "freaks" — pessoas de áreas diferentes que admiro',
        'Entrei em contato com pelo menos 1 deles esta semana',
        'Reservei 15 minutos diários na agenda para networking',
        'Participei de 1 evento fora da minha área de atuação',
      ],
    },
  ],
}

// ============================================================
// Book 3: Ben & Jerry's: The Inside Scoop
// ============================================================

const book3: BookData = {
  slug: 'ben-e-jerrys-os-bastidores',
  metadata: {
    title: "Ben & Jerry's: Os Bastidores",
    original_title: "Ben & Jerry's: The Inside Scoop",
    author: 'Fred "Chico" Lager',
    year: 1994,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 15,
    cover_gradient_from: '#0a1a0f',
    cover_gradient_to: '#1a3a2e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A história da <strong>Ben & Jerry's</strong> é uma das mais fascinantes do empreendedorismo americano. Dois amigos de infância que se conheceram na aula de educação física da 7ª série — ambos acima do peso, ambos ficando para trás na corrida de uma milha — construíram um império de sorvete que chegou a US$ 132 milhões em vendas, derrotou a gigante Haagen-Dazs e provou que é possível ter <strong>consciência social e lucro ao mesmo tempo</strong>.</p>
<p>Escrito por Fred "Chico" Lager, que foi contratado como gerente geral da empresa, o livro revela os bastidores de como Ben Cohen e Jerry Greenfield transformaram US$ 12.000 em capital inicial e um curso por correspondência de US$ 5 sobre fabricação de sorvete em uma das marcas mais amadas da América.</p>

<div class="highlight-box">
"Não tínhamos muita coisa a nosso favor. Não tínhamos ativos ou garantias. Éramos novos na região. Éramos jovens. Não éramos casados. E não tínhamos experiência em negócios."
— Jerry Greenfield
</div>

<h2>As Origens: De Amigos de Infância a Sócios</h2>
<p>Ben Cohen e Jerry Greenfield se tornaram amigos quando ambos ficaram para trás na corrida de uma milha na aula de educação física. O treinador gritou que teriam que repetir se não terminassem em menos de sete minutos. Ben respondeu: <strong>"Mas treinador, se não conseguimos na primeira vez, como vamos conseguir na segunda?"</strong> — e com isso, Jerry soube que tinha encontrado o tipo de pessoa com quem queria andar.</p>
<p>Ben era excelente em comer e atividades extracurriculares, mas medíocre nos estudos. Jerry era o oposto — aluno de média 3.8, aspirante a médico. Depois de várias tentativas frustradas em carreiras tradicionais (Ben foi demitido de padaria, lanchonete e escola; Jerry não conseguiu entrar em nenhuma faculdade de medicina), decidiram abrir um negócio juntos.</p>

<h3>A Decisão: Bagels ou Sorvete?</h3>
<p>Primeira ideia: entregar bagels frescos com o jornal de domingo. Problema: equipamento custava US$ 40.000 e não sabiam o que fazer nos outros seis dias da semana. Segunda ideia: sorvete — que eles <strong>simplesmente assumiram</strong> ser mais barato que bagels (sem pesquisar). Investiram US$ 5 em um curso por correspondência da Penn State e partiram para Burlington, Vermont.</p>

<h2>Os Primeiros Anos: Caos Criativo</h2>
<p>Com US$ 4.000 de cada um e US$ 4.000 do banco, totalizando US$ 12.000, reformaram um posto de gasolina abandonado. Como não tinham dinheiro para pagar o construtor, ofereceram <strong>sorvete grátis vitalício</strong> — e ele aceitou. Abriram em 5 de maio de 1978 (uma semana antes do planejado por erro no anúncio do jornal).</p>
<p>Como Ben não tinha sentido de paladar nem olfato, o sorvete precisava ter <strong>sabor intenso e muitos pedaços</strong> para que Jerry pudesse identificar os sabores. Resultado: um sorvete rico, cremoso, denso e cheio de pedaços que se tornaria a assinatura da marca.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Limitação virou diferencial:</strong> A incapacidade de Ben de sentir sabor levou a um produto com sabor intenso e texturas únicas que conquistou o público.</div>
</div>

<h3>Promoções Geniais com Zero Orçamento</h3>
<p>Sem dinheiro para marketing, Ben e Jerry inventaram promoções memoráveis:</p>
<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>POPCDBZWE</strong> — "Penny Off Per Celsius Degree Below Zero Winter Extravaganza" (desconto de centavo por grau abaixo de zero).</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Free Cone Day</strong> — Dia anual de sorvete grátis no aniversário da loja, tradição que dura até hoje.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Festival "Fall Down"</strong> — Gala anual com competições de descascar maçãs, corrida de sapos e shows.</div>
</div>

<h2>De Loja Local a Marca Nacional</h2>

<h3>O Salto para o Atacado</h3>
<p>Apesar de vendas no primeiro ano de quase o dobro dos US$ 90.000 projetados, a loja não dava lucro. A solução: vender por atacado. Ben começou a entregar sorvete em uma van International de 1969, e logo a ideia brilhante surgiu — embalar em potes de 500ml com o rosto dos dois na tampa, seguindo sugestão da designer Lyn Severance.</p>
<p>As vendas dos potes <strong>decolaram imediatamente</strong>. Em poucos meses, Ben foi de 35 para mais de 200 contas.</p>

<h3>A Guerra contra a Pillsbury/Haagen-Dazs</h3>
<p>Quando a Pillsbury (dona da Haagen-Dazs) tentou forçar distribuidores a parar de vender Ben & Jerry's, eles revidaram de forma genial: Jerry fez piquete na frente da sede da Pillsbury, criaram kits de protesto "Doughboy", colocaram adesivos nos potes com número 800 para reclamações e mobilizaram a mídia. A história de <strong>"duas hippies de Vermont contra uma Fortune 500"</strong> viralizou. A Pillsbury recuou e fez um acordo.</p>

<h3>O Cowmobile e a Expansão Nacional</h3>
<p>Para expandir nacionalmente, Ben e Jerry compraram um trailer velho, cortaram a lateral e instalaram uma janela de atendimento. Apelidaram de "Cowmobile" e pintaram um mural de vacas pastando. Distribuíram 1.000 cones grátis por dia pelo país. Na volta, o motor pegou fogo em Cleveland e destruiu o veículo. Sem se abalar, usaram o seguro para comprar o Cowmobile II. A viagem gerou <strong>mais de US$ 1 milhão em publicidade gratuita</strong>.</p>

<div class="highlight-box">
"A direção era meio solta, e o Cowmobile balançava um pouco, por isso era tão cansativo dirigir. Ben não gostava disso. E fizemos uma aposta sobre quem bateria em algo primeiro. Semanas depois, eu raspei meu espelho em algo, e no instante em que bati, Ben gritou: 'FOI VOCÊ!'"
— Jerry Greenfield
</div>

<h2>Responsabilidade Social como Estratégia</h2>
<p>O que mais surpreende na história da Ben & Jerry's é como a <strong>missão social fortaleceu os negócios</strong> em vez de prejudicá-los:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Fundação:</strong> 7,5% dos lucros pré-impostos para organizações sem fins lucrativos.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Política salarial 5:1:</strong> Nenhum funcionário (nem o CEO) podia ganhar mais que 5 vezes o salário do funcionário mais baixo.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Fornecedores sociais:</strong> Brownies de padaria que empregava sem-teto, castanhas de florestas tropicais sustentáveis.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Joy Committee:</strong> Comitê dedicado a tornar o trabalho divertido — com Dia do Elvis e sessões de Synchro-Energizer.</div>
</div>

<p>Vendas em 1991: US$ 97 milhões. Em 1992: US$ 132 milhões. Em 1994, a Ben & Jerry's ultrapassou a Haagen-Dazs em participação de mercado. A empresa foi nomeada três vezes consecutivas para a lista da Forbes de "200 Melhores Pequenas Empresas da América".</p>

<div class="highlight-box">
"O mais surpreendente é que nossos valores sociais — aquela parte da nossa missão que nos convoca a usar nosso poder como empresa para melhorar a qualidade de vida — na verdade nos ajudaram a nos tornar uma empresa estável, lucrativa e de alto crescimento."
— Ben Cohen
</div>

<h2>Conclusão</h2>
<p>A história da Ben & Jerry's prova que não é preciso escolher entre <strong>fazer o bem e fazer dinheiro</strong>. Com criatividade, autenticidade, humor e uma dose saudável de irreverência, dois amigos que não tinham experiência em negócios, ativos ou garantias construíram uma marca icônica que mudou para sempre a indústria de sorvetes — e a forma como pensamos sobre responsabilidade corporativa.</p>
<p>A lição mais duradoura é que negócios podem e devem ser uma força para o bem na sociedade, e que quando uma empresa cuida genuinamente da comunidade, <strong>a comunidade cuida da empresa</strong>.</p>`,
  mindmap_json: {
    center_label: "BEN & JERRY'S: OS BASTIDORES",
    center_sublabel: 'De US$ 12 mil a US$ 132 milhões',
    branches: [
      {
        title: 'Origens Improváveis',
        icon: '🍦',
        items: [
          'Amigos desde a 7ª série',
          'Curso de sorvete por US$ 5',
          'Capital inicial de US$ 12 mil',
          'Posto de gasolina reformado',
        ],
      },
      {
        title: 'Marketing Genial',
        icon: '🎪',
        items: [
          'Free Cone Day anual',
          'POPCDBZWE — desconto por frio',
          'Cowmobile cross-country',
          'Guerra contra Haagen-Dazs',
        ],
      },
      {
        title: 'Crescimento Explosivo',
        icon: '📈',
        items: [
          'Potes 500ml com rosto dos dois',
          'De 35 a 200+ contas rapidamente',
          'IPO com ações para vermontianos',
          'Vendas dobrando ano a ano',
        ],
      },
      {
        title: 'Missão Social',
        icon: '❤️',
        items: [
          '7,5% lucros para fundação',
          'Política salarial 5:1',
          'Fornecedores sociais',
          'Joy Committee no trabalho',
        ],
      },
      {
        title: 'Lições de Negócios',
        icon: '💡',
        items: [
          'Limitação virou diferencial',
          'Autenticidade conquista clientes',
          'Lucro e propósito coexistem',
          'Humor como estratégia',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'A incapacidade de Ben de sentir sabor ou cheiro — uma aparente desvantagem — levou a um sorvete com sabor intenso e muitos pedaços que se tornou a assinatura diferenciadora da marca.',
      source_chapter: 'Cap. 2 — O Início do Negócio',
    },
    {
      text: 'Com US$ 12.000 de capital inicial, sem experiência e sem garantias, a chave para sobreviver foi a criatividade: pagar um construtor com sorvete grátis vitalício e fazer promoções que não custavam quase nada.',
      source_chapter: 'Cap. 3 — A Grande Inauguração',
    },
    {
      text: 'O mais surpreendente é que os valores sociais da Ben & Jerry\'s na verdade ajudaram a empresa a se tornar estável, lucrativa e de alto crescimento — contrariando teóricos que diziam ser impossível lucrar e ajudar a comunidade.',
      source_chapter: 'Cap. 9 — Responsabilidade Social',
    },
    {
      text: 'Quando a gigante Pillsbury tentou esmagar a pequena Ben & Jerry\'s, a estratégia de "dois hippies de Vermont contra uma Fortune 500" gerou enorme simpatia pública e publicidade gratuita.',
      source_chapter: 'Cap. 5 — A Guerra contra Haagen-Dazs',
    },
    {
      text: 'A viagem do Cowmobile, onde distribuíram 1.000 cones grátis por dia pelo país, gerou mais de US$ 1 milhão em publicidade gratuita — provando que generosidade é a melhor forma de marketing.',
      source_chapter: 'Cap. 6 — O Cowmobile',
    },
    {
      text: 'A maioria das pessoas suspende seus valores sobre contribuir com a sociedade quando vai trabalhar. É quando estamos no trabalho que somos mais poderosos, porque estamos organizados e temos recursos financeiros.',
      source_chapter: 'Cap. 9 — Filosofia de Ben Cohen',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Transforme Limitações em Diferenciais',
      icon: '🔄',
      color_theme: 'accent',
      description:
        'Identifique uma limitação pessoal ou do seu negócio e descubra como ela pode se tornar um diferencial competitivo, assim como a falta de paladar de Ben gerou o melhor sorvete.',
      checklist: [
        'Listei 3 limitações que considero desvantagens',
        'Para cada uma, escrevi como poderia se tornar um diferencial',
        'Identifiquei 1 limitação para transformar esta semana',
        'Compartilhei minha ideia com alguém de confiança',
      ],
    },
    {
      title: 'Exercício 2 — Marketing de Custo Zero',
      icon: '🎪',
      color_theme: 'green',
      description:
        'Crie 3 ideias de promoção ou divulgação que custem quase nada, inspirado nas táticas criativas de Ben e Jerry.',
      checklist: [
        'Criei 3 ideias de promoção com orçamento próximo a zero',
        'Escolhi a mais viável e defini uma data de execução',
        'Executei a promoção e medi o resultado',
        'Documentei o que funcionou para replicar no futuro',
      ],
    },
    {
      title: 'Exercício 3 — Missão Social do Seu Negócio',
      icon: '🌍',
      color_theme: 'orange',
      description:
        'Defina como seu trabalho ou negócio pode gerar impacto social positivo, seguindo o exemplo da missão tripla da Ben & Jerry\'s (produto, social, econômica).',
      template_text:
        'Missão do Produto: [O QUE ENTREGO DE EXCELENTE]. Missão Social: [COMO CONTRIBUO COM A COMUNIDADE]. Missão Econômica: [COMO CRESÇO DE FORMA SUSTENTÁVEL].',
      checklist: [
        'Escrevi minha missão tripla (produto, social, econômica)',
        'Identifiquei 1 ação social que posso começar esta semana',
        'Defini como medir o impacto dessa ação',
        'Compartilhei a missão com minha equipe ou parceiros',
      ],
    },
  ],
}

// ============================================================
// Book 4: The Breakthrough Company
// ============================================================

const book4: BookData = {
  slug: 'a-empresa-revolucionaria',
  metadata: {
    title: 'A Empresa Revolucionária',
    original_title: 'The Breakthrough Company',
    author: 'Keith McFarland',
    year: 2008,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 14,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Apenas <strong>um décimo de um por cento</strong> das empresas iniciantes nos Estados Unidos consegue atingir receitas de US$ 250 milhões ou mais. E das que chegam lá, apenas uma em três — um trigésimo de um por cento — cresce até US$ 1 bilhão. A maioria das empresas começa pequena e permanece assim. Apenas um punhado consegue "romper a barreira" e se tornar grande.</p>
<p>Keith McFarland estudou mais de 7.000 empresas empreendedoras que apareceram na lista anual da revista Inc. das 500 empresas de crescimento mais rápido e identificou as <strong>nove com melhor desempenho</strong>. Sua pesquisa revelou seis práticas que distinguem as empresas revolucionárias das comuns.</p>

<div class="highlight-box">
"Construir uma empresa revolucionária é menos sobre escolher a indústria certa e mais sobre agir nas oportunidades já disponíveis no seu negócio existente."
</div>

<h2>Princípio 1: Abordagem Centrada na Organização</h2>
<p>Empresas revolucionárias não são construídas para atender às necessidades ou caprichos de seus fundadores. Existe uma crença de que <strong>o que é bom para a organização deve vir primeiro</strong>. Os construtores de empresas revolucionárias "coroam a empresa" em vez de coroar a si mesmos.</p>
<p>Essas empresas passam por quatro estágios de crescimento: de <strong>banda de um homem só</strong>, passando por <strong>clã tribal</strong> e <strong>anciãos da aldeia</strong>, até se tornar uma <strong>organização soberana</strong>. Líderes que evoluem junto com a empresa não precisam ser substituídos.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Coroe o cliente:</strong> Foque no que os clientes querem, não no que acontece internamente.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Mire alto:</strong> Construa uma grande empresa, não apenas uma que sobreviva.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Evite a "realeza corporativa":</strong> Sem escritórios luxuosos, perks excessivos ou jatos.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Seja coach, não comandante:</strong> Trabalhe com as pessoas para desenvolver habilidades.</div>
</div>

<h2>Princípio 2: Continue Aumentando as Apostas</h2>
<p>Empresas revolucionárias continuam fazendo <strong>apostas progressivamente maiores</strong> à medida que crescem. Não descansam sobre seus louros. Essas apostas não são aleatórias — são investimentos que ao longo do tempo <strong>inclinam as probabilidades a favor da empresa</strong>.</p>
<p>Existem cinco tipos de apostas: de mercado, de processo, de recursos, de localização e de canal de distribuição. Para decidir quais fazer, usam o processo de "descascar a cebola" — debatendo em camadas: Para onde estamos indo? Quais as consequências de NÃO apostar? Como esta aposta se correlaciona com as outras? Podemos hedgear? Quando devemos desistir?</p>

<div class="highlight-box">
"Progresso sempre envolve risco; você não pode roubar a segunda base mantendo o pé na primeira."
— Frederick Wilcox
</div>

<h2>Princípio 3: Construa Caráter Sistematicamente</h2>
<p>Empresas revolucionárias não perdem tempo escrevendo declarações de valores. Estão ocupadas demais <strong>alinhando o que dizem com o que fazem</strong>. O caráter se reflete mais claramente na forma como a empresa trata seus clientes e funcionários. Quatro ações constroem caráter:</p>
<p>Acreditar em dar um <strong>acordo justo</strong> a todos, acreditar nas pessoas e dar-lhes poder para se destacarem, ser <strong>"avarentos estratégicos"</strong> (cortando custos onde não importa para investir onde importa) e fazer a palavra valer — cumprir compromissos mesmo quando custa caro.</p>

<h2>Princípio 4: Vença Através de Vantagem Estrutural</h2>
<p>Empresas pequenas vencem por serem ágeis, próximas dos clientes e baratas. Empresas revolucionárias encontram formas de <strong>institucionalizar essas vantagens em escala maior</strong>. Elas navegam o "Triângulo das Bermudas dos Negócios" — o equilíbrio entre dar aos clientes o que querem, manter custos baixos e reagir rapidamente.</p>
<p>Para isso, investem em infraestrutura que reduz custos no futuro, evitam diversificação excessiva, só se expandem quando os clientes pedem e <strong>evitam adicionar camadas de gestão</strong> — porque nada mata velocidade e satisfação do cliente mais rápido.</p>

<h2>Princípio 5: Incorpore as Melhores Ideias Externas</h2>
<p>Empresas pequenas frequentemente são construídas em torno de uma única percepção. Revolucionárias erguem <strong>"andaimes"</strong> de recursos externos — redes de pares, conselhos consultivos, investidores, conselhos de clientes, fornecedores, universidades e consultores — que as ajudam a alcançar o próximo nível repetidamente.</p>
<p>A característica distintiva é que elas <strong>realmente usam</strong> as informações fornecidas, em vez de insistir em reinventar a roda. Surpreendentemente, nenhuma das empresas revolucionárias estudadas foi financiada por capital de risco em seus anos iniciais.</p>

<h2>Princípio 6: Questione Todas as Premissas</h2>
<p>Revolucionárias sabem que o que é verdade hoje pode não ser amanhã. Por isso contratam <strong>"insultantes"</strong> (em vez de consultores) — pensadores independentes com licença para questionar qualquer premissa do negócio. Criam um ambiente onde:</p>
<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Fracassos são celebrados</strong> — porque se as pessoas têm medo de falhar, não tentarão nada novo.</div>
</div>
<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Tempos difíceis são aproveitados</strong> — para forçar a empresa a enfrentar fatos, priorizar e descobrir em quem pode confiar.</div>
</div>
<p>Paradoxalmente, empresas revolucionárias entendem que o negócio está mais em risco quando tudo vai bem. É nesses momentos que ninguém faz perguntas difíceis.</p>

<div class="highlight-box">
"Ser revolucionário é uma jornada, não um destino. Não existem empresas revolucionárias permanentes — apenas empresas que se engajam em práticas que levam ao sucesso de longo prazo."
</div>

<h2>Conclusão</h2>
<p>A pesquisa de McFarland revela que empresas revolucionárias não são necessariamente as mais inovadoras ou as que estão nas indústrias mais "quentes". São as que dominam seis práticas fundamentais: <strong>coroar a organização acima dos indivíduos, fazer apostas progressivas, construir caráter na ação, criar vantagens estruturais, usar as melhores ideias disponíveis e questionar constantemente suas premissas</strong>. A boa notícia é que qualquer empresa pode adotar essas práticas. A má notícia é que o momento de começar é agora.</p>`,
  mindmap_json: {
    center_label: 'A EMPRESA REVOLUCIONÁRIA',
    center_sublabel: '6 Princípios do Crescimento Extraordinário',
    branches: [
      {
        title: 'Organização Primeiro',
        icon: '👑',
        items: [
          'Coroe a empresa, não o líder',
          'De banda solo a organização soberana',
          'Coach, não comandante',
          'Corte privilégios corporativos',
        ],
      },
      {
        title: 'Apostas Progressivas',
        icon: '🎲',
        items: [
          'Aumente apostas ao crescer',
          'Cinco tipos de apostas',
          'Descasque a cebola para decidir',
          'Saiba quando desistir',
        ],
      },
      {
        title: 'Caráter Sistemático',
        icon: '💎',
        items: [
          'Alinhe palavras e ações',
          'Acordo justo para todos',
          'Avarentos estratégicos',
          'Faça a palavra valer',
        ],
      },
      {
        title: 'Vantagem Estrutural',
        icon: '🏗️',
        items: [
          'Institucionalize vantagens de escala',
          'Evite diversificação excessiva',
          'Sem camadas desnecessárias',
          'Clientes decidem expansão',
        ],
      },
      {
        title: 'Ideias Externas',
        icon: '🌐',
        items: [
          'Andaimes de recursos externos',
          'Conselhos consultivos fortes',
          'Use, não reinvente a roda',
          'Redes de pares e mentores',
        ],
      },
      {
        title: 'Questione Tudo',
        icon: '🔥',
        items: [
          'Contrate "insultantes"',
          'Celebre fracassos',
          'Aproveite tempos difíceis',
          'Maior risco: quando tudo vai bem',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'Apenas um décimo de um por cento das empresas iniciantes atinge US$ 250 milhões em receita. As que conseguem compartilham seis práticas específicas e replicáveis.',
      source_chapter: 'Introdução — A Pesquisa',
    },
    {
      text: 'O gargalo está sempre no topo da garrafa. Construtores de empresas revolucionárias coroam a organização, não a si mesmos — colocam os interesses da empresa acima das preferências pessoais.',
      source_chapter: 'Princípio 1 — Organização Primeiro',
    },
    {
      text: 'Empresas revolucionárias não são grandes tomadoras de risco. Crescem dominando a arte de fazer apostas eficazes e prudentes, calculando as probabilidades e inclinando-as a seu favor.',
      source_chapter: 'Princípio 2 — Apostas Progressivas',
    },
    {
      text: 'Quando se trata de caráter, você não pode fingir. Ou você tem ou não tem. O verdadeiro caráter de qualquer organização sempre começa com o líder.',
      source_chapter: 'Princípio 3 — Caráter Sistemático',
    },
    {
      text: 'Lembrar o que fez você ter sucesso como startup é muito mais importante que qualquer coisa nova associada a ficar grande.',
      source_chapter: 'Princípio 4 — Vantagem Estrutural',
    },
    {
      text: 'Ficamos chocados com o fato de que nenhuma das empresas revolucionárias foi financiada por capital de risco em seus anos iniciais.',
      source_chapter: 'Princípio 5 — Ideias Externas',
    },
    {
      text: 'Paradoxalmente, empresas revolucionárias entendem que o negócio está mais em risco quando tudo vai bem. É quando poucos continuam fazendo perguntas difíceis.',
      source_chapter: 'Princípio 6 — Questione Tudo',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Diagnóstico dos 6 Princípios',
      icon: '📊',
      color_theme: 'accent',
      description:
        'Avalie seu negócio ou projeto atual em cada um dos 6 princípios revolucionários, de 1 a 10, para identificar seus pontos mais fracos.',
      template_text:
        'Organização Primeiro: [1-10]. Apostas Progressivas: [1-10]. Caráter Sistemático: [1-10]. Vantagem Estrutural: [1-10]. Ideias Externas: [1-10]. Questionar Premissas: [1-10]. Meu ponto mais fraco: [QUAL]. Ação para melhorar: [DESCREVA].',
      checklist: [
        'Avaliei cada princípio de 1 a 10',
        'Identifiquei meu princípio mais fraco',
        'Defini uma ação concreta para fortalecê-lo',
        'Estabeleci prazo de 30 dias para revisão',
      ],
    },
    {
      title: 'Exercício 2 — Monte Seu Conselho Consultivo',
      icon: '🧠',
      color_theme: 'green',
      description:
        'Identifique e convide 3-5 pessoas inteligentes e desafiadoras para formar seu próprio conselho consultivo informal.',
      checklist: [
        'Listei 5 pessoas que admiro e que poderiam me desafiar',
        'Convidei pelo menos 2 para café ou conversa',
        'Marquei uma primeira reunião consultiva',
        'Defini uma agenda com perguntas estratégicas',
        'Implementei pelo menos 1 sugestão recebida',
      ],
    },
    {
      title: 'Exercício 3 — Sessão de "Insultante"',
      icon: '🔥',
      color_theme: 'orange',
      description:
        'Conduza uma sessão onde todas as premissas fundamentais do seu negócio são questionadas sem piedade.',
      checklist: [
        'Listei as 5 premissas fundamentais do meu negócio',
        'Para cada uma, perguntei: "E se isso não for mais verdade?"',
        'Identifiquei a premissa mais vulnerável',
        'Criei um plano B caso essa premissa se prove falsa',
      ],
    },
  ],
}

// ============================================================
// Book 5: How To Grow When Markets Don't
// ============================================================

const book5: BookData = {
  slug: 'como-crescer-quando-mercados-nao-crescem',
  metadata: {
    title: 'Como Crescer Quando os Mercados Não Crescem',
    original_title: "How To Grow When Markets Don't",
    author: 'Adrian Slywotzky & Richard Wise',
    year: 2003,
    category_slug: 'carreira',
    category_label: 'Carreira & Negócios',
    category_emoji: '💼',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Toda empresa enfrenta pressão constante para crescer receitas, lucros e vendas. Antigamente, a resposta era simples: <strong>inovação de produto</strong> — crie produtos novos e melhores. O problema é que tantas empresas fazem isso hoje que os consumidores estão cada vez menos dispostos a pagar mais por produtos apenas marginalmente superiores.</p>
<p>Adrian Slywotzky e Richard Wise propõem uma alternativa poderosa: <strong>inovação de demanda</strong> — identificar e atender às necessidades dos clientes que surgem naturalmente da venda de produtos e serviços existentes. Em vez de inventar novos produtos, aproveite os ativos ocultos da sua empresa para criar ofertas de valor agregado.</p>

<div class="highlight-box">
"Ao contrário da migração de valor, a inovação de demanda é sobre criar novo crescimento expandindo os limites do mercado. Ela foca em usar sua posição de produto como ponto de partida para fazer coisas novas para os clientes que resolvam seus maiores problemas."
</div>

<h2>Passo 1: Identifique Necessidades de Próxima Geração</h2>
<p>Em vez de considerar a venda do seu produto o <strong>fim</strong> do relacionamento com o cliente, considere-a o <strong>início</strong>. Descubra como seus clientes usam, mantêm, financiam, armazenam ou descartam seu produto, e insira-se nessas atividades econômicas. As atividades ao redor do uso do produto são geralmente <strong>10 a 20 vezes maiores</strong> em valor que o custo do produto em si.</p>

<h3>Os Três Níveis de Necessidade</h3>
<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>1ª ordem — Funcionalidade:</strong> Características e recursos do produto.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>2ª ordem — Eficiência operacional:</strong> Melhorar processos de compra e suporte, previsibilidade de custos.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>3ª ordem — Resolver problemas econômicos:</strong> Reduzir complexidade, riscos e custos do cliente; ajudar a crescer receitas.</div>
</div>

<p>A essência da inovação de demanda é encontrar oportunidades nas <strong>necessidades de 3ª ordem</strong>. Isso gera crescimento de três formas: mais vendas do produto central (relacionamento mais profundo), ofertas integradas de mercados adjacentes e transformação de melhorias na cadeia de valor do cliente em <strong>novas fontes de receita</strong>.</p>
<p>A Cardinal Health, por exemplo, partiu da distribuição farmacêutica para oferecer sistemas de informação, gestão, dispensação automática de medicamentos e logística completa — gerando mais de US$ 25 bilhões em valor de mercado adicional.</p>

<h2>Passo 2: Entenda Seus Ativos Ocultos</h2>
<p>Virtualmente todas as empresas estabelecidas desenvolveram um pool de <strong>ativos ocultos</strong> com potencial de bilhões de dólares — mas que são completamente ignorados nas tentativas de gerar crescimento. Esses ativos se agrupam em cinco categorias:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Intangíveis tradicionais:</strong> Propriedade intelectual, competências especializadas e marca.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Relacionamento com clientes:</strong> Alcance, interação profunda, insight sobre preferências e autoridade no mercado.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Imóveis estratégicos:</strong> Posição na cadeia de valor, participação de mercado dominante e controle de "portais" da indústria.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Redes:</strong> Relacionamentos com terceiros, base instalada e comunidade de usuários.</div>
</div>
<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Informação:</strong> Conhecimento técnico, software proprietário e dados gerados como subproduto das operações.</div>
</div>

<p>A chave é conectar seus ativos ocultos às necessidades de próxima geração dos seus clientes. Isso requer uma mudança mental: pare de olhar seu negócio através de uma <strong>"lente de produto"</strong> e comece a estudar seus clientes através de uma <strong>"lente econômica"</strong>.</p>

<div class="highlight-box">
"Pergunte a si mesmo: 'Que ativos além dos financeiros minha empresa possui que um empreendedor adoraria ter para criar novo valor para clientes?' Muito provavelmente, você possui vários ativos ocultos que qualquer empreendedor invejaria."
</div>

<h2>Passo 3: Conheça Seus Passivos Ocultos</h2>
<p>Muitas empresas não conseguem perseguir novas oportunidades por causa de seus próprios <strong>passivos ocultos</strong> — barreiras internas que sabotam iniciativas de crescimento. Os doze mais comuns incluem: mentalidade corporativa que protege o status quo, cultura que valoriza o passado, pressão do mercado de ações por resultados de curto prazo, líderes que dão apenas serviço de boca ao crescimento, burocracia organizacional, sistemas de orçamento inconsistentes, descompasso de habilidades, estrutura inflexível, incentivos errados, marca limitada, conflito de canal e alianças externas que viram prisões.</p>
<p>Um único passivo oculto é forte o suficiente para afundar a maioria das ideias novas. Quando dois ou três trabalham em conjunto, o poder contra a inovação pode ser <strong>insuperável</strong>.</p>

<h2>Passo 4: Desenvolva um Modelo de Negócios Robusto</h2>
<p>Para tornar iniciativas de crescimento a norma e não exceção, você precisa de um modelo de negócios que sistematize o processo. Oito diretrizes são essenciais: primeiro garanta que o negócio central está excelente, distribua a responsabilidade pelo crescimento amplamente, incube ideias com risco razoável, financie adequadamente com marcos claros, estruture diferentemente das unidades existentes, acelere com aquisições ou alianças, garanta apoio visível da alta gestão e organize a empresa conforme as necessidades do novo negócio.</p>

<div class="highlight-box">
"Se você é um dos muitos gerentes intermediários em empresas estabelecidas, a crise de crescimento é o maior problema de hoje. E é, no sentido mais verdadeiro, o SEU problema. Suas decisões nos próximos cinco anos determinarão o preço da ação da empresa daqui a dez anos."
</div>

<h2>Passo 5: Crie Seu Plano de Ação e Comece</h2>
<p>Enquanto desenvolve o plano de longo prazo (que leva cerca de três meses), faça <strong>sete movimentos de curto prazo</strong>:</p>
<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Ressegmente</strong> sua base de clientes para encontrar nichos com necessidades especiais.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Aprofunde</strong> relacionamentos com clientes desenvolvendo novos serviços.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Replique</strong> seus melhores relacionamentos com os demais clientes.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Use precificação por valor</strong> — decomponha o preço em componentes e cobre pelos add-ons.</div>
</div>
<div class="key-point">
  <div class="kp-num">5</div>
  <div class="kp-text"><strong>Ofereça sistemas</strong> em vez de produtos isolados.</div>
</div>
<div class="key-point">
  <div class="kp-num">6</div>
  <div class="kp-text"><strong>Envolva serviços</strong> ao redor do produto para aumentar valor percebido.</div>
</div>
<div class="key-point">
  <div class="kp-num">7</div>
  <div class="kp-text"><strong>Enfatize</strong> aspectos emocionais e de afinidade da sua marca.</div>
</div>

<h2>Conclusão</h2>
<p>O crescimento sustentável não vem de esperar que os mercados cresçam ou de lançar produtos marginalmente melhores. Vem de <strong>inovação de demanda</strong> — usar seus ativos ocultos para atender necessidades de próxima geração dos seus clientes. As atividades econômicas ao redor do seu produto são 10 a 20 vezes maiores que o produto em si. É aí que reside o verdadeiro tesouro de crescimento.</p>
<p>Se você começar o processo de criar um pouco de crescimento agora, provavelmente estará um ou dois passos à frente da maioria dos concorrentes. Mas não espere. <strong>A única alternativa real à estagnação é fomentar uma disciplina de novo crescimento. Aproveite essa oportunidade.</strong></p>`,
  mindmap_json: {
    center_label: 'COMO CRESCER QUANDO MERCADOS NÃO CRESCEM',
    center_sublabel: 'Inovação de Demanda em 5 Passos',
    branches: [
      {
        title: 'Necessidades de 3ª Ordem',
        icon: '🎯',
        items: [
          'Venda é o início, não o fim',
          'Atividades ao redor valem 10-20x',
          'Resolva problemas econômicos',
          'Ajude clientes a crescer receitas',
        ],
      },
      {
        title: 'Ativos Ocultos',
        icon: '💎',
        items: [
          'Intangíveis tradicionais e marca',
          'Relacionamentos com clientes',
          'Posição estratégica na indústria',
          'Informação e dados como subproduto',
          'Redes e comunidade de usuários',
        ],
      },
      {
        title: 'Passivos Ocultos',
        icon: '⚠️',
        items: [
          'Mentalidade corporativa do status quo',
          'Pressão por resultados de curto prazo',
          'Burocracia e incentivos errados',
          'Conflito de canal e alianças limitantes',
        ],
      },
      {
        title: 'Modelo de Negócios',
        icon: '🏗️',
        items: [
          'Negócio central excelente primeiro',
          'Distribua responsabilidade de crescimento',
          'Financie com marcos claros',
          'Apoio visível da alta gestão',
        ],
      },
      {
        title: '7 Movimentos Imediatos',
        icon: '🚀',
        items: [
          'Ressegmente a base de clientes',
          'Aprofunde relacionamentos',
          'Precificação por valor',
          'Ofereça sistemas, não produtos',
        ],
      },
    ],
  },
  insights_json: [
    {
      text: 'As atividades econômicas ao redor do uso de um produto são geralmente 10 a 20 vezes maiores em valor que o custo do produto em si. Aí reside a maior oportunidade de crescimento.',
      source_chapter: 'Passo 1 — Necessidades de Próxima Geração',
    },
    {
      text: 'Virtualmente todas as empresas estabelecidas possuem um pool de ativos ocultos com potencial de bilhões de dólares que são completamente ignorados quando tentam gerar crescimento.',
      source_chapter: 'Passo 2 — Ativos Ocultos',
    },
    {
      text: 'Pare de olhar seu negócio através de uma "lente de produto" e comece a estudar seus clientes através de uma "lente econômica" sintonizada com suas necessidades e requisitos.',
      source_chapter: 'Passo 2 — Mudança de Mentalidade',
    },
    {
      text: 'Um único passivo oculto é forte o suficiente para afundar a maioria das ideias de crescimento. Quando dois ou três trabalham juntos, o poder contra a inovação pode ser insuperável.',
      source_chapter: 'Passo 3 — Passivos Ocultos',
    },
    {
      text: 'Se você é gerente intermediário, a crise de crescimento é seu problema. Suas decisões nos próximos cinco anos determinarão o preço da ação da empresa daqui a dez anos.',
      source_chapter: 'Passo 4 — Modelo de Negócios',
    },
    {
      text: 'A Cardinal Health gerou mais de US$ 25 bilhões em valor de mercado adicional atendendo necessidades de 3ª ordem — indo além da distribuição para oferecer sistemas de gestão e logística completa.',
      source_chapter: 'Passo 1 — Exemplo Cardinal Health',
    },
  ],
  exercises_json: [
    {
      title: 'Exercício 1 — Mapeie Seus Ativos Ocultos',
      icon: '🔍',
      color_theme: 'accent',
      description:
        'Identifique os ativos ocultos da sua empresa ou carreira nas 5 categorias: intangíveis, relacionamentos, posição estratégica, redes e informação.',
      template_text:
        'Intangíveis: [LISTE]. Relacionamentos: [LISTE]. Posição Estratégica: [DESCREVA]. Redes: [LISTE]. Informação Valiosa: [LISTE]. O ativo mais subaproveitado: [QUAL].',
      checklist: [
        'Mapeei ativos em cada uma das 5 categorias',
        'Identifiquei o ativo mais subaproveitado',
        'Defini uma forma de monetizar ou alavancar esse ativo',
        'Criei um plano de 30 dias para testar a ideia',
      ],
    },
    {
      title: 'Exercício 2 — Mapa da Cadeia de Valor do Cliente',
      icon: '🗺️',
      color_theme: 'green',
      description:
        'Mapeie todas as atividades econômicas que cercam o uso do seu produto/serviço pelo cliente para encontrar oportunidades de 3ª ordem.',
      checklist: [
        'Listei como o cliente compra, usa, mantém e descarta meu produto',
        'Identifiquei as 3 maiores "dores" nessas atividades',
        'Para cada dor, criei uma ideia de serviço que resolva o problema',
        'Estimei o valor potencial de cada oportunidade',
        'Validei com pelo menos 2 clientes reais',
      ],
    },
    {
      title: 'Exercício 3 — Neutralize Seus Passivos Ocultos',
      icon: '🛡️',
      color_theme: 'orange',
      description:
        'Identifique os passivos ocultos que mais bloqueiam o crescimento do seu negócio e crie um plano para neutralizá-los.',
      checklist: [
        'Listei todos os passivos ocultos que reconheço',
        'Classifiquei por poder de bloqueio (1 a 10)',
        'Para os 3 mais fortes, defini uma ação de neutralização',
        'Identifiquei um aliado interno para cada batalha',
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
  console.log('  RESUMOX — Inserting 5 New Books (Batch 7)')
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
