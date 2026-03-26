'use client'

import type { PlaceCategory } from '../types'
import { CATEGORY_LABEL, REGION_ORDER } from '../constants'
import FilterChip from '@/shared/components/ui/FilterChip'

interface PlaceFilterProps {
  selectedCategories: Set<PlaceCategory>
  selectedRegion: string
  onToggleCategory: (category: PlaceCategory) => void
  onClearCategories: () => void
  onRegionChange: (region: string) => void
}

const categoryList: PlaceCategory[] = ['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply']

export default function PlaceFilter({
  selectedCategories,
  selectedRegion,
  onToggleCategory,
  onClearCategories,
  onRegionChange,
}: PlaceFilterProps) {
  const isAllCategories = selectedCategories.size === 0

  return (
    <div className="space-y-4">
      {/* Category chips */}
      <div>
        <p className="text-label-md font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
          카테고리
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="전체"
            selected={isAllCategories}
            onClick={onClearCategories}
          />
          {categoryList.map(cat => (
            <FilterChip
              key={cat}
              label={CATEGORY_LABEL[cat]}
              selected={selectedCategories.has(cat)}
              onClick={() => onToggleCategory(cat)}
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
