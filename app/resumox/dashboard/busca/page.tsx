'use client'

import { useState, useCallback } from 'react'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import SearchBar from '@/components/resumox/SearchBar'
import BookCard from '@/components/resumox/BookCard'
import type { BookWithProgress } from '@/lib/resumox-types'

export default function BuscaPage() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<BookWithProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async (query: string) => {
    setSearch(query)
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }
    setLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch(`/api/resumox/books?search=${encodeURIComponent(query)}&limit=50`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.books || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <>
      <ResumoxNav showBack />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <h1 className="text-xl font-extrabold text-resumox-text mb-4">Buscar Livros</h1>

        <SearchBar value={search} onChange={handleSearch} placeholder="Título, autor..." />

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-resumox-accent border-t-transparent" />
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-resumox-muted">Nenhum resultado para &ldquo;{search}&rdquo;</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-resumox-muted mb-2">{results.length} resultado{results.length !== 1 ? 's' : ''}</p>
              {results.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-12">
              <p className="text-sm text-resumox-muted">Digite para buscar entre 659 livros</p>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
