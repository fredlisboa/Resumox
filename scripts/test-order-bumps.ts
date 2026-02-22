#!/usr/bin/env tsx
/**
 * Order Bumps Integration Test Script
 *
 * This script simulates a complete purchase flow with order bumps:
 * 1. Main product purchase (PRINCIPAL01)
 * 2. Order bump 1 purchase (ORDERBUMP01)
 * 3. Order bump 2 purchase (ORDERBUMP02)
 * 4. Verify all products are registered correctly
 *
 * Usage:
 *   npm run test:order-bumps
 */

import './load-env'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET || 'wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780'
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhook/hotmart'
const TEST_EMAIL = 'orderbump-test@example.com'

// Generate HMAC-SHA256 signature
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

// Create webhook payload for main product
function createMainProductPayload(email: string, transactionId: string) {
  return {
    event: 'PURCHASE_APPROVED',
    version: '2.0.0',
    data: {
      product: {
        id: 'PRINCIPAL01',
        name: 'Produto Principal - Curso Completo'
      },
      buyer: {
        email: email,
        name: 'Cliente Teste Order Bumps'
      },
      purchase: {
        transaction: transactionId,
        status: 'approved',
        order_date: Date.now(),
        approved_date: Date.now(),
        subscription: {
          subscriber_code: `SUB-MAIN-${Date.now()}`,
          status: 'active'
        }
      }
      // No order_bump field for main product
    }
  }
}

// Create webhook payload for order bump
function createOrderBumpPayload(
  email: string,
  transactionId: string,
  parentTransactionId: string,
  bumpNumber: number
) {
  return {
    event: 'PURCHASE_APPROVED',
    version: '2.0.0',
    data: {
      product: {
        id: `ORDERBUMP0${bumpNumber}`,
        name: `Order Bump #${bumpNumber} - Bônus Exclusivo`
      },
      buyer: {
        email: email,
        name: 'Cliente Teste Order Bumps'
      },
      purchase: {
        transaction: transactionId,
        status: 'approved',
        order_date: Date.now(),
        approved_date: Date.now()
      },
      order_bump: {
        is_order_bump: true,
        parent_purchase_transaction: parentTransactionId
      }
    }
  }
}

// Send webhook request
async function sendWebhook(payload: any, description: string) {
  const payloadString = JSON.stringify(payload)
  const signature = generateSignature(payloadString, WEBHOOK_SECRET)

  console.log(`\n${'='.repeat(80)}`)
  console.log(`${description}`)
  console.log(`${'='.repeat(80)}`)
  console.log(`Email: ${payload.data.buyer.email}`)
  console.log(`Product: ${payload.data.product.id} - ${payload.data.product.name}`)
  console.log(`Transaction: ${payload.data.purchase.transaction}`)
  if (payload.data.order_bump?.is_order_bump) {
    console.log(`Is Order Bump: YES`)
    console.log(`Parent Transaction: ${payload.data.order_bump.parent_purchase_transaction}`)
  } else {
    console.log(`Is Order Bump: NO (Main Product)`)
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hotmart-hottok': signature,
        'User-Agent': 'Hotmart-OrderBump-Test/1.0'
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
      console.log(`✅ SUCCESS: ${description}`)
      return { success: true, status: response.status, data: responseData }
    } else {
      console.log(`❌ FAILED: ${description}`)
      return { success: false, status: response.status, data: responseData }
    }

  } catch (error) {
    console.error(`❌ ERROR: Failed to send webhook`)
    console.error(error)
    return { success: false, error }
  }
}

async function runOrderBumpsTest() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                   HOTMART ORDER BUMPS INTEGRATION TEST                    ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `)

  console.log(`Configuration:`)
  console.log(`  Webhook Secret: ${WEBHOOK_SECRET.substring(0, 10)}...`)
  console.log(`  Webhook URL: ${WEBHOOK_URL}`)
  console.log(`  Test Email: ${TEST_EMAIL}`)

  console.log(`\n📝 Test Scenario:`)
  console.log(`  1. Customer purchases main product (PRINCIPAL01)`)
  console.log(`  2. Customer adds Order Bump #1 (ORDERBUMP01)`)
  console.log(`  3. Customer adds Order Bump #2 (ORDERBUMP02)`)
  console.log(`  4. Hotmart sends 3 separate webhooks`)
  console.log(`  5. System should register all 3 products individually`)

  const results: any[] = []

  // Generate unique transaction IDs
  const timestamp = Date.now()
  const mainTransactionId = `HP-MAIN-${timestamp}`
  const bump1TransactionId = `HP-BUMP1-${timestamp}`
  const bump2TransactionId = `HP-BUMP2-${timestamp}`

  // Test 1: Main Product Purchase
  console.log(`\n\n[Test 1/3] Processing main product purchase...`)
  await new Promise(resolve => setTimeout(resolve, 1000))

  const mainPayload = createMainProductPayload(TEST_EMAIL, mainTransactionId)
  const test1 = await sendWebhook(mainPayload, 'Main Product Purchase (PRINCIPAL01)')
  results.push({ test: 'Main Product', ...test1 })

  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test 2: Order Bump 1
  console.log(`\n\n[Test 2/3] Processing Order Bump #1...`)
  const bump1Payload = createOrderBumpPayload(
    TEST_EMAIL,
    bump1TransactionId,
    mainTransactionId,
    1
  )
  const test2 = await sendWebhook(bump1Payload, 'Order Bump #1 (ORDERBUMP01)')
  results.push({ test: 'Order Bump 1', ...test2 })

  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test 3: Order Bump 2
  console.log(`\n\n[Test 3/3] Processing Order Bump #2...`)
  const bump2Payload = createOrderBumpPayload(
    TEST_EMAIL,
    bump2TransactionId,
    mainTransactionId,
    2
  )
  const test3 = await sendWebhook(bump2Payload, 'Order Bump #2 (ORDERBUMP02)')
  results.push({ test: 'Order Bump 2', ...test3 })

  // Wait a bit for database to process
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Summary
  console.log(`\n\n${'='.repeat(80)}`)
  console.log(`TEST SUMMARY`)
  console.log(`${'='.repeat(80)}`)

  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  results.forEach((result) => {
    const icon = result.success ? '✅' : '❌'
    console.log(`${icon} ${result.test} - Status: ${result.status || 'ERROR'}`)
  })

  console.log(`\nTotal Tests: ${results.length}`)
  console.log(`Successful: ${successful}`)
  console.log(`Failed: ${failed}`)
  console.log(`Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`)

  console.log(`\n📊 Expected Database State:`)
  console.log(`  users_access table:`)
  console.log(`    - 1 user with email: ${TEST_EMAIL}`)
  console.log(`    - product_id: PRINCIPAL01 (main product)`)
  console.log(`  `)
  console.log(`  user_products table:`)
  console.log(`    - 3 records for user ${TEST_EMAIL}:`)
  console.log(`      1. PRINCIPAL01 (is_order_bump: false)`)
  console.log(`      2. ORDERBUMP01 (is_order_bump: true, parent: ${mainTransactionId})`)
  console.log(`      3. ORDERBUMP02 (is_order_bump: true, parent: ${mainTransactionId})`)

  console.log(`\n🔍 To verify, check:`)
  console.log(`  1. Supabase Dashboard > user_products table`)
  console.log(`  2. Query: SELECT * FROM user_products WHERE user_id IN (`)
  console.log(`            SELECT id FROM users_access WHERE email = '${TEST_EMAIL}'`)
  console.log(`          ) ORDER BY is_order_bump, product_id`)

  if (failed > 0) {
    console.log(`\n⚠️  Some tests failed. Check the logs above for details.`)
    process.exit(1)
  } else {
    console.log(`\n🎉 All tests passed successfully!`)
    console.log(`\n✨ Next steps:`)
    console.log(`  1. Check user_products table in Supabase`)
    console.log(`  2. Test the /api/user/products endpoint`)
    console.log(`  3. Verify access control with checkUserProductAccess()`)
    process.exit(0)
  }
}

// Run tests
runOrderBumpsTest()
