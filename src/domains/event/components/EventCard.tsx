import Link from 'next/link'
import type { AnyEvent } from '../types'
import { isTesterRecruitment } from '../utils/typeGuards'
import { formatDateRange } from '../utils/date'
import { getLinkedPlace } from '../utils/events'
import EventTypeBadge from './EventTypeBadge'
import RecruitmentStatusBadge from './RecruitmentStatusBadge'
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'

interface Props {
  event: AnyEvent
  onPlaceClick?: (placeId: string) => void
}

export default function EventCard({ event, onPlaceClick }: Props) {
  const linkedPlace = getLinkedPlace(event)
  const isRecruitment = isTesterRecruitment(event)

  const handleClick = () => {
    if (linkedPlace && onPlaceClick) {
      onPlaceClick(linkedPlace.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-surface-container-high rounded-2xl p-5 editorial-shadow hover:shadow-xl transition-all group ${linkedPlace && onPlaceClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <EventTypeBadge type={event.type} />
        {isRecruitment && <RecruitmentStatusBadge status={event.recruitmentStatus} />}
      </div>

      <h3 className="font-display font-bold text-body-lg text-on-surface mb-2 group-hover:text-primary transition-colors">
        {event.title}
      </h3>

      <p className="text-on-surface-variant text-body-sm line-clamp-2 mb-3">
        {event.description}
      </p>

      <div className="flex flex-wrap gap-3 text-label-md text-outline">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDateRange(event.startDate, event.endDate)}
        </span>
        {(linkedPlace || event.location) && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {linkedPlace ? (
              <span className="text-primary font-medium">{linkedPlace.name}</span>
            ) : (
              event.location
            )}
          </span>
        )}
        {isRecruitment && (
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {event.currentParticipants}/{event.maxParticipants}명
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-outline-variant/30">
        <Link
          href={`/events/${event.id}`}
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-label-md text-primary font-bold hover:underline decoration-2 underline-offset-4"
        >
          <ExternalLink className="w-3 h-3" />
          상세보기
        </Link>
      </div>
    </div>
  )
}
