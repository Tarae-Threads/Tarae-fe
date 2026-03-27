import type { EventType, RecruitmentStatus, ApplicationStatus } from '../types'

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  tester_recruitment: '테스터 모집',
  sale: '세일 정보',
  event_popup: '행사 / 팝업',
}

export const EVENT_TYPE_COLOR: Record<EventType, string> = {
  tester_recruitment: '#91472b',
  sale: '#53624f',
  event_popup: '#68594a',
}

export const EVENT_TYPE_BG: Record<EventType, string> = {
  tester_recruitment: '#ffdbcf',
  sale: '#d4e5cc',
  event_popup: '#f4dfcb',
}

export const RECRUITMENT_STATUS_LABEL: Record<RecruitmentStatus, string> = {
  draft: '작성 중',
  pending: '승인 대기',
  open: '모집 중',
  closed: '모집 마감',
  in_progress: '진행 중',
  completed: '완료',
  hidden: '숨김',
}

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: '신청 완료',
  reviewing: '검토 중',
  accepted: '수락',
  rejected: '거절',
  canceled: '취소',
}

export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

export const STORAGE_KEYS = {
  TESTER_APPLICATIONS: 'tarae_tester_applications',
} as const
