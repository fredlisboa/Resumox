'use client'

import { useEffect, useState } from 'react'

interface PWAInstallPromptProps {
  locale?: 'es' | 'pt-BR'
}

const translations = {
  es: {
    installApp: 'Instalar Aplicación',
    addToHomeScreen: 'Agregar a la pantalla de inicio para acceso rápido',
    notNow: 'Ahora no',
    install: 'Instalar'
  },
  'pt-BR': {
    installApp: 'Instalar Aplicativo',
    addToHomeScreen: 'Adicionar à tela inicial para acesso rápido',
    notNow: 'Agora não',
    install: 'Instalar'
  }
}

export default function PWAInstallPrompt({ locale = 'pt-BR' }: PWAInstallPromptProps) {
  const t = translations[locale]
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration)
          })
          .catch(error => {
            console.log('SW registration failed:', error)
          })
      })
    }

    // Capturar evento de instalação PWA
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Mostrar prompt customizado após 3 segundos
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA installed')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Não mostrar novamente por 7 dias
    localStorage.setItem('pwa-dismissed', Date.now().toString())
  }

  // Verificar se foi recentemente dispensado
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - dismissedTime < sevenDays) {
        setShowInstallPrompt(false)
      }
    }
  }, [])

  if (!showInstallPrompt) return null

  return (
    <div className="pwa-install-banner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          </div>
          <div className="text-white">
            <p className="font-semibold">{t.installApp}</p>
            <p className="text-sm text-white/90">
              {t.addToHomeScreen}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/90 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            {t.notNow}
          </button>
          <button
            onClick={handleInstallClick}
            className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transition-colors shadow-lg"
          >
            {t.install}
          </button>
        </div>
      </div>
    </div>
  )
}
