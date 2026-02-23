import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSessionFromCookie } from '@/lib/auth'
import { r2Client, getSignedFileUrl, isR2Configured, parseR2Url } from '@/lib/r2'

export const dynamic = 'force-dynamic'

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'lt-neuroreset'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range',
    },
  })
}

/**
 * API route para servir arquivos do Cloudflare R2
 * Suporta dois modos:
 * 1. Proxy direto: /api/r2-content?key=path/to/file.pdf
 * 2. URL assinada: /api/r2-content?key=path/to/file.pdf&signed=true
 *
 * Suporta HTTP Range requests para seek em áudio/vídeo.
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

    // searchParams.get() already decodes the URL-encoded value
    // Extrair a chave do arquivo (strip r2:// prefix se presente)
    let fileKey = key
    let bucket = R2_BUCKET_NAME
    if (key.startsWith('r2://')) {
      const parsed = parseR2Url(key)
      fileKey = parsed.key
      bucket = parsed.bucket
    }

    // Se quiser URL assinada, retornar apenas a URL
    if (wantsSigned) {
      const signedUrl = await getSignedFileUrl({ key: fileKey, expiresIn: 3600 })
      return NextResponse.json({ url: signedUrl })
    }

    // Detectar content type baseado na extensão
    const contentType = getContentType(key)

    // Verificar se é um Range request (seek em áudio/vídeo)
    const rangeHeader = request.headers.get('range')

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      ...(rangeHeader ? { Range: rangeHeader } : {}),
    })

    const response = await r2Client.send(command)

    if (!response.Body) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Ler o body como buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks)

    // Range request → 206 Partial Content
    if (rangeHeader && response.ContentRange) {
      return new NextResponse(new Uint8Array(body), {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(body.length),
          'Content-Range': response.ContentRange,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
        },
      })
    }

    // Request normal → 200 com Accept-Ranges para habilitar seek
    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(body.length),
        'Accept-Ranges': 'bytes',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Range, Content-Length, Accept-Ranges',
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
