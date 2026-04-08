'use client'

import { CATEGORY_LABEL, REGION_ORDER } from '../constants'
import FilterChip from '@/shared/components/ui/FilterChip'
import { RotateCcw } from 'lucide-react'

export type SortBy = 'name-asc' | 'name-desc' | 'distance'

interface PlaceFilterProps {
  selectedCategories: Set<string>
  selectedRegion: string
  onToggleCategory: (category: string) => void
  onClearCategories: () => void
  onRegionChange: (region: string) => void
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
}

// BE CategoryInfo.name은 한국어 라벨 (뜨개샵, 공방 등)
const categoryList = Object.entries(CATEGORY_LABEL)

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'name-asc', label: '이름순 ↑' },
  { value: 'name-desc', label: '이름순 ↓' },
  { value: 'distance', label: '가까운순' },
]

export default function PlaceFilter({
  selectedCategories,
  selectedRegion,
  onToggleCategory,
  onClearCategories,
  onRegionChange,
  sortBy,
  onSortChange,
}: PlaceFilterProps) {
  const isAllCategories = selectedCategories.size === 0

  return (
    <div className="space-y-4">
      {/* Sort */}
      <div>
        <p className="text-label-md font-bold text-on-surface-variant mb-2 uppercase tracking-widest">
          정렬
        </p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map(opt => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={sortBy === opt.value}
              onClick={() => onSortChange(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">
            카테고리
          </p>
          {!isAllCategories && (
            <button
              onClick={onClearCategories}
              aria-label="카테고리 초기화"
              className="p-1 text-outline hover:text-primary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryList.map(([, label]) => (
            <FilterChip
              key={label}
              label={label}
              selected={selectedCategories.has(label)}
              onClick={() => onToggleCategory(label)}
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
