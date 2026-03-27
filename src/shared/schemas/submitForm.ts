import { z } from 'zod'

export const placeSubmissionSchema = z.object({
  name: z.string().min(1, '장소명을 입력해주세요'),
  address: z.string().min(1, '주소를 검색해주세요'),
  addressDetail: z.string().optional(),
  description: z.string().optional(),
})

export type PlaceSubmissionData = z.infer<typeof placeSubmissionSchema>

export const eventSubmissionSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  startDate: z.string().min(1, '시작일을 선택해주세요'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
})

export type EventSubmissionData = z.infer<typeof eventSubmissionSchema>
