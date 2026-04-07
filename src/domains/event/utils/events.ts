import type { Event, EventType } from '../types'

const EVENT_TYPE_ORDER: Record<EventType, number> = {
  SALE: 0,
  EVENT_POPUP: 1,
  TESTER_RECRUIT: 2,
}

export function filterEvents(
  allEvents: Event[],
  types: Set<EventType> | 'all',
  date?: string,
): Event[] {
  return allEvents.filter(event => {
    if (types !== 'all' && types.size > 0 && !types.has(event.eventType as EventType)) return false
    if (date) {
      const end = event.endDate ?? event.startDate
      if (!(event.startDate <= date && end >= date)) return false
    }
    return true
  })
}

export function getEventsForMonth(events: Event[], year: number, month: number): Event[] {
  const firstDay = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`
  return events.filter(e => {
    const end = e.endDate ?? e.startDate
    return e.startDate <= lastDay && end >= firstDay
  })
}

export interface CalendarBar {
  id: number
  title: string
  type: EventType
  startCol: number
  span: number
}

/** Get event bars for each week row of the month */
export function getEventBarsForMonth(events: Event[], year: number, month: number): CalendarBar[][] {
  const monthEvents = [...getEventsForMonth(events, year, month)].sort((a, b) => {
    const typeOrder = EVENT_TYPE_ORDER[a.eventType as EventType] - EVENT_TYPE_ORDER[b.eventType as EventType]
    if (typeOrder !== 0) return typeOrder
    const endA = a.endDate ?? a.startDate
    const endB = b.endDate ?? b.startDate
    const durationA = new Date(endA).getTime() - new Date(a.startDate).getTime()
    const durationB = new Date(endB).getTime() - new Date(b.startDate).getTime()
    return durationA - durationB
  })
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
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
      const eventEnd = event.endDate ?? event.startDate
      let startCol = -1
      let endCol = -1
      for (let col = 0; col < 7; col++) {
        const date = weekDates[col]
        if (date && event.startDate <= date && eventEnd >= date) {
          if (startCol === -1) startCol = col
          endCol = col
        }
      }
      if (startCol !== -1) {
        bars.push({
          id: event.id,
          title: event.title,
          type: event.eventType as EventType,
          startCol,
          span: endCol - startCol + 1,
        })
      }
    }

    result.push(bars)
  }

  return result
}

export function getDatesWithEvents(events: Event[], year: number, month: number): Map<string, EventType[]> {
  const monthEvents = getEventsForMonth(events, year, month)
  const dateMap = new Map<string, EventType[]>()
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const types = monthEvents
      .filter(e => {
        const end = e.endDate ?? e.startDate
        return e.startDate <= dateStr && end >= dateStr
      })
      .map(e => e.eventType as EventType)
    if (types.length > 0) {
      dateMap.set(dateStr, [...new Set(types)])
    }
  }
  return dateMap
}
