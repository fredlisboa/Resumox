'use client'

import { useEffect, useState, useCallback } from 'react'
import { BookOpen } from 'lucide-react'

interface PWAInstallPromptProps {
  locale?: 'es' | 'pt-BR'
}

const translations = {
  es: {
    title: 'Instalar Aplicación',
    subtitle: 'Acceso rápido desde tu pantalla de inicio',
    installNative: 'Instalar Ahora',
    notNow: 'Ahora no',
    iosTitle: 'Instalar en iPhone/iPad',
    iosStep1: 'Toca el botón de Compartir',
    iosStep2: 'Selecciona "Agregar a inicio"',
    androidManualTitle: 'Instalar en Android',
    androidStep1: 'Toca el menú (⋮) del navegador',
    androidStep2: 'Selecciona "Agregar a pantalla de inicio"',
    gotIt: 'Entendido',
  },
  'pt-BR': {
    title: 'Instalar Aplicativo',
    subtitle: 'Acesso rápido na sua tela inicial',
    installNative: 'Instalar Agora',
    notNow: 'Agora não',
    iosTitle: 'Instalar no iPhone/iPad',
    iosStep1: 'Toque no botão Compartilhar',
    iosStep2: 'Selecione "Adicionar à Tela de Início"',
    androidManualTitle: 'Instalar no Android',
    androidStep1: 'Toque no menu (⋮) do navegador',
    androidStep2: 'Selecione "Adicionar à tela inicial"',
    gotIt: 'Entendido',
  },
}

type PromptMode = 'native' | 'ios' | 'android-manual' | null

export default function PWAInstallPrompt({ locale = 'pt-BR' }: PWAInstallPromptProps) {
  const t = translations[locale]
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptMode, setPromptMode] = useState<PromptMode>(null)
  const [isStandalone, setIsStandalone] = useState(false)

  const isIOS = useCallback(() => {
    if (typeof window === 'undefined') return false
    const ua = window.navigator.userAgent
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  }, [])

  const isInStandaloneMode = useCallback(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
  }, [])

  const wasDismissedRecently = useCallback(() => {
    try {
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) return false
      const dismissedTime = parseInt(dismissed)
      const threeDays = 3 * 24 * 60 * 60 * 1000
      return Date.now() - dismissedTime < threeDays
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Already installed
    if (isInStandaloneMode()) {
      setIsStandalone(true)
      return
    }

    // Already dismissed recently
    if (wasDismissedRecently()) return

    // Capture native install prompt (Android Chrome)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setPromptMode('native')
      // Show popup after 2 seconds
      setTimeout(() => setShowPrompt(true), 2000)
    }

    const handleAppInstalled = () => {
      setIsStandalone(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // If no native prompt fires within 3 seconds, detect platform and show manual instructions
    const fallbackTimer = setTimeout(() => {
      if (isInStandaloneMode() || wasDismissedRecently()) return

      // Check if native prompt was already captured
      setDeferredPrompt((current: any) => {
        if (current) return current // native prompt already available, don't show fallback

        if (isIOS()) {
          setPromptMode('ios')
          setShowPrompt(true)
        }
        // On Android without beforeinstallprompt (e.g. Firefox, Samsung Internet)
        else if (/Android/i.test(navigator.userAgent)) {
          setPromptMode('android-manual')
          setShowPrompt(true)
        }
        return current
      })
    }, 3500)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(fallbackTimer)
    }
  }, [isIOS, isInStandaloneMode, wasDismissedRecently])

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsStandalone(true)
    }
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    try {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    } catch {}
  }

  if (isStandalone || !showPrompt) return null

  // Native install prompt (Android Chrome)
  if (promptMode === 'native') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] animate-fade-in" onClick={handleDismiss}>
        <div
          className="w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl p-6 border border-[#6C5CE7]/30 animate-slide-up"
          style={{ background: 'rgba(19, 19, 26, 0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(108, 92, 231, 0.3)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', boxShadow: '0 0 20px rgba(108, 92, 231, 0.5)' }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#E8E8ED]">{t.title}</h3>
              <p className="text-sm text-[#8888A0]">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 px-4 rounded-2xl text-[#8888A0] font-semibold border border-[#6C5CE7]/20 hover:bg-[#6C5CE7]/10 transition-all"
            >
              {t.notNow}
            </button>
            <button
              onClick={handleNativeInstall}
              className="flex-1 py-3 px-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] shadow-[0_0_20px_rgba(108,92,231,0.4)] hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t.installNative}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // iOS instructions
  if (promptMode === 'ios') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] animate-fade-in" onClick={handleDismiss}>
        <div
          className="w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl p-6 border border-[#6C5CE7]/30 animate-slide-up"
          style={{ background: 'rgba(19, 19, 26, 0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(108, 92, 231, 0.3)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', boxShadow: '0 0 20px rgba(108, 92, 231, 0.5)' }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#E8E8ED]">{t.iosTitle}</h3>
              <p className="text-sm text-[#8888A0]">{t.subtitle}</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 bg-[#6C5CE7]/10 rounded-2xl p-4 border border-[#6C5CE7]/20">
              <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#A29BFE] font-bold text-sm">1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#E8E8ED] text-sm">{t.iosStep1}</span>
                <svg className="w-5 h-5 text-[#A29BFE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#6C5CE7]/10 rounded-2xl p-4 border border-[#6C5CE7]/20">
              <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#A29BFE] font-bold text-sm">2</span>
              </div>
              <span className="text-[#E8E8ED] text-sm">{t.iosStep2}</span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full py-3 px-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] shadow-[0_0_20px_rgba(108,92,231,0.4)] hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    )
  }

  // Android manual instructions (Firefox, Samsung Internet, etc.)
  if (promptMode === 'android-manual') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[9999] animate-fade-in" onClick={handleDismiss}>
        <div
          className="w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl p-6 border border-[#6C5CE7]/30 animate-slide-up"
          style={{ background: 'rgba(19, 19, 26, 0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(108, 92, 231, 0.3)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', boxShadow: '0 0 20px rgba(108, 92, 231, 0.5)' }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#E8E8ED]">{t.androidManualTitle}</h3>
              <p className="text-sm text-[#8888A0]">{t.subtitle}</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 bg-[#6C5CE7]/10 rounded-2xl p-4 border border-[#6C5CE7]/20">
              <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#A29BFE] font-bold text-sm">1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#E8E8ED] text-sm">{t.androidStep1}</span>
                <span className="text-[#A29BFE] text-lg font-bold">⋮</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#6C5CE7]/10 rounded-2xl p-4 border border-[#6C5CE7]/20">
              <div className="w-8 h-8 rounded-full bg-[#6C5CE7]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#A29BFE] font-bold text-sm">2</span>
              </div>
              <span className="text-[#E8E8ED] text-sm">{t.androidStep2}</span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full py-3 px-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] shadow-[0_0_20px_rgba(108,92,231,0.4)] hover:shadow-[0_0_30px_rgba(108,92,231,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {t.gotIt}
          </button>
        </div>
      </div>
    )
  }

  return null
}
