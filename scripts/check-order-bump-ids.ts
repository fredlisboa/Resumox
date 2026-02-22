/**
 * Script to check all order bump product IDs in the database
 * This helps identify which product IDs need checkout URLs configured
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:')
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Initialize Supabase Admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkOrderBumpIds() {
  console.log('\n🔍 Checking Order Bump Product IDs in Database...\n')

  try {
    // Get all order bump contents from database
    const { data: orderBumps, error } = await supabaseAdmin
      .from('product_contents')
      .select('product_id, title, content_type, status')
      .eq('status', 'order_bump')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('❌ Error fetching order bumps:', error)
      return
    }

    if (!orderBumps || orderBumps.length === 0) {
      console.log('⚠️  No order bumps found in database')
      return
    }

    console.log(`✅ Found ${orderBumps.length} order bump(s):\n`)

    orderBumps.forEach((bump, index) => {
      console.log(`${index + 1}. Product ID: ${bump.product_id}`)
      console.log(`   Title: ${bump.title}`)
      console.log(`   Type: ${bump.content_type}`)
      console.log(`   Status: ${bump.status}`)
      console.log('')
    })

    // Show required configuration
    console.log('\n📝 Required Configuration for lib/product-config.ts:\n')
    console.log('export const ORDER_BUMP_CHECKOUT_URLS: Record<string, string> = {')
    orderBumps.forEach((bump) => {
      console.log(`  '${bump.product_id}': 'https://pay.hotmart.com/XXXXXXXX', // ${bump.title}`)
    })
    console.log('}')
    console.log('')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the check
checkOrderBumpIds()
  .then(() => {
    console.log('\n✅ Check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
