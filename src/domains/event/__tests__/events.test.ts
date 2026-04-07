import { describe, it, expect } from 'vitest'
import {
  filterEvents,
  getEventsForMonth,
  getDatesWithEvents,
  getEventBarsForMonth,
} from '../utils/events'
import type { Event, EventType } from '../types'

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Sale Event',
    eventType: 'SALE',
    startDate: '2026-04-01',
    endDate: '2026-04-07',
    active: true,
  },
  {
    id: 2,
    title: 'Popup Event',
    eventType: 'EVENT_POPUP',
    startDate: '2026-04-10',
    endDate: '2026-04-15',
    active: true,
  },
  {
    id: 3,
    title: 'Tester Recruit',
    eventType: 'TESTER_RECRUIT',
    startDate: '2026-04-05',
    endDate: '2026-04-30',
    active: true,
  },
] as Event[]

describe('filterEvents', () => {
  it('returns all events when type is "all" and no date', () => {
    expect(filterEvents(mockEvents, 'all')).toEqual(mockEvents)
  })

  it('filters by type', () => {
    const types = new Set<EventType>(['SALE'])
    const result = filterEvents(mockEvents, types)
    expect(result.length).toBe(1)
    expect(result[0].eventType).toBe('SALE')
  })

  it('filters by date', () => {
    const result = filterEvents(mockEvents, 'all', '2026-04-05')
    expect(result.length).toBe(2)
  })

  it('combines type and date filters', () => {
    const types = new Set<EventType>(['SALE'])
    const result = filterEvents(mockEvents, types, '2026-04-05')
    expect(result.length).toBe(1)
    expect(result[0].eventType).toBe('SALE')
  })

  it('returns empty for impossible combination', () => {
    const result = filterEvents(mockEvents, new Set<EventType>(['SALE']), '2000-01-01')
    expect(result).toEqual([])
  })
})

describe('getEventsForMonth', () => {
  it('returns events overlapping with given month', () => {
    const result = getEventsForMonth(mockEvents, 2026, 4)
    expect(result.length).toBe(3)
  })

  it('returns empty for a month with no events', () => {
    expect(getEventsForMonth(mockEvents, 2000, 1)).toEqual([])
  })
})

describe('getDatesWithEvents', () => {
  it('returns a Map with date string keys', () => {
    const map = getDatesWithEvents(mockEvents, 2026, 4)
    expect(map).toBeInstanceOf(Map)
    for (const key of map.keys()) {
      expect(key).toMatch(/^2026-04-\d{2}$/)
    }
  })

  it('each value is a non-empty array of event types', () => {
    const map = getDatesWithEvents(mockEvents, 2026, 4)
    for (const types of map.values()) {
      expect(types.length).toBeGreaterThan(0)
    }
  })

  it('types are deduplicated per date', () => {
    const map = getDatesWithEvents(mockEvents, 2026, 4)
    for (const types of map.values()) {
      expect(new Set(types).size).toBe(types.length)
    }
  })

  it('returns empty map for a month with no events', () => {
    const map = getDatesWithEvents(mockEvents, 2000, 1)
    expect(map.size).toBe(0)
  })
})

describe('getEventBarsForMonth', () => {
  it('returns an array of week rows', () => {
    const bars = getEventBarsForMonth(mockEvents, 2026, 4)
    expect(Array.isArray(bars)).toBe(true)
    expect(bars.length).toBeGreaterThan(0)
  })

  it('each bar has required fields', () => {
    const bars = getEventBarsForMonth(mockEvents, 2026, 4)
    for (const week of bars) {
      for (const bar of week) {
        expect(bar).toHaveProperty('id')
        expect(bar).toHaveProperty('title')
        expect(bar).toHaveProperty('type')
        expect(bar).toHaveProperty('startCol')
        expect(bar).toHaveProperty('span')
      }
    }
  })
})
