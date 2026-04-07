'use client'

import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import TagChip from '@/shared/components/ui/TagChip'

interface Props {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCardCompact({ place, onClick }: Props) {
  const primaryCategory = place.categories[0]?.name
  return (
    <button
      onClick={() => onClick(place)}
      className="w-full bg-surface-container-high rounded-2xl overflow-hidden editorial-shadow active:scale-[0.98] transition-transform duration-200 text-left p-4"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-bold text-label-lg text-on-surface">{place.name}</h3>
          <StatusBadge status={place.status} />
        </div>
        {primaryCategory && <CategoryBadge category={primaryCategory} />}
      </div>
      <p className="text-on-surface-variant text-label-md line-clamp-1 mb-2">{place.address}</p>
      {place.tags.length > 0 && (
        <div className="flex gap-1">
          {place.tags.slice(0, 2).map(tag => (
            <TagChip key={tag.id} label={tag.name} size="sm" />
          ))}
        </div>
      )}
    </button>
  )
}
