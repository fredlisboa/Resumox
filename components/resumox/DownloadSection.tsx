'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

interface DownloadItem {
  label: string
  r2Key: string
  icon: string
}

interface DownloadSectionProps {
  items: DownloadItem[]
}

export default function DownloadSection({ items }: DownloadSectionProps) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (item: DownloadItem) => {
    setDownloading(item.r2Key)
    try {
      const res = await fetch(`/api/r2-content?key=${encodeURIComponent(item.r2Key)}`)
      if (res.ok) {
        const data = await res.json()
        window.open(data.url, '_blank')
      }
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(null)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="bg-resumox-surface border border-resumox-border rounded-2xl p-4">
      <p className="text-xs font-bold text-resumox-accent-light uppercase tracking-wide mb-3">
        Downloads
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.r2Key}
            onClick={() => handleDownload(item)}
            disabled={downloading === item.r2Key}
            className="w-full flex items-center gap-3 px-4 py-3 bg-resumox-surface2 border border-resumox-border rounded-xl hover:border-resumox-accent/40 transition-all text-left disabled:opacity-50"
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1 text-sm text-resumox-text font-medium">{item.label}</span>
            {downloading === item.r2Key ? (
              <div className="w-4 h-4 border-2 border-resumox-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-resumox-muted" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
