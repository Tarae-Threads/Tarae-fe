"use client";

import type { Place, PlaceDetail } from "../types";
import type { Event, EventDetail } from "@/domains/event/types";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import EventTypeBadge from "@/domains/event/components/EventTypeBadge";
import TagChip from "@/shared/components/ui/TagChip";
import {
  ChevronLeft,
  MapPin,
  ExternalLink,
  Globe,
  Calendar,
} from "lucide-react";
import type { EventType } from "@/domains/event/types";

type DetailData =
  | { type: "place"; place: Place; placeDetail?: PlaceDetail | null }
  | { type: "event"; event: Event; eventDetail?: EventDetail | null };

interface Props {
  data: DetailData | null;
  open: boolean;
  onClose: () => void;
}

export default function PlacePanel({ data, open, onClose }: Props) {
  return (
    <div
      role="dialog"
      aria-label="상세 정보"
      className={`fixed bottom-[48px] left-0 w-full z-40 flex flex-col bg-surface-container-low rounded-t-[2rem] shadow-[0_-12px_48px_rgba(29,27,22,0.15)] transition-transform duration-300 ease-out ${
        open && data ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ height: "50vh" }}
    >
      {/* Header — 뒤로가기 */}
      <div className="flex-shrink-0 pt-3 px-4">
        <div className="flex justify-center pb-2">
          <div className="w-10 h-1 bg-outline-variant rounded-full" />
        </div>
        <button
          onClick={onClose}
          aria-label="뒤로가기"
          className="flex items-center gap-1 text-on-surface-variant text-label-lg font-medium py-1 hover:text-on-surface transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      {data && (
        <div
          className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-8"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="max-w-2xl mx-auto">
            {data.type === "place" ? (
              <PlaceContent place={data.place} detail={data.placeDetail} />
            ) : (
              <EventContent event={data.event} detail={data.eventDetail} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Place Content ---- */
function PlaceContent({
  place,
  detail,
}: {
  place: Place;
  detail?: PlaceDetail | null;
}) {
  const categories = detail?.categories ?? place.categories;
  const tags = detail?.tags ?? place.tags;
  const instagramUrl = detail?.instagramUrl ?? place.instagramUrl;
  const websiteUrl = detail?.websiteUrl;
  const naverMapUrl = detail?.naverMapUrl ?? place.naverMapUrl;

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-display text-headline-sm font-extrabold tracking-editorial text-on-surface">
          {place.name}
        </h2>
        {categories.map((cat) => (
          <CategoryBadge key={cat.id} category={cat.name} size="md" />
        ))}
        <StatusBadge status={place.status} />
      </div>

      <p className="text-on-surface-variant text-body-sm flex items-center gap-1.5 mb-5">
        <MapPin className="w-3.5 h-3.5" />
        {place.address}
      </p>

      {/* 상세 정보 */}
      {detail && (
        <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
          {detail.hoursText && (
            <div className="flex items-start gap-2.5 text-body-sm">
              <span className="font-medium text-on-surface shrink-0">
                영업시간
              </span>
              <span className="text-on-surface-variant">
                {detail.hoursText}
              </span>
            </div>
          )}
          {detail.closedDays && (
            <div className="flex items-start gap-2.5 text-body-sm">
              <span className="font-medium text-on-surface shrink-0">
                휴무일
              </span>
              <span className="text-on-surface-variant">
                {detail.closedDays}
              </span>
            </div>
          )}
          {detail.description && (
            <div className="flex items-start gap-2.5 text-body-sm">
              <span className="font-medium text-on-surface shrink-0">설명</span>
              <span className="text-on-surface-variant">
                {detail.description}
              </span>
            </div>
          )}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags.map((tag) => (
            <TagChip key={tag.id} label={tag.name} size="md" />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-5">
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-label-lg text-primary font-medium hover:underline decoration-2 underline-offset-4"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Instagram
          </a>
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-label-lg text-primary font-medium hover:underline decoration-2 underline-offset-4"
          >
            <ExternalLink className="w-3.5 h-3.5" /> 웹사이트
          </a>
        )}
        {naverMapUrl && (
          <a
            href={naverMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-label-lg text-primary font-medium hover:underline decoration-2 underline-offset-4"
          >
            <Globe className="w-3.5 h-3.5" /> 네이버 지도
          </a>
        )}
      </div>
    </>
  );
}

/* ---- Event Content ---- */
function EventContent({
  event,
  detail,
}: {
  event: Event;
  detail?: EventDetail | null;
}) {
  const description = detail?.description;
  const locationText = detail?.locationText ?? event.locationText;
  const links = detail?.links ?? event.links;

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <EventTypeBadge type={event.eventType as EventType} size="md" />
      </div>

      <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-2">
        {event.title}
      </h2>

      <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
        <div className="flex items-center gap-2.5 text-body-sm">
          <Calendar className="w-4 h-4 text-outline" />
          <span className="text-on-surface-variant">
            {event.startDate}
            {event.endDate ? ` — ${event.endDate}` : ""}
          </span>
        </div>
        {locationText && (
          <div className="flex items-center gap-2.5 text-body-sm">
            <MapPin className="w-4 h-4 text-outline" />
            <span className="text-on-surface-variant">{locationText}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-body-sm text-on-surface-variant mb-5 whitespace-pre-line">
          {description}
        </p>
      )}

      {links && (
        <a
          href={links}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-bold text-label-lg hover:underline decoration-2 underline-offset-4"
        >
          <ExternalLink className="w-4 h-4" /> 자세히 보기
        </a>
      )}
    </>
  );
}
