'use client'

import type { PlaceCategory } from '@/lib/types'
import { CATEGORY_LABEL, REGION_ORDER } from '@/lib/types'

interface PlaceFilterProps {
  selectedCategory: PlaceCategory | 'all'
  selectedRegion: string
  onCategoryChange: (category: PlaceCategory | 'all') => void
  onRegionChange: (region: string) => void
}

const categories: { value: PlaceCategory | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'yarn_store', label: CATEGORY_LABEL.yarn_store },
  { value: 'studio', label: CATEGORY_LABEL.studio },
  { value: 'cafe', label: CATEGORY_LABEL.cafe },
  { value: 'popup', label: CATEGORY_LABEL.popup },
]

export default function PlaceFilter({
  selectedCategory,
  selectedRegion,
  onCategoryChange,
  onRegionChange,
}: PlaceFilterProps) {
  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">카테고리</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedCategory === value
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background hover:bg-accent border-border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Region filter */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">지역</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onRegionChange('all')}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              selectedRegion === 'all'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background hover:bg-accent border-border'
            }`}
          >
            전체
          </button>
          {REGION_ORDER.map(region => (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedRegion === region
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background hover:bg-accent border-border'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
