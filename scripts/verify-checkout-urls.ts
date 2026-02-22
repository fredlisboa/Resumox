/**
 * Script to verify that all order bump checkout URLs are correctly configured
 */

import { ORDER_BUMP_CHECKOUT_URLS, DEFAULT_ORDER_BUMP_CHECKOUT_URL } from '../lib/product-config'

console.log('\n✅ Verifying Order Bump Checkout URL Configuration\n')
console.log('=' .repeat(70))

// Order bump product IDs from database
const orderBumps = [
  { id: '6846443', title: 'Protocolo de Descompresión Somática' },
  { id: '6557903', title: 'Preguntas Poderosas para el Desarrollo Socioemocional' },
  { id: '6558403', title: 'Ferramentas de Regulação Emocional' },
  { id: '6558441', title: 'NeuroAfetividad Infantil' },
  { id: '6558460', title: 'Metáforas Emocionales' },
  { id: '6558478', title: 'Coloreando Emociones' }
]

console.log('\n📋 Configuration Status:\n')

let allConfigured = true
let usingFallback = 0

orderBumps.forEach((bump, index) => {
  const checkoutUrl = ORDER_BUMP_CHECKOUT_URLS[bump.id] || DEFAULT_ORDER_BUMP_CHECKOUT_URL
  const isConfigured = ORDER_BUMP_CHECKOUT_URLS.hasOwnProperty(bump.id)
  const isFallback = checkoutUrl === DEFAULT_ORDER_BUMP_CHECKOUT_URL

  if (!isConfigured) {
    allConfigured = false
  }

  if (isFallback) {
    usingFallback++
  }

  const status = isConfigured
    ? isFallback
      ? '⚠️  USING FALLBACK'
      : '✅ CONFIGURED'
    : '❌ MISSING'

  console.log(`${index + 1}. ${status}`)
  console.log(`   Product ID: ${bump.id}`)
  console.log(`   Title: ${bump.title}`)
  console.log(`   Checkout URL: ${checkoutUrl}`)
  console.log('')
})

console.log('=' .repeat(70))
console.log('\n📊 Summary:\n')
console.log(`Total Order Bumps: ${orderBumps.length}`)
console.log(`Configured: ${Object.keys(ORDER_BUMP_CHECKOUT_URLS).length}`)
console.log(`Using Fallback: ${usingFallback}`)
console.log(`Missing Configuration: ${orderBumps.length - Object.keys(ORDER_BUMP_CHECKOUT_URLS).length}`)

if (allConfigured && usingFallback === 0) {
  console.log('\n✅ All order bumps have unique checkout URLs configured!\n')
} else if (allConfigured && usingFallback > 0) {
  console.log(`\n⚠️  ${usingFallback} order bump(s) are using the fallback URL.\n`)
  console.log('   Please update lib/product-config.ts with the correct Hotmart checkout URLs.\n')
} else {
  console.log('\n❌ Some order bumps are missing checkout URL configuration!\n')
  console.log('   Please add them to ORDER_BUMP_CHECKOUT_URLS in lib/product-config.ts\n')
}

console.log('=' .repeat(70) + '\n')
