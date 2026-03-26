'use client'

import type { EventType } from '../types'
import { WEEKDAY_NAMES, EVENT_TYPE_COLOR } from '../constants'
import { Undo2 } from 'lucide-react'

interface Props {
  year: number
  month: number
  selectedDate: string | null
  datesWithEvents: Map<string, EventType[]>
  onSelectDate: (date: string | null) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday?: () => void
}

export default function CalendarGrid({
  year,
  month,
  selectedDate,
  datesWithEvents,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: Props) {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="bg-surface-container-low rounded-3xl p-5 editorial-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onPrevMonth} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <h3 className="font-display font-extrabold text-title-lg text-on-surface">
            {year}년 {month}월
          </h3>
          {!isCurrentMonth && onToday && (
            <button
              onClick={onToday}
              aria-label="오늘로 이동"
              className="p-1.5 text-secondary hover:bg-secondary-container rounded-full transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={onNextMonth} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_NAMES.map(day => (
          <div key={day} className="text-center text-[11px] font-bold text-outline uppercase tracking-widest py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === todayStr
          const eventTypes = datesWithEvents.get(dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={`relative flex flex-col items-center py-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-primary text-white'
                  : isToday
                    ? 'bg-primary-fixed text-primary'
                    : 'hover:bg-surface-container text-on-surface'
              }`}
            >
              <span className="text-label-lg font-bold">{day}</span>
              {eventTypes && eventTypes.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {eventTypes.slice(0, 3).map(type => (
                    <span
                      key={type}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isSelected ? '#ffffff' : EVENT_TYPE_COLOR[type] }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
