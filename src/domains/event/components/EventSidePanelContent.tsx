'use client'

import { useEventExplorer } from '../hooks/useEventExplorer'
import CalendarGrid from './CalendarGrid'
import EventTypeFilter from './EventTypeFilter'
import EventList from './EventList'

interface Props {
  onEventSelect?: (eventId: string) => void
}

export default function EventSidePanelContent({ onEventSelect }: Props) {
  const {
    currentYear,
    currentMonth,
    selectedDate,
    selectedTypes,
    datesWithEvents,
    filteredEvents,
    toggleType,
    clearTypes,
    nextMonth,
    prevMonth,
    selectDate,
    goToday,
  } = useEventExplorer()

  return (
    <div className="px-5 py-3 space-y-4">
      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        selectedDate={selectedDate}
        datesWithEvents={datesWithEvents}
        onSelectDate={selectDate}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={goToday}
        onEventSelect={onEventSelect}
      />

      <EventTypeFilter
        selectedTypes={selectedTypes}
        onToggleType={toggleType}
        onClearTypes={clearTypes}
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-label-lg text-on-surface">
            {selectedDate
              ? `${selectedDate.slice(5).replace('-', '월 ')}일`
              : '전체 일정'}
          </h3>
          <span className="text-label-xs text-outline font-medium" aria-live="polite">{filteredEvents.length}개</span>
        </div>
        <EventList events={filteredEvents} selectedDate={selectedDate} onEventSelect={onEventSelect} />
      </div>
    </div>
  )
}
