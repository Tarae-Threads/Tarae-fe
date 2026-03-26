'use client'

import { useState, useMemo, useCallback } from 'react'
import { getPlaces, filterPlaces } from '../utils/places'
import type { Place, PlaceCategory } from '../types'

export function usePlaceExplorer(initialPlaceId: string | null) {
  const allPlaces = getPlaces()

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(
    initialPlaceId ? allPlaces.find(p => p.id === initialPlaceId) ?? null : null
  )
  const [panelOpen, setPanelOpen] = useState(!!initialPlaceId)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPlaces = useMemo(
    () => filterPlaces(allPlaces, selectedCategory, selectedRegion, searchQuery),
    [allPlaces, selectedCategory, selectedRegion, searchQuery],
  )

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place)
    setPanelOpen(true)
  }, [])

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false)
  }, [])

  const toggleFilter = useCallback(() => {
    setFilterOpen(prev => !prev)
  }, [])

  return {
    // data
    filteredPlaces,
    selectedPlace,
    // filter state
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    searchQuery,
    setSearchQuery,
    // panel state
    panelOpen,
    filterOpen,
    sidePanelOpen,
    setSidePanelOpen,
    // actions
    handlePlaceSelect,
    handlePanelClose,
    toggleFilter,
  }
}
