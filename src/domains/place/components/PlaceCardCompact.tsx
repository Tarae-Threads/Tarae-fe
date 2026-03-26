'use client'

import Image from 'next/image'
import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import { Clock } from 'lucide-react'

interface Props {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCardCompact({ place, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(place)}
      className="w-full flex gap-4 bg-surface-container-high rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-200 text-left"
    >
      {/* Thumbnail */}
      <div className="w-24 h-24 relative flex-shrink-0 overflow-hidden rounded-2xl">
        {place.images[0] ? (
          <Image
            src={place.images[0]}
            alt={place.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full signature-gradient opacity-30" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 py-3 pr-4 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-bold text-base text-on-surface truncate">
            {place.name}
          </h3>
          <CategoryBadge category={place.category} />
        </div>
        <p className="text-on-surface-variant text-sm line-clamp-1 mb-1.5">
          {place.address}
        </p>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-outline" />
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            {place.hours}
          </span>
        </div>
      </div>
    </button>
  )
}
