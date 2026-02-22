'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona automaticamente para /resumox
    router.replace('/resumox')
  }, [router])

  // Mostra uma mensagem de carregamento enquanto redireciona
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neuro-900 to-neuro-800">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-white text-lg">Redirecionando...</p>
      </div>
    </div>
  )
}
