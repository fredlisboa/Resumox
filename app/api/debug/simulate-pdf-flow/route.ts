import { NextResponse } from 'next/server'
import { parseR2Url, getFileFromR2 } from '@/lib/r2'

export const dynamic = 'force-dynamic'

/**
 * Simulates the exact flow from clicking a PDF to loading it
 * Usage: /api/debug/simulate-pdf-flow?dbUrl=r2://kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dbUrl = searchParams.get('dbUrl')

    if (!dbUrl) {
      return NextResponse.json({
        error: 'Missing dbUrl parameter',
        usage: '/api/debug/simulate-pdf-flow?dbUrl=r2://...',
        example: '/api/debug/simulate-pdf-flow?dbUrl=r2://kit-inteligencia-emocional/pdfs/99%20NeuroInteligencia%20Emocional.pdf'
      }, { status: 400 })
    }

    const flow = {
      step1_database: dbUrl,
      step2_contentList_encoded: encodeURIComponent(dbUrl),
      step3_searchParams_decoded: dbUrl, // Next.js auto-decodes
      step4_viewer_stripped: dbUrl.replace('r2://', ''),
      step5_viewer_encoded: encodeURIComponent(dbUrl.replace('r2://', '')),
      step6_api_receives: dbUrl.replace('r2://', ''), // auto-decoded by Next.js
      step7_api_decodes: decodeURIComponent(dbUrl.replace('r2://', '')),
      step8_parseR2Url: null as any,
      step9_r2_search: null as any,
      step10_result: null as any
    }

    // Step 8: Parse R2 URL
    const decodedKey = decodeURIComponent(dbUrl.replace('r2://', ''))
    const fullKey = decodedKey.startsWith('r2://') ? decodedKey : decodedKey
    flow.step8_parseR2Url = parseR2Url(`r2://${fullKey}`)
    flow.step9_r2_search = {
      bucket: flow.step8_parseR2Url.bucket,
      key: flow.step8_parseR2Url.key,
      fullPath: `${flow.step8_parseR2Url.bucket}/${flow.step8_parseR2Url.key}`
    }

    // Step 10: Actually try to fetch the file
    try {
      const startTime = Date.now()
      const fileBuffer = await getFileFromR2(`r2://${fullKey}`)
      const duration = Date.now() - startTime

      flow.step10_result = {
        success: true,
        fileSize: fileBuffer.length,
        fileSizeKB: Math.round(fileBuffer.length / 1024),
        fileSizeMB: (fileBuffer.length / 1024 / 1024).toFixed(2),
        duration: `${duration}ms`
      }
    } catch (fileError: any) {
      flow.step10_result = {
        success: false,
        error: fileError.message,
        errorName: fileError.name,
        errorCode: fileError.Code || fileError.$metadata?.httpStatusCode,
        possibleCauses: [
          'File does not exist in bucket',
          'Bucket name is incorrect',
          'API token lacks permissions',
          'Filename capitalization mismatch'
        ]
      }
    }

    return NextResponse.json({
      flowSimulation: flow,
      summary: {
        databaseUrl: dbUrl,
        r2Bucket: flow.step8_parseR2Url.bucket,
        r2Key: flow.step8_parseR2Url.key,
        fileExists: flow.step10_result?.success || false,
        error: flow.step10_result?.success === false ? flow.step10_result.error : null
      }
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Simulation failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
