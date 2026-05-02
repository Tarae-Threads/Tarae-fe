import { Suspense } from "react";
import Header from "@/domains/landing/components/Header";
import HomeBannerCarousel from "@/domains/landing/components/HomeBannerCarousel";
import TrendingPlaces from "@/domains/landing/components/TrendingPlaces";
import TrendingStores from "@/domains/landing/components/TrendingStores";
import ActiveEventsSection from "@/domains/landing/components/ActiveEventsSection";
import CategoryShortcutSection from "@/domains/landing/components/CategoryShortcutSection";
import RegionShortcutSection from "@/domains/landing/components/RegionShortcutSection";
import BeginnerBanner from "@/domains/landing/components/BeginnerBanner";
import InquiryBanner from "@/domains/landing/components/InquiryBanner";
import InspireVideosSection from "@/domains/landing/components/InspireVideosSection";
import LatestNewsSection from "@/domains/news/components/LatestNewsSection";
import Footer from "@/domains/landing/components/Footer";
import PopupBanner from "@/domains/landing/components/PopupBanner";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface md:pl-16 pb-20 md:pb-0">
      <Header />
      <main className="flex-1">
        <HomeBannerCarousel />
        <InspireVideosSection />
        <Suspense fallback={null}>
          <TrendingPlaces />
        </Suspense>
        <Suspense fallback={null}>
          <TrendingStores />
        </Suspense>
        <Suspense fallback={null}>
          <ActiveEventsSection />
        </Suspense>
        <Suspense fallback={null}>
          <LatestNewsSection />
        </Suspense>
        <Suspense fallback={null}>
          <CategoryShortcutSection />
        </Suspense>
        <Suspense fallback={null}>
          <RegionShortcutSection />
        </Suspense>
        <BeginnerBanner />
        <InquiryBanner />
      </main>
      <Footer />
      <PopupBanner />
    </div>
  );
}
