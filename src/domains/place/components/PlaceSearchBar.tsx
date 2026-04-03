'use client'

import type { PlaceCategory } from '../types'
import PlaceFilter from './PlaceFilter'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface PlaceSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filterOpen: boolean
  onToggleFilter: () => void
  selectedCategories: Set<PlaceCategory>
  selectedRegion: string
  onToggleCategory: (category: PlaceCategory) => void
  onClearCategories: () => void
  onRegionChange: (region: string) => void
  resultCount?: number
}

export default function PlaceSearchBar({
  searchQuery,
  onSearchChange,
  filterOpen,
  onToggleFilter,
  selectedCategories,
  selectedRegion,
  onToggleCategory,
  onClearCategories,
  onRegionChange,
  resultCount,
}: PlaceSearchBarProps) {
  const activeFilterCount = selectedCategories.size + (selectedRegion !== 'all' ? 1 : 0)
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
        {searchQuery && (
          <button onClick={() => onSearchChange('')} aria-label="검색 초기화" className="p-1.5 text-outline hover:text-on-surface">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onToggleFilter}
          aria-expanded={filterOpen}
          aria-label="필터"
          className={`relative mr-2 p-2.5 rounded-lg transition-colors ${
            filterOpen ? 'bg-primary text-white' : 'text-outline hover:bg-surface-container'
          }`}
        >
          {filterOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          {!filterOpen && activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
      {searchQuery && typeof resultCount === 'number' && (
        <div className="mt-2 px-4" aria-live="polite">
          <span className="text-label-sm text-outline font-medium">{resultCount}개 결과</span>
        </div>
      )}
      {filterOpen && (
        <div className="mt-3 bg-surface-container-low backdrop-blur-2xl rounded-2xl editorial-shadow p-4">
          <PlaceFilter
            selectedCategories={selectedCategories}
            selectedRegion={selectedRegion}
            onToggleCategory={onToggleCategory}
            onClearCategories={onClearCategories}
            onRegionChange={onRegionChange}
          />
        </div>
      )}
    </div>
  )
}
