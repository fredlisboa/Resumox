'use client'

import AudioPlayer from './AudioPlayer'
import DownloadSection from './DownloadSection'
import type { ResumoxBook } from '@/lib/resumox-types'

interface PanelAudioProps {
  book: ResumoxBook
  audioPosition: number
  onPositionChange: (seconds: number) => void
}

export default function PanelAudio({ book, audioPosition, onPositionChange }: PanelAudioProps) {
  return (
    <div className="px-5">
      <AudioPlayer
        title={book.title}
        author={book.author}
        audioR2Key={book.audio_r2_key}
        duration={book.audio_duration_min}
        initialPosition={audioPosition}
        onPositionChange={onPositionChange}
      />

      {book.pdf_r2_key && (
        <DownloadSection
          items={[
            { label: 'PDF do Resumo', r2Key: book.pdf_r2_key, icon: '📄' },
          ]}
        />
      )}
    </div>
  )
}
