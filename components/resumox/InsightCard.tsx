'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

interface InsightCardProps {
  text: string
  sourceChapter: string
  bookTitle: string
  bookId: string
  isSaved?: boolean
  onToggleSave: (text: string) => void
}

export default function InsightCard({
  text,
  sourceChapter,
  bookTitle,
  isSaved = false,
  onToggleSave,
}: InsightCardProps) {
  const [saved, setSaved] = useState(isSaved)

  const handleSave = () => {
    setSaved(!saved)
    onToggleSave(text)
  }

  const handleShare = async () => {
    const shareText = `"${text}"\n— ${bookTitle}\n\nVia Resumox`
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <div className="bg-resumox-surface border border-resumox-border rounded-2xl p-4">
      <blockquote className="text-sm text-resumox-text leading-relaxed mb-3 italic">
        &ldquo;{text}&rdquo;
      </blockquote>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-resumox-accent-light font-semibold uppercase tracking-wide">
          {sourceChapter}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-lg transition-all ${
              saved
                ? 'text-red-400 bg-red-400/10'
                : 'text-resumox-muted hover:text-red-400'
            }`}
          >
            <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-resumox-muted hover:text-resumox-accent-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
