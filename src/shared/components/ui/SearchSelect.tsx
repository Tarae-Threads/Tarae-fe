'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface Option {
  value: string
  label: string
  sub?: string
}

interface Props {
  label: string
  required?: boolean
  options: Option[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  error?: string
}

export default function SearchSelect({
  label,
  required,
  options,
  value,
  onChange,
  placeholder = '검색...',
  error,
}: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = value ? options.find(o => o.value === value) : null

  const filtered = query
    ? options.filter(o => {
        const q = query.toLowerCase()
        return o.label.toLowerCase().includes(q) || o.sub?.toLowerCase().includes(q)
      })
    : options

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (selected) {
    return (
      <div>
        <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
          {label}{required && ' *'}
        </label>
        <div className="flex items-center gap-2 h-11 px-4 bg-surface-container rounded-xl">
          <div className="flex-1 min-w-0">
            <span className="text-label-lg text-on-surface font-medium">{selected.label}</span>
            {selected.sub && (
              <span className="text-label-xs text-outline ml-2">{selected.sub}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => { onChange(null); setQuery('') }}
            className="shrink-0 p-1 text-outline hover:text-on-surface"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
        {label}{required && ' *'}
      </label>
      <div className={`flex items-center h-11 px-4 bg-surface-container rounded-xl ${
        error ? 'ring-2 ring-destructive/30' : open ? 'ring-2 ring-primary/30' : ''
      }`}>
        <Search className="w-4 h-4 text-outline shrink-0 mr-2" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-label-lg text-on-surface placeholder:text-outline focus:outline-none"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="p-1 text-outline hover:text-on-surface">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {error && <p className="text-destructive text-label-xs mt-1">{error}</p>}

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-surface-container-low rounded-xl editorial-shadow max-h-48 overflow-y-auto hide-scrollbar">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-label-md text-outline">검색 결과가 없습니다</p>
          ) : (
            filtered.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setQuery('')
                  setOpen(false)
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-surface-container transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <span className="text-label-lg text-on-surface font-medium block">{option.label}</span>
                {option.sub && (
                  <span className="text-label-xs text-outline block mt-0.5">{option.sub}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
