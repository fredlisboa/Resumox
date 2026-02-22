# HTML Orientation Items - Usage Guide

This guide explains how to add HTML orientation/guidance items between course content in your application.

## Overview

HTML orientation items allow you to insert custom HTML content (instructions, tips, warnings, etc.) between regular course items (videos, audios, PDFs, etc.) in the "Tu Biblioteca" section. These items have the same visual style as other course items with glassmorphism effects, borders, and consistent colors.

## Visual Design

- **Border**: Glass effect with neuro-500 border
- **Icon**: Amber/orange gradient circle with info icon
- **Number Badge**: Optional sequential number
- **Styling**: Matches existing course items seamlessly

## How to Add HTML Orientation Items

### 1. Database Setup

Add orientation items to your `product_contents` table with:

```sql
INSERT INTO product_contents (
  product_id,
  content_type,
  title,
  description,
  html_content,
  order_index,
  is_active
) VALUES (
  'your-product-id',
  'html_orientation',
  'Important Instructions',
  'Please read before continuing',
  '<h3>Before You Continue...</h3><p>Make sure you complete the previous exercises before moving forward.</p><ul><li>Find a quiet space</li><li>Use headphones</li><li>Take notes</li></ul>',
  2, -- This will place it between item 1 and 3
  true
);
```

### 2. Content Structure

The `Content` interface now supports:

```typescript
interface Content {
  id: string
  content_type: 'video' | 'audio' | 'pdf' | 'text' | 'image' | 'html_orientation'
  title: string
  description: string | null
  content_url: string | null
  thumbnail_url: string | null
  file_size: number | null
  duration: number | null
  order_index: number
  html_content?: string // HTML content for orientation items
}
```

### 3. Supported HTML Elements

The `.html-content` CSS class provides styling for:

- **Headings**: `<h1>` through `<h6>`
- **Paragraphs**: `<p>`
- **Lists**: `<ul>`, `<ol>`, `<li>`
- **Links**: `<a href="">`
- **Emphasis**: `<strong>`, `<em>`
- **Code**: `<code>`, `<pre>`
- **Quotes**: `<blockquote>`
- **Dividers**: `<hr>`

## Examples

### Example 1: Simple Instruction

```javascript
{
  id: 'orient-1',
  content_type: 'html_orientation',
  title: 'Prepare Your Space',
  description: 'Setup instructions',
  html_content: `
    <p>Before starting this session, please:</p>
    <ul>
      <li>Find a quiet, comfortable space</li>
      <li>Ensure you won't be interrupted for 30 minutes</li>
      <li>Have water nearby</li>
    </ul>
  `,
  order_index: 1
}
```

### Example 2: Progress Checkpoint

```javascript
{
  id: 'orient-2',
  content_type: 'html_orientation',
  title: 'Checkpoint - Day 3',
  description: 'Reflect on your progress',
  html_content: `
    <h3>Great Progress!</h3>
    <p>You've completed <strong>3 days</strong> of the program. Take a moment to reflect:</p>
    <ul>
      <li>What changes have you noticed?</li>
      <li>Are you practicing daily?</li>
      <li>Do you need to adjust your schedule?</li>
    </ul>
    <p><em>Remember: Consistency is more important than perfection.</em></p>
  `,
  order_index: 4
}
```

### Example 3: Important Warning

```javascript
{
  id: 'orient-3',
  content_type: 'html_orientation',
  title: '⚠️ Important Notice',
  description: 'Please read carefully',
  html_content: `
    <h3>Before Deep Relaxation Session</h3>
    <p><strong>Do NOT listen to this audio while:</strong></p>
    <ul>
      <li>Driving or operating machinery</li>
      <li>Performing tasks requiring full attention</li>
      <li>In a public or unsafe environment</li>
    </ul>
    <blockquote>
      This session is designed for deep relaxation.
      Find a safe, comfortable place where you can fully let go.
    </blockquote>
  `,
  order_index: 6
}
```

### Example 4: Exercise Instructions

```javascript
{
  id: 'orient-4',
  content_type: 'html_orientation',
  title: 'Journal Exercise',
  description: 'Homework for this section',
  html_content: `
    <h3>Reflection Exercise</h3>
    <p>After completing this module, spend 10 minutes journaling about:</p>
    <ol>
      <li>What emotions came up during the session?</li>
      <li>What insights or realizations did you have?</li>
      <li>How can you apply this to your daily life?</li>
    </ol>
    <hr>
    <p><em>There are no right or wrong answers. This is for your personal growth.</em></p>
  `,
  order_index: 8
}
```

### Example 5: With Code/Technical Content

```javascript
{
  id: 'orient-5',
  content_type: 'html_orientation',
  title: 'Breathing Technique',
  description: 'Practice this pattern',
  html_content: `
    <h3>4-7-8 Breathing Pattern</h3>
    <p>Use this technique before each session:</p>
    <pre><code>Inhale for 4 seconds
Hold for 7 seconds
Exhale for 8 seconds
Repeat 4 times</code></pre>
    <p>This activates your parasympathetic nervous system, preparing you for deep work.</p>
  `,
  order_index: 2
}
```

## Using the Component Directly

You can also use the `HTMLContentItem` component directly in any React component:

```tsx
import HTMLContentItem from '@/components/HTMLContentItem'

function MyComponent() {
  return (
    <HTMLContentItem
      htmlContent="<p>Your HTML content here</p>"
      title="Custom Title"
      showNumber={true}
      itemNumber={5}
      icon={
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="..." />
        </svg>
      }
      className="my-4"
    />
  )
}
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlContent` | `string` | Required | HTML content to render |
| `title` | `string` | `'Orientação'` | Title displayed above content |
| `icon` | `ReactNode` | `undefined` | Custom icon to display |
| `showNumber` | `boolean` | `false` | Show numbered badge |
| `itemNumber` | `number` | `undefined` | Number to display in badge |
| `className` | `string` | `''` | Additional CSS classes |

## Positioning in Course Flow

Use the `order_index` field to control where orientation items appear:

```
order_index: 1  → Aula 1: Bem-vindo
order_index: 2  → [HTML Orientation: "Prepare Your Space"]
order_index: 3  → Track01 - El Despertar Energético
order_index: 4  → Track02 - SOS Ansiedad
order_index: 5  → [HTML Orientation: "Checkpoint - Day 3"]
order_index: 6  → Track03 - Dormir Profundo
```

## Best Practices

1. **Keep it concise**: Orientations should be quick reads, not full articles
2. **Use clear headings**: Help users scan content quickly
3. **Add visual hierarchy**: Use lists, bold text, and spacing
4. **Be specific**: Give actionable instructions, not vague suggestions
5. **Test responsiveness**: Content should work on mobile and desktop
6. **Sanitize HTML**: If accepting user input, sanitize to prevent XSS

## Security Note

The component uses `dangerouslySetInnerHTML`. Only use trusted HTML content. If you need to accept user-generated HTML, implement proper sanitization:

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

```tsx
import DOMPurify from 'dompurify'

const sanitizedHTML = DOMPurify.sanitize(userProvidedHTML)
```

## Files Modified

- [components/HTMLContentItem.tsx](../components/HTMLContentItem.tsx) - New component
- [components/ContentList.tsx](../components/ContentList.tsx) - Updated to render HTML items
- [app/globals.css](../app/globals.css) - Added `.html-content` styles

## Troubleshooting

**Q: HTML content not displaying?**
- Check that `content_type` is exactly `'html_orientation'`
- Verify `html_content` field contains valid HTML
- Check browser console for errors

**Q: Styling looks different from course items?**
- Ensure you're using the latest `globals.css` with `.html-content` styles
- Check that the component has proper Tailwind classes

**Q: Content not appearing in correct order?**
- Verify `order_index` values in your database
- Lower numbers appear first
- Check that `is_active` is `true`

## Support

For questions or issues, please refer to the main project documentation or open an issue.
