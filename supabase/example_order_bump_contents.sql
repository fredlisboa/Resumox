-- Exemplo de como cadastrar conteúdos do Order Bump
-- Execute este SQL no Supabase SQL Editor para adicionar conteúdos bloqueados

-- IMPORTANTE:
-- 1. Execute primeiro a migration: supabase/migrations/add_order_bump_status.sql
-- 2. Configure a URL de checkout em: /lib/product-config.ts

-- ============================================
-- CONTEÚDOS DO ORDER BUMP
-- ============================================
-- Use status='order_bump' para marcar conteúdos que devem aparecer bloqueados
-- Estes conteúdos aparecerão com cadeado e redirecionarão para o checkout

-- Exemplo 1: Áudio exclusivo do Order Bump
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  thumbnail_url,
  duration,
  order_index,
  status,
  is_active
) VALUES (
  'ORDERBUMP01',                           -- Product ID (qualquer identificador único)
  'audio',                                  -- Tipo: audio, video, pdf, etc.
  'Áudio Bônus Exclusivo - Reprogramação Profunda',
  'Sessão exclusiva de 30 minutos para reprogramação neurológica avançada. Clique para desbloquear!',
  'r2://audios/bonus-reprogramacao-profunda.mp3',  -- URL do arquivo
  NULL,                                     -- Thumbnail opcional
  1800,                                     -- Duração em segundos (30 minutos)
  100,                                      -- order_index alto para aparecer depois dos conteúdos principais
  'order_bump',                             -- ⚡ IMPORTANTE: use 'order_bump' para bloqueio automático
  true                                      -- is_active
);

-- Exemplo 2: Vídeo exclusivo do Order Bump
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  thumbnail_url,
  duration,
  order_index,
  status,
  is_active
) VALUES (
  'ORDERBUMP01',
  'video',
  'Masterclass Exclusiva - Técnicas Avançadas',
  'Aprenda técnicas avançadas de neurociência acústica. Conteúdo exclusivo para membros premium!',
  'https://exemplo.com/videos/masterclass-exclusiva.mp4',
  'https://exemplo.com/thumbnails/masterclass.jpg',
  2400,                                     -- 40 minutos
  101,
  'order_bump',                             -- ⚡ Status order_bump para bloqueio
  true
);

-- Exemplo 3: PDF exclusivo do Order Bump
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  file_size,
  order_index,
  status,
  is_active
) VALUES (
  'ORDERBUMP01',
  'pdf',
  'Guia Completo de Meditação Avançada',
  'E-book com 50 páginas de técnicas avançadas. Desbloqueie agora!',
  'r2://pdfs/guia-meditacao-avancada.pdf',
  2500000,                                  -- Tamanho em bytes (~2.5MB)
  102,
  'order_bump',                             -- ⚡ Status order_bump para bloqueio
  true
);

-- ============================================
-- VERIFICAR CONTEÚDOS CADASTRADOS
-- ============================================

-- Listar todos os conteúdos com status order_bump
SELECT
  id,
  product_id,
  content_type,
  title,
  order_index,
  status,
  is_active,
  created_at
FROM public.product_contents
WHERE status = 'order_bump'
ORDER BY order_index;

-- Listar TODOS os conteúdos com seus status
SELECT
  status,
  COUNT(*) as quantidade,
  ARRAY_AGG(title ORDER BY order_index) as titulos
FROM public.product_contents
WHERE is_active = true
GROUP BY status;

-- ============================================
-- LIMPAR/DELETAR CONTEÚDOS (SE NECESSÁRIO)
-- ============================================

-- CUIDADO: Este comando deleta TODOS os conteúdos order_bump
-- DELETE FROM public.product_contents WHERE status = 'order_bump';

-- ============================================
-- CONVERTER CONTEÚDOS EXISTENTES
-- ============================================

-- Se você já tem conteúdos cadastrados e quer marcá-los como order_bump
-- UPDATE public.product_contents
-- SET status = 'order_bump'
-- WHERE product_id = 'ORDERBUMP01' OR title ILIKE '%exclusivo%';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
📌 COMO FUNCIONA O BLOQUEIO:

1. STATUS 'order_bump':
   ⚡ Use status='order_bump' para marcar conteúdos que devem aparecer bloqueados
   - Estes conteúdos SEMPRE aparecerão com cadeado vermelho
   - Ao clicar, redirecionam para o checkout automaticamente
   - Não dependem de verificação de product_id do usuário

2. ORDER_INDEX:
   - Use valores altos (100+) para order bumps aparecerem depois
   - Ou ordene conforme sua estratégia de conversão

3. PRODUCT_ID:
   - Pode usar qualquer identificador único (ex: 'ORDERBUMP01')
   - NÃO precisa corresponder exatamente à Hotmart (diferente do sistema anterior)
   - É apenas para organização interna

4. CONTENT_URL:
   - r2:// para Cloudflare R2
   - URLs diretas para S3, Vimeo, YouTube, etc.

5. CHECKOUT_URL:
   - Configure em /lib/product-config.ts
   - Constante: ORDER_BUMP_CHECKOUT_URL
   - Padrão: https://pay.hotmart.com/A102740797J

6. VISUAL NO FRONTEND:
   ✅ Borda vermelha semi-transparente
   ✅ Fundo com gradiente vermelho/laranja
   ✅ Opacidade 60% (hover 80%)
   ✅ Ícone de cadeado vermelho
   ✅ Badge "🔒 BLOQUEADO"
   ✅ Cadeado substituindo botão play

7. TESTAR:
   - Execute a migration: add_order_bump_status.sql
   - Cadastre conteúdos com status='order_bump'
   - Faça login na área de membros
   - Conteúdos order_bump aparecerão bloqueados
   - Clique para testar redirecionamento ao checkout
*/
