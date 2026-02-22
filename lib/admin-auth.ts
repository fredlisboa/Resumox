// @ts-nocheck - Supabase type inference issues during build with placeholder env vars
import { supabaseAdmin } from './supabase'
import { getSessionFromCookie } from './auth'

/**
 * Check if a user is an admin (any role)
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is an admin, false otherwise
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await (supabaseAdmin
    .from('admin_users') as any)
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .limit(1)
    .single()

  return !!data
}

/**
 * Check if a user is a super admin
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is a super admin, false otherwise
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const { data } = await (supabaseAdmin
    .from('admin_users') as any)
    .select('id, role, is_active')
    .eq('user_id', userId)
    .eq('role', 'super_admin')
    .eq('is_active', true)
    .single()

  return !!data
}

/**
 * Check if a user has a specific permission
 * @param userId - The user ID to check
 * @param permission - The permission to check (e.g., 'create_avisos', 'manage_users')
 * @returns Promise<boolean> - True if user has the permission, false otherwise
 */
export async function hasAdminPermission(userId: string, permission: string): Promise<boolean> {
  const { data } = await (supabaseAdmin
    .from('admin_users') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (!data) return false

  switch (permission) {
    case 'create_avisos':
      return data.can_create_avisos || false
    case 'manage_users':
      return data.can_manage_users || false
    case 'manage_contents':
      return data.can_manage_contents || false
    case 'view_analytics':
      return data.can_view_analytics || false
    default:
      return false
  }
}

/**
 * Middleware function to check if user is authenticated and is an admin
 * @returns Promise<{valid: boolean, user?: any, isAdmin?: boolean, isSuperAdmin?: boolean}> - Authentication result
 */
export async function checkAdminAuthentication(): Promise<{
  valid: boolean
  user?: any
  isAdmin?: boolean
  isSuperAdmin?: boolean
  message?: string
}> {
  // First check if user is authenticated
  const { valid, user } = await getSessionFromCookie()

  if (!valid || !user) {
    return {
      valid: false,
      message: 'Não autenticado'
    }
  }

  // Check if user is an admin
  const isAdminUser = await isAdmin(user.id)
  const isSuperAdminUser = await isSuperAdmin(user.id)

  if (!isAdminUser) {
    return {
      valid: false,
      user,
      isAdmin: false,
      isSuperAdmin: false,
      message: 'Acesso não autorizado - apenas administradores podem acessar esta área'
    }
  }

  return {
    valid: true,
    user,
    isAdmin: isAdminUser,
    isSuperAdmin: isSuperAdminUser
  }
}

/**
 * Middleware function to check if user has specific admin permission
 * @param permission - The permission to check
 * @returns Promise<{valid: boolean, user?: any, hasPermission?: boolean, message?: string}> - Permission check result
 */
export async function checkAdminPermission(permission: string): Promise<{
  valid: boolean
  user?: any
  hasPermission?: boolean
  message?: string
}> {
  // First check if user is authenticated and is an admin
  const { valid, user, isAdmin, message } = await checkAdminAuthentication()

  if (!valid) {
    return {
      valid: false,
      message: message || 'Não autenticado'
    }
  }

  if (!isAdmin) {
    return {
      valid: false,
      user,
      hasPermission: false,
      message: 'Acesso não autorizado - apenas administradores podem acessar esta área'
    }
  }

  // Check specific permission
  const hasPermission = await hasAdminPermission(user.id, permission)

  if (!hasPermission) {
    return {
      valid: false,
      user,
      hasPermission: false,
      message: `Acesso não autorizado - você não tem a permissão "${permission}"`
    }
  }

  return {
    valid: true,
    user,
    hasPermission: true
  }
}
