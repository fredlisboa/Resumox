'use client'

import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import SessionWarningModal from '@/components/SessionWarningModal'

export default function ResumoxDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const {
    isLoading,
    showWarning,
    extendSession,
  } = useSession({
    checkInterval: 5 * 60 * 1000,
    enableBackgroundDetection: true,
    onSessionExpired: () => router.push('/resumox'),
  })

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/resumox')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-resumox-accent border-t-transparent" />
          <p className="mt-4 text-resumox-accent-light font-semibold">Carregando sua biblioteca...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen protected-content" style={{ background: '#0A0A0F' }}>
      <SessionWarningModal
        isOpen={showWarning}
        onExtend={extendSession}
        onLogout={handleLogout}
      />
      {children}
    </div>
  )
}
