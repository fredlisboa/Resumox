/**
 * Test if product mapping is working correctly
 * Run: npx tsx test-product-mapping.ts
 */

import { isMainProduct, getOrderBumpsForProduct } from './lib/product-order-bumps-map'

const testProductId = '6557472' // Kit Inteligencia Emocional

console.log('\n🧪 Testing Product Mapping\n')
console.log('═'.repeat(60))

console.log(`\nProduct ID: ${testProductId}`)
console.log(`Is Main Product? ${isMainProduct(testProductId)}`)

const orderBumps = getOrderBumpsForProduct(testProductId)
console.log(`\nExpected Order Bumps: ${orderBumps.length}`)

if (orderBumps.length > 0) {
  console.log('\nOrder Bumps:')
  orderBumps.forEach((ob, index) => {
    console.log(`  ${index + 1}. ${ob.product_id} - ${ob.product_name}`)
  })
} else {
  console.log('\n❌ ERROR: No order bumps found for this product!')
  console.log('   Check lib/product-order-bumps-map.ts configuration')
}

console.log('\n' + '═'.repeat(60) + '\n')
