import { describe, it, expect } from 'vitest'
import { placeSubmissionSchema, eventSubmissionSchema } from '../schemas/submitForm'

describe('placeSubmissionSchema', () => {
  it('validates correct data', () => {
    const result = placeSubmissionSchema.safeParse({
      name: '테스트 장소',
      address: '서울시 강남구',
      addressDetail: '3층',
      description: '설명',
    })
    expect(result.success).toBe(true)
  })

  it('requires name', () => {
    const result = placeSubmissionSchema.safeParse({
      name: '',
      address: '서울시 강남구',
    })
    expect(result.success).toBe(false)
  })

  it('requires address', () => {
    const result = placeSubmissionSchema.safeParse({
      name: '장소명',
      address: '',
    })
    expect(result.success).toBe(false)
  })

  it('allows optional fields', () => {
    const result = placeSubmissionSchema.safeParse({
      name: '장소명',
      address: '서울시',
    })
    expect(result.success).toBe(true)
  })
})

describe('eventSubmissionSchema', () => {
  it('validates correct data', () => {
    const result = eventSubmissionSchema.safeParse({
      title: '이벤트 제목',
      startDate: '2026-04-01',
      endDate: '2026-04-05',
      location: '장소',
      description: '설명',
    })
    expect(result.success).toBe(true)
  })

  it('requires title', () => {
    const result = eventSubmissionSchema.safeParse({
      title: '',
      startDate: '2026-04-01',
    })
    expect(result.success).toBe(false)
  })

  it('requires startDate', () => {
    const result = eventSubmissionSchema.safeParse({
      title: '제목',
      startDate: '',
    })
    expect(result.success).toBe(false)
  })

  it('allows optional fields', () => {
    const result = eventSubmissionSchema.safeParse({
      title: '제목',
      startDate: '2026-04-01',
    })
    expect(result.success).toBe(true)
  })
})
