'use client'

import { useState, useMemo, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getPlaces } from '@/lib/places'
import type { Place, PlaceCategory } from '@/lib/types'
import type { NaverMapHandle } from '@/components/map/NaverMap'
import PlaceFilter from '@/components/place/PlaceFilter'
import PlaceCard from '@/components/place/PlaceCard'
import PlacePanel from '@/components/map/PlacePanel'
import MapControls from '@/components/map/MapControls'
import TopAppBar from '@/components/layout/TopAppBar'
import BottomNav from '@/components/layout/BottomNav'
import MobilePanel from '@/components/layout/MobilePanel'
import { Search, MapPinPlus } from 'lucide-react'

const NaverMap = dynamic(() => import('@/components/map/NaverMap'), { ssr: false })

function HomeContent() {
  const searchParams = useSearchParams()
  const initialPlaceId = searchParams.get('placeId')

  const allPlaces = getPlaces()
  const mapRef = useRef<NaverMapHandle>(null)

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(
    initialPlaceId ? allPlaces.find(p => p.id === initialPlaceId) ?? null : null
  )
  const [panelOpen, setPanelOpen] = useState(!!initialPlaceId)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(true)

  const filteredPlaces = useMemo(() => {
    return allPlaces.filter(place => {
      if (selectedCategory !== 'all' && place.category !== selectedCategory) return false
      if (selectedRegion !== 'all' && place.region !== selectedRegion) return false
      return true
    })
  }, [allPlaces, selectedCategory, selectedRegion])

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place)
    setPanelOpen(true)
  }, [])

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false)
  }, [])

  return (
    <div className="h-screen w-full overflow-hidden bg-surface-container-lowest flex">
      {/* ===== Left: Map Area (flex-grow) ===== */}
      <div className="flex-1 relative h-full">
        {/* Top App Bar — mobile only */}
        <div className="md:hidden">
          <TopAppBar />
        </div>

        {/* Map */}
        <NaverMap
          ref={mapRef}
          places={filteredPlaces}
          onPlaceSelect={handlePlaceSelect}
          selectedPlaceId={initialPlaceId}
        />

        {/* Map Controls */}
        <MapControls
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onLocate={() => mapRef.current?.locate()}
        />

        {/* Floating Search — desktop */}
        <div className="hidden md:block absolute top-6 left-6 z-20">
          <div className="relative w-[420px]">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
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
                  onCategoryChange={(c) => { setSelectedCategory(c); setFilterOpen(false) }}
                  onRegionChange={(r) => { setSelectedRegion(r); setFilterOpen(false) }}
                />
              </div>
            )}
          </div>
        </div>

        {/* FAB — desktop */}
        <button className="hidden md:flex absolute bottom-8 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl items-center justify-center z-20 active:scale-95 transition-transform">
          <MapPinPlus className="w-7 h-7" />
        </button>

        {/* ===== Mobile-only UI ===== */}
        <div className="md:hidden">
          {/* Floating Search */}
          <div className="absolute top-24 left-6 right-20 z-20">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
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
                  onCategoryChange={(c) => { setSelectedCategory(c); setFilterOpen(false) }}
                  onRegionChange={(r) => { setSelectedRegion(r); setFilterOpen(false) }}
                />
              </div>
            )}
          </div>

          {/* Bottom Sheet */}
          {!panelOpen && (
            <div className="fixed bottom-0 left-0 w-full z-30">
              <div className="absolute -top-12 left-0 w-full flex justify-center pb-4">
                <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
              </div>
              <div className="bg-surface-container-low rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(29,27,22,0.12)] pt-8 pb-32 px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display text-xl font-extrabold tracking-tight text-on-surface">
                      뜨개 장소
                    </h2>
                    <p className="text-sm text-outline font-medium">
                      {filteredPlaces.length}개 장소
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4">
                  {filteredPlaces.slice(0, 10).map(place => (
                    <PlaceCard key={place.id} place={place} onClick={handlePlaceSelect} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <PlacePanel place={selectedPlace} open={panelOpen} onClose={handlePanelClose} />

          {/* FAB */}
          <button className="fixed bottom-32 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform">
            <MapPinPlus className="w-7 h-7" />
          </button>

          <BottomNav />
        </div>
      </div>

      {/* ===== Right: Side Panel — desktop only ===== */}
      {sidePanelOpen && (
        <div className="hidden md:block w-[380px] shrink-0 h-full border-l border-border">
          <MobilePanel
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            panelOpen={panelOpen}
            selectedCategory={selectedCategory}
            selectedRegion={selectedRegion}
            onPlaceSelect={handlePlaceSelect}
            onPanelClose={handlePanelClose}
            onCategoryChange={setSelectedCategory}
            onRegionChange={setSelectedRegion}
            onClose={() => setSidePanelOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}
