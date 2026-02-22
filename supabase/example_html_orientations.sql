-- Example HTML Orientation Items
-- These are examples you can customize and insert into your product_contents table
-- Make sure to run the migration add_html_content_column.sql first!

-- Example 1: Welcome orientation before first lesson
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE', -- Replace with your actual product_id
  'html_orientation',
  'Bem-vindo ao Programa',
  'Instruções importantes antes de começar',
  '<h3>Antes de Começar...</h3>
<p>Para aproveitar ao máximo este programa de reprogramação mental, siga estas orientações:</p>
<ul>
  <li><strong>Encontre um espaço tranquilo</strong> onde você não será interrompido</li>
  <li><strong>Use fones de ouvido</strong> para uma experiência imersiva</li>
  <li><strong>Pratique diariamente</strong> - a consistência é fundamental</li>
  <li><strong>Mantenha um diário</strong> das suas experiências e insights</li>
</ul>
<p><em>Lembre-se: Este é um processo gradual. Seja paciente consigo mesmo.</em></p>',
  0, -- This will appear first (before other content)
  true
);

-- Example 2: Progress checkpoint after a few lessons
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'html_orientation',
  '✓ Checkpoint - Dia 3',
  'Momento de reflexão',
  '<h3>Parabéns pelo seu progresso!</h3>
<p>Você completou <strong>3 dias</strong> do programa. Reserve um momento para refletir:</p>
<ul>
  <li>Que mudanças você já percebeu?</li>
  <li>Você está praticando todos os dias?</li>
  <li>Precisa ajustar sua rotina de prática?</li>
</ul>
<blockquote>
  "A transformação acontece quando você se compromete com o processo, não quando busca resultados imediatos."
</blockquote>
<p><strong>Continue em frente!</strong> Os benefícios se acumulam com a prática regular.</p>',
  3, -- After 3rd content item
  true
);

-- Example 3: Important warning before deep relaxation session
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'html_orientation',
  '⚠️ Aviso Importante',
  'Leia antes de prosseguir',
  '<h3>Antes da Sessão de Relaxamento Profundo</h3>
<p><strong style="color: rgb(251 191 36);">NÃO escute este áudio enquanto:</strong></p>
<ul>
  <li>Estiver dirigindo ou operando máquinas</li>
  <li>Realizando atividades que exigem atenção total</li>
  <li>Em ambientes públicos ou inseguros</li>
</ul>
<hr>
<blockquote>
  Esta sessão foi projetada para relaxamento profundo.
  Encontre um lugar seguro e confortável onde possa se entregar completamente.
</blockquote>
<p><strong>Prepare seu espaço:</strong> Deite-se confortavelmente, desligue notificações e permita-se este momento de cuidado pessoal.</p>',
  5, -- Before a specific deep relaxation track
  true
);

-- Example 4: Breathing technique instruction
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'html_orientation',
  'Técnica de Respiração 4-7-8',
  'Prepare-se para a próxima sessão',
  '<h3>Respiração 4-7-8 para Relaxamento</h3>
<p>Use esta técnica antes de cada sessão para preparar seu corpo e mente:</p>
<pre><code>1. Inspire pelo nariz por 4 segundos
2. Segure a respiração por 7 segundos
3. Expire pela boca por 8 segundos
4. Repita 4 vezes</code></pre>
<p><strong>Por que funciona?</strong> Este padrão ativa seu sistema nervoso parassimpático, preparando você para um estado de relaxamento profundo.</p>
<p><em>Faça isso agora, antes de continuar para a próxima sessão.</em></p>',
  2,
  true
);

-- Example 5: Journal exercise
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'html_orientation',
  'Exercício de Diário',
  'Tarefa para reflexão',
  '<h3>Exercício de Reflexão</h3>
<p>Após completar este módulo, dedique 10 minutos para escrever sobre:</p>
<ol>
  <li><strong>Emoções:</strong> Que sentimentos surgiram durante a sessão?</li>
  <li><strong>Insights:</strong> Que percepções ou realizações você teve?</li>
  <li><strong>Aplicação:</strong> Como você pode aplicar isso no seu dia a dia?</li>
</ol>
<hr>
<p><em>Não há respostas certas ou erradas. Este é um espaço para seu crescimento pessoal.</em></p>
<p><strong>Dica:</strong> Mantenha um caderno dedicado ao programa. Rever suas anotações mais tarde pode revelar padrões surpreendentes de transformação.</p>',
  7,
  true
);

-- Example 6: Week completion celebration
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'html_orientation',
  '🎉 Você Completou 1 Semana!',
  'Celebre seu progresso',
  '<h3>Parabéns pela Dedicação!</h3>
<p>Você completou <strong>uma semana inteira</strong> de prática consistente. Isso é um grande feito!</p>
<h4>O que acontece agora?</h4>
<ul>
  <li>Seu cérebro já está formando novos padrões neurais</li>
  <li>Seus níveis de stress podem estar começando a diminuir</li>
  <li>Você pode notar mais clareza mental e foco</li>
</ul>
<blockquote>
  "A jornada de mil milhas começa com um único passo. Você já deu vários passos. Continue!"
</blockquote>
<p><strong>Próximo passo:</strong> Mantenha o ritmo! A segunda semana é quando os benefícios começam a se consolidar.</p>',
  8,
  true
);

-- Note: Update the product_id and order_index values to match your actual data
-- The order_index determines where each orientation appears in the content list
