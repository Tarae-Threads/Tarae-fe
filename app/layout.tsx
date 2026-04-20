import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import GoogleAnalyticsLoader from "@/shared/components/analytics/GoogleAnalyticsLoader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tarae.vercel.app"),
  title: {
    default: "타래 | 뜨개 장소, 정보, 모임을 한 곳에서",
    template: "%s | 타래",
  },
  description:
    "흩어져 있는 뜨개 정보를 한 곳에서. 실 가게, 공방, 뜨개카페를 지도로 탐색하고, 정보와 모임까지 연결하는 뜨개인을 위한 플랫폼입니다.",
  keywords: [
    "뜨개질",
    "뜨개",
    "실 가게",
    "공방",
    "뜨개카페",
    "니트",
    "털실",
    "뜨개 모임",
    "뜨개 지도",
    "핸드메이드",
    "뜨개 커뮤니티",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "타래",
    title: "타래 | 뜨개 장소, 정보, 모임을 한 곳에서",
    description:
      "흩어져 있는 뜨개 정보를 한 곳에서 탐색하고 연결하세요. 뜨개인을 위한 플랫폼.",
    images: [
      {
        url: "/tarae_thumbnail.png",
        width: 1200,
        height: 630,
        alt: "타래 — 뜨개의 모든 것",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "타래 | 뜨개 장소, 정보, 모임을 한 곳에서",
    description:
      "흩어져 있는 뜨개 정보를 한 곳에서 탐색하고 연결하세요. 뜨개인을 위한 플랫폼.",
    images: ["/tarae_thumbnail.png"],
  },
  alternates: {
    canonical: "/",
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
      "@id": "https://tarae.vercel.app/#org",
      name: "타래",
      alternateName: "Tarae",
      url: "https://tarae.vercel.app",
      logo: "https://tarae.vercel.app/logo.png",
      email: "taraethreads@gmail.com",
      description:
        "뜨개인을 위한 플랫폼. 흩어져 있는 뜨개 정보를 한 곳에서 연결합니다.",
    },
    {
      "@type": "WebSite",
      "@id": "https://tarae.vercel.app/#website",
      url: "https://tarae.vercel.app",
      name: "타래",
      inLanguage: "ko-KR",
      publisher: { "@id": "https://tarae.vercel.app/#org" },
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
      <body className="min-h-full flex flex-col">
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
