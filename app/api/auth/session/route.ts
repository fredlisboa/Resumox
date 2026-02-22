import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { valid, session, user, timeUntilExpiration, shouldWarn } = await getSessionFromCookie()

    if (!valid || !session || !user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: user.email,
        productName: user.product_name,
        lastAccess: user.ultimo_acesso
      },
      session: {
        expiresAt: session.expiresAt,
        timeUntilExpiration,
        shouldWarn
      }
    })

  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
