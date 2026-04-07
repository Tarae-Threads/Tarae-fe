import type { Event } from '../types'
import { formatDateRange } from '../utils/date'
import EventTypeBadge from './EventTypeBadge'
import { Calendar, MapPin } from 'lucide-react'

interface Props {
  event: Event
  onSelect?: (eventId: number) => void
}

export default function EventCard({ event, onSelect }: Props) {
  const endDate = event.endDate ?? event.startDate

  return (
    <div
      onClick={() => onSelect?.(event.id)}
      className="bg-surface-container-high rounded-2xl p-5 editorial-shadow hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-3">
        <EventTypeBadge type={event.eventType as import('../types').EventType} />
      </div>

      <h3 className="font-display font-bold text-body-lg text-on-surface mb-2 group-hover:text-primary transition-colors">
        {event.title}
      </h3>

      <div className="flex flex-wrap gap-3 text-label-md text-outline">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDateRange(event.startDate, endDate)}
        </span>
        {event.locationText && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.locationText}
          </span>
        )}
      </div>
    </div>
  )
}
