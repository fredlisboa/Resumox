'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { isValidEmail } from '@/lib/utils'
import PWAInstallButton from '@/components/PWAInstallButton'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import EmailSupportModal from '@/components/EmailSupportModal'
import TurnstileWidget from '@/components/TurnstileWidget'
import { BookOpen } from 'lucide-react'

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number
  }>>([])

  useEffect(() => {
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * -20,
      opacity: Math.random() * 0.5 + 0.2,
    }))
    setParticles(generated)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(162, 155, 254, ${p.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 3}px rgba(108, 92, 231, ${p.opacity * 0.6})`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function ResumoxLoginPage() {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), turnstileToken }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(data.redirectTo || '/resumox/dashboard')
      } else {
        setError(data.error || 'Erro ao fazer login')
        if (data.remainingAttempts !== undefined) setRemainingAttempts(data.remainingAttempts)
        if (response.status === 429) {
          const blockedUntil = new Date(data.blockedUntil)
          setError(`Muitas tentativas. Bloqueado até ${blockedUntil.toLocaleTimeString('pt-BR')}`)
        }
      }
    } catch {
      setError('Erro de conexão. Verifique sua internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0A0A0F' }}>
      <PWAInstallPrompt locale="pt-BR" />

      {/* Floating accent circles */}
      <div
        className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl animate-float-slow"
        style={{ background: 'radial-gradient(circle, rgba(108, 92, 231, 0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl animate-float-delayed"
        style={{ background: 'radial-gradient(circle, rgba(162, 155, 254, 0.2) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full mix-blend-screen filter blur-2xl animate-float-medium"
        style={{ background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl animate-float-slow-reverse"
        style={{ background: 'radial-gradient(circle, rgba(162, 155, 254, 0.18) 0%, transparent 70%)' }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mt-8 sm:mt-12">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <div
                className="absolute inset-0 rounded-full blur-2xl animate-pulse"
                style={{ background: 'radial-gradient(circle, rgba(108, 92, 231, 0.3) 0%, transparent 70%)' }}
              />
              <div
                className="absolute inset-6 rounded-full border-2 border-[#6C5CE7]/30 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #13131A 0%, #0A0A0F 100%)',
                  boxShadow: '0 0 40px rgba(108, 92, 231, 0.3), inset 0 0 30px rgba(162, 155, 254, 0.15)',
                }}
              >
                <BookOpen
                  className="w-16 h-16 sm:w-20 sm:h-20 text-[#A29BFE]"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(162, 155, 254, 0.8))' }}
                />
              </div>
              {/* Orbiting dot */}
              <div
                className="absolute top-1/2 left-1/2 w-3 h-3 sm:w-4 sm:h-4 -ml-1.5 -mt-1.5 sm:-ml-2 sm:-mt-2 bg-[#A29BFE] rounded-full animate-orbit-resumox"
                style={{ boxShadow: '0 0 14px rgba(162, 155, 254, 0.9), 0 0 28px rgba(108, 92, 231, 0.5)' }}
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-[#E8E8ED] via-[#A29BFE] to-[#6C5CE7] bg-clip-text text-transparent">
            Seu acesso está pronto!
          </h1>
          <p className="text-lg text-[#A29BFE] mb-3 font-semibold">Parabéns pela sua compra!</p>
          <p className="text-base text-[#8888A0] mb-6">659 livros. Pagamento único. Zero mensalidade.</p>
          <div className="inline-block px-6 py-2 bg-[#13131A]/80 border border-[#6C5CE7]/30 rounded-full mb-4">
            <p className="text-3xl font-bold text-[#E8E8ED] tracking-tight">ResumoX</p>
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-3xl p-8 border border-[#6C5CE7]/20"
          style={{
            background: 'rgba(19, 19, 26, 0.9)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px 0 rgba(108, 92, 231, 0.15)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-down">
              <PWAInstallButton variant="login" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#A29BFE] mb-2">
                Seu E-mail de Compra
              </label>
              <p className="text-xs text-[#6C5CE7] mb-3 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
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
                className="w-full px-5 py-4 bg-[#0A0A0F]/50 border border-[#6C5CE7]/30 rounded-2xl focus:ring-2 focus:ring-[#6C5CE7] focus:border-[#6C5CE7] focus:shadow-[0_0_20px_rgba(108,92,231,0.4)] outline-none text-lg transition-all text-[#E8E8ED] placeholder-[#8888A0]/50 backdrop-blur-sm"
                placeholder="exemplo@email.com"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 rounded-2xl p-4 text-sm backdrop-blur-sm">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium">{error}</p>
                    {remainingAttempts !== null && remainingAttempts > 0 && (
                      <p className="text-xs mt-1 text-red-300">Você tem {remainingAttempts} tentativas restantes</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <TurnstileWidget onSuccess={setTurnstileToken} theme="dark" />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] text-white font-bold py-5 px-6 rounded-2xl shadow-[0_0_30px_rgba(108,92,231,0.5)] hover:shadow-[0_0_40px_rgba(108,92,231,0.7)] transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg relative overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Validando...
                </span>
              ) : (
                <span>Acessar Minha Biblioteca</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#6C5CE7]/20 space-y-4">
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="flex items-center justify-center w-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] hover:from-[#A29BFE] hover:to-[#6C5CE7] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(108,92,231,0.3)] hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] group"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Não consegue acessar? Fale conosco
            </button>
          </div>
        </div>

        <EmailSupportModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          subject="Suporte de Acesso - ResumoX"
          body="Olá, preciso de ajuda para acessar minha biblioteca do ResumoX"
          locale="pt-BR"
        />

        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#6C5CE7]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold">Acesso Protegido</p>
          </div>
          <p className="text-xs text-[#8888A0]">ResumoX — Protegido por Criptografia</p>
        </div>
      </div>
    </div>
  )
}
