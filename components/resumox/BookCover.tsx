'use client'

interface BookCoverProps {
  title: string
  author: string
  gradientFrom: string
  gradientTo: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-16 h-24',
  md: 'w-[110px] h-[160px]',
  lg: 'w-32 h-48',
}

export default function BookCover({
  title,
  author,
  gradientFrom,
  gradientTo,
  size = 'md',
  className = '',
}: BookCoverProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex flex-col items-center justify-center p-3 relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Spine line */}
      <div
        className="absolute left-1.5 top-0 bottom-0 w-0.5"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))' }}
      />
      <span
        className="text-center leading-tight font-playfair font-extrabold"
        style={{
          fontSize: size === 'sm' ? '10px' : size === 'md' ? '13px' : '15px',
          color: '#F0C040',
        }}
      >
        {title}
      </span>
      <span
        className="mt-2 uppercase tracking-widest text-center"
        style={{
          fontSize: size === 'sm' ? '6px' : '8px',
          color: '#8888A0',
        }}
      >
        {author}
      </span>
    </div>
  )
}
