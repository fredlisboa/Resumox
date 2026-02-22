// @ts-nocheck - Supabase type inference issues during build with placeholder env vars
import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie, getUserProducts } from '@/lib/auth'

/**
 * GET /api/user/products
 *
 * Retorna todos os produtos que o usuário tem acesso
 * Suporta produtos principais e order bumps
 *
 * Requer autenticação via cookie de sessão
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Validar sessão
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // 2. Buscar produtos do usuário
    const result = await getUserProducts(user.email)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Erro ao buscar produtos' },
        { status: 400 }
      )
    }

    // 3. Formatar resposta
    const products = result.products || []

    // Separar produto principal de order bumps
    const mainProducts = products.filter(p => !p.is_order_bump)
    const orderBumps = products.filter(p => p.is_order_bump)

    return NextResponse.json({
      success: true,
      data: {
        total: products.length,
        mainProducts: mainProducts.map(p => ({
          id: p.id,
          productId: p.product_id,
          productName: p.product_name,
          transactionId: p.hotmart_transaction_id,
          purchaseDate: p.purchase_date,
          expirationDate: p.expiration_date,
          status: p.status
        })),
        orderBumps: orderBumps.map(p => ({
          id: p.id,
          productId: p.product_id,
          productName: p.product_name,
          transactionId: p.hotmart_transaction_id,
          parentTransactionId: p.parent_transaction_id,
          purchaseDate: p.purchase_date,
          expirationDate: p.expiration_date,
          status: p.status
        }))
      }
    })

  } catch (error) {
    console.error('[User Products API] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
