"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import type { Place } from "../types";
import type { NavTab } from "@/shared/components/layout/NavBar";
import PlaceCardCompact from "./PlaceCardCompact";
import EventSidePanelContent from "@/domains/event/components/EventSidePanelContent";

type SnapPoint = "peek" | "half" | "full";

const SNAP_PEEK = 0.28;
const SNAP_HALF = 0.5;
const SNAP_FULL = 0.85;

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
  activeTab: NavTab;
  places: Place[];
  onPlaceSelect: (place: Place) => void;
  onEventSelect?: (eventId: string) => void;
  viewportFilterActive?: boolean;
  onClearViewportFilter?: () => void;
}

export default function MobileBottomSheet({
  activeTab,
  places,
  onPlaceSelect,
  onEventSelect,
  viewportFilterActive,
  onClearViewportFilter,
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
  // eslint-disable-next-line react-hooks/rules-of-hooks -- hydration: server=0, client=actual height
  if (isClient && sheetHeight === 0) {
    setSheetHeight(getSnapHeight("peek"));
  }
  const [isDragging, setIsDragging] = useState(false);

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

  // Auto-expand when switching to events tab
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: tab switch triggers layout change via microtask
  const prevTabRef = useRef(activeTab);
  if (prevTabRef.current !== activeTab) {
    prevTabRef.current = activeTab;
    if (activeTab === "events" && snap === "peek") {
      queueMicrotask(() => animateTo("half"));
    }
  }

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const ds = dragState.current;
      if (snap === "full" && contentRef.current) {
        if (contentRef.current.scrollTop > 0) {
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
      Math.min(window.innerHeight * 0.9, ds.startHeight + deltaY),
    );
    const dt = now - ds.lastTime;
    if (dt > 0) ds.velocity = (ds.lastY - touch.clientY) / dt;
    ds.lastY = touch.clientY;
    ds.lastTime = now;
    setSheetHeight(newHeight);
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current;
    if (ds.isScrolling) return;
    setIsDragging(false);
    animateTo(closestSnap(sheetHeight, ds.velocity));
  }, [sheetHeight, animateTo]);

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-30 bg-surface-container-low rounded-t-[2rem] shadow-[0_-12px_48px_rgba(29,27,22,0.15)] flex flex-col"
      style={{
        height: sheetHeight,
        marginBottom: 48,
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

      {/* Header (places only) */}
      {activeTab === "places" && (
        <div
          className="flex-shrink-0 px-6 pb-3"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h2 className="font-display text-title-sm font-extrabold tracking-tight text-on-surface">
            뜨개 장소
          </h2>
          <p className="text-label-md text-outline font-medium">
            {places.length}개 장소
          </p>
          {viewportFilterActive && (
            <button
              onClick={onClearViewportFilter}
              className="mt-2 text-primary font-bold text-label-sm"
            >
              전체보기
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="flex-1 min-h-0 overflow-y-auto hide-scrollbar"
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {activeTab === "places" ? (
          <div className="px-6 pb-20 space-y-3">
            {places.map((place) => (
              <PlaceCardCompact
                key={place.id}
                place={place}
                onClick={onPlaceSelect}
              />
            ))}
          </div>
        ) : (
          <div className="pb-20">
            <EventSidePanelContent onEventSelect={onEventSelect} />
          </div>
        )}
      </div>
    </div>
  );
}
