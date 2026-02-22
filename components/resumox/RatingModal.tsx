'use client'

import { useState } from 'react'
import { Trophy } from 'lucide-react'

interface RatingModalProps {
  isOpen: boolean
  bookTitle: string
  xpEarned: number
  onRate: (rating: number) => void
  onClose: () => void
}

export default function RatingModal({ isOpen, bookTitle, xpEarned, onRate, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating)
      setSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div
        className="w-full max-w-sm rounded-3xl p-8 border border-resumox-accent/30 text-center"
        style={{
          background: 'rgba(19, 19, 26, 0.98)',
          boxShadow: '0 8px 40px rgba(108,92,231,0.3)',
        }}
      >
        {/* Trophy */}
        <div className="flex justify-center mb-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(240,192,64,0.2), rgba(240,192,64,0.05))',
              boxShadow: '0 0 40px rgba(240,192,64,0.2)',
            }}
          >
            <Trophy className="w-10 h-10 text-resumox-gold" />
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-resumox-text mb-2">
          {submitted ? 'Obrigado!' : 'Parabéns!'}
        </h2>

        {!submitted ? (
          <>
            <p className="text-sm text-resumox-muted mb-1">Você completou</p>
            <p className="text-base font-bold text-resumox-accent-light mb-4">{bookTitle}</p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(0,214,143,0.12)' }}
            >
              <span className="text-resumox-green font-bold text-sm">+{xpEarned} XP</span>
            </div>

            {/* Star rating */}
            <p className="text-xs text-resumox-muted mb-3">Avalie este livro</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className="w-8 h-8"
                    fill={(hoveredStar || rating) >= star ? '#F0C040' : '#2A2A3A'}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full py-3 bg-gradient-to-r from-resumox-accent to-resumox-accent-light text-white font-bold rounded-2xl disabled:opacity-50 transition-all hover:shadow-lg"
            >
              Avaliar
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-resumox-muted mb-6">Sua avaliação foi salva.</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-resumox-accent to-resumox-accent-light text-white font-bold rounded-2xl transition-all hover:shadow-lg"
            >
              Continuar Lendo
            </button>
          </>
        )}
      </div>
    </div>
  )
}
