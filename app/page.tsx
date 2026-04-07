"use client";

import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { NaverMapHandle } from "@/domains/place/components/NaverMap";
import { usePlaceExplorer } from "@/domains/place/hooks/usePlaceExplorer";
import { getEvents, getEvent } from "@/domains/event/queries/eventApi";
import { getPlace } from "@/domains/place/queries/placeApi";
import type { Event, EventDetail } from "@/domains/event/types";
import type { PlaceDetail } from "@/domains/place/types";
import MobileBottomSheet from "@/domains/place/components/MobileBottomSheet";
import PlacePanel from "@/domains/place/components/PlacePanel";
import MapControls from "@/domains/place/components/MapControls";
import PlaceSearchBar from "@/domains/place/components/PlaceSearchBar";
import NavBar from "@/shared/components/layout/NavBar";
import type { NavTab } from "@/shared/components/layout/NavBar";
import BasePanel from "@/shared/components/layout/BasePanel";
import DetailPanel from "@/shared/components/layout/DetailPanel";
import BottomNav from "@/shared/components/layout/BottomNav";
import SubmitForm from "@/shared/components/layout/SubmitForm";
import { useModal } from "@/shared/hooks/useModal";
import { REGION_CENTER } from "@/domains/place/constants";

const NaverMap = dynamic(() => import("@/domains/place/components/NaverMap"), {
  ssr: false,
});

function HomeContent() {
  const searchParams = useSearchParams();
  const initialPlaceId = searchParams.get("placeId");
  const mapRef = useRef<NaverMapHandle>(null);
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<NavTab>("places");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<EventDetail | null>(null);
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState<PlaceDetail | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const {
    filteredPlaces,
    displayPlaces,
    selectedPlace,
    selectedCategories,
    toggleCategory,
    clearCategories,
    selectedRegion,
    setSelectedRegion,
    searchQuery,
    setSearchQuery,
    viewportFilterActive,
    activateViewportFilter,
    clearViewportFilter,
    panelOpen,
    filterOpen,
    handlePlaceSelect,
    handlePanelClose,
    toggleFilter,
    getDistance,
  } = usePlaceExplorer(initialPlaceId);

  // Map resize on detail panel toggle
  useEffect(() => {
    const t1 = setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    const t2 = setTimeout(() => window.dispatchEvent(new Event("resize")), 150);
    const t3 = setTimeout(() => window.dispatchEvent(new Event("resize")), 320);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [panelOpen]);

  // Fetch events from API
  useEffect(() => {
    getEvents()
      .then(setAllEvents)
      .catch(() => {});
  }, []);

  const eventPlaceIds = useMemo(() => {
    // BE EventListResponse에 placeId 미포함 — 추후 추가 시 활성화
    return new Set<number>();
  }, [allEvents]);

  const eventMarkers = useMemo(() => {
    return allEvents
      .filter((e) => e.lat != null && e.lng != null)
      .map((e) => ({
        id: String(e.id),
        title: e.title,
        lat: e.lat!,
        lng: e.lng!,
      }));
  }, [allEvents]);

  useEffect(() => {
    if (selectedRegion === "all") return;
    const center = REGION_CENTER[selectedRegion];
    if (center) mapRef.current?.panTo(center.lat, center.lng, center.zoom);
  }, [selectedRegion]);

  const smartPanTo = useCallback(
    (lat: number, lng: number, minZoom: number) => {
      const currentZoom = mapRef.current?.getZoom() ?? 10;
      if (currentZoom <= 12) mapRef.current?.panTo(lat, lng, minZoom);
      else mapRef.current?.panTo(lat, lng);
    },
    [],
  );

  const fetchPlaceDetail = useCallback(
    (placeId: number) => {
      setSelectedPlaceDetail(null);
      getPlace(placeId)
        .then((detail) => setSelectedPlaceDetail(detail))
        .catch(() => {});
    },
    [],
  );

  const handleMarkerSelect = useCallback(
    (place: Parameters<typeof handlePlaceSelect>[0]) => {
      setActiveTab("places");
      setSelectedEvent(null);
      setSelectedEventDetail(null);
      handlePlaceSelect(place);
      fetchPlaceDetail(place.id);
      if (typeof place.lat === "number" && typeof place.lng === "number") {
        smartPanTo(place.lat, place.lng, 13);
      }
    },
    [handlePlaceSelect, smartPanTo, fetchPlaceDetail],
  );

  const handleListSelect = useCallback(
    (place: Parameters<typeof handlePlaceSelect>[0]) => {
      setActiveTab("places");
      setSelectedEvent(null);
      setSelectedEventDetail(null);
      handlePlaceSelect(place);
      fetchPlaceDetail(place.id);
      if (typeof place.lat === "number" && typeof place.lng === "number") {
        mapRef.current?.panTo(place.lat, place.lng, 14);
      }
    },
    [handlePlaceSelect, fetchPlaceDetail],
  );

  const handleEventSelect = useCallback(
    (eventId: number) => {
      setSelectedPlaceDetail(null);
      setSelectedEventDetail(null);

      const fromList = allEvents.find((e) => e.id === eventId);
      if (fromList) {
        setActiveTab("events");
        handlePanelClose();
        setSelectedEvent(fromList);
      }

      // 항상 상세 API 호출 (description 등 추가 정보)
      getEvent(eventId)
        .then((detail) => {
          setSelectedEventDetail(detail);
          if (!fromList) {
            setActiveTab("events");
            handlePanelClose();
            setSelectedEvent({
              id: detail.id,
              title: detail.title,
              eventType: detail.eventType,
              startDate: detail.startDate,
              endDate: detail.endDate,
              locationText: detail.locationText,
              active: detail.active,
              links: detail.links,
            });
          }
          if (typeof detail.lat === "number" && typeof detail.lng === "number") {
            smartPanTo(detail.lat, detail.lng, 13);
          }
        })
        .catch(() => {});
    },
    [allEvents, smartPanTo, handlePanelClose],
  );

  const handleDetailClose = useCallback(() => {
    handlePanelClose();
    setSelectedEvent(null);
  }, [handlePanelClose]);

  // Mobile detail data
  const mobileDetailOpen = panelOpen || !!selectedEvent;
  const mobileDetailData =
    selectedPlace && panelOpen
      ? { type: "place" as const, place: selectedPlace, placeDetail: selectedPlaceDetail }
      : selectedEvent
        ? { type: "event" as const, event: selectedEvent, eventDetail: selectedEventDetail }
        : null;

  return (
    <main className="h-screen w-full overflow-hidden bg-surface-container-lowest flex">
      {/* Desktop: NavBar + BasePanel + DetailPanel */}
      <NavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          handleDetailClose();
        }}
        onSubmit={() => openModal(SubmitForm, {}, { title: "제보하기", size: "md" })}
      />

      <BasePanel
        activeTab={activeTab}
        places={displayPlaces}
        selectedCategories={selectedCategories}
        selectedRegion={selectedRegion}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPlaceSelect={handleListSelect}
        onToggleCategory={toggleCategory}
        onClearCategories={clearCategories}
        onRegionChange={setSelectedRegion}
        onEventSelect={handleEventSelect}
        viewportFilterActive={viewportFilterActive}
        onClearViewportFilter={clearViewportFilter}
        getDistance={getDistance}
      />

      {/* Desktop Detail Panel */}
      {(() => {
        const detailData =
          selectedPlace && panelOpen
            ? { type: "place" as const, place: selectedPlace, placeDetail: selectedPlaceDetail }
            : selectedEvent
              ? { type: "event" as const, event: selectedEvent, eventDetail: selectedEventDetail }
              : null;
        return (
          <div
            className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
              detailData ? "w-[380px]" : "w-0"
            }`}
          >
            {detailData && (
              <DetailPanel data={detailData} onClose={handleDetailClose} />
            )}
          </div>
        );
      })()}

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        <NaverMap
          ref={mapRef}
          places={filteredPlaces}
          onPlaceSelect={handleMarkerSelect}
          selectedPlaceId={initialPlaceId}
          eventPlaceIds={eventPlaceIds}
          eventMarkers={eventMarkers}
          onEventMarkerSelect={(eventId: string) => handleEventSelect(Number(eventId))}
        />
        <MapControls
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onLocate={() => mapRef.current?.locate()}
        />

        {activeTab === "places" && !viewportFilterActive && (
          <button
            onClick={() => {
              const bounds = mapRef.current?.getBounds();
              if (bounds) activateViewportFilter(bounds);
            }}
            className="absolute bottom-[calc(28vh+60px)] md:bottom-8 left-1/2 -translate-x-1/2 z-20 bg-surface/90 backdrop-blur-md text-on-surface font-bold text-label-lg px-5 py-2.5 rounded-full shadow-lg border border-border hover:bg-surface transition-colors active:scale-95"
          >
            현재 지역만 보기
          </button>
        )}

        {/* Mobile UI */}
        <div className="md:hidden">
          <div className="absolute top-4 left-4 right-4 z-20">
            <PlaceSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterOpen={filterOpen}
              onToggleFilter={toggleFilter}
              selectedCategories={selectedCategories}
              selectedRegion={selectedRegion}
              onToggleCategory={toggleCategory}
              onClearCategories={clearCategories}
              onRegionChange={setSelectedRegion}
              resultCount={displayPlaces.length}
            />
          </div>

          {!mobileDetailOpen && (
            <MobileBottomSheet
              activeTab={activeTab}
              places={displayPlaces}
              onPlaceSelect={handleListSelect}
              onEventSelect={handleEventSelect}
              viewportFilterActive={viewportFilterActive}
              onClearViewportFilter={clearViewportFilter}
              hasActiveFilters={searchQuery !== '' || selectedCategories.size > 0 || selectedRegion !== 'all'}
              onClearFilters={() => { setSearchQuery(''); clearCategories(); setSelectedRegion('all'); }}
            />
          )}

          <PlacePanel
            data={mobileDetailData}
            open={mobileDetailOpen}
            onClose={handleDetailClose}
          />
        </div>
      </div>

      {/* Mobile BottomNav */}
      <div className="md:hidden">
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            handleDetailClose();
          }}
          onSubmit={() => openModal(SubmitForm, {}, { title: "제보하기", size: "md" })}
        />
      </div>

    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
