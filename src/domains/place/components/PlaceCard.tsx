'use client'

import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import { Store, Palette, Coffee, Pipette, Scissors } from 'lucide-react'
import TagChip from '@/shared/components/ui/TagChip'

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  '뜨개샵': <Store className="w-10 h-10 text-white/50" />,
  '공방': <Palette className="w-10 h-10 text-white/50" />,
  '뜨개카페': <Coffee className="w-10 h-10 text-white/50" />,
  '손염색실': <Pipette className="w-10 h-10 text-white/50" />,
  '공예용품점': <Scissors className="w-10 h-10 text-white/50" />,
}

interface PlaceCardProps {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCard({ place, onClick }: PlaceCardProps) {
  const primaryCategory = place.categories[0]?.name
  return (
    <button
      onClick={() => onClick(place)}
      className="min-w-[280px] group bg-surface-container-high rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 text-left"
    >
      {/* Image area */}
      <div className="h-44 relative overflow-hidden">
        <div className="w-full h-full signature-gradient opacity-30 flex items-center justify-center">
          {primaryCategory ? CATEGORY_ICON[primaryCategory] : null}
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          {primaryCategory && <CategoryBadge category={primaryCategory} size="md" />}
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

        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {place.tags.slice(0, 3).map(tag => (
              <TagChip key={tag.id} label={tag.name} size="md" />
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
