"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { Place, PlaceDetail } from "../types";
import type { Event, EventDetail, EventType } from "@/domains/event/types";
import PlaceDetailView from "./PlaceDetailView";
import EventTypeBadge from "@/domains/event/components/EventTypeBadge";
import {
  ChevronLeft,
  MapPin,
  ExternalLink,
  Calendar,
  Share2,
} from "lucide-react";
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

export default function PlacePanel({ data, open, onClose, onSnapChange }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState<SnapPoint>("peek");
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dragState = useRef({
    startY: 0,
    startHeight: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isScrolling: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // open 변경 시 peek로 초기화
  useEffect(() => {
    if (open && mounted) {
      setSnap("peek");
      setSheetHeight(getSnapHeight("peek"));
    }
  }, [open, mounted]);

  const animateTo = useCallback((target: SnapPoint) => {
    setSnap(target);
    setSheetHeight(getSnapHeight(target));
    onSnapChange?.(target);
  }, [onSnapChange]);

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

    const ds = dragState.current;
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
      className={`fixed bottom-0 left-0 w-full z-40 flex flex-col bg-surface-container-low shadow-[0_-12px_48px_rgba(29,27,22,0.15)] ${
        snap === "full" ? "rounded-none" : "rounded-t-[2rem]"
      } ${open && data ? "" : "translate-y-full pointer-events-none"}`}
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
        className="flex-shrink-0 pt-4 pb-3 flex justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="w-10 h-1 bg-outline-variant rounded-full" />
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
            className="flex items-center gap-1 text-on-surface-variant text-label-lg font-medium py-1 hover:text-on-surface transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
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
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      {data && (
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-8"
          onTouchStart={handleContentTouchStart}
          onTouchMove={handleContentTouchMove}
          onTouchEnd={handleContentTouchEnd}
          style={{
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {data.type === "place" ? (
            <PlaceDetailView place={data.place} detail={data.placeDetail} />
          ) : (
            <EventContent event={data.event} detail={data.eventDetail} />
          )}
        </div>
      )}
    </div>
  );
}

/* ---- Event Content ---- */
function EventContent({
  event,
  detail,
}: {
  event: Event;
  detail?: EventDetail | null;
}) {
  const description = detail?.description;
  const locationText = detail?.locationText ?? event.locationText;
  const links = detail?.links ?? event.links;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <EventTypeBadge type={event.eventType as EventType} size="md" />
        </div>
        <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-1.5">
          {event.title}
        </h2>
      </div>

      <div className="bg-surface-container rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3 text-body-sm">
          <Calendar className="w-4 h-4 text-outline" />
          <span className="text-on-surface">
            {event.startDate}
            {event.endDate ? ` — ${event.endDate}` : ""}
          </span>
        </div>
        {locationText && (
          <div className="flex items-center gap-3 text-body-sm">
            <MapPin className="w-4 h-4 text-outline" />
            <span className="text-on-surface">{locationText}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-body-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}

      {links && (
        <a
          href={links}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-primary" />
          <span className="flex-1 text-label-lg font-medium text-on-surface">
            자세히 보기
          </span>
          <span className="text-outline">→</span>
        </a>
      )}
    </div>
  );
}
