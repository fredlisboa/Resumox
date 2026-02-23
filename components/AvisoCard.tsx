'use client'

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

interface AvisoCardProps {
  aviso: Aviso
  onClick: () => void
  getNotificationIcon: (type: string) => JSX.Element
  getPriorityColor: (priority: string) => string
  locale?: 'es' | 'pt-BR'
  theme?: 'light' | 'dark'
}

const translations = {
  es: {
    justNow: 'Hace un momento',
    minute: 'minuto',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',
    day: 'día',
    days: 'días',
    week: 'semana',
    weeks: 'semanas',
    ago: 'Hace',
    urgent: 'Urgente',
    highPriority: 'Alta prioridad',
    typeLabels: {
      general: 'General',
      announcement: 'Anuncio',
      update: 'Actualización',
      urgent: 'Urgente',
      event: 'Evento',
      promocion: 'Promoción'
    },
    dateLocale: 'es-ES'
  },
  'pt-BR': {
    justNow: 'Agora mesmo',
    minute: 'minuto',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',
    day: 'dia',
    days: 'dias',
    week: 'semana',
    weeks: 'semanas',
    ago: 'Há',
    urgent: 'Urgente',
    highPriority: 'Alta prioridade',
    typeLabels: {
      general: 'Geral',
      announcement: 'Anúncio',
      update: 'Atualização',
      urgent: 'Urgente',
      event: 'Evento',
      promocion: 'Promoção'
    },
    dateLocale: 'pt-BR'
  }
}

export default function AvisoCard({ aviso, onClick, getNotificationIcon, getPriorityColor, locale = 'pt-BR', theme = 'dark' }: AvisoCardProps) {
  const t = translations[locale]
  const isLight = theme === 'light'

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return t.justNow
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${t.ago} ${diffInMinutes} ${diffInMinutes === 1 ? t.minute : t.minutes}`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${t.ago} ${diffInHours} ${diffInHours === 1 ? t.hour : t.hours}`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${t.ago} ${diffInDays} ${diffInDays === 1 ? t.day : t.days}`
    }

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `${t.ago} ${diffInWeeks} ${diffInWeeks === 1 ? t.week : t.weeks}`
    }

    return date.toLocaleDateString(t.dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeLabel = (type: string) => {
    return t.typeLabels[type as keyof typeof t.typeLabels] || type
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
          priority === 'urgent'
            ? (isLight ? 'bg-red-100 text-red-600' : 'bg-red-500/20 text-red-300')
            : (isLight ? 'bg-orange-100 text-orange-600' : 'bg-orange-500/20 text-orange-300')
        }`}>
          {priority === 'urgent' ? t.urgent : t.highPriority}
        </span>
      )
    }
    return null
  }

  return (
    <div
      onClick={onClick}
      className={`relative flex items-start gap-4 p-4 ${isLight ? 'bg-gray-50 hover:bg-gray-100' : 'glass hover:bg-white/10'} rounded-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group ${
        !aviso.is_read ? (isLight ? 'border-l-4 border-emerald-500' : 'border-l-4 border-cyan-400') : ''
      }`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getPriorityColor(aviso.priority)} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
        {getNotificationIcon(aviso.notification_type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`font-semibold ${
            isLight
              ? (!aviso.is_read ? 'text-gray-800' : 'text-gray-600')
              : (!aviso.is_read ? 'text-white' : 'text-neuro-100')
          } ${isLight ? 'group-hover:text-emerald-600' : 'group-hover:text-cyan-300'} transition-colors`}>
            {aviso.title}
          </h3>
          {!aviso.is_read && (
            <span className={`flex-shrink-0 w-2 h-2 ${isLight ? 'bg-emerald-500' : 'bg-cyan-400 shadow-glow-cyan'} rounded-full`}></span>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 text-xs font-medium ${isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-neuro-500/30 text-neuro-200'} rounded-lg`}>
            {getTypeLabel(aviso.notification_type)}
          </span>
          {getPriorityBadge(aviso.priority)}
        </div>

        {/* Short notification preview */}
        <div
          className={`text-sm ${isLight ? 'text-gray-500' : 'text-neuro-200'} line-clamp-2 mb-2`}
          dangerouslySetInnerHTML={{ __html: aviso.short_notification }}
        />

        {/* Thumbnail */}
        {aviso.thumbnail_url && (
          <div className="mt-3 mb-2">
            <img
              src={aviso.thumbnail_url}
              alt={aviso.title}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs ${isLight ? 'text-gray-400' : 'text-neuro-300'}`}>
            {formatRelativeTime(aviso.sent_at)}
          </p>
          <svg
            className={`w-5 h-5 ${isLight ? 'text-gray-400 group-hover:text-emerald-500' : 'text-neuro-300 group-hover:text-cyan-300'} transition-colors`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
