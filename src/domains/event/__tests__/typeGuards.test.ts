import { describe, it, expect } from 'vitest'
import { isTesterRecruitment } from '../utils/typeGuards'
import type { Event } from '../types'

const saleEvent = {
  id: 1,
  title: 'Test Sale',
  eventType: 'SALE',
  startDate: '2026-04-01',
  active: true,
} as Event

const recruitmentEvent = {
  id: 2,
  title: 'Test Recruitment',
  eventType: 'TESTER_RECRUIT',
  startDate: '2026-04-01',
  active: true,
} as Event

describe('isTesterRecruitment', () => {
  it('returns true for TESTER_RECRUIT event', () => {
    expect(isTesterRecruitment(recruitmentEvent)).toBe(true)
  })

  it('returns false for SALE event', () => {
    expect(isTesterRecruitment(saleEvent)).toBe(false)
  })

  it('returns false for EVENT_POPUP event', () => {
    expect(isTesterRecruitment({ ...saleEvent, eventType: 'EVENT_POPUP' } as Event)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isTesterRecruitment(undefined)).toBe(false)
  })

  it('returns false for null', () => {
    expect(isTesterRecruitment(null)).toBe(false)
  })
})
