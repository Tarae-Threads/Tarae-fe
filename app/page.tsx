'use client'

import { useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { NaverMapHandle } from '@/domains/place/components/NaverMap'
import { usePlaceExplorer } from '@/domains/place/hooks/usePlaceExplorer'
import MobileBottomSheet from '@/domains/place/components/MobileBottomSheet'
import PlacePanel from '@/domains/place/components/PlacePanel'
import MapControls from '@/domains/place/components/MapControls'
import PlaceSearchBar from '@/domains/place/components/PlaceSearchBar'
import TopAppBar from '@/shared/components/layout/TopAppBar'
import BottomNav from '@/shared/components/layout/BottomNav'
import PlaceSidePanel from '@/domains/place/components/PlaceSidePanel'
import { MapPinPlus } from 'lucide-react'

const NaverMap = dynamic(() => import('@/domains/place/components/NaverMap'), { ssr: false })

function HomeContent() {
  const searchParams = useSearchParams()
  const initialPlaceId = searchParams.get('placeId')
  const mapRef = useRef<NaverMapHandle>(null)

  const {
    filteredPlaces,
    selectedPlace,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    searchQuery,
    setSearchQuery,
    panelOpen,
    filterOpen,
    sidePanelOpen,
    setSidePanelOpen,
    handlePlaceSelect,
    handlePanelClose,
    toggleFilter,
  } = usePlaceExplorer(initialPlaceId)

  return (
    <main className="h-screen w-full overflow-hidden bg-surface-container-lowest flex">
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
        <div className="hidden md:block absolute top-6 left-6 z-20 w-[420px]">
          <PlaceSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterOpen={filterOpen}
            onToggleFilter={toggleFilter}
            selectedCategory={selectedCategory}
            selectedRegion={selectedRegion}
            onCategoryChange={setSelectedCategory}
            onRegionChange={setSelectedRegion}
          />
        </div>

        {/* FAB — desktop */}
        <button aria-label="장소 추가" className="hidden md:flex absolute bottom-8 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl items-center justify-center z-20 active:scale-95 transition-transform">
          <MapPinPlus className="w-7 h-7" />
        </button>

        {/* ===== Mobile-only UI ===== */}
        <div className="md:hidden">
          {/* Floating Search */}
          <div className="absolute top-24 left-6 right-20 z-20">
            <PlaceSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterOpen={filterOpen}
              onToggleFilter={toggleFilter}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onCategoryChange={setSelectedCategory}
              onRegionChange={setSelectedRegion}
            />
          </div>

          {/* Bottom Sheet */}
          {!panelOpen && (
            <MobileBottomSheet places={filteredPlaces} onPlaceSelect={handlePlaceSelect} />
          )}

          <PlacePanel place={selectedPlace} open={panelOpen} onClose={handlePanelClose} />

          {/* FAB */}
          <button aria-label="장소 추가" className="fixed bottom-32 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform">
            <MapPinPlus className="w-7 h-7" />
          </button>

          <BottomNav />
        </div>
      </div>

      {/* ===== Right: Side Panel — desktop only ===== */}
      {sidePanelOpen && (
        <div className="hidden md:block w-[380px] shrink-0 h-full border-l border-border">
          <PlaceSidePanel
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            panelOpen={panelOpen}
            selectedCategory={selectedCategory}
            selectedRegion={selectedRegion}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPlaceSelect={handlePlaceSelect}
            onPanelClose={handlePanelClose}
            onCategoryChange={setSelectedCategory}
            onRegionChange={setSelectedRegion}
            onClose={() => setSidePanelOpen(false)}
          />
        </div>
      )}
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}
