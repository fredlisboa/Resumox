'use client'

import Link from 'next/link'
import type { TrailWithBooks } from '@/lib/resumox-types'

interface TrailCardProps {
  trail: TrailWithBooks
}

export default function TrailCard({ trail }: TrailCardProps) {
  const progress = trail.total_books > 0
    ? Math.round((trail.completed_books / trail.total_books) * 100)
    : 0

  return (
    <Link
      href={`/resumox/dashboard/trilhas/${trail.slug}`}
      className="block rounded-2xl border border-resumox-border overflow-hidden hover:border-resumox-accent/40 transition-all"
    >
      {/* Gradient header */}
      <div
        className="h-24 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${trail.cover_gradient_from}, ${trail.cover_gradient_to})`,
        }}
      >
        <span className="text-4xl">{trail.emoji}</span>
        {progress > 0 && (
          <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="text-[10px] font-bold text-resumox-green">{progress}%</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 bg-resumox-surface">
        <h3 className="text-sm font-bold text-resumox-text mb-0.5 truncate">{trail.title}</h3>
        <p className="text-[11px] text-resumox-muted line-clamp-2 mb-2">{trail.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-resumox-muted">
            {trail.total_books} livros
          </span>
          {trail.completed_books > 0 && (
            <span className="text-[10px] text-resumox-green font-semibold">
              {trail.completed_books}/{trail.total_books} completos
            </span>
          )}
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="mt-2 h-1 bg-resumox-surface3 rounded-full overflow-hidden">
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
    </Link>
  )
}
