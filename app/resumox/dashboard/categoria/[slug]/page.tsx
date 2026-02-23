'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import BookCard from '@/components/resumox/BookCard'
import LoadMoreButton from '@/components/resumox/LoadMoreButton'
import { usePaginatedBooks } from '@/hooks/usePaginatedBooks'

export default function CategoriaPage() {
  const { slug } = useParams<{ slug: string }>()
  const [categoryLabel, setCategoryLabel] = useState('')

  const { books, loading, loadingMore, hasMore, total, loadMore } = usePaginatedBooks({
    category: slug,
  })

  // Fetch category label
  useEffect(() => {
    if (!slug) return
    const fetchLabel = async () => {
      try {
        const res = await fetch('/api/resumox/categories')
        if (res.ok) {
          const data = await res.json()
          const cat = (data.categories || []).find((c: any) => c.slug === slug)
          if (cat) setCategoryLabel(`${cat.emoji} ${cat.label}`)
        }
      } catch {
        // ignore
      }
    }
    fetchLabel()
  }, [slug])

  return (
    <>
      <ResumoxNav showBack />

      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-extrabold text-resumox-text mb-1">
          {categoryLabel || slug}
        </h1>
        <div className="mb-6" />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-resumox-accent border-t-transparent" />
          </div>
        ) : books.length === 0 ? (
          <p className="text-center text-resumox-muted text-sm py-12">Nenhum livro nesta categoria.</p>
        ) : (
          <div className="space-y-2">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
            <LoadMoreButton
              loading={loadingMore}
              onLoadMore={loadMore}
            />
          </div>
        )}
      </main>
    </>
  )
}
