'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import ResumoxLibrary from '@/components/resumox/ResumoxLibrary'
import type { ResumoxUserStats } from '@/lib/resumox-types'

export default function ResumoxDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<ResumoxUserStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/resumox/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
        }
      } catch {
        // ignore
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      <ResumoxNav streak={stats?.current_streak || 0} />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Hero */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-resumox-text mb-1">Sua Biblioteca</h1>
          <p className="text-sm text-resumox-muted">659 livros. Pagamento único. Zero mensalidade.</p>
        </div>

        {/* Quick Stats */}
        {stats && (stats.total_books_completed > 0 || stats.total_xp > 0) && (
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-resumox-surface border border-resumox-border rounded-2xl p-3 text-center">
              <p className="text-lg font-bold text-resumox-green">{stats.total_books_completed}</p>
              <p className="text-[10px] text-resumox-muted uppercase tracking-wide">Completos</p>
            </div>
            <div className="flex-1 bg-resumox-surface border border-resumox-border rounded-2xl p-3 text-center">
              <p className="text-lg font-bold text-resumox-accent-light">{stats.total_xp}</p>
              <p className="text-[10px] text-resumox-muted uppercase tracking-wide">XP</p>
            </div>
            <div className="flex-1 bg-resumox-surface border border-resumox-border rounded-2xl p-3 text-center">
              <p className="text-lg font-bold text-resumox-gold">{stats.current_streak}</p>
              <p className="text-[10px] text-resumox-muted uppercase tracking-wide">Streak</p>
            </div>
          </div>
        )}

        <ResumoxLibrary />

        {/* Footer nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-resumox-border" style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-lg mx-auto flex">
            <button
              onClick={() => router.push('/resumox/dashboard')}
              className="flex-1 flex flex-col items-center py-3 text-resumox-accent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span className="text-[10px] font-semibold mt-0.5">Biblioteca</span>
            </button>
            <button
              onClick={() => router.push('/resumox/dashboard/trilhas')}
              className="flex-1 flex flex-col items-center py-3 text-resumox-muted hover:text-resumox-accent-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <span className="text-[10px] font-semibold mt-0.5">Trilhas</span>
            </button>
            <button
              onClick={() => router.push('/resumox/dashboard/busca')}
              className="flex-1 flex flex-col items-center py-3 text-resumox-muted hover:text-resumox-accent-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="text-[10px] font-semibold mt-0.5">Buscar</span>
            </button>
            <button
              onClick={() => router.push('/resumox/dashboard/perfil')}
              className="flex-1 flex flex-col items-center py-3 text-resumox-muted hover:text-resumox-accent-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-[10px] font-semibold mt-0.5">Perfil</span>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
