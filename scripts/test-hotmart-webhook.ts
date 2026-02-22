#!/usr/bin/env tsx
/**
 * Hotmart Webhook Integration Test Script
 *
 * This script tests all Hotmart webhook events locally or against a deployed endpoint.
 * It generates proper HMAC signatures for authentication.
 *
 * Usage:
 *   npm run test:hotmart              # Test all events
 *   npm run test:hotmart approved     # Test only PURCHASE_APPROVED
 *   npm run test:hotmart refunded     # Test only PURCHASE_REFUNDED
 */

import './load-env'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET || 'wmozIn6FBoaIU9TJEYwpzj27Jz9djc30527780'
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/webhook/hotmart'
const TEST_EMAIL = process.env.TEST_EMAIL || 'teste@example.com'

// Generate HMAC-SHA256 signature
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

// Create webhook payload
function createWebhookPayload(eventType: string, email: string = TEST_EMAIL) {
  const timestamp = Date.now()
  const transactionId = `TEST-${eventType}-${timestamp}`

  return {
    event: eventType,
    version: '2.0.0',
    data: {
      product: {
        id: '12345',
        name: 'Produto de Teste - HuskyApp MVP'
      },
      buyer: {
        email: email,
        name: 'Usuário de Teste'
      },
      purchase: {
        transaction: transactionId,
        status: eventType.includes('APPROVED') ? 'approved' :
                eventType.includes('REFUNDED') ? 'refunded' :
                eventType.includes('CANCELED') ? 'canceled' :
                eventType.includes('CHARGEBACK') ? 'chargeback' : 'pending',
        order_date: timestamp,
        approved_date: eventType.includes('APPROVED') ? timestamp : undefined,
        subscription: {
          subscriber_code: `SUB-${timestamp}`,
          status: eventType.includes('SUBSCRIPTION_CANCELLATION') ? 'cancelled' : 'active'
        }
      }
    }
  }
}

// Send webhook request
async function sendWebhook(eventType: string, email?: string) {
  const payload = createWebhookPayload(eventType, email)
  const payloadString = JSON.stringify(payload)
  const signature = generateSignature(payloadString, WEBHOOK_SECRET)

  console.log(`\n${'='.repeat(80)}`)
  console.log(`Testing Event: ${eventType}`)
  console.log(`${'='.repeat(80)}`)
  console.log(`Email: ${payload.data.buyer.email}`)
  console.log(`Transaction: ${payload.data.purchase.transaction}`)
  console.log(`Signature: ${signature}`)
  console.log(`Webhook URL: ${WEBHOOK_URL}`)

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
    console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()))

    try {
      const jsonData = JSON.parse(responseData)
      console.log(`Response Body:`, JSON.stringify(jsonData, null, 2))
    } catch {
      console.log(`Response Body:`, responseData)
    }

    if (response.ok) {
      console.log(`✅ SUCCESS: ${eventType} event processed successfully`)
    } else {
      console.log(`❌ FAILED: ${eventType} event failed with status ${response.status}`)
    }

    return { success: response.ok, status: response.status, data: responseData }

  } catch (error) {
    console.error(`❌ ERROR: Failed to send webhook`)
    console.error(error)
    return { success: false, error }
  }
}

// Test scenarios
const TEST_SCENARIOS = {
  approved: 'PURCHASE_APPROVED',
  complete: 'PURCHASE_COMPLETE',
  refunded: 'PURCHASE_REFUNDED',
  canceled: 'PURCHASE_CANCELED',
  delayed: 'PURCHASE_DELAYED',
  chargeback: 'PURCHASE_CHARGEBACK',
  subscription_cancel: 'SUBSCRIPTION_CANCELLATION'
}

async function runTests(specificTest?: string) {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                   HOTMART WEBHOOK INTEGRATION TEST                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `)

  console.log(`Configuration:`)
  console.log(`  Webhook Secret: ${WEBHOOK_SECRET.substring(0, 10)}...`)
  console.log(`  Webhook URL: ${WEBHOOK_URL}`)
  console.log(`  Test Email: ${TEST_EMAIL}`)

  const results: any[] = []

  if (specificTest && TEST_SCENARIOS[specificTest as keyof typeof TEST_SCENARIOS]) {
    // Run specific test
    const eventType = TEST_SCENARIOS[specificTest as keyof typeof TEST_SCENARIOS]
    const result = await sendWebhook(eventType)
    results.push({ event: eventType, ...result })
  } else {
    // Run full test suite
    console.log(`\nRunning full test suite...`)

    // Test 1: PURCHASE_APPROVED (create new user)
    console.log(`\n\n[Test 1/7] Creating new purchase...`)
    const test1 = await sendWebhook('PURCHASE_APPROVED', 'user1@test.com')
    results.push({ event: 'PURCHASE_APPROVED (new user)', ...test1 })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 2: PURCHASE_COMPLETE (same user - should update)
    console.log(`\n\n[Test 2/7] Complete purchase for existing user...`)
    const test2 = await sendWebhook('PURCHASE_COMPLETE', 'user1@test.com')
    results.push({ event: 'PURCHASE_COMPLETE (existing user)', ...test2 })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 3: PURCHASE_REFUNDED
    console.log(`\n\n[Test 3/7] Refunding purchase...`)
    const test3 = await sendWebhook('PURCHASE_REFUNDED', 'user1@test.com')
    results.push({ event: 'PURCHASE_REFUNDED', ...test3 })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 4: PURCHASE_APPROVED (reactivate after refund)
    console.log(`\n\n[Test 4/7] Reactivating after refund...`)
    const test4 = await sendWebhook('PURCHASE_APPROVED', 'user1@test.com')
    results.push({ event: 'PURCHASE_APPROVED (reactivation)', ...test4 })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 5: PURCHASE_CANCELED
    console.log(`\n\n[Test 5/7] Canceling purchase...`)
    const test5 = await sendWebhook('PURCHASE_CANCELED', 'user2@test.com')
    results.push({ event: 'PURCHASE_CANCELED', ...test5 })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 6: PURCHASE_CHARGEBACK
    console.log(`\n\n[Test 6/7] Processing chargeback...`)
    const test6 = await sendWebhook('PURCHASE_CHARGEBACK', 'user3@test.com')
    results.push({ event: 'PURCHASE_CHARGEBACK', ...test6 })
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 7: SUBSCRIPTION_CANCELLATION
    console.log(`\n\n[Test 7/7] Canceling subscription...`)
    const test7 = await sendWebhook('SUBSCRIPTION_CANCELLATION', 'user4@test.com')
    results.push({ event: 'SUBSCRIPTION_CANCELLATION', ...test7 })
  }

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

  if (failed > 0) {
    console.log(`\n⚠️  Some tests failed. Check the logs above for details.`)
    process.exit(1)
  } else {
    console.log(`\n🎉 All tests passed successfully!`)
    process.exit(0)
  }
}

// Run tests
const testType = process.argv[2]
runTests(testType)
