#!/usr/bin/env tsx
/**
 * Test script for Hotmart webhook with Order Bump
 *
 * Simulates a purchase where user buys:
 * - Main product: 6557472
 * - Order bump: 6557473
 *
 * Both products are sent as separate webhooks but with the same checkout session (sck)
 * to simulate them being purchased together.
 *
 * Usage:
 *   npm run test:order-bump
 *   or
 *   tsx scripts/test-order-bump-purchase.ts
 */

import './load-env'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET || 'wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780'
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhook/hotmart'
const TEST_EMAIL = 'hotmartuser@gmail.com'
const MAIN_PRODUCT_ID = '6557472'
// const ORDER_BUMP_PRODUCT_ID = '6557473'

// Generate HMAC-SHA256 signature
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

// Create webhook payload for a product
function createProductPurchasePayload(
  productId: string,
  productName: string,
  email: string,
  checkoutSessionId: string,
  transactionId: string,
  isOrderBump: boolean = false,
  parentTransactionId: string | null = null
) {
  const timestamp = Date.now()

  const payload: any = {
    event: 'PURCHASE_APPROVED',
    version: '2.0.0',
    data: {
      product: {
        id: parseInt(productId, 10),
        name: productName,
        has_co_production: false,
        is_physical_product: false
      },
      buyer: {
        email: email,
        name: 'Hotmart Test User',
        first_name: 'Hotmart',
        last_name: 'User',
        checkout_phone: '+5511999999999'
      },
      purchase: {
        transaction: transactionId,
        status: 'approved',
        order_date: timestamp,
        approved_date: timestamp,
        origin: {
          sck: checkoutSessionId, // Same checkout session for both products
          xcod: `XCOD-${checkoutSessionId}`
        },
        subscription: {
          subscriber_code: `SUB-${transactionId}`,
          status: 'active'
        }
      }
    }
  }

  // Add order bump information if applicable
  if (isOrderBump && parentTransactionId) {
    payload.data.purchase.order_bump = {
      is_order_bump: true,
      parent_purchase_transaction: parentTransactionId
    }
  }

  return payload
}

// Send webhook request
async function sendWebhook(
  productId: string,
  productName: string,
  email: string,
  checkoutSessionId: string,
  transactionId: string,
  isOrderBump: boolean = false,
  parentTransactionId: string | null = null
) {
  const payload = createProductPurchasePayload(
    productId,
    productName,
    email,
    checkoutSessionId,
    transactionId,
    isOrderBump,
    parentTransactionId
  )
  const payloadString = JSON.stringify(payload)
  const signature = generateSignature(payloadString, WEBHOOK_SECRET)

  console.log(`\n${'='.repeat(80)}`)
  console.log(`Testing: ${isOrderBump ? 'ORDER BUMP' : 'MAIN PRODUCT'}`)
  console.log(`${'='.repeat(80)}`)
  console.log(`Product ID: ${productId}`)
  console.log(`Product Name: ${productName}`)
  console.log(`Email: ${email}`)
  console.log(`Transaction: ${transactionId}`)
  console.log(`Checkout Session (sck): ${checkoutSessionId}`)
  console.log(`Is Order Bump: ${isOrderBump}`)
  console.log(`Parent Transaction: ${parentTransactionId || 'N/A'}`)
  console.log(`Signature: ${signature.substring(0, 20)}...`)

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hotmart-hottok': signature,
        'User-Agent': 'Hotmart-Webhook-Test/1.0'
      },
      body: payloadString
    })

    const responseData = await response.text()

    console.log(`\nResponse Status: ${response.status} ${response.statusText}`)

    try {
      const jsonData = JSON.parse(responseData)
      console.log(`Response Body:`, JSON.stringify(jsonData, null, 2))
    } catch {
      console.log(`Response Body:`, responseData)
    }

    if (response.ok) {
      console.log(`✅ SUCCESS: ${productName} processed successfully`)
    } else {
      console.log(`❌ FAILED: ${productName} failed with status ${response.status}`)
    }

    return { success: response.ok, status: response.status, data: responseData }

  } catch (error) {
    console.error(`❌ ERROR: Failed to send webhook`)
    console.error(error)
    return { success: false, error }
  }
}

async function runOrderBumpTest() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║              HOTMART ORDER BUMP PURCHASE TEST                             ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `)

  console.log(`Configuration:`)
  console.log(`  Webhook Secret: ${WEBHOOK_SECRET.substring(0, 10)}...`)
  console.log(`  Webhook URL: ${WEBHOOK_URL}`)
  console.log(`  Test Email: ${TEST_EMAIL}`)
  console.log(`  Main Product: ${MAIN_PRODUCT_ID}`)
  //console.log(`  Order Bump Product: ${ORDER_BUMP_PRODUCT_ID}`)

  const results: any[] = []

  // Generate unique checkout session ID (same for both products)
  const checkoutSessionId = `SCK-${Date.now()}`
  const mainTransactionId = `TX-MAIN-${Date.now()}`
  const bumpTransactionId = `TX-BUMP-${Date.now() + 1}` // Slightly different timestamp

  console.log(`\nGenerated Identifiers:`)
  console.log(`  Checkout Session: ${checkoutSessionId}`)
  console.log(`  Main Transaction: ${mainTransactionId}`)
  console.log(`  Bump Transaction: ${bumpTransactionId}`)

  // Test 1: Send MAIN PRODUCT webhook
  console.log(`\n\n[Test 1/2] Sending MAIN PRODUCT webhook...`)
  const mainProductResult = await sendWebhook(
    MAIN_PRODUCT_ID,
    'Main Product - HuskyApp MVP',
    TEST_EMAIL,
    checkoutSessionId,
    mainTransactionId,
    false, // Not an order bump
    null
  )
  results.push({
    event: `MAIN PRODUCT (${MAIN_PRODUCT_ID})`,
    ...mainProductResult
  })

  // Wait 2 seconds between webhooks to simulate real scenario
  console.log(`\n⏳ Waiting 2 seconds before sending order bump...`)
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test 2: Send ORDER BUMP webhook
/*   console.log(`\n\n[Test 2/2] Sending ORDER BUMP webhook...`)
  const orderBumpResult = await sendWebhook(
    ORDER_BUMP_PRODUCT_ID,
    'Order Bump Product - Advanced Features',
    TEST_EMAIL,
    checkoutSessionId, // Same checkout session
    bumpTransactionId,
    true, // This IS an order bump
    mainTransactionId // Reference to main product transaction
  )
  results.push({
    event: `ORDER BUMP (${ORDER_BUMP_PRODUCT_ID})`,
    ...orderBumpResult
  }) */

  // Summary
  console.log(`\n\n${'='.repeat(80)}`)
  console.log(`TEST SUMMARY`)
  console.log(`${'='.repeat(80)}`)

  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌'
    console.log(`${icon} ${result.event} - Status: ${result.status || 'ERROR'}`)
  })

  console.log(`\nTotal Tests: ${results.length}`)
  console.log(`Successful: ${successful}`)
  console.log(`Failed: ${failed}`)
  console.log(`Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`)

  console.log(`\n📊 Expected Results:`)
  console.log(`  1. User '${TEST_EMAIL}' should be created/updated in users_access table`)
  console.log(`  2. Two entries in user_products table:`)
  console.log(`     - Product ${MAIN_PRODUCT_ID} (is_order_bump: false, parent_transaction_id: null)`)
/*   console.log(`     - Product ${ORDER_BUMP_PRODUCT_ID} (is_order_bump: true, parent_transaction_id: ${mainTransactionId})`) */
  console.log(`  3. Both products should have status: 'active'`)
  console.log(`  4. Both should share the same checkout session ID: ${checkoutSessionId}`)

  console.log(`\n💡 Next Steps:`)
  console.log(`  1. Check database to verify both products were registered`)
  console.log(`  2. Run: npm run check:webhooks -- to see webhook logs`)
  console.log(`  3. Run: npm run check:user-products -- ${TEST_EMAIL} to verify user's products`)

  if (failed > 0) {
    console.log(`\n⚠️  Some tests failed. Check the logs above for details.`)
    process.exit(1)
  } else {
    console.log(`\n🎉 All tests passed successfully!`)
    process.exit(0)
  }
}

// Run the test
runOrderBumpTest()
