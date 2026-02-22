'use client'

import Link from 'next/link'
import BookCover from './BookCover'
import type { BookWithProgress } from '@/lib/resumox-types'

interface BookCardProps {
  book: BookWithProgress
  compact?: boolean
}

export default function BookCard({ book, compact = false }: BookCardProps) {
  const progress = book.progress?.progress_pct || 0

  if (compact) {
    return (
      <Link href={`/resumox/dashboard/livro/${book.slug}`} className="block flex-shrink-0 w-36">
        <BookCover
          title={book.title}
          author={book.author}
          gradientFrom={book.cover_gradient_from}
          gradientTo={book.cover_gradient_to}
          size="sm"
          className="w-full h-24 mb-2"
        />
        <p className="text-xs font-semibold text-resumox-text truncate">{book.title}</p>
        <p className="text-[10px] text-resumox-muted truncate">{book.author}</p>
        {progress > 0 && (
          <div className="mt-1.5 h-1 bg-resumox-surface3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress >= 100
                  ? '#00D68F'
                  : 'linear-gradient(90deg, #6C5CE7, #A29BFE)',
              }}
            />
          </div>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={`/resumox/dashboard/livro/${book.slug}`}
      className="flex gap-3 p-3 rounded-2xl border border-resumox-border bg-resumox-surface hover:border-resumox-accent/40 transition-all"
    >
      <BookCover
        title={book.title}
        author={book.author}
        gradientFrom={book.cover_gradient_from}
        gradientTo={book.cover_gradient_to}
        size="sm"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-bold text-resumox-text truncate">{book.title}</p>
        <p className="text-xs text-resumox-muted truncate">{book.author}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-resumox-muted flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {book.reading_time_min} min
          </span>
          {book.rating_avg > 0 && (
            <span className="text-[10px] text-resumox-gold flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {book.rating_avg.toFixed(1)}
            </span>
          )}
        </div>
        {progress > 0 && (
          <div className="mt-2 h-1 bg-resumox-surface3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress >= 100
                  ? '#00D68F'
                  : 'linear-gradient(90deg, #6C5CE7, #A29BFE)',
              }}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
