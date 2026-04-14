import Link from "next/link";
import { fetchPlacesForLanding } from "../queries/landingApi";

const CATEGORIES = [
  {
    name: "뜨개샵",
    emoji: "🧶",
    color: "#91472b",
    bg: "#ffdbcf",
  },
  {
    name: "공방",
    emoji: "🪡",
    color: "#53624f",
    bg: "#d4e5cc",
  },
  {
    name: "뜨개카페",
    emoji: "☕",
    color: "#68594a",
    bg: "#f4dfcb",
  },
  {
    name: "손염색실",
    emoji: "🎨",
    color: "#6b5b73",
    bg: "#e8dced",
  },
  {
    name: "공예용품점",
    emoji: "✂️",
    color: "#7a6840",
    bg: "#e8dfcc",
  },
];

export default async function CategoryShortcutSection() {
  const places = await fetchPlacesForLanding();

  const counts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.name] = places.filter((p) =>
      p.categories.some((c) => c.name === cat.name),
    ).length;
    return acc;
  }, {});

  return (
    <section className="py-12 md:py-20 bg-surface">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 md:mb-10">
          <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
            BY CATEGORY
          </p>
          <h2 className="font-display font-extrabold text-headline-sm md:text-headline-md text-on-surface">
            카테고리별 탐색
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href="/map"
              className="group rounded-2xl p-5 md:p-6 transition-all hover:shadow-lg active:scale-[0.97]"
              style={{ background: cat.bg }}
            >
              <p className="text-3xl md:text-4xl mb-3">{cat.emoji}</p>
              <p
                className="font-display font-bold text-title-sm mb-1"
                style={{ color: cat.color }}
              >
                {cat.name}
              </p>
              <p
                className="text-label-sm font-medium"
                style={{ color: cat.color, opacity: 0.75 }}
              >
                {counts[cat.name] ?? 0}곳
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
