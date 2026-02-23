'use client'

import { useEffect, useRef, useState, Suspense, lazy } from 'react'

// Dynamic import of PDFViewer to avoid SSR issues
const PDFViewer = lazy(() => import('./PDFViewer'))

interface Content {
  id: string
  content_type: 'video' | 'audio' | 'pdf' | 'text' | 'image' | 'html_orientation'
  title: string
  description: string | null
  content_url: string | null
  thumbnail_url: string | null
  file_size: number | null
  duration: number | null
  order_index: number
  status?: 'principal' | 'bonus' | 'order_bump' // Status do conteúdo
  html_content?: string // HTML content for orientation items
}

interface ContentPlayerProps {
  content: Content
  theme?: 'light' | 'dark' // Tema do produto
}

export default function ContentPlayer({ content, theme = 'dark' }: ContentPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const isLight = theme === 'light'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Transform R2 URLs to API endpoints for audio/video
  const getMediaUrl = (url: string | null): string => {
    if (!url) return ''

    // If it's an R2 URL, transform it to API endpoint
    if (url.startsWith('r2://')) {
      const key = url.replace('r2://', '')
      return `/api/r2-content?key=${encodeURIComponent(key)}`
    }

    // Otherwise, use the URL as-is
    return url
  }

  // Transform R2 URLs in HTML content
  const transformR2UrlsInHtml = (html: string): string => {
    if (!html) return ''

    // Replace r2:// URLs in src attributes
    return html.replace(/src=["']r2:\/\/([^"']+)["']/g, (match, key) => {
      const encodedKey = encodeURIComponent(key)
      return `src="/api/r2-content?key=${encodedKey}"`
    })
  }

  useEffect(() => {
    // Prevenir context menu en players
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const playerElement = content.content_type === 'video'
      ? videoRef.current
      : audioRef.current

    if (playerElement) {
      playerElement.addEventListener('contextmenu', preventContextMenu)
      return () => {
        playerElement.removeEventListener('contextmenu', preventContextMenu)
      }
    }
  }, [content])

  const renderPlayer = () => {
    switch (content.content_type) {
      case 'video':
        return (
          <div className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-neuro-card border border-neuro-500/30">
            <video
              ref={videoRef}
              key={content.id}
              controls
              controlsList="nodownload"
              disablePictureInPicture
              className="w-full h-full"
              poster={getMediaUrl(content.thumbnail_url) || undefined}
            >
              <source src={getMediaUrl(content.content_url)} type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          </div>
        )

      case 'audio':
        return (
          <div className="bg-neuro-gradient rounded-3xl p-8 md:p-12 shadow-neuro-glow border border-cyan-400/30 animate-fade-in">
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Audio Icon with Glow Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl">
                  <svg
                    className="w-16 h-16 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {content.title}
                </h3>
                {content.description && (
                  <p className="text-white/80 max-w-md mx-auto">
                    {content.description}
                  </p>
                )}
              </div>

              {/* Audio Player with Custom Styling */}
              <div className="w-full max-w-2xl">
                <audio
                  ref={audioRef}
                  key={content.id}
                  controls
                  controlsList="nodownload"
                  className="w-full rounded-2xl shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))'
                  }}
                >
                  <source src={getMediaUrl(content.content_url)} />
                  Seu navegador não suporta áudio.
                </audio>
              </div>

              {/* Info Badge */}
              <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <svg className="w-5 h-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">
                  Áudio de Reprogramação Mental
                </span>
              </div>
            </div>
          </div>
        )

      case 'pdf':
        return (
          <div className={`${isLight ? 'bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl' : 'glass-dark border-neuro-500/30 shadow-neuro-card'} rounded-3xl p-6 border animate-fade-in`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 bg-gradient-to-br ${isLight ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-pink-500'} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold ${isLight ? 'text-gray-900' : 'text-white'} text-lg`}>{content.title}</h3>
                  {content.description && (
                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-neuro-200'}`}>{content.description}</p>
                  )}
                </div>
              </div>
              <a
                href={getMediaUrl(content.content_url)}
                download={content.title.endsWith('.pdf') ? content.title : `${content.title}.pdf`}
                className={`px-5 py-3 ${isLight ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30' : 'bg-neuro-gradient hover:shadow-cyan-glow'} text-white font-semibold rounded-2xl transition-all duration-300 flex items-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar
              </a>
            </div>

            {/* PDF Viewer with react-pdf */}
            {content.content_url && isMounted && (
              <div className="h-[600px] md:h-[700px] lg:h-[800px]">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 ${isLight ? 'border-emerald-500' : 'border-neuro-500'} border-t-transparent`}></div>
                      <p className={`mt-4 ${isLight ? 'text-gray-600' : 'text-neuro-600'} font-medium`}>Carregando PDF...</p>
                    </div>
                  </div>
                }>
                  <PDFViewer url={content.content_url} title={content.title} theme={theme} />
                </Suspense>
              </div>
            )}
          </div>
        )

      case 'image':
        return (
          <div className={`${isLight ? 'bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl' : 'glass-dark border-neuro-500/30 shadow-neuro-card'} rounded-3xl p-4 border animate-fade-in`}>
            <img
              src={getMediaUrl(content.content_url)}
              alt={content.title}
              className="w-full h-auto rounded-2xl"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        )

      case 'text':
        return (
          <div className="glass-dark rounded-3xl p-8 md:p-12 border border-neuro-500/30 shadow-neuro-card animate-fade-in">
            <div className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: transformR2UrlsInHtml(content.content_url || '') }} />
            </div>
          </div>
        )

      case 'html_orientation':
        return (
          <div className="glass-dark rounded-3xl p-8 md:p-12 border border-neuro-500/30 shadow-neuro-card animate-fade-in">
            <div className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: transformR2UrlsInHtml(content.html_content || '') }} />
            </div>
          </div>
        )

      default:
        return (
          <div className="glass-dark rounded-3xl p-8 text-center text-neuro-200 border border-neuro-500/30">
            Tipo de conteúdo não suportado
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Player */}
      {renderPlayer()}

      {/* Info Card - Only for non-audio content (audio has integrated info) */}
      {content.content_type !== 'text' && content.content_type !== 'audio' && content.content_type !== 'html_orientation' && (
        <div className={`${isLight ? 'bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl' : 'glass-dark border-neuro-500/30 shadow-neuro-card'} rounded-3xl p-6 border`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${isLight ? 'from-lime-500 to-lime-600 shadow-lg shadow-lime-500/30' : 'from-cyan-500 to-cyan-400 shadow-cyan-glow'} rounded-2xl flex items-center justify-center`}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${isLight ? 'text-indigo-900' : 'text-white'} mb-2`}>
                {content.title}
              </h2>
              {content.description && (
                <p className={`${isLight ? 'text-gray-700' : 'text-neuro-200'} leading-relaxed`}>
                  {content.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
