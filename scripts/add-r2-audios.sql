-- Script para adicionar os áudios do R2 no banco de dados
-- Execute este script no Supabase SQL Editor

-- Primeiro, veja os products disponíveis executando:
-- SELECT DISTINCT product_id, product_name FROM users_access;

-- Substitua 'PRODUTO_TESTE' pelo product_id do seu produto
-- Exemplo: 'PRODUCT_001' ou o ID que vier da Hotmart

-- Track 01: El Despertar Energético - Manhã
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Track01 - El Despertar Energético (Manhã)',
  'Áudio de reprogramação mental para despertar energético pela manhã',
  'r2://audios/Track01_El_Despertar_Energético_Manhã.mp3',
  NULL, -- Atualize com a duração em segundos se souber
  1,
  true
);

-- Track 02: SOS Ansiedad - O Botão de Pânico
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Track02 - SOS Ansiedad (Botão de Pânico)',
  'Áudio SOS para momentos de ansiedade e pânico',
  'r2://audios/Track02_SOS_Ansiedad_O_Botão_de_Pânico.mp3',
  NULL,
  2,
  true
);

-- Track 03: Dormir Profundo - Noite
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Track03 - Dormir Profundo (Noite)',
  'Áudio de reprogramação mental para dormir profundamente',
  'r2://audios/Track03_Dormir_Profundo_Noite.mp3',
  NULL,
  3,
  true
);

-- Track 04: Enfoque Láser - Produtividade
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Track04 - Enfoque Láser (Produtividade)',
  'Áudio para foco e produtividade máxima',
  'r2://audios/Track04_Enfoque_Láser_Produtividade.mp3',
  NULL,
  4,
  true
);

-- Track 05: Detox Emocional - Transição Trabalho-Casa
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Track05 - Detox Emocional (Transição)',
  'Áudio de detox emocional para transição entre trabalho e casa',
  'r2://audios/Track05_Detox_Emocional_Transição_Trabalho-Casa.mp3',
  NULL,
  5,
  true
);

-- Track 06: Confianza Inquebrantable
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Track06 - Confianza Inquebrantable',
  'Áudio para desenvolver confiança inabalável',
  'r2://audios/Track06_Confianza_Inquebrantable.mp3',
  NULL,
  6,
  true
);

-- Track 07: Pausa de Mediodía
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  duration,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE',
  'audio',
  'Track07 - Pausa de Mediodía',
  'Áudio para pausa do meio-dia e renovação de energia',
  'r2://audios/Track07_Pausa_de_Mediodía.mp3',
  NULL,
  7,
  true
);

-- Para ver os conteúdos inseridos (descomente para verificar)
-- SELECT
--   id,
--   product_id,
--   title,
--   content_url,
--   order_index,
--   is_active
-- FROM product_contents
-- WHERE content_type = 'audio'
-- ORDER BY order_index;
