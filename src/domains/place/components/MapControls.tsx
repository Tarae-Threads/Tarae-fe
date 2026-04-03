'use client'

import { ZoomIn, ZoomOut, LocateFixed } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocate: () => void
}

export default function MapControls({ onZoomIn, onZoomOut, onLocate }: MapControlsProps) {
  return (
    <div className="absolute right-4 bottom-[340px] md:right-6 md:bottom-8 flex flex-col gap-2 z-20" role="group" aria-label="지도 컨트롤">
      <button
        onClick={onZoomIn}
        aria-label="확대"
        className="w-11 h-11 glass rounded-xl flex items-center justify-center text-on-surface shadow-ambient-sm hover:bg-surface transition-colors"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        aria-label="축소"
        className="w-11 h-11 glass rounded-xl flex items-center justify-center text-on-surface shadow-ambient-sm hover:bg-surface transition-colors"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <div className="h-2" />
      <button
        onClick={onLocate}
        aria-label="내 위치로 이동"
        className="w-11 h-11 signature-gradient text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        <LocateFixed className="w-5 h-5" />
      </button>
    </div>
  )
}
