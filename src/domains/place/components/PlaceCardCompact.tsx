'use client'

import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import { Store, Palette, Coffee, Pipette, Scissors } from 'lucide-react'
import TagChip from '@/shared/components/ui/TagChip'

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  '뜨개샵': <Store className="w-8 h-8 text-white/50" />,
  '공방': <Palette className="w-8 h-8 text-white/50" />,
  '뜨개카페': <Coffee className="w-8 h-8 text-white/50" />,
  '손염색실': <Pipette className="w-8 h-8 text-white/50" />,
  '공예용품점': <Scissors className="w-8 h-8 text-white/50" />,
}

interface Props {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCardCompact({ place, onClick }: Props) {
  const primaryCategory = place.categories[0]?.name
  return (
    <button
      onClick={() => onClick(place)}
      className="w-full bg-surface-container-high rounded-2xl overflow-hidden editorial-shadow active:scale-[0.98] transition-transform duration-200 text-left"
    >
      <div className="h-32 overflow-hidden relative">
        <div className="w-full h-full signature-gradient opacity-30 flex items-center justify-center">
          {primaryCategory ? CATEGORY_ICON[primaryCategory] : null}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-label-lg text-on-surface">{place.name}</h3>
            <StatusBadge status={place.status} />
          </div>
          {primaryCategory && <CategoryBadge category={primaryCategory} />}
        </div>
        <p className="text-on-surface-variant text-label-md line-clamp-1 mb-2">{place.address}</p>
        {place.tags.length > 0 && (
          <div className="flex gap-1 mb-2">
            {place.tags.slice(0, 2).map(tag => (
              <TagChip key={tag.id} label={tag.name} size="sm" />
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
