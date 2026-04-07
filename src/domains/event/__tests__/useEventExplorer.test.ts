import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEventExplorer } from '../hooks/useEventExplorer'

// Mock the API
vi.mock('../queries/eventApi', () => ({
  getEvents: vi.fn().mockResolvedValue([
    { id: 1, title: 'Test Sale', eventType: 'SALE', startDate: '2026-04-01', endDate: '2026-04-07', active: true },
    { id: 2, title: 'Test Popup', eventType: 'EVENT_POPUP', startDate: '2026-04-10', endDate: '2026-04-15', active: true },
  ]),
}))

describe('useEventExplorer — month navigation', () => {
  it('initializes to current month', () => {
    const { result } = renderHook(() => useEventExplorer())
    const today = new Date()
    expect(result.current.currentYear).toBe(today.getFullYear())
    expect(result.current.currentMonth).toBe(today.getMonth() + 1)
  })

  it('nextMonth: normal month increment', () => {
    const { result } = renderHook(() => useEventExplorer())
    const initialMonth = result.current.currentMonth
    const initialYear = result.current.currentYear

    if (initialMonth < 12) {
      act(() => result.current.nextMonth())
      expect(result.current.currentMonth).toBe(initialMonth + 1)
      expect(result.current.currentYear).toBe(initialYear)
    }
  })

  it('nextMonth: December → January (year +1)', () => {
    const { result } = renderHook(() => useEventExplorer())

    // Navigate to December
    const stepsToDecember = 12 - result.current.currentMonth
    for (let i = 0; i < stepsToDecember; i++) {
      act(() => result.current.nextMonth())
    }
    expect(result.current.currentMonth).toBe(12)
    const yearAtDecember = result.current.currentYear

    // December → January
    act(() => result.current.nextMonth())
    expect(result.current.currentMonth).toBe(1)
    expect(result.current.currentYear).toBe(yearAtDecember + 1)
  })

  it('prevMonth: normal month decrement', () => {
    const { result } = renderHook(() => useEventExplorer())
    const initialMonth = result.current.currentMonth
    const initialYear = result.current.currentYear

    if (initialMonth > 1) {
      act(() => result.current.prevMonth())
      expect(result.current.currentMonth).toBe(initialMonth - 1)
      expect(result.current.currentYear).toBe(initialYear)
    }
  })

  it('prevMonth: January → December (year -1)', () => {
    const { result } = renderHook(() => useEventExplorer())

    // Navigate to January
    const stepsToJanuary = result.current.currentMonth - 1
    for (let i = 0; i < stepsToJanuary; i++) {
      act(() => result.current.prevMonth())
    }
    expect(result.current.currentMonth).toBe(1)
    const yearAtJanuary = result.current.currentYear

    // January → December
    act(() => result.current.prevMonth())
    expect(result.current.currentMonth).toBe(12)
    expect(result.current.currentYear).toBe(yearAtJanuary - 1)
  })

  it('12 consecutive nextMonth calls advance exactly 1 year', () => {
    const { result } = renderHook(() => useEventExplorer())
    const startYear = result.current.currentYear
    const startMonth = result.current.currentMonth

    for (let i = 0; i < 12; i++) {
      act(() => result.current.nextMonth())
    }

    expect(result.current.currentYear).toBe(startYear + 1)
    expect(result.current.currentMonth).toBe(startMonth)
  })

  it('12 consecutive prevMonth calls go back exactly 1 year', () => {
    const { result } = renderHook(() => useEventExplorer())
    const startYear = result.current.currentYear
    const startMonth = result.current.currentMonth

    for (let i = 0; i < 12; i++) {
      act(() => result.current.prevMonth())
    }

    expect(result.current.currentYear).toBe(startYear - 1)
    expect(result.current.currentMonth).toBe(startMonth)
  })
})

describe('useEventExplorer — goToday', () => {
  it('resets to current month and selects today', () => {
    const { result } = renderHook(() => useEventExplorer())

    // Move away from today
    act(() => result.current.nextMonth())
    act(() => result.current.nextMonth())

    // Go back to today
    act(() => result.current.goToday())

    const today = new Date()
    expect(result.current.currentYear).toBe(today.getFullYear())
    expect(result.current.currentMonth).toBe(today.getMonth() + 1)
    expect(result.current.selectedDate).not.toBeNull()
    expect(result.current.selectedDate).toMatch(
      new RegExp(`^${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-`)
    )
  })
})

describe('useEventExplorer — type toggle', () => {
  it('toggleType adds and removes a type', () => {
    const { result } = renderHook(() => useEventExplorer())

    expect(result.current.selectedTypes.size).toBe(0)

    act(() => result.current.toggleType('SALE'))
    expect(result.current.selectedTypes.has('SALE')).toBe(true)

    act(() => result.current.toggleType('SALE'))
    expect(result.current.selectedTypes.has('SALE')).toBe(false)
  })

  it('clearTypes resets all selected types', () => {
    const { result } = renderHook(() => useEventExplorer())

    act(() => result.current.toggleType('SALE'))
    act(() => result.current.toggleType('EVENT_POPUP'))
    expect(result.current.selectedTypes.size).toBe(2)

    act(() => result.current.clearTypes())
    expect(result.current.selectedTypes.size).toBe(0)
  })
})

describe('useEventExplorer — loading state', () => {
  it('starts with loading true and events empty', () => {
    const { result } = renderHook(() => useEventExplorer())
    expect(result.current.loading).toBe(true)
    expect(result.current.allEvents).toEqual([])
  })

  it('loads events from API', async () => {
    const { result } = renderHook(() => useEventExplorer())
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.allEvents.length).toBe(2)
  })
})
