/**
 * Test Order Bump Complete Flow
 *
 * This script tests the entire order bump flow:
 * 1. Simulates webhook for main product purchase
 * 2. Simulates webhook for order bump purchase
 * 3. Verifies database state
 * 4. Tests content unlocking logic
 *
 * Usage:
 *   npx tsx scripts/test-order-bump-flow.ts [test-email]
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const WEBHOOK_URL = process.env.WEBHOOK_TEST_URL || 'http://localhost:3000/api/webhook/hotmart'
const WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET || ''

// Test email from command line or default
const TEST_EMAIL = process.argv[2] || `test-${Date.now()}@example.com`

// Product IDs for testing
const MAIN_PRODUCT_ID = '6557972'  // Main product
const ORDER_BUMP_PRODUCT_ID = 'ORDERBUMP01'  // Order bump product

// Validate environment variables before creating client
if (!SUPABASE_URL || !SUPABASE_URL.startsWith('http')) {
  console.error('\x1b[31m❌ Error: NEXT_PUBLIC_SUPABASE_URL is not configured or invalid in .env.local\x1b[0m')
  console.error('\x1b[33mCurrent value:\x1b[0m', SUPABASE_URL || '(empty)')
  console.error('\x1b[33mExpected format:\x1b[0m https://your-project.supabase.co')
  process.exit(1)
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\x1b[31m❌ Error: SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local\x1b[0m')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function generateWebhookSignature(payload: string): string {
  return createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
}

interface TestResult {
  step: string
  success: boolean
  message: string
  data?: any
}

const results: TestResult[] = []

function addResult(step: string, success: boolean, message: string, data?: any) {
  results.push({ step, success, message, data })
  const icon = success ? '✅' : '❌'
  const color = success ? 'green' : 'red'
  log(`${icon} ${step}: ${message}`, color)
}

async function cleanup() {
  log('\n🧹 Cleaning up test data...', 'cyan')

  try {
    // Get user ID
    const { data: user } = await supabase
      .from('users_access')
      .select('id')
      .eq('email', TEST_EMAIL)
      .single()

    if (user) {
      // Delete user products
      await supabase
        .from('user_products')
        .delete()
        .eq('user_id', user.id)

      // Delete user sessions
      await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', user.id)

      // Delete user
      await supabase
        .from('users_access')
        .delete()
        .eq('id', user.id)
    }

    // Delete webhooks
    await supabase
      .from('hotmart_webhooks')
      .delete()
      .eq('subscriber_email', TEST_EMAIL)

    log('✅ Cleanup completed', 'green')
  } catch (error) {
    log(`⚠️  Cleanup error (this is OK if first run): ${error}`, 'yellow')
  }
}

async function sendWebhook(isOrderBump: boolean, checkoutSessionId: string, parentTransaction?: string) {
  const transactionId = `TEST-${Date.now()}-${isOrderBump ? 'BUMP' : 'MAIN'}`
  const productId = isOrderBump ? ORDER_BUMP_PRODUCT_ID : MAIN_PRODUCT_ID
  const productName = isOrderBump ? 'Order Bump - Protocolo de Descompresión' : 'NeuroReset - Producto Principal'

  const payload = {
    event: 'PURCHASE_APPROVED',
    version: '2.0.0',
    data: {
      product: {
        id: parseInt(productId) || 0,
        ucode: productId,
        name: productName,
      },
      buyer: {
        email: TEST_EMAIL,
        name: 'Test User',
        first_name: 'Test',
        last_name: 'User',
      },
      purchase: {
        transaction: transactionId,
        status: 'approved',
        order_date: Date.now(),
        approved_date: Date.now(),
        order_bump: isOrderBump ? {
          is_order_bump: true,
          parent_purchase_transaction: parentTransaction || null,
        } : undefined,
        origin: {
          sck: checkoutSessionId,
        },
      },
    },
  }

  const payloadString = JSON.stringify(payload)
  const signature = generateWebhookSignature(payloadString)

  log(`\n📤 Sending webhook for ${isOrderBump ? 'ORDER BUMP' : 'MAIN PRODUCT'}...`, 'cyan')
  log(`   Transaction: ${transactionId}`, 'blue')
  log(`   Product: ${productId}`, 'blue')
  log(`   Checkout Session: ${checkoutSessionId}`, 'blue')

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hotmart-hottok': signature,
      },
      body: payloadString,
    })

    const responseData = await response.json()

    if (response.ok) {
      addResult(
        `Webhook ${isOrderBump ? 'Order Bump' : 'Main Product'}`,
        true,
        'Webhook processed successfully',
        { transactionId, productId, response: responseData }
      )
      return { success: true, transactionId }
    } else {
      addResult(
        `Webhook ${isOrderBump ? 'Order Bump' : 'Main Product'}`,
        false,
        `Webhook failed: ${response.status} - ${JSON.stringify(responseData)}`,
        { transactionId, productId }
      )
      return { success: false, transactionId }
    }
  } catch (error) {
    addResult(
      `Webhook ${isOrderBump ? 'Order Bump' : 'Main Product'}`,
      false,
      `Error sending webhook: ${error}`,
      { transactionId, productId }
    )
    return { success: false, transactionId }
  }
}

async function verifyDatabase() {
  log('\n🔍 Verifying database state...', 'cyan')

  try {
    // Check user exists
    const { data: user, error: userError } = await supabase
      .from('users_access')
      .select('*')
      .eq('email', TEST_EMAIL)
      .single()

    if (userError || !user) {
      addResult('User Creation', false, 'User not found in database')
      return false
    }

    addResult('User Creation', true, `User created with ID: ${user.id}`)

    // Check user products
    const { data: products, error: productsError } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: true })

    if (productsError) {
      addResult('User Products', false, `Error fetching products: ${productsError.message}`)
      return false
    }

    if (!products || products.length === 0) {
      addResult('User Products', false, 'No products found for user')
      return false
    }

    addResult('User Products', true, `Found ${products.length} product(s)`, products)

    // Verify main product
    const mainProduct = products.find(p => !p.is_order_bump)
    if (mainProduct) {
      addResult(
        'Main Product',
        true,
        `Main product registered: ${mainProduct.product_id}`,
        mainProduct
      )
    } else {
      addResult('Main Product', false, 'Main product not found')
    }

    // Verify order bump
    const orderBump = products.find(p => p.is_order_bump)
    if (orderBump) {
      addResult(
        'Order Bump Product',
        true,
        `Order bump registered: ${orderBump.product_id}`,
        orderBump
      )

      // Verify order bump flags
      if (orderBump.is_order_bump !== true) {
        addResult('Order Bump Flag', false, 'is_order_bump flag is not true')
      } else {
        addResult('Order Bump Flag', true, 'is_order_bump flag is correct')
      }

      if (orderBump.status !== 'active') {
        addResult('Order Bump Status', false, `Status is ${orderBump.status}, expected 'active'`)
      } else {
        addResult('Order Bump Status', true, 'Status is active')
      }
    } else {
      addResult('Order Bump Product', false, 'Order bump not found')
    }

    return true
  } catch (error) {
    addResult('Database Verification', false, `Error: ${error}`)
    return false
  }
}

async function testContentUnlocking() {
  log('\n🔓 Testing content unlocking logic...', 'cyan')

  try {
    // Get user
    const { data: user } = await supabase
      .from('users_access')
      .select('id')
      .eq('email', TEST_EMAIL)
      .single()

    if (!user) {
      addResult('Content Unlocking', false, 'User not found')
      return false
    }

    // Get user's active products
    const { data: userProducts } = await supabase
      .from('user_products')
      .select('product_id, status, expiration_date')
      .eq('user_id', user.id)
      .eq('status', 'active')

    const activeProductIds = (userProducts || []).map((p: any) => p.product_id)

    addResult(
      'Active Products',
      activeProductIds.length > 0,
      `User has ${activeProductIds.length} active product(s): ${activeProductIds.join(', ')}`,
      activeProductIds
    )

    // Get all contents
    const { data: allContents } = await supabase
      .from('product_contents')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (!allContents) {
      addResult('Content Fetch', false, 'No contents found')
      return false
    }

    // Process contents (same logic as API)
    const orderBumpContents = allContents.filter((c: any) => c.status === 'order_bump')
    const processedContents = allContents
      .filter((content: any) => {
        if (content.status === 'order_bump') return true
        return activeProductIds.includes(content.product_id)
      })
      .map((content: any) => {
        const isOrderBump = content.status === 'order_bump'
        const userOwnsOrderBump = isOrderBump && activeProductIds.includes(content.product_id)
        const isLocked = isOrderBump && !userOwnsOrderBump

        return {
          id: content.id,
          title: content.title,
          product_id: content.product_id,
          status: content.status,
          is_locked: isLocked,
          user_owns: isOrderBump ? userOwnsOrderBump : activeProductIds.includes(content.product_id),
        }
      })

    addResult(
      'Content Processing',
      true,
      `Processed ${processedContents.length} content(s)`,
      processedContents
    )

    // Check order bump unlocking
    const orderBumpContent = processedContents.find((c: any) => c.status === 'order_bump')
    if (orderBumpContent) {
      const shouldBeUnlocked = activeProductIds.includes(orderBumpContent.product_id)
      const isCorrectlyUnlocked = !orderBumpContent.is_locked === shouldBeUnlocked

      addResult(
        'Order Bump Unlocking',
        isCorrectlyUnlocked,
        `Order bump content is ${orderBumpContent.is_locked ? 'LOCKED' : 'UNLOCKED'} (expected: ${shouldBeUnlocked ? 'UNLOCKED' : 'LOCKED'})`,
        orderBumpContent
      )
    } else {
      addResult('Order Bump Unlocking', false, 'No order bump content found to test')
    }

    return true
  } catch (error) {
    addResult('Content Unlocking', false, `Error: ${error}`)
    return false
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════════════', 'magenta')
  log('  🧪 ORDER BUMP FLOW COMPLETE TEST', 'magenta')
  log('═══════════════════════════════════════════════════════', 'magenta')
  log(`\n📧 Test Email: ${TEST_EMAIL}`, 'cyan')
  log(`🔗 Webhook URL: ${WEBHOOK_URL}`, 'cyan')
  log(`🔑 Webhook Secret: ${WEBHOOK_SECRET ? 'Configured ✅' : 'NOT CONFIGURED ❌'}`, 'cyan')

  if (!WEBHOOK_SECRET) {
    log('\n❌ HOTMART_WEBHOOK_SECRET not configured. Please set it in .env.local', 'red')
    process.exit(1)
  }

  // Step 1: Cleanup
  await cleanup()

  // Wait a bit for cleanup to complete
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Step 2: Send main product webhook
  const checkoutSessionId = `TEST-SESSION-${Date.now()}`
  const mainProductResult = await sendWebhook(false, checkoutSessionId)

  if (!mainProductResult.success) {
    log('\n❌ Main product webhook failed. Stopping tests.', 'red')
    printSummary()
    return
  }

  // Wait for webhook processing
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 3: Send order bump webhook
  const orderBumpResult = await sendWebhook(true, checkoutSessionId, mainProductResult.transactionId)

  // Wait for webhook processing
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 4: Verify database
  await verifyDatabase()

  // Step 5: Test content unlocking
  await testContentUnlocking()

  // Print summary
  printSummary()
}

function printSummary() {
  log('\n═══════════════════════════════════════════════════════', 'magenta')
  log('  📊 TEST SUMMARY', 'magenta')
  log('═══════════════════════════════════════════════════════', 'magenta')

  const totalTests = results.length
  const passedTests = results.filter(r => r.success).length
  const failedTests = results.filter(r => !r.success).length

  log(`\nTotal Tests: ${totalTests}`, 'cyan')
  log(`Passed: ${passedTests}`, 'green')
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green')

  if (failedTests > 0) {
    log('\n❌ Failed Tests:', 'red')
    results.filter(r => !r.success).forEach(r => {
      log(`   • ${r.step}: ${r.message}`, 'red')
    })
  }

  log('\n📝 Detailed Results:', 'cyan')
  results.forEach(r => {
    const icon = r.success ? '✅' : '❌'
    const color = r.success ? 'green' : 'red'
    log(`${icon} ${r.step}`, color)
    log(`   ${r.message}`, 'blue')
    if (r.data) {
      log(`   Data: ${JSON.stringify(r.data, null, 2)}`, 'blue')
    }
  })

  log('\n═══════════════════════════════════════════════════════', 'magenta')

  if (failedTests === 0) {
    log('🎉 ALL TESTS PASSED! The order bump flow is working correctly.', 'green')
  } else {
    log('⚠️  Some tests failed. Please review the errors above.', 'yellow')
  }

  log('═══════════════════════════════════════════════════════\n', 'magenta')
}

// Run the tests
runTests().catch(error => {
  log(`\n💥 Fatal error: ${error}`, 'red')
  console.error(error)
  process.exit(1)
})
