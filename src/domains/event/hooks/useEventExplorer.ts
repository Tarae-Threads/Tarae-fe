"use client";

import { useState, useMemo, useCallback } from "react";
import { getEvents, filterEvents, getDatesWithEvents } from "../utils/events";
import type { EventType } from "../types";

export function useEventExplorer() {
  const allEvents = getEvents();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<EventType>>(new Set());

  const datesWithEvents = useMemo(
    () => getDatesWithEvents(currentYear, currentMonth),
    [currentYear, currentMonth],
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
    setCurrentMonth((prev) => {
      if (prev === 12) {
        setCurrentYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
  }, [setCurrentYear]);

  const prevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 1) {
        setCurrentYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
  }, [setCurrentYear]);

  const selectDate = useCallback((date: string | null) => {
    setSelectedDate(date);
  }, []);

  const goToday = useCallback(() => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    setSelectedDate(todayStr);
  }, [setCurrentYear, setCurrentMonth, setSelectedDate]);

  return {
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
}
