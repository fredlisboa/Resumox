'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues
const FullScreenPDFViewer = dynamic(() => import('@/components/FullScreenPDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-neuro-dark flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
        <p className="mt-4 text-white font-medium">Cargando visor de PDF...</p>
      </div>
    </div>
  )
})

function PDFViewerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)

  const url = searchParams.get('url')
  const title = searchParams.get('title')

  console.log('[PDFViewerPage] URL from searchParams:', url)
  console.log('[PDFViewerPage] Title from searchParams:', title)

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
          router.push('/')
          return
        }
        const data = await response.json()
        if (!data.authenticated) {
          router.push('/')
          return
        }
        setLoading(false)
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    // Validate required params
    if (!url) {
      router.push('/dashboard')
    }
  }, [url, router])

  if (loading || !url) {
    return (
      <div className="min-h-screen bg-neuro-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-white font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  return <FullScreenPDFViewer url={url} title={title || 'PDF Document'} />
}

export default function PDFViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neuro-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-white font-medium">Iniciando visor...</p>
        </div>
      </div>
    }>
      <PDFViewerContent />
    </Suspense>
  )
}
