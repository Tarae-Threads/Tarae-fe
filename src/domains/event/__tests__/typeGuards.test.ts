import { describe, it, expect } from 'vitest'
import { isTesterRecruitment } from '../utils/typeGuards'
import type { CalendarEvent, TesterRecruitment } from '../types'

const saleEvent: CalendarEvent = {
  id: 'sale-001',
  title: 'Test Sale',
  type: 'sale',
  description: 'A sale event',
  startDate: '2026-04-01',
  endDate: '2026-04-07',
}

const recruitmentEvent = {
  id: 'tester-001',
  title: 'Test Recruitment',
  type: 'tester_recruitment' as const,
  description: 'A recruitment',
  startDate: '2026-04-01',
  endDate: '2026-04-30',
  patternName: 'Test Pattern',
  category: '의류',
  maxParticipants: 10,
  currentParticipants: 3,
  applicationStart: '2026-03-25',
  applicationEnd: '2026-04-05',
  testPeriodStart: '2026-04-07',
  testPeriodEnd: '2026-04-30',
  conditions: 'none',
  requirements: 'none',
  contactMethod: 'DM',
  recruitmentStatus: 'open' as const,
} satisfies TesterRecruitment

describe('isTesterRecruitment', () => {
  it('returns true for tester_recruitment event', () => {
    expect(isTesterRecruitment(recruitmentEvent)).toBe(true)
  })

  it('returns false for sale event', () => {
    expect(isTesterRecruitment(saleEvent)).toBe(false)
  })

  it('returns false for event_popup event', () => {
    expect(isTesterRecruitment({ ...saleEvent, type: 'event_popup' })).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isTesterRecruitment(undefined)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isTesterRecruitment(null)).toBe(false)
  })

  it('narrows type correctly', () => {
    const event = recruitmentEvent as CalendarEvent | TesterRecruitment
    if (isTesterRecruitment(event)) {
      // TypeScript should allow access to TesterRecruitment fields
      expect(event.patternName).toBe('Test Pattern')
      expect(event.maxParticipants).toBe(10)
    }
  })
})
