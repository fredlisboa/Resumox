#!/usr/bin/env tsx
/**
 * Script para verificar webhooks com erro no banco de dados
 */

import './load-env'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkErrors() {
  console.log('Checking for webhook errors...\n')

  // Buscar webhooks com erro
  const { data: webhooksWithErrors, error } = await supabase
    .from('hotmart_webhooks')
    .select('*')
    .not('error_message', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching webhooks:', error)
    return
  }

  if (!webhooksWithErrors || webhooksWithErrors.length === 0) {
    console.log('✅ No webhooks with errors found!')
    return
  }

  console.log(`Found ${webhooksWithErrors.length} webhooks with errors:\n`)

  webhooksWithErrors.forEach((webhook, index) => {
    console.log(`${index + 1}. Event: ${webhook.event_type}`)
    console.log(`   Transaction: ${webhook.transaction_id}`)
    console.log(`   Email: ${webhook.subscriber_email}`)
    console.log(`   Error: ${webhook.error_message}`)
    console.log(`   Created: ${new Date(webhook.created_at).toLocaleString()}`)
    console.log(`   Payload:`, JSON.stringify(webhook.payload, null, 2).substring(0, 500))
    console.log()
  })

  // Buscar webhooks recentes (últimos 30 minutos)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { data: recentWebhooks } = await supabase
    .from('hotmart_webhooks')
    .select('event_type, processed, error_message')
    .gte('created_at', thirtyMinutesAgo)
    .order('created_at', { ascending: false })

  if (recentWebhooks) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Recent webhooks (last 30 minutes):')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    const summary = {
      total: recentWebhooks.length,
      processed: recentWebhooks.filter(w => w.processed && !w.error_message).length,
      errors: recentWebhooks.filter(w => w.error_message).length,
      pending: recentWebhooks.filter(w => !w.processed && !w.error_message).length,
    }

    console.log(`Total: ${summary.total}`)
    console.log(`✅ Processed: ${summary.processed}`)
    console.log(`❌ Errors: ${summary.errors}`)
    console.log(`⏳ Pending: ${summary.pending}`)

    if (summary.errors > 0) {
      console.log('\nErrors by event type:')
      const errorsByType = recentWebhooks
        .filter(w => w.error_message)
        .reduce((acc, w) => {
          acc[w.event_type] = (acc[w.event_type] || 0) + 1
          return acc
        }, {} as Record<string, number>)

      Object.entries(errorsByType).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`)
      })
    }
  }
}

checkErrors()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
