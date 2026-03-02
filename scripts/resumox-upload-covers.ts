#!/usr/bin/env tsx
/**
 * ResumoX — Download book covers and upload to R2
 *
 * Uses Google Books API (primary) and Open Library (fallback) to find
 * high-quality book cover images, downloads them, and uploads to
 * Cloudflare R2 under resumox/imgs/<slug>.jpg
 *
 * Usage:
 *   npx tsx scripts/resumox-upload-covers.ts
 *   npx tsx scripts/resumox-upload-covers.ts --slug "pai-rico-pai-pobre"
 *   npx tsx scripts/resumox-upload-covers.ts --dry-run
 *   npx tsx scripts/resumox-upload-covers.ts --force
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') })

// ── Args ──
const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const FORCE = args.includes('--force')
const slugIdx = args.indexOf('--slug')
const SINGLE_SLUG = slugIdx >= 0 ? args[slugIdx + 1] : null

// ── Supabase ──
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── R2 ──
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})
const R2_BUCKET = process.env.R2_BUCKET_NAME || 'lt-neuroreset'

// ── Helpers ──

async function searchGoogleBooks(title: string, author: string): Promise<string | null> {
  const firstAuthor = author.split(/[,&]/)[0].trim()
  const query = encodeURIComponent(`${title} ${firstAuthor}`)
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3&printType=books`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.items?.length) return null

    for (const item of data.items) {
      const links = item.volumeInfo?.imageLinks
      if (links) {
        // Prefer extraLarge > large > medium > small > thumbnail
        const imgUrl = links.extraLarge || links.large || links.medium || links.small || links.thumbnail
        if (imgUrl) {
          // Google Books returns HTTP urls and small sizes by default
          // Replace zoom=1 with zoom=2 for higher res, and use HTTPS
          return imgUrl
            .replace('http://', 'https://')
            .replace('&zoom=1', '&zoom=2')
            .replace('zoom=1', 'zoom=2')
            .replace('&edge=curl', '') // remove curl effect
        }
      }
    }
  } catch (e) {
    console.error(`  Google Books API error: ${(e as Error).message}`)
  }
  return null
}

async function searchOpenLibrary(title: string, author: string): Promise<string | null> {
  const firstAuthor = author.split(/[,&]/)[0].trim()
  const query = encodeURIComponent(`${title} ${firstAuthor}`)
  const url = `https://openlibrary.org/search.json?q=${query}&limit=3&fields=key,cover_i,title,author_name`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.docs?.length) return null

    for (const doc of data.docs) {
      if (doc.cover_i) {
        // Open Library cover API — L = large (600px wide)
        return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      }
    }
  } catch (e) {
    console.error(`  Open Library API error: ${(e as Error).message}`)
  }
  return null
}

function isGoogleBooksPlaceholder(buf: Buffer): boolean {
  // The Google Books "image not available" placeholder is a grayscale PNG ~8.9-9.2 KB
  const isPng = buf[0] === 0x89 && buf[1] === 0x50
  if (isPng && buf.length > 8000 && buf.length < 10000) {
    // PNG color type at byte 25: 0 = grayscale
    if (buf.length > 25 && buf[25] === 0) {
      return true
    }
  }
  return false
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ResumoX-CoverFetcher/1.0' },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const arrayBuf = await res.arrayBuffer()
    const buf = Buffer.from(arrayBuf)
    // Skip tiny placeholder images (< 5KB is likely a placeholder)
    if (buf.length < 5000) {
      console.log(`  Image too small (${buf.length} bytes), skipping`)
      return null
    }
    if (isGoogleBooksPlaceholder(buf)) {
      console.log(`  Detected Google Books "image not available" placeholder, skipping`)
      return null
    }
    return buf
  } catch (e) {
    console.error(`  Download error: ${(e as Error).message}`)
    return null
  }
}

async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<void> {
  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1 year cache
  }))
}

// ── Main ──

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  ResumoX — Book Cover Upload Pipeline')
  console.log('═══════════════════════════════════════════')
  if (DRY_RUN) console.log('  MODE: Dry run (no uploads)')
  if (FORCE) console.log('  MODE: Force (re-download existing)')
  if (SINGLE_SLUG) console.log(`  FILTER: slug = ${SINGLE_SLUG}`)
  console.log('')

  // Fetch books
  let query = supabase
    .from('resumox_books')
    .select('slug, title, original_title, author, cover_image_r2_key')
    .eq('is_published', true)
    .order('title')

  if (SINGLE_SLUG) {
    query = query.eq('slug', SINGLE_SLUG)
  }

  const { data: books, error } = await query
  if (error) {
    console.error('Failed to fetch books:', error)
    process.exit(1)
  }

  if (!books?.length) {
    console.log('No books found.')
    process.exit(0)
  }

  console.log(`Found ${books.length} book(s) to process\n`)

  let success = 0
  let skipped = 0
  let failed = 0

  for (const book of books) {
    console.log(`📕 ${book.title}`)
    console.log(`   (${book.original_title || 'no original title'}) by ${book.author}`)

    // Skip if already has cover and not forcing
    if (book.cover_image_r2_key && !FORCE) {
      console.log(`   ✓ Already has cover, skipping\n`)
      skipped++
      continue
    }

    // Search for cover image — try original title first, then PT title
    let imageUrl: string | null = null
    const searchTitle = book.original_title || book.title

    console.log(`   Searching Google Books: "${searchTitle}"...`)
    imageUrl = await searchGoogleBooks(searchTitle, book.author)

    if (!imageUrl && book.original_title) {
      console.log(`   Trying PT title on Google Books: "${book.title}"...`)
      imageUrl = await searchGoogleBooks(book.title, book.author)
    }

    if (!imageUrl) {
      console.log(`   Searching Open Library: "${searchTitle}"...`)
      imageUrl = await searchOpenLibrary(searchTitle, book.author)
    }

    if (!imageUrl && book.original_title) {
      console.log(`   Trying PT title on Open Library: "${book.title}"...`)
      imageUrl = await searchOpenLibrary(book.title, book.author)
    }

    if (!imageUrl) {
      console.log(`   ✗ No cover found\n`)
      failed++
      continue
    }

    console.log(`   Found: ${imageUrl.substring(0, 80)}...`)

    if (DRY_RUN) {
      console.log(`   [dry-run] Would download and upload\n`)
      success++
      continue
    }

    // Download image — if Google Books fails, try Open Library fallback
    let imageData = await downloadImage(imageUrl)
    if (!imageData) {
      // Try Open Library as fallback
      let fallbackUrl: string | null = null
      console.log(`   Searching Open Library (fallback): "${searchTitle}"...`)
      fallbackUrl = await searchOpenLibrary(searchTitle, book.author)
      if (!fallbackUrl && book.original_title) {
        console.log(`   Trying PT title on Open Library: "${book.title}"...`)
        fallbackUrl = await searchOpenLibrary(book.title, book.author)
      }
      if (fallbackUrl) {
        console.log(`   Found fallback: ${fallbackUrl.substring(0, 80)}...`)
        imageData = await downloadImage(fallbackUrl)
      }
      if (!imageData) {
        console.log(`   ✗ Failed to download image\n`)
        failed++
        continue
      }
    }

    // Determine content type from first bytes
    const isJpeg = imageData[0] === 0xFF && imageData[1] === 0xD8
    const isPng = imageData[0] === 0x89 && imageData[1] === 0x50
    const ext = isPng ? 'png' : 'jpg'
    const contentType = isPng ? 'image/png' : 'image/jpeg'

    const r2Key = `resumox/imgs/${book.slug}.${ext}`
    const r2Url = `r2://resumox/imgs/${book.slug}.${ext}`

    console.log(`   Uploading to R2: ${r2Key} (${(imageData.length / 1024).toFixed(1)} KB)`)

    try {
      await uploadToR2(r2Key, imageData, contentType)

      // Update database
      const { error: updateError } = await supabase
        .from('resumox_books')
        .update({ cover_image_r2_key: r2Url })
        .eq('slug', book.slug)

      if (updateError) {
        console.log(`   ✗ DB update failed: ${updateError.message}\n`)
        failed++
        continue
      }

      console.log(`   ✓ Done!\n`)
      success++
    } catch (e) {
      console.log(`   ✗ Upload failed: ${(e as Error).message}\n`)
      failed++
    }

    // Rate limit: small delay between requests
    await new Promise(r => setTimeout(r, 300))
  }

  console.log('═══════════════════════════════════════════')
  console.log(`  Results: ${success} OK, ${skipped} skipped, ${failed} failed`)
  console.log('═══════════════════════════════════════════')
}

main().catch(console.error)
