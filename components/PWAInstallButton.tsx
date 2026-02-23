'use client'

import { useEffect, useState } from 'react'

type Theme = 'purple' | 'emerald'

interface PWAInstallButtonProps {
  variant?: 'login' | 'widget'
  className?: string
  locale?: 'es' | 'pt-BR'
  theme?: Theme
}

const translations = {
  es: {
    installApp: 'Instalar Aplicación',
    installAppRecommended: '📲 Instalar App (Recomendado)',
    installInstructions: 'Para instalar la aplicación en tu dispositivo:',
    androidInstructions: 'Toca el menú (⋮) y selecciona "Agregar a pantalla de inicio"',
    iosInstructions: 'Toca Compartir (□↑) y selecciona "Agregar a inicio"',
    understood: 'Entendido'
  },
  'pt-BR': {
    installApp: 'Instalar Aplicativo',
    installAppRecommended: '📲 Instalar App (Recomendado)',
    installInstructions: 'Para instalar o aplicativo no seu dispositivo:',
    androidInstructions: 'Toque no menu (⋮) e selecione "Adicionar à tela inicial"',
    iosInstructions: 'Toque em Compartilhar (□↑) e selecione "Adicionar à Tela de Início"',
    understood: 'Entendido'
  }
}

const themeStyles = {
  purple: {
    loginButton: 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:via-purple-400 hover:to-indigo-400 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/60',
    widgetButton: 'bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:via-purple-400 hover:to-indigo-400 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/60',
    modalCard: 'glass-dark rounded-3xl shadow-neuro-card p-8 border border-neuro-500/20 max-w-md w-full',
    modalIcon: 'bg-gradient-to-br from-purple-600 to-purple-500',
    modalTitle: 'text-white',
    modalText: 'text-neuro-100',
    modalInfoBox: 'bg-neuro-800/50',
    modalLabel: 'text-purple-400',
    modalButton: 'bg-neuro-gradient text-white shadow-neuro-glow hover:shadow-purple-glow',
  },
  emerald: {
    loginButton: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-400/50',
    widgetButton: 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-400/50',
    modalCard: 'bg-white rounded-3xl shadow-2xl p-8 border border-emerald-200/50 max-w-md w-full',
    modalIcon: 'bg-gradient-to-br from-emerald-600 to-emerald-500',
    modalTitle: 'text-gray-800',
    modalText: 'text-gray-600',
    modalInfoBox: 'bg-emerald-50 border border-emerald-200/50',
    modalLabel: 'text-emerald-600',
    modalButton: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]',
  },
}

export default function PWAInstallButton({ variant = 'widget', className = '', locale = 'pt-BR', theme = 'purple' }: PWAInstallButtonProps) {
  const t = translations[locale]
  const s = themeStyles[theme]
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Capture the PWA install prompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setShowInstructions(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    // If we have the native prompt, use it
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('PWA installed')
        setIsInstalled(true)
      }

      setDeferredPrompt(null)
    } else {
      // Show manual instructions
      setShowInstructions(true)
    }
  }

  // Don't show if already installed
  if (isInstalled) return null

  const renderModal = () => {
    if (!showInstructions) return null

    const overlayBg = theme === 'emerald' ? 'bg-gray-200/80' : 'bg-black/80'

    return (
      <div className={`fixed inset-0 ${overlayBg} backdrop-blur-sm flex items-center justify-center p-4 z-[100]`} onClick={() => setShowInstructions(false)}>
        <div className={s.modalCard} onClick={(e) => e.stopPropagation()}>
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${s.modalIcon} rounded-2xl mb-4 shadow-lg`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold ${s.modalTitle} mb-2`}>{t.installApp}</h3>
          </div>

          <div className={`space-y-4 ${s.modalText} text-sm`}>
            <p className="text-center">{t.installInstructions}</p>

            <div className={`${s.modalInfoBox} rounded-2xl p-4 space-y-3`}>
              <div className="flex gap-3">
                <span className={`font-bold ${s.modalLabel}`}>Android:</span>
                <span>{t.androidInstructions}</span>
              </div>
              <div className="flex gap-3">
                <span className={`font-bold ${s.modalLabel}`}>iOS:</span>
                <span>{t.iosInstructions}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowInstructions(false)}
            className={`w-full mt-6 font-bold py-3 px-6 rounded-2xl transition-all duration-300 ${s.modalButton}`}
          >
            {t.understood}
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'login') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-center gap-3 ${s.loginButton} text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden group ${className}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <svg
            className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span className="relative z-10 text-lg">{t.installAppRecommended}</span>
        </button>

        {renderModal()}
      </>
    )
  }

  // Widget variant (for flying widget)
  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={`w-16 h-16 ${s.widgetButton} text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50 group relative overflow-hidden ${className}`}
        aria-label={t.installApp}
        title={t.installApp}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        <svg
          className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </button>

      {renderModal()}
    </>
  )
}
