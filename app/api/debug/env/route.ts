import { NextResponse } from 'next/server'

/**
 * Endpoint temporário para verificar se as variáveis de ambiente estão configuradas
 * REMOVER APÓS DEBUG
 */
export async function GET() {
  const envVars = {
    HOTMART_WEBHOOK_SECRET: {
      configured: !!process.env.HOTMART_WEBHOOK_SECRET,
      length: process.env.HOTMART_WEBHOOK_SECRET?.length || 0,
      firstChars: process.env.HOTMART_WEBHOOK_SECRET?.substring(0, 10) || 'NOT SET',
    },
    HOTMART_CLIENT_ID: {
      configured: !!process.env.HOTMART_CLIENT_ID,
      length: process.env.HOTMART_CLIENT_ID?.length || 0,
    },
    HOTMART_CLIENT_SECRET: {
      configured: !!process.env.HOTMART_CLIENT_SECRET,
      length: process.env.HOTMART_CLIENT_SECRET?.length || 0,
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    },
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    variables: envVars,
  })
}
