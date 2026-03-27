import { describe, it, expect } from 'vitest'
import { getTodayString, formatDateRange } from '../utils/date'

describe('getTodayString', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const result = getTodayString()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('matches today date', () => {
    const now = new Date()
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(getTodayString()).toBe(expected)
  })

  it('pads single-digit month and day', () => {
    const result = getTodayString()
    const [, month, day] = result.split('-')
    expect(month.length).toBe(2)
    expect(day.length).toBe(2)
  })
})

describe('formatDateRange', () => {
  it('returns single date when start equals end', () => {
    expect(formatDateRange('2026-04-05', '2026-04-05')).toBe('04.05')
  })

  it('returns range with em-dash when dates differ', () => {
    expect(formatDateRange('2026-04-01', '2026-04-15')).toBe('04.01 — 04.15')
  })

  it('strips year prefix and replaces dash with dot', () => {
    const result = formatDateRange('2026-03-28', '2026-04-05')
    expect(result).toBe('03.28 — 04.05')
    expect(result).not.toContain('2026')
  })

  it('handles month boundary', () => {
    expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('12.30 — 01.02')
  })
})
