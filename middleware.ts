import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkAdminAuthentication } from './lib/admin-auth'

const SESSION_COOKIE_NAME = 'huskyapp_session'

// Rotas públicas que não precisam de autenticação
const publicPaths = ['/', '/neuroreset', '/iemocional', '/api/auth/login', '/api/webhook/hotmart']

// Rotas protegidas que exigem autenticação
const protectedPaths = ['/dashboard', '/iemocional/dashboard']

// Rotas de admin que exigem autenticação de administrador
const adminPaths = ['/admin']

// CSP Headers for Cloudflare Turnstile
function addSecurityHeaders(response: NextResponse) {
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.cloudflare.com https://cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' data: https://challenges.cloudflare.com",
      "connect-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://challenges.cloudflare.com https://*.cloudflare.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob: https://challenges.cloudflare.com https://*.cloudflare.com",
      "media-src 'self' blob: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota pública
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path))

  // Se for rota pública, permitir acesso (com headers de segurança)
  if (isPublicPath) {
    const response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // Verificar se é uma rota protegida
  const isProtectedPath = protectedPaths.some(path => pathname === path || pathname.startsWith(path))

  if (isProtectedPath) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value

    // Se não tem token, redirecionar para login
    if (!sessionToken) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Validar sessão via API interna
    try {
      const sessionCheckUrl = new URL('/api/auth/session', request.url)
      const sessionResponse = await fetch(sessionCheckUrl, {
        headers: {
          Cookie: request.headers.get('cookie') || ''
        }
      })

      if (!sessionResponse.ok) {
        // Sessão inválida, redirecionar para login
        const url = request.nextUrl.clone()
        url.pathname = '/'

        const response = NextResponse.redirect(url)
        response.cookies.delete(SESSION_COOKIE_NAME)

        return response
      }

      // Sessão válida, permitir acesso (com headers de segurança)
      const response = NextResponse.next()
      return addSecurityHeaders(response)

    } catch (error) {
      console.error('Middleware session check error:', error)

      // Em caso de erro, redirecionar para login
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Verificar se é uma rota de admin
  const isAdminPath = adminPaths.some(path => pathname === path || pathname.startsWith(path))

  if (isAdminPath) {
    try {
      // Verificar autenticação de admin
      const { valid, message } = await checkAdminAuthentication()

      if (!valid) {
        // Redirecionar para dashboard ou página de erro
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'

        const response = NextResponse.redirect(url)
        response.cookies.delete(SESSION_COOKIE_NAME)

        return response
      }

      // Admin autenticado, permitir acesso (com headers de segurança)
      const response = NextResponse.next()
      return addSecurityHeaders(response)

    } catch (error) {
      console.error('Middleware admin auth error:', error)

      // Em caso de erro, redirecionar para dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Permitir outras rotas (com headers de segurança)
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - manifest.json, icons, service workers
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js)$).*)',
  ],
}
