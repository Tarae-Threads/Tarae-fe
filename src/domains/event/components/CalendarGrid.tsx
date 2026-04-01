'use client'

import { useMemo, useState } from 'react'
import type { EventType } from '../types'
import { WEEKDAY_NAMES, EVENT_TYPE_COLOR, EVENT_TYPE_BG } from '../constants'
import { getTodayString } from '../utils/date'
import { getEventBarsForMonth } from '../utils/events'
import type { CalendarBar } from '../utils/events'
import { ChevronLeft, ChevronRight, Undo2 } from 'lucide-react'

const VISIBLE_BARS = 3

interface Props {
  year: number
  month: number
  selectedDate: string | null
  datesWithEvents: Map<string, EventType[]>
  onSelectDate: (date: string | null) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday?: () => void
  onEventSelect?: (eventId: string) => void
}

export default function CalendarGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onEventSelect,
}: Props) {
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const todayStr = getTodayString()
  const today = new Date()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7)
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const eventBars = useMemo(
    () => getEventBarsForMonth(year, month),
    [year, month],
  )

  return (
    <div className="bg-surface-container-low rounded-3xl p-5 editorial-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={onPrevMonth} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <h3 className="font-display font-extrabold text-title-lg text-on-surface">
            {year}년 {month}월
          </h3>
          {!isCurrentMonth && onToday && (
            <button onClick={onToday} aria-label="오늘로 이동" className="p-1.5 text-secondary hover:bg-secondary-container rounded-full transition-colors">
              <Undo2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={onNextMonth} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_NAMES.map(day => (
          <div key={day} className="text-center text-label-sm font-bold text-outline uppercase tracking-widest py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Week rows */}
      {weeks.map((week, weekIdx) => {
        const bars = eventBars[weekIdx] || []
        const isExpanded = expandedWeek === weekIdx
        const visibleBars = isExpanded ? bars : bars.slice(0, VISIBLE_BARS)
        const hiddenCount = bars.length - VISIBLE_BARS

        return (
          <div key={weekIdx}>
            {/* Date row */}
            <div className="grid grid-cols-7">
              {week.map((day, colIdx) => {
                if (day === null) return <div key={`empty-${weekIdx}-${colIdx}`} />

                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isSelected = selectedDate === dateStr
                const isToday = dateStr === todayStr

                return (
                  <button
                    key={dateStr}
                    onClick={() => onSelectDate(isSelected ? null : dateStr)}
                    className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-primary text-white'
                        : isToday
                          ? 'bg-primary-fixed text-primary'
                          : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <span className="text-label-lg font-bold">{day}</span>
                  </button>
                )
              })}
            </div>

            {/* Event bars */}
            {bars.length > 0 && (
              <div className="relative mt-0.5 mb-1" style={{ height: visibleBars.length * 18 + (hiddenCount > 0 && !isExpanded ? 16 : 0) }}>
                {visibleBars.map((bar, barIdx) => (
                  <EventBar key={`${bar.id}-${weekIdx}`} bar={bar} row={barIdx} onSelect={onEventSelect} />
                ))}
                {hiddenCount > 0 && !isExpanded && (
                  <button
                    onClick={() => setExpandedWeek(weekIdx)}
                    className="absolute left-0 text-label-2xs font-bold text-outline hover:text-primary transition-colors"
                    style={{ top: VISIBLE_BARS * 18 }}
                  >
                    +{hiddenCount}개 더보기
                  </button>
                )}
                {isExpanded && hiddenCount > 0 && (
                  <button
                    onClick={() => setExpandedWeek(null)}
                    className="absolute left-0 text-label-2xs font-bold text-outline hover:text-primary transition-colors"
                    style={{ top: bars.length * 18 }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EventBar({ bar, row, onSelect }: { bar: CalendarBar; row: number; onSelect?: (id: string) => void }) {
  const left = `${(bar.startCol / 7) * 100}%`
  const width = `${(bar.span / 7) * 100}%`

  return (
    <div
      onClick={() => onSelect?.(bar.id)}
      className="absolute rounded-sm px-1 overflow-hidden whitespace-nowrap text-label-2xs font-bold truncate cursor-pointer hover:opacity-80 transition-opacity"
      style={{
        left,
        width,
        top: row * 18,
        height: 16,
        lineHeight: '16px',
        backgroundColor: EVENT_TYPE_BG[bar.type],
        color: EVENT_TYPE_COLOR[bar.type],
      }}
    >
      {bar.title}
    </div>
  )
}
