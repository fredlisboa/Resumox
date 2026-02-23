'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

interface AudioPlayerProps {
  title: string
  author: string
  audioR2Key: string | null
  duration: number | null // minutes
  initialPosition?: number // seconds
  onPositionChange?: (seconds: number) => void
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2]
const LOAD_TIMEOUT_MS = 12000

// Gera alturas pseudo-aleatórias estáveis baseadas no índice
function generateBarHeights(count: number): number[] {
  const heights: number[] = []
  for (let i = 0; i < count; i++) {
    const base = 25 + Math.sin(i * 0.7) * 18
    const variation = Math.sin(i * 2.3 + 1.7) * 15 + Math.cos(i * 1.1 + 0.3) * 10
    heights.push(Math.max(12, Math.min(95, base + variation)))
  }
  return heights
}

export default function AudioPlayer({
  title,
  author,
  audioR2Key,
  duration,
  initialPosition = 0,
  onPositionChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const waveformRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialPosition)
  const [totalDuration, setTotalDuration] = useState(duration ? duration * 60 : 0)
  const [speed, setSpeed] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverProgress, setHoverProgress] = useState<number | null>(null)
  const isDraggingRef = useRef(false)
  const [barsCount, setBarsCount] = useState(50)

  // Loading/buffering state
  const [isBuffering, setIsBuffering] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const playRequestedRef = useRef(false)

  const audioUrl = audioR2Key
    ? `/api/r2-content?key=${encodeURIComponent(audioR2Key)}`
    : null

  // Responsivamente calcula quantas barras cabem no container
  // Cada barra ocupa ~5px (largura + gap), sem limite máximo artificial
  useEffect(() => {
    const waveform = waveformRef.current
    if (!waveform) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 300
      const count = Math.max(20, Math.floor(width / 5))
      setBarsCount(count)
    })
    observer.observe(waveform)
    return () => observer.disconnect()
  }, [])

  const barHeights = useMemo(() => generateBarHeights(barsCount), [barsCount])

  // Cleanup load timeout on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current)
    }
  }, [])

  // Set initial position and capture duration once audio loads
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleLoaded = () => {
      if (initialPosition) audio.currentTime = initialPosition
      if (isFinite(audio.duration) && audio.duration > 0) {
        setTotalDuration(audio.duration)
      }
    }
    const handleDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setTotalDuration(audio.duration)
      }
    }
    audio.addEventListener('loadedmetadata', handleLoaded)
    audio.addEventListener('durationchange', handleDurationChange)
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded)
      audio.removeEventListener('durationchange', handleDurationChange)
    }
  }, [initialPosition])

  // Track buffering: when user hits play, detect if audio is actually progressing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleWaiting = () => {
      if (playRequestedRef.current) setIsBuffering(true)
    }
    const handlePlaying = () => {
      // Audio actually started — clear buffering and timeout
      setIsBuffering(false)
      setLoadError(false)
      playRequestedRef.current = false
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    }
    const handleError = () => {
      setIsBuffering(false)
      setLoadError(true)
      playRequestedRef.current = false
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    }

    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('error', handleError)
    return () => {
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setIsBuffering(false)
      playRequestedRef.current = false
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = null
      }
    } else {
      // User requested play — start buffering indicator
      setIsBuffering(true)
      setLoadError(false)
      playRequestedRef.current = true

      // Start 12s timeout
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current)
      loadTimeoutRef.current = setTimeout(() => {
        if (playRequestedRef.current) {
          setIsBuffering(false)
          setLoadError(true)
          playRequestedRef.current = false
          audio.pause()
        }
      }, LOAD_TIMEOUT_MS)

      audio.play().catch((err) => {
        console.warn('[AudioPlayer] play() failed:', err)
        setIsBuffering(false)
        setLoadError(true)
        playRequestedRef.current = false
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current)
          loadTimeoutRef.current = null
        }
      })
    }
  }, [playing])

  const handleTimeUpdate = useCallback(() => {
    if (isDraggingRef.current) return
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    if (isFinite(audio.duration) && audio.duration > 0) {
      setTotalDuration(audio.duration)
    }
    onPositionChange?.(Math.floor(audio.currentTime))
  }, [onPositionChange])

  const handleSpeedChange = useCallback((s: number) => {
    setSpeed(s)
    if (audioRef.current) audioRef.current.playbackRate = s
  }, [])

  const formatTime = (s: number) => {
    if (!isFinite(s) || s < 0) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Calcula a fração de progresso a partir de um evento de ponteiro
  const getProgressFromEvent = useCallback((clientX: number): number => {
    const waveform = waveformRef.current
    if (!waveform) return 0
    const rect = waveform.getBoundingClientRect()
    const x = clientX - rect.left
    return Math.max(0, Math.min(1, x / rect.width))
  }, [])

  const seekToProgress = useCallback(
    (fraction: number) => {
      const audio = audioRef.current
      if (!audio || totalDuration <= 0) return
      const newTime = fraction * totalDuration
      audio.currentTime = newTime
      setCurrentTime(newTime)
      onPositionChange?.(Math.floor(newTime))
    },
    [totalDuration, onPositionChange],
  )

  // --- Mouse events ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (totalDuration <= 0) return
      e.preventDefault()
      isDraggingRef.current = true
      setIsDragging(true)
      const fraction = getProgressFromEvent(e.clientX)
      seekToProgress(fraction)

      const onMove = (ev: MouseEvent) => {
        const f = getProgressFromEvent(ev.clientX)
        seekToProgress(f)
        setHoverProgress(f)
      }
      const onUp = () => {
        isDraggingRef.current = false
        setIsDragging(false)
        setHoverProgress(null)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [getProgressFromEvent, seekToProgress, totalDuration],
  )

  // --- Touch events ---
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (totalDuration <= 0) return
      isDraggingRef.current = true
      setIsDragging(true)
      const touch = e.touches[0]
      const fraction = getProgressFromEvent(touch.clientX)
      seekToProgress(fraction)

      const onMove = (ev: TouchEvent) => {
        const t = ev.touches[0]
        if (!t) return
        const f = getProgressFromEvent(t.clientX)
        seekToProgress(f)
        setHoverProgress(f)
      }
      const onEnd = () => {
        isDraggingRef.current = false
        setIsDragging(false)
        setHoverProgress(null)
        window.removeEventListener('touchmove', onMove)
        window.removeEventListener('touchend', onEnd)
        window.removeEventListener('touchcancel', onEnd)
      }
      window.addEventListener('touchmove', onMove, { passive: true })
      window.addEventListener('touchend', onEnd)
      window.addEventListener('touchcancel', onEnd)
    },
    [getProgressFromEvent, seekToProgress, totalDuration],
  )

  // --- Hover tooltip ---
  const handleMouseMoveHover = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingRef.current || totalDuration <= 0) return
      setHoverProgress(getProgressFromEvent(e.clientX))
    },
    [getProgressFromEvent, totalDuration],
  )

  const handleMouseLeave = useCallback(() => {
    if (!isDraggingRef.current) setHoverProgress(null)
  }, [])

  const progress = totalDuration > 0 ? currentTime / totalDuration : 0
  const playedBars = Math.floor(progress * barsCount)
  const hoverBar =
    hoverProgress !== null ? Math.floor(hoverProgress * barsCount) : null

  if (!audioR2Key) {
    return (
      <div className="bg-resumox-surface border border-resumox-border rounded-2xl p-5 text-center">
        <p className="text-sm text-resumox-muted">Audio em breve</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-5 mb-6 border border-resumox-border"
      style={{ background: 'linear-gradient(135deg, #13131A, #1A1A24)' }}
    >
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false)
            setIsBuffering(false)
            playRequestedRef.current = false
          }}
          preload="metadata"
        />
      )}

      <p className="text-[11px] text-resumox-accent-light uppercase tracking-widest font-semibold mb-2">
        Audiobook
      </p>
      <p className="text-base font-bold text-resumox-text mb-1">{title}</p>
      <p className="text-xs text-resumox-muted mb-4">{author}</p>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button with loading spinner overlay */}
        <div className="relative flex-shrink-0">
          <button
            onClick={togglePlay}
            disabled={!audioUrl}
            className="w-[52px] h-[52px] rounded-full bg-resumox-accent flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            style={{ boxShadow: '0 4px 20px rgba(108,92,231,0.3)' }}
          >
            {playing ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          {/* Spinner ring around play button when buffering */}
          {isBuffering && (
            <div
              className="absolute inset-[-3px] rounded-full pointer-events-none"
              style={{
                border: '3px solid transparent',
                borderTopColor: '#A29BFE',
                borderRightColor: '#A29BFE',
                animation: 'audioplayer-spin 0.8s linear infinite',
              }}
            />
          )}
        </div>

        {/* Waveform bars — seekable, fills full width */}
        <div
          ref={waveformRef}
          className="flex-1 relative select-none min-w-0"
          style={{ cursor: totalDuration > 0 ? 'pointer' : 'default' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveHover}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
        >
          {/* Buffering shimmer overlay on waveform */}
          {isBuffering && (
            <div
              className="absolute inset-0 z-20 pointer-events-none rounded-md overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(162,155,254,0.15) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'audioplayer-shimmer 1.5s ease-in-out infinite',
              }}
            />
          )}

          {/* Hover time tooltip */}
          {hoverProgress !== null && totalDuration > 0 && (
            <div
              className="absolute -top-8 pointer-events-none z-10 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white whitespace-nowrap"
              style={{
                left: `${hoverProgress * 100}%`,
                transform: 'translateX(-50%)',
                background: 'rgba(108,92,231,0.9)',
                boxShadow: '0 2px 8px rgba(108,92,231,0.4)',
              }}
            >
              {formatTime(hoverProgress * totalDuration)}
            </div>
          )}

          <div className="flex items-center gap-[2px] h-12 relative">
            {barHeights.map((h, i) => {
              const isPlayed = i < playedBars
              const isCurrentBar = i === playedBars
              const isHovered =
                hoverBar !== null && i <= hoverBar && i >= playedBars
              const isHoverPast =
                hoverBar !== null && hoverBar < playedBars && i > hoverBar && i < playedBars

              let bg: string
              if (isBuffering && !isPlayed) {
                // Subtle pulse on unplayed bars while buffering
                bg = '#1A1A28'
              } else if (isPlayed && !isHoverPast) {
                bg = '#A29BFE'
              } else if (isHoverPast) {
                bg = 'rgba(162,155,254,0.35)'
              } else if (isHovered) {
                bg = 'rgba(162,155,254,0.55)'
              } else {
                bg = '#22222E'
              }

              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-150 relative"
                  style={{
                    height: `${h}%`,
                    background: bg,
                    transform:
                      isDragging && isCurrentBar
                        ? 'scaleY(1.3)'
                        : hoverBar === i
                          ? 'scaleY(1.15)'
                          : 'scaleY(1)',
                  }}
                >
                  {/* Circle indicator at current playback position */}
                  {isCurrentBar && totalDuration > 0 && (
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                      style={{
                        width: isDragging ? '14px' : '12px',
                        height: isDragging ? '14px' : '12px',
                        borderRadius: '50%',
                        background: '#A29BFE',
                        boxShadow: '0 0 8px rgba(162,155,254,0.7), 0 0 16px rgba(162,155,254,0.3)',
                        transition: 'width 0.15s, height 0.15s, box-shadow 0.15s',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <span className="min-w-[90px] text-right tabular-nums flex-shrink-0">
          <span className="text-sm font-bold text-resumox-accent-light">{formatTime(currentTime)}</span>
          <span className="text-xs text-resumox-muted font-medium"> / {formatTime(totalDuration)}</span>
        </span>
      </div>

      {/* Load error alert */}
      {loadError && (
        <div className="mt-3 p-3 rounded-xl border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 flex items-center gap-3">
          <svg className="w-5 h-5 text-[#FF6B6B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
          <p className="text-xs text-[#FF6B6B] font-medium flex-1">
            Nao foi possivel carregar o audio. Verifique sua conexao com a internet e recarregue a pagina.
          </p>
          <button
            onClick={() => {
              setLoadError(false)
              window.location.reload()
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30 transition-colors flex-shrink-0"
          >
            Recarregar
          </button>
        </div>
      )}

      {/* Speed controls */}
      <div className="flex gap-1.5 mt-3">
        {SPEED_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSpeedChange(s)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
              speed === s
                ? 'bg-resumox-accent border-resumox-accent text-white'
                : 'bg-resumox-surface border-resumox-border text-resumox-muted hover:border-resumox-accent/40'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

    </div>
  )
}
