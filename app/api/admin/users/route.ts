import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Helper to check if user is super admin
async function isSuperAdmin(userId: string): Promise<boolean> {
  const { data } = await (supabaseAdmin
    .from('admin_users') as any)
    .select('id, role, is_active')
    .eq('user_id', userId)
    .eq('role', 'super_admin')
    .eq('is_active', true)
    .single()

  return !!data
}

// GET: List all admin users (super admin only)
export async function GET() {
  try {
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Check if user is super admin
    const isSuperAdminUser = await isSuperAdmin(user.id)
    if (!isSuperAdminUser) {
      return NextResponse.json(
        { error: 'Não autorizado - apenas super admins podem listar administradores' },
        { status: 403 }
      )
    }

    // Fetch all admin users with their auth data
    const { data: admins, error } = await (supabaseAdmin
      .from('admin_users') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin users:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar administradores' },
        { status: 500 }
      )
    }

    // Fetch email addresses for each admin from users_access table
    const adminsWithEmails = await Promise.all(
      (admins || []).map(async (admin: any) => {
        const { data: userAccess, error: userAccessError } = await supabaseAdmin
          .from('users_access')
          .select('email')
          .eq('id', admin.user_id)
          .single<{ email: string }>()

        if (userAccessError) {
          console.error(`Error fetching email for user ${admin.user_id}:`, userAccessError)
          return {
            ...admin,
            email: null
          }
        }

        return {
          ...admin,
          email: userAccess?.email || null
        }
      })
    )

    return NextResponse.json({
      success: true,
      admins: adminsWithEmails
    })
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST: Add new admin user (super admin only)
export async function POST(request: NextRequest) {
  try {
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Check if user is super admin
    const isSuperAdminUser = await isSuperAdmin(user.id)
    if (!isSuperAdminUser) {
      return NextResponse.json(
        { error: 'Não autorizado - apenas super admins podem adicionar administradores' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      user_id,
      email,
      role = 'admin',
      can_create_avisos = true,
      can_manage_users = false,
      can_manage_contents = false,
      can_view_analytics = true,
      notes
    } = body

    // Validate: need either user_id or email
    if (!user_id && !email) {
      return NextResponse.json(
        { error: 'user_id ou email é obrigatório' },
        { status: 400 }
      )
    }

    let targetUserId = user_id

    // If email provided, look up user_id
    if (!targetUserId && email) {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
      const targetUser = authData.users.find(u => u.email === email)

      if (!targetUser) {
        return NextResponse.json(
          { error: `Usuário com email ${email} não encontrado` },
          { status: 404 }
        )
      }

      targetUserId = targetUser.id
    }

    // Check if user is already an admin
    const { data: existing } = await (supabaseAdmin
      .from('admin_users') as any)
      .select('id')
      .eq('user_id', targetUserId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Usuário já é um administrador' },
        { status: 400 }
      )
    }

    // Create admin user
    const { data: newAdmin, error: insertError } = await (supabaseAdmin
      .from('admin_users') as any)
      .insert({
        user_id: targetUserId,
        role,
        can_create_avisos,
        can_manage_users,
        can_manage_contents,
        can_view_analytics,
        notes: notes || null,
        created_by: user.id
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating admin user:', insertError)
      return NextResponse.json(
        { error: 'Erro ao criar administrador' },
        { status: 500 }
      )
    }

    // Fetch email for response
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(targetUserId)

    return NextResponse.json({
      success: true,
      admin: {
        ...newAdmin,
        email: authUser.user?.email || null
      },
      message: 'Administrador criado com sucesso'
    })
  } catch (error) {
    console.error('Error in POST /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PATCH: Update admin user (super admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Check if user is super admin
    const isSuperAdminUser = await isSuperAdmin(user.id)
    if (!isSuperAdminUser) {
      return NextResponse.json(
        { error: 'Não autorizado - apenas super admins podem atualizar administradores' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      admin_id,
      role,
      can_create_avisos,
      can_manage_users,
      can_manage_contents,
      can_view_analytics,
      is_active,
      notes
    } = body

    if (!admin_id) {
      return NextResponse.json(
        { error: 'admin_id é obrigatório' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = {}
    if (role !== undefined) updates.role = role
    if (can_create_avisos !== undefined) updates.can_create_avisos = can_create_avisos
    if (can_manage_users !== undefined) updates.can_manage_users = can_manage_users
    if (can_manage_contents !== undefined) updates.can_manage_contents = can_manage_contents
    if (can_view_analytics !== undefined) updates.can_view_analytics = can_view_analytics
    if (is_active !== undefined) updates.is_active = is_active
    if (notes !== undefined) updates.notes = notes

    // Update admin user
    const { data: updatedAdmin, error: updateError } = await (supabaseAdmin
      .from('admin_users') as any)
      .update(updates)
      .eq('id', admin_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating admin user:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar administrador' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: updatedAdmin,
      message: 'Administrador atualizado com sucesso'
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE: Remove admin user (super admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { valid, user } = await getSessionFromCookie()

    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Check if user is super admin
    const isSuperAdminUser = await isSuperAdmin(user.id)
    if (!isSuperAdminUser) {
      return NextResponse.json(
        { error: 'Não autorizado - apenas super admins podem remover administradores' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const admin_id = searchParams.get('admin_id')

    if (!admin_id) {
      return NextResponse.json(
        { error: 'admin_id é obrigatório' },
        { status: 400 }
      )
    }

    // Check if trying to delete self
    const { data: adminToDelete } = await (supabaseAdmin
      .from('admin_users') as any)
      .select('user_id')
      .eq('id', admin_id)
      .single()

    if (adminToDelete?.user_id === user.id) {
      return NextResponse.json(
        { error: 'Você não pode remover sua própria conta de administrador' },
        { status: 400 }
      )
    }

    // Delete admin user
    const { error: deleteError } = await (supabaseAdmin
      .from('admin_users') as any)
      .delete()
      .eq('id', admin_id)

    if (deleteError) {
      console.error('Error deleting admin user:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao remover administrador' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Administrador removido com sucesso'
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
