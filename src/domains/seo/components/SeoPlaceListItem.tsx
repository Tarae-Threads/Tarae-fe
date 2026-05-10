import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Place } from '@/domains/place/types'
import CategoryBadge from '@/domains/place/components/CategoryBadge'
import StatusBadge from '@/domains/place/components/StatusBadge'
import TagChip from '@/shared/components/ui/TagChip'

interface Props {
  place: Place
}

export default function SeoPlaceListItem({ place }: Props) {
  const primaryCategory = place.categories[0]?.name
  const locationLabel = [place.region, place.district].filter(Boolean).join(' ')

  return (
    <Link
      href={`/places/${place.id}`}
      className="block bg-surface-container-high rounded-2xl p-5 hover:shadow-lg transition-all duration-300 active:scale-[0.99]"
    >
      <div className="flex items-center gap-1.5 mb-2">
        {primaryCategory && <CategoryBadge category={primaryCategory} size="md" />}
        <StatusBadge status={place.status} />
      </div>

      <h3 className="font-display font-bold text-title-sm text-on-surface mb-1">
        {place.name}
      </h3>

      <p className="text-on-surface-variant text-body-sm line-clamp-1 mb-2 leading-relaxed inline-flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 shrink-0 text-outline" aria-hidden="true" />
        {locationLabel ? `${locationLabel} · ` : ''}
        {place.address}
      </p>

      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {place.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag.id} label={tag.name} size="md" />
          ))}
        </div>
      )}
    </Link>
  )
}
