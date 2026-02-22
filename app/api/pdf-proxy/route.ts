import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    console.log('📥 [PDF-PROXY] Nova requisição recebida')

    // Verificar autenticação
    const { valid } = await getSessionFromCookie()

    if (!valid) {
      console.error('❌ [PDF-PROXY] Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    console.log('✅ [PDF-PROXY] Usuário autenticado')

    // Obter a URL do PDF dos parâmetros
    const url = request.nextUrl.searchParams.get('url')
    console.log('🔍 [PDF-PROXY] URL solicitada:', url)

    if (!url) {
      return NextResponse.json(
        { error: 'URL não fornecida' },
        { status: 400 }
      )
    }

    // Validar que é uma URL HTTPS válida
    if (!url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      )
    }

    // Buscar o PDF
    console.log('📡 [PDF-PROXY] Fazendo fetch do PDF...')
    const pdfResponse = await fetch(url, {
      headers: {
        'Accept': 'application/pdf',
      },
    })

    if (!pdfResponse.ok) {
      console.error('❌ [PDF-PROXY] Error fetching PDF:', pdfResponse.statusText, 'Status:', pdfResponse.status)
      return NextResponse.json(
        { error: 'Erro ao buscar PDF' },
        { status: pdfResponse.status }
      )
    }

    console.log('✅ [PDF-PROXY] PDF fetched successfully')

    // Obter o buffer do PDF
    const pdfBuffer = await pdfResponse.arrayBuffer()
    console.log('✅ [PDF-PROXY] Buffer obtido, tamanho:', pdfBuffer.byteLength, 'bytes')

    // Retornar o PDF com headers corretos
    console.log('✅ [PDF-PROXY] Retornando PDF ao cliente')
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    })
  } catch (error) {
    console.error('PDF proxy error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
