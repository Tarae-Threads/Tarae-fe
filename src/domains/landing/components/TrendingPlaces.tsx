import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchPlacesForLanding } from "../queries/landingApi";
import TrackedLink from "@/shared/components/analytics/TrackedLink";

export default async function TrendingPlaces() {
  const places = await fetchPlacesForLanding();
  const trending = places.slice(0, 8);

  if (trending.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-surface">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
              TRENDING
            </p>
            <h2 className="font-display font-extrabold text-headline-sm md:text-headline-md text-on-surface">
              요즘 뜨는 장소
            </h2>
          </div>
          <Link
            href="/map"
            className="inline-flex items-center gap-1 text-primary font-bold text-label-md hover:gap-2 transition-all"
          >
            <span className="hidden md:inline">지도에서 전체 장소 보기</span>
            <span className="md:hidden">전체 장소</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 가로 스크롤 */}
      <div className="overflow-x-auto hide-scrollbar pl-4 md:pl-8">
        <div className="inline-flex gap-4 pr-4 md:pr-8">
          {trending.map((place, idx) => (
            <TrackedLink
              key={place.id}
              href={`/map?placeId=${place.id}`}
              event="place_select"
              params={{ place_id: place.id, source: "landing_trending" }}
              className="group relative w-[240px] md:w-[280px] shrink-0 bg-surface-container-low rounded-2xl p-5 transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <span className="absolute top-4 right-4 font-display font-extrabold text-display-sm text-primary/20 leading-none">
                {idx + 1}
              </span>
              <div className="mb-8">
                <span className="text-label-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  {place.region} · {place.district}
                </span>
              </div>
              <h3 className="font-display font-bold text-title-sm text-on-surface mb-1.5 line-clamp-1 pr-8">
                {place.name}
              </h3>
              <p className="text-label-md text-on-surface-variant line-clamp-1 mb-3">
                {place.address}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {place.categories.slice(0, 2).map((c) => (
                  <span
                    key={c.id}
                    className="text-label-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
