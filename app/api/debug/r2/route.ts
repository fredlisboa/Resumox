import { NextResponse } from 'next/server'
import { isR2Configured, parseR2Url } from '@/lib/r2'

export const dynamic = 'force-dynamic'

/**
 * Debug endpoint for R2 configuration
 * Access: /api/debug/r2
 *
 * WARNING: This endpoint exposes configuration details.
 * Remove or protect this endpoint in production!
 */
export async function GET() {
  try {
    const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
    const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
    const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'lt-neuroreset'

    const configured = isR2Configured()

    // Test URL parsing
    const testUrls = [
      'r2://kit-inteligencia-emocional/pdfs/99 NeuroInteligencia Emocional.pdf',
      'r2://pdfs/P01 NeuroReset-Guia-de-Inicio-Rapido-and-Manual-de-Usuario_v3.pdf',
    ]

    const parsedUrls = testUrls.map(url => ({
      url,
      parsed: parseR2Url(url)
    }))

    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'local',
      r2Config: {
        accountId: R2_ACCOUNT_ID ? `${R2_ACCOUNT_ID.substring(0, 8)}... (${R2_ACCOUNT_ID.length} chars)` : '❌ NOT SET',
        accessKeyId: R2_ACCESS_KEY_ID ? `${R2_ACCESS_KEY_ID.substring(0, 8)}... (${R2_ACCESS_KEY_ID.length} chars)` : '❌ NOT SET',
        secretAccessKey: R2_SECRET_ACCESS_KEY ? `${'*'.repeat(16)}... (${R2_SECRET_ACCESS_KEY.length} chars)` : '❌ NOT SET',
        bucketName: R2_BUCKET_NAME,
        isConfigured: configured
      },
      urlParsing: parsedUrls,
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      checks: {
        hasAccountId: !!R2_ACCOUNT_ID,
        hasAccessKey: !!R2_ACCESS_KEY_ID,
        hasSecretKey: !!R2_SECRET_ACCESS_KEY,
        hasBucketName: !!R2_BUCKET_NAME,
        allConfigured: configured
      }
    }

    return NextResponse.json(debug, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
