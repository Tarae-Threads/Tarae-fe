'use client'

import { useState, useMemo, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getPlaces } from '@/lib/places'
import type { Place, PlaceCategory } from '@/lib/types'
import PlaceFilter from '@/components/place/PlaceFilter'
import PlaceCard from '@/components/place/PlaceCard'
import PlacePanel from '@/components/map/PlacePanel'

const KakaoMap = dynamic(() => import('@/components/map/KakaoMap'), { ssr: false })

function HomeContent() {
  const searchParams = useSearchParams()
  const initialPlaceId = searchParams.get('placeId')

  const allPlaces = getPlaces()

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(
    initialPlaceId ? allPlaces.find(p => p.id === initialPlaceId) ?? null : null
  )
  const [panelOpen, setPanelOpen] = useState(!!initialPlaceId)

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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center gap-3 shrink-0">
        <h1 className="text-lg font-bold text-yarn-purple">타래</h1>
        <span className="text-sm text-muted-foreground">뜨개 장소 지도</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - desktop only */}
        <aside className="hidden md:flex flex-col w-80 border-r shrink-0 overflow-hidden">
          <div className="p-4 border-b">
            <PlaceFilter
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onCategoryChange={setSelectedCategory}
              onRegionChange={setSelectedRegion}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p className="text-xs text-muted-foreground px-1">
              {filteredPlaces.length}개 장소
            </p>
            {filteredPlaces.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={handlePlaceSelect}
              />
            ))}
          </div>
        </aside>

        {/* Map area */}
        <main className="flex-1 relative">
          {/* Mobile filter bar */}
          <div className="md:hidden absolute top-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-sm p-3 border-b">
            <PlaceFilter
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onCategoryChange={setSelectedCategory}
              onRegionChange={setSelectedRegion}
            />
          </div>

          <KakaoMap
            places={filteredPlaces}
            onPlaceSelect={handlePlaceSelect}
            selectedPlaceId={initialPlaceId}
          />

          <PlacePanel
            place={selectedPlace}
            open={panelOpen}
            onClose={handlePanelClose}
          />
        </main>
      </div>
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
