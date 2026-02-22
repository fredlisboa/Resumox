'use client'

import type { ResumoxCategory } from '@/lib/resumox-types'

interface CategoryFilterProps {
  categories: ResumoxCategory[]
  selected: string | null
  onSelect: (slug: string | null) => void
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
          selected === null
            ? 'bg-resumox-accent text-white'
            : 'bg-resumox-surface border border-resumox-border text-resumox-muted hover:border-resumox-accent/40'
        }`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            selected === cat.slug
              ? 'bg-resumox-accent text-white'
              : 'bg-resumox-surface border border-resumox-border text-resumox-muted hover:border-resumox-accent/40'
          }`}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  )
}
