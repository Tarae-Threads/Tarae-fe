'use client'

import Image from 'next/image'
import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
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
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <CategoryBadge category={place.category} size="md" />
          <StatusBadge status={place.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-title-sm text-on-surface mb-1">
          {place.name}
        </h3>

        <p className="text-on-surface-variant text-body-sm line-clamp-1 mb-2 leading-relaxed">
          {place.address}
        </p>

        {place.note && (
          <p className="text-on-surface-variant text-label-md line-clamp-1 mb-3">
            {place.note}
          </p>
        )}

        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {place.tags.slice(0, 3).map(tag => (
              <span key={tag} className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

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
