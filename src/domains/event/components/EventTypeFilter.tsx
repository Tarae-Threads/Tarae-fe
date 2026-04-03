'use client'

import type { EventType } from '../types'
import { EVENT_TYPE_LABEL, EVENT_TYPE_COLOR } from '../constants'
import FilterChip from '@/shared/components/ui/FilterChip'

const eventTypes: EventType[] = ['tester_recruitment', 'sale', 'event_popup']

interface Props {
  selectedTypes: Set<EventType>
  onToggleType: (type: EventType) => void
  onClearTypes: () => void
}

export default function EventTypeFilter({ selectedTypes, onToggleType, onClearTypes }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip
        label="전체"
        selected={selectedTypes.size === 0}
        onClick={onClearTypes}
      />
      {eventTypes.map(type => (
        <FilterChip
          key={type}
          label={
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: EVENT_TYPE_COLOR[type] }} />
              {EVENT_TYPE_LABEL[type]}
            </span>
          }
          selected={selectedTypes.has(type)}
          onClick={() => onToggleType(type)}
        />
      ))}
    </div>
  )
}
