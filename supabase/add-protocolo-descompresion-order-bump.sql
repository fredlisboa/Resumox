-- Script para adicionar "Protocolo de Descompresión Somática" como Order Bump
-- Data: 2025-12-20
-- Tipo: PDF bloqueado que redireciona para checkout

-- ============================================
-- ADICIONAR PROTOCOLO DE DESCOMPRESIÓN SOMÁTICA
-- ============================================

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
  '🔥 Protocolo de Descompresión Somática - Exclusivo',
  'Técnica avanzada para liberar tensiones profundas del cuerpo. ¡Desbloquea este contenido premium ahora!',
  'r2://pdfs/OB01 Protocolo-de-Descompresion-Somatica.pdf',
  NULL,  -- file_size será calculado automaticamente pelo sistema
  100,   -- order_index alto para aparecer após conteúdos principais
  'order_bump',  -- ⚡ Status que marca como bloqueado
  true
);

-- ============================================
-- VERIFICAR SE FOI INSERIDO CORRETAMENTE
-- ============================================

SELECT
  id,
  title,
  content_type,
  status,
  content_url,
  order_index,
  created_at
FROM public.product_contents
WHERE title ILIKE '%Descompresión Somática%'
  OR content_url LIKE '%Protocolo-de-Descompresion-Somatica%';

-- ============================================
-- QUERY PARA LISTAR TODOS OS ORDER BUMPS
-- ============================================

SELECT
  id,
  title,
  content_type,
  status,
  order_index,
  is_active
FROM public.product_contents
WHERE status = 'order_bump'
ORDER BY order_index;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
✅ O QUE FOI CONFIGURADO:

1. TÍTULO PERSUASIVO:
   - "🔥 Protocolo de Descompresión Somática - Exclusivo"
   - Emoji de fogo para chamar atenção
   - "Exclusivo" para criar desejo

2. DESCRIÇÃO QUE VENDE:
   - Benefício claro: "liberar tensiones profundas"
   - Call-to-action: "¡Desbloquea este contenido premium ahora!"

3. STATUS ORDER_BUMP:
   - Automaticamente bloqueado
   - Exibe cadeado vermelho
   - Redireciona para: https://pay.hotmart.com/A102740797J

4. POSICIONAMENTO:
   - order_index = 100
   - Aparece após conteúdos principais
   - Estratégia: mostrar valor antes de oferecer order bump

🎯 RESULTADO ESPERADO:

Quando o usuário acessar a área de membros:
✅ Verá o PDF "Protocolo de Descompresión Somática" com cadeado vermelho
✅ Card com opacidade 60% e borda vermelha
✅ Badge "🔒 BLOQUEADO" vermelho
✅ Ao clicar → redireciona para checkout da Hotmart

💡 DICAS DE OTIMIZAÇÃO:

1. POSICIONAMENTO ESTRATÉGICO:
   - Se quiser que apareça ANTES, use order_index = 50
   - Se quiser que apareça DEPOIS, mantenha order_index = 100
   - Para intercalar entre conteúdos, use order_index = 15, 25, 35, etc.

2. TESTE A/B DE TÍTULO:
   UPDATE product_contents
   SET title = '⚡ Protocolo Secreto de Descompresión Somática'
   WHERE content_url LIKE '%Protocolo-de-Descompresion-Somatica%';

3. TESTE A/B DE DESCRIÇÃO:
   UPDATE product_contents
   SET description = 'Libera tensiones en 5 minutos con esta técnica exclusiva. Más de 5.000 alumnos ya transformaron su vida. ¡Desbloquea ahora!'
   WHERE content_url LIKE '%Protocolo-de-Descompresion-Somatica%';
*/

-- ============================================
-- COMANDOS ÚTEIS (SE NECESSÁRIO)
-- ============================================

-- Atualizar ordem de exibição
-- UPDATE product_contents
-- SET order_index = 50
-- WHERE content_url LIKE '%Protocolo-de-Descompresion-Somatica%';

-- Atualizar título
-- UPDATE product_contents
-- SET title = 'Novo Título Aqui'
-- WHERE content_url LIKE '%Protocolo-de-Descompresion-Somatica%';

-- Desativar temporariamente (sem deletar)
-- UPDATE product_contents
-- SET is_active = false
-- WHERE content_url LIKE '%Protocolo-de-Descompresion-Somatica%';

-- Reativar
-- UPDATE product_contents
-- SET is_active = true
-- WHERE content_url LIKE '%Protocolo-de-Descompresion-Somatica%';

-- Deletar completamente (CUIDADO!)
-- DELETE FROM product_contents
-- WHERE content_url LIKE '%Protocolo-de-Descompresion-Somatica%';
