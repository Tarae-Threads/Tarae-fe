"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import type { Place } from "../types";
import PlaceCard from "./PlaceCard";
import PlaceCardCompact from "./PlaceCardCompact";
import EventSidePanelContent from "@/domains/event/components/EventSidePanelContent";
import { Map, Calendar } from "lucide-react";

type SnapPoint = "peek" | "half" | "full";
type MainTab = "places" | "events";

const SNAP_PEEK = 0.22;
const SNAP_HALF = 0.5;
const SNAP_FULL = 0.92;

function getSnapHeight(snap: SnapPoint) {
  if (typeof window === "undefined") return 0;
  const vh = window.innerHeight;
  switch (snap) {
    case "peek":
      return vh * SNAP_PEEK;
    case "half":
      return vh * SNAP_HALF;
    case "full":
      return vh * SNAP_FULL;
  }
}

function closestSnap(height: number, velocity: number): SnapPoint {
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const peekH = vh * SNAP_PEEK;
  const halfH = vh * SNAP_HALF;
  const fullH = vh * SNAP_FULL;

  if (velocity < -0.5) {
    if (height > halfH) return "half";
    return "peek";
  }
  if (velocity > 0.5) {
    if (height < halfH) return "half";
    return "full";
  }

  const distPeek = Math.abs(height - peekH);
  const distHalf = Math.abs(height - halfH);
  const distFull = Math.abs(height - fullH);
  const min = Math.min(distPeek, distHalf, distFull);
  if (min === distPeek) return "peek";
  if (min === distHalf) return "half";
  return "full";
}

interface Props {
  places: Place[];
  onPlaceSelect: (place: Place) => void;
  onEventPlaceClick?: (placeId: string) => void;
}

export default function MobileBottomSheet({
  places,
  onPlaceSelect,
  onEventPlaceClick,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState<SnapPoint>("peek");
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [sheetHeight, setSheetHeight] = useState(0);
  if (isClient && sheetHeight === 0) {
    setSheetHeight(getSnapHeight("peek"));
  }
  const [isDragging, setIsDragging] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>("places");

  const dragState = useRef({
    startY: 0,
    startHeight: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isScrolling: false,
  });

  const animateTo = useCallback((target: SnapPoint) => {
    setSnap(target);
    setSheetHeight(getSnapHeight(target));
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const ds = dragState.current;

      if (snap === "full" && contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        if (scrollTop > 0) {
          ds.isScrolling = true;
          return;
        }
      }

      ds.isScrolling = false;
      ds.startY = touch.clientY;
      ds.startHeight = sheetHeight;
      ds.lastY = touch.clientY;
      ds.lastTime = Date.now();
      ds.velocity = 0;
      setIsDragging(true);
    },
    [snap, sheetHeight],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const ds = dragState.current;
    if (ds.isScrolling) return;

    const touch = e.touches[0];
    const now = Date.now();
    const deltaY = ds.startY - touch.clientY;
    const newHeight = Math.max(
      window.innerHeight * 0.1,
      Math.min(window.innerHeight * 0.95, ds.startHeight + deltaY),
    );

    const dt = now - ds.lastTime;
    if (dt > 0) {
      ds.velocity = (ds.lastY - touch.clientY) / dt;
    }
    ds.lastY = touch.clientY;
    ds.lastTime = now;

    setSheetHeight(newHeight);
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current;
    if (ds.isScrolling) return;

    setIsDragging(false);
    const target = closestSnap(sheetHeight, ds.velocity);
    animateTo(target);
  }, [sheetHeight, animateTo]);

  const isExpanded = snap === "half" || snap === "full";

  // When switching to events tab, expand to half if peeked
  const handleTabChange = (tab: MainTab) => {
    setMainTab(tab);
    if (tab === "events" && snap === "peek") {
      animateTo("half");
    }
  };

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-30 bg-surface-container-low rounded-t-[2rem] shadow-[0_-12px_48px_rgba(29,27,22,0.15)] flex flex-col"
      style={{
        height: sheetHeight,
        transition: isDragging
          ? "none"
          : "height 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        willChange: "height",
        touchAction: "none",
      }}
    >
      {/* Drag Handle */}
      <div
        className="flex-shrink-0 pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-outline-variant rounded-full" />
      </div>

      {/* Tab + Header */}
      <div
        className="flex-shrink-0 px-6 pb-3"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => handleTabChange("places")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all ${
              mainTab === "places"
                ? "signature-gradient text-white shadow-md shadow-primary/20"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            장소
          </button>
          <button
            onClick={() => handleTabChange("events")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all ${
              mainTab === "events"
                ? "signature-gradient text-white shadow-md shadow-primary/20"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            정보
          </button>
        </div>

        {mainTab === "places" && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-extrabold tracking-tight text-on-surface">
                뜨개 장소
              </h2>
              <p className="text-xs text-outline font-medium">
                {places.length}개 장소
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className={`flex-1 min-h-0 ${isExpanded ? "overflow-y-auto" : "overflow-hidden"} hide-scrollbar`}
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {mainTab === "places" ? (
          !isExpanded ? (
            <div
              className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {places.slice(0, 10).map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={onPlaceSelect}
                />
              ))}
            </div>
          ) : (
            <div className="px-6 pb-32 space-y-3">
              {places.map((place) => (
                <PlaceCardCompact
                  key={place.id}
                  place={place}
                  onClick={onPlaceSelect}
                />
              ))}
            </div>
          )
        ) : (
          <div className="pb-32">
            <EventSidePanelContent onPlaceClick={onEventPlaceClick} />
          </div>
        )}
      </div>
    </div>
  );
}
