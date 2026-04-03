'use client'

import Image from 'next/image'
import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import { Clock, Store, Palette, Coffee, Pipette, Scissors } from 'lucide-react'
import type { PlaceCategory } from '../types'

const CATEGORY_ICON: Record<PlaceCategory, React.ReactNode> = {
  yarn_store: <Store className="w-8 h-8 text-white/50" />,
  studio: <Palette className="w-8 h-8 text-white/50" />,
  cafe: <Coffee className="w-8 h-8 text-white/50" />,
  dye_shop: <Pipette className="w-8 h-8 text-white/50" />,
  craft_supply: <Scissors className="w-8 h-8 text-white/50" />,
}
import TagChip from '@/shared/components/ui/TagChip'

interface Props {
  place: Place
  onClick: (place: Place) => void
}

export default function PlaceCardCompact({ place, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(place)}
      className="w-full bg-surface-container-high rounded-2xl overflow-hidden editorial-shadow active:scale-[0.98] transition-transform duration-200 text-left"
    >
      <div className="h-32 overflow-hidden relative">
        {place.images[0] ? (
          <Image src={place.images[0]} alt={place.name} fill sizes="340px" className="object-cover" />
        ) : (
          <div className="w-full h-full signature-gradient opacity-30 flex items-center justify-center">
            {CATEGORY_ICON[place.category]}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-label-lg text-on-surface">{place.name}</h3>
            <StatusBadge status={place.status} />
          </div>
          <CategoryBadge category={place.category} />
        </div>
        <p className="text-on-surface-variant text-label-md line-clamp-1 mb-2">{place.address}</p>
        {place.tags.length > 0 && (
          <div className="flex gap-1 mb-2">
            {place.tags.slice(0, 2).map(tag => (
              <TagChip key={tag} label={tag} size="sm" />
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-outline" />
          <span className="text-label-xs font-bold text-outline uppercase tracking-wider">{place.hours}</span>
        </div>
      </div>
    </button>
  )
}
