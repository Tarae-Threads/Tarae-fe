import eventsData from '../data/events.json'
import type { AnyEvent, EventType } from '../types'
import { getPlaceById } from '@/domains/place/utils/places'
import type { Place } from '@/domains/place/types'

const events: AnyEvent[] = eventsData as AnyEvent[]

export function getEvents(): AnyEvent[] {
  return events
}

export function getEventById(id: string): AnyEvent | undefined {
  return events.find(e => e.id === id)
}

export function getEventsByType(type: EventType): AnyEvent[] {
  return events.filter(e => e.type === type)
}

export function getEventsByPlaceId(placeId: string): AnyEvent[] {
  return events.filter(e => e.placeId === placeId)
}

export function getLinkedPlace(event: AnyEvent): Place | undefined {
  return event.placeId ? getPlaceById(event.placeId) : undefined
}

export function getEventsByDate(date: string): AnyEvent[] {
  return events.filter(e => e.startDate <= date && e.endDate >= date)
}

export function filterEvents(
  allEvents: AnyEvent[],
  types: Set<EventType> | 'all',
  date?: string,
): AnyEvent[] {
  return allEvents.filter(event => {
    if (types !== 'all' && types.size > 0 && !types.has(event.type)) return false
    if (date && !(event.startDate <= date && event.endDate >= date)) return false
    return true
  })
}

export function getEventsForMonth(year: number, month: number): AnyEvent[] {
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`
  return events.filter(e => e.startDate <= lastDay && e.endDate >= firstDay)
}

export function getDatesWithEvents(year: number, month: number): Map<string, EventType[]> {
  const monthEvents = getEventsForMonth(year, month)
  const dateMap = new Map<string, EventType[]>()
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const types = monthEvents
      .filter(e => e.startDate <= dateStr && e.endDate >= dateStr)
      .map(e => e.type)
    if (types.length > 0) {
      dateMap.set(dateStr, [...new Set(types)])
    }
  }
  return dateMap
}
