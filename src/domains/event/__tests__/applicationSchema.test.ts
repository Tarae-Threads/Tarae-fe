import { describe, it, expect } from 'vitest'
import { applicationSchema } from '../schemas/applicationForm'

describe('applicationSchema', () => {
  it('validates correct data', () => {
    const result = applicationSchema.safeParse({
      nickname: '테스터',
      contact: 'test@test.com',
      experience: '3년 경력',
      reason: '관심 있어서',
      portfolio: 'https://example.com',
    })
    expect(result.success).toBe(true)
  })

  it('requires nickname', () => {
    const result = applicationSchema.safeParse({
      nickname: '',
      contact: 'test@test.com',
      experience: '경력',
      reason: '이유',
    })
    expect(result.success).toBe(false)
  })

  it('requires contact', () => {
    const result = applicationSchema.safeParse({
      nickname: '이름',
      contact: '',
      experience: '경력',
      reason: '이유',
    })
    expect(result.success).toBe(false)
  })

  it('requires experience', () => {
    const result = applicationSchema.safeParse({
      nickname: '이름',
      contact: '연락처',
      experience: '',
      reason: '이유',
    })
    expect(result.success).toBe(false)
  })

  it('requires reason', () => {
    const result = applicationSchema.safeParse({
      nickname: '이름',
      contact: '연락처',
      experience: '경력',
      reason: '',
    })
    expect(result.success).toBe(false)
  })

  it('allows optional portfolio', () => {
    const result = applicationSchema.safeParse({
      nickname: '이름',
      contact: '연락처',
      experience: '경력',
      reason: '이유',
    })
    expect(result.success).toBe(true)
  })

  it('returns Korean error messages', () => {
    const result = applicationSchema.safeParse({
      nickname: '',
      contact: '',
      experience: '',
      reason: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message)
      expect(messages).toContain('닉네임을 입력해주세요')
      expect(messages).toContain('연락처를 입력해주세요')
    }
  })
})
