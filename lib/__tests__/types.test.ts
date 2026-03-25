import { describe, it, expect } from 'vitest'
import {
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  CATEGORY_BG,
  REGION_ORDER,
} from '../types'
import type { PlaceCategory } from '../types'

const ALL_CATEGORIES: PlaceCategory[] = ['yarn_store', 'studio', 'cafe', 'popup']

describe('CATEGORY_LABEL', () => {
  it('has a label for every category', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(CATEGORY_LABEL[cat]).toBeDefined()
      expect(typeof CATEGORY_LABEL[cat]).toBe('string')
      expect(CATEGORY_LABEL[cat].length).toBeGreaterThan(0)
    }
  })
})

describe('CATEGORY_COLOR', () => {
  it('has a valid hex color for every category', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(CATEGORY_COLOR[cat]).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})

describe('CATEGORY_BG', () => {
  it('has a valid hex color for every category', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(CATEGORY_BG[cat]).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})

describe('REGION_ORDER', () => {
  it('contains expected regions', () => {
    expect(REGION_ORDER).toContain('서울')
    expect(REGION_ORDER).toContain('경기')
    expect(REGION_ORDER).toContain('제주')
  })

  it('has no duplicates', () => {
    expect(new Set(REGION_ORDER).size).toBe(REGION_ORDER.length)
  })
})
