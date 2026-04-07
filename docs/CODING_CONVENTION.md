# 타래 코딩 컨벤션

---

## 1. 프로젝트 구조

```
src/
├── domains/              # 도메인별 비즈니스 로직
│   ├── place/            # 장소 도메인
│   │   ├── types/        # 타입 정의
│   │   ├── constants/    # 상수 (라벨, 색상, 매핑)
│   │   ├── schemas/      # Zod 유효성 검증
│   │   ├── utils/        # 순수 유틸리티 함수
│   │   ├── hooks/        # React 커스텀 훅
│   │   ├── components/   # 도메인 전용 컴포넌트
│   │   └── data/         # 정적 JSON 데이터
│   └── event/            # 이벤트 도메인 (동일 구조)
├── shared/               # 도메인 무관 공통 코드
│   ├── components/
│   │   ├── ui/           # 범용 UI (ColorBadge, TagChip, FilterChip, Dialog, Toast 등)
│   │   └── layout/       # 레이아웃 (NavBar, BasePanel, DetailPanel, SubmitForm 등)
│   ├── hooks/            # 공통 훅 (useModal, useLocalStorage, useDebounce)
│   ├── stores/           # zustand 스토어 (useModalStore)
│   ├── providers/        # Provider 컴포넌트 (ModalProvider)
│   ├── types/            # 공통 타입
│   └── lib/              # 유틸 (cn 함수)
app/                      # Next.js App Router 페이지
├── providers.tsx          # 클라이언트 Providers 래퍼 (ModalProvider 등)
```

### 핵심 규칙

- **shared는 domains를 import하지 않는다** — 항상 단방향 의존
- **도메인 컴포넌트는 shared를 래핑한다** — `CategoryBadge`는 `ColorBadge`를 래핑
- **각 도메인 폴더에 index.ts를 둔다** — types, constants, schemas 각각

---

## 2. 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `CategoryBadge`, `PlaceFilter` |
| 훅 | use + PascalCase | `usePlaceExplorer`, `useApplicationSubmit` |
| 상수 | SCREAMING_SNAKE_CASE | `CATEGORY_LABEL`, `STORAGE_KEYS` |
| 타입/인터페이스 | PascalCase | `PlaceCategory`, `YearMonth` |
| 유틸 함수 | 동사 + 명사 camelCase | `getPlaces`, `filterEvents`, `formatDateRange` |
| 이벤트 핸들러 (props) | on + Action | `onPlaceSelect`, `onClose` |
| 이벤트 핸들러 (내부) | handle + Action | `handleMarkerSelect`, `handleListSelect` |
| CSS 토큰 | kebab-case | `text-label-md`, `bg-secondary-container` |

---

## 3. 디자인 시스템

### 색상

- **Primary**: Terracotta (`#91472b`) — CTA, 강조
- **Secondary**: Sage (`#53624f`) — 필터 active, 이벤트 마커
- 직접 hex 사용 금지 → CSS 변수 또는 Tailwind 토큰 사용
- `#000000` 금지 → 항상 `on-surface` (`#1d1b16`) 사용
- 그림자: tinted shadow (`rgba(29, 27, 22, ...)`) — 순수 black 금지

### 타이포그래피

모든 텍스트는 globals.css에 정의된 토큰 사용. **직접 px 금지.**

| 토큰 | 크기 | 용도 |
|------|------|------|
| `text-display-lg` | 3.625rem | 히어로 타이틀 |
| `text-display-sm` | 2.625rem | 페이지 타이틀 |
| `text-headline-lg` | 2.125rem | 섹션 제목 |
| `text-headline-sm` | 1.625rem | 서브 헤드라인 |
| `text-title-lg` | 1.375rem | 카드 제목 |
| `text-title-sm` | 1.125rem | 소제목 |
| `text-body-lg` | 1.125rem | 본문 |
| `text-body-sm` | 1rem | 보조 본문 |
| `text-label-lg` | 1rem | 라벨, 버튼 텍스트 |
| `text-label-md` | 0.875rem | 필터 라벨, 폼 라벨 |
| `text-label-sm` | 0.75rem | 카드 보조 정보, 캘린더 요일 |
| `text-label-xs` | 0.6875rem | 뱃지(md), 태그(md), 카운터 |
| `text-label-2xs` | 0.625rem | 뱃지(sm), 태그(sm) — **최소 크기** |

### 라운드

- 최소: `rounded-sm` (0.25rem) — 90도 직각 금지
- 카드: `rounded-2xl` (2rem) 또는 `rounded-3xl`
- 칩/뱃지: `rounded-full`

### 보더

- **1px solid 보더로 영역을 구분하지 않는다** — 배경색 차이로 구분
- 폼 접근성용 ghost border만 허용: `outline-variant` 15% opacity

### 유틸리티 클래스

```css
.glass           /* 글래스모피즘: 70% opacity + 12px blur */
.signature-gradient  /* Primary CTA 그라디언트 */
.editorial-shadow    /* 에디토리얼 그림자 */
.hide-scrollbar      /* 스크롤바 숨기기 */
.font-display        /* 디스플레이 폰트 */
.tracking-editorial  /* -0.02em 자간 */
```

---

## 4. 컴포넌트 패턴

### 공통 UI 컴포넌트 (shared)

```tsx
// 도메인 타입에 의존하지 않는 범용 props
interface ColorBadgeProps {
  label: string
  bg: string
  color: string
  size?: 'sm' | 'md'
  dot?: boolean
}

export default function ColorBadge({ label, bg, color, size = 'sm', dot }: ColorBadgeProps) {
  // ...
}
```

### 도메인 컴포넌트 (domains)

```tsx
// shared를 래핑하여 도메인 의미 부여
import ColorBadge from '@/shared/components/ui/ColorBadge'
import { CATEGORY_LABEL, CATEGORY_COLOR, CATEGORY_BG } from '../constants'

export default function CategoryBadge({ category, size = 'sm' }: Props) {
  return (
    <ColorBadge
      label={CATEGORY_LABEL[category]}
      bg={CATEGORY_BG[category]}
      color={CATEGORY_COLOR[category]}
      size={size}
    />
  )
}
```

### 클라이언트 컴포넌트

- 이벤트 핸들러, 상태, 브라우저 API 사용 시 반드시 `'use client'` 선언
- 서버 컴포넌트가 기본 — 필요한 경우에만 클라이언트로 전환

### 모달 시스템 (명령형)

zustand 스토어 기반 명령형 모달. `useModal()` hook 사용.

```tsx
import { useModal } from '@/shared/hooks/useModal'

const { openModal, openConfirm } = useModal()

// 커스텀 컴포넌트 모달
await openModal(EditForm, { placeId: 'abc' }, { title: '수정', size: 'lg' })

// 확인/취소 다이얼로그 (되돌릴 수 없는 액션 전)
const ok = await openConfirm({ title: '삭제', children: '정말 삭제하시겠습니까?' })
if (ok) { /* 삭제 처리 */ }
```

**모달 컴포넌트 규칙:**
- `onClose: (v?: unknown) => void` prop을 받는 컴포넌트로 작성
- 내부에서 스크롤/sticky footer 직접 관리: `flex flex-1 flex-col min-h-0` 구조
- 스크롤 영역: `flex-1 min-h-0 overflow-y-auto no-scrollbar`
- 하단 고정 버튼: `shrink-0 pt-4`

**반응형:** size `md`/`lg`/`xl`이면 모바일에서 full-screen, 데스크톱에서 센터 모달

### Toast (피드백)

정보성 피드백(성공/실패/알림)은 모달이 아닌 toast로 처리.

```tsx
import { toast } from '@/shared/components/ui/toast'

toast.success('저장 완료')
toast.error('네트워크 오류가 발생했습니다')
toast.info('새 버전이 있습니다')
```

### 사용 기준

| 상황 | 방식 |
|------|------|
| API 응답 성공/실패 피드백 | `toast.success()` / `toast.error()` |
| 되돌릴 수 없는 액션 전 확인 | `openConfirm()` |
| 커스텀 폼/컨텐츠 모달 | `openModal(Component, props, frame)` |

> **alert 모달은 사용하지 않는다** — "확인" 클릭은 불필요한 UX 마찰. toast는 자동 사라져서 사용자 흐름을 끊지 않음.

---

## 5. 상태 관리

### 원칙

- **전역 상태**: zustand 사용 — 모달 스택(`useModalStore`), 토스트 큐 등
- **도메인별 커스텀 훅으로 추출** — `usePlaceExplorer`, `useEventExplorer`
- **관심사 분리** — UI 상태와 비즈니스 로직을 훅으로 분리

### 패턴

```tsx
// 관련 state를 하나의 객체로 묶기 (StrictMode 이중 호출 방지)
const [yearMonth, setYearMonth] = useState<YearMonth>({
  year: today.getFullYear(),
  month: today.getMonth() + 1,
})

// 다중 선택: Set 사용
const [selectedCategories, setSelectedCategories] = useState<Set<PlaceCategory>>(new Set())

// 파생 데이터: useMemo
const filteredPlaces = useMemo(
  () => filterPlaces(allPlaces, selectedCategories, selectedRegion, debouncedQuery),
  [allPlaces, selectedCategories, selectedRegion, debouncedQuery],
)

// 안정적 핸들러: useCallback
const handlePlaceSelect = useCallback((place: Place) => {
  setSelectedPlace(place)
  setPanelOpen(true)
}, [])
```

### 훅 반환값 구조

```tsx
return {
  // data
  filteredPlaces,
  selectedPlace,
  // filter state
  selectedCategories,
  toggleCategory,
  clearCategories,
  // panel state
  panelOpen,
  // actions
  handlePlaceSelect,
  handlePanelClose,
}
```

---

## 6. 상수 & 타입

### 상수 정의

```tsx
// Record<열거타입, 값>으로 매핑 — switch문 사용 금지
export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  yarn_store: '뜨개샵',
  studio: '공방',
  // ...
}

// localStorage 키: 상수로 관리
export const STORAGE_KEYS = {
  TESTER_APPLICATIONS: 'tarae_tester_applications',
} as const
```

### 타입 가드

```tsx
// 도메인 utils에 한 곳에서 정의, 여러 곳에서 import
export function isTesterRecruitment(event: AnyEvent | undefined | null): event is TesterRecruitment {
  return event?.type === 'tester_recruitment'
}
```

### Zod 스키마

```tsx
// 도메인별 schemas/index.ts에 정의
const placeCategorySchema = z.enum(['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply'])
export const placeSchema = z.object({
  id: z.string().min(1),
  status: placeStatusSchema.default('open'),
  lat: z.number().min(33).max(39),  // 지리적 제약
  // ...
})
```

---

## 7. Import 순서

```tsx
'use client'                                    // 1. 클라이언트 마커
import { useState, useCallback } from 'react'   // 2. React
import { useSearchParams } from 'next/navigation' // 3. Next.js
import dynamic from 'next/dynamic'
import type { NaverMapHandle } from '...'        // 4. 타입 (import type)
import { usePlaceExplorer } from '@/domains/...' // 5. 도메인 import
import { getPlaceById } from '@/domains/...'
import NavBar from '@/shared/...'                 // 6. shared import
import BasePanel from '@/shared/...'
import { Plus } from 'lucide-react'              // 7. 외부 라이브러리
```

---

## 8. 반응형 디자인

- **브레이크포인트**: `md:` (768px) 하나만 사용
- **모바일 우선**: 기본 스타일 = 모바일
- **모바일 전용**: `md:hidden`
- **데스크탑 전용**: `hidden md:block` 또는 `hidden md:flex`

```tsx
{/* 데스크탑: 좌측 NavBar + BasePanel + DetailPanel */}
<NavBar />                           {/* hidden md:flex, w-16 */}
<BasePanel />                        {/* hidden md:flex, w-[380px] */}
<DetailPanel />                      {/* hidden md:flex, w-[380px], 선택 시만 */}

{/* 모바일: 바텀시트 + PlacePanel 오버레이 */}
<div className="md:hidden">
  <MobileBottomSheet />
  <PlacePanel />
</div>
```

---

## 9. 지도 연동

### 클릭 프로세스

| 동작 | 줌 | 패널 |
|------|-----|------|
| 마커 클릭 | 줌 ≤12이면 13으로, 아니면 유지 | 열림 |
| 리스트 클릭 | 항상 zoom 14 | 열림 |
| 이벤트 카드 클릭 | 줌 ≤12이면 13으로, 아니면 유지 | 변화 없음 |

### NaverMapHandle (imperative API)

```tsx
export interface NaverMapHandle {
  zoomIn: () => void
  zoomOut: () => void
  locate: () => void
  panTo: (lat: number, lng: number, zoom?: number) => void
  getZoom: () => number
}
```

### 마커 색상

- 일반 장소: Primary 그라디언트 (`#91472b → #af5f41`)
- 이벤트 연결 장소: Secondary 그라디언트 (`#53624f → #7a8c73`)
- 내 위치: favicon + 테라코타 보더 + pulse 애니메이션

### 마커 z-index

- 클릭 시 전체 마커 zIndex 0으로 리셋 → 선택된 마커만 1000으로 설정
- 중첩 마커에서 선택된 마커가 항상 최상위에 표시

---

## 10. 테스트

### 프레임워크

- Vitest + React Testing Library + jsdom

### 테스트 파일 위치

```
src/domains/[domain]/__tests__/
  ├── places.test.ts            # 유틸리티 함수
  ├── types.test.ts             # 상수 검증
  ├── CategoryBadge.test.tsx    # 컴포넌트
  ├── events.test.ts            # 이벤트 유틸리티
  ├── useEventExplorer.test.ts  # 훅 (renderHook)
  ├── useApplicationSubmit.test.ts # 폼 제출 훅
  ├── date.test.ts              # 날짜 유틸리티
  ├── typeGuards.test.ts        # 타입 가드
  └── constants.test.ts         # 상수 검증
```

### 패턴

```tsx
// 유틸: 순수 함수 테스트
describe('filterPlaces', () => {
  it('returns all when category is "all"', () => { ... })
})

// 상수: Record 키 검증 + hex 색상 매칭
it('has valid hex color for every category', () => {
  expect(COLOR[cat]).toMatch(/^#[0-9a-fA-F]{6}$/)
})

// 훅: renderHook + act
const { result } = renderHook(() => useEventExplorer())
act(() => result.current.nextMonth())
expect(result.current.currentMonth).toBe(expected)

// 컴포넌트: render + screen
render(<CategoryBadge category="yarn_store" />)
expect(screen.getByText('뜨개샵')).toBeInTheDocument()
```

---

## 11. 폼

### 프레임워크

- `react-hook-form` + `@hookform/resolvers` + `zod`

### 공통 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| `FormInput` | 텍스트/날짜 입력 (label, required, error, readOnly, onClick) |
| `FormTextarea` | 다중 행 입력 (label, required, error, rows) |
| `FormChipGroup` | 칩 선택 (multi/single, options, error) |
| `SearchSelect` | 검색 가능한 드롭다운 (label, options, error) |

### 패턴

```tsx
// 1. Zod 스키마 정의 (shared/schemas/ 또는 domain/schemas/)
const schema = z.object({
  name: z.string().min(1, '에러 메시지'),
})

// 2. useForm + zodResolver
const form = useForm({ resolver: zodResolver(schema) })

// 3. 공통 컴포넌트에 registration 전달
<FormInput
  label="장소명"
  required
  registration={form.register('name')}
  error={form.formState.errors.name?.message}
/>

// 4. form.handleSubmit으로 제출
<form onSubmit={form.handleSubmit(onSubmit)}>
```

### 규칙

- 필드당 `useState` 금지 → `useForm` 사용
- 인라인 유효성 검증 금지 → Zod 스키마로 선언적 검증
- 에러 메시지는 한국어로 스키마에 정의
- 칩/멀티선택은 react-hook-form 외부 state + 수동 검증 (Set 기반)

---

## 12. 금지 사항

- `text-[NNpx]` 직접 픽셀 사용 → 타이포그래피 토큰 사용
- `#000000` 텍스트 색상 → `on-surface` 사용
- 1px solid 보더로 영역 구분 → 배경색 차이 사용
- switch문으로 라벨/색상 매핑 → `Record<Type, Value>` 상수 사용
- shared에서 domains import → 단방향 의존만 허용
- 타입 가드 로컬 중복 정의 → `utils/typeGuards.ts`에 한 곳 정의
- localStorage 키 직접 문자열 → `STORAGE_KEYS` 상수 사용
- `Date.now()` 기반 ID → `crypto.randomUUID()` 사용
- 인라인 SVG → Lucide React 아이콘 사용
- 9px 이하 폰트 사이즈 → 최소 `text-label-2xs` (10px)
- 폼 필드당 `useState` → `react-hook-form` + `useForm` 사용
- 인라인 폼 유효성 검증 → Zod 스키마 사용
- 주소 자유 입력 → 카카오 우편번호 서비스로만 입력
- 정보성 피드백에 alert 모달 사용 → `toast` 사용
- CTA 버튼에 `signature-gradient` 인라인 → `Button` variant `gradient` 사용
