import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { fetchEventsForLanding } from "../queries/landingApi";

const EVENT_TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  TESTER_RECRUIT: {
    label: "테스터 모집",
    bg: "#ffdbcf",
    color: "#91472b",
  },
  SALE: { label: "세일", bg: "#d4e5cc", color: "#53624f" },
  EVENT_POPUP: { label: "팝업·행사", bg: "#f4dfcb", color: "#68594a" },
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default async function ActiveEventsSection() {
  const events = await fetchEventsForLanding();
  const list = events.slice(0, 6);

  if (list.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-surface-container-low">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
              NOW HAPPENING
            </p>
            <h2 className="font-display font-extrabold text-headline-sm md:text-headline-md text-on-surface">
              진행 중인 이벤트
            </h2>
          </div>
          <Link
            href="/map"
            className="inline-flex items-center gap-1 text-primary font-bold text-label-md hover:gap-2 transition-all"
          >
            <span className="hidden md:inline">전체 이벤트 보기</span>
            <span className="md:hidden">전체</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((event) => {
            const cfg = EVENT_TYPE_CONFIG[event.eventType] ?? {
              label: "이벤트",
              bg: "#e8dfcc",
              color: "#7a6840",
            };
            return (
              <Link
                key={event.id}
                href={`/map?eventId=${event.id}`}
                className="bg-surface rounded-2xl p-5 md:p-6 transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <span
                  className="inline-flex items-center gap-1.5 text-label-xs font-bold px-2.5 py-1 rounded-full mb-4"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <Calendar className="w-3 h-3" />
                  {cfg.label}
                </span>
                <h3 className="font-display font-bold text-title-sm text-on-surface mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <div className="space-y-1 text-label-md text-on-surface-variant">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {formatDate(event.startDate)}
                    {event.endDate && ` ~ ${formatDate(event.endDate)}`}
                  </p>
                  {event.locationText && (
                    <p className="flex items-center gap-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {event.locationText}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
