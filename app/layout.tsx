import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tarae.vercel.app"),
  title: {
    default: "타래 — 뜨개 장소 지도",
    template: "%s — 타래",
  },
  description:
    "전국 뜨개 장소(실 가게, 공방, 뜨개카페, 팝업)를 지도에서 탐색하세요. 영업시간, 취급 브랜드, 위치 정보를 한눈에 확인할 수 있습니다.",
  keywords: [
    "뜨개질",
    "뜨개",
    "실 가게",
    "공방",
    "뜨개카페",
    "니트",
    "털실",
    "뜨개 지도",
    "핸드메이드",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "타래",
    title: "타래 — 뜨개 장소 지도",
    description:
      "전국 뜨개 장소를 지도에서 탐색하세요. 실 가게, 공방, 뜨개카페 정보를 한눈에.",
  },
  twitter: {
    card: "summary_large_image",
    title: "타래 — 뜨개 장소 지도",
    description:
      "전국 뜨개 장소를 지도에서 탐색하세요. 실 가게, 공방, 뜨개카페 정보를 한눈에.",
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "theme-color": "#91472b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${plusJakartaSans.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
