'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Place, PlaceCategory } from '@/lib/types'
import CategoryBadge from '@/components/ui/CategoryBadge'
import PlaceFilter from '@/components/place/PlaceFilter'
import {
  X, Search, Clock, MapPin, ExternalLink,
} from 'lucide-react'

interface SidePanelProps {
  places: Place[]
  selectedPlace: Place | null
  panelOpen: boolean
  selectedCategory: PlaceCategory | 'all'
  selectedRegion: string
  onPlaceSelect: (place: Place) => void
  onPanelClose: () => void
  onCategoryChange: (category: PlaceCategory | 'all') => void
  onRegionChange: (region: string) => void
  onClose: () => void
}

export default function SidePanel({
  places,
  selectedPlace,
  panelOpen,
  selectedCategory,
  selectedRegion,
  onPlaceSelect,
  onPanelClose,
  onCategoryChange,
  onRegionChange,
  onClose,
}: SidePanelProps) {
  const [tab, setTab] = useState<'list' | 'filter'>('list')

  return (
    <div className="h-full flex flex-col bg-surface overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0">
        <h2 className="font-display font-extrabold tracking-tighter text-xl text-primary">
          Tarae
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-outline" />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex px-5 gap-1 shrink-0 mb-1">
        <button
          onClick={() => { setTab('list'); if (panelOpen) onPanelClose() }}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
            tab === 'list' && !panelOpen
              ? 'signature-gradient text-white'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          장소 목록
        </button>
        <button
          onClick={() => setTab('filter')}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          <input
            type="text"
            placeholder="뜨개 장소 검색..."
            className="w-full bg-surface-container-low h-10 pl-10 pr-4 rounded-xl text-sm text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {tab === 'filter' ? (
          <div className="px-5 py-3">
            <PlaceFilter
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onCategoryChange={(c) => { onCategoryChange(c); setTab('list') }}
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
        <p className="text-[10px] text-outline font-medium uppercase tracking-widest">
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
            <div className="h-36 overflow-hidden">
              <img
                src={place.images[0]}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-display font-bold text-sm text-on-surface">{place.name}</h3>
              <CategoryBadge category={place.category} />
            </div>
            <p className="text-on-surface-variant text-xs line-clamp-1 mb-2">{place.address}</p>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-outline" />
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
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
        className="text-primary font-bold text-xs uppercase tracking-wider mb-4 hover:underline decoration-2 underline-offset-4"
      >
        ← 목록으로
      </button>

      <div className="mb-3">
        <CategoryBadge category={place.category} />
      </div>

      <h2 className="font-display font-extrabold text-2xl tracking-editorial text-on-surface mb-2">
        {place.name}
      </h2>

      <p className="text-on-surface-variant text-sm flex items-center gap-1.5 mb-6">
        <MapPin className="w-3.5 h-3.5" />
        {place.address}
      </p>

      <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
        <div className="flex items-center gap-2.5 text-sm">
          <Clock className="w-4 h-4 text-outline" />
          <span className="text-on-surface-variant">{place.hours}</span>
        </div>
        {place.closedDays.length > 0 && (
          <p className="text-sm text-on-surface-variant pl-[26px]">
            휴무: {place.closedDays.join(', ')}
          </p>
        )}
      </div>

      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {place.tags.map(tag => (
            <span
              key={tag}
              className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {place.links.instagram && (
        <a
          href={place.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline decoration-2 underline-offset-4 mb-5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Instagram
        </a>
      )}

      <Link
        href={`/place/${place.id}`}
        className="signature-gradient text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 w-full text-sm"
      >
        상세보기
      </Link>
    </div>
  )
}
