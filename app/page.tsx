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
import SubmitForm from '@/shared/components/layout/SubmitForm'
import { REGION_CENTER } from '@/domains/place/constants'
import { Plus, PanelRightOpen } from 'lucide-react'

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

  // Trigger map resize during and after side panel transition
  useEffect(() => {
    // Resize during transition for smooth map adjustment
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 150)
    // Resize after transition completes (300ms duration)
    const t3 = setTimeout(() => window.dispatchEvent(new Event('resize')), 320)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [sidePanelOpen])

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
        <button onClick={() => setSubmitOpen(true)} aria-label="제보하기" className="hidden md:flex absolute bottom-8 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl items-center justify-center z-20 active:scale-95 transition-transform">
          <Plus className="w-7 h-7" />
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
          <button onClick={() => setSubmitOpen(true)} aria-label="제보하기" className="fixed bottom-32 right-6 w-16 h-16 signature-gradient text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform">
            <Plus className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* ===== Panel toggle — desktop only ===== */}
      <button
        onClick={() => setSidePanelOpen(true)}
        aria-label="패널 열기"
        className={`hidden md:flex fixed right-0 top-6 z-20 w-8 h-16 bg-surface/90 backdrop-blur-xl rounded-l-xl shadow-ambient-md items-center justify-center text-primary hover:bg-surface-container transition-all duration-300 ${
          sidePanelOpen ? 'opacity-0 pointer-events-none translate-x-2' : 'opacity-100 translate-x-0'
        }`}
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>

      {/* ===== Right: Side Panel — desktop only ===== */}
      <div className={`hidden md:block shrink-0 h-full border-l border-border transition-all duration-300 ease-in-out overflow-hidden ${
        sidePanelOpen ? 'w-[400px]' : 'w-0 border-l-0'
      }`}>
        <div className="w-[400px] h-full">
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
      </div>
      <SubmitForm open={submitOpen} onClose={() => setSubmitOpen(false)} />
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
