'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAvisosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await fetch('/api/avisos/create', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.status === 403) {
          setHasPermission(false)
          return
        }

        if (!response.ok) {
          throw new Error('Error checking permission')
        }

        setHasPermission(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setHasPermission(false)
      }
    }

    checkPermission()
  }, [])

  const [formData, setFormData] = useState({
    title: '',
    short_notification: '',
    full_content: '',
    notification_type: 'general',
    priority: 'normal',
    scheduled_for: '',
    target_user_ids: '',
    target_product_ids: '',
    image_url: '',
    thumbnail_url: '',
    cta_text: '',
    cta_url: '',
    send_push: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Processar campos de array
      const target_user_ids = formData.target_user_ids
        ? formData.target_user_ids.split(',').map(id => id.trim()).filter(Boolean)
        : null

      const target_product_ids = formData.target_product_ids
        ? formData.target_product_ids.split(',').map(id => id.trim()).filter(Boolean)
        : null

      const payload = {
        ...formData,
        target_user_ids,
        target_product_ids,
        scheduled_for: formData.scheduled_for || null
      }

      const response = await fetch('/api/avisos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar aviso')
      }

      setSuccess(data.message || 'Aviso criado com sucesso')

      // Reset form
      setFormData({
        title: '',
        short_notification: '',
        full_content: '',
        notification_type: 'general',
        priority: 'normal',
        scheduled_for: '',
        target_user_ids: '',
        target_product_ids: '',
        image_url: '',
        thumbnail_url: '',
        cta_text: '',
        cta_url: '',
        send_push: false
      })

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (hasPermission === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neuro-900 via-neuro-800 to-neuro-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neuro-900 via-neuro-800 to-neuro-900 flex items-center justify-center p-4">
        <div className="glass-dark rounded-3xl shadow-neuro-card p-8 max-w-md w-full">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-neuro-200 mb-6">Você não tem permissão para acessar esta página</p>
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
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-4xl font-bold text-white mb-2">Gerenciar Avisos</h1>
          <p className="text-neuro-200">Criar e enviar notificações aos usuários</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-dark rounded-3xl shadow-neuro-card p-8 border border-neuro-500/20 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-white font-semibold mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="Ex: Nova atualização disponível"
            />
          </div>

          {/* Notification Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="notification_type" className="block text-white font-semibold mb-2">
                Tipo de Notificação
              </label>
              <select
                id="notification_type"
                name="notification_type"
                value={formData.notification_type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="general">Geral</option>
                <option value="announcement">Anúncio</option>
                <option value="update">Atualização</option>
                <option value="urgent">Urgente</option>
                <option value="event">Evento</option>
                <option value="promocion">Promoção</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-white font-semibold mb-2">
                Prioridade
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          {/* Short Notification */}
          <div>
            <label htmlFor="short_notification" className="block text-white font-semibold mb-2">
              Notificação Curta (para push) *
            </label>
            <textarea
              id="short_notification"
              name="short_notification"
              required
              rows={3}
              value={formData.short_notification}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
              placeholder="Texto curto para a notificação push (máx 150 caracteres). Pode incluir HTML básico."
              maxLength={150}
            />
            <p className="text-xs text-neuro-400 mt-1">{formData.short_notification.length}/150 caracteres</p>
          </div>

          {/* Full Content */}
          <div>
            <label htmlFor="full_content" className="block text-white font-semibold mb-2">
              Conteúdo Completo (HTML) *
            </label>
            <textarea
              id="full_content"
              name="full_content"
              required
              rows={8}
              value={formData.full_content}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
              placeholder="<p>Conteúdo completo da notificação em HTML</p>"
            />
            <p className="text-xs text-neuro-400 mt-1">Você pode usar HTML para formatar o conteúdo</p>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="thumbnail_url" className="block text-white font-semibold mb-2">
                URL da Miniatura
              </label>
              <input
                type="url"
                id="thumbnail_url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="https://exemplo.com/thumbnail.jpg"
              />
            </div>

            <div>
              <label htmlFor="image_url" className="block text-white font-semibold mb-2">
                URL da Imagem Completa
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="https://exemplo.com/image.jpg"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cta_text" className="block text-white font-semibold mb-2">
                Texto do Botão (CTA)
              </label>
              <input
                type="text"
                id="cta_text"
                name="cta_text"
                value={formData.cta_text}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="Ex: Ver mais, Baixar agora"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="cta_url" className="block text-white font-semibold mb-2">
                URL do Botão (CTA)
              </label>
              <input
                type="url"
                id="cta_url"
                name="cta_url"
                value={formData.cta_url}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="https://exemplo.com/acao"
              />
            </div>
          </div>

          {/* Targeting */}
          <div className="border-t border-neuro-500/20 pt-6">
            <h3 className="text-white font-semibold mb-4">Segmentação (opcional)</h3>
            <p className="text-sm text-neuro-300 mb-4">
              Deixe ambos os campos vazios para enviar a todos os usuários
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="target_user_ids" className="block text-white font-semibold mb-2">
                  IDs de Usuários (separados por vírgula)
                </label>
                <input
                  type="text"
                  id="target_user_ids"
                  name="target_user_ids"
                  value={formData.target_user_ids}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="uuid1, uuid2, uuid3"
                />
              </div>

              <div>
                <label htmlFor="target_product_ids" className="block text-white font-semibold mb-2">
                  IDs de Produtos (separados por vírgula)
                </label>
                <input
                  type="text"
                  id="target_product_ids"
                  name="target_product_ids"
                  value={formData.target_product_ids}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="PRODUCT01, PRODUCT02"
                />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="border-t border-neuro-500/20 pt-6">
            <h3 className="text-white font-semibold mb-4">Agendamento</h3>

            <div>
              <label htmlFor="scheduled_for" className="block text-white font-semibold mb-2">
                Data e Hora de Envio (opcional)
              </label>
              <input
                type="datetime-local"
                id="scheduled_for"
                name="scheduled_for"
                value={formData.scheduled_for}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-neuro-800 border border-neuro-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <p className="text-xs text-neuro-400 mt-1">
                Deixe vazio para enviar imediatamente
              </p>
            </div>
          </div>

          {/* Push Notification */}
          <div className="border-t border-neuro-500/20 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="send_push"
                checked={formData.send_push}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-neuro-800 border-neuro-500/30 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-white font-semibold">
                Enviar notificação push para dispositivos móveis
              </span>
            </label>
            <p className="text-xs text-neuro-400 mt-2 ml-8">
              Requer configuração do Firebase Cloud Messaging
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-neuro-gradient text-white font-semibold rounded-xl hover:shadow-neuro-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Criando aviso...
                </span>
              ) : (
                'Criar e Enviar Aviso'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
