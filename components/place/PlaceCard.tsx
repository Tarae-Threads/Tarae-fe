'use client'

import { Badge } from '@/components/ui/badge'
import type { Place } from '@/lib/types'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/types'

interface PlaceCardProps {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <button
      onClick={() => onClick(place)}
      className="w-full text-left p-4 rounded-lg border hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-sm">{place.name}</h3>
        <Badge
          className="text-[10px] px-1.5 py-0"
          style={{ backgroundColor: CATEGORY_COLOR[place.category], color: 'white' }}
        >
          {CATEGORY_LABEL[place.category]}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{place.address}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{place.hours}</p>
      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {place.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </button>
  )
}
