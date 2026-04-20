import type { Event } from '../types'
import EventCard from './EventCard'
import EmptyState from '@/shared/components/ui/EmptyState'
import { EventCardSkeleton } from '@/shared/components/ui/Skeleton'
import { Calendar } from 'lucide-react'

interface Props {
  events: Event[]
  selectedDate: string | null
  loading?: boolean
  onEventSelect?: (eventId: number) => void
  selectedEventId?: number | null
}

export default function EventList({ events, selectedDate, loading, onEventSelect, selectedEventId }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    )
  }

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
        <EventCard key={event.id} event={event} onSelect={onEventSelect} active={selectedEventId === event.id} />
      ))}
    </div>
  )
}
