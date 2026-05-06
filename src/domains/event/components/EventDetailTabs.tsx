"use client";

import { useState } from "react";
import type { Event, EventDetail } from "../types";
import EventDetailView from "./EventDetailView";
import DetailTabs from "@/shared/components/ui/DetailTabs";
import ReviewSection from "@/domains/review/components/ReviewSection";
import { track } from "@/shared/lib/analytics";

interface Props {
  event: Event;
  detail?: EventDetail | null;
}

type TabId = "info" | "reviews";

export default function EventDetailTabs({ event, detail }: Props) {
  const [active, setActive] = useState<TabId>("info");
  const [reviewCount, setReviewCount] = useState<number | undefined>(undefined);

  return (
    <>
      <DetailTabs
        tabs={[
          { id: "info", label: "정보" },
          { id: "reviews", label: "리뷰", count: reviewCount },
        ]}
        activeId={active}
        onChange={(id) => {
          setActive(id as TabId);
          track("detail_tab_change", { target: "event", tab: id });
        }}
      />
      <div className="pt-5">
        {active === "info" && <EventDetailView event={event} detail={detail} />}
        {/* 리뷰는 탭 진입 전에도 카운트 노출 위해 항상 마운트 — 비활성 시 시각만 숨김 */}
        <div className={active === "reviews" ? "" : "hidden"}>
          <ReviewSection
            type="event"
            targetId={event.id}
            onCountChange={setReviewCount}
          />
        </div>
      </div>
    </>
  );
}
