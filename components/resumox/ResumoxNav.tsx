'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import StreakBadge from './StreakBadge'

interface ResumoxNavProps {
  showBack?: boolean
  backHref?: string
  streak?: number
}

export default function ResumoxNav({ showBack = false, backHref = '/resumox/dashboard', streak = 0 }: ResumoxNavProps) {
  const router = useRouter()

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-3"
      style={{
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--rx-border, #2A2A3A)',
      }}
    >
      {showBack ? (
        <button
          onClick={() => router.push(backHref)}
          className="flex items-center gap-1.5 text-sm text-resumox-accent-light hover:text-resumox-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Biblioteca
        </button>
      ) : (
        <div />
      )}

      <span className="font-extrabold text-base tracking-tight text-resumox-accent-light">
        ResumoX
      </span>

      <StreakBadge streak={streak} />
    </nav>
  )
}
