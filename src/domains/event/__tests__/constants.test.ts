import { describe, it, expect } from 'vitest'
import {
  EVENT_TYPE_LABEL,
  EVENT_TYPE_COLOR,
  EVENT_TYPE_BG,
} from '../constants'
import type { EventType } from '../types'

const ALL_EVENT_TYPES: EventType[] = ['TESTER_RECRUIT', 'SALE', 'EVENT_POPUP']

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
