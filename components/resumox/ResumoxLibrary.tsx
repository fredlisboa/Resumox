'use client'

import { useState, useEffect } from 'react'
import BookCard from './BookCard'
import CategoryFilter from './CategoryFilter'
import SearchBar from './SearchBar'
import LoadMoreButton from './LoadMoreButton'
import { usePaginatedBooks } from '@/hooks/usePaginatedBooks'
import type { ResumoxCategory } from '@/lib/resumox-types'

export default function ResumoxLibrary() {
  const [categories, setCategories] = useState<ResumoxCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const { books, loading, loadingMore, hasMore, total, loadMore } = usePaginatedBooks({
    category: selectedCategory,
    search,
  })

  // Fetch categories from dedicated API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/resumox/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
        }
      } catch {
        // ignore
      }
    }
    fetchCategories()
  }, [])

  const inProgress = books.filter((b) => b.progress && b.progress.status === 'in_progress')
  const featured = books.filter((b) => b.is_featured)

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
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-resumox-muted text-sm">
            {search ? 'Nenhum livro encontrado.' : 'Nenhum livro disponível.'}
          </p>
        </div>
      ) : (
        <section>
          {(search || selectedCategory) && (
            <h2 className="text-sm font-bold text-resumox-text mb-3">
              {total} {total === 1 ? 'livro' : 'livros'}
              {selectedCategory && categories.find((c) => c.slug === selectedCategory)
                ? ` em ${categories.find((c) => c.slug === selectedCategory)!.emoji} ${categories.find((c) => c.slug === selectedCategory)!.label}`
                : ''}
            </h2>
          )}
          <div className="space-y-2">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <LoadMoreButton
            loading={loadingMore}
            hasMore={hasMore}
            total={total}
            loadedCount={books.length}
            onLoadMore={loadMore}
          />
        </section>
      )}
    </div>
  )
}
