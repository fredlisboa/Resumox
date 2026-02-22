'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ContentPlayer from '@/components/ContentPlayer'
import ContentList from '@/components/ContentList'
import UserHeader from '@/components/UserHeader'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import PWAInstallButton from '@/components/PWAInstallButton'
import EmailSupportModal from '@/components/EmailSupportModal'
import SessionWarningModal from '@/components/SessionWarningModal'
import AvisosSection from '@/components/AvisosSection'
import { useSession } from '@/hooks/useSession'

interface UserData {
  email: string
  productName: string
}

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
  is_locked?: boolean // Indica se o conteúdo está bloqueado (order bump não comprado)
  checkout_url?: string | null // URL de checkout para desbloquear
}

export default function DashboardPage() {
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'avisos'>('content')
  const [showEmailModal, setShowEmailModal] = useState(false)

  // Use new session management hook
  const {
    sessionData,
    isLoading: loading,
    showWarning: showSessionWarning,
    extendSession
  } = useSession({
    checkInterval: 5 * 60 * 1000, // Check every 5 minutes
    enableBackgroundDetection: true,
    onSessionExpired: () => {
      console.log('Session expired, redirecting to login...')
    }
  })

  // Transform R2 URLs to API endpoints
  const getMediaUrl = (url: string | null): string => {
    if (!url) return ''
    if (url.startsWith('r2://')) {
      const key = url.replace('r2://', '')
      return `/api/r2-content?key=${encodeURIComponent(key)}`
    }
    return url
  }

  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    try {
      const response = await fetch('/api/contents')

      if (response.ok) {
        const data = await response.json()
        setContents(data.contents || [])

        // Selecionar primeiro conteúdo automaticamente (excluir html_orientation)
        if (data.contents && data.contents.length > 0) {
          const firstPlayableContent = data.contents.find(
            (c: Content) => c.content_type !== 'html_orientation'
          )
          setSelectedContent(firstPlayableContent || null)
        }
      }
    } catch (error) {
      console.error('Error loading contents:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-neuro-500 border-t-transparent shadow-neuro-glow"></div>
          <p className="mt-4 text-neuro-100 font-medium">Cargando tu contenido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen protected-content relative overflow-hidden">
      {/* Enhanced Background gradient overlay */}
      <div className="fixed inset-0 bg-neuro-dark pointer-events-none"></div>
      <div className="fixed inset-0 bg-neuro-glow opacity-30 pointer-events-none"></div>

      {/* Animated floating shapes for dopaminergic effect */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-neuro-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="fixed bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-neuro-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full mix-blend-multiply filter blur-2xl animate-float-medium pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-400/15 to-cyan-300/15 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow-reverse pointer-events-none"></div>

      {/* Additional decorative elements */}
      <div className="fixed top-1/2 left-10 w-56 h-56 bg-gradient-to-br from-pink-500/15 to-rose-400/15 rounded-full mix-blend-multiply filter blur-2xl animate-float-medium pointer-events-none"></div>
      <div className="fixed top-3/4 right-1/3 w-44 h-44 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="fixed bottom-10 left-1/4 w-60 h-60 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full mix-blend-multiply filter blur-2xl animate-float-delayed pointer-events-none"></div>

      {/* Glowing orbs - brain stimulation effect */}
      <div className="fixed top-40 right-1/3 w-32 h-32 bg-cyan-400/10 rounded-full filter blur-xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/3 left-1/2 w-40 h-40 bg-purple-400/10 rounded-full filter blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-2/3 right-10 w-36 h-36 bg-pink-400/10 rounded-full filter blur-xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Session Warning Modal */}
      <SessionWarningModal
        isOpen={showSessionWarning}
        timeRemaining={sessionData?.session?.timeUntilExpiration}
        onExtend={extendSession}
        onLogout={handleLogout}
      />

      {/* Header */}
      <UserHeader user={sessionData?.user || null} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-6 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Reprograma tu mente y apaga la ansiedad en 5 minutos con el poder de la neurociencia acústica.
          </h1>
          <p className="text-neuro-200">
            Tu proceso de transformación comienza aquí
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 sticky top-0 backdrop-blur-lg bg-neuro-900/50 py-3 sm:py-4 z-10 rounded-xl sm:rounded-2xl px-2 sm:px-4">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base transition-all duration-300 ${
              activeTab === 'content'
                ? 'bg-neuro-gradient text-white shadow-neuro-glow'
                : 'glass text-neuro-100 hover:bg-white/10'
            }`}
          >
            <span className="hidden sm:inline">Archivos de Reprogramación</span>
            <span className="sm:hidden">Archivos</span>
          </button>
          <button
            onClick={() => setActiveTab('avisos')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base transition-all duration-300 ${
              activeTab === 'avisos'
                ? 'bg-neuro-gradient text-white shadow-neuro-glow'
                : 'glass text-neuro-100 hover:bg-white/10'
            }`}
          >
            Avisos
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Player - Only show for playable content types */}
            {selectedContent && selectedContent.content_type !== 'html_orientation' && (
              <ContentPlayer content={selectedContent} />
            )}

            {/* Content List */}
            <ContentList
              contents={contents}
              selectedContent={selectedContent}
              onSelectContent={setSelectedContent}
            />
          </div>
        )}

        {/* Avisos Tab */}
        {activeTab === 'avisos' && (
          <AvisosSection />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        {/* PWA Install Button */}
        <PWAInstallButton variant="widget" />

        {/* Email Support Button */}
        <button
          onClick={() => setShowEmailModal(true)}
          className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white rounded-full shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden"
          aria-label="Soporte por E-mail"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Email Support Modal */}
      <EmailSupportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        subject="Soporte NeuroReset"
        body="Hola, necesito ayuda"
      />
    </div>
  )
}
