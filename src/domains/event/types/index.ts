export type {
  EventListResponse as Event,
  EventDetailResponse as EventDetail,
} from "@/shared/api/client"

// BE eventType enum
export type EventType = "TESTER_RECRUIT" | "SALE" | "EVENT_POPUP"

/** @deprecated Use `Event` instead */
export type { EventListResponse as AnyEvent } from "@/shared/api/client"
