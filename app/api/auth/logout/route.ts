import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie, destroySession, clearSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { session } = await getSessionFromCookie()

    if (session) {
      await destroySession(session.sessionToken)
    }

    await clearSessionCookie()

    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Erro ao realizar logout' },
      { status: 500 }
    )
  }
}
