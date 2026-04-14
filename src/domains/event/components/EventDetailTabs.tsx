"use client";

import { useState } from "react";
import type { Event, EventDetail } from "../types";
import EventDetailView from "./EventDetailView";
import DetailTabs from "@/shared/components/ui/DetailTabs";
import ReviewSection from "@/domains/review/components/ReviewSection";

interface Props {
  event: Event;
  detail?: EventDetail | null;
}

type TabId = "info" | "reviews";

export default function EventDetailTabs({ event, detail }: Props) {
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
          <EventDetailView event={event} detail={detail} />
        ) : (
          <ReviewSection type="event" targetId={event.id} />
        )}
      </div>
    </>
  );
}
