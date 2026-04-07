"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { getEvents } from "../queries/eventApi";
import { filterEvents, getDatesWithEvents } from "../utils/events";
import { getTodayString } from "../utils/date";
import type { Event, EventType } from "../types";

interface YearMonth {
  year: number;
  month: number;
}

export const useEventExplorer = () => {
  const today = new Date();

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [yearMonth, setYearMonth] = useState<YearMonth>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<EventType>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEvents()
      .then((events) => {
        if (!cancelled) setAllEvents(events);
      })
      .catch(() => {
        if (!cancelled) setAllEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { year: currentYear, month: currentMonth } = yearMonth;

  const datesWithEvents = useMemo(
    () => getDatesWithEvents(allEvents, currentYear, currentMonth),
    [allEvents, currentYear, currentMonth],
  );

  const filteredEvents = useMemo(
    () =>
      filterEvents(
        allEvents,
        selectedTypes.size > 0 ? selectedTypes : "all",
        selectedDate ?? undefined,
      ),
    [allEvents, selectedTypes, selectedDate],
  );

  const toggleType = useCallback((type: EventType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const clearTypes = useCallback(() => {
    setSelectedTypes(new Set());
  }, []);

  const nextMonth = useCallback(() => {
    setYearMonth((prev) =>
      prev.month === 12
        ? { year: prev.year + 1, month: 1 }
        : { year: prev.year, month: prev.month + 1 },
    );
  }, []);

  const prevMonth = useCallback(() => {
    setYearMonth((prev) =>
      prev.month === 1
        ? { year: prev.year - 1, month: 12 }
        : { year: prev.year, month: prev.month - 1 },
    );
  }, []);

  const selectDate = useCallback((date: string | null) => {
    setSelectedDate(date);
  }, []);

  const goToday = useCallback(() => {
    const now = new Date();
    setYearMonth({ year: now.getFullYear(), month: now.getMonth() + 1 });
    setSelectedDate(getTodayString());
  }, []);

  return {
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
  };
};
