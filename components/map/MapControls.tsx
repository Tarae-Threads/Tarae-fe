'use client'

import { Plus, Minus, LocateFixed } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocate: () => void
}

export default function MapControls({ onZoomIn, onZoomOut, onLocate }: MapControlsProps) {
  return (
    <div className="absolute right-6 top-24 flex flex-col gap-3 z-20">
      <button
        onClick={onZoomIn}
        className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-on-surface shadow-ambient-sm hover:bg-surface transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-on-surface shadow-ambient-sm hover:bg-surface transition-colors"
      >
        <Minus className="w-5 h-5" />
      </button>
      <div className="h-4" />
      <button
        onClick={onLocate}
        className="w-12 h-12 signature-gradient text-white rounded-2xl flex items-center justify-center shadow-lg"
      >
        <LocateFixed className="w-5 h-5" />
      </button>
    </div>
  )
}
