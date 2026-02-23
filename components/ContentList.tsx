'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { formatDuration } from '@/lib/utils'
import HTMLContentItem from './HTMLContentItem'

interface Content {
  id: string
  content_type: 'video' | 'audio' | 'pdf' | 'text' | 'image' | 'html_orientation'
  title: string
  description: string | null
  content_url: string | null
  thumbnail_url: string | null
  file_size: number | null
  duration: number | null
  order_index: number
  status?: 'principal' | 'bonus' | 'order_bump' // Status do conteúdo
  html_content?: string // HTML content for orientation items
  is_locked?: boolean // Indica se o conteúdo está bloqueado (order bump não comprado)
  checkout_url?: string | null // URL de checkout para desbloquear
}

interface ContentListProps {
  contents: Content[]
  selectedContent: Content | null
  onSelectContent: (content: Content) => void
  theme?: 'light' | 'dark' // Tema do produto
}

// Transform R2 URLs to API endpoints
const getMediaUrl = (url: string | null): string => {
  if (!url) return ''
  if (url.startsWith('r2://')) {
    const key = url.replace('r2://', '')
    return `/api/r2-content?key=${encodeURIComponent(key)}`
  }
  return url
}

const contentTypeIcons = {
  video: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
    </svg>
  ),
  audio: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
    </svg>
  ),
  pdf: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  ),
  text: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
    </svg>
  ),
  image: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  )
}

const contentTypeColors = {
  video: 'from-blue-500 to-blue-600',
  audio: 'from-purple-500 to-pink-500',
  pdf: 'from-red-500 to-pink-500',
  text: 'from-green-500 to-emerald-500',
  image: 'from-pink-500 to-rose-500'
}

const contentTypeLabels = {
  video: 'Video',
  audio: 'Áudio de Reprogramação',
  pdf: 'Material PDF',
  text: 'Texto',
  image: 'Imagem'
}

export default function ContentList({
  contents,
  selectedContent,
  onSelectContent,
  theme = 'dark' // Default to dark theme for backwards compatibility
}: ContentListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Theme-based class definitions
  const isLight = theme === 'light'
  const themeClasses = {
    // Container
    container: isLight
      ? 'bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-3 sm:p-6 border border-gray-200'
      : 'glass-dark rounded-2xl sm:rounded-3xl shadow-neuro-card p-3 sm:p-6 border border-neuro-500/20',

    // Title and text
    title: isLight ? 'text-indigo-900' : 'text-white',
    subtitle: isLight ? 'text-gray-700' : 'text-neuro-200',
    label: isLight ? 'text-gray-600' : 'text-neuro-300',

    // Badge
    badge: isLight
      ? 'px-2 sm:px-3 py-0.5 sm:py-1 bg-lime-100 text-lime-700 rounded-full text-xs sm:text-sm font-semibold border border-lime-300'
      : 'px-2 sm:px-3 py-0.5 sm:py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs sm:text-sm font-semibold border border-cyan-500/30',

    // Icon
    icon: isLight ? 'text-lime-600' : 'text-cyan-300',

    // Search input
    searchInput: isLight
      ? 'w-full px-4 py-2.5 pl-10 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-400/20 transition-all'
      : 'w-full px-4 py-2.5 pl-10 bg-neuro-800/50 border border-neuro-500/30 rounded-xl text-white placeholder-neuro-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all',
    searchIcon: isLight ? 'text-gray-500' : 'text-neuro-400',
    clearButton: isLight ? 'text-gray-500 hover:text-gray-900' : 'text-neuro-400 hover:text-white',

    // Filter button
    filterButton: isLight
      ? 'bg-white text-gray-700 border border-gray-300 hover:border-lime-500/50'
      : 'bg-neuro-800/50 text-neuro-300 border border-neuro-500/30 hover:border-cyan-400/30',
    filterButtonActive: isLight
      ? 'bg-lime-100 text-lime-700 border-2 border-lime-500'
      : 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400/50',
    filterBadge: isLight
      ? 'bg-lime-600 text-white'
      : 'bg-cyan-400 text-neuro-900',

    // Filter panel
    filterPanel: isLight
      ? 'bg-gray-100 border border-gray-200'
      : 'bg-neuro-800/30 border border-neuro-500/20',
    filterChip: isLight
      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
      : 'bg-neuro-700/50 text-neuro-300 hover:bg-neuro-600 hover:text-white',
    filterChipActive: isLight
      ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30'
      : 'bg-cyan-500 text-white shadow-cyan-glow',
    clearFilters: isLight
      ? 'bg-red-100 text-red-700 hover:bg-red-200'
      : 'bg-red-500/20 text-red-300 hover:bg-red-500/30',

    // Results info
    resultsText: isLight ? 'text-gray-600' : 'text-neuro-300',
    noResults: isLight ? 'text-red-600' : 'text-red-300',

    // Empty state
    emptyIcon: isLight ? 'bg-gray-200' : 'bg-neuro-700/50',
    emptyIconColor: isLight ? 'text-gray-500' : 'text-neuro-400',
    emptyTitle: isLight ? 'text-gray-900' : 'text-white',
    emptyText: isLight ? 'text-gray-600' : 'text-neuro-300',

    // Content items
    itemBg: isLight ? 'bg-white border border-gray-200' : 'glass border border-neuro-500/30',
    itemBgSelected: isLight
      ? 'bg-lime-50 border-2 border-lime-500 shadow-lg shadow-lime-500/30 ring-2 ring-lime-400/20'
      : 'glass-dark border-2 border-cyan-400 shadow-cyan-glow',
    itemBgBonus: isLight
      ? 'bg-white border-2 border-amber-400 shadow-lg shadow-amber-500/20'
      : 'glass border-2 border-amber-500/40 hover:border-amber-400/70 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    itemBgBonusSelected: isLight
      ? 'bg-white border-2 border-amber-500 shadow-lg shadow-amber-500/30'
      : 'glass-dark border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.4)]',
    itemHover: isLight ? 'hover:border-lime-500/70 hover:shadow-lg' : 'hover:border-cyan-400/50 hover:shadow-lg',

    // Number badge
    numberBadge: isLight ? 'bg-gray-200 text-gray-700' : 'bg-neuro-700/50 text-neuro-200',
    numberBadgeSelected: isLight
      ? 'bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg shadow-lime-500/30'
      : 'bg-gradient-to-br from-cyan-500 to-cyan-400 text-white shadow-cyan-glow',
    numberBadgeHover: isLight ? 'group-hover:bg-gray-300' : 'group-hover:bg-neuro-600',

    // Content title
    itemTitle: isLight ? 'text-gray-900' : 'text-white',
    itemTitleSelected: isLight ? 'text-lime-700' : 'text-cyan-300',
    itemTitleHover: isLight ? 'group-hover:text-lime-700' : 'group-hover:text-cyan-300',

    // Type label
    typeLabel: isLight ? 'bg-gray-100 text-gray-700' : 'bg-neuro-700/50 text-neuro-300',

    // Action button
    actionButton: isLight ? 'bg-gray-200' : 'bg-neuro-700/50',
    actionButtonSelected: isLight
      ? 'bg-gradient-to-br from-lime-500 to-lime-600 shadow-lg shadow-lime-500/30'
      : 'bg-gradient-to-br from-cyan-500 to-cyan-400 shadow-cyan-glow',
    actionButtonHover: isLight
      ? 'group-hover:bg-gradient-to-br group-hover:from-lime-500 group-hover:to-lime-600'
      : 'group-hover:bg-neuro-600',
    actionIcon: isLight ? 'text-gray-700' : 'text-neuro-200',
    actionIconHover: isLight ? 'group-hover:text-white' : 'group-hover:text-white'
  }

  // Available content type filters
  const contentTypeFilters = [
    { value: 'audio', label: 'Audio' },
    { value: 'video', label: 'Video' },
    { value: 'pdf', label: 'PDF' },
    { value: 'text', label: 'Texto' },
    { value: 'image', label: 'Imagem' }
  ]

  // Toggle filter selection
  const toggleFilter = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // Handle content click - redirect to PDF viewer for PDFs, checkout for locked content, otherwise select normally
  const handleContentClick = (content: Content) => {
    console.log('[ContentList] Click handler:', {
      title: content.title,
      is_locked: content.is_locked,
      checkout_url: content.checkout_url,
      content_type: content.content_type
    })

    // Se o conteúdo está bloqueado, redirecionar para checkout em nova aba
    if (content.is_locked && content.checkout_url) {
      console.log('[ContentList] Opening checkout URL:', content.checkout_url)
      window.open(content.checkout_url, '_blank', 'noopener,noreferrer')
      return
    }

    // Se é PDF, redirecionar para visualizador
    if (content.content_type === 'pdf' && content.content_url) {
      console.log('[ContentList] Opening PDF viewer')
      router.push(`/pdf-viewer?url=${encodeURIComponent(content.content_url)}&title=${encodeURIComponent(content.title)}`)
    } else {
      // Seleção normal para outros tipos de conteúdo
      console.log('[ContentList] Selecting content normally')
      onSelectContent(content)
    }
  }

  // Filtered contents based on search and type filters
  const filteredContents = useMemo(() => {
    let filtered = contents

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(lowerSearch) ||
        content.description?.toLowerCase().includes(lowerSearch)
      )
    }

    // Apply type filters
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(content =>
        selectedTypes.includes(content.content_type)
      )
    }

    return filtered
  }, [contents, searchTerm, selectedTypes])

  if (contents.length === 0) {
    return (
      <div className={`${themeClasses.container} p-12 text-center animate-fade-in`}>
        <div className={`w-20 h-20 ${isLight ? 'bg-gradient-to-br from-lime-400 to-lime-500' : 'bg-gradient-to-br from-neuro-500 to-neuro-300'} rounded-full mx-auto mb-6 flex items-center justify-center ${isLight ? 'shadow-lg shadow-lime-500/30' : 'shadow-neuro-glow'}`}>
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className={`text-2xl font-bold ${themeClasses.emptyTitle} mb-3`}>
          Conteúdo a caminho
        </h3>
        <p className={themeClasses.emptyText}>
          Seus arquivos de reprogramação serão adicionados em breve.
        </p>
      </div>
    )
  }

  return (
    <div className={`${themeClasses.container} animate-slide-up`}>
      <div className="flex items-center justify-between mb-3 sm:mb-6 gap-2">
        <h2 className={`text-lg sm:text-2xl font-bold ${themeClasses.title} flex items-center gap-1.5 sm:gap-2`}>
          <svg className={`w-4 h-4 sm:w-6 sm:h-6 ${themeClasses.icon} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <span className="truncate">Sua Biblioteca</span>
        </h2>
        <span className={`${themeClasses.badge} whitespace-nowrap flex-shrink-0`}>
          {filteredContents.length} {filteredContents.length === 1 ? 'item' : 'Itens'}
        </span>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 space-y-3">
        {/* Search Bar and Filter Button */}
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={themeClasses.searchInput}
            />
            <svg
              className={`w-5 h-5 ${themeClasses.searchIcon} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${themeClasses.clearButton} transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              showFilters || selectedTypes.length > 0
                ? themeClasses.filterButtonActive
                : themeClasses.filterButton
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden sm:inline">Filtrar</span>
            {selectedTypes.length > 0 && (
              <span className={`${themeClasses.filterBadge} rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold`}>
                {selectedTypes.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className={`flex flex-wrap gap-2 p-3 ${themeClasses.filterPanel} rounded-xl animate-fade-in`}>
            {contentTypeFilters.map(filter => (
              <button
                key={filter.value}
                onClick={() => toggleFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedTypes.includes(filter.value)
                    ? themeClasses.filterChipActive
                    : themeClasses.filterChip
                }`}
              >
                {filter.label}
              </button>
            ))}
            {selectedTypes.length > 0 && (
              <button
                onClick={() => setSelectedTypes([])}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${themeClasses.clearFilters} transition-all ml-auto`}
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Results info */}
        {(searchTerm || selectedTypes.length > 0) && (
          <div className={`text-sm ${themeClasses.resultsText} px-2`}>
            {filteredContents.length === 0 ? (
              <span className={themeClasses.noResults}>Nenhum resultado encontrado</span>
            ) : (
              <span>
                Mostrando {filteredContents.length} de {contents.length} {contents.length === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-2 sm:gap-3">
        {filteredContents.length === 0 && (searchTerm || selectedTypes.length > 0) ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 ${themeClasses.emptyIcon} rounded-full mx-auto mb-4 flex items-center justify-center`}>
              <svg className={`w-8 h-8 ${themeClasses.emptyIconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className={`text-lg font-semibold ${themeClasses.emptyTitle} mb-2`}>Nenhum resultado encontrado</h3>
            <p className={`${themeClasses.emptyText} text-sm`}>Tente com outros termos de busca ou filtros</p>
          </div>
        ) : (
          filteredContents.map((content, index) => {
            // Render HTML orientation items differently
            if (content.content_type === 'html_orientation') {
              return (
                <HTMLContentItem
                  key={content.id}
                  htmlContent={content.html_content || ''}
                  title={content.title}
                  showNumber={true}
                  itemNumber={index + 1}
                  theme={theme}
                  icon={
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  }
                />
              )
            }

            const isSelected = selectedContent?.id === content.id
            const isBonus = content.status === 'bonus'
            const isOrderBump = content.status === 'order_bump'
            const isLocked = content.is_locked === true
            const gradientClass = contentTypeColors[content.content_type]

            return (
              <button
                key={content.id}
                onClick={() => handleContentClick(content)}
                className={`group relative w-full text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                  isOrderBump && isLocked
                    ? `${isLight ? 'bg-white' : 'glass'} border-2 border-red-500/40 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-60 hover:opacity-80 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]`
                    : isBonus
                      ? isSelected
                        ? `${themeClasses.itemBgBonusSelected} bg-gradient-to-br from-amber-500/10 to-orange-500/10`
                        : `${themeClasses.itemBgBonus} bg-gradient-to-br from-amber-500/5 to-orange-500/5`
                      : isSelected
                        ? themeClasses.itemBgSelected
                        : `${themeClasses.itemBg} ${themeClasses.itemHover}`
                }`}
              >
                {/* Lock Icon for Locked Content */}
                {isLocked ? (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg z-10">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  /* Bonus Star Icon */
                  isBonus && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse-glow">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )
                )}
                <div className="flex items-start sm:items-center gap-2 sm:gap-4">
                  {/* Number Badge */}
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isBonus
                      ? isSelected
                        ? `bg-gradient-to-br from-amber-500 to-orange-500 text-white ${isLight ? 'shadow-lg shadow-amber-500/40' : 'shadow-[0_0_15px_rgba(251,191,36,0.5)]'}`
                        : 'bg-gradient-to-br from-amber-600/70 to-orange-600/70 text-white group-hover:from-amber-500 group-hover:to-orange-500'
                      : isSelected
                        ? themeClasses.numberBadgeSelected
                        : `${themeClasses.numberBadge} ${themeClasses.numberBadgeHover}`
                  }`}>
                    {index + 1}
                  </div>

                  {/* Thumbnail or Icon */}
                  <div className={`flex-shrink-0 w-11 h-11 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br ${gradientClass} shadow-lg ${
                    isSelected
                      ? isBonus
                        ? `ring-2 ring-amber-400 ring-offset-1 sm:ring-offset-2 ${isLight ? 'ring-offset-white' : 'ring-offset-neuro-900'}`
                        : `ring-2 ${isLight ? 'ring-lime-500' : 'ring-cyan-400'} ring-offset-1 sm:ring-offset-2 ${isLight ? 'ring-offset-white' : 'ring-offset-neuro-900'}`
                      : ''
                  }`}>
                    {content.thumbnail_url ? (
                      <img
                        src={getMediaUrl(content.thumbnail_url)}
                        alt={content.title}
                        className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                      />
                    ) : (
                      <div className="text-white scale-75 sm:scale-100">
                        {contentTypeIcons[content.content_type]}
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-start gap-2 mb-0.5 sm:mb-1">
                      <h3 className={`font-bold transition-colors text-xs sm:text-base leading-tight line-clamp-2 flex-1 ${
                        isSelected ? themeClasses.itemTitleSelected : `${themeClasses.itemTitle} ${themeClasses.itemTitleHover}`
                      }`}>
                        {content.title}
                      </h3>
                      {content.status === 'bonus' && (
                        <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-md shadow-lg animate-pulse-glow">
                          BÔNUS
                        </span>
                      )}
                    </div>

                    {content.description && (
                      <p className={`text-xs sm:text-sm ${themeClasses.subtitle} mb-1 sm:mb-2 leading-tight line-clamp-1`}>
                        {content.description}
                      </p>
                    )}

                    <div className={`flex items-center gap-1.5 sm:gap-3 text-xs ${themeClasses.label} flex-wrap`}>
                      <span className={`px-1.5 sm:px-2 py-0.5 ${themeClasses.typeLabel} rounded text-xs whitespace-nowrap`}>
                        {contentTypeLabels[content.content_type]}
                      </span>
                      {isOrderBump && isLocked && (
                        <>
                          <span>•</span>
                          <span className="px-1.5 sm:px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-semibold whitespace-nowrap border border-red-500/30">
                            🔒 BLOQUEADO
                          </span>
                        </>
                      )}
                      {content.duration && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">{formatDuration(content.duration)}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Icon - Play for video/audio, Lock for locked content */}
                  {(content.content_type === 'video' || content.content_type === 'audio' || content.content_type === 'pdf' || isLocked) && (
                    <div className={`flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                      isLocked
                        ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                        : isBonus
                          ? isSelected
                            ? `bg-gradient-to-br from-amber-500 to-orange-500 ${isLight ? 'shadow-lg shadow-amber-500/40' : 'shadow-[0_0_15px_rgba(251,191,36,0.5)]'} scale-105 sm:scale-110`
                            : `${themeClasses.actionButton} group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-500 group-hover:scale-110`
                          : isSelected
                            ? `${themeClasses.actionButtonSelected} scale-105 sm:scale-110`
                            : `${themeClasses.actionButton} ${themeClasses.actionButtonHover} group-hover:scale-110`
                    }`}>
                      {isLocked ? (
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (content.content_type === 'video' || content.content_type === 'audio') ? (
                        <svg
                          className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isSelected ? 'text-white' : `${themeClasses.actionIcon} ${themeClasses.actionIconHover}`}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      ) : content.content_type === 'pdf' ? (
                        <svg
                          className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isSelected ? 'text-white' : `${themeClasses.actionIcon} ${themeClasses.actionIconHover}`}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Progress Bar (for future implementation) */}
                {isSelected && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${isLight ? 'bg-gray-200' : 'bg-neuro-800'} rounded-b-2xl overflow-hidden`}>
                    <div className={`h-full w-0 bg-gradient-to-r ${isLight ? 'from-lime-500 to-lime-600' : 'from-cyan-500 to-cyan-400'} transition-all duration-300`}></div>
                  </div>
                )}
              </button>
            )
        })
        )}
      </div>
    </div>
  )
}
