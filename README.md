# 타래 — 뜨개 장소 지도 플랫폼

뜨개 관련 장소(실 가게, 공방, 뜨개카페 등)를 지도로 탐색할 수 있는 정보 플랫폼입니다.

## 기술 스택

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **지도:** 카카오맵 JavaScript API v3

## 로컬 실행 방법

### 1. 카카오 앱키 발급

1. [카카오 개발자센터](https://developers.kakao.com)에 접속하여 로그인
2. **내 애플리케이션** → **애플리케이션 추가하기**
3. 앱 생성 후 **앱 키** 메뉴에서 **JavaScript 키** 복사
4. **플랫폼** → **Web 플랫폼 등록** → `http://localhost:3000` 추가

### 2. 환경 변수 설정

```bash
# .env.local 파일에 발급받은 앱키 입력
NEXT_PUBLIC_KAKAO_MAP_KEY=발급받은_JavaScript_키
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
  layout.tsx           # 루트 레이아웃
  page.tsx             # 메인 지도 페이지
  place/[id]/page.tsx  # 장소 상세 페이지 (SSG)

components/
  map/                 # 지도 관련 컴포넌트
  place/               # 장소 관련 컴포넌트
  ui/                  # shadcn/ui 컴포넌트

lib/
  places.ts            # 데이터 레이어
  types.ts             # 타입 정의

data/
  places.json          # 장소 데이터
```

## 데이터 구조

`data/places.json`에서 장소 데이터를 관리하며, 추후 Supabase DB로 교체 시 `lib/places.ts`만 수정하면 됩니다.
