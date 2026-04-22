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

type SortBy = "name-asc" | "name-desc" | "distance";

// locationText 자유 입력 대응 — 중복표기(충청북도/충북 등)도 같은 지역으로 취급
const REGION_ALIASES: Record<string, string[]> = {
  서울: ["서울"],
  경기: ["경기"],
  인천: ["인천"],
  강원: ["강원"],
  충청: ["충청", "충북", "충남", "세종", "대전"],
  경상: ["경상", "경북", "경남", "대구", "부산", "울산"],
  전라: ["전라", "전북", "전남", "광주"],
  제주: ["제주"],
};

function matchesRegion(locationText: string | undefined, region: string): boolean {
  if (!locationText) return false;
  const aliases = REGION_ALIASES[region] ?? [region];
  return aliases.some((a) => locationText.includes(a));
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface UseEventExplorerOptions {
  selectedRegion?: string;
  sortBy?: SortBy;
  userLocation?: { lat: number; lng: number } | null;
}

export const useEventExplorer = (
  searchQuery?: string,
  options?: UseEventExplorerOptions,
) => {
  const selectedRegion = options?.selectedRegion ?? "all";
  const sortBy = options?.sortBy ?? "name-asc";
  const userLocation = options?.userLocation ?? null;
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

  const filteredEvents = useMemo(() => {
    let result = filterEvents(
      allEvents,
      selectedTypes.size > 0 ? selectedTypes : "all",
      selectedDate ?? undefined,
    );
    if (selectedRegion !== "all") {
      result = result.filter((e) => matchesRegion(e.locationText, selectedRegion));
    }
    if (searchQuery?.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const qNoSpace = q.replace(/\s+/g, "");
      result = result.filter((e) => {
        const haystack = [e.title, e.locationText ?? ""]
          .join(" ")
          .toLowerCase();
        return (
          haystack.includes(q) ||
          haystack.replace(/\s+/g, "").includes(qNoSpace)
        );
      });
    }
    // 정렬
    const sorted = [...result];
    if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title, "ko"));
    } else if (sortBy === "distance" && userLocation) {
      sorted.sort((a, b) => {
        const dA =
          a.lat != null && a.lng != null
            ? haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng)
            : Infinity;
        const dB =
          b.lat != null && b.lng != null
            ? haversineKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
            : Infinity;
        return dA - dB;
      });
    }
    return sorted;
  }, [allEvents, selectedTypes, selectedDate, searchQuery, selectedRegion, sortBy, userLocation]);

  // 리스트용: 오늘 기준 진행중인 이벤트만
  const activeFilteredEvents = useMemo(() => {
    const todayStr = getTodayString();
    return filteredEvents.filter((e) => (e.endDate ?? e.startDate) >= todayStr);
  }, [filteredEvents]);

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
    activeFilteredEvents,
    toggleType,
    clearTypes,
    nextMonth,
    prevMonth,
    selectDate,
    goToday,
  };
};
