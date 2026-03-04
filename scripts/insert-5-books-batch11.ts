#!/usr/bin/env tsx

/**
 * Insert 5 new books into ResumoX with all generated content
 * Books: The McKinsey Mind, The Strategy-Focused Organization,
 *        The Attention Economy, Seizing the White Space, Bill & Dave
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
// Book 1: A Mente McKinsey
// ============================================================

const book1: BookData = {
  slug: 'a-mente-mckinsey',
  metadata: {
    title: 'A Mente McKinsey',
    original_title: 'The McKinsey Mind',
    author: 'Ethan Rasiel e Paul Friga',
    year: 2001,
    category_slug: 'carreira',
    category_label: 'Carreira & Negócios',
    category_emoji: '💼',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>A McKinsey & Company, fundada em 1923, é a <strong>consultoria estratégica mais bem-sucedida do mundo</strong>, com mais de 7.000 profissionais assessorando milhares de clientes globalmente. O livro "A Mente McKinsey" revela o processo estruturado de resolução de problemas que cada consultor da firma utiliza para desenvolver — e frequentemente ajudar a implementar — soluções para os problemas estratégicos de seus clientes.</p>
<p>Este processo é <strong>altamente estruturado e sistemático</strong>, baseado em hipóteses testadas por fatos, mutuamente exclusivo e coletivamente exaustivo (MECE), e focado em evitar reinventar a roda. O resultado é uma metodologia poderosa para melhorar sua taxa de sucesso em decisões, estruturar seu pensamento sobre problemas de negócios e conquistar mais pessoas para sua visão.</p>

<div class="highlight-box">
"Decisões de negócios sólidas são feitas como um equilíbrio entre dados (os fatos que podem ser determinados) e intuição (instintos apurados pela experiência)."
</div>

<h2>Analisar — Enquadrando o Problema</h2>
<p>Enquadrar um problema significa <strong>aplicar uma estrutura a ele</strong>. Os consultores da McKinsey fazem isso desenvolvendo uma hipótese inicial baseada nos fatos disponíveis. Essa hipótese então se torna o mapa para a pesquisa e análise necessárias para desenvolver uma solução.</p>
<p>Existem várias formas de enquadrar um problema: como uma pergunta crítica para o sucesso do negócio, quebrando um problema grande em componentes menores, procurando os fatores-chave causadores do problema, ou usando uma árvore lógica que examina o problema progressivamente em detalhes.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Princípio MECE:</strong> Todo problema deve ser decomposto em componentes distintos que não se sobrepõem mas que, juntos, cobrem todos os aspectos relevantes — Mutuamente Exclusivos, Coletivamente Exaustivos.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Hipótese inicial:</strong> Ao sugerir uma hipótese logo no início, sua pesquisa se torna orientada a provar ou refutar essa hipótese, você evita becos sem saída e consegue chegar a conclusões mais rapidamente.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Árvores de questões:</strong> Cada hipótese sugere questões que devem ser abordadas. Uma árvore de questões decompõe cada uma delas em sub-questões de forma visual e progressiva, permitindo eliminar rapidamente as que levam a becos sem saída.</div>
</div>

<h2>Analisar — Planejando a Coleta de Dados</h2>
<p>Antes de mergulhar na coleta de dados para provar uma hipótese, <strong>planeje como esses dados serão obtidos</strong>. Assim, você e sua equipe começam com o pé direito. Isso também serve como uma verificação de realidade sobre como seu tempo será investido.</p>
<p>Para planejar uma iniciativa de coleta de dados eficiente: foque nos <strong>fatores-chave</strong> que mais impactam o problema; mantenha uma perspectiva ampla; trabalhe de forma mais inteligente, não mais dura; e permita flexibilidade para que uma hipótese melhor possa surgir durante o processo.</p>

<div class="highlight-box">
"Quando se trata de provar sua hipótese inicial, um design eficiente de análise vai ajudá-lo a começar com o pé direito. Você e sua equipe saberão o que precisam fazer, onde obter as informações e quando concluir."
</div>

<h2>Analisar — Coletando e Interpretando Dados</h2>
<p>A coleta de dados é essencial para provar ou refutar uma hipótese. A maioria dos tomadores de decisão economiza nesta etapa, preferindo confiar em sua intuição. Mas os consultores da McKinsey têm uma <strong>sede insaciável por fatos</strong> e classificam a coleta de dados como uma de suas habilidades mais importantes.</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Regra 80/20:</strong> Identifique os 20% dos dados responsáveis por 80% dos resultados e concentre-se neles, em vez de tentar analisar 100% da amostra.</div>
</div>
<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Pergunte "E daí?":</strong> Continue questionando o que é relevante versus meramente interessante. Fatos curiosos sem aplicação prática não agregam valor ao cliente.</div>
</div>

<p>Interpretar os dados significa separar o trigo do joio e montar tudo em uma narrativa coerente. Ao mover-se da história para a solução, lembre-se: <strong>ajuste a solução à empresa</strong>, veja pelos olhos de quem está na linha de frente e não tente incluir todos os fatos — apenas os mais relevantes.</p>

<h2>Apresentar — Estruturando Recomendações e Gerando Adesão</h2>
<p>A apresentação é onde "a borracha encontra a estrada". Os consultores da McKinsey usam um conjunto focado de habilidades para <strong>aumentar a probabilidade de que os tomadores de decisão comprem suas recomendações</strong>.</p>
<p>Para estruturar uma apresentação eficaz: divida tudo em passos fáceis de seguir; passe no "teste do elevador" — explique sua solução tão claramente que, em 30 segundos, o decisor saiba exatamente o que você está sugerindo; mantenha gráficos simples com apenas uma mensagem por slide.</p>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Pré-alinhe decisores:</strong> Caminhe pelos pontos principais com os tomadores de decisão antes da apresentação formal. Isso permite que pensem na proposta e que você antecipe objeções.</div>
</div>

<h2>Gerenciar — Equipe, Cliente e Você Mesmo</h2>
<p>A maioria dos projetos é realizada por equipes, e <strong>gerenciar a equipe é uma tarefa separada, distinta e importante</strong>. Os quatro elementos-chave são: selecionar as pessoas certas, ter boas comunicações internas, realizar atividades de construção de equipe e oferecer oportunidades de desenvolvimento pessoal.</p>
<p>Para ter sucesso com clientes: obtenha um número suficiente de novos clientes através de vendas indiretas; mantenha o cliente feliz engajando-o no processo; e posicione-se para trabalhos futuros completando projetos com rigor e fazendo o cliente ser o herói.</p>

<h3>Gerenciando a Si Mesmo</h3>
<p>Para progredir a longo prazo, encontre um bom mentor, concentre-se em acertos consistentes em vez de tentar home runs, trabalhe para fazer seu chefe parecer bem, e mantenha um <strong>equilíbrio saudável entre vida pessoal e profissional</strong>.</p>

<div class="highlight-box">
"Consultoria não é sobre análise; é sobre insights. Se você não consegue tirar um insight do que acabou de fazer, então foi perda de tempo. Processar números por processar, ou fazer gráficos por fazer, não ajuda a menos que traga à vida algum achado-chave."
</div>

<h2>Conclusão</h2>
<p>A metodologia McKinsey é muito mais do que uma ferramenta de consultoria — é um <strong>sistema de pensamento estruturado</strong> que qualquer profissional pode aplicar para tomar melhores decisões. O processo de enquadrar problemas com hipóteses, coletar dados com foco, interpretar resultados com a regra 80/20 e apresentar soluções de forma convincente pode transformar a maneira como você aborda desafios em qualquer área.</p>
<p>O tema central que conecta todos os elementos é a <strong>busca pela verdade</strong>. O objetivo da resolução de problemas é descobrir a verdade e comunicá-la. É assim que decisões corretas são tomadas e mudanças positivas são efetivadas.</p>

<div class="highlight-box">
"Os executivos de hoje têm acesso a muito mais informação do que poderiam usar. Eles só conseguem gerenciar essa enxurrada de dados filtrando tudo exceto os fatos mais relevantes. O framework estruturado apropriado permitirá que você faça isso com muito mais eficiência."
</div>`,
  mindmap_json: {
    center_label: 'A MENTE MCKINSEY',
    center_sublabel: 'Resolução Estruturada de Problemas',
    branches: [
      { title: 'Enquadrar o Problema', icon: '🔍', items: ['Hipótese inicial como mapa', 'Princípio MECE sempre', 'Árvores de questões visuais', 'Teste rápido de validade'] },
      { title: 'Coletar Dados', icon: '📊', items: ['Fatos são seus amigos', 'Entrevistas são essenciais', 'Foque nos fatores-chave', 'Estime quando necessário'] },
      { title: 'Interpretar Resultados', icon: '💡', items: ['Regra 80/20 nos dados', 'Pergunte "E daí?"', 'Ajuste solução à empresa', 'Equilibre dados e intuição'] },
      { title: 'Apresentar Soluções', icon: '🎯', items: ['Teste do elevador 30s', 'Um ponto por slide', 'Pré-alinhe decisores', 'Evite surpresas na reunião'] },
      { title: 'Gerenciar Pessoas', icon: '🤝', items: ['Selecione os melhores', 'Comunique em excesso', 'Engaje o cliente no processo', 'Faça o cliente ser o herói'] },
      { title: 'Gestão Pessoal', icon: '⚖️', items: ['Encontre um mentor', 'Acertos consistentes', 'Equilibre vida e trabalho', 'Construa rede de apoio'] },
    ],
  },
  insights_json: [
    { text: 'Decisões de negócios sólidas são feitas como um equilíbrio entre dados — os fatos que podem ser determinados — e intuição — instintos apurados pela experiência.', source_chapter: 'Cap. 1 — Enquadrando o Problema' },
    { text: 'A técnica McKinsey de resolução de problemas orientada por hipóteses — resolver o problema na primeira reunião — provou ser uma excelente habilidade de tomada de decisão além dos limites da firma.', source_chapter: 'Cap. 1 — Enquadrando o Problema' },
    { text: 'Consultoria não é sobre análise; é sobre insights. Se você não consegue tirar um insight do que acabou de fazer, então é perda de tempo.', source_chapter: 'Cap. 4 — Interpretando Resultados' },
    { text: 'Os clientes não pagam, ao final do dia, por documentos sofisticados e apresentações bonitas. Eles pagam por conselhos que adicionem valor aos seus negócios.', source_chapter: 'Cap. 4 — Interpretando Resultados' },
    { text: 'Uma apresentação é apenas uma ferramenta; não é um fim em si mesma. Uma apresentação brilhante é inútil se a organização não aceitar e agir conforme suas recomendações.', source_chapter: 'Cap. 5 — Apresentação e Adesão' },
    { text: 'Há dois tipos de pilotos: os que já pousaram com o trem de pouso recolhido e os que vão pousar. O mesmo vale para decisões — mais cedo ou mais tarde, todo executivo tem que decidir com base no instinto.', source_chapter: 'Cap. 2 — Planejando a Análise' },
    { text: 'O tema central que conecta todos os elementos do modelo McKinsey é a verdade. O objetivo da resolução de problemas é descobrir a verdade e comunicá-la.', source_chapter: 'Cap. 8 — Gerenciando a Si Mesmo' },
  ],
  exercises_json: [
    { title: 'Exercício 1 — Enquadre Seu Problema Atual', icon: '🔍', color_theme: 'accent', description: 'Escolha o maior desafio profissional que você enfrenta agora e aplique a estrutura MECE para decompô-lo em partes claras e acionáveis.', template_text: 'Meu problema principal é: [PROBLEMA]. Decompondo em partes MECE: 1) [COMPONENTE A], 2) [COMPONENTE B], 3) [COMPONENTE C]. Minha hipótese inicial é: [HIPÓTESE].', checklist: ['Identifiquei meu maior desafio profissional atual', 'Decomponho o problema em 3-5 componentes MECE', 'Formulei uma hipótese inicial para testar', 'Identifiquei os 2-3 dados mais importantes para coletar'] },
    { title: 'Exercício 2 — Pratique o Teste do Elevador', icon: '🗣️', color_theme: 'green', description: 'Pegue uma ideia ou proposta que você precisa vender e pratique explicá-la em 30 segundos, de forma que qualquer pessoa entenda o essencial.', checklist: ['Escolhi uma proposta ou ideia para sintetizar', 'Escrevi uma versão de 30 segundos com conclusão na frente', 'Pratiquei em voz alta pelo menos 3 vezes', 'Testei com alguém e pedi feedback honesto'] },
    { title: 'Exercício 3 — Auditoria de Decisões por Intuição', icon: '⚡', color_theme: 'orange', description: 'Identifique uma decisão importante que você tomou recentemente baseada mais em intuição do que em dados. Avalie se dados teriam mudado o resultado.', checklist: ['Listei 3 decisões recentes tomadas por intuição', 'Para a mais importante, identifiquei que dados me faltaram', 'Avaliei se a decisão teria sido diferente com os dados', 'Defini um processo para equilibrar intuição e fatos no futuro'] },
  ],
}

// ============================================================
// Book 2: A Organização Focada na Estratégia
// ============================================================

const book2: BookData = {
  slug: 'a-organizacao-focada-na-estrategia',
  metadata: {
    title: 'A Organização Focada na Estratégia',
    original_title: 'The Strategy-Focused Organization',
    author: 'Robert S. Kaplan e David P. Norton',
    year: 2001,
    category_slug: 'lideranca',
    category_label: 'Liderança',
    category_emoji: '👑',
    reading_time_min: 13,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#0f3460',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Organizações altamente produtivas implementam estratégias excepcionalmente bem. Na verdade, elas tipicamente <strong>dão mais ênfase à execução do que à formulação da estratégia</strong>. E uma vez que sua estratégia foi articulada, os melhores performers concentram-se em focar e alinhar todos os seus recursos — humanos, capital, tecnologia e liderança — para colocar essa estratégia em ação.</p>
<p>A ferramenta central para isso é o <strong>Balanced Scorecard</strong> — uma abordagem que mede e gerencia a estratégia usando indicadores financeiros e não-financeiros. Kaplan e Norton identificaram cinco princípios fundamentais que organizações de alto desempenho aplicam consistentemente.</p>

<div class="highlight-box">
"A capacidade de executar a estratégia era mais importante do que a qualidade da estratégia em si. Investidores sofisticados perceberam que a execução é mais importante do que uma boa visão."
</div>

<h2>Princípio 1 — Traduza a Estratégia em Termos Operacionais</h2>
<p>A melhor estratégia do mundo não pode ser executada se não puder ser <strong>compreendida pelas pessoas envolvidas</strong>. E qualquer estratégia que não possa ser adequadamente descrita não pode ser compreendida. O primeiro passo é construir um framework confiável para descrever a estratégia.</p>

<h3>Mapas Estratégicos</h3>
<p>Mapas estratégicos delineiam todas as relações de <strong>causa e efeito</strong> entre o que a estratégia da organização é e o que todos fazem no dia a dia. Eles descrevem como ativos tangíveis e intangíveis são mobilizados, como são combinados para criar propostas de valor ao cliente e como os resultados financeiros desejados serão alcançados.</p>

<h3>Balanced Scorecards</h3>
<p>Os Balanced Scorecards adicionam <strong>medidas de desempenho</strong> aos mapas estratégicos, avaliando quatro perspectivas fundamentais:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Perspectiva Financeira:</strong> "Se tivermos sucesso, como pareceremos para nossos acionistas?"</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Perspectiva do Cliente:</strong> "Para alcançar nossa visão, como devemos parecer para nossos clientes?"</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Perspectiva Interna:</strong> "Para satisfazer clientes, em quais processos devemos ser excelentes?"</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Perspectiva de Aprendizado:</strong> "Para alcançar nossa visão, como devemos aprender e melhorar?"</div>
</div>

<h2>Princípio 2 — Crie Alinhamento entre a Organização e a Estratégia</h2>
<p>Organizações existem para criar <strong>sinergia</strong> — benefícios adicionais que não poderiam ser alcançados por unidades de negócio trabalhando individualmente. Os Balanced Scorecards fazem um excelente trabalho ao esclarecer os valores e crenças que compõem a cultura corporativa e ao diferenciar ações direcionadas corporativamente daquelas deixadas para cada unidade decidir.</p>
<p>Para unidades de serviços compartilhados, dois modelos funcionam bem: o <strong>Modelo de Parceiro Estratégico</strong>, onde cada unidade desenvolve seu próprio scorecard refletindo suas prioridades, e o <strong>Modelo de Negócio-dentro-do-Negócio</strong>, onde a unidade compartilhada se vê como um negócio virtual com as outras unidades como seus clientes.</p>

<h2>Princípio 3 — Envolva Todos na Estratégia</h2>
<p>Cada funcionário de uma organização focada na estratégia <strong>entende a estratégia e busca formas melhores</strong> de conduzir seu trabalho diário para contribuir com o sucesso. Até que os funcionários entendam como suas ações diárias influenciam o sucesso ou fracasso da estratégia, ela será apenas um exercício teórico.</p>

<div class="highlight-box">
"Indivíduos distantes da sede corporativa são os que encontram formas melhores de fazer negócios que contribuirão para alcançar os objetivos da organização."
</div>

<p>As organizações alcançam isso através de <strong>consciência estratégica</strong> em todos os níveis, alinhamento de objetivos pessoais e de equipe, e esquemas de compensação vinculados aos objetivos estratégicos do Balanced Scorecard.</p>

<h2>Princípio 4 — Faça da Estratégia um Processo Contínuo</h2>
<p>Em uma organização focada na estratégia, <strong>loops de feedback</strong> existem para que a estratégia seja atualizada e gerenciada continuamente. A estratégia se torna parte integral do negócio, não algo feito uma vez por ano.</p>
<p>A chave está em desenvolver dois tipos de orçamento: um <strong>orçamento operacional</strong> focado na eficiência de curto prazo e um <strong>orçamento estratégico</strong> focado no financiamento de longo prazo para iniciativas que não gerarão receita imediata. Além disso, a organização deve testar suposições analiticamente, estudar o impacto de descontinuidades externas e apoiar estratégias emergentes.</p>

<h2>Princípio 5 — Forneça Liderança Eficaz</h2>
<p>Sem o envolvimento pessoal ativo da equipe executiva, <strong>nenhuma estratégia terá sucesso</strong>. Líderes eficazes começam criando senso de urgência, formam uma coalizão orientadora e desenvolvem uma visão compartilhada. Em seguida, focam em questões de governança — definindo novos valores culturais e demonstrando-os de forma impactante.</p>

<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Sistema de Gestão Estratégica:</strong> Alinhe compensação executiva ao Balanced Scorecard, vincule planejamento e orçamento, e crie um sistema interativo que encoraje diálogo e aprendizado em toda a organização.</div>
</div>

<h2>Conclusão</h2>
<p>O Balanced Scorecard evoluiu de um simples framework de medição para se tornar o <strong>sistema operacional de um novo processo de gestão estratégica</strong>. Quando implementado corretamente, ele fornece uma base sólida para construir e manter um sistema de gestão de classe mundial. A chave não está em aspectos estruturais ou de design, mas na liderança da equipe executiva — criando o clima para mudança, a visão do que ela pode alcançar e o processo de governança que promove comunicação e aprendizado sobre a estratégia.</p>

<div class="highlight-box">
"O Balanced Scorecard fornece um framework para descrever e comunicar a estratégia de forma consistente e esclarecedora. Antes de seu desenvolvimento, os gestores não tinham um framework geralmente aceito para descrever a estratégia. O simples ato de descrevê-la através de mapas e scorecards é um avanço enorme."
</div>`,
  mindmap_json: {
    center_label: 'A ORGANIZAÇÃO FOCADA NA ESTRATÉGIA',
    center_sublabel: '5 Princípios do Balanced Scorecard',
    branches: [
      { title: 'Traduza em Operações', icon: '🗺️', items: ['Mapas estratégicos visuais', 'Relações de causa e efeito', 'Quatro perspectivas integradas', 'Framework consistente'] },
      { title: 'Crie Alinhamento', icon: '🔗', items: ['Sinergia entre unidades', 'Scorecard por unidade', 'Serviços compartilhados', 'Cultura corporativa comum'] },
      { title: 'Envolva Todos', icon: '👥', items: ['Consciência estratégica total', 'Objetivos pessoais alinhados', 'Compensação vinculada', 'Feedback de todos os níveis'] },
      { title: 'Processo Contínuo', icon: '🔄', items: ['Dois orçamentos separados', 'Teste de suposições', 'Estratégias emergentes', 'Loops de aprendizado'] },
      { title: 'Liderança Eficaz', icon: '👑', items: ['Senso de urgência', 'Coalizão orientadora', 'Visão compartilhada', 'Governança de transição'] },
    ],
  },
  insights_json: [
    { text: 'A capacidade de executar a estratégia era mais importante do que a qualidade da estratégia em si. Investidores sofisticados perceberam que a execução é mais importante do que uma boa visão.', source_chapter: 'Parte 1 — Introdução' },
    { text: 'O Balanced Scorecard fornece um framework para descrever e comunicar a estratégia de forma consistente. O simples ato de descrevê-la é um avanço enorme.', source_chapter: 'Cap. 1 — Traduza a Estratégia' },
    { text: 'Indivíduos distantes da sede corporativa são os que encontram formas melhores de fazer negócios que contribuirão para alcançar os objetivos da organização.', source_chapter: 'Cap. 3 — Envolva Todos' },
    { text: 'Gestão é um conjunto de processos que mantém um sistema complexo funcionando. Liderança é um conjunto de processos que cria organizações ou as adapta a circunstâncias radicalmente diferentes.', source_chapter: 'Cap. 5 — Liderança Eficaz' },
    { text: 'Para bons executivos, não existe estado estável. Ao incorporar a nova estratégia e cultura em um sistema de gestão, empresas podem criar uma barreira ao progresso futuro.', source_chapter: 'Cap. 5 — Liderança Eficaz' },
    { text: 'O maior problema com a comunicação é a ilusão de que ela foi realizada.', source_chapter: 'Cap. 5 — Liderança Eficaz' },
  ],
  exercises_json: [
    { title: 'Exercício 1 — Meu Balanced Scorecard Pessoal', icon: '📊', color_theme: 'accent', description: 'Crie um mini Balanced Scorecard para sua vida profissional, definindo objetivos e métricas nas quatro perspectivas: financeira, clientes, processos internos e aprendizado.', template_text: 'Financeiro: [META]. Cliente: [META]. Processos: [META]. Aprendizado: [META].', checklist: ['Defini 1 objetivo para cada uma das 4 perspectivas', 'Criei 1 métrica mensurável para cada objetivo', 'Identifiquei ações concretas para cada métrica', 'Programei uma revisão semanal de 15 minutos'] },
    { title: 'Exercício 2 — Comunique Sua Estratégia', icon: '📢', color_theme: 'green', description: 'Escolha um objetivo importante e pratique comunicá-lo a diferentes públicos de forma que cada um entenda como pode contribuir.', checklist: ['Escolhi um objetivo estratégico importante para mim', 'Escrevi 3 versões: para chefe, para equipe, para família', 'Compartilhei com pelo menos uma pessoa e pedi feedback', 'Identifiquei como cada pessoa pode contribuir'] },
    { title: 'Exercício 3 — Auditoria de Alinhamento', icon: '🔥', color_theme: 'orange', description: 'Avalie honestamente o alinhamento entre suas atividades diárias e seus objetivos estratégicos. Identifique onde está desperdiçando tempo.', checklist: ['Registrei como gastei meu tempo nos últimos 3 dias', 'Classifiquei cada atividade como estratégica ou operacional', 'Identifiquei 2 atividades que posso eliminar ou delegar', 'Realoquei pelo menos 1 hora/semana para o estratégico'] },
  ],
}

// ============================================================
// Book 3: A Economia da Atenção
// ============================================================

const book3: BookData = {
  slug: 'a-economia-da-atencao',
  metadata: {
    title: 'A Economia da Atenção',
    original_title: 'The Attention Economy',
    author: 'Thomas Davenport e John Beck',
    year: 2001,
    category_slug: 'produtividade',
    category_label: 'Produtividade',
    category_emoji: '⚡',
    reading_time_min: 13,
    cover_gradient_from: '#2e1a0a',
    cover_gradient_to: '#4a2e1a',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Na economia atual, o recurso de negócios mais escasso não são ideias, talento ou mesmo capital. Todos esses estão disponíveis em oferta abundante. O recurso mais raro de todos é a <strong>atenção</strong>. Existe tanta informação competindo para ser notada que o fator limitante não é a oferta, mas a demanda — a capacidade das pessoas de absorver e prestar atenção a todas as informações que recebem constantemente.</p>
<p>A gestão da atenção vai desempenhar um papel cada vez maior no sucesso dos negócios. <strong>Atenção é a nova moeda dos negócios.</strong> Se você quer ter sucesso na economia emergente, precisa ser bom em atrair, gerenciar e aproveitar a atenção.</p>

<div class="highlight-box">
"Compreender e gerenciar a atenção é agora o determinante mais importante do sucesso nos negócios."
</div>

<h2>Os Dois Desafios Centrais da Atenção</h2>
<p>Problemas e desafios para profissionais existem em ambos os lados da equação da atenção: decidir como alocar sua <strong>própria atenção</strong> diante de um número esmagador de opções, e obter e reter a <strong>atenção dos outros</strong> — funcionários, clientes e acionistas que estão sobrecarregados.</p>

<h3>Os Seis Tipos de Atenção</h3>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Cativa vs. Voluntária:</strong> Atenção cativa é imposta pelo ambiente; voluntária é quando você escolhe prestar atenção porque quer.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Aversiva vs. Atrativa:</strong> Prestar atenção a coisas que quer evitar (como perigo) versus coisas que geram experiências positivas.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Secundária vs. Primária:</strong> Atenção de fundo a vários assuntos enquanto faz algo versus escolher conscientemente focar em algo específico.</div>
</div>

<p>As atividades mais viciantes combinam todos os seis tipos de atenção simultaneamente. Gestão de atenção <strong>não é gestão de tempo</strong> — foca em gerar insights que aumentem a eficácia, não apenas a eficiência.</p>

<h2>As Quatro Dimensões da Gestão da Atenção</h2>

<h3>1. Medir e Alocar</h3>
<p>Para gerenciar atenção, primeiro você precisa <strong>medi-la</strong>. Métodos incluem diários de tempo, recall de 24 horas e o "AttentionScape" — um gráfico que mapeia como os seis tipos de atenção estão sendo distribuídos.</p>

<h3>2. Alavancar o Psicológico</h3>
<p>A sabedoria predominante da era da informação tem sido inundar pessoas com dados. Isso agora é <strong>contraproducente</strong> — pessoas ficam sobrecarregadas e absorvem menos. Empresas devem estruturar informações de acordo com a hierarquia de necessidades de Maslow e os processos mentais reais dos clientes.</p>

<h3>3. Dominar Novas Tecnologias</h3>
<p>Três categorias: tecnologias que <strong>capturam atenção</strong> (apresentações, ferramentas visuais), que <strong>estruturam atenção</strong> (simulações, módulos de aprendizado) e que <strong>protegem atenção</strong> (filtros, agentes inteligentes, assistentes pessoais).</p>

<h3>4. Adaptar Lições de Outros</h3>
<p>As indústrias da atenção — publicidade, cinema, TV e editorial — já enfrentaram quase todos os problemas que gestores de atenção enfrentarão. Hollywood excele em <strong>entender audiências</strong>; TV usa narrativas curtas e personagens; editores focam em nichos; publicitários usam repetição e apelo emocional.</p>

<div class="highlight-box">
"Empresas que terão sucesso no futuro serão aquelas especialistas não em gestão de tempo, mas em gestão de atenção."
</div>

<h2>As Cinco Aplicações-Chave</h2>

<h3>e-Commerce</h3>
<p>Os sites mais "pegajosos" combinam quatro táticas: <strong>relevância</strong> (conteúdo útil e atualizado), <strong>engajamento</strong> (interatividade), <strong>conveniência</strong> (navegação intuitiva) e <strong>comunidade</strong> (senso de pertencimento).</p>

<h3>Liderança</h3>
<p>Líderes eficazes gerenciam quatro dimensões: focam sua <strong>própria atenção</strong> no que importa, atraem a atenção certa dos outros, direcionam a atenção da organização para o que conta, e gerenciam a atenção de clientes e mercados.</p>

<h3>Estratégia</h3>
<p>Estratégia, na perspectiva da atenção, começa quando a gestão muda sua atenção do business as usual para considerar o futuro. Estratégia é essencialmente sobre <strong>escolhas</strong> — decidir no que o negócio focará sua atenção.</p>

<h3>Estrutura Organizacional</h3>
<p>A estrutura da organização foca e direciona a atenção. Quando uma empresa muda sua estrutura, isso comunica quais questões são mais importantes. Duas regras: se duas empresas não atraem atenção, <strong>funda-as</strong>; se há atenção demais, faça um spin-off.</p>

<h3>Gestão do Conhecimento</h3>
<p>Trabalhadores do conhecimento processam informação para viver. A chave é combinar a atenção disponível com informação significativa: use <strong>triagem inteligente</strong>, destaque informações importantes, limite o volume, proteja contra distrações e eduque os funcionários.</p>

<h2>Conclusão</h2>
<p>Todo negócio é um motor alimentado pela atenção. Na era industrial, força física movia a economia. Na era da informação, conhecimento era poder. Agora, com fluxos de informação desnecessária entupindo cérebros e canais de comunicação, <strong>a atenção é o recurso raro que verdadeiramente move uma empresa</strong>. Reconhecer que a atenção é valiosa, que onde ela é direcionada importa, e que pode ser gerenciada como outros recursos preciosos é essencial na economia de hoje.</p>

<div class="highlight-box">
"O maior prêmio por ser capaz de capturar atenção será a liberdade de evitá-la. Os ricos poderão viver em zonas de conservação de atenção."
</div>`,
  mindmap_json: {
    center_label: 'A ECONOMIA DA ATENÇÃO',
    center_sublabel: 'A Nova Moeda dos Negócios',
    branches: [
      { title: 'Dois Desafios', icon: '⚔️', items: ['Alocar sua própria atenção', 'Capturar atenção dos outros', 'Seis tipos de atenção', 'Atenção ≠ Gestão de tempo'] },
      { title: 'Medir e Alavancar', icon: '📏', items: ['Diários de atenção', 'AttentionScape visual', 'Limites psicológicos reais', 'Hierarquia de Maslow'] },
      { title: 'Tecnologias', icon: '🖥️', items: ['Capturar atenção', 'Estruturar atenção', 'Proteger atenção', 'Filtros inteligentes'] },
      { title: 'Lições das Mídias', icon: '🎬', items: ['Hollywood: entenda audiência', 'TV: narrativas curtas', 'Editores: nichos específicos', 'Publicidade: emoção e repetição'] },
      { title: 'Cinco Aplicações', icon: '🎯', items: ['e-Commerce e stickiness', 'Liderança e foco', 'Estratégia como escolha', 'Estrutura e conhecimento'] },
    ],
  },
  insights_json: [
    { text: 'Compreender e gerenciar a atenção é agora o determinante mais importante do sucesso nos negócios.', source_chapter: 'Cap. 1 — Os Dois Desafios Centrais' },
    { text: 'Empresas que terão sucesso no futuro serão aquelas especialistas não em gestão de tempo, mas em gestão de atenção.', source_chapter: 'Cap. 1 — Os Dois Desafios Centrais' },
    { text: 'A capacidade de priorizar informação, focar e refletir sobre ela, e excluir dados irrelevantes será pelo menos tão importante quanto adquiri-la.', source_chapter: 'Cap. 2 — Quatro Dimensões' },
    { text: 'Todo negócio é um motor alimentado pela atenção. No passado, força física movia a economia. Na era da informação, conhecimento era poder. Agora, a atenção é o recurso raro que move uma empresa.', source_chapter: 'Cap. 1 — Os Dois Desafios Centrais' },
    { text: 'Estratégia é em grande parte sobre atenção. Estratégias bem-sucedidas usam princípios de comunicação eficaz para focar a atenção na estratégia desenvolvida.', source_chapter: 'Cap. 3 — Estratégia de Negócios' },
    { text: 'O maior prêmio por ser capaz de capturar atenção será a liberdade de evitá-la. Os ricos poderão viver em zonas de conservação de atenção.', source_chapter: 'Cap. 2 — O Futuro da Economia da Atenção' },
    { text: 'Empresas não se orgulharão de quão extensos são seus portais de conhecimento, mas sim de quão direcionado é o ambiente de informação que conseguem criar.', source_chapter: 'Cap. 3 — Gestão do Conhecimento' },
  ],
  exercises_json: [
    { title: 'Exercício 1 — Diário de Atenção', icon: '📝', color_theme: 'accent', description: 'Durante 3 dias, registre onde sua atenção vai a cada hora. Identifique padrões de desperdício e descubra quanto tempo você realmente dedica ao que importa.', checklist: ['Registrei minha atenção a cada hora por 1 dia completo', 'Classifiquei cada item como estratégico, operacional ou distração', 'Identifiquei meus 3 maiores ladrões de atenção', 'Defini 1 ação concreta para eliminar o maior deles'] },
    { title: 'Exercício 2 — Proteção de Atenção', icon: '🛡️', color_theme: 'green', description: 'Implemente pelo menos 2 barreiras contra distrações esta semana: silencie notificações, bloqueie sites, ou crie janelas de foco profundo.', checklist: ['Identifiquei minhas 2 maiores fontes de distração digital', 'Implementei 1 barreira tecnológica (bloqueador, modo silencioso)', 'Criei pelo menos 1 janela de 90 minutos de foco profundo', 'Avaliei o impacto na qualidade do meu trabalho'] },
    { title: 'Exercício 3 — Capture a Atenção de Alguém', icon: '🎯', color_theme: 'orange', description: 'Aplique técnicas das indústrias da atenção para tornar sua próxima apresentação, e-mail ou proposta irresistivelmente engajante.', checklist: ['Escolhi uma comunicação importante para melhorar', 'Apliquei pelo menos 2 técnicas: história, emoção, brevidade ou personalização', 'Testei com alguém antes de enviar', 'Medi o resultado comparado com comunicações anteriores'] },
  ],
}

// ============================================================
// Book 4: Conquistando o Espaço em Branco
// ============================================================

const book4: BookData = {
  slug: 'conquistando-o-espaco-em-branco',
  metadata: {
    title: 'Conquistando o Espaço em Branco',
    original_title: 'Seizing the White Space',
    author: 'Mark W. Johnson',
    year: 2010,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Muitas empresas lutam para ter sucesso quando entram em atividades de <strong>"espaço em branco"</strong> — novas operações comerciais que estão notavelmente fora de seu negócio principal e competências atuais. Elas reconhecem que existe uma oportunidade comercial viável, mas quase invariavelmente tentam atender novos clientes usando seus modelos de negócio existentes. Na maioria das vezes, esses esforços de expansão falham.</p>
<p>Para conquistar uma oportunidade de espaço em branco e crescer, <strong>comece desenvolvendo um modelo de negócio que funcione para esse novo espaço</strong>. Não espere que seu modelo antigo se transfira. Especificamente, você precisa retrabalhar os quatro blocos fundamentais de qualquer modelo de negócio viável.</p>

<div class="highlight-box">
"Uma pesquisa da IBM de 2008 com mais de 1.100 CEOs revelou que quase todos relataram a necessidade de adaptar seus modelos de negócio, com mais de dois terços dizendo que mudanças extensivas eram necessárias. Mesmo assim, menos de 10% dos investimentos em inovação são focados em desenvolver novos modelos de negócio."
</div>

<h2>O Framework de Quatro Caixas</h2>
<p>Um modelo de negócio de sucesso tem <strong>quatro elementos inter-relacionados</strong>:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Proposta de Valor ao Cliente:</strong> Articula precisamente o que você aspira fazer pelos clientes — qual é o "trabalho a ser feito" e como sua oferta resolve o problema melhor que as alternativas existentes.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Fórmula de Lucro:</strong> Detalha como a empresa criará valor — modelo de receita, estrutura de custos, margem unitária-alvo e velocidade de recursos.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Recursos-Chave:</strong> A combinação única de pessoas, tecnologia, equipamentos, financiamento e propriedade intelectual necessária para entregar a proposta de valor.</div>
</div>
<div class="key-point">
  <div class="kp-num">4</div>
  <div class="kp-text"><strong>Processos-Chave:</strong> As tarefas recorrentes que devem ser realizadas consistentemente para tornar a entrega repetível e escalável.</div>
</div>

<h2>Três Instâncias para Novos Modelos de Negócio</h2>

<h3>O Espaço em Branco Dentro</h3>
<p>Em todo mercado, a base de competição evolui com o tempo: de <strong>performance</strong> para <strong>confiabilidade</strong>, depois <strong>conveniência</strong> e finalmente <strong>custo</strong>. Sempre que essa base muda, o "trabalho a ser feito" do cliente muda fundamentalmente, e um novo modelo de negócio é necessário.</p>
<p>O caso da Hilti ilustra isso perfeitamente: a fabricante de ferramentas elétricas percebeu que construtores tratavam ferramentas como descartáveis. Em vez de vender ferramentas mais baratas, Hilti criou um <strong>programa de leasing</strong> — "Você cuida da construção e nós garantimos que terá as ferramentas mais novas, seguras e bem mantidas." Seu modelo de negócio mudou completamente.</p>

<h3>O Espaço em Branco Além</h3>
<p>Conquistar o espaço em branco além significa <strong>criar novos mercados</strong> e encontrar formas de atender não-consumidores — pessoas excluídas de mercados porque são caros demais, complexos demais ou inacessíveis.</p>
<p>O exemplo da MinuteClinic mostra como a democratização do conhecimento médico permitiu criar quiosques em farmácias onde enfermeiras diagnosticam doenças simples usando <strong>procedimentos baseados em regras</strong>, em 15 minutos e sem agendamento.</p>

<div class="highlight-box">
"O cliente raramente compra o que a empresa acha que está vendendo." — Peter Drucker
</div>

<h3>Espaço em Branco Completamente Novo</h3>
<p>Transformações massivas do mercado — como o 11 de setembro, a comercialização da internet ou a crise financeira de 2008 — criam <strong>oportunidades completamente novas</strong>. Essas transformações se classificam em: mudanças de demanda de mercado, novas tecnologias disruptivas e mudanças em políticas governamentais.</p>

<h2>Transformando em Processo Repetível</h2>
<p>Inovação de modelo de negócio não precisa depender de sorte. Ela pode ser <strong>estruturada e sistemática</strong> em três passos:</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Identifique o trabalho real:</strong> Não pergunte "Do que você precisa?" — pergunte "Que trabalho você está tentando realizar?" Observe como clientes usam produtos; as necessidades não-articuladas são as mais valiosas.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Construa o blueprint:</strong> Trabalhe de trás para frente — comece pelo lucro agregado necessário em 3-5 anos, calcule a receita, custos, margem e velocidade de recursos.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Implemente iterativamente:</strong> Passe pelas três fases — Incubação (valide suposições), Aceleração (escale processos) e Transição (integre ou mantenha separado).</div>
</div>

<h2>O Caso Amazon</h2>
<p>A Amazon é talvez o melhor exemplo de empresa que conquista espaços em branco consistentemente. De livraria online para vendedora de bens de consumo, depois para plataforma de terceiros, depois serviços web, depois Kindle. O que distingue a Amazon é que <strong>sempre que identifica uma nova oportunidade, concebe e constrói um novo modelo de negócio</strong> para explorá-la.</p>

<h2>Conclusão</h2>
<p>Conceber um modelo de negócio verdadeiramente inovador não precisa ser puramente uma questão de imaginação ou sorte. Pode ser um <strong>processo ordenado</strong> que usa estrutura para desbloquear criatividade. O framework de quatro caixas é a planta baixa sobre a qual um processo de inovação gerenciável pode ser construído — uma estrutura capaz de desbloquear sua criatividade na busca por crescimento transformacional e renovação.</p>

<div class="highlight-box">
"Se você quer continuamente revitalizar o serviço que oferece aos seus clientes, você não pode parar no que é bom. Você tem que perguntar o que seus clientes precisam e querem, e então, por mais difícil que seja, é melhor ficar bom nessas coisas." — Jeff Bezos
</div>`,
  mindmap_json: {
    center_label: 'CONQUISTANDO O ESPAÇO EM BRANCO',
    center_sublabel: 'Inovação de Modelo de Negócio',
    branches: [
      { title: 'Framework 4 Caixas', icon: '📦', items: ['Proposta de valor ao cliente', 'Fórmula de lucro viável', 'Recursos-chave únicos', 'Processos-chave repetíveis'] },
      { title: 'Espaço em Branco Dentro', icon: '🏠', items: ['Base de competição muda', 'De performance a custo', 'Caso Hilti: leasing de ferramentas', 'Observe o "trabalho real"'] },
      { title: 'Espaço em Branco Além', icon: '🌍', items: ['Crie novos mercados', 'Atenda não-consumidores', 'Democratize conhecimento', 'Caso MinuteClinic'] },
      { title: 'Espaço Completamente Novo', icon: '💥', items: ['Mudanças massivas de mercado', 'Novas tecnologias disruptivas', 'Mudanças governamentais', 'Transformações criam oportunidade'] },
      { title: 'Processo Repetível', icon: '🔄', items: ['Identifique o trabalho real', 'Construa blueprint de lucro', 'Incubação → Aceleração', 'Itere e aprenda sempre'], full_width: true },
    ],
  },
  insights_json: [
    { text: 'O cliente raramente compra o que a empresa acha que está vendendo.', source_chapter: 'Cap. 1 — O Framework de Quatro Caixas' },
    { text: 'Não pergunte "Do que você precisa?" — pergunte "Que trabalho você está tentando realizar?" As necessidades não-articuladas são as mais valiosas.', source_chapter: 'Cap. 3 — Processo Repetível' },
    { text: 'Tentar fazer seu modelo de negócio existente se esticar para incluir uma oportunidade de espaço em branco é pedir por problemas. Raramente funciona.', source_chapter: 'Cap. 1 — O Framework de Quatro Caixas' },
    { text: 'Inovação é arriscada mas não é aleatória. Inovadores têm um processo disciplinado de invenção. Conquistar espaço em branco requer olhar para mercados e clientes de formas novas.', source_chapter: 'Cap. 1 — O Framework de Quatro Caixas' },
    { text: 'Se você quer continuamente revitalizar o serviço que oferece, não pode parar no que é bom. Pergunte o que seus clientes precisam e querem, e fique bom nessas coisas.', source_chapter: 'Cap. 3 — O Caso Amazon' },
    { text: 'Todo o mundo está se movendo tão rápido que o homem que diz que não pode ser feito geralmente é interrompido por alguém fazendo.', source_chapter: 'Cap. 1 — O Framework de Quatro Caixas' },
  ],
  exercises_json: [
    { title: 'Exercício 1 — Mapeie Seu Modelo de Negócio', icon: '📦', color_theme: 'accent', description: 'Desenhe as quatro caixas do seu negócio ou carreira atual: proposta de valor, fórmula de lucro, recursos-chave e processos-chave. Identifique qual caixa mais precisa de inovação.', template_text: 'Proposta de valor: [O QUE ENTREGO]. Fórmula de lucro: [COMO GANHO]. Recursos-chave: [O QUE PRECISO]. Processos-chave: [O QUE REPITO].', checklist: ['Preenchi as 4 caixas para meu negócio/carreira atual', 'Identifiquei qual caixa está mais fraca ou desatualizada', 'Listei 2 oportunidades de "espaço em branco" ao redor', 'Avaliei se meu modelo atual serviria para alguma delas'] },
    { title: 'Exercício 2 — Descubra o "Trabalho Real"', icon: '🔍', color_theme: 'green', description: 'Observe seus clientes ou colegas usando seu produto/serviço. Identifique qual é o verdadeiro "trabalho a ser feito" que eles estão tentando realizar.', checklist: ['Observei 2-3 clientes/colegas usando meu produto/serviço', 'Anotei frustrações, gambiarras e necessidades não-articuladas', 'Identifiquei o "trabalho real" por trás do uso', 'Propus 1 mudança baseada nessa descoberta'] },
    { title: 'Exercício 3 — Teste Uma Hipótese de Negócio', icon: '🧪', color_theme: 'orange', description: 'Escolha uma ideia de negócio ou projeto e aplique o processo de incubação: identifique suposições críticas e teste a mais arriscada esta semana.', checklist: ['Escolhi uma ideia de negócio ou projeto para testar', 'Listei 3-5 suposições críticas para seu sucesso', 'Identifiquei a suposição mais arriscada', 'Desenhei e executei um teste simples para validá-la'] },
  ],
}

// ============================================================
// Book 5: Bill & Dave
// ============================================================

const book5: BookData = {
  slug: 'bill-e-dave',
  metadata: {
    title: 'Bill e Dave',
    original_title: 'Bill & Dave: How Hewlett and Packard Built the World\'s Greatest Company',
    author: 'Michael Malone',
    year: 2007,
    category_slug: 'empreendedorismo',
    category_label: 'Empreendedorismo',
    category_emoji: '🚀',
    reading_time_min: 14,
    cover_gradient_from: '#1a1a2e',
    cover_gradient_to: '#16213e',
  },
  summary_html: `<h2>A Ideia Central</h2>
<p>Do ponto de vista da história moderna dos negócios, o primeiro encontro entre Bill Hewlett e David Packard só pode ser descrito como <strong>"memorável"</strong>. Aconteceu no outono de 1930 em um cenário casual — ambos participavam das seletivas do time de futebol da Universidade Stanford. O que começou como uma amizade entre dois estudantes apaixonados por eletrônica se tornou a base da <strong>empresa mais admirada do Vale do Silício</strong> e um modelo de gestão que influenciou gerações.</p>
<p>A história de Bill e Dave é uma aula magistral sobre como construir uma empresa duradoura baseada em valores, respeito pelas pessoas e uma cultura única que ficou conhecida como <strong>"The HP Way"</strong> — O Jeito HP.</p>

<div class="highlight-box">
"Nenhum grupo operacional deveria se tornar tão grande que não pudesse ser dirigido pessoalmente pelo gerente. Toda vez que um produto ultrapassasse um certo número de funcionários, deveria ser dividido em dois grupos menores."
</div>

<h2>Amigos Primeiro, Sócios Depois</h2>
<p>David Packard era um jovem de 1,95m do Colorado, atleta natural e uma das estrelas do departamento de eletrônica de Stanford. Bill Hewlett era mais baixo, travesso e brilhante — conhecido por usar o Acelerador Linear de Stanford para bombear cerveja de uma taverna próxima até o campus. O que os uniu foi o <strong>Professor Fred Terman</strong>, considerado o pai do Vale do Silício, que viu potencial na dupla e os incentivou a criar uma empresa juntos.</p>
<p>Após terminar Stanford, Packard trabalhou na General Electric enquanto Hewlett fez mestrado no MIT. Em 1938, Hewlett retornou a Palo Alto e os dois começaram a trabalhar juntos na <strong>garagem de Packard</strong> — que mais tarde seria designada como o berço oficial do Vale do Silício. O nome da empresa foi decidido no cara ou coroa.</p>

<h2>A Construção de uma Gigante</h2>
<p>O primeiro grande produto foi um <strong>oscilador de áudio</strong> — o HP Model 200A — que Hewlett projetou como parte de sua tese de mestrado. Walt Disney comprou oito unidades para usar na produção do filme "Fantasia". Esse primeiro sucesso validou a abordagem da dupla: criar <strong>produtos inovadores de alta qualidade</strong> e vendê-los a preços justos.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Crescimento orgânico:</strong> HP cresceu sem empréstimos nem capital externo por décadas. Todo crescimento era financiado pelos lucros da empresa — uma disciplina financeira rara.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Inovação constante:</strong> A empresa investiu consistentemente em P&D e lançava novos produtos a cada ano, mantendo-se sempre na fronteira tecnológica.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Diversificação inteligente:</strong> De instrumentos de medição para computadores, de calculadoras para impressoras — cada salto foi construído sobre competências existentes.</div>
</div>

<h2>O Jeito HP — Uma Revolução na Gestão</h2>
<p>O que tornou a HP verdadeiramente especial não foram seus produtos, mas sua <strong>cultura corporativa revolucionária</strong>. Bill e Dave criaram um ambiente de trabalho radicalmente diferente para a época:</p>

<div class="key-point">
  <div class="kp-num">💡</div>
  <div class="kp-text"><strong>Gestão por Objetivos (MBO):</strong> Em vez de supervisão rígida, funcionários recebiam objetivos claros e a liberdade para decidir como alcançá-los.</div>
</div>
<div class="key-point">
  <div class="kp-num">⚡</div>
  <div class="kp-text"><strong>Portas abertas e flexibilidade:</strong> Bill e Dave eliminaram escritórios fechados, introduziram horários flexíveis e caminhavam regularmente pela fábrica conversando com todos.</div>
</div>
<div class="key-point">
  <div class="kp-num">🎯</div>
  <div class="kp-text"><strong>Participação nos lucros:</strong> HP foi uma das primeiras grandes empresas americanas a oferecer participação nos lucros e plano de ações para todos os funcionários.</div>
</div>

<h3>Sem Demissões</h3>
<p>Uma das decisões mais icônicas do Jeito HP veio durante uma recessão nos anos 1970. Em vez de demitir funcionários, Bill e Dave implementaram uma <strong>jornada de trabalho reduzida de 9 dias a cada duas semanas</strong>. Todos — do chão de fábrica aos executivos — tomaram o mesmo corte. A empresa sobreviveu à crise sem perder um único funcionário.</p>

<div class="highlight-box">
"Mais do que qualquer outra coisa, os dois acreditavam na honestidade e integridade absolutas em todos os relacionamentos dentro e fora da empresa. Eles tinham o compromisso sagrado de que a HP sempre se comportaria de forma ética."
</div>

<h2>Complementaridade Perfeita</h2>
<p>Bill e Dave tinham personalidades muito diferentes que se complementavam perfeitamente. Packard era o <strong>visionário e administrador</strong> — alto, imponente, focado em estratégia e operações. Hewlett era o <strong>inventor e inspirador</strong> — menor, acessível, sempre curioso e brincalhão, adorado pelos engenheiros.</p>
<p>Packard cuidava do lado corporativo — finanças, estratégia, relações governamentais. Chegou a servir como Vice-Secretário de Defesa dos EUA de 1969 a 1971. Hewlett era o coração técnico, caminhando pelos laboratórios, fazendo perguntas aos engenheiros e <strong>inspirando inovação pelo exemplo</strong>.</p>

<h2>Legado e Lições</h2>
<p>A HP cresceu de uma garagem em 1938 para uma das maiores empresas de tecnologia do mundo, com mais de <strong>$90 bilhões em receita</strong>. A empresa sobreviveu a múltiplas revoluções tecnológicas — instrumentos, computadores, impressoras, serviços — reinventando-se a cada ciclo.</p>

<div class="key-point">
  <div class="kp-num">1</div>
  <div class="kp-text"><strong>Valores antes de lucros:</strong> Bill e Dave provaram que tratar pessoas com respeito e operar com integridade gera resultados financeiros superiores a longo prazo.</div>
</div>
<div class="key-point">
  <div class="kp-num">2</div>
  <div class="kp-text"><strong>Descentralização:</strong> Manter divisões pequenas e autônomas preservou o espírito empreendedor mesmo quando a empresa cresceu para centenas de milhares de funcionários.</div>
</div>
<div class="key-point">
  <div class="kp-num">3</div>
  <div class="kp-text"><strong>Amizade como fundação:</strong> A parceria de 60 anos entre Bill e Dave nunca teve um contrato formal. Confiança mútua e respeito foram suficientes.</div>
</div>

<h2>Conclusão</h2>
<p>A história de Bill e Dave é uma prova viva de que <strong>grandes empresas são construídas sobre grandes valores</strong>. Em uma era onde startups surgem e desaparecem rapidamente, as lições da HP permanecem atemporais: trate as pessoas como gostaria de ser tratado, cresça de forma sustentável, invista em inovação constante e nunca comprometa sua integridade. O Jeito HP não era apenas uma filosofia de gestão — era uma forma de viver.</p>

<div class="highlight-box">
"O Jeito HP não era apenas um conjunto de regras corporativas. Era a expressão dos valores pessoais de dois homens que acreditavam que você podia construir uma grande empresa sem sacrificar a humanidade."
</div>`,
  mindmap_json: {
    center_label: 'BILL E DAVE',
    center_sublabel: 'O Jeito HP de Fazer Negócios',
    branches: [
      { title: 'As Origens', icon: '🏠', items: ['Stanford e Prof. Terman', 'Garagem de Palo Alto', 'Nome no cara ou coroa', 'Oscilador HP 200A'] },
      { title: 'O Jeito HP', icon: '💡', items: ['Gestão por objetivos', 'Portas abertas sempre', 'Participação nos lucros', 'Sem demissões em crises'] },
      { title: 'Crescimento', icon: '📈', items: ['Sem dívida, só lucros', 'Inovação constante em P&D', 'Diversificação inteligente', 'Divisões pequenas e autônomas'] },
      { title: 'Complementaridade', icon: '🤝', items: ['Packard: estratégia e visão', 'Hewlett: invenção e inspiração', '60 anos sem contrato formal', 'Confiança mútua total'] },
      { title: 'Valores Fundamentais', icon: '⭐', items: ['Integridade absoluta', 'Respeito pelas pessoas', 'Lucro como consequência', 'Ética em tudo'] },
      { title: 'Legado', icon: '🏆', items: ['Berço do Vale do Silício', 'Modelo para gerações', 'De garagem a $90 bilhões', 'Cultura que transcende fundadores'] },
    ],
  },
  insights_json: [
    { text: 'Nenhum grupo operacional deveria ser tão grande que não pudesse ser dirigido pessoalmente. Toda vez que ultrapassasse um certo tamanho, deveria ser dividido em dois menores.', source_chapter: 'Cap. 3 — O Jeito HP' },
    { text: 'Mais do que qualquer outra coisa, os dois acreditavam na honestidade e integridade absolutas em todos os relacionamentos dentro e fora da empresa.', source_chapter: 'Cap. 3 — O Jeito HP' },
    { text: 'Em vez de demitir funcionários durante a recessão, todos — do chão de fábrica aos executivos — trabalharam 9 dias a cada duas semanas. A empresa sobreviveu sem perder um único funcionário.', source_chapter: 'Cap. 3 — Sem Demissões' },
    { text: 'A parceria de 60 anos entre Bill e Dave nunca teve um contrato formal. Confiança mútua e respeito foram suficientes.', source_chapter: 'Cap. 4 — Complementaridade' },
    { text: 'HP cresceu sem empréstimos nem capital externo por décadas. Todo crescimento era financiado pelos lucros da empresa — uma disciplina financeira rara que provou ser uma vantagem duradoura.', source_chapter: 'Cap. 2 — Construção de uma Gigante' },
    { text: 'O Jeito HP não era apenas um conjunto de regras corporativas. Era a expressão dos valores pessoais de dois homens que acreditavam que se podia construir uma grande empresa sem sacrificar a humanidade.', source_chapter: 'Cap. 5 — Legado' },
    { text: 'Bill e Dave provaram que tratar pessoas com respeito e operar com integridade gera resultados financeiros superiores a longo prazo.', source_chapter: 'Cap. 5 — Legado e Lições' },
  ],
  exercises_json: [
    { title: 'Exercício 1 — Defina Seus Valores Inegociáveis', icon: '⭐', color_theme: 'accent', description: 'Assim como Bill e Dave tinham princípios claros, identifique 3-5 valores pessoais que você nunca comprometeria, mesmo sob pressão.', template_text: 'Meus valores inegociáveis são: 1) [VALOR]. 2) [VALOR]. 3) [VALOR]. Uma situação recente onde quase comprometi um deles foi: [SITUAÇÃO].', checklist: ['Listei 3-5 valores pessoais que considero inegociáveis', 'Para cada um, identifiquei uma situação onde foi testado', 'Escrevi como quero agir quando forem desafiados no futuro', 'Compartilhei com alguém de confiança para accountability'] },
    { title: 'Exercício 2 — Gestão por Objetivos Pessoal', icon: '🎯', color_theme: 'green', description: 'Aplique o princípio de Bill e Dave: defina objetivos claros para sua semana e dê a si mesmo liberdade total sobre como alcançá-los.', checklist: ['Defini 3 objetivos claros e mensuráveis para a semana', 'Eliminei qualquer micro-gestão sobre o "como" fazer', 'No final da semana, avaliei resultados honestamente', 'Ajustei os objetivos para a próxima semana'] },
    { title: 'Exercício 3 — Encontre Seu Complemento', icon: '🤝', color_theme: 'orange', description: 'Bill e Dave tinham habilidades complementares. Identifique suas fraquezas e encontre ou fortaleça uma parceria que as compense.', checklist: ['Listei minhas 3 maiores forças e 3 maiores fraquezas', 'Identifiquei 1-2 pessoas que complementam minhas fraquezas', 'Propus uma colaboração ou troca de habilidades', 'Defini como medir o sucesso dessa parceria em 30 dias'] },
  ],
}

// ============================================================
// Insertion Logic
// ============================================================

const books = [book1, book2, book3, book4, book5]

async function main() {
  console.log('Starting insertion of 5 books...\n')

  // Get current max sort_order
  const { data: maxData } = await supabase
    .from('resumox_books')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  let sortOrder = (maxData?.sort_order ?? 219) + 1

  for (const book of books) {
    console.log(`\n--- Processing: ${book.metadata.title} ---`)

    // Check for duplicates
    const { data: existing } = await supabase
      .from('resumox_books')
      .select('id, slug, title')
      .or(`slug.eq.${book.slug},original_title.ilike.${book.metadata.original_title}`)
      .maybeSingle()

    if (existing) {
      console.log(
        `⚠️ Already exists: "${existing.title}" (slug: ${existing.slug}, id: ${existing.id}). Skipping.`
      )
      continue
    }

    // Insert book metadata
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
      console.error(`❌ Error inserting book metadata: ${bookError.message}`)
      continue
    }

    console.log(`✅ Book metadata inserted (id: ${bookRow.id}, sort_order: ${sortOrder})`)

    // Insert content
    const { error: contentError } = await supabase.from('resumox_book_content').insert({
      book_id: bookRow.id,
      summary_html: book.summary_html,
      mindmap_json: book.mindmap_json,
      insights_json: book.insights_json,
      exercises_json: book.exercises_json,
    })

    if (contentError) {
      console.error(`❌ Error inserting content: ${contentError.message}`)
      // Rollback
      await supabase.from('resumox_books').delete().eq('id', bookRow.id)
      console.log('↩️ Rolled back book metadata.')
      continue
    }

    console.log(`✅ Content inserted for "${book.metadata.title}"`)
    sortOrder++
  }

  console.log('\n🎉 Done! All books processed.')
}

main().catch(console.error)
