'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Place, PlaceCategory } from '../types'
import CategoryBadge from './CategoryBadge'
import PlaceFilter from './PlaceFilter'
import {
  X, Search, Clock, MapPin, ExternalLink,
} from 'lucide-react'
import TagChip from '@/shared/components/ui/TagChip'

interface PlaceSidePanelProps {
  places: Place[]
  selectedPlace: Place | null
  panelOpen: boolean
  selectedCategories: Set<PlaceCategory>
  selectedRegion: string
  searchQuery: string
  onSearchChange: (query: string) => void
  onPlaceSelect: (place: Place) => void
  onPanelClose: () => void
  onToggleCategory: (category: PlaceCategory) => void
  onClearCategories: () => void
  onRegionChange: (region: string) => void
  onClose: () => void
}

export default function PlaceSidePanel({
  places,
  selectedPlace,
  panelOpen,
  selectedCategories,
  selectedRegion,
  searchQuery,
  onSearchChange,
  onPlaceSelect,
  onPanelClose,
  onToggleCategory,
  onClearCategories,
  onRegionChange,
  onClose,
}: PlaceSidePanelProps) {
  const [tab, setTab] = useState<'list' | 'filter'>('list')

  return (
    <div className="h-full flex flex-col bg-surface overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0">
        <h2 className="font-display font-extrabold tracking-tighter text-title-lg text-primary">
          타래
        </h2>
        <button
          onClick={onClose}
          aria-label="패널 닫기"
          className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-outline" />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex px-5 gap-1 shrink-0 mb-1">
        <button
          onClick={() => { setTab('list'); if (panelOpen) onPanelClose() }}
          className={`px-4 py-2 text-label-lg font-bold rounded-full transition-all ${
            tab === 'list' && !panelOpen
              ? 'signature-gradient text-white'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          장소 목록
        </button>
        <button
          onClick={() => setTab('filter')}
          className={`px-4 py-2 text-label-lg font-bold rounded-full transition-all ${
            tab === 'filter'
              ? 'signature-gradient text-white'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          필터
        </button>
      </div>

      {/* Search */}
      <div className="px-5 py-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="뜨개 장소 검색"
            placeholder="장소, 브랜드, 태그 검색..."
            className="w-full bg-surface-container-low h-10 pl-10 pr-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {tab === 'filter' ? (
          <div className="px-5 py-3">
            <PlaceFilter
              selectedCategories={selectedCategories}
              selectedRegion={selectedRegion}
              onToggleCategory={(c) => { onToggleCategory(c); setTab('list') }}
              onClearCategories={() => { onClearCategories(); setTab('list') }}
              onRegionChange={(r) => { onRegionChange(r); setTab('list') }}
            />
          </div>
        ) : panelOpen && selectedPlace ? (
          <PlaceDetail place={selectedPlace} onClose={onPanelClose} />
        ) : (
          <PlaceList places={places} onSelect={onPlaceSelect} />
        )}
      </div>

      {/* Footer info */}
      <div className="px-5 py-3 text-center shrink-0 bg-surface-container-low">
        <p className="text-label-xs text-outline font-medium uppercase tracking-widest">
          {places.length}개 장소 발견
        </p>
      </div>
    </div>
  )
}

/* ---- Place List ---- */
function PlaceList({ places, onSelect }: { places: Place[]; onSelect: (p: Place) => void }) {
  return (
    <div className="px-5 space-y-4 pb-4">
      {places.map(place => (
        <button
          key={place.id}
          onClick={() => onSelect(place)}
          className="w-full bg-surface-container-high rounded-2xl overflow-hidden editorial-shadow text-left group transition-all hover:shadow-xl"
        >
          {place.images[0] && (
            <div className="h-36 overflow-hidden relative">
              <Image
                src={place.images[0]}
                alt={place.name}
                fill
                sizes="340px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-display font-bold text-label-lg text-on-surface">{place.name}</h3>
              <CategoryBadge category={place.category} />
            </div>
            <p className="text-on-surface-variant text-label-md line-clamp-1 mb-2">{place.address}</p>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-outline" />
              <span className="text-label-xs font-bold text-outline uppercase tracking-wider">
                {place.hours}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

/* ---- Place Detail ---- */
function PlaceDetail({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <div className="px-5 pb-4">
      <button
        onClick={onClose}
        className="text-primary font-bold text-label-md uppercase tracking-wider mb-4 hover:underline decoration-2 underline-offset-4"
      >
        ← 목록으로
      </button>

      <div className="mb-3">
        <CategoryBadge category={place.category} />
      </div>

      <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-2">
        {place.name}
      </h2>

      <p className="text-on-surface-variant text-body-sm flex items-center gap-1.5 mb-6">
        <MapPin className="w-3.5 h-3.5" />
        {place.address}
      </p>

      <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
        <div className="flex items-center gap-2.5 text-body-sm">
          <Clock className="w-4 h-4 text-outline" />
          <span className="text-on-surface-variant">{place.hours}</span>
        </div>
        {place.closedDays.length > 0 && (
          <p className="text-body-sm text-on-surface-variant pl-[26px]">
            휴무: {place.closedDays.join(', ')}
          </p>
        )}
      </div>

      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {place.tags.map(tag => (
            <TagChip key={tag} label={tag} size="md" />
          ))}
        </div>
      )}

      {place.links.instagram && (
        <a
          href={place.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary text-label-lg font-medium hover:underline decoration-2 underline-offset-4 mb-5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Instagram
        </a>
      )}

      <Link
        href={`/place/${place.id}`}
        className="signature-gradient text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 w-full text-label-lg"
      >
        상세보기
      </Link>
    </div>
  )
}
