#!/usr/bin/env tsx
/**
 * Check User Products Script
 *
 * Displays all products associated with a specific user email,
 * including order bump information.
 *
 * Usage:
 *   npm run check:user-products hotmartuser@gmail.com
 *   or
 *   tsx scripts/check-user-products.ts hotmartuser@gmail.com
 */

import './load-env'
import { supabaseAdmin, type Database } from '@/lib/supabase'

type UserAccessRow = Database['public']['Tables']['users_access']['Row']
type UserProductRow = Database['public']['Tables']['user_products']['Row']
type HotmartWebhookRow = Database['public']['Tables']['hotmart_webhooks']['Row']

async function checkUserProducts(email: string) {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                         USER PRODUCTS REPORT                              ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `)

  console.log(`Email: ${email}\n`)

  try {
    // 1. Get user from users_access table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users_access')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      console.log(`❌ User not found: ${email}`)
      console.log(`Error:`, userError?.message || 'No data returned')
      return
    }

    const user: UserAccessRow = userData

    console.log(`✅ User Found`)
    console.log(`${'─'.repeat(80)}`)
    console.log(`ID: ${user.id}`)
    console.log(`Email: ${user.email}`)
    console.log(`Status: ${user.status_compra || 'N/A'}`)
    console.log(`Main Product ID: ${user.product_id || 'N/A'}`)
    console.log(`Main Product Name: ${user.product_name || 'N/A'}`)
    console.log(`Transaction ID: ${user.hotmart_transaction_id || 'N/A'}`)
    console.log(`Subscriber Code: ${user.hotmart_subscriber_code || 'N/A'}`)
    console.log(`Purchase Date: ${user.data_compra ? new Date(user.data_compra).toLocaleString() : 'N/A'}`)
    console.log(`Expiration Date: ${user.data_expiracao ? new Date(user.data_expiracao).toLocaleString() : 'N/A'}`)

    // 2. Get all user products
    const { data: productsData, error: productsError } = await supabaseAdmin
      .from('user_products')
      .select('*')
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: true })

    if (productsError) {
      console.log(`\n❌ Error fetching products:`, productsError.message)
      return
    }

    if (!productsData || productsData.length === 0) {
      console.log(`\n⚠️  No products found in user_products table`)
      return
    }

    const products: UserProductRow[] = productsData

    console.log(`\n📦 User Products (${products.length} total)`)
    console.log(`${'─'.repeat(80)}`)

    products.forEach((product, index) => {
      console.log(`\n[${index + 1}] ${product.is_order_bump ? '🎁 ORDER BUMP' : '📦 MAIN PRODUCT'}`)
      console.log(`    Product ID: ${product.product_id}`)
      console.log(`    Product Name: ${product.product_name || 'N/A'}`)
      console.log(`    Transaction ID: ${product.hotmart_transaction_id}`)
      console.log(`    Status: ${product.status}`)
      console.log(`    Is Order Bump: ${product.is_order_bump ? 'Yes' : 'No'}`)

      if (product.is_order_bump && product.parent_transaction_id) {
        console.log(`    Parent Transaction: ${product.parent_transaction_id}`)

        // Find parent product
        const parentProduct = products.find(p => p.hotmart_transaction_id === product.parent_transaction_id)
        if (parentProduct) {
          console.log(`    Parent Product: ${parentProduct.product_id} - ${parentProduct.product_name}`)
        }
      }

      console.log(`    Purchase Date: ${product.purchase_date ? new Date(product.purchase_date).toLocaleString() : 'N/A'}`)
      console.log(`    Expiration Date: ${product.expiration_date ? new Date(product.expiration_date).toLocaleString() : 'N/A'}`)
      console.log(`    Created At: ${product.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}`)
    })

    // 3. Get recent webhooks for this user
    const { data: webhooksData, error: webhooksError } = await supabaseAdmin
      .from('hotmart_webhooks')
      .select('*')
      .eq('subscriber_email', email)
      .order('created_at', { ascending: false })
      .limit(10)

    const webhooks: HotmartWebhookRow[] = webhooksData || []

    if (!webhooksError && webhooks && webhooks.length > 0) {
      console.log(`\n\n📨 Recent Webhooks (${webhooks.length} most recent)`)
      console.log(`${'─'.repeat(80)}`)

      webhooks.forEach((webhook, index) => {
        const payload = webhook.payload as any
        const productId = payload?.data?.product?.id
        const checkoutSession = payload?.data?.purchase?.origin?.sck
        const isOrderBump = payload?.data?.purchase?.order_bump?.is_order_bump

        console.log(`\n[${index + 1}] ${webhook.event_type}`)
        console.log(`    Transaction: ${webhook.transaction_id}`)
        console.log(`    Product ID: ${productId || 'N/A'}`)
        console.log(`    Checkout Session: ${checkoutSession || 'N/A'}`)
        console.log(`    Is Order Bump (from payload): ${isOrderBump ? 'Yes' : 'No'}`)
        console.log(`    Processed: ${webhook.processed ? 'Yes' : 'No'}`)
        console.log(`    Created At: ${webhook.created_at ? new Date(webhook.created_at).toLocaleString() : 'N/A'}`)

        if (webhook.error_message) {
          console.log(`    ❌ Error: ${webhook.error_message}`)
        }
      })
    }

    // 4. Summary
    console.log(`\n\n📊 SUMMARY`)
    console.log(`${'─'.repeat(80)}`)

    const activeProducts = products.filter(p => p.status === 'active')
    const mainProducts = products.filter(p => !p.is_order_bump)
    const orderBumps = products.filter(p => p.is_order_bump)

    console.log(`Total Products: ${products.length}`)
    console.log(`Active Products: ${activeProducts.length}`)
    console.log(`Main Products: ${mainProducts.length}`)
    console.log(`Order Bumps: ${orderBumps.length}`)

    console.log(`\nProduct Breakdown:`)
    const productGroups = products.reduce((acc: any, p) => {
      acc[p.product_id] = acc[p.product_id] || []
      acc[p.product_id].push(p)
      return acc
    }, {})

    Object.entries(productGroups).forEach(([productId, prods]: [string, any]) => {
      const status = prods[0].status
      const isOrderBump = prods[0].is_order_bump
      console.log(`  - Product ${productId}: ${prods.length} entry(s) [${status}] ${isOrderBump ? '(Order Bump)' : '(Main)'}`)
    })

    console.log(`\n✅ Report complete!`)

  } catch (error) {
    console.error(`\n❌ Error:`, error)
  }
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.error(`
❌ Error: Email address is required

Usage:
  npm run check:user-products <email>

Example:
  npm run check:user-products hotmartuser@gmail.com
  `)
  process.exit(1)
}

checkUserProducts(email)
