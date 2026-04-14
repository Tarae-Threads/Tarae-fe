import { Suspense } from "react";
import Header from "@/domains/landing/components/Header";
import HeroEventBanner from "@/domains/landing/components/HeroEventBanner";
import TrendingPlaces from "@/domains/landing/components/TrendingPlaces";
import ActiveEventsSection from "@/domains/landing/components/ActiveEventsSection";
import CategoryShortcutSection from "@/domains/landing/components/CategoryShortcutSection";
import RegionShortcutSection from "@/domains/landing/components/RegionShortcutSection";
import BeginnerBanner from "@/domains/landing/components/BeginnerBanner";
import Footer from "@/domains/landing/components/Footer";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <HeroEventBanner />
        </Suspense>
        <Suspense fallback={null}>
          <TrendingPlaces />
        </Suspense>
        <Suspense fallback={null}>
          <ActiveEventsSection />
        </Suspense>
        <Suspense fallback={null}>
          <CategoryShortcutSection />
        </Suspense>
        <Suspense fallback={null}>
          <RegionShortcutSection />
        </Suspense>
        <BeginnerBanner />
      </main>
      <Footer />
    </div>
  );
}
