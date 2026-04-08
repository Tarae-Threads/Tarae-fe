"use client"

import type { Place, PlaceDetail } from "../types"
import type { Event, EventDetail, EventType } from "@/domains/event/types"
import PlaceDetailView from "./PlaceDetailView"
import EventTypeBadge from "@/domains/event/components/EventTypeBadge"
import { ChevronLeft, MapPin, ExternalLink, Calendar, Share2 } from "lucide-react"
import { shareOrCopy } from "@/shared/lib/share"

type DetailData =
  | { type: "place"; place: Place; placeDetail?: PlaceDetail | null }
  | { type: "event"; event: Event; eventDetail?: EventDetail | null }

interface Props {
  data: DetailData | null
  open: boolean
  onClose: () => void
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
      {/* Header */}
      <div className="flex-shrink-0 pt-3 px-4">
        <div className="flex justify-center pb-2">
          <div className="w-10 h-1 bg-outline-variant rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            aria-label="뒤로가기"
            className="flex items-center gap-1 text-on-surface-variant text-label-lg font-medium py-1 hover:text-on-surface transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {data && (
            <button
              onClick={() => {
                const url = data.type === "place" ? `/?placeId=${data.place.id}` : `/?eventId=${data.event.id}`
                const title = data.type === "place" ? data.place.name : data.event.title
                shareOrCopy({ title, url })
              }}
              aria-label="공유하기"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {data && (
        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-8" style={{ WebkitOverflowScrolling: "touch" }}>
          {data.type === "place" ? (
            <PlaceDetailView place={data.place} detail={data.placeDetail} />
          ) : (
            <EventContent event={data.event} detail={data.eventDetail} />
          )}
        </div>
      )}
    </div>
  )
}

/* ---- Event Content ---- */
function EventContent({ event, detail }: { event: Event; detail?: EventDetail | null }) {
  const description = detail?.description
  const locationText = detail?.locationText ?? event.locationText
  const links = detail?.links ?? event.links

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <EventTypeBadge type={event.eventType as EventType} size="md" />
        </div>
        <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-1.5">
          {event.title}
        </h2>
      </div>

      <div className="bg-surface-container rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3 text-body-sm">
          <Calendar className="w-4 h-4 text-outline" />
          <span className="text-on-surface">
            {event.startDate}{event.endDate ? ` — ${event.endDate}` : ""}
          </span>
        </div>
        {locationText && (
          <div className="flex items-center gap-3 text-body-sm">
            <MapPin className="w-4 h-4 text-outline" />
            <span className="text-on-surface">{locationText}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-body-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}

      {links && (
        <a
          href={links}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-primary" />
          <span className="flex-1 text-label-lg font-medium text-on-surface">자세히 보기</span>
          <span className="text-outline">→</span>
        </a>
      )}
    </div>
  )
}
