'use client'

import { Plus, Minus, LocateFixed } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocate: () => void
}

export default function MapControls({ onZoomIn, onZoomOut, onLocate }: MapControlsProps) {
  return (
    <div className="absolute right-6 top-24 flex flex-col gap-3 z-20" role="group" aria-label="지도 컨트롤">
      <button
        onClick={onZoomIn}
        aria-label="확대"
        className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-on-surface shadow-ambient-sm hover:bg-surface transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        aria-label="축소"
        className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-on-surface shadow-ambient-sm hover:bg-surface transition-colors"
      >
        <Minus className="w-5 h-5" />
      </button>
      <div className="h-4" />
      <button
        onClick={onLocate}
        aria-label="내 위치로 이동"
        className="w-12 h-12 signature-gradient text-white rounded-2xl flex items-center justify-center shadow-lg"
      >
        <LocateFixed className="w-5 h-5" />
      </button>
    </div>
  )
}
