'use client'

import { useRef, useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { NaverMapHandle } from '@/domains/place/components/NaverMap'
import { usePlaceExplorer } from '@/domains/place/hooks/usePlaceExplorer'
import { getPlaceById } from '@/domains/place/utils/places'
import { getEvents } from '@/domains/event/utils/events'
import MobileBottomSheet from '@/domains/place/components/MobileBottomSheet'
import PlacePanel from '@/domains/place/components/PlacePanel'
import MapControls from '@/domains/place/components/MapControls'
import PlaceSearchBar from '@/domains/place/components/PlaceSearchBar'
import TopAppBar from '@/shared/components/layout/TopAppBar'
import MainSidePanel from '@/shared/components/layout/MainSidePanel'
import PlaceSubmitForm from '@/domains/place/components/PlaceSubmitForm'
import { REGION_CENTER } from '@/domains/place/constants'
import { MapPinPlus, PanelRightOpen } from 'lucide-react'

const NaverMap = dynamic(() => import('@/domains/place/components/NaverMap'), { ssr: false })

function HomeContent() {
  const searchParams = useSearchParams()
  const initialPlaceId = searchParams.get('placeId')
  const mapRef = useRef<NaverMapHandle>(null)
  const [submitOpen, setSubmitOpen] = useState(false)

  const {
    filteredPlaces,
    selectedPlace,
    selectedCategories,
    toggleCategory,
    clearCategories,
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

  // Compute event-linked placeIds
  const eventPlaceIds = useMemo(() => {
    const ids = new Set<string>()
    for (const event of getEvents()) {
      if (event.placeId) ids.add(event.placeId)
    }
    return ids
  }, [])

  // Region filter → pan map
  useEffect(() => {
    if (selectedRegion === 'all') return
    const center = REGION_CENTER[selectedRegion]
    if (center) {
      mapRef.current?.panTo(center.lat, center.lng, center.zoom)
    }
  }, [selectedRegion])

  // Smart zoom: only zoom in if currently too far out
  const smartPanTo = useCallback((lat: number, lng: number, minZoom: number) => {
    const currentZoom = mapRef.current?.getZoom() ?? 10
    if (currentZoom <= 12) {
      mapRef.current?.panTo(lat, lng, minZoom)
    } else {
      mapRef.current?.panTo(lat, lng)
    }
  }, [])

  // Marker click → smart zoom (don't zoom out if already close)
  const handleMarkerSelect = useCallback((place: Parameters<typeof handlePlaceSelect>[0]) => {
    handlePlaceSelect(place)
    smartPanTo(place.lat, place.lng, 13)
  }, [handlePlaceSelect, smartPanTo])

  // List click → always zoom 14 (user picked from list, show it up close)
  const handleListSelect = useCallback((place: Parameters<typeof handlePlaceSelect>[0]) => {
    handlePlaceSelect(place)
    mapRef.current?.panTo(place.lat, place.lng, 14)
  }, [handlePlaceSelect])

  // Event card click → smart zoom, no panel change
  const handleEventPlaceClick = useCallback((placeId: string) => {
    const place = getPlaceById(placeId)
    if (place) {
      smartPanTo(place.lat, place.lng, 13)
    }
  }, [smartPanTo])

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
          onPlaceSelect={handleMarkerSelect}
          selectedPlaceId={initialPlaceId}
          eventPlaceIds={eventPlaceIds}
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
            selectedCategories={selectedCategories}
            selectedRegion={selectedRegion}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            onRegionChange={setSelectedRegion}
          />
        </div>

        {/* FAB — desktop */}
        <button onClick={() => setSubmitOpen(true)} aria-label="장소 추가" className="hidden md:flex absolute bottom-8 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl items-center justify-center z-20 active:scale-95 transition-transform">
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
              selectedCategories={selectedCategories}
              selectedRegion={selectedRegion}
              onToggleCategory={toggleCategory}
              onClearCategories={clearCategories}
              onRegionChange={setSelectedRegion}
            />
          </div>

          {/* Bottom Sheet */}
          {!panelOpen && (
            <MobileBottomSheet
              places={filteredPlaces}
              onPlaceSelect={handleListSelect}
              onEventPlaceClick={handleEventPlaceClick}
            />
          )}

          <PlacePanel place={selectedPlace} open={panelOpen} onClose={handlePanelClose} />

          {/* FAB */}
          <button onClick={() => setSubmitOpen(true)} aria-label="장소 추가" className="fixed bottom-32 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform">
            <MapPinPlus className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* ===== Panel toggle — desktop only ===== */}
      {!sidePanelOpen && (
        <button
          onClick={() => setSidePanelOpen(true)}
          aria-label="패널 열기"
          className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-16 bg-surface/90 backdrop-blur-xl rounded-l-xl shadow-ambient-md items-center justify-center text-primary hover:bg-surface-container transition-colors"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      )}

      {/* ===== Right: Side Panel — desktop only ===== */}
      {sidePanelOpen && (
        <div className="hidden md:block w-[400px] shrink-0 h-full border-l border-border">
          <MainSidePanel
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            panelOpen={panelOpen}
            selectedCategories={selectedCategories}
            selectedRegion={selectedRegion}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPlaceSelect={handleListSelect}
            onPanelClose={handlePanelClose}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            onRegionChange={setSelectedRegion}
            onClose={() => setSidePanelOpen(false)}
            onEventPlaceClick={handleEventPlaceClick}
          />
        </div>
      )}
      <PlaceSubmitForm open={submitOpen} onClose={() => setSubmitOpen(false)} />
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
