'use client'

import InsightCard from './InsightCard'
import type { InsightData } from '@/lib/resumox-types'

interface PanelInsightsProps {
  insights: InsightData[] | null
  bookId: string
  bookTitle: string
  savedInsightTexts: Set<string>
  onToggleSave: (text: string, sourceChapter: string) => void
}

export default function PanelInsights({
  insights,
  bookId,
  bookTitle,
  savedInsightTexts,
  onToggleSave,
}: PanelInsightsProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className="px-5 text-center py-8">
        <p className="text-sm text-resumox-muted">Insights em breve.</p>
      </div>
    )
  }

  return (
    <div className="px-5 space-y-3">
      <p className="text-sm font-bold text-resumox-accent-light uppercase tracking-wide mb-2">
        {insights.length} Insights Poderosos
      </p>
      {insights.map((insight, i) => (
        <InsightCard
          key={i}
          text={insight.text}
          sourceChapter={insight.source_chapter}
          bookTitle={bookTitle}
          bookId={bookId}
          isSaved={savedInsightTexts.has(insight.text)}
          onToggleSave={(text) => onToggleSave(text, insight.source_chapter)}
        />
      ))}
    </div>
  )
}
