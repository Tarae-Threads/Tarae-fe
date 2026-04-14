"use client";

import { useState } from "react";
import type { Place, PlaceDetail } from "../types";
import PlaceDetailView from "./PlaceDetailView";
import DetailTabs from "@/shared/components/ui/DetailTabs";
import ReviewSection from "@/domains/review/components/ReviewSection";

interface Props {
  place: Place;
  detail?: PlaceDetail | null;
}

type TabId = "info" | "reviews";

export default function PlaceDetailTabs({ place, detail }: Props) {
  const [active, setActive] = useState<TabId>("info");

  return (
    <>
      <DetailTabs
        tabs={[
          { id: "info", label: "정보" },
          { id: "reviews", label: "리뷰" },
        ]}
        activeId={active}
        onChange={(id) => setActive(id as TabId)}
      />
      <div className="pt-5">
        {active === "info" ? (
          <PlaceDetailView place={place} detail={detail} />
        ) : (
          <ReviewSection type="place" targetId={place.id} />
        )}
      </div>
    </>
  );
}
