'use client'

import { CheckCircle } from 'lucide-react'

interface CompleteButtonProps {
  isCompleted: boolean
  onComplete: () => void
}

export default function CompleteButton({ isCompleted, onComplete }: CompleteButtonProps) {
  if (isCompleted) {
    return (
      <div className="px-5 mb-6">
        <div className="w-full py-4 bg-resumox-green/10 border border-resumox-green/30 text-resumox-green font-bold text-center rounded-2xl flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Livro Completo!
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 mb-6">
      <button
        onClick={onComplete}
        className="w-full py-4 bg-gradient-to-r from-resumox-green to-emerald-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        style={{ boxShadow: '0 4px 20px rgba(0,214,143,0.3)' }}
      >
        <CheckCircle className="w-5 h-5" />
        Marcar como Concluído
      </button>
    </div>
  )
}
