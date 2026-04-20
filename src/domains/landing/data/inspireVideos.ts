/**
 * 홈 "뜨개로 이런 것도?" 섹션의 큐레이션 영상.
 *
 * ─── 영상 추가 방법 ──────────────────────────────────────────────
 * 1. 유튜브 영상 URL 에서 `?v=` 뒤 11자가 videoId
 *    예: https://www.youtube.com/watch?v=d-DWqZFMJ4g → videoId: "d-DWqZFMJ4g"
 * 2. 아래 `INSPIRE_VIDEOS` 배열에 항목 추가 (id 는 고유해야 함)
 * 3. caption 은 우리가 붙이는 한 줄 카피, creator 는 채널명·채널 URL
 * 4. active: false 로 두면 비노출 (예약 삭제)
 *
 * ─── 크리에이터 예의 ────────────────────────────────────────────
 * - 크리에이터 크레딧(이름·채널 링크)은 카드에서 자동 노출됨
 * - 가능하면 DM/댓글로 "메인에 소개했어요" 한마디 남기기
 * - 원본 영상이 비공개되면 lite-embed 썸네일이 사라지니 주기적으로 점검
 */

export interface InspireVideo {
  /** 고유 ID (analytics·key) */
  id: string
  /** 11자 YouTube 영상 ID */
  videoId: string
  /** 카드에 노출되는 우리 한줄 카피 */
  caption: string
  /** 크리에이터 크레딧 */
  creator: { name: string; channelUrl?: string }
  /** 선택 태그 칩 */
  tag?: string
  /** false 면 비노출 */
  active: boolean
  /** 오름차순 정렬 기준 (없으면 배열 순서) */
  sort?: number
}

export const INSPIRE_VIDEOS: InspireVideo[] = [
  {
    id: "hiyo-moss-heather",
    videoId: "d-DWqZFMJ4g",
    caption: "초록 물결 베스트… 손님, 이건 직접 뜨셔야 합니다.",
    creator: { name: "히요정", channelUrl: "https://www.youtube.com/@hiyojeong" },
    tag: "베스트",
    active: true,
  },
  {
    id: "hiyo-fleur-cardigan",
    videoId: "yy9_C9ZhhRM",
    caption: "크로셰 꽃 가디건. 이게 뜨개라고?",
    creator: { name: "히요정", channelUrl: "https://www.youtube.com/@hiyojeong" },
    tag: "가디건",
    active: true,
  },
  {
    id: "oyangi-cat-cowichan",
    videoId: "DSp6ouw0VPo",
    caption: "고양이 카우쳔 · 입기 좋은 날씨의 자랑템.",
    creator: { name: "오양이", channelUrl: "https://www.youtube.com/@oyangiee" },
    tag: "스웨터",
    active: true,
  },
  {
    id: "seooff-amsterdam-cardigan",
    videoId: "YZeSftF3Ipo",
    caption: "가디건도 픽개로그 각. 친구한테 선물각.",
    creator: { name: "서형양", channelUrl: "https://www.youtube.com/@seoofff" },
    tag: "가디건",
    active: true,
  },
  {
    id: "yuwing-olga-hood",
    videoId: "NCma4wuYaBM",
    caption: "가을용 후드 스웨터, 첫 서울 뜨개숍 방문기까지.",
    creator: { name: "유윙 yuwing", channelUrl: "https://www.youtube.com/@yuwing_" },
    tag: "스웨터",
    active: true,
  },
  {
    id: "jasmine-color-cushion",
    videoId: "ThwsNHNZymI",
    caption: "배색 쿠션 · 취미 일상 통째로 뚜개.",
    creator: {
      name: "Jasmine茶",
      channelUrl: "https://www.youtube.com/@%EC%9E%AC%EC%8A%A4%EB%AF%BCtea",
    },
    tag: "소품",
    active: true,
  },
  {
    id: "koro-scrunchie-bag",
    videoId: "IpqFgsriv70",
    caption: "초보자용 스크런치 가방. 첫 뜨개 프로젝트 후보.",
    creator: { name: "koro_knitting", channelUrl: "https://www.youtube.com/@koro_knitting" },
    tag: "가방",
    active: true,
  },
  {
    id: "sunknit-lowkey-cardigan",
    videoId: "GGH6xahvRr0",
    caption: "애플민트 컬러의 로우키 가디건. 봄의 표준.",
    creator: {
      name: "써닛sunknit",
      channelUrl: "https://www.youtube.com/@%EC%8D%A8%EB%8B%9Bsunknit",
    },
    tag: "가디건",
    active: true,
  },
]

/** active 인 영상만 sort(있으면) → 배열 순서로 반환 */
export function getActiveInspireVideos(): InspireVideo[] {
  return INSPIRE_VIDEOS.filter((v) => v.active).sort((a, b) => {
    if (a.sort != null && b.sort != null) return a.sort - b.sort
    if (a.sort != null) return -1
    if (b.sort != null) return 1
    return 0
  })
}
