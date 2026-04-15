import { GoogleAnalytics } from "@next/third-parties/google";

// NEXT_PUBLIC_GA_ID가 설정된 환경(프로덕션)에서만 GA4 스크립트를 로드.
// 수집 사실·수집 항목·보관 기간은 개인정보처리방침(Footer에서 모달)에 명시.
export default function GoogleAnalyticsLoader() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
