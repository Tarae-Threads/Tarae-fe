'use client'

import type { Place } from '@/lib/types'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/types'
import { Clock, MapPin, Star } from 'lucide-react'

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
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full signature-gradient opacity-30" />
        )}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: CATEGORY_COLOR[place.category] }}
        >
          {CATEGORY_LABEL[place.category]}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-lg text-on-surface">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 text-primary">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-extrabold">4.8</span>
          </div>
        </div>

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
