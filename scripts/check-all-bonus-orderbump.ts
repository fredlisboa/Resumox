/**
 * Script to check all bonus and order_bump products in the database
 * This helps identify if some bonuses should be order bumps
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAllBonusAndOrderBumps() {
  console.log('\n🔍 Checking All Bonus and Order Bump Products in Database...\n')

  try {
    // Get all bonus and order_bump contents from database
    const { data: contents, error } = await supabaseAdmin
      .from('product_contents')
      .select('product_id, title, content_type, status, order_index')
      .in('status', ['bonus', 'order_bump'])
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('❌ Error fetching contents:', error)
      return
    }

    if (!contents || contents.length === 0) {
      console.log('⚠️  No bonus or order bump contents found in database')
      return
    }

    // Separate by status
    const bonuses = contents.filter(c => c.status === 'bonus')
    const orderBumps = contents.filter(c => c.status === 'order_bump')

    console.log('=' .repeat(70))
    console.log(`📦 BONUS CONTENTS (${bonuses.length})`)
    console.log('=' .repeat(70))
    bonuses.forEach((item, index) => {
      console.log(`\n${index + 1}. Product ID: ${item.product_id}`)
      console.log(`   Title: ${item.title}`)
      console.log(`   Type: ${item.content_type}`)
      console.log(`   Order Index: ${item.order_index}`)
    })

    console.log('\n' + '=' .repeat(70))
    console.log(`🔥 ORDER BUMP CONTENTS (${orderBumps.length})`)
    console.log('=' .repeat(70))
    orderBumps.forEach((item, index) => {
      console.log(`\n${index + 1}. Product ID: ${item.product_id}`)
      console.log(`   Title: ${item.title}`)
      console.log(`   Type: ${item.content_type}`)
      console.log(`   Order Index: ${item.order_index}`)
    })

    console.log('\n' + '=' .repeat(70))
    console.log('💡 RECOMMENDATIONS')
    console.log('=' .repeat(70))

    console.log('\nBased on titles containing "Bono", "Bonus", "Exclusivo":')
    const suspectBonuses = bonuses.filter(b =>
      b.title.toLowerCase().includes('bono') ||
      b.title.toLowerCase().includes('bonus') ||
      b.title.toLowerCase().includes('exclusivo')
    )

    if (suspectBonuses.length > 0) {
      console.log('\n⚠️  These BONUS items might should be ORDER_BUMP:')
      suspectBonuses.forEach(item => {
        console.log(`   - ${item.product_id}: ${item.title}`)
      })
      console.log('\n   To change them to order_bump, run:')
      console.log('   UPDATE product_contents SET status = \'order_bump\' WHERE product_id IN (')
      suspectBonuses.forEach((item, idx) => {
        console.log(`     '${item.product_id}'${idx < suspectBonuses.length - 1 ? ',' : ''}`)
      })
      console.log('   );')
    } else {
      console.log('\n✅ No suspicious bonus items found')
    }

    console.log('\n' + '=' .repeat(70) + '\n')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the check
checkAllBonusAndOrderBumps()
  .then(() => {
    console.log('✅ Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
