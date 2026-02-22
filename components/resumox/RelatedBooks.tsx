'use client'

import BookCard from './BookCard'
import type { ResumoxBook } from '@/lib/resumox-types'

interface RelatedBooksProps {
  books: ResumoxBook[]
}

export default function RelatedBooks({ books }: RelatedBooksProps) {
  if (books.length === 0) return null

  return (
    <section className="px-5 mb-6">
      <h2 className="text-sm font-bold text-resumox-accent-light uppercase tracking-wide mb-3">
        Livros Relacionados
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {books.map((book) => (
          <BookCard key={book.id} book={{ ...book, progress: null }} compact />
        ))}
      </div>
    </section>
  )
}
