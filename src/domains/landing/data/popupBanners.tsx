/**
 * 랜딩 진입 시 노출되는 중앙 모달 팝업 배너 데이터.
 *
 * ─── 두 가지 방식 ─────────────────────────────────────────────
 * 1) `kind: "image"` — 단순 이미지 배너 (가장 흔함)
 *    - `public/popups/` 에 desktop·mobile 이미지 두 장 업로드
 *    - 권장 해상도: desktop 1000×1200 (5:6) / mobile 720×900 (4:5) — 모두 @2x
 *    - 클릭 시 `link.href` 로 이동, GA 트래킹은 `link.track` 으로
 *
 * 2) `kind: "custom"` — 자유 TSX 컴포넌트
 *    - 정보량이 많거나(경품 섬네일·브랜드 로고·CTA 등) 디자인 자유도가 필요할 때
 *    - `Component` 에 `React.ComponentType<PopupContentProps>` 등록
 *    - 컴포넌트 내부에서 자체 CTA 클릭 시 `onClose()` 를 호출해 팝업을 닫는다
 *    - GA 트래킹도 컴포넌트 내부에서 직접 (track('...', {...}))
 *
 * ─── 공통 동작 ─────────────────────────────────────────────────
 * - 한 번에 1개만 렌더 (활성 + 24h 미해제 중 첫 항목)
 * - "오늘 하루 보지 않기" 클릭 시 24h 동안 같은 id 노출 안 됨
 * - X / 닫기 클릭은 저장 없이 닫기만 (다음 진입 시 다시 노출)
 *
 * ─── 나중에 백엔드 전환 시 ───────────────────────────────────────
 * `PopupBanner` 타입은 그대로 두고 `getActivePopupBanner()` 만 fetch 로 교체.
 * (단, custom 방식은 `Component` 가 컴파일 타임 import 라 백엔드 전환 시 image 방식만 가능)
 */

import OpenEventPopup from "../components/OpenEventPopup";

export interface PopupContentProps {
  /** 커스텀 컴포넌트 안의 CTA 가 호출해 팝업을 닫게 함 */
  onClose: () => void;
}

interface BasePopupBanner {
  /** 고유 ID (localStorage 키 + analytics) */
  id: string;
  /** 접근성 alt / 다이얼로그 sr-only 타이틀 */
  alt: string;
  /** false 면 비노출 */
  active: boolean;
  /** 예약 노출 시작 (ISO) */
  startAt?: string;
  /** 자동 종료 (ISO) */
  endAt?: string;
}

export interface ImagePopupBanner extends BasePopupBanner {
  kind: "image";
  /** 배경 이미지 (desktop 필수, mobile 생략 시 desktop 으로 fallback) */
  image: {
    desktop: string;
    mobile?: string;
  };
  /** 이미지 클릭 시 이동 */
  link: {
    href: string;
    /** true 면 새 탭으로 열기 */
    external?: boolean;
    /** GA 트래킹 이벤트 (선택) */
    track?: { event: string; params?: Record<string, string | number> };
  };
}

export interface CustomPopupBanner extends BasePopupBanner {
  kind: "custom";
  /** 팝업 본문에 렌더할 컴포넌트. `onClose` 를 받아 자체 CTA 안에서 호출. */
  Component: React.ComponentType<PopupContentProps>;
}

export type PopupBanner = ImagePopupBanner | CustomPopupBanner;

export const POPUP_BANNERS: PopupBanner[] = [
  {
    kind: "custom",
    id: "open-event-launch-2026",
    alt: "타래 런칭 기념 — 협찬 경품 추첨 이벤트",
    Component: OpenEventPopup,
    active: true,
    endAt: "2026-05-31T23:59:59+09:00",
  },
];

/** 현재 시각 기준 노출해야 하는 첫 팝업 배너 1개 반환 */
export function getActivePopupBanner(now: Date = new Date()): PopupBanner | null {
  const t = now.getTime();
  for (const b of POPUP_BANNERS) {
    if (!b.active) continue;
    if (b.startAt && new Date(b.startAt).getTime() > t) continue;
    if (b.endAt && new Date(b.endAt).getTime() < t) continue;
    return b;
  }
  return null;
}
