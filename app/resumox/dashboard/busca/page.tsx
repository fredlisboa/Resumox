'use client'

import { useState } from 'react'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import SearchBar from '@/components/resumox/SearchBar'
import BookCard from '@/components/resumox/BookCard'
import LoadMoreButton from '@/components/resumox/LoadMoreButton'
import { usePaginatedBooks } from '@/hooks/usePaginatedBooks'

export default function BuscaPage() {
  const [search, setSearch] = useState('')

  const { books, loading, loadingMore, hasMore, total, loadMore } = usePaginatedBooks({
    search: search || undefined,
  })

  const hasSearched = search.trim().length > 0

  return (
    <>
      <ResumoxNav showBack />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <h1 className="text-xl font-extrabold text-resumox-text mb-4">Buscar Livros</h1>

        <SearchBar value={search} onChange={setSearch} placeholder="Título, autor..." />

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-resumox-accent border-t-transparent" />
            </div>
          ) : hasSearched && books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-resumox-muted">Nenhum resultado para &ldquo;{search}&rdquo;</p>
            </div>
          ) : books.length > 0 ? (
            <div className="space-y-2">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
              <LoadMoreButton
                loading={loadingMore}
                onLoadMore={loadMore}
              />
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-12">
              <p className="text-sm text-resumox-muted">Digite para buscar livros</p>
            </div>
          ) : null}
        </div>
      </main>
    </>
  )
}
