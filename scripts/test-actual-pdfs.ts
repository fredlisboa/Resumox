/**
 * Test actual PDFs from database
 * This will attempt to fetch the exact files to verify they exist in R2
 */

import { getFileFromR2 } from '../lib/r2'

console.log('🧪 Testing Actual Database PDFs\n')
console.log('='.repeat(80))

const testUrls = [
  {
    name: 'Working PDF (lt-neuroreset)',
    url: 'r2://pdfs/B02-default-Gratitud-Expressv2.pdf',
    shouldWork: true
  },
  {
    name: 'Failing PDF (kit-inteligencia-emocional)',
    url: 'r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf',
    shouldWork: true
  }
]

async function testPdf(name: string, url: string, shouldWork: boolean) {
  console.log(`\n📄 Testing: ${name}`)
  console.log(`   URL: ${url}`)

  try {
    const startTime = Date.now()
    const fileBuffer = await getFileFromR2(url)
    const duration = Date.now() - startTime

    console.log(`   ✅ SUCCESS!`)
    console.log(`   Size: ${fileBuffer.length} bytes (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)`)
    console.log(`   Duration: ${duration}ms`)

    return true
  } catch (error: any) {
    console.log(`   ❌ FAILED!`)
    console.log(`   Error: ${error.message}`)
    console.log(`   Error name: ${error.name}`)
    console.log(`   Error code: ${error.Code || error.$metadata?.httpStatusCode || 'N/A'}`)

    if (error.Code === 'NoSuchKey') {
      console.log(`   📌 File does not exist in bucket`)
    } else if (error.Code === 'NoSuchBucket') {
      console.log(`   📌 Bucket does not exist`)
    } else if (error.Code === 'AccessDenied') {
      console.log(`   📌 Access denied - check API token permissions`)
    }

    return false
  }
}

async function runTests() {
  console.log('\nRunning tests...\n')

  let passed = 0
  let failed = 0

  for (const test of testUrls) {
    const result = await testPdf(test.name, test.url, test.shouldWork)
    if (result) {
      passed++
    } else {
      failed++
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n📊 Results:')
  console.log(`   ✅ Passed: ${passed}`)
  console.log(`   ❌ Failed: ${failed}`)

  if (failed === 0) {
    console.log('\n🎉 All tests passed! R2 is working correctly.')
    console.log('   If production still fails, the issue is in the deployment or caching.')
  } else {
    console.log('\n⚠️  Some tests failed!')
    console.log('   Check the error messages above for details.')
    console.log('   Common issues:')
    console.log('   1. File does not exist in R2 bucket')
    console.log('   2. Bucket name is incorrect')
    console.log('   3. API token lacks permissions')
    console.log('   4. Filename has different capitalization')
  }

  console.log('\n' + '='.repeat(80))

  process.exit(failed === 0 ? 0 : 1)
}

runTests().catch((error) => {
  console.error('\n💥 Unexpected error:', error)
  process.exit(1)
})
