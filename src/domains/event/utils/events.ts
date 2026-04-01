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

export interface CalendarBar {
  id: string
  title: string
  type: EventType
  startCol: number // 0-6 column in the week row
  span: number     // how many days it spans in this row
}

/** Get event bars for each week row of the month */
export function getEventBarsForMonth(year: number, month: number): CalendarBar[][] {
  // Sort: shorter events first so they don't get cut by the bar limit
  const monthEvents = [...getEventsForMonth(year, month)].sort((a, b) => {
    const durationA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime()
    const durationB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime()
    return durationA - durationB
  })
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  // Build all cells (null for padding, day number for actual dates)
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  // Split into week rows
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  // Pad last week
  while (weeks.length > 0 && weeks[weeks.length - 1].length < 7) {
    weeks[weeks.length - 1].push(null)
  }

  const result: CalendarBar[][] = []

  for (const week of weeks) {
    const bars: CalendarBar[] = []
    const weekDates = week.map(d =>
      d ? `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}` : null
    )

    for (const event of monthEvents) {
      // Find first and last column in this week that the event covers
      let startCol = -1
      let endCol = -1
      for (let col = 0; col < 7; col++) {
        const date = weekDates[col]
        if (date && event.startDate <= date && event.endDate >= date) {
          if (startCol === -1) startCol = col
          endCol = col
        }
      }
      if (startCol !== -1) {
        bars.push({
          id: event.id,
          title: event.title,
          type: event.type,
          startCol,
          span: endCol - startCol + 1,
        })
      }
    }

    result.push(bars) // return all bars, UI handles truncation
  }

  return result
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
