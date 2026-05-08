import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import GoogleAnalyticsLoader from "@/shared/components/analytics/GoogleAnalyticsLoader";
import "./globals.css";

const SITE_TITLE = "타래 | 뜨개할 곳 찾을 땐, 타래";
const SITE_DESCRIPTION =
  "전국 뜨개샵·공방·뜨개카페부터 뜨개 행사·세일·테스터 모집까지 한 곳에서 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.taraethreads.com"),
  title: {
    default: SITE_TITLE,
    template: "%s | 타래",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "뜨개질",
    "뜨개",
    "전국 뜨개샵",
    "뜨개샵",
    "뜨개 공방",
    "공방",
    "뜨개카페",
    "손염색실",
    "공예용품점",
    "뜨개 행사",
    "뜨개 이벤트",
    "뜨개 세일",
    "테스터 모집",
    "뜨개 지도",
    "온라인 뜨개샵",
    "뜨개 커뮤니티",
    "실 가게",
    "니트",
    "털실",
    "핸드메이드",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "타래",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/tarae_thumbnail.png",
        width: 1200,
        height: 630,
        alt: "타래 — 뜨개할 곳 찾을 땐, 타래",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/tarae_thumbnail.png"],
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    other: {
      "naver-site-verification":
        "9bec814a7a61869ae9181ac0ef30f4a5627df934",
    },
  },
  other: {
    "theme-color": "#91472b",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.taraethreads.com/#org",
      name: "타래",
      alternateName: "Tarae",
      url: "https://www.taraethreads.com",
      logo: "https://www.taraethreads.com/logo.png",
      email: "taraethreads@gmail.com",
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": "https://www.taraethreads.com/#website",
      url: "https://www.taraethreads.com",
      name: "타래",
      inLanguage: "ko-KR",
      publisher: { "@id": "https://www.taraethreads.com/#org" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <Script
          id="ld-json-site"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        <Script
          src="//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="lazyOnload"
        />
        <GoogleAnalyticsLoader />
      </body>
    </html>
  );
}
