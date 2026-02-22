// @ts-nocheck - Supabase type inference issues during build with placeholder env vars
import { supabaseAdmin } from './supabase'

interface SessionCheck {
  userId: string
  currentIp: string
  currentUserAgent: string
}

// Verificar múltiplos acessos simultâneos
export async function checkMultipleAccess({
  userId,
  currentIp,
  currentUserAgent
}: SessionCheck): Promise<{
  allowed: boolean
  message?: string
}> {
  try {
    // Buscar todas as sessões ativas do usuário
    const { data: activeSessions, error } = await supabaseAdmin
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())

    if (error) {
      console.error('Error checking sessions:', error)
      return { allowed: true } // Em caso de erro, permitir acesso
    }

    if (!activeSessions || activeSessions.length === 0) {
      return { allowed: true }
    }

    // Verificar se há sessões de IPs muito diferentes
    const currentIpParts = currentIp.split('.')
    const suspiciousSessions = activeSessions.filter(session => {
      if (!session.ip_address || session.ip_address === currentIp) {
        return false
      }

      const sessionIpParts = session.ip_address.split('.')

      // Verificar se os 2 primeiros octetos são diferentes (indicativo de locais muito diferentes)
      const differentSubnet = sessionIpParts[0] !== currentIpParts[0] ||
                              sessionIpParts[1] !== currentIpParts[1]

      return differentSubnet
    })

    if (suspiciousSessions.length > 0) {
      // Permitir apenas 1 sessão ativa por vez em locais diferentes
      return {
        allowed: false,
        message: 'Detectamos um acesso simultâneo de outro local. Por segurança, encerramos a outra sessão.'
      }
    }

    // Verificar User-Agent muito diferente
    const differentDevices = activeSessions.filter(session => {
      if (!session.user_agent || session.user_agent === currentUserAgent) {
        return false
      }

      // Verificar se é de um tipo de dispositivo completamente diferente
      const isMobile = /mobile|android|iphone|ipad/i.test(currentUserAgent)
      const sessionIsMobile = /mobile|android|iphone|ipad/i.test(session.user_agent)

      return isMobile !== sessionIsMobile
    })

    if (differentDevices.length > 1) {
      return {
        allowed: false,
        message: 'Detectamos múltiplos acessos simultâneos de dispositivos diferentes.'
      }
    }

    return { allowed: true }

  } catch (error) {
    console.error('Anti-fraud check error:', error)
    return { allowed: true } // Em caso de erro, permitir acesso
  }
}

// Invalidar sessões suspeitas
export async function invalidateSuspiciousSessions(
  userId: string,
  keepSessionToken: string
): Promise<void> {
  try {
    // Desativar todas as sessões exceto a atual
    await supabaseAdmin
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .neq('session_token', keepSessionToken)

  } catch (error) {
    console.error('Error invalidating sessions:', error)
  }
}

// Calcular "fingerprint" do dispositivo (básico)
export function generateDeviceFingerprint(
  userAgent: string,
  ipAddress: string
): string {
  const crypto = require('crypto')

  const data = `${userAgent}${ipAddress}${new Date().toDateString()}`

  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
    .substring(0, 16)
}

// Verificar velocidade de requisições (possível bot)
export async function checkRequestRate(
  userId: string,
  action: string
): Promise<{
  allowed: boolean
  message?: string
}> {
  const cacheKey = `rate_${userId}_${action}`
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minuto
  const maxRequests = 30 // Máximo de requisições por minuto

  // Em produção, usar Redis ou similar
  // Por simplicidade, usar variável em memória (não persiste entre restarts)
  if (!global.rateLimit) {
    global.rateLimit = {}
  }

  if (!global.rateLimit[cacheKey]) {
    global.rateLimit[cacheKey] = []
  }

  // Limpar requisições antigas
  global.rateLimit[cacheKey] = global.rateLimit[cacheKey].filter(
    (timestamp: number) => now - timestamp < windowMs
  )

  // Verificar se excedeu o limite
  if (global.rateLimit[cacheKey].length >= maxRequests) {
    return {
      allowed: false,
      message: 'Muitas requisições. Aguarde um momento.'
    }
  }

  // Adicionar requisição atual
  global.rateLimit[cacheKey].push(now)

  return { allowed: true }
}

// Tipos globais
declare global {
  var rateLimit: Record<string, number[]>
}
