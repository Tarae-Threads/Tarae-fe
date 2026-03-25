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
    default: "타래 — 뜨개 장소, 정보, 모임을 한 곳에서",
    template: "%s — 타래",
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
    title: "타래 — 뜨개 장소, 정보, 모임을 한 곳에서",
    description:
      "흩어져 있는 뜨개 정보를 한 곳에서 탐색하고 연결하세요. 뜨개인을 위한 플랫폼.",
  },
  twitter: {
    card: "summary_large_image",
    title: "타래 — 뜨개 장소, 정보, 모임을 한 곳에서",
    description:
      "흩어져 있는 뜨개 정보를 한 곳에서 탐색하고 연결하세요. 뜨개인을 위한 플랫폼.",
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
