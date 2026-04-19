import { describe, it, expect } from 'vitest'
import { inquiryCreateSchema } from '../schemas/inquiryForm'

describe('inquiryCreateSchema', () => {
  const valid = {
    title: '장소 정보 오류 문의',
    body: '주소가 실제와 다릅니다.',
    email: 'user@example.com',
  }

  it('accepts a valid inquiry', () => {
    expect(inquiryCreateSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects empty title with Korean message', () => {
    const result = inquiryCreateSchema.safeParse({ ...valid, title: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('제목을 입력해주세요')
    }
  })

  it('rejects title over 255 chars', () => {
    const result = inquiryCreateSchema.safeParse({ ...valid, title: 'a'.repeat(256) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('제목은 255자 이하로 입력해주세요')
    }
  })

  it('rejects empty body', () => {
    const result = inquiryCreateSchema.safeParse({ ...valid, body: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('내용을 입력해주세요')
    }
  })

  it('rejects invalid email format', () => {
    const result = inquiryCreateSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('올바른 이메일을 입력해주세요')
    }
  })

  it('rejects email over 100 chars', () => {
    const longLocal = 'a'.repeat(95)
    const result = inquiryCreateSchema.safeParse({
      ...valid,
      email: `${longLocal}@a.com`,
    })
    expect(result.success).toBe(false)
  })
})
