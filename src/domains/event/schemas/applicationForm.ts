import { z } from 'zod'

export const applicationSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
  contact: z.string().min(1, '연락처를 입력해주세요'),
  experience: z.string().min(1, '뜨개 경험을 입력해주세요'),
  reason: z.string().min(1, '지원 이유를 입력해주세요'),
  portfolio: z.string().optional(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
