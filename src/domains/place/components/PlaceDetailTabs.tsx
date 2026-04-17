"use client";

import { useState } from "react";
import type { Place, PlaceDetail } from "../types";
import PlaceDetailView from "./PlaceDetailView";
import PlaceBrandsView from "./PlaceBrandsView";
import DetailTabs from "@/shared/components/ui/DetailTabs";
import ReviewSection from "@/domains/review/components/ReviewSection";
import { track } from "@/shared/lib/analytics";

interface Props {
  place: Place;
  detail?: PlaceDetail | null;
}

type TabId = "info" | "brands" | "reviews";

export default function PlaceDetailTabs({ place, detail }: Props) {
  const [active, setActive] = useState<TabId>("info");
  const brandCount = detail?.brands.length;

  return (
    <>
      <DetailTabs
        tabs={[
          { id: "info", label: "정보" },
          { id: "reviews", label: "리뷰" },
          { id: "brands", label: "취급 브랜드", count: brandCount },
        ]}
        activeId={active}
        onChange={(id) => {
          setActive(id as TabId);
          track("detail_tab_change", { target: "place", tab: id });
        }}
      />
      <div className="pt-5">
        {active === "info" && <PlaceDetailView place={place} detail={detail} />}
        {active === "brands" && <PlaceBrandsView detail={detail} />}
        {active === "reviews" && (
          <ReviewSection type="place" targetId={place.id} />
        )}
      </div>
    </>
  );
}
