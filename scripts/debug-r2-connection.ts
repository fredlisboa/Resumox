/**
 * R2 Connection Debug Script
 * Run: npx tsx scripts/debug-r2-connection.ts
 */

import { isR2Configured, parseR2Url, getFileFromR2 } from '../lib/r2'

console.log('🔍 R2 Connection Debugger\n')
console.log('=' .repeat(60))

// Step 1: Check environment variables
console.log('\n📝 Step 1: Checking Environment Variables')
console.log('-'.repeat(60))

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'lt-neuroreset'

console.log(`R2_ACCOUNT_ID:        ${R2_ACCOUNT_ID ? '✅ SET (' + R2_ACCOUNT_ID.substring(0, 8) + '...)' : '❌ NOT SET'}`)
console.log(`R2_ACCESS_KEY_ID:     ${R2_ACCESS_KEY_ID ? '✅ SET (' + R2_ACCESS_KEY_ID.substring(0, 8) + '...)' : '❌ NOT SET'}`)
console.log(`R2_SECRET_ACCESS_KEY: ${R2_SECRET_ACCESS_KEY ? '✅ SET (' + '*'.repeat(16) + '...)' : '❌ NOT SET'}`)
console.log(`R2_BUCKET_NAME:       ${R2_BUCKET_NAME ? '✅ SET (' + R2_BUCKET_NAME + ')' : '❌ NOT SET (using default)'}`)

const configured = isR2Configured()
console.log(`\nR2 Configured: ${configured ? '✅ YES' : '❌ NO'}`)

if (!configured) {
  console.log('\n❌ R2 is not configured!')
  console.log('Please set the following environment variables:')
  console.log('  - R2_ACCOUNT_ID')
  console.log('  - R2_ACCESS_KEY_ID')
  console.log('  - R2_SECRET_ACCESS_KEY')
  console.log('  - R2_BUCKET_NAME (optional, defaults to lt-neuroreset)')
  process.exit(1)
}

// Step 2: Test URL parsing
console.log('\n📝 Step 2: Testing URL Parsing')
console.log('-'.repeat(60))

const testUrls = [
  'r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf',
  'r2://pdfs/P01 NeuroReset-Guia-de-Inicio-Rapido-and-Manual-de-Usuario_v3.pdf',
  'r2://lt-neuroreset/pdfs/test.pdf',
]

for (const url of testUrls) {
  const parsed = parseR2Url(url)
  console.log(`\nURL: ${url}`)
  console.log(`  Bucket: ${parsed.bucket}`)
  console.log(`  Key:    ${parsed.key}`)
}

// Step 3: Test R2 connection
console.log('\n📝 Step 3: Testing R2 Connection')
console.log('-'.repeat(60))

async function testR2Connection() {
  // Test with a known file (you'll need to adjust this to a file that exists)
  const testUrl = 'r2://pdfs/P01 NeuroReset-Guia-de-Inicio-Rapido-and-Manual-de-Usuario_v3.pdf'

  console.log(`\nAttempting to fetch: ${testUrl}`)

  try {
    const parsed = parseR2Url(testUrl)
    console.log(`  Bucket: ${parsed.bucket}`)
    console.log(`  Key:    ${parsed.key}`)
    console.log(`  Attempting connection...`)

    const fileBuffer = await getFileFromR2(testUrl)
    console.log(`✅ SUCCESS! File loaded: ${fileBuffer.length} bytes`)
    return true
  } catch (error: any) {
    console.log(`❌ FAILED!`)
    console.log(`  Error: ${error.message}`)
    console.log(`  Full error:`, error)
    return false
  }
}

// Run the test
testR2Connection()
  .then((success) => {
    console.log('\n' + '='.repeat(60))
    if (success) {
      console.log('✅ R2 connection is working!')
      process.exit(0)
    } else {
      console.log('❌ R2 connection failed!')
      console.log('\nCommon issues:')
      console.log('  1. Incorrect credentials')
      console.log('  2. Bucket does not exist')
      console.log('  3. File does not exist in bucket')
      console.log('  4. API token does not have permissions')
      console.log('  5. Account ID is incorrect')
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error)
    process.exit(1)
  })
