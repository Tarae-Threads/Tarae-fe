'use client'

import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import TagChip from '@/shared/components/ui/TagChip'
import { Navigation } from 'lucide-react'

interface Props {
  place: Place
  onClick: (place: Place) => void
  distance?: number | null
}

export default function PlaceCardCompact({ place, onClick, distance }: Props) {
  return (
    <button
      onClick={() => onClick(place)}
      className="w-full bg-surface-container-high rounded-2xl overflow-hidden editorial-shadow active:scale-[0.98] transition-transform duration-200 text-left p-4"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="font-display font-bold text-label-lg text-on-surface truncate">{place.name}</h3>
          <StatusBadge status={place.status} />
        </div>
        {place.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-end shrink-0">
            {place.categories.map((c) => (
              <CategoryBadge key={c.id} category={c.name} />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-on-surface-variant text-label-md line-clamp-1 flex-1">{place.address}</p>
        {distance != null && (
          <span className="shrink-0 flex items-center gap-0.5 text-label-xs text-primary font-medium">
            <Navigation className="w-3 h-3" />
            {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
          </span>
        )}
      </div>
      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {place.tags.map(tag => (
            <TagChip key={tag.id} label={tag.name} size="sm" />
          ))}
        </div>
      )}
    </button>
  )
}
