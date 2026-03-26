import Link from 'next/link'
import type { AnyEvent, TesterRecruitment } from '../types'
import { EVENT_TYPE_LABEL, EVENT_TYPE_COLOR, EVENT_TYPE_BG, RECRUITMENT_STATUS_LABEL } from '../constants'
import { getLinkedPlace } from '../utils/events'
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'

interface Props {
  event: AnyEvent
  onPlaceClick?: (placeId: string) => void
}

function isTesterRecruitment(event: AnyEvent): event is TesterRecruitment {
  return event.type === 'tester_recruitment'
}

function formatDateRange(start: string, end: string): string {
  const s = start.slice(5).replace('-', '.')
  const e = end.slice(5).replace('-', '.')
  return start === end ? s : `${s} — ${e}`
}

export default function EventCard({ event, onPlaceClick }: Props) {
  const linkedPlace = getLinkedPlace(event)

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
        <span
          className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: EVENT_TYPE_COLOR[event.type] }}
        >
          {EVENT_TYPE_LABEL[event.type]}
        </span>
        {isTesterRecruitment(event) && (
          <span
            className="px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{ backgroundColor: EVENT_TYPE_BG[event.type], color: EVENT_TYPE_COLOR[event.type] }}
          >
            {RECRUITMENT_STATUS_LABEL[event.recruitmentStatus]}
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-base text-on-surface mb-2 group-hover:text-primary transition-colors">
        {event.title}
      </h3>

      <p className="text-on-surface-variant text-sm line-clamp-2 mb-3">
        {event.description}
      </p>

      <div className="flex flex-wrap gap-3 text-xs text-outline">
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
        {isTesterRecruitment(event) && (
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {event.currentParticipants}/{event.maxParticipants}명
          </span>
        )}
      </div>

      {/* Detail link */}
      <div className="mt-3 pt-3 border-t border-outline-variant/30">
        <Link
          href={`/events/${event.id}`}
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline decoration-2 underline-offset-4"
        >
          <ExternalLink className="w-3 h-3" />
          상세보기
        </Link>
      </div>
    </div>
  )
}
