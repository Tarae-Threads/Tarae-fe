import { describe, it, expect } from 'vitest'
import {
  getPlaces,
  getPlaceById,
  getPlacesByRegion,
  getPlacesByCategory,
  getRegions,
  filterPlaces,
} from '../utils/places'

describe('getPlaces', () => {
  it('returns all places as an array', () => {
    const places = getPlaces()
    expect(Array.isArray(places)).toBe(true)
    expect(places.length).toBeGreaterThan(0)
  })

  it('each place has required fields', () => {
    const places = getPlaces()
    for (const place of places) {
      expect(place).toHaveProperty('id')
      expect(place).toHaveProperty('name')
      expect(place).toHaveProperty('category')
      expect(place).toHaveProperty('lat')
      expect(place).toHaveProperty('lng')
      expect(place).toHaveProperty('address')
    }
  })

  it('each place has valid category', () => {
    const validCategories = ['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply']
    const places = getPlaces()
    for (const place of places) {
      expect(validCategories).toContain(place.category)
    }
  })

  it('each place has valid status', () => {
    const validStatuses = ['open', 'relocated', 'closed', 'unverified']
    const places = getPlaces()
    for (const place of places) {
      expect(validStatuses).toContain(place.status)
    }
  })

  it('each place has valid coordinates', () => {
    const places = getPlaces()
    for (const place of places) {
      // Korean latitude range: ~33-39, longitude range: ~124-132
      expect(place.lat).toBeGreaterThan(33)
      expect(place.lat).toBeLessThan(39)
      expect(place.lng).toBeGreaterThan(124)
      expect(place.lng).toBeLessThan(132)
    }
  })

  it('all place ids are unique', () => {
    const places = getPlaces()
    const ids = places.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getPlaceById', () => {
  it('returns a place by id', () => {
    const places = getPlaces()
    const first = places[0]
    const found = getPlaceById(first.id)
    expect(found).toEqual(first)
  })

  it('returns undefined for non-existent id', () => {
    expect(getPlaceById('non-existent-id')).toBeUndefined()
  })
})

describe('getPlacesByRegion', () => {
  it('returns only places in the given region', () => {
    const places = getPlaces()
    const region = places[0].region
    const result = getPlacesByRegion(region)
    expect(result.length).toBeGreaterThan(0)
    for (const place of result) {
      expect(place.region).toBe(region)
    }
  })

  it('returns empty array for non-existent region', () => {
    expect(getPlacesByRegion('존재하지않는지역')).toEqual([])
  })
})

describe('getPlacesByCategory', () => {
  it('returns only places with the given category', () => {
    const result = getPlacesByCategory('yarn_store')
    expect(result.length).toBeGreaterThan(0)
    for (const place of result) {
      expect(place.category).toBe('yarn_store')
    }
  })
})

describe('getRegions', () => {
  it('returns unique sorted region names', () => {
    const regions = getRegions()
    expect(regions.length).toBeGreaterThan(0)
    const sorted = [...regions].sort()
    expect(regions).toEqual(sorted)
    expect(new Set(regions).size).toBe(regions.length)
  })
})

describe('filterPlaces', () => {
  const allPlaces = getPlaces()

  it('returns all places when both filters are "all"', () => {
    const result = filterPlaces(allPlaces, 'all', 'all', '')
    expect(result).toEqual(allPlaces)
  })

  it('filters by category only', () => {
    const result = filterPlaces(allPlaces, new Set(['studio'] as const), 'all')
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(allPlaces.length)
    for (const place of result) {
      expect(place.category).toBe('studio')
    }
  })

  it('filters by region only', () => {
    const region = allPlaces[0].region
    const result = filterPlaces(allPlaces, 'all', region, '')
    expect(result.length).toBeGreaterThan(0)
    for (const place of result) {
      expect(place.region).toBe(region)
    }
  })

  it('filters by both category and region', () => {
    const region = allPlaces[0].region
    const category = allPlaces[0].category
    const result = filterPlaces(allPlaces, new Set([category]), region)
    for (const place of result) {
      expect(place.category).toBe(category)
      expect(place.region).toBe(region)
    }
  })

  it('returns empty array when no match', () => {
    const result = filterPlaces(allPlaces, new Set(['dye_shop'] as const), '존재하지않는지역')
    expect(result).toEqual([])
  })

  it('filters by search query on name', () => {
    const name = allPlaces[0].name
    const result = filterPlaces(allPlaces, 'all', 'all', name)
    expect(result.length).toBeGreaterThan(0)
    for (const place of result) {
      const haystack = [place.name, place.address, place.district, place.note, ...place.tags, ...place.brands].join(' ').toLowerCase()
      expect(haystack).toContain(name.toLowerCase())
    }
  })

  it('filters by search query on tag', () => {
    const placeWithTags = allPlaces.find(p => p.tags.length > 0)
    if (!placeWithTags) return
    const tag = placeWithTags.tags[0]
    const result = filterPlaces(allPlaces, 'all', 'all', tag)
    expect(result.length).toBeGreaterThan(0)
  })

  it('search query is case-insensitive and trims whitespace', () => {
    const name = allPlaces[0].name
    const result = filterPlaces(allPlaces, 'all', 'all', `  ${name}  `)
    expect(result.length).toBeGreaterThan(0)
  })

  it('combines search query with category and region filters', () => {
    const place = allPlaces[0]
    const result = filterPlaces(allPlaces, new Set([place.category]), place.region, place.name)
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result.find(p => p.id === place.id)).toBeDefined()
  })

  it('matches ignoring spaces in query and target', () => {
    // Find a place whose name contains a space
    const placeWithSpace = allPlaces.find(p => p.name.includes(' '))
    if (!placeWithSpace) return
    const queryNoSpace = placeWithSpace.name.replace(/\s+/g, '')
    const result = filterPlaces(allPlaces, 'all', 'all', queryNoSpace)
    expect(result.find(p => p.id === placeWithSpace.id)).toBeDefined()
  })

  it('returns no results for nonsense query', () => {
    const result = filterPlaces(allPlaces, 'all', 'all', 'zzzzxxxxxyyyyy')
    expect(result).toEqual([])
  })
})
