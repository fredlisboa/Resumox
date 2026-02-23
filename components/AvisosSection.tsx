'use client'

import { useEffect, useState } from 'react'
import AvisoCard from './AvisoCard'

interface Aviso {
  id: string
  title: string
  short_notification: string
  full_content: string
  notification_type: 'general' | 'announcement' | 'update' | 'urgent' | 'event' | 'promocion'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  sent_at: string
  image_url?: string | null
  thumbnail_url?: string | null
  cta_text?: string | null
  cta_url?: string | null
  is_read?: boolean
  read_at?: string | null
}

interface AvisosSectionProps {
  locale?: 'es' | 'pt-BR'
  theme?: 'light' | 'dark'
}

const translations = {
  es: {
    title: 'Avisos',
    loading: 'Cargando...',
    error: 'Error al cargar los avisos',
    retry: 'Intentar de nuevo',
    noNotifications: 'No hay avisos disponibles',
    noNotificationsSubtext: 'Te notificaremos cuando haya nuevas actualizaciones',
    dateLocale: 'es-ES'
  },
  'pt-BR': {
    title: 'Avisos',
    loading: 'Carregando...',
    error: 'Erro ao carregar os avisos',
    retry: 'Tentar novamente',
    noNotifications: 'Não há avisos disponíveis',
    noNotificationsSubtext: 'Notificaremos você quando houver novas atualizações',
    dateLocale: 'pt-BR'
  }
}

export default function AvisosSection({ locale = 'pt-BR', theme = 'dark' }: AvisosSectionProps) {
  const t = translations[locale]
  const isLight = theme === 'light'
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAviso, setSelectedAviso] = useState<Aviso | null>(null)

  useEffect(() => {
    fetchAvisos()
  }, [])

  const fetchAvisos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/avisos')

      if (!response.ok) {
        throw new Error('Erro ao carregar os avisos')
      }

      const data = await response.json()
      setAvisos(data.avisos || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Error fetching avisos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAvisoClick = async (aviso: Aviso) => {
    setSelectedAviso(aviso)

    // Mark as read if not already read
    if (!aviso.is_read) {
      try {
        await fetch('/api/avisos/mark-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ aviso_id: aviso.id }),
        })

        // Update local state
        setAvisos(prev =>
          prev.map(a =>
            a.id === aviso.id ? { ...a, is_read: true, read_at: new Date().toISOString() } : a
          )
        )
      } catch (err) {
        console.error('Error marking aviso as read:', err)
      }
    }
  }

  const closeModal = () => {
    setSelectedAviso(null)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'announcement':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        )
      case 'event':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        )
      case 'promocion':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        )
      case 'update':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        )
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'from-red-500 to-red-600'
      case 'high':
        return 'from-orange-500 to-orange-600'
      case 'normal':
        return 'from-blue-500 to-blue-600'
      case 'low':
        return 'from-gray-500 to-gray-600'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }

  if (loading) {
    return (
      <div className={`${isLight ? 'bg-white border-gray-200 shadow-xl' : 'glass-dark border-neuro-500/20 shadow-neuro-card'} rounded-3xl p-6 border animate-slide-up`}>
        <div className="flex justify-center items-center py-12">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isLight ? 'border-emerald-500' : 'border-cyan-400'}`}></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${isLight ? 'bg-white border-gray-200 shadow-xl' : 'glass-dark border-neuro-500/20 shadow-neuro-card'} rounded-3xl p-6 border animate-slide-up`}>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{t.error}</p>
          <button
            onClick={fetchAvisos}
            className={`px-4 py-2 ${isLight ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30' : 'bg-neuro-gradient hover:shadow-neuro-glow'} text-white rounded-lg transition-all`}
          >
            {t.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`${isLight ? 'bg-white border-gray-200 shadow-xl' : 'glass-dark border-neuro-500/20 shadow-neuro-card'} rounded-3xl p-6 border animate-slide-up`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>{t.title}</h2>
          <div className="flex items-center gap-2">
            <svg className={`w-5 h-5 ${isLight ? 'text-emerald-500' : 'text-cyan-400'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            {avisos.filter(a => !a.is_read).length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {avisos.filter(a => !a.is_read).length}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {avisos.length === 0 ? (
            <div className="text-center py-12">
              <svg className={`w-16 h-16 ${isLight ? 'text-gray-300' : 'text-neuro-300'} mx-auto mb-4`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <p className={`${isLight ? 'text-gray-500' : 'text-neuro-200'} text-lg`}>{t.noNotifications}</p>
              <p className={`${isLight ? 'text-gray-400' : 'text-neuro-300'} text-sm mt-2`}>{t.noNotificationsSubtext}</p>
            </div>
          ) : (
            avisos.map(aviso => (
              <AvisoCard
                key={aviso.id}
                aviso={aviso}
                onClick={() => handleAvisoClick(aviso)}
                getNotificationIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                locale={locale}
                theme={theme}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal for full notification */}
      {selectedAviso && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className={`${isLight ? 'bg-white border-gray-200' : 'glass-dark border-neuro-500/30'} rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border animate-slide-up`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`sticky top-0 backdrop-blur-lg ${isLight ? 'bg-white/90 border-b border-gray-200' : 'bg-neuro-900/80 border-b border-neuro-500/20'} p-6 flex items-start justify-between`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getPriorityColor(selectedAviso.priority)} rounded-xl flex items-center justify-center shadow-lg`}>
                    {getNotificationIcon(selectedAviso.notification_type)}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>{selectedAviso.title}</h3>
                    <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-neuro-300'}`}>
                      {new Date(selectedAviso.sent_at).toLocaleDateString(t.dateLocale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className={`ml-4 ${isLight ? 'text-gray-400 hover:text-gray-700' : 'text-neuro-300 hover:text-white'} transition-colors`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image */}
            {selectedAviso.image_url && (
              <div className="px-6 pt-6">
                <img
                  src={selectedAviso.image_url}
                  alt={selectedAviso.title}
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div
                className={`prose max-w-none ${isLight ? 'prose-gray' : 'prose-invert'}`}
                dangerouslySetInnerHTML={{ __html: selectedAviso.full_content }}
              />
            </div>

            {/* CTA Button */}
            {selectedAviso.cta_text && selectedAviso.cta_url && (
              <div className="px-6 pb-6">
                <a
                  href={selectedAviso.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-3 px-6 ${isLight ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30' : 'bg-neuro-gradient hover:shadow-neuro-glow'} text-white text-center font-semibold rounded-xl transition-all`}
                >
                  {selectedAviso.cta_text}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
