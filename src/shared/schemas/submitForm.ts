import { z } from 'zod'

// URL: http(s)만 허용. 빈 문자열은 optional로 간주.
const urlField = z
  .string()
  .trim()
  .max(500, '500자 이하로 입력해주세요')
  .refine(
    (v) => !v || /^https?:\/\/.+/i.test(v),
    'http:// 또는 https://로 시작하는 URL만 입력 가능해요',
  )
  .optional()

const shortText = (max: number, label = '내용') =>
  z.string().max(max, `${label}은 ${max}자 이하로 입력해주세요`).optional()

// 새 장소 제보 (Place 타입 기준)
export const placeSubmissionSchema = z.object({
  name: z
    .string()
    .min(1, '장소명을 입력해주세요')
    .max(100, '장소명은 100자 이하로 입력해주세요'),
  address: z
    .string()
    .min(1, '주소를 검색해주세요')
    .max(255, '주소는 255자 이하로 입력해주세요'),
  addressDetail: shortText(100, '상세주소'),
  hours: shortText(200, '영업시간'),
  closedDays: shortText(200, '휴무일'),
  note: shortText(500, '참고사항'),
  tags: shortText(500, '태그'),
  brandsYarn: shortText(200, '브랜드'),
  brandsNeedle: shortText(200, '브랜드'),
  brandsNotions: shortText(200, '브랜드'),
  brandsPatternbook: shortText(200, '브랜드'),
  linkInstagram: urlField,
  linkWebsite: urlField,
  linkNaverMap: urlField,
})

export type PlaceSubmissionData = z.infer<typeof placeSubmissionSchema>

// 기존 장소 업데이트 (모든 필드 optional, 변경분만 입력)
export const placeUpdateSchema = z.object({
  placeId: z.string().min(1, '장소를 선택해주세요'),
  hours: shortText(200, '영업시간'),
  closedDays: shortText(200, '휴무일'),
  note: shortText(500, '참고사항'),
  tags: shortText(500, '태그'),
  brandsYarn: shortText(200, '브랜드'),
  brandsNeedle: shortText(200, '브랜드'),
  brandsNotions: shortText(200, '브랜드'),
  brandsPatternbook: shortText(200, '브랜드'),
  linkInstagram: urlField,
  linkWebsite: urlField,
  linkNaverMap: urlField,
})

export type PlaceUpdateData = z.infer<typeof placeUpdateSchema>

// 일정 제보
export const eventSubmissionSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(200, '제목은 200자 이하로 입력해주세요'),
  startDate: z
    .string()
    .min(1, '시작일을 선택해주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요'),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식으로 입력해주세요')
    .optional()
    .or(z.literal('')),
  address: shortText(255, '주소'),
  addressDetail: shortText(100, '상세주소'),
  description: shortText(2000, '설명'),
})

export type EventSubmissionData = z.infer<typeof eventSubmissionSchema>
