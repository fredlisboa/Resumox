'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use local file
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

interface FullScreenPDFViewerProps {
  url: string
  title: string
}

type ZoomMode = 'auto' | 'page-fit' | 'page-width' | number

export default function FullScreenPDFViewer({ url, title }: FullScreenPDFViewerProps) {
  const router = useRouter()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Detect device type and set appropriate default zoom
  const getDefaultZoom = (): ZoomMode => {
    if (typeof window === 'undefined') return 'page-fit'

    // Mobile detection: check if screen width is less than 768px (typical mobile breakpoint)
    const isMobile = window.innerWidth < 768

    // Mobile: use 'page-fit' for better fit on small screens
    // Desktop/Tablet: use 100% for better readability
    return isMobile ? 'page-fit' : 100
  }

  const [zoom, setZoom] = useState<ZoomMode>(getDefaultZoom())
  const [actualZoom, setActualZoom] = useState<number>(100)
  const [rotation, setRotation] = useState<number>(0)

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null)

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('[FullScreenPDFViewer] Received URL:', url)
        let apiUrl: string

        if (url.startsWith('r2://')) {
          const strippedUrl = url.replace('r2://', '')
          const encodedKey = encodeURIComponent(strippedUrl)
          apiUrl = `/api/r2-content?key=${encodedKey}`
          console.log('[FullScreenPDFViewer] Stripped URL:', strippedUrl)
          console.log('[FullScreenPDFViewer] Encoded key:', encodedKey)
          console.log('[FullScreenPDFViewer] API URL:', apiUrl)
        } else if (url.startsWith('https://pub-') && url.includes('.r2.dev/')) {
          apiUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`
        } else if (url.startsWith('http://') || url.startsWith('https://')) {
          apiUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`
        } else {
          apiUrl = url
        }

        const response = await fetch(apiUrl, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise

        pdfDocRef.current = pdf
        setNumPages(pdf.numPages)
        setPageNumber(1)
        canvasRefs.current = new Array(pdf.numPages).fill(null)
        setLoading(false)
      } catch (err) {
        console.error('Error loading PDF:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setLoading(false)
      }
    }

    loadPDF()

    return () => {
      pdfDocRef.current?.destroy()
    }
  }, [url])

  // Render all pages
  useEffect(() => {
    if (!pdfDocRef.current || loading || !containerRef.current) return

    const renderAllPages = async () => {
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const canvas = canvasRefs.current[pageNum - 1]
        if (!canvas) continue

        try {
          const page = await pdfDocRef.current!.getPage(pageNum)
          const context = canvas.getContext('2d')!

          // Calculate viewport
          let viewport = page.getViewport({ scale: 1, rotation })

          // Calculate scale based on zoom mode
          let scale = 1
          if (zoom === 'auto' || zoom === 'page-fit') {
            const containerWidth = containerRef.current!.clientWidth - 40
            scale = containerWidth / viewport.width
          } else if (zoom === 'page-width') {
            const containerWidth = containerRef.current!.clientWidth - 40
            scale = containerWidth / viewport.width
          } else if (typeof zoom === 'number') {
            // For numeric zoom, use it directly as percentage
            // Multiply by 1.5 to ensure better readability at 100%
            scale = (zoom / 100) * 1.5
          }

          viewport = page.getViewport({ scale, rotation })

          // Set canvas dimensions
          const outputScale = window.devicePixelRatio || 1
          canvas.width = Math.floor(viewport.width * outputScale)
          canvas.height = Math.floor(viewport.height * outputScale)
          canvas.style.width = Math.floor(viewport.width) + 'px'
          canvas.style.height = Math.floor(viewport.height) + 'px'

          const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined

          // Render PDF page
          const renderContext = {
            canvasContext: context,
            viewport,
            transform,
          } as any

          await page.render(renderContext).promise

          if (pageNum === 1) {
            setActualZoom(Math.round(scale * 100))
          }
        } catch (err) {
          console.error(`Error rendering page ${pageNum}:`, err)
        }
      }
    }

    renderAllPages()
  }, [numPages, zoom, rotation, loading])

  // Track current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || numPages === 0) return

      const scrollTop = containerRef.current.scrollTop
      const pageHeight = containerRef.current.scrollHeight / numPages
      const newPage = Math.min(numPages, Math.max(1, Math.floor(scrollTop / pageHeight) + 1))

      if (newPage !== pageNumber) {
        setPageNumber(newPage)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [numPages, pageNumber])

  // Handle download
  const handleDownload = async () => {
    try {
      let downloadUrl: string

      if (url.startsWith('r2://')) {
        downloadUrl = `/api/r2-content?key=${encodeURIComponent(url.replace('r2://', ''))}`
      } else if (url.startsWith('https://pub-') && url.includes('.r2.dev/')) {
        downloadUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        downloadUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`
      } else {
        downloadUrl = url
      }

      const response = await fetch(downloadUrl, { credentials: 'include' })
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = title || 'document.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('Error downloading PDF:', err)
    }
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Pinch-to-zoom disabled for performance on large files
  // Touch handlers removed to prevent zoom gestures

  // Scroll to specific page
  const scrollToPage = useCallback((pageNum: number) => {
    if (!containerRef.current || pageNum < 1 || pageNum > numPages) return

    const canvas = canvasRefs.current[pageNum - 1]
    if (canvas) {
      canvas.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [numPages])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent if user is typing in an input
      if (e.target instanceof HTMLInputElement) return

      switch (e.key) {
        // Exit fullscreen
        case 'Escape':
          router.back()
          break

        // Zoom controls
        case '+':
        case '=':
          e.preventDefault()
          if (typeof zoom === 'number' && zoom < 400) {
            setZoom(zoom + 25)
          } else if (typeof zoom === 'number') {
            setZoom(400)
          } else {
            setZoom(Math.min(400, actualZoom + 25))
          }
          break
        case '-':
        case '_':
          e.preventDefault()
          if (typeof zoom === 'number' && zoom > 25) {
            setZoom(zoom - 25)
          } else if (typeof zoom === 'number') {
            setZoom(25)
          } else {
            setZoom(Math.max(25, actualZoom - 25))
          }
          break

        // Page navigation
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          scrollToPage(Math.max(1, pageNumber - 1))
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          scrollToPage(Math.min(numPages, pageNumber + 1))
          break
        case 'Home':
          e.preventDefault()
          scrollToPage(1)
          break
        case 'End':
          e.preventDefault()
          scrollToPage(numPages)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [router, zoom, actualZoom, pageNumber, numPages, scrollToPage])

  if (error) {
    return (
      <div className="fixed inset-0 bg-[#525659] flex items-center justify-center">
        <div className="text-center max-w-md">
          <svg className="w-20 h-20 mx-auto mb-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-medium text-white text-lg mb-2">Error loading PDF</p>
          <p className="text-sm text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-[#525659]">
      {/* Native Browser-Style Toolbar */}
      <div className="bg-[#323639] text-white shadow-lg">
        <div className="flex items-center justify-between px-2 md:px-4 py-2 gap-1 md:gap-2 overflow-x-auto">
          {/* Left Section - Back + Navigation */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button
              onClick={() => router.back()}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded transition-colors mr-1 md:mr-2"
              title="Go back"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => scrollToPage(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={() => scrollToPage(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="flex items-center gap-1 md:gap-2 mx-1 md:mx-2">
              <input
                type="number"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value)
                  if (page >= 1 && page <= numPages) {
                    scrollToPage(page)
                  }
                }}
                className="w-10 md:w-12 px-1 md:px-2 py-1 bg-[#474b4f] text-white text-center rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
              />
              <span className="text-xs md:text-sm text-gray-300 whitespace-nowrap">/ {numPages}</span>
            </div>
          </div>

          {/* Center Section - Zoom Controls */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button
              onClick={() => {
                if (typeof zoom === 'number' && zoom > 25) {
                  setZoom(zoom - 25)
                } else if (typeof zoom === 'number') {
                  setZoom(25)
                } else {
                  setZoom(Math.max(25, actualZoom - 25))
                }
              }}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded transition-colors"
              title="Zoom out"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>

            <select
              value={typeof zoom === 'number' ? zoom : zoom}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'auto' || value === 'page-fit' || value === 'page-width') {
                  setZoom(value)
                } else {
                  setZoom(parseInt(value))
                }
              }}
              className="px-2 md:px-3 py-1 bg-[#474b4f] text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-xs md:text-sm min-w-[80px] md:min-w-[100px]"
            >
              <option value="auto">Auto</option>
              <option value="page-fit">Fit</option>
              <option value="page-width">Width</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
              <option value="200">200%</option>
              <option value="300">300%</option>
              <option value="400">400%</option>
            </select>

            <button
              onClick={() => {
                if (typeof zoom === 'number' && zoom < 400) {
                  setZoom(zoom + 25)
                } else if (typeof zoom === 'number') {
                  setZoom(400)
                } else {
                  setZoom(Math.min(400, actualZoom + 25))
                }
              }}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded transition-colors"
              title="Zoom in"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded transition-colors"
              title="Rotate clockwise"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded transition-colors"
              title="Download"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded transition-colors hidden sm:block"
              title="Print"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Document Title */}
        <div className="px-2 md:px-4 pb-2">
          <div className="text-xs md:text-sm text-gray-300 truncate">{title}</div>
        </div>
      </div>

      {/* PDF Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#525659] p-4"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4"></div>
              <p>Loading PDF...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {Array.from({ length: numPages }, (_, index) => (
              <canvas
                key={`page-${index + 1}`}
                ref={(el) => {
                  canvasRefs.current[index] = el
                }}
                className="shadow-2xl bg-white"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
