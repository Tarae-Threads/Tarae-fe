import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchShopsForLanding } from "../queries/landingApi";
import TrendingStoreCard from "./TrendingStoreCard";

const MAX_STORES = 8;

export default async function TrendingStores() {
  const shops = await fetchShopsForLanding();
  if (shops.length === 0) return null;

  // 최신 등록순 (id 내림차순)
  const trending = [...shops].sort((a, b) => b.id - a.id).slice(0, MAX_STORES);

  return (
    <section className="bg-surface py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 flex items-end justify-between md:mb-10">
          <div>
            <p className="text-label-md text-primary mb-2 font-bold tracking-[0.3em] uppercase">
              STORE
            </p>
            <h2 className="font-display text-headline-sm md:text-headline-md text-on-surface font-extrabold">
              요즘 뜨는 스토어
            </h2>
          </div>
          <Link
            href="/store"
            className="text-primary text-label-md inline-flex items-center gap-1 font-bold transition-all hover:gap-2"
          >
            <span className="hidden md:inline">전체 스토어 보기</span>
            <span className="md:hidden">전체 보기</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 가로 스크롤 — 카드가 viewport 보다 좁으면 중앙 정렬, 넘치면 스크롤 */}
      <div className="hide-scrollbar overflow-x-auto pb-4">
        <div className="mx-auto flex w-max gap-4 px-4 md:px-8">
          {trending.map((shop) => (
            <TrendingStoreCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </section>
  );
}
