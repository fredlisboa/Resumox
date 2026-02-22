-- Script to fix R2 URLs in the database
-- The app requires HTTPS links, but the DB currently has 'r2://'

-- 1. Replace 'https://YOUR_R2_PUBLIC_DOMAIN' with your actual R2 public bucket URL.
--    Example: 'https://pub-123456789.r2.dev'
--    Ensure you keep the trailing slash '/' if your r2:// paths don't have it (they usually don't start with / after the host).1

UPDATE product_contents
SET content_url = REPLACE(content_url, 'r2://', 'https://pub-bfc09221ea1742d8ab16d9076aa4858b.r2.dev')
WHERE content_type = 'audio'
  AND content_url LIKE 'r2://%';

-- 2. Verify the changes
SELECT title, content_url FROM product_contents WHERE content_type = 'audio';