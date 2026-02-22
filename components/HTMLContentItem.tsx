import React from 'react'

interface HTMLContentItemProps {
  /** HTML content to render */
  htmlContent: string
  /** Optional custom icon (default: info icon) */
  icon?: React.ReactNode
  /** Optional custom title */
  title?: string
  /** Whether to show the item number badge */
  showNumber?: boolean
  /** Item number to display */
  itemNumber?: number
  /** Custom CSS classes */
  className?: string
  /** Theme for styling */
  theme?: 'light' | 'dark'
}

// Transform R2 URLs to API endpoints in HTML content
const transformR2UrlsInHtml = (html: string): string => {
  if (!html) return ''

  // Replace r2:// URLs in src attributes
  return html.replace(/src=["']r2:\/\/([^"']+)["']/g, (_match, key) => {
    const encodedKey = encodeURIComponent(key)
    return `src="/api/r2-content?key=${encodedKey}"`
  })
}

/**
 * HTMLContentItem - A component to display HTML guidance/orientations between course items
 * Matches the visual style of course items with glass effect, borders, and colors
 */
export default function HTMLContentItem({
  htmlContent,
  icon,
  title = 'Orientação',
  showNumber = false,
  itemNumber,
  className = '',
  theme = 'dark', // Default to dark theme for backwards compatibility
}: HTMLContentItemProps) {
  const isLight = theme === 'light'

  return (
    <div
      className={`
        ${isLight ? 'bg-white border border-gray-200' : 'glass border border-neuro-500/30'}
        rounded-lg sm:rounded-xl p-3 sm:p-4
        transition-all duration-300
        ${className}
      `}
    >
      {/* Number Badge and Icon Row */}
      <div className="flex flex-row items-start gap-4 sm:gap-5 mb-3">
        {/* Number Badge (optional) */}
        {showNumber && itemNumber !== undefined && (
          <div className="flex-shrink-0">
            <div
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500
                         flex items-center justify-center font-bold text-white text-xs sm:text-base shadow-lg"
            >
              {itemNumber}
            </div>
          </div>
        )}

        {/* Icon (optional) */}
        {icon && (
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500
                         flex items-center justify-center shadow-lg"
            >
              {icon}
            </div>
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className={`flex-1 text-sm sm:text-base font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>
            {title}
          </h3>
        )}
      </div>

      {/* Content - Full Width */}
      <div className="w-full">
        {/* HTML Content */}
        <div
          className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'html-content-light text-gray-700' : 'html-content text-slate-100'}`}
          dangerouslySetInnerHTML={{ __html: transformR2UrlsInHtml(htmlContent) }}
        />
      </div>
    </div>
  )
}
