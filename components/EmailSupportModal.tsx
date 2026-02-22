'use client'

import { useState } from 'react'

interface EmailSupportModalProps {
  isOpen: boolean
  onClose: () => void
  subject?: string
  body?: string
  locale?: 'es' | 'pt-BR'
}

const translations = {
  'es': {
    title: 'Soporte por E-mail',
    subtitle: 'Estamos aquí para ayudarte',
    sendTo: 'Envíanos un correo a:',
    copyTitle: 'Copiar email',
    copiedAlert: 'Email copiado al portapapeles!',
    instructions: 'Haz clic en el botón de abajo para abrir tu aplicación de correo con el mensaje prellenado:',
    openEmail: 'Abrir Mi Correo',
    close: 'Cerrar',
    helpText: 'Si el botón no funciona, copia el email y envíanos un mensaje manualmente'
  },
  'pt-BR': {
    title: 'Suporte por E-mail',
    subtitle: 'Estamos aqui para ajudá-lo',
    sendTo: 'Envie um e-mail para:',
    copyTitle: 'Copiar email',
    copiedAlert: 'Email copiado!',
    instructions: 'Clique no botão abaixo para abrir seu aplicativo de email com a mensagem preenchida:',
    openEmail: 'Abrir Meu Email',
    close: 'Fechar',
    helpText: 'Se o botão não funcionar, copie o email e nos envie uma mensagem manualmente'
  }
}

export default function EmailSupportModal({ isOpen, onClose, subject = 'Soporte NeuroReset', body = 'Hola, necesito ayuda', locale = 'es' }: EmailSupportModalProps) {
  if (!isOpen) return null

  const t = translations[locale]
  const emailAddress = 'iemocional@1sd.online'
  const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const handleEmailClick = () => {
    window.open(mailtoLink, '_blank')
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      alert(t.copiedAlert)
    } catch (err) {
      console.error('Error copying email:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="glass-dark rounded-3xl shadow-neuro-card p-8 border border-neuro-500/20 max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-2xl mb-4 shadow-cyan-glow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{t.title}</h3>
          <p className="text-neuro-200 text-sm">{t.subtitle}</p>
        </div>

        {/* Email Info */}
        <div className="bg-neuro-800/50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-neuro-200 mb-2">{t.sendTo}</p>
          <div className="flex items-center justify-between gap-2">
            <code className="text-cyan-300 font-mono text-sm break-all">{emailAddress}</code>
            <button
              onClick={copyEmail}
              className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={t.copyTitle}
            >
              <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-neuro-100 text-center">
            {t.instructions}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleEmailClick}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-cyan-glow hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.openEmail}
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 text-neuro-100 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 font-medium"
          >
            {t.close}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-neuro-300 text-center mt-6">
          {t.helpText}
        </p>
      </div>
    </div>
  )
}
