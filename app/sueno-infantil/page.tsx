'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { isValidEmail } from '@/lib/utils'
import PWAInstallButton from '@/components/PWAInstallButton'
import EmailSupportModal from '@/components/EmailSupportModal'
import TurnstileWidget from '@/components/TurnstileWidget'
import { Moon, Stars } from 'lucide-react'

export default function SuenoInfantilLoginPage() {
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
      setError('Por favor, ingresa tu e-mail')
      return
    }

    if (!isValidEmail(email)) {
      setError('E-mail inválido')
      return
    }

    if (!turnstileToken) {
      setError('Por favor, completa la verificación de seguridad')
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
        router.push(data.redirectTo || '/sueno-infantil/dashboard')
      } else {
        setError(data.error || 'Error al iniciar sesión')

        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts)
        }

        if (response.status === 429) {
          const blockedUntil = new Date(data.blockedUntil)
          setError(`Muchos intentos. Bloqueado hasta ${blockedUntil.toLocaleTimeString('es-419')}`)
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Error de conexión. Verifica tu internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#0F172A]">
      {/* Lavender floating circles - Midnight Nursery Theme */}
      <div
        className="absolute top-20 left-10 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl animate-float-slow"
        style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.35) 0%, rgba(192, 132, 252, 0) 70%)' }}
      />
      <div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl animate-float-delayed"
        style={{ background: 'radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, rgba(129, 140, 248, 0) 70%)' }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full mix-blend-screen filter blur-2xl animate-float-medium"
        style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.25) 0%, rgba(192, 132, 252, 0) 70%)' }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl animate-float-slow-reverse"
        style={{ background: 'radial-gradient(circle, rgba(167, 139, 250, 0.28) 0%, rgba(167, 139, 250, 0) 70%)' }}
      />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo/Header - Moon Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
              {/* Glow effects */}
              <div
                className="absolute inset-0 rounded-full blur-2xl animate-pulse"
                style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, rgba(192, 132, 252, 0) 70%)' }}
              />
              <div
                className="absolute -inset-4 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, rgba(129, 140, 248, 0) 70%)' }}
              />

              {/* Rotating rings */}
              <div className="absolute inset-4 border-2 border-[#C084FC]/20 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
              <div className="absolute inset-6 border-2 border-[#818CF8]/20 rounded-full animate-spin" style={{animationDuration: '12s', animationDirection: 'reverse'}}></div>

              {/* Main logo circle */}
              <div
                className="absolute inset-8 rounded-full border-2 border-[#C084FC]/30 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
                  boxShadow: '0 0 40px rgba(192, 132, 252, 0.3), inset 0 0 30px rgba(129, 140, 248, 0.2)'
                }}
              >
                <Moon
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-[#C084FC]"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(192, 132, 252, 0.8))' }}
                />
              </div>

              {/* Orbiting stars */}
              <div
                className="absolute top-0 left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#C084FC] rounded-full animate-orbit-glow"
                style={{boxShadow: '0 0 15px rgba(192, 132, 252, 0.9)'}}
              />
              <div
                className="absolute bottom-0 right-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#818CF8] rounded-full animate-orbit-glow"
                style={{boxShadow: '0 0 12px rgba(129, 140, 248, 0.8)', animationDelay: '2s'}}
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-[#A5B4FC] via-[#C084FC] to-[#818CF8] bg-clip-text text-transparent animate-shimmer" style={{backgroundSize: '200% auto'}}>
            ¡Tu acceso está listo!
          </h1>
          <p className="text-lg sm:text-xl text-[#A5B4FC] mb-3 font-semibold">
            ¡Felicidades por tu compra!
          </p>
          <p className="text-base sm:text-lg text-[#94A3B8] mb-6">
            Ingresa para transformar las noches de tu familia.
          </p>
          <div className="inline-block px-6 py-2 bg-[#1E1B4B]/50 border border-[#818CF8]/30 rounded-full mb-4">
            <p className="text-4xl font-bold text-[#F1F5F9] tracking-tight">
              Sueño Infantil
            </p>
          </div>
        </div>

        {/* Login Card - Glassmorphism */}
        <div
          className="rounded-3xl p-8 border border-[#818CF8]/20"
          style={{
            background: 'rgba(30, 27, 75, 0.8)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px 0 rgba(129, 140, 248, 0.15)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Install App Button */}
            <div className="animate-slide-down">
              <PWAInstallButton variant="login" />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#A5B4FC] mb-2"
              >
                Tu E-mail de Compra
              </label>
              <p className="text-xs text-[#818CF8] mb-3 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Usa el mismo email que registraste en Hotmart.
              </p>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-[#0F172A]/50 border border-[#818CF8]/30 rounded-2xl focus:ring-2 focus:ring-[#818CF8] focus:border-[#818CF8] focus:shadow-[0_0_20px_rgba(129,140,248,0.4)] outline-none text-lg transition-all text-[#F1F5F9] placeholder-[#94A3B8]/50 backdrop-blur-sm"
                placeholder="ejemplo@correo.com"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 rounded-2xl p-4 text-sm backdrop-blur-sm">
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
                    <p className="font-medium">{error}</p>
                    {remainingAttempts !== null && remainingAttempts > 0 && (
                      <p className="text-xs mt-1 text-red-300">
                        Tienes {remainingAttempts} intentos restantes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cloudflare Turnstile */}
            <TurnstileWidget
              onSuccess={setTurnstileToken}
              theme="dark"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#818CF8] to-[#C084FC] text-white font-bold py-5 px-6 rounded-2xl shadow-[0_0_30px_rgba(192,132,252,0.5)] hover:shadow-[0_0_40px_rgba(192,132,252,0.7)] transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg relative overflow-hidden group"
            >
              {loading ? (
                <span className="flex items-center justify-center relative z-10">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                <span className="relative z-10">Entrar al Contenido</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A5B4FC] to-[#C084FC] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* Support Section */}
          <div className="mt-6 pt-6 border-t border-[#818CF8]/20 space-y-4">
            <div
              className="border border-[#818CF8]/30 rounded-2xl p-4 backdrop-blur-sm"
              style={{ background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(192, 132, 252, 0.1) 100%)' }}
            >
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#818CF8] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-[#A5B4FC] leading-relaxed">
                    Enviamos una copia de seguridad de tus archivos a tu email. Si no ves el acceso aquí, revisa tu bandeja de entrada o spam.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="flex items-center justify-center w-full bg-gradient-to-r from-[#818CF8] to-[#A5B4FC] hover:from-[#A5B4FC] hover:to-[#818CF8] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(129,140,248,0.5)] hover:shadow-lg hover:shadow-[#818CF8]/50 hover:scale-[1.03] active:scale-[0.98] group"
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
              ¿No puedes acceder? Contáctanos
            </button>
          </div>
        </div>

        {/* Email Support Modal */}
        <EmailSupportModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          subject="Soporte de Acceso - Sueño Infantil"
          body="Hola, necesito ayuda para acceder a mi contenido del Kit Sueño Infantil"
        />

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#818CF8]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold">
              Acceso Protegido
            </p>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Contenido Original Sueño Infantil - Protegido por Criptografía
          </p>
        </div>
      </div>
    </div>
  )
}
