import type { AnyEvent } from '../types'
import EventCard from './EventCard'
import EmptyState from '@/shared/components/ui/EmptyState'
import { Calendar } from 'lucide-react'

interface Props {
  events: AnyEvent[]
  selectedDate: string | null
  onPlaceClick?: (placeId: string) => void
  onEventSelect?: (eventId: string) => void
}

export default function EventList({ events, selectedDate, onPlaceClick, onEventSelect }: Props) {
  if (events.length === 0) {
    return (
      <EmptyState
        title={selectedDate ? '해당 날짜에 일정이 없어요' : '일정이 없어요'}
        description="날짜를 선택하거나 필터를 변경해보세요."
        icon={<Calendar className="w-8 h-8 text-outline" />}
      />
    )
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <EventCard key={event.id} event={event} onPlaceClick={onPlaceClick} onSelect={onEventSelect} />
      ))}
    </div>
  )
}
