import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { fetchShopsForLanding } from "../queries/landingApi"
import TrendingStoreCard from "./TrendingStoreCard"

const MAX_STORES = 8

export default async function TrendingStores() {
  const shops = await fetchShopsForLanding()
  if (shops.length === 0) return null

  // 최신 등록순 (id 내림차순)
  const trending = [...shops].sort((a, b) => b.id - a.id).slice(0, MAX_STORES)

  return (
    <section className="py-12 md:py-20 bg-surface">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
              STORE
            </p>
            <h2 className="font-display font-extrabold text-headline-sm md:text-headline-md text-on-surface">
              요즘 뜨는 스토어
            </h2>
          </div>
          <Link
            href="/store"
            className="inline-flex items-center gap-1 text-primary font-bold text-label-md hover:gap-2 transition-all"
          >
            <span className="hidden md:inline">전체 스토어 보기</span>
            <span className="md:hidden">전체 보기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 가로 스크롤 */}
      <div className="overflow-x-auto hide-scrollbar pl-4 md:pl-8">
        <div className="inline-flex gap-4 pr-4 md:pr-8">
          {trending.map((shop) => (
            <TrendingStoreCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </section>
  )
}
