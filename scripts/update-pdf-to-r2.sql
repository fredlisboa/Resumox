-- Script para atualizar o PDF para usar o arquivo correto do R2
-- Arquivo confirmado no R2: pdfs/Relatório_InfoDental-76.pdf

-- PASSO 1: Verificar o PDF atual
SELECT
  id,
  product_id,
  title,
  content_url,
  is_active
FROM product_contents
WHERE content_type = 'pdf'
ORDER BY created_at DESC;

-- PASSO 2: Atualizar o content_url para usar o arquivo correto do R2
-- Substitua 'PRODUCT_ID_AQUI' pelo product_id correto que você viu no PASSO 1
-- E 'PDF_ID_AQUI' pelo ID do PDF que deseja atualizar

-- Opção A: Atualizar usando protocolo r2:// (RECOMENDADO - funciona com proxy interno)
UPDATE product_contents
SET
  content_url = 'r2://pdfs/Relatório_InfoDental-76.pdf',
  updated_at = NOW()
WHERE id = 'f9833cfc-664a-4348-b34a-81c50cabd1b0' -- Substitua pelo ID correto
  AND content_type = 'pdf';

-- Opção B: Atualizar usando URL pública do R2 (se você preferir URL direta)
-- Descomente as linhas abaixo e comente a Opção A se preferir esta abordagem
-- UPDATE product_contents
-- SET
--   content_url = 'https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/pdfs/Relatório_InfoDental-76.pdf',
--   updated_at = NOW()
-- WHERE id = 'PRODUTO TESTE' -- Substitua pelo ID correto
--   AND content_type = 'pdf';

-- PASSO 3: Verificar a atualização
SELECT
  id,
  product_id,
  title,
  content_url,
  updated_at,
  is_active
FROM product_contents
WHERE content_type = 'pdf'
ORDER BY updated_at DESC;

-- PASSO 4: Garantir que o PDF está ativo
UPDATE product_contents
SET is_active = true
WHERE content_type = 'pdf'
  AND id = 'f9833cfc-664a-4348-b34a-81c50cabd1b0'; -- Substitua pelo ID correto

-- NOTA: O componente PDFViewer aceita ambos os formatos:
-- - r2://path/to/file.pdf -> será processado via /api/r2-content
-- - https://... -> será processado via /api/pdf-proxy (se externo) ou diretamente (se do R2 público)
