'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { isValidEmail } from '@/lib/utils'
import PWAInstallButton from '@/components/PWAInstallButton'
import EmailSupportModal from '@/components/EmailSupportModal'
import TurnstileWidget from '@/components/TurnstileWidget'
import { Sparkles, Zap, Heart, Star, Brain, Gift } from 'lucide-react'

export default function IEmocionalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setRemainingAttempts(null)

    if (!email) {
      setError('Por favor, digite seu e-mail')
      return
    }

    if (!isValidEmail(email)) {
      setError('E-mail inválido')
      return
    }

    if (!turnstileToken) {
      setError('Por favor, complete a verificação de segurança')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          turnstileToken
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push(data.redirectTo || '/iemocional/dashboard')
      } else {
        setError(data.error || 'Erro ao fazer login')

        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts)
        }

        if (response.status === 429) {
          const blockedUntil = new Date(data.blockedUntil)
          setError(`Muitas tentativas. Bloqueado até ${blockedUntil.toLocaleTimeString('pt-BR')}`)
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Erro de conexão. Verifique sua internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Decorative Background Elements - Inspired by sales page */}
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-lime-400/30 to-yellow-300/25 rounded-full blur-3xl animate-float-slow opacity-40 hidden lg:block"></div>
      <div className="absolute bottom-32 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-pink-400/35 to-purple-400/30 rounded-full blur-3xl animate-bounce-slow opacity-35 hidden lg:block"></div>
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-gradient-to-bl from-purple-300/30 to-pink-300/25 rounded-full blur-2xl animate-pulse opacity-30 hidden lg:block"></div>

      {/* Mobile background gradients */}
      <div className="absolute top-10 right-5 w-32 h-32 bg-gradient-to-br from-lime-400/40 to-yellow-300/35 rounded-full blur-xl animate-pulse lg:hidden"></div>
      <div className="absolute bottom-40 left-5 w-40 h-40 bg-gradient-to-tr from-pink-400/40 to-purple-300/35 rounded-full blur-xl animate-float lg:hidden"></div>

      {/* Decorative Icons */}
      <div className="absolute top-20 left-10 text-pink-500 opacity-30 hidden lg:block animate-float-slow">
        <Heart className="w-12 h-12" fill="currentColor" />
      </div>
      <div className="absolute bottom-32 right-20 text-lime-500 opacity-35 hidden lg:block animate-bounce-slow">
        <Star className="w-14 h-14" fill="currentColor" />
      </div>
      <div className="absolute top-1/2 left-5 text-purple-400 opacity-30 hidden lg:block animate-pulse">
        <Sparkles className="w-12 h-12" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-6">
            <img
              src="/logo-iemocional.png"
              alt="Kit Inteligência Emocional Logo"
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-indigo-900 leading-tight">
              Kit Inteligência Emocional
            </h1>
          </div>

          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">Acesso Exclusivo!</span>
            <Sparkles className="w-5 h-5 text-orange-500" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-indigo-900 mb-4 leading-tight">
            Seu acesso está{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-lime-500 to-lime-600 bg-clip-text text-transparent">
                pronto!
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300 -z-10 transform -rotate-1"></span>
            </span>
          </h2>

          <p className="text-lg text-gray-700 mb-2 font-semibold">
            Parabéns pela sua compra!
          </p>
          <p className="text-base text-gray-600">
            Acesse abaixo para ver seus 13 recursos agora mesmo.
          </p>
        </div>

        {/* Login Card - White with elevated shadow */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Install App Button */}
            <div className="animate-slide-down">
              <PWAInstallButton variant="login" />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-800 mb-2"
              >
                Seu E-mail de Compra
              </label>
              <p className="text-xs text-pink-600 mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Use o mesmo email que você cadastrou na Hotmart.
              </p>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-lime-500 focus:border-lime-500 outline-none text-lg transition-all text-gray-900 placeholder-gray-400"
                placeholder="exemplo@email.com"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-4 text-sm">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold">{error}</p>
                    {remainingAttempts !== null && remainingAttempts > 0 && (
                      <p className="text-xs mt-1">
                        Você tem {remainingAttempts} tentativas restantes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cloudflare Turnstile */}
            <TurnstileWidget
              onSuccess={setTurnstileToken}
              theme="light"
            />

            {/* Submit Button - Lime gradient with glow */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-lime-300 via-yellow-300 to-lime-300 rounded-full opacity-40 blur-xl animate-pulse"></div>
              <button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-lime-500 to-lime-600 text-white font-black py-5 px-6 rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center relative z-10 gap-2">
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Validando...
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Zap className="w-5 h-5 animate-pulse" fill="white" />
                    Acessar Conteúdo
                    <Zap className="w-5 h-5 animate-pulse" fill="white" />
                  </span>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4"></path>
                </svg>
                <span className="font-medium">Acesso Imediato</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4"></path>
                </svg>
                <span className="font-medium">100% Seguro</span>
              </div>
              {/* <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4"></path>
                </svg>
                <span className="font-medium">Garantía de 7 Días</span>
              </div> */}
            </div>
          </form>

          {/* Support Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Gift className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-bold text-pink-700">Bem-vindo ao seu Kit!</span> Acesse 13 ferramentas visuais para gerenciar emoções.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Não consegue acessar? Fale conosco
            </button>
          </div>
        </div>

        {/* Email Support Modal */}
        <EmailSupportModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          subject="Suporte de Acesso - Kit Inteligência Emocional"
          body="Olá, preciso de ajuda para acessar meu Kit de Inteligência Emocional"
        />

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center gap-2 text-pink-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-bold">
              Acesso Protegido
            </p>
          </div>
          <p className="text-xs text-gray-600">
            Kit Inteligência Emocional - 13 Recursos Visuais Exclusivos
          </p>
        </div>
      </div>
    </div>
  )
}
