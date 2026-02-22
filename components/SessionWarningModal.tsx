'use client'

import { useEffect, useState } from 'react'

interface SessionWarningModalProps {
  isOpen: boolean
  timeRemaining?: number // milliseconds
  onExtend: () => void
  onLogout: () => void
}

export default function SessionWarningModal({
  isOpen,
  timeRemaining = 5 * 60 * 1000, // 5 minutes default
  onExtend,
  onLogout
}: SessionWarningModalProps) {
  const [countdown, setCountdown] = useState(Math.floor(timeRemaining / 1000))

  useEffect(() => {
    if (!isOpen) return

    setCountdown(Math.floor(timeRemaining / 1000))

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, timeRemaining])

  if (!isOpen) return null

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative glass-dark rounded-3xl shadow-2xl border border-yellow-500/30 max-w-md w-full p-6 sm:p-8 animate-scale-in">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-pulse">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Tu sesión está por expirar
        </h2>

        {/* Message */}
        <p className="text-neuro-200 text-center mb-6">
          Tu sesión expirará en <span className="font-bold text-yellow-400">{minutes}:{seconds.toString().padStart(2, '0')}</span> minutos por inactividad. ¿Deseas continuar conectado?
        </p>

        {/* Countdown Bar */}
        <div className="w-full h-2 bg-neuro-700 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / (timeRemaining / 1000)) * 100}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-neuro-100 glass hover:bg-white/10 transition-all duration-300 border border-neuro-500/30"
          >
            Cerrar sesión
          </button>
          <button
            onClick={onExtend}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-neuro-gradient hover:shadow-neuro-glow transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Continuar conectado
          </button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-neuro-300 text-center mt-4">
          Tu sesión se renovará automáticamente si mantienes actividad
        </p>
      </div>
    </div>
  )
}
