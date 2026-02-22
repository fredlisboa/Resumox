import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { ORDER_BUMP_CHECKOUT_URLS, DEFAULT_ORDER_BUMP_CHECKOUT_URL } from '@/lib/product-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Get language filter from query params (optional)
  const { searchParams } = new URL(request.url)
  const languageFilter = searchParams.get('language') // 'pt-BR', 'es', or null for all
  try {
    // Verificar autenticação
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // 1. Buscar todos os produtos do usuário (incluindo locked com status 'locked')
    const { data: userProducts, error: productsError } = await supabaseAdmin
      .from('user_products')
      .select('product_id, status, expiration_date, is_order_bump, hotmart_transaction_id, parent_transaction_id')
      .eq('user_id', user.id)
      .in('status', ['active', 'locked']) // Incluir produtos ativos E locked

    if (productsError) {
      console.error('Error fetching user products:', productsError)
      return NextResponse.json(
        { error: 'Erro ao buscar produtos do usuário' },
        { status: 500 }
      )
    }

    // 2. Filtrar produtos não expirados e separar por status
    const now = new Date()
    const validProducts = (userProducts || [])
      .filter((p: any) => {
        if (!p.expiration_date) return true
        return new Date(p.expiration_date) > now
      })

    // Produtos com status 'active' (comprados e desbloqueados)
    const activeProductIds = validProducts
      .filter((p: any) => p.status === 'active')
      .map((p: any) => p.product_id)

    // Produtos com status 'locked' (inseridos mas não comprados)
    const lockedProductIds = validProducts
      .filter((p: any) => p.status === 'locked')
      .map((p: any) => p.product_id)

    // Pegar transaction IDs dos produtos principais (não order bumps) do usuário
    const mainProductTransactionIds = validProducts
      .filter((p: any) => !p.is_order_bump && p.status === 'active')
      .map((p: any) => p.hotmart_transaction_id)

    console.log('[Contents API] User:', user.email)
    console.log('[Contents API] Active products:', activeProductIds)
    console.log('[Contents API] Locked products:', lockedProductIds)
    console.log('[Contents API] Main product transactions:', mainProductTransactionIds)
    console.log('[Contents API] Total active products:', activeProductIds.length)
    console.log('[Contents API] Total locked products:', lockedProductIds.length)

    // Se o usuário não tem produtos ativos nem locked, retornar vazio
    if (activeProductIds.length === 0 && lockedProductIds.length === 0) {
      console.log('[Contents API] No products found for user')
      return NextResponse.json({
        success: true,
        contents: [],
        message: 'Nenhum produto encontrado'
      })
    }

    // 3. Buscar conteúdos dos produtos ativos + order bumps relacionados
    // Precisamos buscar também os order bumps que pertencem aos produtos principais do usuário
    let contentsQuery = supabaseAdmin
      .from('product_contents')
      .select('*')
      .eq('is_active', true)

    // Apply language filter if specified
    if (languageFilter) {
      contentsQuery = contentsQuery.eq('language', languageFilter)
      console.log('[Contents API] Filtering by language:', languageFilter)
    }

    const { data: allContents, error } = await contentsQuery.order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching contents:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar conteúdos' },
        { status: 500 }
      )
    }

    // 4. Todos os product_ids que o usuário pode ver (ativos + locked)
    const allUserProductIds = [...activeProductIds, ...lockedProductIds]

    console.log('[Contents API] All user product IDs (active + locked):', allUserProductIds)

    // 5. Processar conteúdos:
    // - Conteúdos são mostrados se o usuário possui o product_id (ativo OU locked)
    // - Order bumps ficam locked se status = 'locked' na tabela user_products
    // - Order bumps ficam unlocked se status = 'active' na tabela user_products
    const processedContents = (allContents || [])
      .filter((content: any) => {
        // Mostrar conteúdo se o usuário possui o product_id (ativo ou locked)
        return allUserProductIds.includes(content.product_id)
      })
      .map((content: any) => {
        const isOrderBump = content.status === 'order_bump'

        // Verificar se o produto está na lista de locked (status = 'locked')
        const isLockedProduct = lockedProductIds.includes(content.product_id)

        // Order bump fica locked se:
        // 1. É um order bump E
        // 2. Está na lista de produtos locked (status = 'locked')
        const isLocked = isOrderBump && isLockedProduct

        // Determinar a URL de checkout (com fallback)
        const checkoutUrl = isLocked
          ? (ORDER_BUMP_CHECKOUT_URLS[content.product_id] || DEFAULT_ORDER_BUMP_CHECKOUT_URL)
          : null

        // Log detalhado para order bumps
        if (isOrderBump) {
          console.log(`[Contents API] Order Bump: ${content.title}`)
          console.log(`[Contents API]   - Product ID: ${content.product_id}`)
          console.log(`[Contents API]   - Is locked product: ${isLockedProduct}`)
          console.log(`[Contents API]   - Is locked: ${isLocked}`)
          console.log(`[Contents API]   - Checkout URL: ${checkoutUrl}`)
        }

        return {
          ...content,
          is_locked: isLocked,
          checkout_url: checkoutUrl
        }
      })

    console.log('[Contents API] Total contents returned:', processedContents.length)
    console.log('[Contents API] Locked contents:', processedContents.filter((c: any) => c.is_locked).length)
    console.log('[Contents API] Unlocked contents:', processedContents.filter((c: any) => !c.is_locked).length)

    return NextResponse.json({
      success: true,
      contents: processedContents,
      productCount: activeProductIds.length
    })

  } catch (error) {
    console.error('Contents API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
