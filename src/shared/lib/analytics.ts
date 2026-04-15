// GA4 트래킹 얇은 래퍼.
// - NEXT_PUBLIC_GA_ID 환경변수가 있으면 항상 로드
// - 수집 사실은 개인정보처리방침에 명시 (한국 PIPA 관행)

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

// 제보 폼 퍼널 등 duration 계산 편의용
export function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}
