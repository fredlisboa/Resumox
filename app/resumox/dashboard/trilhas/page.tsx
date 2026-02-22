'use client'

import { useState, useEffect } from 'react'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import TrailCard from '@/components/resumox/TrailCard'
import type { TrailWithBooks } from '@/lib/resumox-types'

export default function TrilhasPage() {
  const [trails, setTrails] = useState<TrailWithBooks[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const res = await fetch('/api/resumox/trails')
        if (res.ok) {
          const data = await res.json()
          setTrails(data.trails || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchTrails()
  }, [])

  return (
    <>
      <ResumoxNav showBack backHref="/resumox/dashboard" />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-resumox-text mb-1">Trilhas de Aprendizado</h1>
          <p className="text-sm text-resumox-muted">
            Siga trilhas curadas para dominar um tema específico, livro por livro.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-resumox-surface animate-pulse" />
            ))}
          </div>
        ) : trails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🛤️</p>
            <p className="text-resumox-muted text-sm">Trilhas em breve!</p>
            <p className="text-resumox-muted text-xs mt-1">
              Estamos preparando trilhas curadas para você.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {trails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
