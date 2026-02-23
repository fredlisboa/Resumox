'use client'

import { useCallback, useRef } from 'react'
import type { TabName, ChecklistState } from '@/lib/resumox-types'

interface ProgressUpdate {
  book_id: string
  tab?: TabName
  audio_position_sec?: number
  checklist_state?: ChecklistState
  mark_complete?: boolean
}

export function useResumoxProgress() {
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})

  const updateProgress = useCallback(async (update: ProgressUpdate) => {
    try {
      const res = await fetch('/api/resumox/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      })
      if (!res.ok) {
        console.error('Progress update failed:', res.status)
        return null
      }
      const data = await res.json()
      return data.progress
    } catch (err) {
      console.error('Progress update error:', err)
      return null
    }
  }, [])

  const debouncedUpdate = useCallback((key: string, update: ProgressUpdate, delayMs = 2000, onResult?: (progress: any) => void) => {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key])
    }
    debounceTimers.current[key] = setTimeout(async () => {
      const result = await updateProgress(update)
      delete debounceTimers.current[key]
      if (onResult && result) onResult(result)
    }, delayMs)
  }, [updateProgress])

  const updateTab = useCallback((bookId: string, tab: TabName) => {
    return updateProgress({ book_id: bookId, tab })
  }, [updateProgress])

  const updateAudioPosition = useCallback((bookId: string, position: number) => {
    debouncedUpdate(`audio-${bookId}`, { book_id: bookId, audio_position_sec: position }, 10000)
  }, [debouncedUpdate])

  const updateChecklist = useCallback((bookId: string, state: ChecklistState, onResult?: (progress: any) => void) => {
    debouncedUpdate(`checklist-${bookId}`, { book_id: bookId, checklist_state: state }, 2000, onResult)
  }, [debouncedUpdate])

  const markComplete = useCallback((bookId: string) => {
    return updateProgress({ book_id: bookId, mark_complete: true })
  }, [updateProgress])

  return {
    updateProgress,
    updateTab,
    updateAudioPosition,
    updateChecklist,
    markComplete,
  }
}
