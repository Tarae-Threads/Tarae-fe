'use client'

import Image from 'next/image'
import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import { Clock } from 'lucide-react'

interface PlaceCardProps {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <button
      onClick={() => onClick(place)}
      className="min-w-[280px] group bg-surface-container-high rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 text-left"
    >
      {/* Image area */}
      <div className="h-44 relative overflow-hidden">
        {place.images[0] ? (
          <Image
            src={place.images[0]}
            alt={place.name}
            fill
            sizes="280px"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full signature-gradient opacity-30" />
        )}
        <div className="absolute top-4 left-4">
          <CategoryBadge category={place.category} size="md" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-on-surface mb-2">
          {place.name}
        </h3>

        <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">
          {place.address}
        </p>

        <div className="flex items-center gap-2">
          <Clock className="w-[18px] h-[18px] text-outline" />
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
            {place.hours}
          </span>
        </div>
      </div>
    </button>
  )
}
