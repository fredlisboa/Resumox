'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  user_id: string
  email: string | null
  role: 'super_admin' | 'admin' | 'moderator'
  can_create_avisos: boolean
  can_manage_users: boolean
  can_manage_contents: boolean
  can_view_analytics: boolean
  is_active: boolean
  notes: string | null
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'moderator'>('admin')

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')

      if (response.status === 403) {
        setError('Você não tem permissão para acessar esta página')
        return
      }

      if (!response.ok) {
        throw new Error('Erro ao carregar administradores')
      }

      const data = await response.json()
      setAdmins(data.admins || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newAdminEmail,
          role: newAdminRole,
          can_create_avisos: true,
          can_manage_users: newAdminRole === 'admin',
          can_manage_contents: newAdminRole === 'admin',
          can_view_analytics: true
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar administrador')
      }

      setShowAddModal(false)
      setNewAdminEmail('')
      setNewAdminRole('admin')
      fetchAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const handleToggleActive = async (adminId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: adminId,
          is_active: !currentStatus
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar administrador')
      }

      fetchAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const handleDeleteAdmin = async (adminId: string, email: string) => {
    if (!confirm(`Tem certeza que deseja remover o administrador ${email}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users?admin_id=${adminId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao remover administrador')
      }

      fetchAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
      case 'admin':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'moderator':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Administrador',
      moderator: 'Moderador'
    }
    return labels[role] || role
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neuro-900 via-neuro-800 to-neuro-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (error && admins.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neuro-900 via-neuro-800 to-neuro-900 flex items-center justify-center p-4">
        <div className="glass-dark rounded-3xl shadow-neuro-card p-8 max-w-md w-full">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-neuro-200 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-neuro-gradient text-white rounded-xl hover:shadow-neuro-glow transition-all"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neuro-900 via-neuro-800 to-neuro-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-neuro-300 hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Administradores</h1>
              <p className="text-neuro-200">Gerenciar usuários com acesso administrativo</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-neuro-gradient text-white font-semibold rounded-xl hover:shadow-neuro-glow transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar Admin
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {/* Admin List */}
        <div className="glass-dark rounded-3xl shadow-neuro-card border border-neuro-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neuro-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neuro-200 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neuro-200 uppercase tracking-wider">
                    Função
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neuro-200 uppercase tracking-wider">
                    Permissões
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neuro-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neuro-200 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neuro-500/20">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{admin.email || 'Email não disponível'}</div>
                        <div className="text-xs text-neuro-400 font-mono">{admin.user_id.slice(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getRoleBadgeColor(admin.role)}`}>
                        {getRoleLabel(admin.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {admin.can_create_avisos && (
                          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded">
                            Avisos
                          </span>
                        )}
                        {admin.can_manage_users && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                            Usuários
                          </span>
                        )}
                        {admin.can_manage_contents && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            Conteúdo
                          </span>
                        )}
                        {admin.can_view_analytics && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                            Analytics
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(admin.id, admin.is_active)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          admin.is_active
                            ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        }`}
                        disabled={admin.role === 'super_admin'}
                      >
                        {admin.is_active ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {admin.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.email || 'este usuário')}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neuro-200">Nenhum administrador encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="glass-dark rounded-3xl shadow-2xl max-w-md w-full border border-neuro-500/30 p-8"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Adicionar Administrador</h2>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-white font-semibold mb-2">
                  Email do Usuário
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="usuario@exemplo.com"
                />
                <p className="text-xs text-neuro-400 mt-1">
                  O usuário deve ter uma conta registrada
                </p>
              </div>

              <div>
                <label htmlFor="role" className="block text-white font-semibold mb-2">
                  Função
                </label>
                <select
                  id="role"
                  value={newAdminRole}
                  onChange={e => setNewAdminRole(e.target.value as 'admin' | 'moderator')}
                  className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="admin">Administrador (acesso completo)</option>
                  <option value="moderator">Moderador (acesso limitado)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-neuro-800 text-white rounded-xl hover:bg-neuro-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-neuro-gradient text-white font-semibold rounded-xl hover:shadow-neuro-glow transition-all"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
