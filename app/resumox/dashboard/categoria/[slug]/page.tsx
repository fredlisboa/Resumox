'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ResumoxNav from '@/components/resumox/ResumoxNav'
import BookCard from '@/components/resumox/BookCard'
import type { BookWithProgress } from '@/lib/resumox-types'

export default function CategoriaPage() {
  const { slug } = useParams<{ slug: string }>()
  const [books, setBooks] = useState<BookWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryLabel, setCategoryLabel] = useState('')

  useEffect(() => {
    if (!slug) return
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/resumox/books?category=${slug}&limit=50`)
        if (res.ok) {
          const data = await res.json()
          setBooks(data.books || [])
          if (data.books?.length > 0) {
            setCategoryLabel(`${data.books[0].category_emoji} ${data.books[0].category_label}`)
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [slug])

  return (
    <>
      <ResumoxNav showBack />

      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-extrabold text-resumox-text mb-1">
          {categoryLabel || slug}
        </h1>
        <p className="text-sm text-resumox-muted mb-6">
          {books.length} {books.length === 1 ? 'livro' : 'livros'}
        </p>

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
          </div>
        )}
      </main>
    </>
  )
}
