import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientIP } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const ipAddress = getClientIP(request)

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    // Check user status
    const { data: user } = await supabaseAdmin
      .from('users_access')
      .select('*')
      .eq('email', email.toLowerCase())
      .single() as { data: any; error: any }

    // Check IP blocks
    const { data: ipBlocks } = await supabaseAdmin
      .from('ip_rate_limits')
      .select('*')
      .order('last_attempt', { ascending: false }) as { data: any; error: any }

    // Check recent login attempts
    const { data: loginAttempts } = await supabaseAdmin
      .from('login_attempts')
      .select('*')
      .eq('email', email.toLowerCase())
      .gte('attempted_at', oneHourAgo.toISOString())
      .order('attempted_at', { ascending: false }) as { data: any; error: any }

    // Check if current IP is blocked
    const { data: currentIpBlock } = await supabaseAdmin
      .from('ip_rate_limits')
      .select('*')
      .eq('ip_address', ipAddress)
      .single() as { data: any; error: any }

    const failedAttempts = loginAttempts?.filter((a: any) => !a.success) || []

    return NextResponse.json({
      timestamp: now.toISOString(),
      clientIp: ipAddress,
      user: user ? {
        email: user.email,
        status_compra: user.status_compra,
        bloqueado_ate: user.bloqueado_ate,
        tentativas_login: user.tentativas_login,
        ultimo_ip: user.ultimo_ip,
        data_expiracao: user.data_expiracao,
        isBlocked: user.bloqueado_ate ? new Date(user.bloqueado_ate) > now : false
      } : null,
      currentIpBlock: currentIpBlock ? {
        ip_address: currentIpBlock.ip_address,
        blocked_until: currentIpBlock.blocked_until,
        blocked_reason: currentIpBlock.blocked_reason,
        attempt_count: currentIpBlock.attempt_count,
        isBlocked: currentIpBlock.blocked_until ? new Date(currentIpBlock.blocked_until) > now : false
      } : null,
      allIpBlocks: ipBlocks?.map((b: any) => ({
        ip_address: b.ip_address,
        blocked_until: b.blocked_until,
        blocked_reason: b.blocked_reason,
        attempt_count: b.attempt_count,
        isActive: b.blocked_until ? new Date(b.blocked_until) > now : false
      })) || [],
      recentLoginAttempts: loginAttempts?.map((a: any) => ({
        email: a.email,
        ip_address: a.ip_address,
        success: a.success,
        attempted_at: a.attempted_at,
        user_agent: a.user_agent
      })) || [],
      statistics: {
        totalIpBlocks: ipBlocks?.length || 0,
        activeIpBlocks: ipBlocks?.filter((b: any) => b.blocked_until && new Date(b.blocked_until) > now).length || 0,
        failedAttemptsLastHour: failedAttempts.length,
        uniqueIpsUsed: new Set(loginAttempts?.map((a: any) => a.ip_address)).size
      }
    })
  } catch (error) {
    console.error('Debug check-block error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
