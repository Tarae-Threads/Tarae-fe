'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Place, PlaceCategory } from '@/domains/place/types'
import type { NavTab } from './NavBar'
import CategoryBadge from '@/domains/place/components/CategoryBadge'
import StatusBadge from '@/domains/place/components/StatusBadge'
import PlaceFilter from '@/domains/place/components/PlaceFilter'
import EventSidePanelContent from '@/domains/event/components/EventSidePanelContent'
import EmptyState from '@/shared/components/ui/EmptyState'
import { Search, SlidersHorizontal, X, Clock, MapPin } from 'lucide-react'

interface Props {
  activeTab: NavTab
  places: Place[]
  selectedCategories: Set<PlaceCategory>
  selectedRegion: string
  searchQuery: string
  onSearchChange: (query: string) => void
  onPlaceSelect: (place: Place) => void
  onToggleCategory: (category: PlaceCategory) => void
  onClearCategories: () => void
  onRegionChange: (region: string) => void
  onEventSelect?: (eventId: string) => void
  viewportFilterActive?: boolean
  onClearViewportFilter?: () => void
}

export default function BasePanel({
  activeTab,
  places,
  selectedCategories,
  selectedRegion,
  searchQuery,
  onSearchChange,
  onPlaceSelect,
  onToggleCategory,
  onClearCategories,
  onRegionChange,
  onEventSelect,
  viewportFilterActive,
  onClearViewportFilter,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="hidden md:flex flex-col w-[380px] shrink-0 h-full bg-surface border-r border-border overflow-hidden">
      {activeTab === 'places' ? (
        <>
          {/* Search + Filter */}
          <div className="px-4 pt-4 pb-2 shrink-0">
            <div className="relative flex items-center bg-surface-container-low rounded-xl">
              <Search className="absolute left-3 w-4 h-4 text-primary" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                aria-label="뜨개 장소 검색"
                placeholder="장소, 브랜드, 태그 검색..."
                className="flex-1 bg-transparent h-10 pl-10 pr-2 text-label-lg text-on-surface placeholder:text-outline font-medium focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')} aria-label="검색 초기화" className="p-1.5 text-outline hover:text-on-surface">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setFilterOpen(prev => !prev)}
                aria-expanded={filterOpen}
                aria-label="필터"
                className={`mr-1.5 p-2 rounded-lg transition-colors ${
                  filterOpen ? 'bg-primary text-white' : 'text-outline hover:bg-surface-container'
                }`}
              >
                {filterOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
              </button>
            </div>
            {filterOpen && (
              <div className="mt-2 bg-surface-container rounded-xl p-4">
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

          {viewportFilterActive && (
            <div className="px-4 pb-2 shrink-0">
              <button
                onClick={onClearViewportFilter}
                className="w-full flex items-center justify-center gap-1.5 bg-primary/10 text-primary font-bold text-label-md py-2 rounded-xl hover:bg-primary/15 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                전체보기
              </button>
            </div>
          )}

          {/* Place list */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {places.length === 0 ? (
              <EmptyState
                title="검색 결과가 없어요"
                description="필터를 변경하거나 검색어를 수정해보세요."
                icon={<MapPin className="w-8 h-8 text-outline" />}
              />
            ) : (
              <div className="px-4 space-y-3 pb-4">
                {places.map(place => (
                  <button
                    key={place.id}
                    onClick={() => onPlaceSelect(place)}
                    className="w-full bg-surface-container-high rounded-2xl overflow-hidden editorial-shadow text-left group transition-all hover:shadow-xl"
                  >
                    {place.images[0] && (
                      <div className="h-32 overflow-hidden relative">
                        <Image src={place.images[0]} alt={place.name} fill sizes="340px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display font-bold text-label-lg text-on-surface">{place.name}</h3>
                          <StatusBadge status={place.status} />
                        </div>
                        <CategoryBadge category={place.category} />
                      </div>
                      <p className="text-on-surface-variant text-label-md line-clamp-1 mb-2">{place.address}</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-outline" />
                        <span className="text-label-xs font-bold text-outline uppercase tracking-wider">{place.hours}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 text-center shrink-0 bg-surface-container-low">
            <p className="text-label-xs text-outline font-medium uppercase tracking-widest">
              {places.length}개 장소 발견
            </p>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <EventSidePanelContent onEventSelect={onEventSelect} />
        </div>
      )}
    </div>
  )
}
