import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BeginnerBanner() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <Link
          href="/map"
          className="group flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg active:scale-[0.99]"
        >
          <div className="flex items-start md:items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-fixed shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-title-sm text-on-surface mb-1">
                뜨개가 처음이신가요?
              </p>
              <p className="text-body-sm text-on-surface-variant">
                가까운 공방에서 원데이 클래스부터 시작해보세요.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-primary font-bold text-label-md group-hover:gap-2.5 transition-all md:shrink-0">
            장소 찾아보기 <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
