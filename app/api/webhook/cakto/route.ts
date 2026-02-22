// @ts-nocheck - Supabase type inference issues during build with placeholder env vars
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getCaktoContentProductId, getCaktoContentProductName, isCaktoProductMapped } from '@/lib/cakto-product-map'

// Tipos do webhook da Cakto
interface CaktoWebhookData {
  event: string // purchase_approved, purchase_refunded, etc.
  secret: string
  data: {
    id: string // Transaction ID (UUID)
    refId: string // Reference ID like "CYGYUVV"
    status: string // paid, refunded, canceled, etc.
    amount: number
    baseAmount: number
    paidAt: string | null
    createdAt: string
    canceledAt: string | null
    refundedAt: string | null
    chargedbackAt: string | null
    paymentMethod: string
    installments: number

    // Customer info
    customer: {
      name: string
      email: string
      phone: string
      docType: string
      docNumber: string
      birthDate: string | null
    }

    // Product info
    product: {
      id: string // Product UUID
      name: string
      type: string // "unique", "subscription", etc.
      short_id: string
      supportEmail: string
    }

    // Offer info
    offer: {
      id: string
      name: string
      image: string | null
      price: number
    }

    // Order bump detection
    offer_type: string // "main" or "bump"
    parent_order: string | null // Parent order ID for order bumps

    // Subscription info (if applicable)
    subscription?: {
      id: string
      status: string
      createdAt: string
      canceledAt: string | null
      next_payment_date: string
      recurrence_period: number
    }

    // UTM tracking
    sck: string | null
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
    utm_term: string | null
    utm_content: string | null
  }
}

// Validar secret do webhook (Cakto envia no body)
function validateWebhookSecret(receivedSecret: string, expectedSecret: string): boolean {
  return receivedSecret === expectedSecret
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    console.log('[Cakto Webhook] Received request')
    console.log('[Cakto Webhook] Body length:', rawBody.length)

    // Parse JSON first to get the secret from body
    let webhookData: CaktoWebhookData
    try {
      webhookData = JSON.parse(rawBody)
    } catch (parseError) {
      console.error('[Cakto Webhook] Invalid JSON payload')
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    // Validate secret from body
    const receivedSecret = webhookData.secret
    console.log('[Cakto Webhook] Secret received:', receivedSecret ? `${receivedSecret.substring(0, 10)}...` : 'NOT PROVIDED')

    if (!receivedSecret) {
      console.error('[Cakto Webhook] Missing secret in payload')
      return NextResponse.json(
        { error: 'Missing secret' },
        { status: 401 }
      )
    }

    if (!process.env.CAKTO_WEBHOOK_SECRET) {
      console.error('[Cakto Webhook] CAKTO_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const isValid = validateWebhookSecret(receivedSecret, process.env.CAKTO_WEBHOOK_SECRET)

    if (!isValid) {
      console.error('[Cakto Webhook] Invalid secret')
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    console.log('[Cakto Webhook] Secret validated successfully')

    // Extract basic data
    const customerEmail = webhookData.data?.customer?.email?.toLowerCase() || 'unknown@unknown.com'
    const customerName = webhookData.data?.customer?.name || 'Unknown'
    const transactionId = webhookData.data?.id || `NOTX-${Date.now()}`
    const refId = webhookData.data?.refId || null
    const productId = webhookData.data?.product?.id || 'unknown'
    const productShortId = webhookData.data?.product?.short_id || null
    const productName = webhookData.data?.product?.name || 'Unknown Product'
    const offerId = webhookData.data?.offer?.id || null
    const offerName = webhookData.data?.offer?.name || null
    const offerType = webhookData.data?.offer_type || 'main'
    const parentOrder = webhookData.data?.parent_order || null
    const subscriptionId = webhookData.data?.subscription?.id || null

    // Determine if this is an order bump
    const isOrderBump = offerType === 'bump' || (parentOrder !== null && offerType !== 'main')

    // Log webhook to database for audit trail
    try {
      await supabaseAdmin.from('cakto_webhooks').insert({
        event_type: webhookData.event,
        transaction_id: transactionId,
        ref_id: refId,
        subscriber_email: customerEmail,
        product_id: productId,
        offer_id: offerId,
        payload: webhookData as any,
        processed: false
      })
    } catch (dbError) {
      console.error('[Cakto Webhook] Error inserting webhook to DB:', dbError)
      // Continue processing even if logging fails
    }

    console.log('[Cakto Webhook] ===== WEBHOOK DATA =====')
    console.log('[Cakto Webhook] Event:', webhookData.event)
    console.log('[Cakto Webhook] Customer email:', customerEmail)
    console.log('[Cakto Webhook] Customer name:', customerName)
    console.log('[Cakto Webhook] Transaction ID:', transactionId)
    console.log('[Cakto Webhook] Ref ID:', refId)
    console.log('[Cakto Webhook] Product ID:', productId)
    console.log('[Cakto Webhook] Product Short ID:', productShortId)
    console.log('[Cakto Webhook] Product name:', productName)
    console.log('[Cakto Webhook] Offer ID:', offerId)
    console.log('[Cakto Webhook] Offer type:', offerType)
    console.log('[Cakto Webhook] Is Order Bump:', isOrderBump)
    console.log('[Cakto Webhook] Parent Order:', parentOrder)
    console.log('[Cakto Webhook] Subscription ID:', subscriptionId)
    console.log('[Cakto Webhook] ========================')

    // Route events to appropriate handlers
    switch (webhookData.event) {
      case 'purchase_approved':
      case 'purchase_complete':
        await handlePurchaseApproved(
          customerEmail,
          customerName,
          transactionId,
          productId,
          productName,
          subscriptionId,
          isOrderBump,
          parentOrder
        )
        break

      case 'purchase_refunded':
        await handlePurchaseRefunded(customerEmail, transactionId, productId)
        break

      case 'purchase_canceled':
      case 'purchase_delayed':
        await handlePurchaseCanceled(customerEmail, transactionId, productId)
        break

      case 'purchase_chargeback':
        await handleChargeback(customerEmail, transactionId, productId)
        break

      case 'subscription_canceled':
      case 'subscription_cancellation':
        await handleSubscriptionCanceled(customerEmail)
        break

      default:
        console.log('[Cakto Webhook] Unhandled event type:', webhookData.event)
        console.log('[Cakto Webhook] Full payload:', JSON.stringify(webhookData, null, 2))
    }

    // Mark webhook as processed
    try {
      await supabaseAdmin
        .from('cakto_webhooks')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('transaction_id', transactionId)
    } catch (updateError) {
      console.error('[Cakto Webhook] Error updating webhook status:', updateError)
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' })

  } catch (error) {
    console.error('[Cakto Webhook] Fatal error processing webhook:', error)
    console.error('[Cakto Webhook] Stack trace:', error instanceof Error ? error.stack : 'No stack')

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handlers for each event type

async function handlePurchaseApproved(
  email: string,
  name: string,
  transactionId: string,
  caktoProductId: string,
  caktoProductName: string,
  subscriptionId?: string | null,
  isOrderBump: boolean = false,
  parentOrderId: string | null = null
) {
  const now = new Date()
  const dataExpiracao = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year

  // Map Cakto product ID to content product ID
  const contentProductId = getCaktoContentProductId(caktoProductId)
  const contentProductName = getCaktoContentProductName(caktoProductId) || caktoProductName
  const isMapped = isCaktoProductMapped(caktoProductId)

  console.log('[Cakto Webhook] ===== PROCESSING PURCHASE =====')
  console.log('[Cakto Webhook] Email:', email)
  console.log('[Cakto Webhook] Name:', name)
  console.log('[Cakto Webhook] Cakto Product:', caktoProductId, '-', caktoProductName)
  console.log('[Cakto Webhook] Content Product:', contentProductId, '-', contentProductName)
  console.log('[Cakto Webhook] Is Mapped:', isMapped)
  console.log('[Cakto Webhook] Is Order Bump:', isOrderBump)

  // 1. Ensure user exists in users_access table
  const { data: existingUser } = await supabaseAdmin
    .from('users_access')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  let userId: string

  if (existingUser) {
    userId = existingUser.id

    // Update user info if this is a main product (not order bump)
    if (!isOrderBump) {
      await supabaseAdmin
        .from('users_access')
        .update({
          status_compra: 'active',
          cakto_transaction_id: transactionId,
          cakto_subscription_id: subscriptionId || null,
          product_id: caktoProductId, // Keep Cakto UUID for routing
          product_name: contentProductName,
          data_compra: now.toISOString(),
          data_expiracao: dataExpiracao.toISOString(),
          bloqueado_ate: null,
          tentativas_login: 0
        })
        .eq('email', email)

      console.log('[Cakto Webhook] Updated existing user:', userId)
    }
  } else {
    // Create new user
    const { data: newUser, error } = await supabaseAdmin
      .from('users_access')
      .insert({
        email,
        nome: name,
        status_compra: 'active',
        cakto_transaction_id: transactionId,
        cakto_subscription_id: subscriptionId || null,
        product_id: caktoProductId, // Keep Cakto UUID for routing
        product_name: contentProductName,
        data_compra: now.toISOString(),
        data_expiracao: dataExpiracao.toISOString(),
        tentativas_login: 0
      })
      .select('id')
      .single()

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        console.log('[Cakto Webhook] User may already exist, fetching...')
        const { data: fetchedUser } = await supabaseAdmin
          .from('users_access')
          .select('id')
          .eq('email', email)
          .single()

        if (fetchedUser) {
          userId = fetchedUser.id
        } else {
          console.error('[Cakto Webhook] Error creating user:', error)
          throw new Error('Failed to create user')
        }
      } else {
        console.error('[Cakto Webhook] Error creating user:', error)
        throw new Error('Failed to create user')
      }
    } else if (newUser) {
      userId = newUser.id
      console.log('[Cakto Webhook] Created new user:', userId)
    } else {
      throw new Error('Failed to create user - no data returned')
    }
  }

  // 2. Register product in user_products table (using content product ID for content access)
  console.log('[Cakto Webhook] Registering product for user:', userId)
  console.log('[Cakto Webhook] Content Product ID:', contentProductId)

  // Check if product already exists for this user
  const { data: existingProduct } = await supabaseAdmin
    .from('user_products')
    .select('id, status')
    .eq('user_id', userId)
    .eq('product_id', contentProductId)
    .maybeSingle()

  if (existingProduct) {
    // Update existing product to active
    console.log('[Cakto Webhook] Product already exists, updating to active')
    await supabaseAdmin
      .from('user_products')
      .update({
        status: 'active',
        cakto_transaction_id: transactionId,
        purchase_date: now.toISOString(),
        expiration_date: dataExpiracao.toISOString()
      })
      .eq('id', existingProduct.id)
  } else {
    // Insert new product with content product ID
    const { error: insertError } = await supabaseAdmin
      .from('user_products')
      .insert({
        user_id: userId,
        product_id: contentProductId, // Use content product ID for content access
        product_name: contentProductName,
        cakto_transaction_id: transactionId,
        is_order_bump: isOrderBump,
        parent_transaction_id: parentOrderId,
        status: 'active',
        purchase_date: now.toISOString(),
        expiration_date: dataExpiracao.toISOString()
      })

    if (insertError) {
      console.error('[Cakto Webhook] Error inserting product:', insertError)
      if (insertError.code === '23505') {
        console.log('[Cakto Webhook] Product already exists (race condition), updating')
        await supabaseAdmin
          .from('user_products')
          .update({
            status: 'active',
            purchase_date: now.toISOString(),
            expiration_date: dataExpiracao.toISOString()
          })
          .eq('user_id', userId)
          .eq('product_id', contentProductId)
      } else {
        throw new Error(`Failed to insert product: ${insertError.message}`)
      }
    } else {
      console.log('[Cakto Webhook] Product registered:', contentProductId, '(mapped from Cakto:', caktoProductId, ')')
    }
  }

  console.log('[Cakto Webhook] ===== PURCHASE PROCESSED =====')
}

async function handlePurchaseRefunded(email: string, transactionId: string, caktoProductId: string) {
  console.log('[Cakto Webhook] Processing refund for:', email)

  // Map Cakto product ID to content product ID
  const contentProductId = getCaktoContentProductId(caktoProductId)

  // Update users_access status
  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'refunded' })
    .eq('email', email)
    .eq('cakto_transaction_id', transactionId)

  // Update product status
  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (user) {
    await supabaseAdmin
      .from('user_products')
      .update({ status: 'refunded' })
      .eq('user_id', user.id)
      .eq('product_id', contentProductId)

    // Check if user has any remaining active products
    const { data: activeProducts } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    // If no active products, deactivate sessions
    if (!activeProducts || activeProducts.length === 0) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)

      console.log('[Cakto Webhook] All sessions deactivated for user:', email)
    }
  }

  console.log('[Cakto Webhook] Refund processed for:', email)
}

async function handlePurchaseCanceled(email: string, transactionId: string, caktoProductId: string) {
  console.log('[Cakto Webhook] Processing cancellation for:', email)

  // Map Cakto product ID to content product ID
  const contentProductId = getCaktoContentProductId(caktoProductId)

  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'cancelled' })
    .eq('email', email)
    .eq('cakto_transaction_id', transactionId)

  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (user) {
    await supabaseAdmin
      .from('user_products')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('product_id', contentProductId)

    const { data: activeProducts } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (!activeProducts || activeProducts.length === 0) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)

      console.log('[Cakto Webhook] All sessions deactivated for user:', email)
    }
  }

  console.log('[Cakto Webhook] Cancellation processed for:', email)
}

async function handleChargeback(email: string, transactionId: string, caktoProductId: string) {
  console.log('[Cakto Webhook] Processing chargeback for:', email)

  // Map Cakto product ID to content product ID
  const contentProductId = getCaktoContentProductId(caktoProductId)

  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'chargeback' })
    .eq('email', email)
    .eq('cakto_transaction_id', transactionId)

  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (user) {
    await supabaseAdmin
      .from('user_products')
      .update({ status: 'chargeback' })
      .eq('user_id', user.id)
      .eq('product_id', contentProductId)

    const { data: activeProducts } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (!activeProducts || activeProducts.length === 0) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)

      console.log('[Cakto Webhook] All sessions deactivated for user:', email)
    }
  }

  console.log('[Cakto Webhook] Chargeback processed for:', email)
}

async function handleSubscriptionCanceled(email: string) {
  console.log('[Cakto Webhook] Processing subscription cancellation for:', email)

  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'cancelled' })
    .eq('email', email)

  console.log('[Cakto Webhook] Subscription cancellation processed for:', email)
}
