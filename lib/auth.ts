// @ts-nocheck - Supabase type inference issues during build with placeholder env vars
import { supabaseAdmin } from './supabase'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SESSION_COOKIE_NAME = 'huskyapp_session'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 dias em ms
const SESSION_EXTENSION_THRESHOLD = 24 * 60 * 60 * 1000 // Extend if less than 24h remaining
const SESSION_WARNING_THRESHOLD = 5 * 60 * 1000 // Warn 5 minutes before expiration

// Tipos
export interface SessionData {
  userId: string
  email: string
  sessionToken: string
  expiresAt: Date
}

export interface LoginAttemptResult {
  allowed: boolean
  remainingAttempts?: number
  blockedUntil?: Date
}

// Rate Limiting - Verificar tentativas de login (baseado em IP)
// IMPROVED: More forgiving settings to prevent locking out legitimate users
export async function checkRateLimit(
  email: string,
  ipAddress: string
): Promise<LoginAttemptResult> {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  // 1. VERIFICAR BLOQUEIO DE IP EXISTENTE
  const { data: ipRateLimit } = await supabaseAdmin
    .from('ip_rate_limits')
    .select('*')
    .eq('ip_address', ipAddress)
    .single()

  if (ipRateLimit?.blocked_until) {
    const blockedUntil = new Date(ipRateLimit.blocked_until)
    if (blockedUntil > now) {
      return {
        allowed: false,
        blockedUntil,
        remainingAttempts: 0
      }
    }
  }

  // 2. CONTAR TENTATIVAS FALHADAS DO IP NA ÚLTIMA HORA
  const { data: ipAttempts, error: ipError } = await supabaseAdmin
    .from('login_attempts')
    .select('*')
    .eq('ip_address', ipAddress)
    .gte('attempted_at', oneHourAgo.toISOString())
    .order('attempted_at', { ascending: false })

  if (ipError) {
    console.error('Error checking IP rate limit:', ipError)
    return { allowed: true }
  }

  const failedIpAttempts = ipAttempts?.filter(a => !a.success).length || 0

  // 3. DETECTAR ATIVIDADE SUSPEITA (múltiplos emails do mesmo IP)
  const uniqueEmailsAttempted = new Set(
    ipAttempts?.filter(a => !a.success).map(a => a.email.toLowerCase()) || []
  ).size

  // Se o IP tentou logar com mais de 5 emails diferentes em 1 hora = suspeito (increased from 3)
  if (uniqueEmailsAttempted >= 5) {
    const blockedUntil = new Date(now.getTime() + 60 * 60 * 1000) // 1 hora (reduced from 24)

    await supabaseAdmin
      .from('ip_rate_limits')
      .upsert({
        ip_address: ipAddress,
        blocked_until: blockedUntil.toISOString(),
        blocked_reason: 'suspicious_activity',
        attempt_count: failedIpAttempts,
        unique_emails_attempted: uniqueEmailsAttempted,
        last_attempt: now.toISOString()
      })

    return {
      allowed: false,
      blockedUntil,
      remainingAttempts: 0
    }
  }

  // 4. VERIFICAR LIMITE DE TENTATIVAS POR IP (increased to 10 attempts, reduced block to 15 min)
  if (failedIpAttempts >= 10) {
    const blockedUntil = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutos (was 1 hour)

    await supabaseAdmin
      .from('ip_rate_limits')
      .upsert({
        ip_address: ipAddress,
        blocked_until: blockedUntil.toISOString(),
        blocked_reason: 'too_many_attempts',
        attempt_count: failedIpAttempts,
        unique_emails_attempted: uniqueEmailsAttempted,
        last_attempt: now.toISOString()
      })

    // Também atualizar bloqueio do usuário se existir
    const { data: user } = await supabaseAdmin
      .from('users_access')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (user) {
      await supabaseAdmin
        .from('users_access')
        .update({ bloqueado_ate: blockedUntil.toISOString() })
        .eq('email', email.toLowerCase())
    }

    return {
      allowed: false,
      blockedUntil,
      remainingAttempts: 0
    }
  }

  // 5. ATUALIZAR CONTADOR DE TENTATIVAS DO IP
  await supabaseAdmin
    .from('ip_rate_limits')
    .upsert({
      ip_address: ipAddress,
      blocked_until: null,
      blocked_reason: null,
      attempt_count: failedIpAttempts,
      unique_emails_attempted: uniqueEmailsAttempted,
      last_attempt: now.toISOString()
    })

  return {
    allowed: true,
    remainingAttempts: 10 - failedIpAttempts
  }
}

// Registrar tentativa de login
export async function logLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean,
  userAgent?: string
): Promise<void> {
  await supabaseAdmin.from('login_attempts').insert({
    email: email.toLowerCase(),
    ip_address: ipAddress,
    success,
    user_agent: userAgent || null
  })
}

// Validar e-mail de usuário autorizado
export async function validateUserAccess(email: string): Promise<{
  valid: boolean
  user?: any
  message?: string
}> {
  const { data: user, error } = await supabaseAdmin
    .from('users_access')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !user) {
    return { valid: false, message: 'E-mail não encontrado em nossa base de clientes.' }
  }

  // Verificar se está bloqueado
  if (user.bloqueado_ate) {
    const blockedUntil = new Date(user.bloqueado_ate)
    if (blockedUntil > new Date()) {
      return {
        valid: false,
        message: `Acesso temporariamente bloqueado. Tente novamente após ${blockedUntil.toLocaleTimeString('pt-BR')}.`
      }
    }
  }

  // CRITICAL: Verificar se o usuário tem pelo menos um produto ativo na tabela user_products
  // Esta é a fonte de verdade para acesso - não apenas o status_compra na users_access
  const { data: activeProducts } = await supabaseAdmin
    .from('user_products')
    .select('id, status, expiration_date')
    .eq('user_id', user.id)
    .eq('status', 'active')

  // Filtrar produtos não expirados
  const now = new Date()
  const validProducts = activeProducts?.filter(p => {
    if (!p.expiration_date) return true
    return new Date(p.expiration_date) > now
  }) || []

  // Se não houver produtos ativos e válidos, negar acesso
  if (validProducts.length === 0) {
    // Verificar qual é o motivo (refund, cancelled, chargeback ou expiração)
    const { data: anyProducts } = await supabaseAdmin
      .from('user_products')
      .select('status')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    if (!anyProducts) {
      return {
        valid: false,
        message: 'Nenhum produto encontrado. Verifique sua compra.'
      }
    }

    const statusMessages = {
      refunded: 'Sua compra foi reembolsada. Acesso removido.',
      cancelled: 'Sua compra foi cancelada. Entre em contato com o suporte.',
      chargeback: 'Acesso bloqueado devido a contestação de pagamento.'
    }

    return {
      valid: false,
      message: statusMessages[anyProducts.status as keyof typeof statusMessages] || 'Seu acesso expirou. Renove sua assinatura.'
    }
  }

  // Verificar status da compra (legacy - mantido para compatibilidade)
  if (user.status_compra !== 'active') {
    const messages = {
      refunded: 'Sua compra foi reembolsada. Acesso removido.',
      cancelled: 'Sua compra foi cancelada. Entre em contato com o suporte.',
      chargeback: 'Acesso bloqueado devido a contestação de pagamento.'
    }
    return {
      valid: false,
      message: messages[user.status_compra as keyof typeof messages] || 'Acesso não autorizado.'
    }
  }

  // Verificar expiração (legacy - mantido para compatibilidade)
  if (user.data_expiracao) {
    const expirationDate = new Date(user.data_expiracao)
    if (expirationDate < new Date()) {
      return {
        valid: false,
        message: 'Seu acesso expirou. Renove sua assinatura.'
      }
    }
  }

  return { valid: true, user }
}

// Gerar token de sessão
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Criar sessão
export async function createSession(
  userId: string,
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<SessionData> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  // Criar nova sessão com retry em caso de conflito
  let retries = 3
  let error = null

  while (retries > 0) {
    // Estratégia: Deletar sessões ativas antigas antes de inserir
    // Isso contorna o problema do constraint incorreto que afeta UPDATEs
    const { error: deleteError } = await supabaseAdmin
      .from('user_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('is_active', true)

    if (deleteError) {
      console.error('Error deleting active sessions:', deleteError)
      // Se falhar ao deletar, ainda assim tentamos inserir
    }

    // Tentar inserir a nova sessão
    const { error: insertError } = await supabaseAdmin.from('user_sessions').insert({
      user_id: userId,
      session_token: sessionToken,
      ip_address: ipAddress,
      user_agent: userAgent || null,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      last_activity: new Date().toISOString()
    })

    if (!insertError) {
      error = null
      break
    }

    // Se for erro de constraint de unicidade, tentar estratégia mais agressiva
    if (insertError.code === '23505') {
      console.error(`Constraint violation (attempt ${4 - retries}/3):`, insertError)

      // Se o constraint está configurado incorretamente (tanto para active quanto inactive),
      // precisamos deletar TODAS as sessões do usuário
      const { error: deleteAllError } = await supabaseAdmin
        .from('user_sessions')
        .delete()
        .eq('user_id', userId)

      if (deleteAllError) {
        console.error('Error deleting all sessions:', deleteAllError)
      }

      retries--
      error = insertError

      if (retries > 0) {
        // Delay maior antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    } else {
      error = insertError
      break
    }
  }

  if (error) {
    console.error('Error creating session after all retries:', error)
    throw new Error('Falha ao criar sessão. Por favor, tente novamente.')
  }

  // Atualizar último acesso do usuário
  await supabaseAdmin
    .from('users_access')
    .update({
      ultimo_acesso: new Date().toISOString(),
      ultimo_ip: ipAddress,
      ultimo_user_agent: userAgent || null,
      tentativas_login: 0 // Reset nas tentativas
    })
    .eq('id', userId)

  // Limpar rate limit do IP após login bem-sucedido
  await supabaseAdmin
    .from('ip_rate_limits')
    .delete()
    .eq('ip_address', ipAddress)

  return {
    userId,
    email,
    sessionToken,
    expiresAt
  }
}

// Validar sessão existente
export async function validateSession(sessionToken: string): Promise<{
  valid: boolean
  session?: SessionData
  user?: any
  timeUntilExpiration?: number
  shouldWarn?: boolean
}> {
  const { data: session, error } = await supabaseAdmin
    .from('user_sessions')
    .select('*, users_access(*)')
    .eq('session_token', sessionToken)
    .eq('is_active', true)
    .single()

  if (error || !session) {
    return { valid: false }
  }

  const now = new Date()
  const expiresAt = new Date(session.expires_at)
  const timeUntilExpiration = expiresAt.getTime() - now.getTime()

  // Verificar expiração
  if (timeUntilExpiration <= 0) {
    // Desativar sessão expirada
    await supabaseAdmin
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', session.id)

    return { valid: false }
  }

  // SLIDING WINDOW: Extend session if user is active and has less than 24h remaining
  const shouldExtend = timeUntilExpiration < SESSION_EXTENSION_THRESHOLD
  let newExpiresAt = expiresAt

  if (shouldExtend) {
    newExpiresAt = new Date(Date.now() + SESSION_DURATION)
    await supabaseAdmin
      .from('user_sessions')
      .update({
        expires_at: newExpiresAt.toISOString(),
        last_activity: now.toISOString()
      })
      .eq('id', session.id)
  } else {
    // Atualizar última atividade (a cada 5 minutos para não sobrecarregar)
    const lastActivity = new Date(session.last_activity)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    if (lastActivity < fiveMinutesAgo) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ last_activity: now.toISOString() })
        .eq('id', session.id)
    }
  }

  const user = (session as any).users_access
  const finalTimeUntilExpiration = newExpiresAt.getTime() - now.getTime()
  const shouldWarn = finalTimeUntilExpiration <= SESSION_WARNING_THRESHOLD && finalTimeUntilExpiration > 0

  return {
    valid: true,
    session: {
      userId: session.user_id,
      email: user.email,
      sessionToken: session.session_token,
      expiresAt: newExpiresAt
    },
    user,
    timeUntilExpiration: finalTimeUntilExpiration,
    shouldWarn
  }
}

// Pegar sessão do cookie
export async function getSessionFromCookie(): Promise<{
  valid: boolean
  session?: SessionData
  user?: any
  timeUntilExpiration?: number
  shouldWarn?: boolean
}> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return { valid: false }
  }

  return validateSession(sessionToken)
}

// Definir cookie de sessão
export async function setSessionCookie(sessionData: SessionData): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, sessionData.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // em segundos
    path: '/'
  })
}

// Remover cookie de sessão
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Logout - destruir sessão
export async function destroySession(sessionToken: string): Promise<void> {
  await supabaseAdmin
    .from('user_sessions')
    .update({ is_active: false })
    .eq('session_token', sessionToken)
}

// ============================================================================
// PRODUCT ACCESS CONTROL (Order Bumps Support)
// ============================================================================

/**
 * Verifica se um usuário tem acesso a um produto específico
 * Suporta produtos principais e order bumps
 */
export async function checkUserProductAccess(
  email: string,
  productId: string
): Promise<{
  hasAccess: boolean
  product?: any
  message?: string
}> {
  // 1. Buscar o usuário
  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id, status_compra, data_expiracao')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) {
    return {
      hasAccess: false,
      message: 'Usuário não encontrado.'
    }
  }

  // 2. Buscar o produto específico do usuário
  const { data: userProduct } = await supabaseAdmin
    .from('user_products')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('status', 'active')
    .single()

  if (!userProduct) {
    return {
      hasAccess: false,
      message: 'Você não tem acesso a este produto. Verifique sua compra.'
    }
  }

  // 3. Verificar expiração do produto
  if (userProduct.expiration_date) {
    const expirationDate = new Date(userProduct.expiration_date)
    if (expirationDate < new Date()) {
      return {
        hasAccess: false,
        message: 'Seu acesso a este produto expirou.'
      }
    }
  }

  return {
    hasAccess: true,
    product: userProduct
  }
}

/**
 * Lista todos os produtos que um usuário tem acesso
 */
export async function getUserProducts(email: string): Promise<{
  success: boolean
  products?: any[]
  message?: string
}> {
  // 1. Buscar o usuário
  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) {
    return {
      success: false,
      message: 'Usuário não encontrado.'
    }
  }

  // 2. Buscar todos os produtos ativos do usuário
  const { data: products, error } = await supabaseAdmin
    .from('user_products')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('purchase_date', { ascending: false })

  if (error) {
    console.error('Error fetching user products:', error)
    return {
      success: false,
      message: 'Erro ao buscar produtos.'
    }
  }

  // 3. Filtrar produtos não expirados
  const now = new Date()
  const activeProducts = products?.filter(p => {
    if (!p.expiration_date) return true
    return new Date(p.expiration_date) > now
  }) || []

  return {
    success: true,
    products: activeProducts
  }
}

/**
 * Verifica se um usuário tem pelo menos um produto ativo
 * (usado para manter compatibilidade com sistema legado)
 */
export async function hasAnyActiveProduct(email: string): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users_access')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) return false

  const { data: products } = await supabaseAdmin
    .from('user_products')
    .select('id, expiration_date')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)

  if (!products || products.length === 0) return false

  // Verificar se pelo menos um não está expirado
  const now = new Date()
  return products.some(p => {
    if (!p.expiration_date) return true
    return new Date(p.expiration_date) > now
  })
}
