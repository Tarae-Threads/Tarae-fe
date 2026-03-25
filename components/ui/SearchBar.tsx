'use client'

import type { PlaceCategory } from '@/lib/types'
import PlaceFilter from '@/components/place/PlaceFilter'
import { Search } from 'lucide-react'

interface SearchBarProps {
  filterOpen: boolean
  onToggleFilter: () => void
  selectedCategory: PlaceCategory | 'all'
  selectedRegion: string
  onCategoryChange: (category: PlaceCategory | 'all') => void
  onRegionChange: (region: string) => void
}

export default function SearchBar({
  filterOpen,
  onToggleFilter,
  selectedCategory,
  selectedRegion,
  onCategoryChange,
  onRegionChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggleFilter}
        className="w-full bg-surface/80 backdrop-blur-2xl h-14 pl-14 pr-6 rounded-2xl editorial-shadow text-left text-outline font-medium flex items-center"
      >
        <Search className="absolute left-5 w-5 h-5 text-primary" />
        <span>뜨개 장소 검색...</span>
      </button>
      {filterOpen && (
        <div className="mt-3 bg-surface-container-low backdrop-blur-2xl rounded-2xl editorial-shadow p-5">
          <PlaceFilter
            selectedCategory={selectedCategory}
            selectedRegion={selectedRegion}
            onCategoryChange={(c) => { onCategoryChange(c); onToggleFilter() }}
            onRegionChange={(r) => { onRegionChange(r); onToggleFilter() }}
          />
        </div>
      )}
    </div>
  )
}
