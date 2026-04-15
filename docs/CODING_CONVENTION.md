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
│   │   ├── queries/      # React Query 훅 + 쿼리 키 팩토리
│   │   ├── components/   # 도메인 전용 컴포넌트
│   │   ├── modals/       # 모달 컴포넌트
│   │   ├── stores/       # Zustand 스토어 (필요 시)
│   │   └── data/         # 정적 JSON 데이터
│   └── event/            # 이벤트 도메인 (동일 구조)
├── shared/               # 도메인 무관 공통 코드
│   ├── components/
│   │   ├── ui/           # 범용 UI (Button, Dialog, Toast, Badge 등)
│   │   └── layout/       # 레이아웃 (NavBar, BasePanel, DetailPanel 등)
│   ├── hooks/            # 공통 훅 (useModal, useLocalStorage, useDebounce)
│   ├── stores/           # zustand 스토어 (useModalStore)
│   ├── providers/        # Provider 컴포넌트 (ModalProvider)
│   ├── api/              # API 클라이언트 + 자동 생성 타입
│   ├── types/            # 공통 타입
│   ├── schemas/          # 공통 Zod 스키마
│   └── lib/              # 유틸 (cn 함수)
app/                      # Next.js App Router 페이지
├── providers.tsx          # 클라이언트 Providers 래퍼
```

### 핵심 규칙

- **shared는 domains를 import하지 않는다** — 항상 단방향 의존
- **도메인 컴포넌트는 shared를 래핑한다** — `CategoryBadge`는 `ColorBadge`를 래핑
- **각 도메인 폴더에 index.ts를 둔다** — types, constants, schemas 각각

---

## 2. 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 폴더 | kebab-case | `customer-center/`, `place/` |
| 컴포넌트 | PascalCase + **함수 선언문** | `function PlaceCard() {}` |
| 훅/유틸 | camelCase + **화살표 함수** | `const usePlaceExplorer = () => {}` |
| 상수 | SCREAMING_SNAKE_CASE | `CATEGORY_LABEL`, `STORAGE_KEYS` |
| 타입/인터페이스 | PascalCase | `PlaceCategory`, `YearMonth` |
| 이벤트 핸들러 (props) | on + Action | `onPlaceSelect`, `onClose` |
| 이벤트 핸들러 (내부) | handle + Action | `handleMarkerSelect` |
| CSS 토큰 | kebab-case | `text-label-md`, `bg-secondary-container` |

---

## 3. 타입

- **`interface`** — 객체 shape 정의
- **`type`** — 유니온, 매핑, 유틸리티 타입
- **`any` 금지** — 불가피한 경우 인라인 주석(이유, 담당자, 날짜) 필수

```tsx
// ✅ interface — 객체 shape
interface PlaceCardProps {
  place: Place
  onClick?: () => void
}

// ✅ type — 유니온
type FormTab = 'place' | 'event'

// ✅ type — 매핑/유틸리티
type PlaceKeys = keyof Place
```

---

## 4. 디자인 시스템

### 색상

- **Primary**: Terracotta (`#91472b`) — CTA, 강조
- **Secondary**: Sage (`#53624f`) — 필터 active, 이벤트 마커
- 직접 hex 사용 금지 → CSS 변수 또는 Tailwind 토큰 사용
- `#000000` 금지 → 항상 `on-surface` (`#1d1b16`) 사용
- 그림자: tinted shadow — 순수 black 금지

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
| `text-label-sm` | 0.75rem | 카드 보조 정보 |
| `text-label-xs` | 0.6875rem | 뱃지(md), 태그(md) |
| `text-label-2xs` | 0.625rem | 뱃지(sm) — **최소 크기** |

### 라운드 / 보더

- 최소: `rounded-sm` (0.25rem) — 90도 직각 금지
- 카드: `rounded-2xl` 또는 `rounded-3xl`
- 칩/뱃지: `rounded-full`
- **1px solid 보더로 영역 구분 금지** — 배경색 차이로 구분
- 폼 접근성용 ghost border만 허용: `outline-variant` 15% opacity

### 유틸리티 클래스

```css
.glass               /* 글래스모피즘: 70% opacity + 12px blur */
.signature-gradient   /* Primary CTA 그라디언트 */
.editorial-shadow     /* 에디토리얼 그림자 */
.hide-scrollbar       /* 스크롤바 숨기기 */
.font-display         /* 디스플레이 폰트 */
.tracking-editorial   /* -0.02em 자간 */
```

---

## 5. 컴포넌트 패턴

### 선언 규칙

```tsx
// ✅ 컴포넌트 — 함수 선언문
export default function PlaceCard({ place, onClick }: PlaceCardProps) {
  return <div>...</div>
}

// ✅ 훅 — 화살표 함수
export const usePlaceExplorer = (initialPlaceId: string | null) => {
  // ...
}
```

### 공통 UI 컴포넌트 (shared)

```tsx
// 도메인 타입에 의존하지 않는 범용 props
interface ColorBadgeProps {
  label: string
  bg: string
  color: string
  size?: 'sm' | 'md'
}

export default function ColorBadge({ label, bg, color, size = 'sm' }: ColorBadgeProps) {
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
- 아이콘 버튼에는 반드시 `aria-label` 부여 (형식: `[대상] + [행동]`, 한국어)

---

## 6. 모달 & Toast

### 모달 (명령형)

```tsx
import { useModal } from '@/shared/hooks/useModal'

const { openModal, openConfirm } = useModal()

// 커스텀 컴포넌트 모달
await openModal(EditForm, { placeId: 'abc' }, { title: '수정', size: 'lg' })

// 확인/취소 다이얼로그
const ok = await openConfirm({ title: '삭제', children: '정말 삭제하시겠습니까?' })
```

**모달 컴포넌트 규칙:**
- `onClose: (v?: unknown) => void` prop을 받는 컴포넌트로 작성
- 내부에서 스크롤/sticky footer 직접 관리: `flex flex-1 flex-col min-h-0`
- 반응형: size `md`/`lg`/`xl`이면 모바일 full-screen, 데스크톱 센터 모달

### Toast (피드백)

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

> **alert 모달은 사용하지 않는다** — toast로 대체.

---

## 7. 상태 관리

### 원칙

- **전역 상태**: zustand — 모달 스택(`useModalStore`), 토스트 큐 등
- **서버 상태**: React Query (TanStack Query) — API 데이터 캐싱/동기화
- **로컬 상태**: React hooks — 도메인별 커스텀 훅으로 추출
- **관심사 분리** — UI 상태와 비즈니스 로직을 훅으로 분리

### React Query 키 팩토리 (향후 도입)

```tsx
const qk = createQueryKeys("place")

export const placeKeys = {
  all: qk.all,                          // ["place"]
  lists: () => qk.group("list"),        // ["place", "list"]
  list: (params: Params) => qk.leaf("list", params),
  detail: (id: number) => qk.id("detail", id),
} as const
```

### Mutation 패턴

```tsx
export const useCreatePlaceRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PlaceRequestInput) => requestPlace(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: placeKeys.lists() })
    },
  })
}
```

- `mutationKey` — 뮤테이션 중복 방지
- `onSuccess` — 스코프 무효화 (group 키 사용)
- **전역 무효화 금지**

### 로컬 상태 패턴

```tsx
// 관련 state를 하나의 객체로 묶기
const [yearMonth, setYearMonth] = useState<YearMonth>({
  year: today.getFullYear(),
  month: today.getMonth() + 1,
})

// 다중 선택: Set 사용
const [selectedCategories, setSelectedCategories] = useState<Set<PlaceCategory>>(new Set())

// 파생 데이터: useMemo
const filteredPlaces = useMemo(() => filterPlaces(...), [deps])

// 안정적 핸들러: useCallback
const handlePlaceSelect = useCallback((place: Place) => { ... }, [])
```

---

## 8. API 연동

### openapi-typescript + axios

```
src/shared/api/
├── openapi.json     # OpenAPI 스펙 원본 (Swagger에서 가져옴)
├── types.ts         # 자동 생성된 타입 (npm run generate:api)
└── client.ts        # axios 인스턴스 + 타입 안전 API 함수
```

**타입 재생성:** `npm run generate:api`

```tsx
import { getPlaces, requestPlace } from '@/shared/api/client'
import type { PlaceListResponse } from '@/shared/api/client'

const places = await getPlaces({ keyword: '뜨개', region: '서울' })
```

---

## 9. 상수 & 타입

### 상수 정의

```tsx
// Record<열거타입, 값>으로 매핑 — switch문 사용 금지
export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  yarn_store: '뜨개샵',
  studio: '공방',
}

// localStorage 키: 상수로 관리
export const STORAGE_KEYS = {
  OWNED_REVIEWS: 'tarae_owned_reviews',
  REVIEW_PREFILL: 'tarae_review_prefill',
} as const
```

### 타입 가드

```tsx
export function isTesterRecruitment(event: AnyEvent | undefined | null): event is TesterRecruitment {
  return event?.type === 'tester_recruitment'
}
```

### Zod 스키마

```tsx
const placeCategorySchema = z.enum(['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply'])
export const placeSchema = z.object({
  id: z.string().min(1),
  status: placeStatusSchema.default('open'),
  lat: z.number().min(33).max(39),
})
```

---

## 10. Import 순서

```tsx
'use client'                                     // 1. 클라이언트 마커
import { useState, useCallback } from 'react'    // 2. React
import { useSearchParams } from 'next/navigation' // 3. Next.js
import dynamic from 'next/dynamic'
import type { NaverMapHandle } from '...'         // 4. 타입 (import type)
import { usePlaceExplorer } from '@/domains/...'  // 5. 도메인 import
import NavBar from '@/shared/...'                  // 6. shared import
import { Plus } from 'lucide-react'               // 7. 외부 라이브러리
```

---

## 11. 반응형 디자인

- **브레이크포인트**: `md:` (768px) 하나만 사용
- **모바일 우선**: 기본 스타일 = 모바일
- **모바일 전용**: `md:hidden`
- **데스크탑 전용**: `hidden md:block` 또는 `hidden md:flex`

---

## 12. 폼

### 프레임워크

- `react-hook-form` + `@hookform/resolvers` + `zod`

### 공통 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| `FormInput` | 텍스트/날짜 입력 (label, required, error, readOnly, onClick) |
| `FormTextarea` | 다중 행 입력 (label, required, error, rows) |
| `FormChipGroup` | 칩 선택 (multi/single, options, error) |
| `SearchSelect` | 검색 가능한 드롭다운 (label, options, error) |

### 규칙

- 필드당 `useState` 금지 → `useForm` 사용
- 인라인 유효성 검증 금지 → Zod 스키마로 선언적 검증
- 에러 메시지는 한국어로 스키마에 정의
- 칩/멀티선택은 react-hook-form 외부 state + 수동 검증 (Set 기반)

---

## 13. 테스트

- Vitest + React Testing Library + jsdom
- 테스트 파일: `src/domains/[domain]/__tests__/`

---

## 14. 금지 사항

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
- `any` 타입 사용 → 불가피한 경우 인라인 주석 필수
- 컴포넌트에 화살표 함수 → 함수 선언문 사용
- 훅에 함수 선언문 → 화살표 함수 사용
