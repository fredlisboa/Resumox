#!/usr/bin/env tsx
/**
 * Hotmart Setup Verification Script
 *
 * Checks if all required components are properly configured:
 * - Environment variables
 * - Database tables and schema
 * - Webhook endpoint accessibility
 *
 * Usage: npm run verify:hotmart
 */

import './load-env'
import { createClient } from '@supabase/supabase-js'

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'HOTMART_WEBHOOK_SECRET',
  'HOTMART_CLIENT_ID',
  'HOTMART_CLIENT_SECRET'
]

const REQUIRED_TABLES = [
  'users_access',
  'hotmart_webhooks',
  'user_sessions',
  'product_contents'
]

function checkEnvironmentVariables() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`CHECKING ENVIRONMENT VARIABLES`)
  console.log(`${'='.repeat(80)}`)

  const missing: string[] = []
  const present: string[] = []

  REQUIRED_ENV_VARS.forEach(varName => {
    const value = process.env[varName]
    if (!value || value.startsWith('your_') || value.includes('placeholder')) {
      missing.push(varName)
      console.log(`❌ ${varName}: Missing or placeholder`)
    } else {
      present.push(varName)
      const displayValue = value.length > 20 ? `${value.substring(0, 15)}...` : value
      console.log(`✅ ${varName}: ${displayValue}`)
    }
  })

  return { present, missing, success: missing.length === 0 }
}

async function checkDatabaseConnection() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`CHECKING DATABASE CONNECTION`)
  console.log(`${'='.repeat(80)}`)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log(`❌ Cannot connect: Missing Supabase credentials`)
    return { success: false }
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test connection with a simple query
    const { data, error } = await supabase
      .from('users_access')
      .select('count')
      .limit(1)

    if (error) {
      console.log(`❌ Database connection failed: ${error.message}`)
      return { success: false, error }
    }

    console.log(`✅ Database connection successful`)
    return { success: true, supabase }

  } catch (error) {
    console.log(`❌ Database connection error:`, error)
    return { success: false, error }
  }
}

async function checkDatabaseSchema(supabase: any) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`CHECKING DATABASE SCHEMA`)
  console.log(`${'='.repeat(80)}`)

  const results: any[] = []

  for (const tableName of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ Table '${tableName}': ${error.message}`)
        results.push({ table: tableName, exists: false, error })
      } else {
        console.log(`✅ Table '${tableName}': Accessible`)
        results.push({ table: tableName, exists: true })
      }
    } catch (error) {
      console.log(`❌ Table '${tableName}': Error checking`, error)
      results.push({ table: tableName, exists: false, error })
    }
  }

  const allTablesExist = results.every(r => r.exists)
  return { success: allTablesExist, results }
}

async function checkWebhookEndpoint() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`CHECKING WEBHOOK ENDPOINT`)
  console.log(`${'='.repeat(80)}`)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const webhookUrl = `${appUrl}/api/webhook/hotmart`

  console.log(`Webhook URL: ${webhookUrl}`)

  try {
    // Try to reach the endpoint (should return 405 for GET)
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Hotmart-Setup-Checker/1.0' }
    })

    // We expect 405 Method Not Allowed for GET requests
    if (response.status === 405) {
      console.log(`✅ Webhook endpoint is accessible (405 Method Not Allowed expected for GET)`)
      return { success: true, status: response.status }
    } else {
      console.log(`⚠️  Unexpected status ${response.status} - expected 405`)
      return { success: false, status: response.status }
    }

  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`❌ Cannot connect to ${webhookUrl}`)
      console.log(`   Make sure the development server is running: npm run dev`)
      return { success: false, error: 'ECONNREFUSED' }
    }

    console.log(`❌ Error checking webhook endpoint:`, error.message)
    return { success: false, error }
  }
}

async function checkHotmartWebhooksData(supabase: any) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`CHECKING HOTMART WEBHOOKS DATA`)
  console.log(`${'='.repeat(80)}`)

  try {
    const { data, error } = await supabase
      .from('hotmart_webhooks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.log(`❌ Error querying webhooks: ${error.message}`)
      return { success: false, error }
    }

    console.log(`Total recent webhooks: ${data?.length || 0}`)

    if (data && data.length > 0) {
      console.log(`\nRecent webhook events:`)
      data.forEach((webhook: any) => {
        const status = webhook.processed ? '✅ Processed' : '⏳ Pending'
        const error = webhook.error_message ? ` (Error: ${webhook.error_message})` : ''
        console.log(`  ${status} - ${webhook.event_type} - ${webhook.subscriber_email}${error}`)
      })
    } else {
      console.log(`No webhook events found in database (this is normal for new setups)`)
    }

    return { success: true, data }

  } catch (error) {
    console.log(`❌ Error checking webhooks:`, error)
    return { success: false, error }
  }
}

async function checkUsersAccess(supabase: any) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`CHECKING USERS ACCESS DATA`)
  console.log(`${'='.repeat(80)}`)

  try {
    const { data, error } = await supabase
      .from('users_access')
      .select('email, status_compra, product_name, data_compra, data_expiracao')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.log(`❌ Error querying users: ${error.message}`)
      return { success: false, error }
    }

    console.log(`Total users: ${data?.length || 0}`)

    if (data && data.length > 0) {
      console.log(`\nRecent users:`)
      data.forEach((user: any) => {
        const status = user.status_compra === 'active' ? '🟢' :
                       user.status_compra === 'refunded' ? '🔴' :
                       user.status_compra === 'cancelled' ? '⚫' : '🟡'
        console.log(`  ${status} ${user.email} - ${user.status_compra} - ${user.product_name || 'N/A'}`)
      })
    } else {
      console.log(`No users found in database (this is normal for new setups)`)
    }

    return { success: true, data }

  } catch (error) {
    console.log(`❌ Error checking users:`, error)
    return { success: false, error }
  }
}

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║              HOTMART INTEGRATION SETUP VERIFICATION                       ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `)

  const results = {
    envVars: checkEnvironmentVariables(),
    database: await checkDatabaseConnection(),
    schema: { success: false },
    webhook: await checkWebhookEndpoint(),
    webhooksData: { success: false },
    usersData: { success: false }
  }

  if (results.database.success && results.database.supabase) {
    results.schema = await checkDatabaseSchema(results.database.supabase)
    results.webhooksData = await checkHotmartWebhooksData(results.database.supabase)
    results.usersData = await checkUsersAccess(results.database.supabase)
  }

  // Final summary
  console.log(`\n${'='.repeat(80)}`)
  console.log(`VERIFICATION SUMMARY`)
  console.log(`${'='.repeat(80)}`)

  const checks = [
    { name: 'Environment Variables', success: results.envVars.success },
    { name: 'Database Connection', success: results.database.success },
    { name: 'Database Schema', success: results.schema.success },
    { name: 'Webhook Endpoint', success: results.webhook.success }
  ]

  checks.forEach(check => {
    const icon = check.success ? '✅' : '❌'
    console.log(`${icon} ${check.name}`)
  })

  const allPassed = checks.every(c => c.success)

  if (allPassed) {
    console.log(`\n🎉 All checks passed! Hotmart integration is properly configured.`)
    console.log(`\nNext steps:`)
    console.log(`  1. Run tests: npm run test:hotmart`)
    console.log(`  2. Configure webhook URL in Hotmart dashboard`)
    console.log(`  3. Monitor webhook events in production`)
    process.exit(0)
  } else {
    console.log(`\n⚠️  Some checks failed. Please review the errors above.`)
    process.exit(1)
  }
}

main()
