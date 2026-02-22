import { supabaseAdmin } from '../lib/supabase'
import './load-env'

interface AdminUser {
  id: string
  user_id: string
  role: 'super_admin' | 'admin' | 'moderator'
  can_create_avisos: boolean
  can_manage_users: boolean
  can_manage_contents: boolean
  can_view_analytics: boolean
  is_active: boolean
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

async function createFirstAdmin() {
  try {
    console.log('🔐 Creating first admin user...')

    // User ID from user_access table
    const userId = 'd4771c9f-168c-450c-84d3-8f0c88c5166f'

    // Check if user already exists in admin_users table
    const { data: existingAdmin, error: checkError } = await (supabaseAdmin
      .from('admin_users') as any)
      .select('id')
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing admin:', checkError)
      process.exit(1)
    }

    if (existingAdmin) {
      console.log('ℹ️  User is already an admin')
      process.exit(0)
    }

    // Create admin user with super admin privileges
    const { data: newAdmin, error: insertError } = await (supabaseAdmin
      .from('admin_users') as any)
      .insert({
        user_id: userId,
        role: 'super_admin',
        can_create_avisos: true,
        can_manage_users: true,
        can_manage_contents: true,
        can_view_analytics: true,
        is_active: true,
        notes: 'First admin user created via script',
        created_by: userId
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error creating admin user:', insertError)
      process.exit(1)
    }

    if (!newAdmin) {
      console.error('❌ No admin user data returned')
      process.exit(1)
    }

    console.log('✅ Successfully created first admin user!')
    console.log('📋 Admin user details:')
    console.log('   • User ID:', newAdmin.user_id)
    console.log('   • Role:', newAdmin.role)
    console.log('   • Permissions:')
    console.log('     • Create avisos:', newAdmin.can_create_avisos ? '✓' : '✗')
    console.log('     • Manage users:', newAdmin.can_manage_users ? '✓' : '✗')
    console.log('     • Manage contents:', newAdmin.can_manage_contents ? '✓' : '✗')
    console.log('     • View analytics:', newAdmin.can_view_analytics ? '✓' : '✗')
    console.log('   • Status:', newAdmin.is_active ? 'Active' : 'Inactive')

    process.exit(0)

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

// Run the script
createFirstAdmin()
