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

  return (
    <div className="px-5">
      <p className="text-sm font-bold text-resumox-accent-light uppercase tracking-wide mb-4">
        Exercícios Práticos
      </p>
      {exercises.map((exercise, i) => (
        <ExerciseCard
          key={i}
          title={exercise.title}
          icon={exercise.icon}
          colorTheme={exercise.color_theme}
          description={exercise.description}
          templateText={exercise.template_text}
          checklist={exercise.checklist}
          checklistState={checklistState[`exercise_${i}`] || new Array(exercise.checklist.length).fill(false)}
          onChecklistChange={(state) => handleExerciseChange(i, state)}
        />
      ))}
    </div>
  )
}
