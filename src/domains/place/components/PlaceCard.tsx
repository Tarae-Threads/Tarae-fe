'use client'

import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import TagChip from '@/shared/components/ui/TagChip'

interface PlaceCardProps {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCard({ place, onClick }: PlaceCardProps) {
  const primaryCategory = place.categories[0]?.name
  return (
    <button
      onClick={() => onClick(place)}
      className="min-w-[280px] group bg-surface-container-high rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 text-left p-5"
    >
      <div className="flex items-center gap-1.5 mb-2">
        {primaryCategory && <CategoryBadge category={primaryCategory} size="md" />}
        <StatusBadge status={place.status} />
      </div>

      <h3 className="font-display font-bold text-title-sm text-on-surface mb-1">
        {place.name}
      </h3>

      <p className="text-on-surface-variant text-body-sm line-clamp-1 mb-2 leading-relaxed">
        {place.address}
      </p>

      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {place.tags.slice(0, 3).map(tag => (
            <TagChip key={tag.id} label={tag.name} size="md" />
          ))}
        </div>
      )}
    </button>
  )
}
