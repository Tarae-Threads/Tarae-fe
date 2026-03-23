import placesData from '@/data/places.json'
import type { Place, PlaceCategory } from './types'

export function getPlaces(): Place[] {
  return placesData as Place[]
}

export function getPlaceById(id: string): Place | undefined {
  return (placesData as Place[]).find(p => p.id === id)
}

export function getPlacesByRegion(region: string): Place[] {
  return (placesData as Place[]).filter(p => p.region === region)
}

export function getPlacesByCategory(category: PlaceCategory): Place[] {
  return (placesData as Place[]).filter(p => p.category === category)
}

export function getRegions(): string[] {
  return [...new Set((placesData as Place[]).map(p => p.region))].sort()
}
