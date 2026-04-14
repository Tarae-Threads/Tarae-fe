"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import type { Place, PlaceDetail } from "../types";
import type { Event, EventDetail } from "@/domains/event/types";
import PlaceDetailTabs from "./PlaceDetailTabs";
import EventDetailTabs from "@/domains/event/components/EventDetailTabs";
import { ChevronLeft, Share2 } from "lucide-react";
import { shareOrCopy } from "@/shared/lib/share";

// ---------------------------------------------------------------------------
// Snap: peek(30%) → full(100% - 48px)
// ---------------------------------------------------------------------------

type SnapPoint = "peek" | "full";
const SNAP_PEEK = 0.3;
const BOTTOM_NAV_HEIGHT = 48;

function getSnapHeight(snap: SnapPoint): number {
  if (typeof window === "undefined") return 0;
  return snap === "full"
    ? window.innerHeight - BOTTOM_NAV_HEIGHT
    : window.innerHeight * SNAP_PEEK;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DetailData =
  | { type: "place"; place: Place; placeDetail?: PlaceDetail | null }
  | { type: "event"; event: Event; eventDetail?: EventDetail | null };

interface Props {
  data: DetailData | null;
  open: boolean;
  onClose: () => void;
  onSnapChange?: (snap: "peek" | "full") => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlacePanel({
  data,
  open,
  onClose,
  onSnapChange,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState<SnapPoint>("peek");
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const dragState = useRef({
    startY: 0,
    startHeight: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isScrolling: false,
  });

  // open 변경 시 peek로 초기화
  useEffect(() => {
    if (open && mounted) {
      setSnap("peek"); // eslint-disable-line react-hooks/set-state-in-effect -- open 변경 시 초기화 필수
      setSheetHeight(getSnapHeight("peek"));
    }
  }, [open, mounted]);

  const animateTo = useCallback(
    (target: SnapPoint) => {
      setSnap(target);
      setSheetHeight(getSnapHeight(target));
      onSnapChange?.(target);
    },
    [onSnapChange],
  );

  // ---------------------------------------------------------------------------
  // Touch handlers (드래그 핸들 영역)
  // ---------------------------------------------------------------------------

  // 핸들/헤더 드래그 — 항상 드래그 가능 (스크롤 무시)
  const handleDragStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      const touch = e.touches[0];
      const ds = dragState.current;
      ds.isScrolling = false;
      ds.startY = touch.clientY;
      ds.startHeight = sheetHeight;
      ds.lastY = touch.clientY;
      ds.lastTime = Date.now();
      ds.velocity = 0;
      setIsDragging(true);
    },
    [sheetHeight],
  );

  const handleDragMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const ds = dragState.current;
    if (ds.isScrolling) return;

    const touch = e.touches[0];
    const now = Date.now();
    const deltaY = ds.startY - touch.clientY;
    const available = window.innerHeight - BOTTOM_NAV_HEIGHT;
    const minH = window.innerHeight * 0.1;
    const newHeight = Math.max(
      minH,
      Math.min(available, ds.startHeight + deltaY),
    );

    const dt = now - ds.lastTime;
    if (dt > 0) ds.velocity = (ds.lastY - touch.clientY) / dt;
    ds.lastY = touch.clientY;
    ds.lastTime = now;
    setSheetHeight(newHeight);
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(() => {
    const ds = dragState.current;
    if (ds.isScrolling) return;
    setIsDragging(false);

    const direction: "up" | "down" =
      Math.abs(ds.velocity) > 0.3
        ? ds.velocity > 0
          ? "up"
          : "down"
        : ds.startHeight < sheetHeight
          ? "up"
          : "down";

    if (direction === "up") {
      animateTo("full");
    } else {
      const peekH = getSnapHeight("peek");
      if (sheetHeight < peekH * 0.6) {
        onClose();
      } else {
        animateTo("peek");
      }
    }
  }, [sheetHeight, animateTo, onClose]);

  // 콘텐츠 영역: full + scrollTop 0 + 아래 드래그 → 패널 내리기
  const handleContentTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      if (snap !== "full" || !contentRef.current) return;
      if (contentRef.current.scrollTop > 0) return;

      const touch = e.touches[0];
      const ds = dragState.current;
      ds.isScrolling = false;
      ds.startY = touch.clientY;
      ds.startHeight = sheetHeight;
      ds.lastY = touch.clientY;
      ds.lastTime = Date.now();
      ds.velocity = 0;
    },
    [snap, sheetHeight],
  );

  const handleContentTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      const ds = dragState.current;
      if (snap !== "full" || !contentRef.current) return;

      const touch = e.touches[0];
      const deltaY = ds.startY - touch.clientY;

      // 아래로 드래그 + scrollTop 0 → 패널 내리기
      if (deltaY < -10 && contentRef.current.scrollTop === 0) {
        ds.isScrolling = false;
        setIsDragging(true);

        const now = Date.now();
        const available = window.innerHeight - BOTTOM_NAV_HEIGHT;
        const minH = window.innerHeight * 0.1;
        const newHeight = Math.max(
          minH,
          Math.min(available, ds.startHeight + deltaY),
        );
        const dt = now - ds.lastTime;
        if (dt > 0) ds.velocity = (ds.lastY - touch.clientY) / dt;
        ds.lastY = touch.clientY;
        ds.lastTime = now;
        setSheetHeight(newHeight);
        e.preventDefault();
      }
    },
    [snap],
  );

  const handleContentTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const peekH = getSnapHeight("peek");
    if (sheetHeight < peekH * 0.6) {
      onClose();
    } else {
      animateTo("peek");
    }
  }, [isDragging, sheetHeight, animateTo, onClose]);

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-label="상세 정보"
      className={`bg-surface-container-low fixed bottom-0 left-0 z-40 flex w-full flex-col shadow-[0_-12px_48px_rgba(29,27,22,0.15)] ${
        snap === "full" ? "rounded-none" : "rounded-t-[2rem]"
      } ${open && data ? "" : "pointer-events-none translate-y-full"}`}
      style={{
        height: open ? sheetHeight : 0,
        marginBottom: BOTTOM_NAV_HEIGHT,
        transition: isDragging
          ? "none"
          : "height 0.4s cubic-bezier(0.32, 0.72, 0, 1), transform 0.3s ease-out",
        willChange: "height",
        touchAction: "none",
      }}
    >
      {/* Drag Handle — 터치 영역 넓게 */}
      <div
        className="flex flex-shrink-0 cursor-grab justify-center pt-4 pb-3 active:cursor-grabbing"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="bg-outline-variant h-1 w-10 rounded-full" />
      </div>

      {/* Header */}
      <div
        className="flex-shrink-0 px-4 pb-2"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex items-center justify-between">
          <button
            onTouchStart={(e) => e.stopPropagation()}
            onClick={onClose}
            aria-label="뒤로가기"
            className="text-on-surface-variant text-label-lg hover:text-on-surface flex items-center gap-1 py-1 font-medium transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {data && (
            <button
              onTouchStart={(e) => e.stopPropagation()}
              onClick={() => {
                const url =
                  data.type === "place"
                    ? `/?placeId=${data.place.id}`
                    : `/?eventId=${data.event.id}`;
                const title =
                  data.type === "place" ? data.place.name : data.event.title;
                shareOrCopy({ title, url });
              }}
              aria-label="공유하기"
              className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg p-2 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      {data && (
        <div
          ref={contentRef}
          className="hide-scrollbar flex-1 overflow-y-auto px-5 pb-8"
          onTouchStart={handleContentTouchStart}
          onTouchMove={handleContentTouchMove}
          onTouchEnd={handleContentTouchEnd}
          style={{
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {data.type === "place" ? (
            <PlaceDetailTabs place={data.place} detail={data.placeDetail} />
          ) : (
            <EventDetailTabs event={data.event} detail={data.eventDetail} />
          )}
        </div>
      )}
    </div>
  );
}
