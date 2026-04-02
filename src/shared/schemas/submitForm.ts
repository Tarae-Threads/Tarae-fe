import { z } from 'zod'

// 새 장소 제보 (Place 타입 기준)
export const placeSubmissionSchema = z.object({
  name: z.string().min(1, '장소명을 입력해주세요'),
  address: z.string().min(1, '주소를 검색해주세요'),
  addressDetail: z.string().optional(),
  hours: z.string().optional(),
  closedDays: z.string().optional(),
  note: z.string().optional(),
  tags: z.string().optional(),
  brandsYarn: z.string().optional(),
  brandsNeedle: z.string().optional(),
  brandsNotions: z.string().optional(),
  linkInstagram: z.string().optional(),
  linkWebsite: z.string().optional(),
  linkNaverMap: z.string().optional(),
})

export type PlaceSubmissionData = z.infer<typeof placeSubmissionSchema>

// 기존 장소 업데이트 (모든 필드 optional, 변경분만 입력)
export const placeUpdateSchema = z.object({
  placeId: z.string().min(1, '장소를 선택해주세요'),
  hours: z.string().optional(),
  closedDays: z.string().optional(),
  note: z.string().optional(),
  tags: z.string().optional(),
  brandsYarn: z.string().optional(),
  brandsNeedle: z.string().optional(),
  brandsNotions: z.string().optional(),
  linkInstagram: z.string().optional(),
  linkWebsite: z.string().optional(),
  linkNaverMap: z.string().optional(),
})

export type PlaceUpdateData = z.infer<typeof placeUpdateSchema>

// 일정 제보
export const eventSubmissionSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
})

export type EventSubmissionData = z.infer<typeof eventSubmissionSchema>
