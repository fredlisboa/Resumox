/**
 * Quick Check: Order Bump Status
 *
 * This script quickly checks the status of order bumps for a specific user
 *
 * Usage:
 *   npx tsx scripts/check-order-bump-status.ts [user-email]
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Validate environment variables
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

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

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

async function checkOrderBumpStatus(email: string) {
  log('═══════════════════════════════════════════════════════', 'magenta')
  log('  🔍 ORDER BUMP STATUS CHECK', 'magenta')
  log('═══════════════════════════════════════════════════════', 'magenta')
  log(`\n📧 User Email: ${email}\n`, 'cyan')

  try {
    // 1. Get user
    const { data: user, error: userError } = await supabase
      .from('users_access')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      log('❌ User not found', 'red')
      return
    }

    log('✅ User found', 'green')
    log(`   ID: ${user.id}`, 'blue')
    log(`   Status: ${user.status_compra}`, 'blue')
    log(`   Main Product: ${user.product_id}`, 'blue')

    // 2. Get user products
    log('\n📦 User Products:', 'cyan')
    const { data: products, error: productsError } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: true })

    if (productsError || !products || products.length === 0) {
      log('   ⚠️  No products found', 'yellow')
    } else {
      products.forEach((product, index) => {
        const type = product.is_order_bump ? '🔥 ORDER BUMP' : '📌 MAIN PRODUCT'
        const status = product.status === 'active' ? '✅' : '❌'
        log(`\n   ${index + 1}. ${type} ${status}`, product.status === 'active' ? 'green' : 'red')
        log(`      Product ID: ${product.product_id}`, 'blue')
        log(`      Product Name: ${product.product_name}`, 'blue')
        log(`      Transaction: ${product.hotmart_transaction_id}`, 'blue')
        log(`      Status: ${product.status}`, 'blue')
        log(`      Purchased: ${new Date(product.purchase_date).toLocaleString()}`, 'blue')
        if (product.is_order_bump && product.parent_transaction_id) {
          log(`      Parent Transaction: ${product.parent_transaction_id}`, 'blue')
        }
      })
    }

    // 3. Get content status
    log('\n\n📚 Content Status:', 'cyan')

    const activeProductIds = (products || [])
      .filter((p: any) => p.status === 'active')
      .map((p: any) => p.product_id)

    log(`   Active Product IDs: ${activeProductIds.join(', ') || 'None'}`, 'blue')

    const { data: allContents } = await supabase
      .from('product_contents')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (!allContents || allContents.length === 0) {
      log('   ⚠️  No contents found', 'yellow')
      return
    }

    // Process contents
    const userContents = allContents
      .filter((content: any) => {
        if (content.status === 'order_bump') return true
        return activeProductIds.includes(content.product_id)
      })
      .map((content: any) => {
        const isOrderBump = content.status === 'order_bump'
        const userOwnsOrderBump = isOrderBump && activeProductIds.includes(content.product_id)
        const isLocked = isOrderBump && !userOwnsOrderBump

        return {
          ...content,
          is_order_bump: isOrderBump,
          user_owns: userOwnsOrderBump,
          is_locked: isLocked,
        }
      })

    // Group by status
    const mainContents = userContents.filter((c: any) => c.status === 'principal')
    const bonusContents = userContents.filter((c: any) => c.status === 'bonus')
    const orderBumpContents = userContents.filter((c: any) => c.status === 'order_bump')

    log(`\n   📌 Main Contents: ${mainContents.length}`, 'green')
    mainContents.forEach((c: any) => {
      log(`      • ${c.title}`, 'blue')
    })

    log(`\n   🎁 Bonus Contents: ${bonusContents.length}`, 'green')
    bonusContents.forEach((c: any) => {
      log(`      • ${c.title}`, 'blue')
    })

    log(`\n   🔥 Order Bump Contents: ${orderBumpContents.length}`, 'yellow')
    orderBumpContents.forEach((c: any) => {
      const lockIcon = c.is_locked ? '🔒' : '🔓'
      const statusColor = c.is_locked ? 'red' : 'green'
      const statusText = c.is_locked ? 'LOCKED' : 'UNLOCKED'
      log(`      ${lockIcon} ${c.title}`, statusColor)
      log(`         Product ID: ${c.product_id}`, 'blue')
      log(`         User owns: ${c.user_owns ? 'YES ✅' : 'NO ❌'}`, c.user_owns ? 'green' : 'yellow')
      log(`         Status: ${statusText}`, statusColor)
    })

    // Summary
    log('\n\n📊 SUMMARY:', 'cyan')
    const totalContents = userContents.length
    const lockedContents = userContents.filter((c: any) => c.is_locked).length
    const unlockedContents = totalContents - lockedContents

    log(`   Total Contents: ${totalContents}`, 'blue')
    log(`   Unlocked: ${unlockedContents}`, 'green')
    log(`   Locked: ${lockedContents}`, lockedContents > 0 ? 'yellow' : 'green')

    // Check if order bumps are correctly locked/unlocked
    const orderBumpsOwnedByUser = orderBumpContents.filter((c: any) => c.user_owns)
    const orderBumpsNotOwnedByUser = orderBumpContents.filter((c: any) => !c.user_owns)

    if (orderBumpsOwnedByUser.length > 0) {
      log(`\n   ✅ User owns ${orderBumpsOwnedByUser.length} order bump(s) - should be UNLOCKED`, 'green')
      const incorrectlyLocked = orderBumpsOwnedByUser.filter((c: any) => c.is_locked)
      if (incorrectlyLocked.length > 0) {
        log(`   ❌ ERROR: ${incorrectlyLocked.length} owned order bump(s) are still LOCKED!`, 'red')
        incorrectlyLocked.forEach((c: any) => {
          log(`      • ${c.title}`, 'red')
        })
      }
    }

    if (orderBumpsNotOwnedByUser.length > 0) {
      log(`\n   🔒 User doesn't own ${orderBumpsNotOwnedByUser.length} order bump(s) - should be LOCKED`, 'yellow')
      const incorrectlyUnlocked = orderBumpsNotOwnedByUser.filter((c: any) => !c.is_locked)
      if (incorrectlyUnlocked.length > 0) {
        log(`   ❌ ERROR: ${incorrectlyUnlocked.length} unowned order bump(s) are UNLOCKED!`, 'red')
        incorrectlyUnlocked.forEach((c: any) => {
          log(`      • ${c.title}`, 'red')
        })
      }
    }

    log('\n═══════════════════════════════════════════════════════\n', 'magenta')

  } catch (error) {
    log(`\n❌ Error: ${error}`, 'red')
    console.error(error)
  }
}

// Get email from command line
const email = process.argv[2]

if (!email) {
  log('❌ Please provide a user email', 'red')
  log('Usage: npx tsx scripts/check-order-bump-status.ts user@example.com', 'yellow')
  process.exit(1)
}

checkOrderBumpStatus(email)
