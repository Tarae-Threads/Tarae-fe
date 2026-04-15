import type { NextConfig } from "next";

const securityHeaders = [
  // 콘텐츠 스니핑 방지
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer 최소화 — same-origin엔 경로까지, cross-origin엔 origin만
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 프레임 임베드 금지 (클릭재킹)
  { key: "X-Frame-Options", value: "DENY" },
  // HSTS — HTTPS 강제, 1년
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // 권한 제한 — 필요 시 geolocation만 self 허용 (MapControls에서 사용)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  images: {
    // 원격 이미지를 사용하지 않는다면 빈 배열 유지. 추후 이미지 호스트 추가 시 명시적으로 화이트리스트.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
