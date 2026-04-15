# Analytics 가이드 (GA4)

타래는 Google Analytics 4로 핵심 사용자 행동을 추적합니다. 이 문서는 이벤트 체계, 동의 관리, 디버깅 방법, 새 이벤트 추가 방법을 정리합니다.

## 개요

- **도구**: Google Analytics 4 (무료 티어)
- **Measurement ID**: `G-8WCVF5TV4F` (Vercel 환경변수 `NEXT_PUBLIC_GA_ID`에서 주입)
- **로더**: `@next/third-parties/google` 의 `<GoogleAnalytics>` 사용
- **주요 목적**: 제보 폼 이탈률 분석, 유입→탐색→전환 퍼널 파악

`NEXT_PUBLIC_GA_ID`가 없으면 GA 로더 자체가 마운트되지 않아 로컬·프리뷰 환경에서는 자동으로 비활성화됩니다.

## 아키텍처

```
app/layout.tsx
 └─ <GoogleAnalyticsLoader />    GA_ID 있으면 항상 로드

src/shared/lib/analytics.ts
 ├─ track(name, params)          gtag('event', ...) 얇은 래퍼
 └─ now()                        duration 측정용

src/shared/components/analytics/TrackedLink.tsx
 └─ 서버 컴포넌트에서도 쓸 수 있는 onClick 트래킹 Link 래퍼

src/shared/components/legal/
 ├─ PrivacyPolicy.tsx            모달에서 렌더되는 개인정보처리방침 본문
 └─ PrivacyPolicyButton.tsx      Footer에서 모달 여는 버튼
```

## 동의·고지 방식

한국 서비스 관행에 따라 **opt-in 배너 없이 개인정보처리방침에 수집 사실을 명시**하는 방식을 채택.

- GA4 스크립트는 `NEXT_PUBLIC_GA_ID`가 설정된 프로덕션에서 항상 로드
- Footer의 **"개인정보처리방침"** 버튼 클릭 시 모달로 전문 노출
- 방침 본문에 수집 항목·이용 목적·보관 기간·옵트아웃 방법(브라우저 쿠키 차단, Google 분석 차단 부가기능) 명시
- EU 방문자(GDPR) 대상 확장 시 별도 배너 도입 재검토

## 이벤트 레퍼런스

### 자동
| 이벤트 | 언제 | 비고 |
|--------|------|------|
| `page_view` | 라우트 변경 시마다 | `@next/third-parties`가 자동 발송 |

### 탐색
| 이벤트 | 파라미터 | 발송 위치 |
|--------|---------|---------|
| `place_select` | `{ place_id, source: 'map'\|'list'\|'landing_trending' }` | `app/map/page.tsx`, `TrendingPlaces.tsx` |
| `event_select` | `{ event_id, source?: 'landing_active' }` | `app/map/page.tsx`, `ActiveEventsSection.tsx` |
| `detail_tab_change` | `{ target: 'place'\|'event', tab: 'info'\|'brands'\|'reviews' }` | `PlaceDetailTabs.tsx`, `EventDetailTabs.tsx` |

### 랜딩 허브
| 이벤트 | 파라미터 | 발송 위치 |
|--------|---------|---------|
| `landing_cta_click` | `{ cta: 'header_map'\|'hero_map'\|'hero_event', event_id? }` | `Header.tsx`, `HeroEventBanner.tsx` |
| `category_shortcut_click` | `{ category }` | `CategoryShortcutSection.tsx` |
| `region_shortcut_click` | `{ region }` | `RegionShortcutSection.tsx` |

### 리뷰
| 이벤트 | 파라미터 | 발송 위치 |
|--------|---------|---------|
| `review_submit` | `{ target: 'place'\|'event', target_id }` | `ReviewForm.tsx` |
| `review_delete` | `{ review_id }` | `ReviewDeleteConfirm.tsx` |

### 외부 이동
| 이벤트 | 파라미터 | 발송 위치 |
|--------|---------|---------|
| `external_link` | `{ kind: 'instagram'\|'website'\|'naver_map'\|'event_link' }` | `PlaceDetailView.tsx`, `EventDetailView.tsx` |

### 제보 폼 퍼널
| 이벤트 | 파라미터 | 발송 시점 |
|--------|---------|---------|
| `submit_open` | `{ tab: 'place'\|'event' }` | 모달 오픈, 탭 전환 |
| `submit_mode_select` | `{ mode: 'new'\|'update' }` | 장소 탭 모드 카드 선택 |
| `submit_step_view` | `{ flow, step, title }` | 각 스텝 진입 시 |
| `submit_step_next` | `{ flow, step, valid: true }` | "다음" 버튼 검증 통과 |
| `submit_validation_error` | `{ flow, step, fields: string[] }` | 검증 실패, 어느 필드인지 |
| `submit_back` | `{ flow, from_step }` | "이전" 버튼 |
| `submit_skip_submit` | `{ flow }` | "건너뛰고 제보" |
| `submit_abandon` | `{ flow, last_step }` | 성공 없이 모달 닫힘 |
| `submit_success` | `{ flow, requestType?, durationMs }` | API 성공 |
| `submit_error` | `{ flow, status? }` | API 에러 |

`flow`는 `placeNew` | `placeUpdate` | `event` 중 하나.

## 제보 폼 이탈 분석 (Funnel Exploration)

GA4 → **Explore** → **Funnel exploration** 새로 만들기:

1. **Steps** (예: 새 장소 제보):
   - Step 1: `submit_open`
   - Step 2: `submit_mode_select` (mode = `new`)
   - Step 3: `submit_step_view` (flow = `placeNew`, step = `0`)
   - Step 4: `submit_step_view` (flow = `placeNew`, step = `1`)
   - Step 5: `submit_step_view` (flow = `placeNew`, step = `2`)
   - Step 6: `submit_success` (flow = `placeNew`)

2. **Segments**: flow별로 분리(새 장소 / 기존 수정 / 이벤트)

3. **Breakdown**: `submit_validation_error`의 `fields` 파라미터로 필드별 실패율 확인

자주 쓰는 질문:
- "새 장소 제보에서 1→2단계 이탈률이 얼마?"
- "어느 필드에서 가장 많이 막히나?" → `submit_validation_error.fields` Top N
- "건너뛰기를 얼마나 쓰나?" → `submit_skip_submit` / `submit_open` 비율
- "평균 완료 시간은?" → `submit_success.durationMs` 평균

## 새 이벤트 추가하기

```ts
// 1. 이벤트 발송
import { track } from "@/shared/lib/analytics"

track("my_event", { foo: "bar" })

// 2. 서버 컴포넌트에서는 TrackedLink
import TrackedLink from "@/shared/components/analytics/TrackedLink"

<TrackedLink href="/x" event="my_event" params={{ foo: "bar" }}>...</TrackedLink>
```

3. **이 문서의 이벤트 레퍼런스 테이블에 추가** — 테이블이 단일 진실 소스

## 디버깅

### 로컬
- `NEXT_PUBLIC_GA_ID` 환경변수 없음 → `window.gtag` undefined → 조용히 no-op
- 로컬에서도 이벤트를 확인하고 싶다면 `.env.local`에 임시로 ID 값 추가 (단 프로덕션 속성과 트래픽 섞이므로 주의)

### 브라우저 확인
- Chrome DevTools → **Network** 탭
- 필터: `google-analytics.com` 또는 `collect`
- 이벤트 발송 시 `google-analytics.com/g/collect` 요청이 POST로 나감
- 쿼리 파라미터에 `en=submit_open` (event name), `ep.flow=placeNew` 등이 보임

### GA4 DebugView
- Chrome 확장 "Google Analytics Debugger" 설치 → 활성화
- GA4 콘솔 → **관리** → **DebugView**
- 실시간으로 이벤트·파라미터 확인 가능 (Realtime보다 지연 적음)

## 개인정보 처리

- GA4는 기본적으로 IP 일부 익명화(자동)
- `_ga` 쿠키 유효 기간 2년
- 수집 고지: Footer → "개인정보처리방침" 모달에 Google Analytics 사용·수집 항목·보관 기간 명시
- 사용자가 옵트아웃하려면 브라우저 쿠키 차단 또는 Google 분석 차단 브라우저 부가기능 사용

## 오버엔지니어링 금지 (의도적 제외)

- GTM (Tag Manager) — GA4 직접 연동으로 충분
- Mixpanel / Segment / PostHog — 병렬 도구 불필요
- dataLayer 추상화 — `track()` 얇은 래퍼 하나로 충분
- 필드별 focus 이벤트 — 데이터 노이즈, GA4 이벤트 한도 근접
- A/B 테스트 프레임워크, 세션 리플레이 — 현재 단계에서 불필요

## 범위 밖

- 서버 사이드 Measurement Protocol (BE에서 이벤트 직접 발송)
- `/privacy` 전용 페이지 (현재는 Footer 외부 링크 권장)
- Vercel Web Analytics 병행 사용
