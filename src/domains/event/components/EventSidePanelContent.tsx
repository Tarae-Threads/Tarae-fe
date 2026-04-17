"use client";

import { useEventExplorer } from "../hooks/useEventExplorer";
import CalendarGrid from "./CalendarGrid";
import EventTypeFilter from "./EventTypeFilter";
import EventList from "./EventList";

interface Props {
  onEventSelect?: (eventId: number) => void;
  selectedEventId?: number | null;
  searchQuery?: string;
}

export default function EventSidePanelContent({
  onEventSelect,
  selectedEventId,
  searchQuery,
}: Props) {
  const {
    allEvents,
    loading,
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
  } = useEventExplorer(searchQuery);

  return (
    <div className="px-5 py-3 space-y-4">
      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        selectedDate={selectedDate}
        datesWithEvents={datesWithEvents}
        events={allEvents}
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
          <h2 className="font-display text-title-sm font-extrabold tracking-tight text-on-surface">
            {selectedDate
              ? `${selectedDate.slice(5).replace("-", "월 ")}일`
              : "전체 일정"}
          </h2>
          <p className="text-label-md text-outline font-medium">
            {filteredEvents.length}개 일정
          </p>
        </div>
        <EventList
          events={filteredEvents}
          selectedDate={selectedDate}
          onEventSelect={onEventSelect}
          selectedEventId={selectedEventId}
        />
      </div>
    </div>
  );
}
