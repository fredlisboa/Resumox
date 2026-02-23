import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { getFileFromR2, getSignedFileUrl, isR2Configured } from '@/lib/r2'

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

/**
 * API route para servir arquivos do Cloudflare R2
 * Suporta dois modos:
 * 1. Proxy direto: /api/r2-content?key=path/to/file.pdf
 * 2. URL assinada: /api/r2-content?key=path/to/file.pdf&signed=true
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const { valid } = await getSessionFromCookie()

    if (!valid) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verificar se R2 está configurado
    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Cloudflare R2 não configurado' },
        { status: 503 }
      )
    }

    // Obter a chave do arquivo dos parâmetros
    const key = request.nextUrl.searchParams.get('key')
    const wantsSigned = request.nextUrl.searchParams.get('signed') === 'true'

    if (!key) {
      return NextResponse.json(
        { error: 'Chave do arquivo não fornecida' },
        { status: 400 }
      )
    }

    // Decode the key since it comes URL-encoded from the frontend
    const decodedKey = decodeURIComponent(key)

    console.log('[R2-CONTENT] Request:', {
      originalKey: key,
      decodedKey: decodedKey,
      wantsSigned
    })

    // Extrair a chave do arquivo (strip r2:// prefix se presente)
    // O DB armazena como "r2://resumox/audios/file.mp3" — precisamos apenas da key "resumox/audios/file.mp3"
    const fileKey = decodedKey.startsWith('r2://') ? decodedKey.replace('r2://', '') : decodedKey

    console.log('[R2-CONTENT] File key:', fileKey)

    // Se quiser URL assinada, retornar apenas a URL
    if (wantsSigned) {
      const signedUrl = await getSignedFileUrl({ key: fileKey, expiresIn: 3600 })
      return NextResponse.json({ url: signedUrl })
    }

    // Caso contrário, fazer proxy do arquivo
    console.log('[R2-CONTENT] Fetching file:', fileKey)
    const fileBuffer = await getFileFromR2(fileKey)
    console.log('[R2-CONTENT] File loaded successfully:', fileBuffer.length, 'bytes')

    // Detectar content type baseado na extensão
    const contentType = getContentType(key)

    // Retornar o arquivo com headers corretos
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    })
  } catch (error: any) {
    console.error('[R2-CONTENT] Error details:', {
      message: error.message,
      name: error.name,
      code: error.Code || error.$metadata?.httpStatusCode,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })

    return NextResponse.json(
      {
        error: 'Erro ao acessar arquivo',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        code: error.Code || error.$metadata?.httpStatusCode || undefined
      },
      { status: 500 }
    )
  }
}

/**
 * Detecta o Content-Type baseado na extensão do arquivo
 */
function getContentType(key: string): string {
  const extension = key.split('.').pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    opus: 'audio/ogg',
    mp4: 'video/mp4',
    webm: 'video/webm',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  }

  return mimeTypes[extension || ''] || 'application/octet-stream'
}
