import type { ComponentType } from "react";

/**
 * 홈 페이지 상단 스와이프 배너 데이터.
 *
 * ─── 배너 추가 방법 ─────────────────────────────────────────────
 * 1. 배경 소스 하나를 선택 (아래 셋 중 하나):
 *    a) `image`  — `public/banners/` 에 업로드. desktop 1600×600 / mobile 750×600 권장
 *    b) `Background` — SVG/JSX 컴포넌트. 이미지 없이 타래 감성 배경이 필요할 때 사용
 *    c) 둘 다 생략 — signature-gradient fallback
 * 2. 아래 `HOME_BANNERS` 배열에 항목 추가 (id 는 고유해야 함)
 * 3. 당장 노출하려면 `active: true`
 * 4. 예약 노출은 `startAt` / `endAt` 에 ISO 문자열 지정
 *
 * ─── 나중에 백엔드 전환 시 ───────────────────────────────────────
 * `HomeBanner` 타입은 그대로 두고 `getActiveBanners()` 만 fetch 로 교체하면 된다.
 */

export interface HomeBanner {
  /** 고유 ID (analytics·key 용도) */
  id: string;
  /**
   * 배경 이미지 (desktop 필수, mobile 선택).
   * image 가 있으면 Background / gradient 보다 우선.
   */
  image?: {
    desktop: string;
    mobile?: string;
  };
  /**
   * 이미지 대신 사용할 커스텀 배경 컴포넌트 (SVG/JSX).
   * `image` 가 없을 때만 적용. 둘 다 없으면 signature-gradient fallback.
   */
  Background?: ComponentType;
  /** 접근성 alt 텍스트 (이미지 있을 때만 의미) */
  alt?: string;
  /** 배너 클릭 시 이동 */
  link: {
    href: string;
    /** true 면 새 탭으로 열기 */
    external?: boolean;
    /** GA 트래킹 이벤트 (선택) */
    track?: { event: string; params?: Record<string, string | number> };
  };
  /** false 면 비노출 (데이터는 유지하되 숨김) */
  active: boolean;
  /** 예약 노출 시작 (ISO) */
  startAt?: string;
  /** 자동 종료 (ISO) */
  endAt?: string;
  /** 이미지 위에 얹을 텍스트 (선택) */
  overlay?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    ctaLabel?: string;
    /** 이미지 배경 밝기에 따라 텍스트 컬러. 기본 light(어두운 배경) */
    theme?: "light" | "dark";
  };
}

export const HOME_BANNERS: HomeBanner[] = [
  {
    // 런칭 기념 이벤트 배너.
    // image 가 있으면 Background 는 자동 무시. 이미지를 내려고 싶으면 image 필드를
    // 다시 주석 처리하면 YarnBackground 로 fallback.
    id: "open-event",
    image: {
      desktop: "/banners/open-event-desktop.png",
      mobile: "/banners/open-event-mobile.png",
    },
    alt: "런칭 기념 이벤트 — 리뷰·제보하고 선물 받으세요",
    link: {
      href: "/news/open-event",
      track: {
        event: "landing_cta_click",
        params: { cta: "banner_open_event" },
      },
    },
    active: true,
    endAt: "2026-05-31T23:59:59+09:00",
    overlay: {
      eyebrow: "뜨개를 사랑하는 모든 분이 서로의 실타래를 이어주기를",
      title: "당신의 한 줄이 다음 뜨개인의 시작이 됩니다",
      description:
        "리뷰·제보로 타래를 함께 엮어주신 분께 작은 선물을 드려요🎁♥️",
      ctaLabel: "이벤트 참여하기",
      theme: "light",
    },
  },
  {
    // 타래 첫 공지 — "뜨개인을 위한 플랫폼을 엽니다"
    // 대응 뉴스: content/news/2026-04-20-welcome.mdx (slug: welcome)
    id: "welcome-notice",
    image: {
      desktop: "/banners/welcome-desktop.png",
      mobile: "/banners/welcome-mobile.png",
    },
    alt: "타래, 뜨개인을 위한 플랫폼을 엽니다",
    link: {
      href: "/news/welcome",
      track: {
        event: "landing_cta_click",
        params: { cta: "banner_welcome_notice" },
      },
    },
    active: true,
    overlay: {
      eyebrow: "타래 이야기",
      title: "뜨개인을 위한 플랫폼을 엽니다",
      description: "실 가게·공방·뜨개카페부터 이벤트까지 한 곳에서.",
      ctaLabel: "공지 읽어보기",
      theme: "light",
    },
  },
];

/** 현재 시각 기준 노출해야 하는 배너만 반환 */
export function getActiveBanners(now: Date = new Date()): HomeBanner[] {
  const t = now.getTime();
  return HOME_BANNERS.filter((b) => {
    if (!b.active) return false;
    if (b.startAt && new Date(b.startAt).getTime() > t) return false;
    if (b.endAt && new Date(b.endAt).getTime() < t) return false;
    return true;
  });
}
