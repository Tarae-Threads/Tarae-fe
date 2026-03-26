import { describe, it, expect } from 'vitest'
import {
  EVENT_TYPE_LABEL,
  EVENT_TYPE_COLOR,
  EVENT_TYPE_BG,
  RECRUITMENT_STATUS_LABEL,
  APPLICATION_STATUS_LABEL,
} from '../constants'
import type { EventType, RecruitmentStatus, ApplicationStatus } from '../types'

const ALL_EVENT_TYPES: EventType[] = ['tester_recruitment', 'sale', 'event_popup']
const ALL_RECRUITMENT_STATUSES: RecruitmentStatus[] = ['draft', 'pending', 'open', 'closed', 'in_progress', 'completed', 'hidden']
const ALL_APPLICATION_STATUSES: ApplicationStatus[] = ['submitted', 'reviewing', 'accepted', 'rejected', 'canceled']

describe('EVENT_TYPE_LABEL', () => {
  it('has a label for every event type', () => {
    for (const type of ALL_EVENT_TYPES) {
      expect(EVENT_TYPE_LABEL[type]).toBeDefined()
      expect(typeof EVENT_TYPE_LABEL[type]).toBe('string')
      expect(EVENT_TYPE_LABEL[type].length).toBeGreaterThan(0)
    }
  })
})

describe('EVENT_TYPE_COLOR', () => {
  it('has a valid hex color for every event type', () => {
    for (const type of ALL_EVENT_TYPES) {
      expect(EVENT_TYPE_COLOR[type]).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})

describe('EVENT_TYPE_BG', () => {
  it('has a valid hex color for every event type', () => {
    for (const type of ALL_EVENT_TYPES) {
      expect(EVENT_TYPE_BG[type]).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})

describe('RECRUITMENT_STATUS_LABEL', () => {
  it('has a label for every recruitment status', () => {
    for (const status of ALL_RECRUITMENT_STATUSES) {
      expect(RECRUITMENT_STATUS_LABEL[status]).toBeDefined()
      expect(typeof RECRUITMENT_STATUS_LABEL[status]).toBe('string')
    }
  })
})

describe('APPLICATION_STATUS_LABEL', () => {
  it('has a label for every application status', () => {
    for (const status of ALL_APPLICATION_STATUSES) {
      expect(APPLICATION_STATUS_LABEL[status]).toBeDefined()
      expect(typeof APPLICATION_STATUS_LABEL[status]).toBe('string')
    }
  })
})
