'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar livros...' }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (v: string) => {
    setLocalValue(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onChange(v), 300)
  }

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-resumox-muted" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-resumox-surface border border-resumox-border rounded-2xl text-sm text-resumox-text placeholder-resumox-muted/50 focus:ring-2 focus:ring-resumox-accent focus:border-resumox-accent outline-none transition-all"
      />
      {localValue && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-resumox-muted hover:text-resumox-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
