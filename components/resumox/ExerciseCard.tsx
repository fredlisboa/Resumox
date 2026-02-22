'use client'

import { useState, useEffect } from 'react'

interface ExerciseCardProps {
  title: string
  icon: string
  colorTheme: 'accent' | 'green' | 'orange'
  description: string
  templateText?: string
  checklist: string[]
  checklistState: boolean[]
  onChecklistChange: (state: boolean[]) => void
}

const themeColors = {
  accent: { bg: 'rgba(108,92,231,0.1)', border: 'rgba(108,92,231,0.3)', text: '#A29BFE', check: '#6C5CE7' },
  green: { bg: 'rgba(0,214,143,0.08)', border: 'rgba(0,214,143,0.3)', text: '#00D68F', check: '#00D68F' },
  orange: { bg: 'rgba(255,169,77,0.08)', border: 'rgba(255,169,77,0.3)', text: '#FFA94D', check: '#FFA94D' },
}

export default function ExerciseCard({
  title,
  icon,
  colorTheme,
  description,
  templateText,
  checklist,
  checklistState,
  onChecklistChange,
}: ExerciseCardProps) {
  const [localState, setLocalState] = useState(checklistState)
  const colors = themeColors[colorTheme]

  useEffect(() => {
    setLocalState(checklistState)
  }, [checklistState])

  const toggleItem = (idx: number) => {
    const newState = [...localState]
    newState[idx] = !newState[idx]
    setLocalState(newState)
    onChecklistChange(newState)
  }

  const completedCount = localState.filter(Boolean).length

  return (
    <div
      className="rounded-2xl p-4 border mb-4"
      style={{ background: colors.bg, borderColor: colors.border }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-bold" style={{ color: colors.text }}>{title}</h3>
      </div>

      <p className="text-xs text-resumox-text leading-relaxed mb-3">{description}</p>

      {templateText && (
        <div className="bg-resumox-surface/50 border border-resumox-border rounded-xl p-3 mb-3">
          <p className="text-[11px] text-resumox-muted italic whitespace-pre-line">{templateText}</p>
        </div>
      )}

      {/* Checklist */}
      <div className="space-y-2">
        {checklist.map((item, idx) => (
          <label
            key={idx}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                localState[idx]
                  ? 'border-transparent'
                  : 'border-resumox-border group-hover:border-resumox-accent/40'
              }`}
              style={localState[idx] ? { background: colors.check, borderColor: colors.check } : undefined}
            >
              {localState[idx] && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-xs leading-relaxed transition-all ${
              localState[idx] ? 'text-resumox-muted line-through' : 'text-resumox-text'
            }`}>
              {item}
            </span>
          </label>
        ))}
      </div>

      {completedCount > 0 && (
        <div className="mt-3 text-[10px] font-semibold" style={{ color: colors.text }}>
          {completedCount}/{checklist.length} concluídos
        </div>
      )}
    </div>
  )
}
