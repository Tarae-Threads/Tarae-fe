"use client"

import type { Place, PlaceDetail } from "@/domains/place/types"
import type { Event, EventDetail } from "@/domains/event/types"
import PlaceDetailTabs from "@/domains/place/components/PlaceDetailTabs"
import EventDetailTabs from "@/domains/event/components/EventDetailTabs"
import { X, Share2 } from "lucide-react"
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
          <PlaceDetailTabs place={data.place} detail={data.placeDetail} />
        ) : (
          <EventDetailTabs event={data.event} detail={data.eventDetail} />
        )}
      </div>
    </div>
  )
}
