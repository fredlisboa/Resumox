'use client'

interface LoadMoreButtonProps {
  loading: boolean
  onLoadMore: () => void
}

export default function LoadMoreButton({ loading, onLoadMore }: LoadMoreButtonProps) {
  return (
    <div className="flex flex-col items-center pt-4 pb-2">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
          bg-resumox-surface2 border border-resumox-border text-resumox-text
          hover:bg-resumox-surface3 hover:border-resumox-accent/40
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-resumox-accent border-t-transparent" />
            Carregando...
          </span>
        ) : (
          'Carregar mais livros'
        )}
      </button>
    </div>
  )
}
