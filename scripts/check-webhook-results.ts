#!/usr/bin/env tsx
/**
 * Check Webhook Results
 *
 * Queries the database to show recent webhook events and user access changes
 */

import './load-env'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                   HOTMART WEBHOOK TEST RESULTS                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `)

  // Get recent webhooks
  console.log(`\n${'='.repeat(80)}`)
  console.log(`RECENT WEBHOOK EVENTS`)
  console.log(`${'='.repeat(80)}`)

  const { data: webhooks, error: webhooksError } = await supabase
    .from('hotmart_webhooks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (webhooksError) {
    console.error('Error fetching webhooks:', webhooksError)
  } else {
    console.log(`\nTotal webhooks: ${webhooks?.length || 0}\n`)
    webhooks?.forEach((webhook: any, index: number) => {
      const status = webhook.processed ? '✅' : '⏳'
      const error = webhook.error_message ? ` ❌ ${webhook.error_message}` : ''
      console.log(`${index + 1}. ${status} ${webhook.event_type}`)
      console.log(`   Email: ${webhook.subscriber_email}`)
      console.log(`   Transaction: ${webhook.transaction_id}`)
      console.log(`   Processed: ${webhook.processed_at || 'N/A'}${error}\n`)
    })
  }

  // Get test users
  console.log(`\n${'='.repeat(80)}`)
  console.log(`TEST USERS ACCESS STATUS`)
  console.log(`${'='.repeat(80)}`)

  const testEmails = ['user1@test.com', 'user2@test.com', 'user3@test.com', 'user4@test.com']

  for (const email of testEmails) {
    const { data: user, error: userError } = await supabase
      .from('users_access')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      console.log(`\n📧 ${email}: Not found`)
    } else {
      const statusIcon =
        user.status_compra === 'active' ? '🟢' :
        user.status_compra === 'refunded' ? '🔴' :
        user.status_compra === 'cancelled' ? '⚫' :
        user.status_compra === 'chargeback' ? '🚫' : '🟡'

      console.log(`\n📧 ${email}`)
      console.log(`   Status: ${statusIcon} ${user.status_compra}`)
      console.log(`   Product: ${user.product_name || 'N/A'}`)
      console.log(`   Transaction: ${user.hotmart_transaction_id}`)
      console.log(`   Purchase Date: ${user.data_compra ? new Date(user.data_compra).toLocaleString() : 'N/A'}`)
      console.log(`   Expiration: ${user.data_expiracao ? new Date(user.data_expiracao).toLocaleString() : 'N/A'}`)
      console.log(`   Login Attempts: ${user.tentativas_login}`)
      console.log(`   Blocked Until: ${user.bloqueado_ate || 'Not blocked'}`)
    }
  }

  // Get active sessions for test users
  console.log(`\n${'='.repeat(80)}`)
  console.log(`ACTIVE SESSIONS`)
  console.log(`${'='.repeat(80)}`)

  const { data: users } = await supabase
    .from('users_access')
    .select('id, email')
    .in('email', testEmails)

  if (users) {
    const userIds = users.map(u => u.id)
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('*')
      .in('user_id', userIds)
      .eq('is_active', true)

    console.log(`\nActive sessions: ${sessions?.length || 0}`)
    sessions?.forEach((session: any) => {
      const user = users.find(u => u.id === session.user_id)
      console.log(`  • ${user?.email}: Expires ${new Date(session.expires_at).toLocaleString()}`)
    })
  }

  console.log(`\n${'='.repeat(80)}`)
  console.log(`✅ Verification complete!`)
  console.log(`${'='.repeat(80)}\n`)
}

main()
