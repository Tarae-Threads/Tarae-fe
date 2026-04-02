# 타래 백엔드 API 스펙

> 현재 프론트엔드에서 JSON 파일 + localStorage로 처리하고 있는 데이터/로직 정리.
> 백엔드 개발 시 이 문서를 기준으로 API를 설계하면 됩니다.

---

## 1. 데이터 모델 (DB 테이블)

### 1-1. `places` — 장소

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | string | PK, unique | 고유 식별자 (slug 형태, e.g. `dongdaemun-jonghap-sijang`) |
| name | string | NOT NULL, min 1 | 장소 이름 |
| category | enum | NOT NULL | `yarn_store` \| `studio` \| `cafe` \| `dye_shop` \| `craft_supply` |
| status | enum | NOT NULL, default `open` | `open` \| `relocated` \| `closed` \| `unverified` |
| region | string | NOT NULL, min 1 | 시/도 (e.g. `서울`, `경기`) |
| district | string | | 시/군/구 |
| address | string | NOT NULL, min 1 | 상세 주소 |
| lat | decimal | NOT NULL, 33~39 | 위도 (대한민국 범위) |
| lng | decimal | NOT NULL, 124~132 | 경도 (대한민국 범위) |
| hours | string | | 영업 시간 |
| closed_days | string[] | | 휴무일 목록 |
| note | string | | 비고/참고사항 |
| tags | string[] | | 태그 목록 (e.g. `수입실`, `대바늘`, `공방`) |
| brands_yarn | string[] | | 취급 실 브랜드 |
| brands_needle | string[] | | 취급 바늘 브랜드 |
| brands_notions | string[] | | 취급 부자재 브랜드 |
| link_instagram | string? | | 인스타그램 URL |
| link_website | string? | | 웹사이트 URL |
| link_naver_map | string? | | 네이버 지도 URL |
| images | string[] | | 이미지 URL 목록 |
| updated_at | datetime | | 최종 수정일 |

> 현재 데이터: `src/domains/place/data/places.json` (50+ 장소)

### 1-2. `events` — 일정/이벤트

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | string | PK, unique | 고유 식별자 |
| title | string | NOT NULL | 이벤트 제목 |
| type | enum | NOT NULL | `tester_recruitment` \| `sale` \| `event_popup` |
| description | string | NOT NULL | 설명 |
| start_date | date | NOT NULL | 시작일 (YYYY-MM-DD) |
| end_date | date | NOT NULL | 종료일 (YYYY-MM-DD) |
| link | string? | | 외부 링크 |
| location | string? | | 장소명/주소 (place 미연결 시) |
| place_id | string? | FK → places.id | 연결된 장소 |
| lat | decimal? | | 위도 (place 미연결 독립 마커용) |
| lng | decimal? | | 경도 (place 미연결 독립 마커용) |

> 현재 데이터: `src/domains/event/data/events.json`

### 1-3. `tester_recruitments` — 테스터 모집 (events 확장)

`events` 테이블의 `type = 'tester_recruitment'` 행에 대한 추가 필드.
1:1 관계로 별도 테이블 또는 events에 nullable 컬럼으로 구현.

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| event_id | string | FK → events.id | 이벤트 참조 |
| pattern_name | string | NOT NULL | 도안명 |
| category | string | NOT NULL | 도안 카테고리 |
| max_participants | integer | NOT NULL | 최대 모집 인원 |
| current_participants | integer | NOT NULL, default 0 | 현재 신청 인원 |
| application_start | date | NOT NULL | 신청 시작일 |
| application_end | date | NOT NULL | 신청 마감일 |
| test_period_start | date | NOT NULL | 테스트 시작일 |
| test_period_end | date | NOT NULL | 테스트 종료일 |
| conditions | string | NOT NULL | 참여 조건 |
| requirements | string | NOT NULL | 제출물 |
| contact_method | string | NOT NULL | 연락 방식 |
| recruitment_status | enum | NOT NULL, default `draft` | `draft` \| `pending` \| `open` \| `closed` \| `in_progress` \| `completed` \| `hidden` |

### 1-4. `tester_applications` — 테스터 지원서

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | uuid | PK | 자동 생성 |
| recruitment_id | string | FK → events.id | 모집 공고 참조 |
| nickname | string | NOT NULL | 닉네임 |
| contact | string | NOT NULL | 연락처 (인스타/이메일 등) |
| experience | string | NOT NULL | 뜨개 경험 |
| reason | string | NOT NULL | 지원 이유 |
| portfolio | string? | | 포트폴리오 링크 |
| status | enum | NOT NULL, default `submitted` | `submitted` \| `reviewing` \| `accepted` \| `rejected` \| `canceled` |
| applied_at | datetime | NOT NULL | 지원 일시 |

> 현재 저장소: `localStorage` 키 `tarae_tester_applications`

### 1-5. `place_submissions` — 장소 제보

두 가지 제보 타입 존재: **새 장소 등록** (`type = 'new'`)과 **기존 장소 업데이트** (`type = 'update'`).

#### 공통 컬럼

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | uuid | PK | 자동 생성 |
| type | enum | NOT NULL | `new` \| `update` |
| status | enum | NOT NULL, default `pending` | `pending` \| `approved` \| `rejected` \| `hidden` |
| submitted_at | datetime | NOT NULL | 제보 일시 |

#### `type = 'new'` 전용 컬럼

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| name | string | NOT NULL (new) | 장소명 |
| address | string | NOT NULL (new) | 주소 (다음 우편번호 API + 상세주소) |
| categories | string[] | NOT NULL, min 1 (new) | 카테고리 배열 |

#### `type = 'update'` 전용 컬럼

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| place_id | string | FK → places.id (update) | 업데이트 대상 장소 |
| place_name | string | NOT NULL (update) | 장소명 (조회 편의용 스냅샷) |

#### 공통 상세 컬럼 (new/update 모두 사용, 모두 optional)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| hours | string? | 영업시간 |
| closed_days | string[]? | 휴무일 (쉼표 구분 입력 → 배열 변환) |
| note | string? | 참고사항 |
| tags | string[]? | 태그 (쉼표 구분 입력 → 배열 변환) |
| brands_yarn | string[]? | 실 브랜드 (쉼표 구분 입력 → 배열 변환) |
| brands_needle | string[]? | 바늘 브랜드 (쉼표 구분 입력 → 배열 변환) |
| brands_notions | string[]? | 부자재 브랜드 (쉼표 구분 입력 → 배열 변환) |
| link_instagram | string? | 인스타그램 URL |
| link_website | string? | 웹사이트 URL |
| link_naver_map | string? | 네이버 지도 URL |

> 현재 저장소: `localStorage` 키 `tarae_place_submissions`
> update 제보 시 변경된 필드만 값이 들어오고, 나머지는 undefined/null

### 1-6. `event_submissions` — 일정 제보

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|---------|------|
| id | uuid | PK | 자동 생성 |
| title | string | NOT NULL | 일정 제목 |
| type | enum | NOT NULL | `tester_recruitment` \| `sale` \| `event_popup` |
| start_date | date | NOT NULL | 시작일 |
| end_date | date | | 종료일 (없으면 start_date와 동일) |
| location | string? | | 장소 |
| description | string? | | 설명 |
| status | enum | NOT NULL, default `pending` | `pending` \| `approved` \| `rejected` \| `hidden` |
| submitted_at | datetime | NOT NULL | 제보 일시 |

> 현재 저장소: `localStorage` 키 `tarae_event_submissions`

---

## 2. API 엔드포인트

### 2-1. 장소 (Places)

| Method | Endpoint | 설명 | 현재 프론트 구현 |
|--------|----------|------|----------------|
| GET | `/api/places` | 전체 장소 목록 | `getPlaces()` in `utils/places.ts` |
| GET | `/api/places/:id` | 단일 장소 조회 | `getPlaceById(id)` |
| GET | `/api/places?region={region}` | 지역별 필터 | `getPlacesByRegion(region)` |
| GET | `/api/places?category={cat}` | 카테고리별 필터 | `getPlacesByCategory(category)` |
| GET | `/api/places?q={query}&categories={csv}&region={region}` | 복합 필터 + 검색 | `filterPlaces()` |
| GET | `/api/regions` | 고유 지역 목록 | `getRegions()` |

**검색 로직 (filterPlaces):**
- `categories`: 쉼표 구분 복수 선택 가능, `all`이면 필터 없음
- `region`: 단일 선택, `all`이면 필터 없음
- `q`: 이름, 주소, 구, 비고, 태그, 브랜드(실+바늘+부자재) 대상 검색
- 공백 무시 매칭 지원 (e.g. "동대문종합" → "동대문 종합시장" 매칭)

### 2-2. 이벤트 (Events)

| Method | Endpoint | 설명 | 현재 프론트 구현 |
|--------|----------|------|----------------|
| GET | `/api/events` | 전체 이벤트 목록 (타입 순 정렬) | `getEvents()` in `utils/events.ts` |
| GET | `/api/events/:id` | 단일 이벤트 조회 | `getEventById(id)` |
| GET | `/api/events?type={type}` | 타입별 필터 | `getEventsByType(type)` |
| GET | `/api/events?placeId={id}` | 장소별 이벤트 | `getEventsByPlaceId(placeId)` |
| GET | `/api/events?date={YYYY-MM-DD}` | 특정 날짜 활성 이벤트 | `getEventsByDate(date)` |
| GET | `/api/events/calendar?year={y}&month={m}` | 월별 캘린더 데이터 | `getEventsForMonth(year, month)` |
| GET | `/api/events/calendar/bars?year={y}&month={m}` | 캘린더 바 레이아웃 데이터 | `getEventBarsForMonth(year, month)` |
| GET | `/api/events/calendar/dates?year={y}&month={m}` | 날짜별 이벤트 타입 맵 | `getDatesWithEvents(year, month)` |
| GET | `/api/events/markers` | 지도 마커용 이벤트 (place 미연결 + 좌표 있는 것만) | `getEventMarkers()` |

**정렬 규칙:** `tester_recruitment` → `sale` → `event_popup` 순서

**이벤트-장소 연결:**
- `placeId`가 있으면 해당 장소의 좌표 사용
- `placeId` 없고 `lat`/`lng` 있으면 독립 마커로 표시
- `getLinkedPlace(event)` → 연결된 장소 객체 반환 (JOIN)

### 2-3. 테스터 지원 (Applications)

| Method | Endpoint | 설명 | 현재 프론트 구현 |
|--------|----------|------|----------------|
| POST | `/api/applications` | 테스터 지원서 제출 | `useApplicationSubmit` hook → localStorage |

**요청 Body:**
```json
{
  "recruitmentId": "string (required)",
  "nickname": "string (required, min 1)",
  "contact": "string (required, min 1)",
  "experience": "string (required, min 1)",
  "reason": "string (required, min 1)",
  "portfolio": "string (optional)"
}
```

**처리 로직:**
1. `recruitmentId`가 유효한 open 상태 모집 공고인지 확인
2. UUID 생성, `status: 'submitted'`, `applied_at: now()` 설정
3. DB 저장
4. (추후) `current_participants` 증가 처리 고려

### 2-4. 장소 제보 (Place Submissions)

| Method | Endpoint | 설명 | 현재 프론트 구현 |
|--------|----------|------|----------------|
| POST | `/api/submissions/places/new` | 새 장소 제보 | `SubmitForm.tsx` → localStorage |
| POST | `/api/submissions/places/update` | 기존 장소 업데이트 제보 | `SubmitForm.tsx` → localStorage |

#### 새 장소 제보 요청 Body:
```json
{
  "name": "string (required, min 1)",
  "address": "string (required, min 1, 다음 우편번호 API 결과 + 상세주소)",
  "categories": ["yarn_store", "studio", ...],
  "hours": "string (optional)",
  "closedDays": ["일요일", ...],
  "note": "string (optional)",
  "tags": ["수입실", "대바늘", ...],
  "brands": {
    "yarn": ["이사거", "산네스간", ...],
    "needle": ["히야히야", ...],
    "notions": ["코코닛츠", ...]
  },
  "links": {
    "instagram": "string (optional)",
    "website": "string (optional)",
    "naver_map": "string (optional)"
  }
}
```

#### 기존 장소 업데이트 제보 요청 Body:
```json
{
  "placeId": "string (required, FK → places.id)",
  "hours": "string (optional, 변경 시에만)",
  "closedDays": ["일요일", ...],
  "note": "string (optional)",
  "tags": ["수입실", ...],
  "brands": {
    "yarn": ["이사거", ...],
    "needle": ["히야히야", ...],
    "notions": ["코코닛츠", ...]
  },
  "links": {
    "instagram": "string (optional)",
    "website": "string (optional)",
    "naver_map": "string (optional)"
  }
}
```
> 업데이트 제보는 변경된 필드만 포함. 값이 없는 필드는 전송하지 않음.

**처리 로직:**
1. 유효성 검증 (new: name/address/categories 필수, update: placeId 필수)
2. `type: 'new' | 'update'`, `status: 'pending'`, `submitted_at: now()` 설정
3. DB 저장
4. (추후) 관리자 승인 → new는 places 테이블에 INSERT, update는 해당 place UPDATE

### 2-5. 일정 제보 (Event Submissions)

| Method | Endpoint | 설명 | 현재 프론트 구현 |
|--------|----------|------|----------------|
| POST | `/api/submissions/events` | 일정 제보 제출 | `SubmitForm.tsx` → localStorage |

**요청 Body:**
```json
{
  "title": "string (required, min 1)",
  "type": "tester_recruitment | sale | event_popup (required)",
  "startDate": "YYYY-MM-DD (required)",
  "endDate": "YYYY-MM-DD (optional, 없으면 startDate와 동일)",
  "location": "string (optional)",
  "description": "string (optional)"
}
```

---

## 3. 프론트에서 처리 중인 비즈니스 로직

백엔드 이관 시 서버에서 처리해야 할 로직들:

### 3-1. 복합 검색/필터링
- **위치:** `src/domains/place/utils/places.ts` → `filterPlaces()`
- **로직:** 카테고리(복수) + 지역 + 텍스트 검색 조합 필터
- **텍스트 검색 대상:** name, address, district, note, tags[], brands.yarn[], brands.needle[], brands.notions[]
- **특이사항:** 공백 제거 후 매칭 지원 (한글 검색 UX)

### 3-2. 이벤트 복합 필터링
- **위치:** `src/domains/event/utils/events.ts` → `filterEvents()`
- **로직:** 타입(복수) + 날짜 범위 필터
- **날짜 필터:** `startDate <= date <= endDate` 범위 체크

### 3-3. 캘린더 바 레이아웃 계산
- **위치:** `src/domains/event/utils/events.ts` → `getEventBarsForMonth()`
- **로직:** 월별 이벤트를 주 단위 가로 바로 변환 (캘린더 UI용)
- **복잡도:** 높음 — 주 경계 분할, 다중 이벤트 겹침 처리, 열 할당 등
- **권장:** 프론트에서 계속 처리하거나, 응답에 raw 이벤트만 주고 프론트에서 레이아웃 계산

### 3-4. 지도 마커 데이터 생성
- **위치:** `src/domains/event/utils/events.ts` → `getEventMarkers()`
- **로직:** `placeId` 없고 `lat`/`lng` 있는 이벤트만 필터링하여 마커 데이터 생성

### 3-5. 데이터 유효성 검증
- **위치:** `src/domains/place/schemas/index.ts`, `src/shared/schemas/submitForm.ts`, `src/domains/event/schemas/applicationForm.ts`
- **사용 라이브러리:** Zod
- **적용 시점:** JSON 데이터 로딩 시 + 폼 제출 시
- **권장:** 프론트 검증 유지 + 백엔드에서도 동일 규칙 적용 (이중 검증)

---

## 4. localStorage 이관 대상

| 키 | 용도 | 이관 대상 테이블 |
|----|------|----------------|
| `tarae_tester_applications` | 테스터 지원서 저장 | `tester_applications` |
| `tarae_place_submissions` | 장소 제보 저장 | `place_submissions` |
| `tarae_event_submissions` | 일정 제보 저장 | `event_submissions` |

---

## 5. 외부 API 연동 (현재 사용 중)

| API | 용도 | 비고 |
|-----|------|------|
| Naver Maps JavaScript API v3 | 지도 렌더링, 마커, 클러스터링 | 프론트 전용 (변경 없음) |
| Daum Postcode API | 장소 제보 시 주소 검색 | 프론트 전용 (변경 없음) |

---

## 6. 참고: 현재 프론트 소스 위치

| 구분 | 파일 경로 |
|------|----------|
| 장소 데이터 | `src/domains/place/data/places.json` |
| 이벤트 데이터 | `src/domains/event/data/events.json` |
| 장소 타입 정의 | `src/domains/place/types/index.ts` |
| 이벤트 타입 정의 | `src/domains/event/types/index.ts` |
| 공통 타입 | `src/shared/types/index.ts` |
| 장소 스키마 | `src/domains/place/schemas/index.ts` |
| 폼 스키마 | `src/shared/schemas/submitForm.ts`, `src/domains/event/schemas/applicationForm.ts` |
| 장소 유틸 (쿼리) | `src/domains/place/utils/places.ts` |
| 이벤트 유틸 (쿼리) | `src/domains/event/utils/events.ts` |
| 지원서 제출 | `src/domains/event/hooks/useApplicationSubmit.ts` |
| 제보 폼 | `src/shared/components/layout/SubmitForm.tsx` |
| 상수/열거형 | `src/domains/place/constants/index.ts`, `src/domains/event/constants/index.ts` |
