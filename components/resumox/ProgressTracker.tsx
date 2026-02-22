'use client'

import { STEP_LABELS } from '@/lib/resumox-types'

interface ProgressTrackerProps {
  progressPct: number
}

export default function ProgressTracker({ progressPct }: ProgressTrackerProps) {
  // Map progress to step index: 0=0%, 1=25%, 2=50%, 3=70%, 4=95%+
  const stepThresholds = [0, 25, 50, 70, 95]
  const currentStep = stepThresholds.reduce((acc, t, i) => (progressPct >= t ? i : acc), 0)

  return (
    <section className="px-5 pb-6">
      <div className="bg-resumox-surface border border-resumox-border rounded-2xl p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs text-resumox-muted">Progresso</span>
          <strong className="text-[13px] text-resumox-green">{progressPct}%</strong>
        </div>

        {/* Track */}
        <div className="h-1.5 bg-resumox-surface3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #6C5CE7, #00D68F)',
            }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between mt-3">
          {STEP_LABELS.map((label, i) => {
            const isDone = currentStep > i
            const isActive = currentStep === i

            return (
              <div key={label} className="flex flex-col items-center gap-1 text-[10px] text-resumox-muted">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                    isDone
                      ? 'bg-resumox-green border-2 border-resumox-green text-white'
                      : isActive
                        ? 'border-2 border-resumox-accent-light text-resumox-accent-light'
                        : 'bg-resumox-surface3 border-2 border-resumox-border'
                  }`}
                  style={isActive ? { background: 'rgba(108,92,231,0.3)' } : undefined}
                >
                  {isDone ? '✓' : i + 1}
                </div>
                {label}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
