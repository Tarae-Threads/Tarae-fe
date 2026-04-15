import { MapPin } from "lucide-react";
import { fetchPlacesForLanding } from "../queries/landingApi";
import TrackedLink from "@/shared/components/analytics/TrackedLink";

const REGIONS = ["서울", "경기", "인천", "강원", "충청", "경상", "전라", "제주"];

export default async function RegionShortcutSection() {
  const places = await fetchPlacesForLanding();

  const counts = REGIONS.reduce<Record<string, number>>((acc, r) => {
    acc[r] = places.filter((p) => p.region === r).length;
    return acc;
  }, {});

  return (
    <section className="py-12 md:py-20 bg-surface-container-low">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 md:mb-10">
          <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
            BY REGION
          </p>
          <h2 className="font-display font-extrabold text-headline-sm md:text-headline-md text-on-surface">
            지역별 탐색
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {REGIONS.map((region) => (
            <TrackedLink
              key={region}
              href="/map"
              event="region_shortcut_click"
              params={{ region }}
              className="bg-surface rounded-2xl p-4 md:p-5 transition-all hover:shadow-md active:scale-[0.97] flex items-center justify-between"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-display font-bold text-title-sm text-on-surface">
                  {region}
                </span>
              </span>
              <span className="text-label-md font-bold text-outline">
                {counts[region] ?? 0}
              </span>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
