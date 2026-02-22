// @ts-nocheck - Supabase type inference issues during build with placeholder env vars
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, transactionId, productId, productName } = body

    console.log('[Debug Webhook Test] Testing user creation with:', {
      email,
      transactionId,
      productId,
      productName
    })

    // Test 1: Check if users_access table exists and structure
    try {
      const { data: tableInfo, error: tableError } = await supabaseAdmin
        .from('users_access')
        .select('*')
        .limit(1)

      console.log('[Debug Webhook Test] users_access table check:', { 
        hasData: !!tableInfo, 
        error: tableError 
      })
    } catch (e) {
      console.error('[Debug Webhook Test] Error accessing users_access:', e)
    }

    // Test 2: Check if user_products table exists and structure
    try {
      const { data: tableInfo, error: tableError } = await supabaseAdmin
        .from('user_products')
        .select('*')
        .limit(1)

      console.log('[Debug Webhook Test] user_products table check:', { 
        hasData: !!tableInfo, 
        error: tableError 
      })
    } catch (e) {
      console.error('[Debug Webhook Test] Error accessing user_products:', e)
    }

    // Test 3: Try to create a user
    const now = new Date()
    const dataExpiracao = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

    try {
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users_access')
        .insert({
          email: email || 'test@example.com',
          status_compra: 'active',
          hotmart_transaction_id: transactionId || 'TEST-123',
          hotmart_subscriber_code: null,
          product_id: productId || 'TEST-PRODUCT',
          product_name: productName || 'Test Product',
          data_compra: now.toISOString(),
          data_expiracao: dataExpiracao.toISOString(),
          tentativas_login: 0
        })
        .select('id')
        .single()

      console.log('[Debug Webhook Test] User creation result:', { 
        user: newUser, 
        error: userError 
      })

      if (userError) {
        return NextResponse.json({ 
          error: 'User creation failed', 
          details: userError 
        }, { status: 500 })
      }

      // Test 4: Try to create user product
      if (newUser) {
        try {
          const { data: userProduct, error: productError } = await supabaseAdmin
            .from('user_products')
            .insert({
              user_id: newUser.id,
              product_id: productId || 'TEST-PRODUCT',
              product_name: productName || 'Test Product',
              hotmart_transaction_id: transactionId || 'TEST-123',
              is_order_bump: false,
              parent_transaction_id: null,
              status: 'active',
              purchase_date: now.toISOString(),
              expiration_date: dataExpiracao.toISOString()
            })
            .select('*')
            .single()

          console.log('[Debug Webhook Test] User product creation result:', { 
            product: userProduct, 
            error: productError 
          })

          if (productError) {
            return NextResponse.json({ 
              error: 'User product creation failed', 
              details: productError 
            }, { status: 500 })
          }
        } catch (e) {
          console.error('[Debug Webhook Test] Exception creating user product:', e)
          return NextResponse.json({ 
            error: 'Exception creating user product', 
            details: e instanceof Error ? e.message : 'Unknown error'
          }, { status: 500 })
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Debug test completed successfully',
        userId: newUser?.id
      })

    } catch (e) {
      console.error('[Debug Webhook Test] Exception creating user:', e)
      return NextResponse.json({ 
        error: 'Exception creating user', 
        details: e instanceof Error ? e.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('[Debug Webhook Test] General error:', error)
    return NextResponse.json({ 
      error: 'General error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
