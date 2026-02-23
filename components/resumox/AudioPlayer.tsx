'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface AudioPlayerProps {
  title: string
  author: string
  audioR2Key: string | null
  duration: number | null // minutes
  initialPosition?: number // seconds
  onPositionChange?: (seconds: number) => void
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2]

export default function AudioPlayer({
  title,
  author,
  audioR2Key,
  duration,
  initialPosition = 0,
  onPositionChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialPosition)
  const [totalDuration, setTotalDuration] = useState(duration ? duration * 60 : 0)
  const [speed, setSpeed] = useState(1)
  // Usar proxy endpoint diretamente como src do audio (evita CORS com R2)
  const audioUrl = audioR2Key
    ? `/api/r2-content?key=${encodeURIComponent(audioR2Key)}`
    : null
  const barsCount = 40

  // Set initial position once audio loads
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !initialPosition) return
    const handleLoaded = () => {
      audio.currentTime = initialPosition
    }
    audio.addEventListener('loadedmetadata', handleLoaded)
    return () => audio.removeEventListener('loadedmetadata', handleLoaded)
  }, [initialPosition])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }, [playing])

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    setTotalDuration(audio.duration || totalDuration)
    onPositionChange?.(Math.floor(audio.currentTime))
  }, [onPositionChange, totalDuration])

  const handleSpeedChange = useCallback((s: number) => {
    setSpeed(s)
    if (audioRef.current) audioRef.current.playbackRate = s
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = totalDuration > 0 ? currentTime / totalDuration : 0
  const playedBars = Math.floor(progress * barsCount)

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
          onEnded={() => setPlaying(false)}
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
        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          className="w-[52px] h-[52px] rounded-full bg-resumox-accent flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
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

        {/* Waveform bars */}
        <div className="flex-1 flex items-center gap-[2px] h-10">
          {Array.from({ length: barsCount }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-colors duration-200"
              style={{
                maxWidth: '4px',
                height: `${20 + Math.sin(i * 0.5) * 20 + Math.random() * 10}%`,
                background: i < playedBars ? '#A29BFE' : '#22222E',
              }}
            />
          ))}
        </div>

        <span className="text-[11px] text-resumox-muted min-w-[70px] text-right">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>

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
