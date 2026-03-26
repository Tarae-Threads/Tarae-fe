import { describe, it, expect } from 'vitest'
import {
  getEvents,
  getEventById,
  getEventsByType,
  getEventsByPlaceId,
  getLinkedPlace,
  getEventsByDate,
  filterEvents,
  getEventsForMonth,
  getDatesWithEvents,
} from '../utils/events'

describe('getEvents', () => {
  it('returns all events as an array', () => {
    const events = getEvents()
    expect(Array.isArray(events)).toBe(true)
    expect(events.length).toBeGreaterThan(0)
  })

  it('each event has required fields', () => {
    for (const event of getEvents()) {
      expect(event).toHaveProperty('id')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('type')
      expect(event).toHaveProperty('startDate')
      expect(event).toHaveProperty('endDate')
    }
  })

  it('each event has valid type', () => {
    const validTypes = ['tester_recruitment', 'sale', 'event_popup']
    for (const event of getEvents()) {
      expect(validTypes).toContain(event.type)
    }
  })

  it('all event ids are unique', () => {
    const ids = getEvents().map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('startDate is not after endDate', () => {
    for (const event of getEvents()) {
      expect(event.startDate <= event.endDate).toBe(true)
    }
  })
})

describe('getEventById', () => {
  it('returns an event by id', () => {
    const events = getEvents()
    const first = events[0]
    expect(getEventById(first.id)).toEqual(first)
  })

  it('returns undefined for non-existent id', () => {
    expect(getEventById('non-existent')).toBeUndefined()
  })
})

describe('getEventsByType', () => {
  it('returns only events of given type', () => {
    const result = getEventsByType('sale')
    expect(result.length).toBeGreaterThan(0)
    for (const event of result) {
      expect(event.type).toBe('sale')
    }
  })

  it('returns empty array for type with no events if none exist', () => {
    // All three types should have events in our data
    for (const type of ['tester_recruitment', 'sale', 'event_popup'] as const) {
      expect(getEventsByType(type).length).toBeGreaterThan(0)
    }
  })
})

describe('getEventsByPlaceId', () => {
  it('returns events linked to a placeId', () => {
    const result = getEventsByPlaceId('dongdaemun-jonghap-sijang')
    expect(result.length).toBeGreaterThan(0)
    for (const event of result) {
      expect(event.placeId).toBe('dongdaemun-jonghap-sijang')
    }
  })

  it('returns empty array for unlinked placeId', () => {
    expect(getEventsByPlaceId('non-existent-place')).toEqual([])
  })
})

describe('getLinkedPlace', () => {
  it('returns place when placeId exists', () => {
    const events = getEvents()
    const linked = events.find(e => e.placeId)
    if (!linked) return
    const place = getLinkedPlace(linked)
    expect(place).toBeDefined()
    expect(place!.id).toBe(linked.placeId)
  })

  it('returns undefined when no placeId', () => {
    const events = getEvents()
    const unlinked = events.find(e => !e.placeId)
    if (!unlinked) return
    expect(getLinkedPlace(unlinked)).toBeUndefined()
  })
})

describe('getEventsByDate', () => {
  it('returns events that span the given date', () => {
    const events = getEvents()
    const event = events[0]
    const result = getEventsByDate(event.startDate)
    expect(result.length).toBeGreaterThan(0)
    for (const e of result) {
      expect(e.startDate <= event.startDate).toBe(true)
      expect(e.endDate >= event.startDate).toBe(true)
    }
  })

  it('returns empty for a date with no events', () => {
    expect(getEventsByDate('2000-01-01')).toEqual([])
  })
})

describe('filterEvents', () => {
  const allEvents = getEvents()

  it('returns all events when type is "all" and no date', () => {
    expect(filterEvents(allEvents, 'all')).toEqual(allEvents)
  })

  it('filters by type', () => {
    const types = new Set(['sale'] as const)
    const result = filterEvents(allEvents, types)
    expect(result.length).toBeGreaterThan(0)
    for (const e of result) {
      expect(e.type).toBe('sale')
    }
  })

  it('filters by date', () => {
    const event = allEvents[0]
    const result = filterEvents(allEvents, 'all', event.startDate)
    expect(result.length).toBeGreaterThan(0)
    for (const e of result) {
      expect(e.startDate <= event.startDate).toBe(true)
      expect(e.endDate >= event.startDate).toBe(true)
    }
  })

  it('combines type and date filters', () => {
    const event = allEvents[0]
    const types = new Set([event.type])
    const result = filterEvents(allEvents, types, event.startDate)
    expect(result.find(e => e.id === event.id)).toBeDefined()
    for (const e of result) {
      expect(e.type).toBe(event.type)
    }
  })

  it('returns empty for impossible combination', () => {
    const result = filterEvents(allEvents, new Set(['sale'] as const), '2000-01-01')
    expect(result).toEqual([])
  })
})

describe('getEventsForMonth', () => {
  it('returns events overlapping with given month', () => {
    const result = getEventsForMonth(2026, 4)
    expect(result.length).toBeGreaterThan(0)
    for (const e of result) {
      // Event must overlap with April 2026
      expect(e.startDate <= '2026-04-30').toBe(true)
      expect(e.endDate >= '2026-04-01').toBe(true)
    }
  })

  it('returns empty for a month with no events', () => {
    expect(getEventsForMonth(2000, 1)).toEqual([])
  })
})

describe('getDatesWithEvents', () => {
  it('returns a Map with date string keys', () => {
    const map = getDatesWithEvents(2026, 4)
    expect(map).toBeInstanceOf(Map)
    for (const key of map.keys()) {
      expect(key).toMatch(/^2026-04-\d{2}$/)
    }
  })

  it('each value is a non-empty array of event types', () => {
    const map = getDatesWithEvents(2026, 4)
    for (const types of map.values()) {
      expect(types.length).toBeGreaterThan(0)
      for (const type of types) {
        expect(['tester_recruitment', 'sale', 'event_popup']).toContain(type)
      }
    }
  })

  it('types are deduplicated per date', () => {
    const map = getDatesWithEvents(2026, 4)
    for (const types of map.values()) {
      expect(new Set(types).size).toBe(types.length)
    }
  })

  it('returns empty map for a month with no events', () => {
    const map = getDatesWithEvents(2000, 1)
    expect(map.size).toBe(0)
  })
})
