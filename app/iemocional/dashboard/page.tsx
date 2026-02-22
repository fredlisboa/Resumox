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
import { Sparkles, Heart, Star, Brain } from 'lucide-react'

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
  status?: 'principal' | 'bonus' | 'order_bump'
  html_content?: string
  is_locked?: boolean
  checkout_url?: string | null
}

export default function IEmocionalDashboard() {
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
      router.push('/iemocional')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-lime-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700 font-semibold">Cargando tus recursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen protected-content relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Decorative Background Elements - Light theme */}
      <div className="fixed top-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-lime-300/20 to-yellow-200/15 rounded-full blur-3xl animate-float-slow pointer-events-none"></div>
      <div className="fixed bottom-40 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-pink-300/25 to-purple-300/20 rounded-full blur-3xl animate-bounce-slow pointer-events-none"></div>
      <div className="fixed top-1/3 left-10 w-80 h-80 bg-gradient-to-bl from-purple-200/20 to-pink-200/15 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-1/3 right-10 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-cyan-200/15 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

      {/* Decorative Icons */}
      <div className="fixed top-32 left-16 text-pink-400 opacity-20 hidden lg:block animate-float-slow pointer-events-none">
        <Heart className="w-10 h-10" fill="currentColor" />
      </div>
      <div className="fixed bottom-40 right-24 text-lime-400 opacity-25 hidden lg:block animate-bounce-slow pointer-events-none">
        <Star className="w-12 h-12" fill="currentColor" />
      </div>
      <div className="fixed top-1/2 right-16 text-purple-400 opacity-20 hidden lg:block animate-pulse pointer-events-none">
        <Sparkles className="w-10 h-10" />
      </div>
      <div className="fixed bottom-1/4 left-20 text-orange-400 opacity-20 hidden lg:block animate-float-delayed pointer-events-none">
        <Brain className="w-11 h-11" />
      </div>

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">Kit Inteligencia Emocional</span>
            <Sparkles className="w-5 h-5 text-orange-500" />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-indigo-900 mb-3 leading-tight">
            Tus{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-lime-500 to-lime-600 bg-clip-text text-transparent">
                13 Recursos
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300 -z-10 transform -rotate-1"></span>
            </span>
            {' '}Emocionales
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Herramientas visuales para gestionar emociones
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 sticky top-0 backdrop-blur-lg bg-white/80 py-3 sm:py-4 z-10 rounded-2xl sm:rounded-3xl px-2 sm:px-4 shadow-lg border border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'content'
                ? 'bg-gradient-to-r from-lime-500 to-lime-600 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="hidden sm:inline">Recursos Visuales</span>
            <span className="sm:hidden">Recursos</span>
          </button>
          <button
            onClick={() => setActiveTab('avisos')}
            className={`flex-1 py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'avisos'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              <ContentPlayer content={selectedContent} theme="light" />
            )}

            {/* Content List */}
            <ContentList
              contents={contents}
              selectedContent={selectedContent}
              onSelectContent={setSelectedContent}
              theme="light"
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
          className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full shadow-2xl shadow-pink-500/50 hover:shadow-pink-400/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden"
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
        subject="Soporte - Kit Inteligencia Emocional"
        body="Hola, necesito ayuda con mis recursos del Kit de Inteligencia Emocional"
      />
    </div>
  )
}
