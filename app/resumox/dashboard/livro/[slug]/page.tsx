'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import BookHero from '@/components/resumox/BookHero'
import ProgressTracker from '@/components/resumox/ProgressTracker'
import BookTabBar from '@/components/resumox/BookTabBar'
import PanelResumo from '@/components/resumox/PanelResumo'
import CompleteButton from '@/components/resumox/CompleteButton'
import { useResumoxProgress } from '@/hooks/useResumoxProgress'

// Lazy-load heavier panels — only loaded when user navigates to them
const PanelAudio = dynamic(() => import('@/components/resumox/PanelAudio'))
const PanelMindMap = dynamic(() => import('@/components/resumox/PanelMindMap'))
const PanelInsights = dynamic(() => import('@/components/resumox/PanelInsights'))
const PanelPratica = dynamic(() => import('@/components/resumox/PanelPratica'))
const RatingModal = dynamic(() => import('@/components/resumox/RatingModal'))
const RelatedBooks = dynamic(() => import('@/components/resumox/RelatedBooks'))
import type {
  TabName,
  ResumoxBook,
  ResumoxBookContent,
  ResumoxUserProgress,
  ChecklistState,
} from '@/lib/resumox-types'

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { updateTab, updateAudioPosition, updateChecklist, markComplete } = useResumoxProgress()

  const [book, setBook] = useState<ResumoxBook | null>(null)
  const [content, setContent] = useState<ResumoxBookContent | null>(null)
  const [progress, setProgress] = useState<ResumoxUserProgress | null>(null)
  const [relatedBooks, setRelatedBooks] = useState<ResumoxBook[]>([])
  const [activeTab, setActiveTab] = useState<TabName>('resumo')
  const [checklistState, setChecklistState] = useState<ChecklistState>({})
  const [savedInsightTexts, setSavedInsightTexts] = useState<Set<string>>(new Set())
  const [showRating, setShowRating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ current_streak: number }>({ current_streak: 0 })

  // Fetch book data
  useEffect(() => {
    if (!slug) return
    const fetchBook = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/resumox/book/${slug}`)
        if (res.ok) {
          const data = await res.json()
          setBook(data.book)
          setContent(data.content)
          setProgress(data.progress)
          setRelatedBooks(data.related_books || [])

          if (data.progress?.current_tab) {
            setActiveTab(data.progress.current_tab)
          }
          if (data.progress?.checklist_state) {
            setChecklistState(data.progress.checklist_state)
          }
        }
      } catch (err) {
        console.error('Error fetching book:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [slug])

  // Fetch saved insights for this book
  useEffect(() => {
    if (!book) return
    const fetchInsights = async () => {
      try {
        const res = await fetch(`/api/resumox/insights?book_id=${book.id}`)
        if (res.ok) {
          const data = await res.json()
          const texts = new Set<string>(data.insights.map((i: { insight_text: string }) => i.insight_text))
          setSavedInsightTexts(texts)
        }
      } catch {
        // ignore
      }
    }
    fetchInsights()
  }, [book])

  // Fetch stats for streak
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/resumox/stats')
        if (res.ok) {
          const data = await res.json()
          setStats({ current_streak: data.stats?.current_streak || 0 })
        }
      } catch {
        // ignore
      }
    }
    fetchStats()
  }, [])

  const handleTabChange = useCallback(async (tab: TabName) => {
    setActiveTab(tab)
    if (book) {
      const updatedProgress = await updateTab(book.id, tab)
      if (updatedProgress) {
        setProgress(updatedProgress)
      }
    }
  }, [book, updateTab])

  const handleAudioPosition = useCallback((seconds: number) => {
    if (book) updateAudioPosition(book.id, seconds)
  }, [book, updateAudioPosition])

  const handleChecklistChange = useCallback((state: ChecklistState) => {
    setChecklistState(state)
    if (book) updateChecklist(book.id, state)
  }, [book, updateChecklist])

  const handleToggleInsight = useCallback(async (text: string, sourceChapter: string) => {
    if (!book) return
    const isSaved = savedInsightTexts.has(text)

    if (isSaved) {
      // Find and delete
      try {
        const res = await fetch(`/api/resumox/insights?book_id=${book.id}`)
        if (res.ok) {
          const data = await res.json()
          const insight = data.insights.find((i: { insight_text: string }) => i.insight_text === text)
          if (insight) {
            await fetch(`/api/resumox/insights?id=${insight.id}`, { method: 'DELETE' })
          }
        }
      } catch {
        // ignore
      }
      setSavedInsightTexts((prev) => {
        const next = new Set(prev)
        next.delete(text)
        return next
      })
    } else {
      // Save
      try {
        await fetch('/api/resumox/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book_id: book.id,
            insight_text: text,
            insight_source: sourceChapter,
          }),
        })
      } catch {
        // ignore
      }
      setSavedInsightTexts((prev) => new Set(prev).add(text))
    }
  }, [book, savedInsightTexts])

  const handleComplete = useCallback(async () => {
    if (!book) return
    const updatedProgress = await markComplete(book.id)
    if (updatedProgress) {
      setProgress(updatedProgress)
      setShowRating(true)
    }
  }, [book, markComplete])

  const handleRate = useCallback(async (rating: number) => {
    if (!book) return
    try {
      await fetch('/api/resumox/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: book.id, rating }),
      })
    } catch {
      // ignore
    }
  }, [book])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-resumox-accent border-t-transparent" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <p className="text-resumox-muted">Livro não encontrado.</p>
      </div>
    )
  }

  const progressPct = progress?.progress_pct || 0
  const isCompleted = progress?.status === 'completed'

  return (
    <>
      <ResumoxNav showBack streak={stats.current_streak} />

      <BookHero book={book} />
      <ProgressTracker progressPct={progressPct} />
      <BookTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Panels */}
      {activeTab === 'resumo' && content?.summary_html && (
        <PanelResumo summaryHtml={content.summary_html} />
      )}

      {activeTab === 'audio' && (
        <PanelAudio
          book={book}
          audioPosition={progress?.audio_position_sec || 0}
          onPositionChange={handleAudioPosition}
        />
      )}

      {activeTab === 'mindmap' && (
        <PanelMindMap data={content?.mindmap_json || null} />
      )}

      {activeTab === 'insights' && (
        <PanelInsights
          insights={content?.insights_json || null}
          bookId={book.id}
          bookTitle={book.title}
          savedInsightTexts={savedInsightTexts}
          onToggleSave={handleToggleInsight}
        />
      )}

      {activeTab === 'pratica' && (
        <PanelPratica
          exercises={content?.exercises_json || null}
          checklistState={checklistState}
          onChecklistChange={handleChecklistChange}
        />
      )}

      {/* Complete button */}
      <div className="mt-8">
        <CompleteButton isCompleted={isCompleted} onComplete={handleComplete} />
      </div>

      {/* Related books */}
      <RelatedBooks books={relatedBooks} />

      {/* Rating modal */}
      <RatingModal
        isOpen={showRating}
        bookTitle={book.title}
        xpEarned={progress?.xp_earned || 10}
        onRate={handleRate}
        onClose={() => setShowRating(false)}
      />

      {/* Bottom spacing */}
      <div className="h-8" />
    </>
  )
}
