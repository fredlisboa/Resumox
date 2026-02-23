# Quick Start: Adding HTML Orientations

## Step 1: Run the Migration

Execute this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the content from:
supabase/migrations/add_html_content_column.sql
```

Or run it directly:

```bash
# If you're using Supabase CLI
supabase db push
```

## Step 2: Verify the Column Was Added

Run this in Supabase SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'product_contents'
  AND column_name = 'html_content';
```

You should see:
```
column_name  | data_type
-------------+-----------
html_content | text
```

## Step 3: Insert Your First HTML Orientation

### Option A: Use the Examples

Open [supabase/example_html_orientations.sql](supabase/example_html_orientations.sql) and:
1. Replace `'PRODUCT_001'` with your actual product_id
2. Adjust the `order_index` values to position items correctly
3. Copy and paste the INSERT statements into Supabase SQL Editor
4. Execute

### Option B: Create Your Own

```sql
INSERT INTO public.product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'YOUR_PRODUCT_ID',  -- Replace with your product_id
  'html_orientation',
  'Your Title Here',
  'Short description',
  '<p>Your HTML content here</p><ul><li>Item 1</li><li>Item 2</li></ul>',
  2,  -- Position in the list (lower numbers appear first)
  true
);
```

## Step 4: Test in Your App

1. Refresh your dashboard page
2. You should see the HTML orientation item appearing between your course items
3. It will have:
   - Amber/orange gradient icon
   - Glass border effect
   - Sequential numbering
   - Properly styled HTML content

## Troubleshooting

### Error: "column html_content does not exist"
→ You need to run the migration first (Step 1)

### HTML orientation not appearing
1. Check `is_active` is `true`
2. Verify `product_id` matches your existing content
3. Check `order_index` - lower numbers appear first
4. Look in browser console for errors

### Styling looks wrong
→ Make sure your [app/globals.css](app/globals.css) has the `.html-content` styles (lines 172-272)

## HTML Content Tips

### Supported Tags:
- Headings: `<h1>` to `<h6>`
- Text: `<p>`, `<strong>`, `<em>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Links: `<a href="">`
- Code: `<code>`, `<pre>`
- Quotes: `<blockquote>`
- Divider: `<hr>`

### Example Templates:

**Simple Instruction:**
```html
<p>Before starting:</p>
<ul>
  <li>Find a quiet space</li>
  <li>Use headphones</li>
  <li>Take notes</li>
</ul>
```

**Warning:**
```html
<h3>⚠️ Important</h3>
<p><strong>Do NOT listen while driving!</strong></p>
```

**Checkpoint:**
```html
<h3>Great Progress!</h3>
<p>You've completed <strong>3 days</strong>. Reflect on:</p>
<ol>
  <li>What changes have you noticed?</li>
  <li>Are you practicing daily?</li>
</ol>
```

## Finding Your Product ID

If you don't know your product_id:

```sql
SELECT DISTINCT product_id
FROM public.product_contents;
```

## Checking Your Current Order Indexes

```sql
SELECT
  order_index,
  content_type,
  title
FROM public.product_contents
WHERE product_id = 'YOUR_PRODUCT_ID'
ORDER BY order_index;
```

This shows all your content in order, helping you decide where to insert orientations.

## Complete Documentation

For detailed documentation, examples, and component reference, see:
- [docs/HTML_ORIENTATION_GUIDE.md](docs/HTML_ORIENTATION_GUIDE.md)

## Need Help?

Common questions answered in the full guide:
- How to sanitize user-generated HTML
- How to use the component directly in React
- Advanced styling options
- Security best practices
