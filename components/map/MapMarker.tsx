'use client'

import type { PlaceCategory } from '@/lib/types'
import { CATEGORY_COLOR, CATEGORY_LABEL } from '@/lib/types'

interface MapMarkerProps {
  category: PlaceCategory
  size?: number
}

export default function MapMarker({ category, size = 24 }: MapMarkerProps) {
  const color = CATEGORY_COLOR[category]

  return (
    <div
      className="rounded-full border-[3px] border-white shadow-md"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      title={CATEGORY_LABEL[category]}
    />
  )
}
