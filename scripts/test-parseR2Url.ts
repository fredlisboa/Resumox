/**
 * Test script for parseR2Url function
 * Tests bucket detection logic with various URL formats
 */

import { parseR2Url } from '../lib/r2'

interface TestCase {
  name: string
  url: string
  expected: { bucket: string; key: string }
}

const testCases: TestCase[] = [
  {
    name: 'Kit IE with explicit bucket',
    url: 'r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf',
    expected: {
      bucket: 'kit-inteligencia-emocional',
      key: 'pdfs/99 NeuroInteligencia Emocional.pdf'
    }
  },
  {
    name: 'Legacy format (pdfs folder)',
    url: 'r2://pdfs/P01 NeuroReset-Guia-de-Inicio-Rapido-and-Manual-de-Usuario_v3.pdf',
    expected: {
      bucket: 'lt-neuroreset',
      key: 'pdfs/P01 NeuroReset-Guia-de-Inicio-Rapido-and-Manual-de-Usuario_v3.pdf'
    }
  },
  {
    name: 'Explicit lt-neuroreset bucket',
    url: 'r2://lt-neuroreset/pdfs/test.pdf',
    expected: {
      bucket: 'lt-neuroreset',
      key: 'pdfs/test.pdf'
    }
  },
  {
    name: 'Legacy audios folder',
    url: 'r2://audios/track.mp3',
    expected: {
      bucket: 'lt-neuroreset',
      key: 'audios/track.mp3'
    }
  },
  {
    name: 'Legacy videos folder',
    url: 'r2://videos/intro.mp4',
    expected: {
      bucket: 'lt-neuroreset',
      key: 'videos/intro.mp4'
    }
  },
  {
    name: 'Order Bump with explicit bucket',
    url: 'r2://kit-inteligencia-emocional/pdfs/OB1 Preguntas Poderosas para el Desarrollo Socioemocional.pdf',
    expected: {
      bucket: 'kit-inteligencia-emocional',
      key: 'pdfs/OB1 Preguntas Poderosas para el Desarrollo Socioemocional.pdf'
    }
  },
  {
    name: 'File with spaces in bucket path',
    url: 'r2://kit-inteligencia-emocional/pdfs/R1 Rueda de las Emociones_v2.pdf',
    expected: {
      bucket: 'kit-inteligencia-emocional',
      key: 'pdfs/R1 Rueda de las Emociones_v2.pdf'
    }
  }
]

console.log('🧪 Testing parseR2Url function...\n')

let passed = 0
let failed = 0

for (const test of testCases) {
  const result = parseR2Url(test.url)
  const isCorrect = result.bucket === test.expected.bucket && result.key === test.expected.key

  if (isCorrect) {
    console.log(`✅ PASS: ${test.name}`)
    console.log(`   URL: ${test.url}`)
    console.log(`   Bucket: ${result.bucket}`)
    console.log(`   Key: ${result.key}`)
    passed++
  } else {
    console.log(`❌ FAIL: ${test.name}`)
    console.log(`   URL: ${test.url}`)
    console.log(`   Expected: bucket=${test.expected.bucket}, key=${test.expected.key}`)
    console.log(`   Got:      bucket=${result.bucket}, key=${result.key}`)
    failed++
  }
  console.log('')
}

console.log('─'.repeat(50))
console.log(`📊 Results: ${passed} passed, ${failed} failed`)

if (failed === 0) {
  console.log('✅ All tests passed!')
  process.exit(0)
} else {
  console.log('❌ Some tests failed')
  process.exit(1)
}
