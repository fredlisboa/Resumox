'use client'

import BookCover from './BookCover'
import type { ResumoxBook } from '@/lib/resumox-types'

interface BookHeroProps {
  book: ResumoxBook
}

export default function BookHero({ book }: BookHeroProps) {
  return (
    <section
      className="relative px-5 pt-8 pb-10 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(108,92,231,0.08) 0%, transparent 100%)' }}
    >
      {/* Glow */}
      <div
        className="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(108,92,231,0.3), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="flex gap-5 items-start relative">
        <BookCover
          title={book.title}
          author={book.author}
          gradientFrom={book.cover_gradient_from}
          gradientTo={book.cover_gradient_to}
          size="md"
        />

        <div className="flex-1 min-w-0">
          {/* Category badge */}
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide mb-2.5"
            style={{ background: 'rgba(108,92,231,0.3)', color: '#A29BFE' }}
          >
            {book.category_emoji} {book.category_label}
          </span>

          <h1
            className="font-playfair font-extrabold text-2xl leading-tight mb-1"
            style={{
              background: 'linear-gradient(135deg, #fff, #ccc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {book.title}
          </h1>

          {book.original_title && (
            <p className="text-xs text-resumox-muted italic mb-2">{book.original_title}</p>
          )}

          <p className="text-[13px] text-resumox-muted mb-3">{book.author}</p>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 bg-resumox-surface2 border border-resumox-border px-2.5 py-1 rounded-lg text-[11px] text-resumox-muted">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {book.reading_time_min} min
            </span>
            {book.audio_duration_min && (
              <span className="inline-flex items-center gap-1 bg-resumox-surface2 border border-resumox-border px-2.5 py-1 rounded-lg text-[11px] text-resumox-muted">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                {book.audio_duration_min} min
              </span>
            )}
            {book.rating_avg > 0 && (
              <span className="inline-flex items-center gap-1 bg-resumox-surface2 border border-resumox-border px-2.5 py-1 rounded-lg text-[11px] text-resumox-gold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {book.rating_avg.toFixed(1)} ({book.rating_count})
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
