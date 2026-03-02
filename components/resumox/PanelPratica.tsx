'use client'

import ExerciseCard from './ExerciseCard'
import type { ExerciseData, ChecklistState } from '@/lib/resumox-types'

interface PanelPraticaProps {
  exercises: ExerciseData[] | null
  checklistState: ChecklistState
  onChecklistChange: (state: ChecklistState) => void
}

export default function PanelPratica({ exercises, checklistState, onChecklistChange }: PanelPraticaProps) {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="px-5 text-center py-8">
        <p className="text-sm text-resumox-muted">Exercícios práticos em breve.</p>
      </div>
    )
  }

  const handleExerciseChange = (exerciseIdx: number, state: boolean[]) => {
    const newChecklistState = { ...checklistState, [`exercise_${exerciseIdx}`]: state }
    onChecklistChange(newChecklistState)
  }

  // Calculate total XP from all checked items
  let totalChecked = 0
  let totalItems = 0
  exercises.forEach((exercise, i) => {
    const ex = exercise as ExerciseData & Record<string, unknown>
    const checklist = ex.checklist || (ex.steps as string[]) || []
    const state = checklistState[`exercise_${i}`] || new Array(checklist.length).fill(false)
    totalItems += checklist.length
    totalChecked += state.filter(Boolean).length
  })
  const totalXp = totalChecked * 2

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-resumox-accent-light uppercase tracking-wide">
          Exercícios Práticos
        </p>
        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <span className="text-[10px] text-resumox-muted">
              {totalChecked}/{totalItems}
            </span>
          )}
          {totalXp > 0 && (
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,214,143,0.12)', color: '#00D68F' }}
            >
              +{totalXp} XP
            </span>
          )}
        </div>
      </div>
      {exercises.map((exercise, i) => {
        const ex = exercise as ExerciseData & Record<string, unknown>
        const colorTheme = ex.color_theme || (ex.color as string) || (ex.accent as string) || (ex.theme as string) || 'accent'
        const checklist = ex.checklist || (ex.steps as string[]) || []
        return (
          <ExerciseCard
            key={i}
            title={ex.title}
            icon={ex.icon || '📝'}
            colorTheme={colorTheme as 'accent' | 'green' | 'orange'}
            description={ex.description || ''}
            templateText={ex.template_text}
            checklist={checklist}
            checklistState={checklistState[`exercise_${i}`] || new Array(checklist.length).fill(false)}
            onChecklistChange={(state) => handleExerciseChange(i, state)}
          />
        )
      })}
    </div>
  )
}
