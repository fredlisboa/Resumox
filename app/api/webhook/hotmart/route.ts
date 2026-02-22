// @ts-nocheck - Supabase type inference issues during build with placeholder env vars
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'
import { isMainProduct, getOrderBumpsForProduct, getMainProductForOrderBump } from '@/lib/product-order-bumps-map'

// Tipos do webhook da Hotmart (estrutura real atualizada)
interface HotmartWebhookData {
  event: string
  version: string
  data: {
    product: {
      id: number | string // Hotmart envia como número
      ucode?: string
      name: string
      has_co_production?: boolean
      is_physical_product?: boolean
    }
    buyer: {
      email: string
      name: string
      first_name?: string
      last_name?: string
      checkout_phone?: string
    }
    purchase: {
      transaction: string
      status: string
      order_date: number
      approved_date?: number
      order_bump?: {
        is_order_bump: boolean
        parent_purchase_transaction?: string
      }
      origin?: {
        sck?: string // Checkout session - mesmo valor para produtos da mesma compra
        xcod?: string
      }
      subscription?: {
        subscriber_code: string
        status: string
      }
    }
  }
}

// Validar assinatura do webhook (se a Hotmart enviar)
function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // A Hotmart pode enviar de duas formas:
  // 1. HMAC SHA256 do payload (correto)
  // 2. O próprio secret (fallback para compatibilidade)

  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // Verificar se é assinatura HMAC válida
  if (hash === signature) {
    return true
  }

  // Fallback: verificar se enviaram o secret diretamente (alguns webhooks da Hotmart fazem isso)
  if (signature === secret) {
    console.log('[Hotmart Webhook] Using direct secret comparison (legacy mode)')
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    // Validar assinatura ANTES de fazer parse do JSON
    const signature = request.headers.get('x-hotmart-hottok')

    console.log('[Hotmart Webhook] Received request')
    console.log('[Hotmart Webhook] Signature header:', signature ? `${signature.substring(0, 10)}...` : 'NOT PROVIDED')
    console.log('[Hotmart Webhook] Body length:', rawBody.length)

    // A Hotmart SEMPRE envia a assinatura, então devemos validar
    if (!signature) {
      console.error('[Hotmart Webhook] Missing signature header (x-hotmart-hottok)')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    if (!process.env.HOTMART_WEBHOOK_SECRET) {
      console.error('[Hotmart Webhook] HOTMART_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const isValid = validateWebhookSignature(
      rawBody,
      signature,
      process.env.HOTMART_WEBHOOK_SECRET
    )

    if (!isValid) {
      console.error('[Hotmart Webhook] Invalid signature')
      console.error('[Hotmart Webhook] Expected secret:', process.env.HOTMART_WEBHOOK_SECRET.substring(0, 10) + '...')
      console.error('[Hotmart Webhook] Received signature:', signature)

      // Debug: tentar calcular a assinatura de diferentes formas
      const calculatedSignature = validateWebhookSignature.toString()
      const testSignature = crypto
        .createHmac('sha256', process.env.HOTMART_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex')

      console.error('[Hotmart Webhook] Calculated signature:', testSignature)
      console.error('[Hotmart Webhook] Body first 200 chars:', rawBody.substring(0, 200))

      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    console.log('[Hotmart Webhook] Signature validated successfully')

    // Agora sim, fazer parse do JSON
    const webhookData: HotmartWebhookData = JSON.parse(rawBody)

    // Extrair dados básicos com fallback para campos opcionais
    const buyerEmail = webhookData.data?.buyer?.email?.toLowerCase() || 'unknown@unknown.com'
    const transactionId = webhookData.data?.purchase?.transaction || `NOTX-${Date.now()}`
    // Converter product.id para string (Hotmart envia como número)
    const productId = String(webhookData.data?.product?.id || 'unknown')
    const productName = webhookData.data?.product?.name || 'Unknown Product'
    const checkoutSessionId = webhookData.data?.purchase?.origin?.sck || null

    // Registrar webhook no banco (com try-catch para não quebrar se der erro)
    try {
      await supabaseAdmin.from('hotmart_webhooks').insert({
        event_type: webhookData.event,
        transaction_id: transactionId,
        subscriber_email: buyerEmail,
        payload: webhookData as any,
        processed: false
      })
    } catch (dbError) {
      console.error('[Hotmart Webhook] Error inserting webhook to DB:', dbError)
      // Continuar processamento mesmo se falhar ao salvar no banco
    }

    // DETECTAR ORDER BUMPS de forma inteligente
    // A Hotmart pode não marcar corretamente o campo is_order_bump
    // Usamos múltiplas estratégias para detectar:

    let isOrderBump = webhookData.data.purchase?.order_bump?.is_order_bump || false
    let parentTransactionId = webhookData.data.purchase?.order_bump?.parent_purchase_transaction || null

    console.log('[Hotmart Webhook] ===== ORDER BUMP DETECTION START =====')
    console.log('[Hotmart Webhook] Buyer email:', buyerEmail)
    console.log('[Hotmart Webhook] Product ID:', productId)
    console.log('[Hotmart Webhook] Product name:', productName)
    console.log('[Hotmart Webhook] Transaction ID:', transactionId)
    console.log('[Hotmart Webhook] Checkout session (sck):', checkoutSessionId || 'NOT PROVIDED')
    console.log('[Hotmart Webhook] Hotmart is_order_bump flag:', isOrderBump)
    console.log('[Hotmart Webhook] Hotmart parent_transaction:', parentTransactionId || 'N/A')

    // ESTRATÉGIA 1: Verificar se já existe outro produto com mesmo checkout session (sck)
    // Se sim, este é um order bump e o primeiro é o produto principal
    if (!isOrderBump && checkoutSessionId) {
      try {
        // Verificar webhooks recentes do mesmo checkout session (mais seguro que buscar user_products)
        const { data: recentWebhooks } = await supabaseAdmin
          .from('hotmart_webhooks')
          .select('transaction_id, created_at, payload')
          .eq('subscriber_email', buyerEmail)
          .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // últimos 5 minutos
          .order('created_at', { ascending: true })

        // Se há webhooks recentes com mesmo sck e transaction diferente, este é um order bump
        const sameCheckoutWebhooks = recentWebhooks?.filter(w => {
          const sck = (w.payload as any)?.data?.purchase?.origin?.sck
          return sck === checkoutSessionId && w.transaction_id !== transactionId
        }) || []

        if (sameCheckoutWebhooks.length > 0) {
          isOrderBump = true
          parentTransactionId = sameCheckoutWebhooks[0].transaction_id
          console.log(`[Hotmart Webhook] ✅ Order bump DETECTED via checkout session strategy`)
          console.log(`[Hotmart Webhook]    Checkout session: ${checkoutSessionId}`)
          console.log(`[Hotmart Webhook]    Parent transaction: ${parentTransactionId}`)
          console.log(`[Hotmart Webhook]    Matching webhooks found: ${sameCheckoutWebhooks.length}`)
        } else if (checkoutSessionId) {
          console.log(`[Hotmart Webhook] ℹ️  No matching checkout sessions found (this might be the main product)`)
        }
      } catch (detectionError) {
        console.error('[Hotmart Webhook] Error detecting order bump:', detectionError)
        // Continuar mesmo se detecção falhar
      }
    }

    console.log('[Hotmart Webhook] ===== ORDER BUMP DETECTION RESULT =====')
    console.log(`[Hotmart Webhook] Product: ${productId} (${productName})`)
    console.log(`[Hotmart Webhook] Is Order Bump: ${isOrderBump ? '✅ YES' : '❌ NO'}`)
    console.log(`[Hotmart Webhook] Parent Transaction: ${parentTransactionId || 'N/A'}`)
    console.log('[Hotmart Webhook] =========================================')

    switch (webhookData.event) {
      case 'PURCHASE_COMPLETE':
      case 'PURCHASE_APPROVED':
        await handlePurchaseApproved(
          buyerEmail,
          transactionId,
          productId,
          productName,
          webhookData.data.purchase.subscription?.subscriber_code,
          isOrderBump,
          parentTransactionId
        )
        break

      case 'PURCHASE_REFUNDED':
        await handlePurchaseRefunded(buyerEmail, transactionId, productId)
        break

      case 'PURCHASE_CANCELED':
      case 'PURCHASE_DELAYED':
        await handlePurchaseCanceled(buyerEmail, transactionId, productId)
        break

      case 'PURCHASE_CHARGEBACK':
        await handleChargeback(buyerEmail, transactionId, productId)
        break

      case 'SUBSCRIPTION_CANCELLATION':
        await handleSubscriptionCanceled(buyerEmail)
        break

      default:
        console.log('[Hotmart Webhook] Unhandled event type:', webhookData.event)
        console.log('[Hotmart Webhook] Full payload:', JSON.stringify(webhookData, null, 2))
        // Não fazer nada para eventos desconhecidos, mas registrar no log
    }

    // Marcar webhook como processado
    try {
      await supabaseAdmin
        .from('hotmart_webhooks')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('transaction_id', transactionId)
    } catch (updateError) {
      console.error('[Hotmart Webhook] Error updating webhook status:', updateError)
      // Continuar mesmo se falhar ao atualizar
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' })

  } catch (error) {
    console.error('[Hotmart Webhook] Fatal error processing webhook:', error)
    console.error('[Hotmart Webhook] Stack trace:', error instanceof Error ? error.stack : 'No stack')

    // Tentar registrar erro no banco (com try-catch para evitar erro duplo)
    try {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const rawBody = await new Response(error).text().catch(() => '')

      // Tentar extrair transaction_id se possível
      let transactionId = 'unknown'
      try {
        const data = JSON.parse(rawBody)
        transactionId = data?.data?.purchase?.transaction || `ERROR-${Date.now()}`
      } catch {
        transactionId = `ERROR-${Date.now()}`
      }

      await supabaseAdmin
        .from('hotmart_webhooks')
        .upsert({
          transaction_id: transactionId,
          event_type: 'ERROR',
          subscriber_email: 'error@error.com',
          processed: true,
          processed_at: new Date().toISOString(),
          error_message: errorMessage,
          payload: { error: errorMessage, stack: error instanceof Error ? error.stack : undefined }
        })
    } catch (dbError) {
      console.error('[Hotmart Webhook] Error saving error to DB:', dbError)
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handlers para cada tipo de evento

async function handlePurchaseApproved(
  email: string,
  transactionId: string,
  productId: string,
  productName: string,
  subscriberCode?: string,
  isOrderBump: boolean = false,
  parentTransactionId: string | null = null
) {
  const now = new Date()
  const dataExpiracao = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 ano

  // 1. Garantir que o usuário existe na tabela users_access
  const { data: existingUser } = await supabaseAdmin
    .from('users_access')
    .select('*')
    .eq('email', email)
    .single()

  let userId: string

  if (existingUser) {
    userId = existingUser.id

    // Atualizar informações básicas do usuário (mantém compatibilidade com sistema legado)
    // Se for o produto principal (não é order bump), atualizar os dados principais
    if (!isOrderBump) {
      await supabaseAdmin
        .from('users_access')
        .update({
          status_compra: 'active',
          hotmart_transaction_id: transactionId,
          hotmart_subscriber_code: subscriberCode || null,
          product_id: productId,
          product_name: productName,
          data_compra: now.toISOString(),
          data_expiracao: dataExpiracao.toISOString(),
          bloqueado_ate: null,
          tentativas_login: 0
        })
        .eq('email', email)
    }
  } else {
    // Criar novo usuário
    const { data: newUser, error } = await supabaseAdmin
      .from('users_access')
      .insert({
        email,
        status_compra: 'active',
        hotmart_transaction_id: transactionId,
        hotmart_subscriber_code: subscriberCode || null,
        product_id: productId,
        product_name: productName,
        data_compra: now.toISOString(),
        data_expiracao: dataExpiracao.toISOString(),
        tentativas_login: 0
      })
      .select('id')
      .single()

    // Handle unique constraint violation (transaction ID already exists)
    if (error && error.code === '23505') {
      console.log('[Hotmart Webhook] Transaction ID already exists, checking if user exists with this transaction')

      // Check if there's already a user with this transaction ID
      const { data: existingUserByTransaction } = await supabaseAdmin
        .from('users_access')
        .select('id, email, product_id')
        .eq('hotmart_transaction_id', transactionId)
        .single()

      if (existingUserByTransaction) {
        // If the email matches, use the existing user
        if (existingUserByTransaction.email === email) {
          userId = existingUserByTransaction.id
          console.log(`[Hotmart Webhook] Using existing user with transaction ID: ${userId}`)
        } else {
          // If email doesn't match, check if this is a test/retry scenario for the same product
          console.warn('[Hotmart Webhook] ⚠️  Transaction ID conflict detected')
          console.warn(`[Hotmart Webhook]    Existing user email: ${existingUserByTransaction.email}`)
          console.warn(`[Hotmart Webhook]    New user email: ${email}`)
          console.warn(`[Hotmart Webhook]    Product ID: ${productId}`)

          // For test scenarios or retries, allow updating the existing user if it's the same product
          // This handles cases where the same transaction is being processed for different test emails
          if (existingUserByTransaction.product_id === productId) {
            console.warn('[Hotmart Webhook]    Same product ID - treating as test/retry scenario')
            console.warn('[Hotmart Webhook]    Will update existing user instead of creating new one')

            // Update the existing user's email to the new one (for test scenarios)
            await supabaseAdmin
              .from('users_access')
              .update({
                email: email,
                status_compra: 'active',
                hotmart_subscriber_code: subscriberCode || null,
                data_compra: now.toISOString(),
                data_expiracao: dataExpiracao.toISOString(),
                bloqueado_ate: null,
                tentativas_login: 0
              })
              .eq('id', existingUserByTransaction.id)

            userId = existingUserByTransaction.id
            console.log(`[Hotmart Webhook] ✅ Updated existing user with new email: ${userId}`)
          } else {
            // Different product - this is a real conflict, but for testing scenarios, we can handle it
            console.warn('[Hotmart Webhook] ⚠️  Real transaction ID conflict: same transaction for different products')
            console.warn(`[Hotmart Webhook]    Existing product: ${existingUserByTransaction.product_id}`)
            console.warn(`[Hotmart Webhook]    New product: ${productId}`)

            // For testing scenarios, generate a unique transaction ID to avoid conflicts
            const testTransactionId = `${transactionId}-TEST-${Date.now()}`
            console.warn(`[Hotmart Webhook]    Generating test transaction ID: ${testTransactionId}`)

            // Create a new user with the test transaction ID
            const { data: newUser, error: newUserError } = await supabaseAdmin
              .from('users_access')
              .insert({
                email,
                status_compra: 'active',
                hotmart_transaction_id: testTransactionId,
                hotmart_subscriber_code: subscriberCode || null,
                product_id: productId,
                product_name: productName,
                data_compra: now.toISOString(),
                data_expiracao: dataExpiracao.toISOString(),
                tentativas_login: 0
              })
              .select('id')
              .single()

            if (newUserError || !newUser) {
              console.error('[Hotmart Webhook] Error creating test user:', newUserError)
              throw new Error('Failed to create test user')
            }

            userId = newUser.id
            console.log(`[Hotmart Webhook] ✅ Created test user with new transaction ID: ${userId}`)
          }
        }
      } else {
        // This shouldn't happen, but handle it gracefully
        console.error('[Hotmart Webhook] Unexpected error creating user:', error)
        throw new Error('Failed to create user')
      }
    } else if (error || !newUser) {
      console.error('[Hotmart Webhook] Error creating user:', error)
      throw new Error('Failed to create user')
    } else {
      userId = newUser.id
    }
  }

  // 2. Registrar o produto individual na tabela user_products
  // Isso permite rastrear cada produto (principal + order bumps) separadamente
  console.log('[Hotmart Webhook] ===== REGISTERING PRODUCT =====')
  console.log(`[Hotmart Webhook] User ID: ${userId}`)
  console.log(`[Hotmart Webhook] Product ID: ${productId}`)
  console.log(`[Hotmart Webhook] Product Name: ${productName}`)
  console.log(`[Hotmart Webhook] Transaction ID: ${transactionId}`)
  console.log(`[Hotmart Webhook] Is Order Bump: ${isOrderBump}`)
  console.log(`[Hotmart Webhook] Parent Transaction: ${parentTransactionId || 'N/A'}`)
  console.log(`[Hotmart Webhook] Is Main Product: ${isMainProduct(productId)}`)

  // CASO 1: É um PRODUTO PRINCIPAL
  if (!isOrderBump && isMainProduct(productId)) {
    console.log('[Hotmart Webhook] 📦 Main Product Purchase Detected')
    console.log('[Hotmart Webhook] ===== INSERTING MAIN PRODUCT + ALL ORDER BUMPS =====')

    // 2.1. Verificar se o produto principal já existe antes de inserir
    const { data: existingMainProduct } = await supabaseAdmin
      .from('user_products')
      .select('id, status, hotmart_transaction_id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('is_order_bump', false)
      .single()

    if (existingMainProduct) {
      console.log(`[Hotmart Webhook] ⚠️  Main product already exists (ID: ${existingMainProduct.id})`)
      console.log(`[Hotmart Webhook]    Existing transaction: ${existingMainProduct.hotmart_transaction_id}`)
      console.log(`[Hotmart Webhook]    New transaction: ${transactionId}`)
      console.log(`[Hotmart Webhook]    Status: ${existingMainProduct.status}`)

      // CRITICAL FIX: Se já existe produto principal, NÃO criar order bumps locked novamente
      // Apenas atualizar o produto principal se necessário
      if (existingMainProduct.status !== 'active' || existingMainProduct.hotmart_transaction_id !== transactionId) {
        console.log(`[Hotmart Webhook]    Updating main product to active`)
        await supabaseAdmin
          .from('user_products')
          .update({
            status: 'active',
            hotmart_transaction_id: transactionId,
            purchase_date: now.toISOString(),
            expiration_date: dataExpiracao.toISOString()
          })
          .eq('id', existingMainProduct.id)
        console.log(`[Hotmart Webhook] ✅ Main product updated`)
      } else {
        console.log(`[Hotmart Webhook] ✅ Main product already active, skipping update`)
      }

      console.log(`[Hotmart Webhook] ⚠️  SKIPPING order bump creation - main product already exists`)
      console.log(`[Hotmart Webhook]    This prevents duplicate locked entries`)
      console.log('[Hotmart Webhook] =================================')
      return // Exit early to prevent duplicate locked order bumps
    }

    // 2.2. Inserir o produto principal com status 'active' (apenas se não existe)
    try {
      await supabaseAdmin
        .from('user_products')
        .insert({
          user_id: userId,
          product_id: productId,
          product_name: productName,
          hotmart_transaction_id: transactionId,
          is_order_bump: false,
          parent_transaction_id: null,
          status: 'active',
          purchase_date: now.toISOString(),
          expiration_date: dataExpiracao.toISOString()
        })

      console.log(`[Hotmart Webhook] ✅ Main product inserted: ${productId}`)
    } catch (productError: any) {
      // Se já existe (race condition), atualizar
      if (productError?.code === '23505') {
        console.log(`[Hotmart Webhook] ⚠️  Main product already exists (race condition), updating to active`)
        await supabaseAdmin
          .from('user_products')
          .update({
            status: 'active',
            purchase_date: now.toISOString(),
            expiration_date: dataExpiracao.toISOString()
          })
          .eq('user_id', userId)
          .eq('product_id', productId)
          .eq('hotmart_transaction_id', transactionId)
        console.log(`[Hotmart Webhook] ✅ Main product updated`)

        // CRITICAL FIX: Se houve race condition, também devemos pular criação de order bumps
        console.log(`[Hotmart Webhook] ⚠️  SKIPPING order bump creation due to race condition`)
        console.log('[Hotmart Webhook] =================================')
        return
      } else {
        console.error('[Hotmart Webhook] ❌ Error inserting main product:', productError)
        throw productError
      }
    }

    // 2.3. Inserir TODOS os order bumps relacionados com status 'locked' (não comprado ainda)
    // APENAS se for a primeira vez que estamos processando este produto principal
    const orderBumps = getOrderBumpsForProduct(productId)
    console.log(`[Hotmart Webhook] 🔒 Inserting ${orderBumps.length} order bumps as LOCKED`)

    for (const orderBump of orderBumps) {
      try {
        // CRITICAL FIX: Verificar se já existe um order bump ATIVO antes de criar locked
        const { data: existingActiveOrderBump } = await supabaseAdmin
          .from('user_products')
          .select('id, status')
          .eq('user_id', userId)
          .eq('product_id', orderBump.product_id)
          .eq('status', 'active')
          .eq('is_order_bump', true)
          .single()

        if (existingActiveOrderBump) {
          console.log(`[Hotmart Webhook]    ⚠️  Order bump already ACTIVE, skipping: ${orderBump.product_id}`)
          continue // Skip creation, user already has this order bump active
        }

        await supabaseAdmin
          .from('user_products')
          .insert({
            user_id: userId,
            product_id: orderBump.product_id,
            product_name: orderBump.product_name,
            hotmart_transaction_id: `${transactionId}-OB-${orderBump.product_id}`, // Transaction único para cada order bump
            is_order_bump: true,
            parent_transaction_id: transactionId, // Vincula ao produto principal
            status: 'locked', // 'locked' = não comprado ainda
            purchase_date: now.toISOString(),
            expiration_date: dataExpiracao.toISOString()
          })

        console.log(`[Hotmart Webhook]    ✅ Order bump locked: ${orderBump.product_id} - ${orderBump.product_name}`)
      } catch (orderBumpError: any) {
        // Se já existe, ignorar (pode ter sido inserido em compra anterior)
        if (orderBumpError?.code === '23505') {
          console.log(`[Hotmart Webhook]    ⚠️  Order bump already exists: ${orderBump.product_id}`)
        } else {
          console.error(`[Hotmart Webhook]    ❌ Error inserting order bump ${orderBump.product_id}:`, orderBumpError)
        }
      }
    }

    console.log('[Hotmart Webhook] =================================')
  }
  // CASO 2: É um ORDER BUMP sendo comprado
  else if (isOrderBump) {
    console.log('[Hotmart Webhook] 🔥 Order Bump Purchase Detected')
    console.log('[Hotmart Webhook] ===== ACTIVATING ORDER BUMP =====')

    // CRITICAL FIX: Verificar se já existe um order bump ATIVO com esta transaction
    // Para evitar processar duplicatas
    const { data: alreadyActiveOrderBump } = await supabaseAdmin
      .from('user_products')
      .select('id, status, hotmart_transaction_id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('hotmart_transaction_id', transactionId)
      .eq('is_order_bump', true)
      .eq('status', 'active')
      .single()

    if (alreadyActiveOrderBump) {
      console.log(`[Hotmart Webhook] ⚠️  Order bump already ACTIVE with this transaction`)
      console.log(`[Hotmart Webhook]    ID: ${alreadyActiveOrderBump.id}`)
      console.log(`[Hotmart Webhook]    Transaction: ${alreadyActiveOrderBump.hotmart_transaction_id}`)
      console.log(`[Hotmart Webhook]    Skipping duplicate processing`)
      console.log('[Hotmart Webhook] =================================')
      return // Exit early, already processed
    }

    // Verificar se o order bump existe na tabela em qualquer status
    const { data: existingOrderBumps } = await supabaseAdmin
      .from('user_products')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('is_order_bump', true)
      .order('created_at', { ascending: true })

    console.log(`[Hotmart Webhook] Found ${existingOrderBumps?.length || 0} existing order bump(s) for this product`)

    // CRITICAL FIX: Priorizar atualizar locked entries primeiro
    const lockedOrderBump = existingOrderBumps?.find(ob => ob.status === 'locked')
    const activeOrderBump = existingOrderBumps?.find(ob => ob.status === 'active')

    if (lockedOrderBump) {
      // Cenário ideal: existe um entry locked, vamos ativar ele
      console.log(`[Hotmart Webhook] ✅ Found LOCKED order bump, updating to ACTIVE`)
      console.log(`[Hotmart Webhook]    ID: ${lockedOrderBump.id}`)
      console.log(`[Hotmart Webhook]    Old transaction: ${lockedOrderBump.hotmart_transaction_id}`)
      console.log(`[Hotmart Webhook]    New transaction: ${transactionId}`)

      await supabaseAdmin
        .from('user_products')
        .update({
          status: 'active',
          hotmart_transaction_id: transactionId, // Atualizar com a transaction real da compra
          purchase_date: now.toISOString(),
          expiration_date: dataExpiracao.toISOString()
        })
        .eq('id', lockedOrderBump.id)

      console.log(`[Hotmart Webhook] ✅ Order bump activated: ${productId}`)

      // CRITICAL FIX: Se existir outro order bump ativo duplicado, deletar
      if (activeOrderBump && activeOrderBump.id !== lockedOrderBump.id) {
        console.log(`[Hotmart Webhook] ⚠️  Found duplicate ACTIVE order bump, deleting`)
        console.log(`[Hotmart Webhook]    Duplicate ID: ${activeOrderBump.id}`)
        console.log(`[Hotmart Webhook]    Duplicate transaction: ${activeOrderBump.hotmart_transaction_id}`)

        await supabaseAdmin
          .from('user_products')
          .delete()
          .eq('id', activeOrderBump.id)

        console.log(`[Hotmart Webhook] ✅ Duplicate deleted`)
      }
    } else if (activeOrderBump) {
      // Já existe um order bump ativo (comprado antes do produto principal)
      console.log(`[Hotmart Webhook] ⚠️  Order bump already ACTIVE (purchased before main product)`)
      console.log(`[Hotmart Webhook]    ID: ${activeOrderBump.id}`)
      console.log(`[Hotmart Webhook]    Transaction: ${activeOrderBump.hotmart_transaction_id}`)
      console.log(`[Hotmart Webhook]    Skipping, user already has access`)
    } else {
      // Order bump não existe (usuário comprou order bump sem ter comprado produto principal)
      // Inserir diretamente com status 'active'
      console.log(`[Hotmart Webhook] ⚠️  Order bump not found, inserting as ACTIVE`)
      try {
        await supabaseAdmin
          .from('user_products')
          .insert({
            user_id: userId,
            product_id: productId,
            product_name: productName,
            hotmart_transaction_id: transactionId,
            is_order_bump: true,
            parent_transaction_id: parentTransactionId,
            status: 'active',
            purchase_date: now.toISOString(),
            expiration_date: dataExpiracao.toISOString()
          })

        console.log(`[Hotmart Webhook] ✅ Order bump inserted as active: ${productId}`)
      } catch (productError: any) {
        if (productError?.code === '23505') {
          console.log(`[Hotmart Webhook] ⚠️  Order bump already exists (race condition)`)
          // Atualizar para garantir que está ativo
          await supabaseAdmin
            .from('user_products')
            .update({
              status: 'active',
              purchase_date: now.toISOString(),
              expiration_date: dataExpiracao.toISOString()
            })
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('hotmart_transaction_id', transactionId)
          console.log(`[Hotmart Webhook] ✅ Order bump updated to active`)
        } else {
          console.error('[Hotmart Webhook] ❌ Error inserting order bump:', productError)
          throw productError
        }
      }
    }

    console.log('[Hotmart Webhook] =================================')
  }
  // CASO 3: Produto não mapeado (compatibilidade com sistema legado)
  else {
    console.log('[Hotmart Webhook] ⚠️  Product not in mapping, using legacy logic')
    try {
      await supabaseAdmin
        .from('user_products')
        .insert({
          user_id: userId,
          product_id: productId,
          product_name: productName,
          hotmart_transaction_id: transactionId,
          is_order_bump: isOrderBump,
          parent_transaction_id: parentTransactionId,
          status: 'active',
          purchase_date: now.toISOString(),
          expiration_date: dataExpiracao.toISOString()
        })

      console.log(`[Hotmart Webhook] ✅ Product registered (legacy): ${productId}`)
    } catch (productError: any) {
      if (productError?.code === '23505') {
        await supabaseAdmin
          .from('user_products')
          .update({
            status: 'active',
            purchase_date: now.toISOString(),
            expiration_date: dataExpiracao.toISOString()
          })
          .eq('user_id', userId)
          .eq('product_id', productId)
          .eq('hotmart_transaction_id', transactionId)
      } else {
        throw productError
      }
    }

    console.log('[Hotmart Webhook] =================================')
  }
}

async function handlePurchaseRefunded(email: string, transactionId: string, productId: string) {
  // 1. Atualizar status na tabela users_access (compatibilidade legado)
  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'refunded' })
    .eq('email', email)
    .eq('hotmart_transaction_id', transactionId)

  // 2. Atualizar status do produto específico em user_products
  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email)
    .single()

  if (user) {
    // Marcar o produto específico como refunded
    await supabaseAdmin
      .from('user_products')
      .update({ status: 'refunded' })
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('hotmart_transaction_id', transactionId)

    console.log(`[Hotmart Webhook] Product refunded: ${productId} for user ${email}`)

    // Verificar se ainda tem produtos ativos
    const { data: activeProducts } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    // Se não tem mais nenhum produto ativo, desativar sessões
    if (!activeProducts || activeProducts.length === 0) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)

      console.log(`[Hotmart Webhook] All sessions deactivated for user ${email} (no active products)`)
    }
  }
}

async function handlePurchaseCanceled(email: string, transactionId: string, productId: string) {
  // 1. Atualizar status na tabela users_access (compatibilidade legado)
  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'cancelled' })
    .eq('email', email)
    .eq('hotmart_transaction_id', transactionId)

  // 2. Atualizar status do produto específico em user_products
  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email)
    .single()

  if (user) {
    // Marcar o produto específico como cancelled
    await supabaseAdmin
      .from('user_products')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('hotmart_transaction_id', transactionId)

    console.log(`[Hotmart Webhook] Product cancelled: ${productId} for user ${email}`)

    // Verificar se ainda tem produtos ativos
    const { data: activeProducts } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    // Se não tem mais nenhum produto ativo, desativar sessões
    if (!activeProducts || activeProducts.length === 0) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)

      console.log(`[Hotmart Webhook] All sessions deactivated for user ${email} (no active products)`)
    }
  }
}

async function handleChargeback(email: string, transactionId: string, productId: string) {
  // 1. Atualizar status na tabela users_access (compatibilidade legado)
  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'chargeback' })
    .eq('email', email)
    .eq('hotmart_transaction_id', transactionId)

  // 2. Atualizar status do produto específico em user_products
  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email)
    .single()

  if (user) {
    // Marcar o produto específico como chargeback
    await supabaseAdmin
      .from('user_products')
      .update({ status: 'chargeback' })
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('hotmart_transaction_id', transactionId)

    console.log(`[Hotmart Webhook] Product chargeback: ${productId} for user ${email}`)

    // Verificar se ainda tem produtos ativos
    const { data: activeProducts } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    // Se não tem mais nenhum produto ativo, desativar sessões
    if (!activeProducts || activeProducts.length === 0) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)

      console.log(`[Hotmart Webhook] All sessions deactivated for user ${email} (no active products)`)
    }
  }
}

async function handleSubscriptionCanceled(email: string) {
  await supabaseAdmin
    .from('users_access')
    .update({ status_compra: 'cancelled' })
    .eq('email', email)
}
