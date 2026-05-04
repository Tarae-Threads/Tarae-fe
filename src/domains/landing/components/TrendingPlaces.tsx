import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchPlacesForLanding } from "../queries/landingApi";
import TrackedLink from "@/shared/components/analytics/TrackedLink";
import CategoryBadge from "@/domains/place/components/CategoryBadge";

const TRENDING_PLACE_NAMES = [
  "바늘이야기 연희점",
  "솜솜뜨개",
  "쎄비 하우스",
  "누가바닛츠",
  "니틴",
  "옐로우헤이트",
  "플레이스낙양",
  "메리노",
];

const normalizeName = (s: string) => s.replace(/\s+/g, "");

export default async function TrendingPlaces() {
  const places = await fetchPlacesForLanding();
  const placeByName = new Map(places.map((p) => [normalizeName(p.name), p]));
  const trending = TRENDING_PLACE_NAMES.map((name) =>
    placeByName.get(normalizeName(name)),
  ).filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (trending.length === 0) return null;

  return (
    <section className="bg-surface py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 flex items-end justify-between md:mb-10">
          <div>
            <p className="text-label-md text-primary mb-2 font-bold tracking-[0.3em] uppercase">
              TRENDING
            </p>
            <h2 className="font-display text-headline-sm md:text-headline-md text-on-surface font-extrabold">
              요즘 뜨는 장소
            </h2>
          </div>
          <Link
            href="/map"
            className="text-primary text-label-md inline-flex items-center gap-1 font-bold transition-all hover:gap-2"
          >
            <span className="hidden md:inline">지도에서 전체 장소 보기</span>
            <span className="md:hidden">전체 장소</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 가로 스크롤 */}
      <div className="hide-scrollbar overflow-x-auto pb-4 pl-4 md:pl-8">
        <div className="inline-flex gap-4 pr-4 md:pr-8">
          {trending.map((place, idx) => (
            <TrackedLink
              key={place.id}
              href={`/map?placeId=${place.id}`}
              event="place_select"
              params={{ place_id: place.id, source: "landing_trending" }}
              className="group bg-surface-container-low relative w-[240px] shrink-0 rounded-2xl p-5 transition-all hover:shadow-xl active:scale-[0.98] md:w-[280px]"
            >
              <span className="font-display text-display-sm text-primary/20 absolute top-4 right-4 leading-none font-extrabold">
                {idx + 1}
              </span>
              <div className="mb-8">
                <span className="text-label-xs text-on-surface-variant font-bold tracking-widest uppercase">
                  {place.region} · {place.district}
                </span>
              </div>
              <h3 className="font-display text-title-sm text-on-surface mb-1.5 line-clamp-1 pr-8 font-bold">
                {place.name}
              </h3>
              <p className="text-label-md text-on-surface-variant mb-3 line-clamp-1">
                {place.address}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {place.categories.map((c) => (
                  <CategoryBadge key={c.id} category={c.name} />
                ))}
              </div>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
