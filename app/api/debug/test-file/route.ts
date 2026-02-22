import { NextResponse } from 'next/server'
import { getFileFromR2 } from '@/lib/r2'

export const dynamic = 'force-dynamic'

/**
 * Test specific file access from R2
 * Usage: /api/debug/test-file?url=r2://bucket/path/file.pdf
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({
        error: 'Missing url parameter',
        usage: '/api/debug/test-file?url=r2://bucket/path/file.pdf',
        examples: [
          '/api/debug/test-file?url=r2://kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf',
          '/api/debug/test-file?url=r2://pdfs/P01%20NeuroReset-Guia-de-Inicio-Rapido-and-Manual-de-Usuario_v3.pdf'
        ]
      }, { status: 400 })
    }

    console.log('[TEST-FILE] Testing URL:', url)

    const startTime = Date.now()

    try {
      const fileBuffer = await getFileFromR2(url)
      const duration = Date.now() - startTime

      return NextResponse.json({
        success: true,
        url,
        fileSize: fileBuffer.length,
        fileSizeKB: Math.round(fileBuffer.length / 1024),
        fileSizeMB: (fileBuffer.length / 1024 / 1024).toFixed(2),
        duration: `${duration}ms`,
        message: 'File loaded successfully! ✅'
      }, { status: 200 })

    } catch (fileError: any) {
      console.error('[TEST-FILE] Error loading file:', fileError)

      return NextResponse.json({
        success: false,
        url,
        error: fileError.message,
        errorName: fileError.name,
        errorCode: fileError.Code || fileError.$metadata?.httpStatusCode,
        possibleCauses: [
          'File does not exist in bucket',
          'Bucket name is incorrect',
          'File path is incorrect (check spaces, capitalization)',
          'API token does not have read permissions',
        ],
        troubleshooting: {
          checkBucket: 'Verify bucket exists in Cloudflare R2 dashboard',
          checkFile: 'Verify file exists at exact path with exact filename',
          checkPath: 'File paths are case-sensitive and must match exactly',
          checkPermissions: 'API token needs Read or Admin Read & Write permissions'
        }
      }, { status: 500 })
    }

  } catch (error: any) {
    return NextResponse.json({
      error: 'Test endpoint failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
