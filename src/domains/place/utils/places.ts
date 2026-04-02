import placesData from '../data/places.json'
import type { Place, PlaceCategory } from '../types'
import { placesArraySchema } from '../schemas'

const parsed = placesArraySchema.safeParse(placesData)
if (!parsed.success) {
  console.error('places.json validation failed:', parsed.error.issues)
}
const places: Place[] = parsed.success ? parsed.data : (placesData as Place[])

export function getPlaces(): Place[] {
  return places
}

export function getPlaceById(id: string): Place | undefined {
  return places.find(p => p.id === id)
}

export function getPlacesByRegion(region: string): Place[] {
  return places.filter(p => p.region === region)
}

export function getPlacesByCategory(category: PlaceCategory): Place[] {
  return places.filter(p => p.category === category)
}

export function getRegions(): string[] {
  return [...new Set(places.map(p => p.region))].sort()
}

export function filterPlaces(
  allPlaces: Place[],
  categories: Set<PlaceCategory> | 'all',
  region: string,
  query: string = '',
): Place[] {
  const q = query.trim().toLowerCase()
  const qNoSpace = q.replace(/\s+/g, '')
  const hasCategories = categories !== 'all' && categories.size > 0

  return allPlaces.filter(place => {
    if (hasCategories && !(categories as Set<PlaceCategory>).has(place.category)) return false
    if (region !== 'all' && place.region !== region) return false
    if (q) {
      const haystack = [
        place.name,
        place.address,
        place.district,
        place.note,
        ...place.tags,
        ...place.brands.yarn,
        ...place.brands.needle,
        ...place.brands.notions,
      ].join(' ').toLowerCase()
      if (!haystack.includes(q) && !haystack.replace(/\s+/g, '').includes(qNoSpace)) return false
    }
    return true
  })
}
