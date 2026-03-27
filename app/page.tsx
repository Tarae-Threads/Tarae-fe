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
import BottomNav from '@/shared/components/layout/BottomNav'
import SubmitForm from '@/shared/components/layout/SubmitForm'
import { REGION_CENTER } from '@/domains/place/constants'

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

  // Map resize on detail panel toggle
  useEffect(() => {
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 150)
    const t3 = setTimeout(() => window.dispatchEvent(new Event('resize')), 320)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [panelOpen])

  const eventPlaceIds = useMemo(() => {
    const ids = new Set<string>()
    for (const event of getEvents()) {
      if (event.placeId) ids.add(event.placeId)
    }
    return ids
  }, [])

  useEffect(() => {
    if (selectedRegion === 'all') return
    const center = REGION_CENTER[selectedRegion]
    if (center) mapRef.current?.panTo(center.lat, center.lng, center.zoom)
  }, [selectedRegion])

  const smartPanTo = useCallback((lat: number, lng: number, minZoom: number) => {
    const currentZoom = mapRef.current?.getZoom() ?? 10
    if (currentZoom <= 12) mapRef.current?.panTo(lat, lng, minZoom)
    else mapRef.current?.panTo(lat, lng)
  }, [])

  const handleMarkerSelect = useCallback((place: Parameters<typeof handlePlaceSelect>[0]) => {
    handlePlaceSelect(place)
    smartPanTo(place.lat, place.lng, 13)
  }, [handlePlaceSelect, smartPanTo])

  const handleListSelect = useCallback((place: Parameters<typeof handlePlaceSelect>[0]) => {
    handlePlaceSelect(place)
    mapRef.current?.panTo(place.lat, place.lng, 14)
  }, [handlePlaceSelect])

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

  // Mobile detail data
  const mobileDetailOpen = panelOpen || !!selectedEvent
  const mobileDetailData = selectedPlace && panelOpen
    ? { type: 'place' as const, place: selectedPlace }
    : selectedEvent
      ? { type: 'event' as const, event: selectedEvent }
      : null

  return (
    <main className="h-screen w-full overflow-hidden bg-surface-container-lowest flex">
      {/* Desktop: NavBar + BasePanel + DetailPanel */}
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
        onEventSelect={handleEventSelect}
      />

      {/* Desktop Detail Panel */}
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
            {detailData && <DetailPanel data={detailData} onClose={handleDetailClose} />}
          </div>
        )
      })()}

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        <NaverMap
          ref={mapRef}
          places={filteredPlaces}
          onPlaceSelect={handleMarkerSelect}
          selectedPlaceId={initialPlaceId}
          eventPlaceIds={eventPlaceIds}
        />
        <MapControls
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onLocate={() => mapRef.current?.locate()}
        />

        {/* Mobile UI */}
        <div className="md:hidden">
          <div className="absolute top-4 left-4 right-4 z-20">
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

          {!mobileDetailOpen && (
            <MobileBottomSheet
              activeTab={activeTab}
              places={filteredPlaces}
              onPlaceSelect={handleListSelect}
              onEventSelect={handleEventSelect}
            />
          )}

          <PlacePanel data={mobileDetailData} open={mobileDetailOpen} onClose={handleDetailClose} />
        </div>
      </div>

      {/* Mobile BottomNav */}
      <div className="md:hidden">
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); handleDetailClose() }}
          onSubmit={() => setSubmitOpen(true)}
        />
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
