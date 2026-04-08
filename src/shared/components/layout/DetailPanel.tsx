"use client"

import type { Place, PlaceDetail } from "@/domains/place/types"
import type { Event, EventDetail, EventType } from "@/domains/event/types"
import PlaceDetailView from "@/domains/place/components/PlaceDetailView"
import EventTypeBadge from "@/domains/event/components/EventTypeBadge"
import {
  X,
  MapPin,
  ExternalLink,
  Calendar,
  Share2,
} from "lucide-react"
import { shareOrCopy } from "@/shared/lib/share"

type DetailData =
  | { type: "place"; place: Place; placeDetail?: PlaceDetail | null }
  | { type: "event"; event: Event; eventDetail?: EventDetail | null }

interface Props {
  data: DetailData
  onClose: () => void
}

export default function DetailPanel({ data, onClose }: Props) {
  return (
    <div className="hidden md:flex flex-col w-[380px] shrink-0 h-full bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex justify-end gap-1 px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={() => {
            const url = data.type === "place" ? `/?placeId=${data.place.id}` : `/?eventId=${data.event.id}`
            const title = data.type === "place" ? data.place.name : data.event.title
            shareOrCopy({ title, url })
          }}
          aria-label="공유하기"
          className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
        >
          <Share2 className="w-5 h-5 text-outline" />
        </button>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-outline" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6">
        {data.type === "place" ? (
          <PlaceDetailView place={data.place} detail={data.placeDetail} />
        ) : (
          <EventDetailContent event={data.event} detail={data.eventDetail} />
        )}
      </div>
    </div>
  )
}

/* ---- Event Detail ---- */
function EventDetailContent({ event, detail }: { event: Event; detail?: EventDetail | null }) {
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

      {/* Info */}
      <div className="bg-surface-container rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3 text-body-sm">
          <Calendar className="w-4 h-4 text-outline" />
          <span className="text-on-surface">
            {event.startDate}
            {event.endDate && ` — ${event.endDate}`}
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors group"
        >
          <ExternalLink className="w-4 h-4 text-primary" />
          <span className="flex-1 text-label-lg font-medium text-on-surface">자세히 보기</span>
          <span className="w-4 h-4 text-outline group-hover:text-on-surface-variant transition-colors">→</span>
        </a>
      )}
    </div>
  )
}
