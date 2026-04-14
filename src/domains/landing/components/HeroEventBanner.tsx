import Link from "next/link";
import { MapPin, ArrowRight, Calendar } from "lucide-react";
import { fetchEventsForLanding } from "../queries/landingApi";

const EVENT_TYPE_LABEL: Record<string, string> = {
  TESTER_RECRUIT: "테스터 모집",
  SALE: "세일",
  EVENT_POPUP: "팝업·행사",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function HeroEventBanner() {
  const events = await fetchEventsForLanding();
  const featured = events.slice(0, 1)[0];

  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-20 w-[520px] h-[520px] rounded-full bg-primary-fixed/50 blur-3xl opacity-60"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-24 w-[460px] h-[460px] rounded-full bg-secondary-container/70 blur-3xl opacity-60"
      />

      <div className="relative container mx-auto px-4 md:px-8 py-10 md:py-16">
        {featured ? (
          <Link
            href={`/map?eventId=${featured.id}`}
            className="group block relative overflow-hidden rounded-3xl signature-gradient p-8 md:p-14 min-h-[280px] md:min-h-[360px] flex flex-col justify-end editorial-shadow"
          >
            <div
              aria-hidden="true"
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white font-bold text-label-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                <Calendar className="w-3.5 h-3.5" />
                {EVENT_TYPE_LABEL[featured.eventType] ?? "이벤트"}
              </span>
              <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-white mb-3 leading-tight line-clamp-2">
                {featured.title}
              </h1>
              <p className="text-body-lg text-white/85 mb-6">
                {formatDate(featured.startDate)}
                {featured.endDate && ` ~ ${formatDate(featured.endDate)}`}
                {featured.locationText && ` · ${featured.locationText}`}
              </p>
              <span className="inline-flex items-center gap-1.5 text-white font-bold text-label-lg group-hover:gap-2.5 transition-all">
                자세히 보기 <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-8 md:p-14 min-h-[280px] md:min-h-[360px] flex flex-col justify-center editorial-shadow">
            <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-4">
              뜨개인을 위한 플랫폼
            </p>
            <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface mb-4 leading-tight">
              흩어져 있는 뜨개 정보를 <br className="hidden md:block" />
              한 곳에서.
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl">
              실 가게·공방·뜨개카페부터 이벤트·세일까지 지도에서 한눈에.
            </p>
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 signature-gradient text-white font-bold text-label-lg px-7 py-4 rounded-2xl shadow-lg shadow-primary/25 active:scale-95 transition-transform w-fit"
            >
              <MapPin className="w-5 h-5" />
              지도 탐색하기
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
