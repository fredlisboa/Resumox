-- Example Image Content
-- This file demonstrates how to add image content to product_contents table
-- Images can be used for banners, headers, or visual content between lessons

-- Example 1: Banner image before the first HTML orientation
-- This will appear as item #0 in the content list (before "Antes de Comenzar...")
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index,
  is_active
) VALUES (
  'PRODUTO_TESTE', -- Replace with your actual product_id
  'image',
  'NeuroReset - Bienvenida',
  'Banner de bienvenida al programa',
  'https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/images/neuroreset-banner.png',
  -1, -- Negative order_index to appear before the first orientation (order_index 0)
  true
);

-- Example 2: Mid-program motivational image
-- This could appear between lessons as visual encouragement
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'image',
  'Tu cerebro en transformación',
  'Visualización del proceso neuroplástico',
  'https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/images/brain-transformation.png',
  4, -- Will appear after the 4th content item
  true
);

-- Example 3: Infographic with breathing technique
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'image',
  'Infografía: Técnica de Respiración',
  'Guía visual de la respiración 4-7-8',
  'https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/images/breathing-technique.png',
  1, -- Before second content item
  true
);

-- Example 4: Progress milestone image
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'image',
  'Hito de Progreso - Día 7',
  'Celebra tu primera semana de transformación',
  'https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev/images/milestone-day7.png',
  8, -- After completing first week
  true
);

-- Example 5: Using R2 internal URL format (if storing in your own R2)
-- Format: r2://bucket-name/path/to/image.png
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  content_url,
  order_index,
  is_active
) VALUES (
  'PRODUCT_001',
  'image',
  'Neurociencia del Hábito',
  'Cómo se forman nuevos patrones neuronales',
  'r2://my-bucket/images/neuroscience-habits.jpg',
  6,
  true
);

-- Notes:
-- 1. The content_url can be:
--    - A public HTTPS URL (e.g., from R2 public bucket, CDN, etc.)
--    - An R2 internal URL (r2://...) that will be transformed by the API
-- 2. The order_index determines where the image appears in the content list
--    - Use negative numbers to appear before the first item
--    - Use the same number as existing content to appear at the same position
-- 3. Images can be used for:
--    - Welcome banners
--    - Infographics
--    - Progress milestones
--    - Visual guides
--    - Motivational content
-- 4. The title and description will appear in the content list
-- 5. Images are displayed full-width in the player with protected content (right-click disabled)
