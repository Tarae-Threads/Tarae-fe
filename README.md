# 타래 — 뜨개 장소 지도 플랫폼

뜨개 관련 장소(실 가게, 공방, 뜨개카페 등)를 지도로 탐색할 수 있는 정보 플랫폼입니다.

## 기술 스택

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4 + shadcn/ui (base-nova)
- **지도:** NAVER Maps JavaScript API v3
- **Testing:** Vitest + React Testing Library

## 로컬 실행 방법

### 1. 네이버 클라우드 플랫폼 앱 등록

1. [NCP 콘솔](https://console.ncloud.com)에 접속하여 로그인
2. **AI/NAVER API** → **Application 등록**
3. Maps Web Dynamic Map 서비스 선택
4. 서비스 URL에 `http://localhost:3000` 추가
5. 발급된 **Client ID** 복사

### 2. 환경 변수 설정

```bash
# .env.local 파일에 발급받은 Client ID 입력
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=발급받은_Client_ID
```

### 3. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 디렉토리 구조

```
app/
  layout.tsx               # 루트 레이아웃 (SEO 메타데이터)
  page.tsx                 # 메인 지도 페이지
  place/[id]/page.tsx      # 장소 상세 페이지 (SSG)
  error.tsx                # 에러 바운더리
  not-found.tsx            # 404 페이지

src/
  domains/place/           # Place 도메인 (DDD)
    components/            # NaverMap, PlaceCard, PlaceFilter 등
    types/                 # Place, PlaceCategory 타입
    constants/             # 카테고리 라벨/색상, 지역 순서
    utils/                 # 데이터 조회/필터 함수
    hooks/                 # usePlaceExplorer 등 커스텀 훅
    schemas/               # Zod 검증 스키마
    data/                  # places.json 정적 데이터

  shared/                  # 도메인 간 공유 코드
    components/ui/         # shadcn/ui 프리미티브
    components/layout/     # TopAppBar, BottomNav
    lib/                   # 유틸리티 (cn)
```

## 데이터 구조

`src/domains/place/data/places.json`에서 장소 데이터를 관리하며, 추후 Supabase DB로 교체 시 `src/domains/place/utils/places.ts`만 수정하면 됩니다.

## 테스트

```bash
npx vitest run
```
