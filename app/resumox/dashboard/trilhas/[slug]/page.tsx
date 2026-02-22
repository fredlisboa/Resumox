'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import BookCard from '@/components/resumox/BookCard'
import type { TrailWithBooks } from '@/lib/resumox-types'

export default function TrailDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [trail, setTrail] = useState<TrailWithBooks | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrail = async () => {
      try {
        const res = await fetch('/api/resumox/trails')
        if (res.ok) {
          const data = await res.json()
          const found = data.trails?.find((t: TrailWithBooks) => t.slug === slug)
          setTrail(found || null)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchTrail()
  }, [slug])

  if (loading) {
    return (
      <>
        <ResumoxNav showBack backHref="/resumox/dashboard/trilhas" />
        <main className="max-w-lg mx-auto px-4 py-6">
          <div className="h-32 rounded-2xl bg-resumox-surface animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-resumox-surface animate-pulse" />
            ))}
          </div>
        </main>
      </>
    )
  }

  if (!trail) {
    return (
      <>
        <ResumoxNav showBack backHref="/resumox/dashboard/trilhas" />
        <main className="max-w-lg mx-auto px-4 py-6 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-resumox-muted">Trilha não encontrada</p>
        </main>
      </>
    )
  }

  const progress = trail.total_books > 0
    ? Math.round((trail.completed_books / trail.total_books) * 100)
    : 0

  return (
    <>
      <ResumoxNav showBack backHref="/resumox/dashboard/trilhas" />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        {/* Trail hero */}
        <div
          className="rounded-2xl p-5 mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${trail.cover_gradient_from}, ${trail.cover_gradient_to})`,
          }}
        >
          <div className="relative z-10">
            <span className="text-4xl mb-2 block">{trail.emoji}</span>
            <h1 className="text-xl font-extrabold text-white mb-1">{trail.title}</h1>
            <p className="text-sm text-white/70 mb-3">{trail.description}</p>

            <div className="flex items-center gap-4 text-xs text-white/60">
              <span>{trail.total_books} livros</span>
              {trail.completed_books > 0 && (
                <span className="text-resumox-green font-semibold">
                  {trail.completed_books} completos
                </span>
              )}
            </div>

            {progress > 0 && (
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: progress >= 100
                      ? '#00D68F'
                      : 'linear-gradient(90deg, #6C5CE7, #A29BFE)',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Books list */}
        <h2 className="text-sm font-bold text-resumox-muted uppercase tracking-wider mb-3">
          Livros da trilha
        </h2>

        <div className="space-y-2">
          {trail.books.map((book, index) => (
            <div key={book.id} className="flex items-start gap-3">
              {/* Step number */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: book.progress?.status === 'completed'
                      ? '#00D68F'
                      : book.progress?.status === 'in_progress'
                        ? 'linear-gradient(135deg, #6C5CE7, #A29BFE)'
                        : 'var(--rx-surface3, #2A2A3A)',
                    color: book.progress?.status === 'completed' || book.progress?.status === 'in_progress'
                      ? 'white'
                      : 'var(--rx-muted, #8888A0)',
                  }}
                >
                  {book.progress?.status === 'completed' ? '✓' : index + 1}
                </div>
                {index < trail.books.length - 1 && (
                  <div
                    className="w-0.5 h-4 my-0.5"
                    style={{
                      background: book.progress?.status === 'completed'
                        ? '#00D68F40'
                        : 'var(--rx-border, #2A2A3A)',
                    }}
                  />
                )}
              </div>

              {/* Book card */}
              <div className="flex-1 min-w-0">
                <BookCard book={book} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
