import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "지도",
  description:
    "실 가게, 공방, 뜨개카페, 손염색실, 공예용품점을 지도로 탐색하세요. 지역별·카테고리별 필터와 이벤트 정보를 제공합니다.",
  alternates: {
    canonical: "/map",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
