import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  logLoginAttempt,
  validateUserAccess,
  createSession,
  setSessionCookie
} from '@/lib/auth'
import { getClientIP, isValidEmail, normalizeEmail } from '@/lib/utils'
import { getDashboardRoute } from '@/lib/product-routes-map'

// Verify Turnstile token with Cloudflare
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: ip
        })
      }
    )

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, turnstileToken } = body

    // Validação de entrada
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    // Pegar informações do cliente
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || undefined

    // Verify Turnstile CAPTCHA
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Verificação de segurança ausente' },
        { status: 400 }
      )
    }

    const isHuman = await verifyTurnstile(turnstileToken, ipAddress)
    if (!isHuman) {
      console.error('[TURNSTILE FAILED]', { email: normalizedEmail, ip: ipAddress })
      return NextResponse.json(
        { error: 'Verificação de segurança falhou. Atualize a página e tente novamente.' },
        { status: 400 }
      )
    }

    // Verificar rate limiting
    const rateLimitResult = await checkRateLimit(normalizedEmail, ipAddress)

    if (!rateLimitResult.allowed) {
      await logLoginAttempt(normalizedEmail, ipAddress, false, userAgent)

      console.error('[RATE LIMIT BLOCKED]', {
        email: normalizedEmail,
        ip: ipAddress,
        blockedUntil: rateLimitResult.blockedUntil?.toISOString(),
        timestamp: new Date().toISOString()
      })

      return NextResponse.json(
        {
          error: 'Muitas tentativas de login. Tente novamente mais tarde.',
          blockedUntil: rateLimitResult.blockedUntil?.toISOString(),
          remainingAttempts: 0
        },
        { status: 429 }
      )
    }

    // Validar acesso do usuário
    const accessValidation = await validateUserAccess(normalizedEmail)

    if (!accessValidation.valid) {
      await logLoginAttempt(normalizedEmail, ipAddress, false, userAgent)

      return NextResponse.json(
        {
          error: accessValidation.message || 'Acesso não autorizado',
          remainingAttempts: rateLimitResult.remainingAttempts
        },
        { status: 401 }
      )
    }

    const user = accessValidation.user

    // Criar sessão
    const sessionData = await createSession(
      user.id,
      user.email,
      ipAddress,
      userAgent
    )

    // Registrar login bem-sucedido
    await logLoginAttempt(normalizedEmail, ipAddress, true, userAgent)

    // Definir cookie de sessão
    await setSessionCookie(sessionData)

    // Determinar para qual dashboard redirecionar baseado no produto
    // Usa o mapeamento centralizado de rotas
    const redirectTo = getDashboardRoute(user.product_id)

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        email: user.email,
        productName: user.product_name
      },
      redirectTo
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    )
  }
}
