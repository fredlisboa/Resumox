'use client'

interface StreakBadgeProps {
  streak: number
  className?: string
}

export default function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  if (streak <= 0) return null

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
      style={{ background: 'rgba(240, 192, 64, 0.15)', color: '#F0C040' }}
    >
      🔥 {streak}
    </span>
  )
}
