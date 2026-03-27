import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApplicationSubmit } from '../hooks/useApplicationSubmit'
import { STORAGE_KEYS } from '../constants'

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'mock-uuid-1234',
})

describe('useApplicationSubmit', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with submitted = false', () => {
    const { result } = renderHook(() => useApplicationSubmit('recruit-1'))
    expect(result.current.submitted).toBe(false)
  })

  it('sets submitted to true after submit', () => {
    const { result } = renderHook(() => useApplicationSubmit('recruit-1'))

    act(() => {
      result.current.submit({
        nickname: 'tester',
        contact: 'test@test.com',
        experience: '3 years',
        reason: 'interested',
      })
    })

    expect(result.current.submitted).toBe(true)
  })

  it('saves application to localStorage', () => {
    const { result } = renderHook(() => useApplicationSubmit('recruit-1'))

    act(() => {
      result.current.submit({
        nickname: 'tester',
        contact: 'test@test.com',
        experience: '3 years',
        reason: 'interested',
        portfolio: 'https://example.com',
      })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTER_APPLICATIONS) || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('mock-uuid-1234')
    expect(stored[0].recruitmentId).toBe('recruit-1')
    expect(stored[0].nickname).toBe('tester')
    expect(stored[0].status).toBe('submitted')
    expect(stored[0].portfolio).toBe('https://example.com')
    expect(stored[0].appliedAt).toBeDefined()
  })

  it('appends to existing applications', () => {
    localStorage.setItem(STORAGE_KEYS.TESTER_APPLICATIONS, JSON.stringify([{ id: 'existing' }]))

    const { result } = renderHook(() => useApplicationSubmit('recruit-2'))

    act(() => {
      result.current.submit({
        nickname: 'tester2',
        contact: 'dm',
        experience: '1 year',
        reason: 'fun',
      })
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTER_APPLICATIONS) || '[]')
    expect(stored).toHaveLength(2)
    expect(stored[0].id).toBe('existing')
    expect(stored[1].recruitmentId).toBe('recruit-2')
  })
})
