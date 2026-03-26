'use client'

import type { PlaceCategory } from '../types'
import PlaceFilter from './PlaceFilter'
import { Search, SlidersHorizontal } from 'lucide-react'

interface PlaceSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterOpen: boolean
  onToggleFilter: () => void
  selectedCategory: PlaceCategory | 'all'
  selectedRegion: string
  onCategoryChange: (category: PlaceCategory | 'all') => void
  onRegionChange: (region: string) => void
}

export default function PlaceSearchBar({
  searchQuery,
  onSearchChange,
  filterOpen,
  onToggleFilter,
  selectedCategory,
  selectedRegion,
  onCategoryChange,
  onRegionChange,
}: PlaceSearchBarProps) {
  return (
    <div className="relative">
      <div className="flex items-center bg-surface/80 backdrop-blur-2xl h-14 rounded-2xl editorial-shadow">
        <Search className="absolute left-5 w-5 h-5 text-primary" aria-hidden="true" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="뜨개 장소 검색"
          placeholder="장소, 브랜드, 태그 검색..."
          className="flex-1 bg-transparent h-full pl-14 pr-2 text-on-surface placeholder:text-outline font-medium focus:outline-none"
        />
        <button
          onClick={onToggleFilter}
          aria-expanded={filterOpen}
          aria-label="필터"
          className={`mr-2 p-2.5 rounded-xl transition-colors ${
            filterOpen ? 'bg-primary text-white' : 'text-outline hover:bg-surface-container'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
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
