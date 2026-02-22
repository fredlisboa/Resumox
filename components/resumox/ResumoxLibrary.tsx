'use client'

import { useState, useEffect, useCallback } from 'react'
import BookCard from './BookCard'
import CategoryFilter from './CategoryFilter'
import SearchBar from './SearchBar'
import type { BookWithProgress, ResumoxCategory } from '@/lib/resumox-types'

export default function ResumoxLibrary() {
  const [books, setBooks] = useState<BookWithProgress[]>([])
  const [categories, setCategories] = useState<ResumoxCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)
      if (search) params.set('search', search)
      params.set('limit', '50')

      const res = await fetch(`/api/resumox/books?${params}`)
      if (res.ok) {
        const data = await res.json()
        setBooks(data.books || [])
      }
    } catch (err) {
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, search])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    // Fetch categories once
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/resumox/books?limit=0')
        if (res.ok) {
          // Categories are derived from books — use a dedicated approach
        }
      } catch {
        // ignore
      }
    }
    fetchCategories()
  }, [])

  // Derive categories from book data for now (no separate API)
  useEffect(() => {
    if (books.length === 0) return
    const catMap = new Map<string, ResumoxCategory>()
    for (const b of books) {
      if (!catMap.has(b.category_slug)) {
        catMap.set(b.category_slug, {
          slug: b.category_slug,
          label: b.category_label,
          emoji: b.category_emoji,
          sort_order: 0,
          book_count: 0,
          created_at: '',
        })
      }
      const cat = catMap.get(b.category_slug)!
      cat.book_count++
    }
    setCategories(Array.from(catMap.values()))
  }, [books])

  const inProgress = books.filter((b) => b.progress && b.progress.status === 'in_progress')
  const featured = books.filter((b) => b.is_featured)
  const displayBooks = selectedCategory
    ? books.filter((b) => b.category_slug === selectedCategory)
    : books

  return (
    <div className="space-y-6">
      <SearchBar value={search} onChange={setSearch} />

      {!search && !selectedCategory && inProgress.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-resumox-accent-light mb-3 uppercase tracking-wide">
            Continue lendo
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {inProgress.map((book) => (
              <BookCard key={book.id} book={book} compact />
            ))}
          </div>
        </section>
      )}

      {!search && !selectedCategory && featured.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-resumox-gold mb-3 uppercase tracking-wide">
            Destaques
          </h2>
          <div className="space-y-2">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 p-3 rounded-2xl border border-resumox-border bg-resumox-surface animate-pulse">
              <div className="w-16 h-20 rounded-lg bg-resumox-surface3 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-resumox-surface3 rounded w-3/4" />
                <div className="h-3 bg-resumox-surface3 rounded w-1/2" />
                <div className="h-2 bg-resumox-surface3 rounded w-1/4 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : displayBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-resumox-muted text-sm">
            {search ? 'Nenhum livro encontrado.' : 'Nenhum livro disponível.'}
          </p>
        </div>
      ) : (
        <section>
          {(search || selectedCategory) && (
            <h2 className="text-sm font-bold text-resumox-text mb-3">
              {displayBooks.length} {displayBooks.length === 1 ? 'livro' : 'livros'}
              {selectedCategory && categories.find((c) => c.slug === selectedCategory)
                ? ` em ${categories.find((c) => c.slug === selectedCategory)!.emoji} ${categories.find((c) => c.slug === selectedCategory)!.label}`
                : ''}
            </h2>
          )}
          <div className="space-y-2">
            {displayBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
