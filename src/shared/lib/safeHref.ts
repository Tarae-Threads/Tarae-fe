// 외부 링크 스킴 가드 — javascript:, data:, vbscript: 등 실행 가능 스킴 차단
// 사용자 제출 URL이 <a href>로 렌더링되기 전 반드시 통과해야 한다.

const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function safeHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 스킴 없으면 https:// 로 승격 (사용자가 도메인만 적었을 때)
  const candidate = /^[a-z][a-z0-9+\-.]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (!ALLOWED_PROTOCOLS.has(url.protocol.toLowerCase())) return null;
    return url.toString();
  } catch {
    return null;
  }
}
