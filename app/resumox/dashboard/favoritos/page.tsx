'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import type { ResumoxSavedInsight } from '@/lib/resumox-types'

interface InsightWithBook extends ResumoxSavedInsight {
  resumox_books?: {
    title: string
    slug: string
    author: string
  }
}

export default function FavoritosPage() {
  const [insights, setInsights] = useState<InsightWithBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch('/api/resumox/insights')
        if (res.ok) {
          const data = await res.json()
          setInsights(data.insights || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/resumox/insights?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setInsights((prev) => prev.filter((i) => i.id !== id))
      }
    } catch {
      // ignore
    }
  }

  return (
    <>
      <ResumoxNav showBack />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-red-400" />
          <h1 className="text-xl font-extrabold text-resumox-text">Meus Favoritos</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-resumox-accent border-t-transparent" />
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-resumox-border mx-auto mb-3" />
            <p className="text-sm text-resumox-muted">Nenhum insight salvo ainda.</p>
            <p className="text-xs text-resumox-muted mt-1">Salve insights ao ler os livros!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-resumox-surface border border-resumox-border rounded-2xl p-4"
              >
                <blockquote className="text-sm text-resumox-text leading-relaxed italic mb-3">
                  &ldquo;{insight.insight_text}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    {insight.resumox_books && (
                      <p className="text-[11px] text-resumox-accent-light font-semibold">
                        {insight.resumox_books.title}
                      </p>
                    )}
                    {insight.insight_source && (
                      <p className="text-[10px] text-resumox-muted">{insight.insight_source}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(insight.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Heart className="w-4 h-4" fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
