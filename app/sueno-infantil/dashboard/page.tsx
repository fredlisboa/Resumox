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
import { Moon, Stars, Cloud } from 'lucide-react'

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

export default function SuenoInfantilDashboard() {
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

  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    try {
      // Filter content by Spanish language for this dashboard
      const response = await fetch('/api/contents?language=es')

      if (response.ok) {
        const data = await response.json()
        setContents(data.contents || [])

        // Select first playable content automatically (exclude html_orientation)
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
      router.push('/sueno-infantil')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#818CF8] border-t-transparent"></div>
          <p className="mt-4 text-[#A5B4FC] font-semibold">Cargando tus recursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen protected-content relative overflow-hidden bg-[#0F172A]">
      {/* Decorative Background Elements - Midnight Nursery Theme */}
      <div
        className="fixed top-20 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl animate-float-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.25) 0%, rgba(192, 132, 252, 0) 70%)' }}
      />
      <div
        className="fixed bottom-40 left-1/4 w-[350px] h-[350px] rounded-full blur-3xl animate-bounce-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, rgba(129, 140, 248, 0) 70%)' }}
      />
      <div
        className="fixed top-1/3 left-10 w-80 h-80 rounded-full blur-2xl animate-pulse pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, rgba(167, 139, 250, 0) 70%)' }}
      />
      <div
        className="fixed bottom-1/3 right-10 w-72 h-72 rounded-full blur-3xl animate-float-delayed pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, rgba(192, 132, 252, 0) 70%)' }}
      />

      {/* Decorative Icons */}
      <div className="fixed top-32 left-16 text-[#C084FC] opacity-20 hidden lg:block animate-float-slow pointer-events-none">
        <Moon className="w-10 h-10" />
      </div>
      <div className="fixed bottom-40 right-24 text-[#818CF8] opacity-25 hidden lg:block animate-bounce-slow pointer-events-none">
        <Stars className="w-12 h-12" />
      </div>
      <div className="fixed top-1/2 right-16 text-[#A5B4FC] opacity-20 hidden lg:block animate-pulse pointer-events-none">
        <Cloud className="w-10 h-10" />
      </div>
      <div className="fixed bottom-1/4 left-20 text-[#C084FC] opacity-20 hidden lg:block animate-float-delayed pointer-events-none">
        <Moon className="w-11 h-11" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E1B4B] border border-[#818CF8]/30 rounded-full mb-4">
            <Moon className="w-5 h-5 text-[#C084FC]" />
            <span className="text-sm font-bold text-[#A5B4FC]">Kit Sueño Infantil</span>
            <Stars className="w-5 h-5 text-[#C084FC]" />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#F1F5F9] mb-3 leading-tight">
            Tus{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
                Recursos
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#818CF8]/30 -z-10 transform -rotate-1 rounded"></span>
            </span>
            {' '}para el Sueño
          </h1>
          <p className="text-lg text-[#94A3B8] font-medium">
            Herramientas para noches tranquilas
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 sticky top-0 py-3 sm:py-4 z-10 rounded-2xl sm:rounded-3xl px-2 sm:px-4 border border-[#818CF8]/20"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px 0 rgba(129, 140, 248, 0.1)'
          }}
        >
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'content'
                ? 'bg-gradient-to-r from-[#818CF8] to-[#C084FC] text-white shadow-xl shadow-[#818CF8]/30'
                : 'bg-[#1E1B4B] text-[#94A3B8] hover:bg-[#1E1B4B]/80 hover:text-[#A5B4FC]'
            }`}
          >
            <span className="hidden sm:inline">Recursos del Sueño</span>
            <span className="sm:hidden">Recursos</span>
          </button>
          <button
            onClick={() => setActiveTab('avisos')}
            className={`flex-1 py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'avisos'
                ? 'bg-gradient-to-r from-[#C084FC] to-[#A78BFA] text-white shadow-xl shadow-[#C084FC]/30'
                : 'bg-[#1E1B4B] text-[#94A3B8] hover:bg-[#1E1B4B]/80 hover:text-[#A5B4FC]'
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
              <ContentPlayer content={selectedContent} theme="dark" />
            )}

            {/* Content List */}
            <ContentList
              contents={contents}
              selectedContent={selectedContent}
              onSelectContent={setSelectedContent}
              theme="dark"
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
          className="w-16 h-16 bg-gradient-to-r from-[#818CF8] to-[#C084FC] hover:from-[#A5B4FC] hover:to-[#C084FC] text-white rounded-full shadow-2xl shadow-[#818CF8]/50 hover:shadow-[#C084FC]/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden"
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
        subject="Soporte - Kit Sueño Infantil"
        body="Hola, necesito ayuda con mis recursos del Kit Sueño Infantil"
      />
    </div>
  )
}
