"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { getPlaces } from "@/domains/place/queries/placeApi";
import type { Place } from "../types";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const usePlaceExplorer = (initialPlaceId: string | null) => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "distance">("name-asc");
  const [selectedCategories, setSelectedCategories] = useState<
    Set<string>
  >(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch places from API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPlaces()
      .then((data) => {
        if (!cancelled) {
          setAllPlaces(data);
          if (initialPlaceId) {
            const found = data.find((p) => String(p.id) === initialPlaceId);
            if (found) {
              setSelectedPlace(found);
              setPanelOpen(true);
            }
          }
        }
      })
      .catch(() => {
        // Error is handled by apiClient interceptor (toast)
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get user location once → 위치 허용 시 가까운순 기본 정렬
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortBy("distance");
      },
      () => {}, // silently fail
      { maximumAge: 300000 },
    );
  }, []);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, [setSelectedCategories]);

  const clearCategories = useCallback(() => {
    setSelectedCategories(new Set());
  }, [setSelectedCategories]);

  const filteredPlaces = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const qNoSpace = q.replace(/\s+/g, "");
    const hasCategories = selectedCategories.size > 0;

    return allPlaces.filter((place) => {
      if (hasCategories) {
        const placeCategories = place.categories.map((c) => c.name);
        if (!placeCategories.some((name) => selectedCategories.has(name))) return false;
      }
      if (selectedRegion !== "all" && place.region !== selectedRegion) return false;
      if (q) {
        const haystack = [
          place.name,
          place.address,
          place.district,
          ...place.tags.map((t) => t.name),
          ...place.brands.map((b) => b.name),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q) && !haystack.replace(/\s+/g, "").includes(qNoSpace)) return false;
      }
      return true;
    });
  }, [allPlaces, selectedCategories, selectedRegion, debouncedQuery]);

  // Viewport filter
  const [viewportBounds, setViewportBounds] = useState<{
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  } | null>(null);

  const displayPlaces = useMemo(() => {
    let result = filteredPlaces;

    // 뷰포트 필터
    if (viewportBounds) {
      const { sw, ne } = viewportBounds;
      result = result.filter((p) => {
        if (p.lat == null || p.lng == null) return true;
        return p.lat >= sw.lat && p.lat <= ne.lat && p.lng >= sw.lng && p.lng <= ne.lng;
      });
    }

    // 정렬
    const sorted = [...result];
    if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "ko"));
    } else if (sortBy === "distance" && userLocation) {
      sorted.sort((a, b) => {
        const distA = a.lat != null && a.lng != null ? haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng) : Infinity;
        const distB = b.lat != null && b.lng != null ? haversineKm(userLocation.lat, userLocation.lng, b.lat, b.lng) : Infinity;
        return distA - distB;
      });
    }

    return sorted;
  }, [filteredPlaces, viewportBounds, sortBy, userLocation]);

  // Clear viewport filter when other filters change
  useEffect(() => {
    setViewportBounds(null);
  }, [selectedCategories, selectedRegion, debouncedQuery]);

  const activateViewportFilter = useCallback(
    (bounds: { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } }) => {
      setViewportBounds(bounds);
    },
    [],
  );

  const clearViewportFilter = useCallback(() => {
    setViewportBounds(null);
  }, []);

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place);
    setPanelOpen(true);
  }, []);

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const toggleFilter = useCallback(() => {
    setFilterOpen((prev) => !prev);
  }, []);

  const getDistance = useCallback((place: Place) => {
    if (!userLocation) return null;
    if (place.lat == null || place.lng == null) return null;
    const { lat, lng } = place;
    return haversineKm(userLocation.lat, userLocation.lng, lat, lng);
  }, [userLocation]);

  return {
    // data
    filteredPlaces,
    displayPlaces,
    selectedPlace,
    loading,
    // filter state
    selectedCategories,
    toggleCategory,
    clearCategories,
    selectedRegion,
    setSelectedRegion,
    searchQuery,
    setSearchQuery,
    // viewport filter
    viewportFilterActive: viewportBounds !== null,
    activateViewportFilter,
    clearViewportFilter,
    // panel state
    panelOpen,
    filterOpen,
    sidePanelOpen,
    setSidePanelOpen,
    // actions
    handlePlaceSelect,
    handlePanelClose,
    toggleFilter,
    // sort
    sortBy,
    setSortBy,
    // distance
    userLocation,
    getDistance,
  };
}
