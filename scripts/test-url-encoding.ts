/**
 * Test URL encoding/decoding flow for R2 PDFs
 */

// Simulate the flow from database → ContentList → PDF Viewer → API

console.log('🔍 URL Encoding Test\n')
console.log('='.repeat(80))

// Step 1: Database URL
const databaseUrl = 'r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf'
console.log('\n1️⃣  Database URL:')
console.log('   ', databaseUrl)

// Step 2: ContentList encodes for query param
const queryParamEncoded = encodeURIComponent(databaseUrl)
console.log('\n2️⃣  ContentList.tsx encodes for URL query:')
console.log('    encodeURIComponent(databaseUrl)')
console.log('   ', `/pdf-viewer?url=${queryParamEncoded}`)

// Step 3: PDF Viewer page receives it (Next.js decodes automatically)
const pdfViewerReceives = databaseUrl // searchParams.get('url') decodes automatically
console.log('\n3️⃣  pdf-viewer/page.tsx receives (searchParams auto-decodes):')
console.log('   ', pdfViewerReceives)

// Step 4: FullScreenPDFViewer strips r2:// and encodes
const strippedUrl = pdfViewerReceives.replace('r2://', '')
const encodedKey = encodeURIComponent(strippedUrl)
console.log('\n4️⃣  FullScreenPDFViewer.tsx strips r2:// and encodes:')
console.log('    url.replace("r2://", "")')
console.log('   ', strippedUrl)
console.log('    encodeURIComponent(stripped)')
console.log('   ', encodedKey)
console.log('    API URL:')
console.log('   ', `/api/r2-content?key=${encodedKey}`)

// Step 5: API receives and decodes
const apiReceivesKey = strippedUrl // query param automatically decoded
console.log('\n5️⃣  API receives (query param auto-decoded):')
console.log('   ', apiReceivesKey)

// Step 6: API explicitly decodes (NEW FIX)
const apiDecodedKey = decodeURIComponent(apiReceivesKey)
console.log('\n6️⃣  API decodes explicitly (decodeURIComponent):')
console.log('   ', apiDecodedKey)

console.log('\n' + '='.repeat(80))
console.log('\n✅ Final result:')
console.log('   Database:    ', databaseUrl)
console.log('   API searches:', apiDecodedKey)
console.log('   Match?       ', databaseUrl === `r2://${apiDecodedKey}` ? '✅ YES' : '❌ NO')

console.log('\n' + '='.repeat(80))

// Test the parseR2Url function
console.log('\n🔧 Testing parseR2Url function:\n')

function parseR2Url(url: string): { bucket: string; key: string } {
  const path = url.replace('r2://', '')
  const parts = path.split('/')
  const knownFolders = ['pdfs', 'audios', 'videos', 'images', 'thumbnails']

  if (parts.length > 1 && !parts[0].includes('.') && !knownFolders.includes(parts[0].toLowerCase())) {
    const bucket = parts[0]
    const key = parts.slice(1).join('/')
    return { bucket, key }
  }

  return { bucket: 'lt-neuroreset', key: path }
}

const finalKey = apiDecodedKey.startsWith('r2://') ? apiDecodedKey : apiDecodedKey
const parsed = parseR2Url(`r2://${finalKey}`)

console.log('   Input:', `r2://${finalKey}`)
console.log('   Parsed bucket:', parsed.bucket)
console.log('   Parsed key:   ', parsed.key)
console.log('   ✅ This is what R2 will search for!')

console.log('\n' + '='.repeat(80))
