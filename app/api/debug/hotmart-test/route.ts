import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Endpoint de DEBUG para testar webhooks da Hotmart
 * Este endpoint aceita qualquer payload e mostra informações detalhadas
 * REMOVER APÓS DEBUG
 */

function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-hotmart-hottok')
    const secret = process.env.HOTMART_WEBHOOK_SECRET || ''

    // Calcular a assinatura esperada
    const calculatedSignature = generateSignature(rawBody, secret)

    const debugInfo = {
      timestamp: new Date().toISOString(),
      headers: {
        'x-hotmart-hottok': signature,
        'content-type': request.headers.get('content-type'),
        'user-agent': request.headers.get('user-agent'),
      },
      body: {
        length: rawBody.length,
        first200Chars: rawBody.substring(0, 200),
        parsed: (() => {
          try {
            return JSON.parse(rawBody)
          } catch {
            return 'Failed to parse JSON'
          }
        })(),
      },
      signature: {
        received: signature || 'NOT PROVIDED',
        calculated: calculatedSignature,
        secret: {
          configured: !!secret,
          length: secret.length,
          firstChars: secret.substring(0, 10),
        },
        match: signature === calculatedSignature,
      },
    }

    console.log('[Hotmart Debug] Request received:', JSON.stringify(debugInfo, null, 2))

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      message: debugInfo.signature.match
        ? '✅ Signature is VALID!'
        : '❌ Signature is INVALID - see debug info',
    })
  } catch (error) {
    console.error('[Hotmart Debug] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
