'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { BookWithProgress } from '@/lib/resumox-types'

const DEFAULT_LIMIT = 12

interface UsePaginatedBooksParams {
  category?: string | null
  search?: string
  limit?: number
}

interface UsePaginatedBooksResult {
  books: BookWithProgress[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  total: number
  loadMore: () => void
}

export function usePaginatedBooks({
  category,
  search,
  limit = DEFAULT_LIMIT,
}: UsePaginatedBooksParams = {}): UsePaginatedBooksResult {
  const [books, setBooks] = useState<BookWithProgress[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    // Abort previous in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (search) params.set('search', search)
      params.set('page', String(pageNum))
      params.set('limit', String(limit))

      const res = await fetch(`/api/resumox/books?${params}`, {
        signal: controller.signal,
      })

      if (!res.ok) return

      const data = await res.json()
      const newBooks: BookWithProgress[] = data.books || []

      if (append) {
        setBooks((prev) => [...prev, ...newBooks])
      } else {
        setBooks(newBooks)
      }

      setHasMore(data.has_more ?? false)
      setTotal(data.total ?? 0)
      setPage(pageNum)
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [category, search, limit])

  // Reset and fetch page 1 when filters change
  useEffect(() => {
    setBooks([])
    setPage(1)
    setHasMore(false)
    fetchPage(1, false)
  }, [fetchPage])

  const loadMore = useCallback(() => {
    if (loadingMore) return
    if (hasMore) {
      fetchPage(page + 1, true)
    } else {
      // Loop back to the beginning and scroll to top
      setBooks([])
      setPage(1)
      setHasMore(false)
      fetchPage(1, false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [fetchPage, page, loadingMore, hasMore])

  return { books, loading, loadingMore, hasMore, total, loadMore }
}
