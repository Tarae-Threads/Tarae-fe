'use client'

import type { PlaceCategory } from '@/lib/types'
import { CATEGORY_LABEL, REGION_ORDER } from '@/lib/types'
import FilterChip from '@/components/ui/FilterChip'

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
    <div className="space-y-4">
      {/* Category chips */}
      <div>
        <p className="text-label-md font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
          카테고리
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ value, label }) => (
            <FilterChip
              key={value}
              label={label}
              selected={selectedCategory === value}
              onClick={() => onCategoryChange(value)}
            />
          ))}
        </div>
      </div>

      {/* Region chips */}
      <div>
        <p className="text-label-md font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
          지역
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="전체"
            selected={selectedRegion === 'all'}
            onClick={() => onRegionChange('all')}
          />
          {REGION_ORDER.map(region => (
            <FilterChip
              key={region}
              label={region}
              selected={selectedRegion === region}
              onClick={() => onRegionChange(region)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
