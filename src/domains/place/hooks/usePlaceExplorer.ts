"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { getPlaces, filterPlaces } from "../utils/places";
import type { Place, PlaceCategory } from "../types";

export function usePlaceExplorer(initialPlaceId: string | null) {
  const allPlaces = getPlaces();

  const [selectedCategories, setSelectedCategories] = useState<
    Set<PlaceCategory>
  >(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(
    initialPlaceId
      ? (allPlaces.find((p) => p.id === initialPlaceId) ?? null)
      : null,
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
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

  const toggleCategory = useCallback((category: PlaceCategory) => {
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

  const filteredPlaces = useMemo(
    () =>
      filterPlaces(
        allPlaces,
        selectedCategories.size > 0 ? selectedCategories : "all",
        selectedRegion,
        debouncedQuery,
      ),
    [allPlaces, selectedCategories, selectedRegion, debouncedQuery],
  );

  // Viewport filter
  const [viewportBounds, setViewportBounds] = useState<{
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  } | null>(null);

  const displayPlaces = useMemo(() => {
    if (!viewportBounds) return filteredPlaces;
    const { sw, ne } = viewportBounds;
    return filteredPlaces.filter(
      (p) => p.lat >= sw.lat && p.lat <= ne.lat && p.lng >= sw.lng && p.lng <= ne.lng,
    );
  }, [filteredPlaces, viewportBounds]);

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

  return {
    // data
    filteredPlaces,
    displayPlaces,
    selectedPlace,
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
  };
}
