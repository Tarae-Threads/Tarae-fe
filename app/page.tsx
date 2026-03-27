'use client'

import { useRef, useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { NaverMapHandle } from '@/domains/place/components/NaverMap'
import { usePlaceExplorer } from '@/domains/place/hooks/usePlaceExplorer'
import { getPlaceById } from '@/domains/place/utils/places'
import { getEvents, getEventById } from '@/domains/event/utils/events'
import type { AnyEvent } from '@/domains/event/types'
import MobileBottomSheet from '@/domains/place/components/MobileBottomSheet'
import PlacePanel from '@/domains/place/components/PlacePanel'
import MapControls from '@/domains/place/components/MapControls'
import PlaceSearchBar from '@/domains/place/components/PlaceSearchBar'
import NavBar from '@/shared/components/layout/NavBar'
import type { NavTab } from '@/shared/components/layout/NavBar'
import BasePanel from '@/shared/components/layout/BasePanel'
import DetailPanel from '@/shared/components/layout/DetailPanel'
import SubmitForm from '@/shared/components/layout/SubmitForm'
import { REGION_CENTER } from '@/domains/place/constants'
import { Plus } from 'lucide-react'

const NaverMap = dynamic(() => import('@/domains/place/components/NaverMap'), { ssr: false })

function HomeContent() {
  const searchParams = useSearchParams()
  const initialPlaceId = searchParams.get('placeId')
  const mapRef = useRef<NaverMapHandle>(null)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<NavTab>('places')
  const [selectedEvent, setSelectedEvent] = useState<AnyEvent | null>(null)

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
    handlePlaceSelect,
    handlePanelClose,
    toggleFilter,
  } = usePlaceExplorer(initialPlaceId)

  // Trigger map resize when detail panel toggles
  useEffect(() => {
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 150)
    const t3 = setTimeout(() => window.dispatchEvent(new Event('resize')), 320)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [panelOpen])

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

  // Marker click → smart zoom
  const handleMarkerSelect = useCallback((place: Parameters<typeof handlePlaceSelect>[0]) => {
    handlePlaceSelect(place)
    smartPanTo(place.lat, place.lng, 13)
  }, [handlePlaceSelect, smartPanTo])

  // List click → always zoom 14
  const handleListSelect = useCallback((place: Parameters<typeof handlePlaceSelect>[0]) => {
    handlePlaceSelect(place)
    mapRef.current?.panTo(place.lat, place.lng, 14)
  }, [handlePlaceSelect])

  // Event card click → open detail panel + smart zoom
  const handleEventSelect = useCallback((eventId: string) => {
    const event = getEventById(eventId)
    if (event) {
      setSelectedEvent(event)
      if (event.placeId) {
        const place = getPlaceById(event.placeId)
        if (place) smartPanTo(place.lat, place.lng, 13)
      }
    }
  }, [smartPanTo])

  const handleDetailClose = useCallback(() => {
    handlePanelClose()
    setSelectedEvent(null)
  }, [handlePanelClose])

  // Event place link click → just pan map
  const handleEventPlaceClick = useCallback((placeId: string) => {
    const place = getPlaceById(placeId)
    if (place) {
      smartPanTo(place.lat, place.lng, 13)
    }
  }, [smartPanTo])

  return (
    <main className="h-screen w-full overflow-hidden bg-surface-container-lowest flex">
      {/* ===== Desktop: NavBar + BasePanel + DetailPanel ===== */}
      <NavBar
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); handleDetailClose() }}
        onSubmit={() => setSubmitOpen(true)}
      />

      <BasePanel
        activeTab={activeTab}
        places={filteredPlaces}
        selectedCategories={selectedCategories}
        selectedRegion={selectedRegion}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPlaceSelect={handleListSelect}
        onToggleCategory={toggleCategory}
        onClearCategories={clearCategories}
        onRegionChange={setSelectedRegion}
        onEventPlaceClick={handleEventPlaceClick}
        onEventSelect={handleEventSelect}
      />

      {/* Detail Panel — slides in when place or event selected */}
      {(() => {
        const detailData = selectedPlace && panelOpen
          ? { type: 'place' as const, place: selectedPlace }
          : selectedEvent
            ? { type: 'event' as const, event: selectedEvent }
            : null
        return (
          <div className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            detailData ? 'w-[380px]' : 'w-0'
          }`}>
            {detailData && (
              <DetailPanel data={detailData} onClose={handleDetailClose} />
            )}
          </div>
        )
      })()}

      {/* ===== Map Area ===== */}
      <div className="flex-1 relative h-full">
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

        {/* ===== Mobile-only UI ===== */}
        <div className="md:hidden">
          {/* Floating Search */}
          <div className="absolute top-6 left-4 right-4 z-20">
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
          <button onClick={() => setSubmitOpen(true)} aria-label="제보하기" className="fixed bottom-32 right-6 w-14 h-14 signature-gradient text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
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
