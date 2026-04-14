'use client'

import { REGION_ORDER } from '../constants'
import FilterChip from '@/shared/components/ui/FilterChip'

export type SortBy = 'name-asc' | 'name-desc' | 'distance'

interface PlaceFilterProps {
  selectedRegion: string
  onRegionChange: (region: string) => void
  sortBy: SortBy
  onSortChange: (sort: SortBy) => void
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'name-asc', label: '이름순 ↑' },
  { value: 'name-desc', label: '이름순 ↓' },
  { value: 'distance', label: '가까운순' },
]

export default function PlaceFilter({
  selectedRegion,
  onRegionChange,
  sortBy,
  onSortChange,
}: PlaceFilterProps) {
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
