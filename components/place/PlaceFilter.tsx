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
    <div className="space-y-4">
      {/* Category chips */}
      <div>
        <p className="text-label-md font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
          카테고리
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`px-4 py-2 text-body-sm rounded-full transition-all ${
                selectedCategory === value
                  ? 'signature-gradient text-white font-bold shadow-lg shadow-primary/20'
                  : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Region chips */}
      <div>
        <p className="text-label-md font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
          지역
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onRegionChange('all')}
            className={`px-4 py-2 text-body-sm rounded-full transition-all ${
              selectedRegion === 'all'
                ? 'signature-gradient text-white font-bold shadow-lg shadow-primary/20'
                : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
            }`}
          >
            전체
          </button>
          {REGION_ORDER.map(region => (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className={`px-4 py-2 text-body-sm rounded-full transition-all ${
                selectedRegion === region
                  ? 'signature-gradient text-white font-bold shadow-lg shadow-primary/20'
                  : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
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
