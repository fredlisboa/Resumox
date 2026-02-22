'use client'

import type { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  value: number | string
  label: string
  color?: string
}

export default function StatsCard({ icon, value, label, color = '#A29BFE' }: StatsCardProps) {
  return (
    <div className="bg-resumox-surface border border-resumox-border rounded-2xl p-4 text-center">
      <div className="flex justify-center mb-2" style={{ color }}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-resumox-muted uppercase tracking-wide mt-1">{label}</p>
    </div>
  )
}
