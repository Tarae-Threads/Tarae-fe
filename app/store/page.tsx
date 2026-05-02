import type { Metadata } from "next"
import Header from "@/domains/landing/components/Header"
import Footer from "@/domains/landing/components/Footer"
import ShopList from "@/domains/shop/components/ShopList"

export const metadata: Metadata = {
  title: "스토어",
  description:
    "지도에 없는 온라인 뜨개 상점을 한 곳에서. 실·도구·도안을 다루는 온라인 전용 가게를 카테고리·브랜드별로 탐색하세요.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "스토어 | 타래",
    description: "지도에 없는 온라인 뜨개 상점들.",
    type: "website",
  },
}

export const revalidate = 3600

export default function StorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface md:pl-16 pb-20 md:pb-0">
      <Header />
      <main className="flex-1">
        <ShopList />
      </main>
      <Footer />
    </div>
  )
}
