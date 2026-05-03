"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import type { Place } from "../types";
import type { NavTab } from "@/shared/components/layout/NavBar";
import PlaceCardCompact from "./PlaceCardCompact";
import EventSidePanelContent from "@/domains/event/components/EventSidePanelContent";
import EmptyState from "@/shared/components/ui/EmptyState";
import { PlaceCardSkeleton } from "@/shared/components/ui/Skeleton";
import { X, MapPin } from "lucide-react";

// ---------------------------------------------------------------------------
// Snap Points: closed(10%) → peek(30%) → full(100% - 48px bottomNav)
// ---------------------------------------------------------------------------

type SnapPoint = "closed" | "peek" | "full";
export type { SnapPoint as MobileSnapPoint };
const SNAP_RATIOS: Record<SnapPoint, number> = {
  closed: 0.1,
  peek: 0.3,
  full: 1,
};
const DEFAULT_BOTTOM_NAV_HEIGHT = 64; // BottomNav 측정 전 fallback (safe area 미포함)
const SEARCH_BAR_BOTTOM = 72; // top-4(16px) + h-14(56px)

// iOS Chrome/Safari 의 동적 toolbar 로 뷰포트 높이가 수시로 변함.
// visualViewport 가 지원되면 실제 가시 영역을, 아니면 innerHeight 를 사용.
function getViewportHeight(): number {
  if (typeof window === "undefined") return 0;
  return window.visualViewport?.height ?? window.innerHeight;
}

function getSnapHeight(snap: SnapPoint, bottomNavHeight: number): number {
  const vh = getViewportHeight();
  if (vh === 0) return 0;
  // full: 검색창 아래까지
  if (snap === "full") return vh - SEARCH_BAR_BOTTOM - bottomNavHeight;
  return vh * SNAP_RATIOS[snap];
}

// 한 단계씩만 이동
function nextSnap(current: SnapPoint, direction: "up" | "down"): SnapPoint {
  if (direction === "up") {
    if (current === "closed") return "peek";
    if (current === "peek") return "full";
    return "full";
  } else {
    if (current === "full") return "peek";
    if (current === "peek") return "closed";
    return "closed";
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type SortBy = "name-asc" | "name-desc" | "distance";

interface Props {
  activeTab: NavTab;
  places: Place[];
  loading?: boolean;
  onPlaceSelect: (place: Place) => void;
  onEventSelect?: (eventId: number) => void;
  viewportFilterActive?: boolean;
  onClearViewportFilter?: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  getDistance?: (place: Place) => number | null;
  onHeightChange?: (height: number) => void;
  onSnapChange?: (snap: SnapPoint) => void;
  searchQuery?: string;
  selectedRegion?: string;
  sortBy?: SortBy;
  userLocation?: { lat: number; lng: number } | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MobileBottomSheet({
  activeTab,
  places,
  onPlaceSelect,
  onEventSelect,
  viewportFilterActive,
  onClearViewportFilter,
  hasActiveFilters,
  onClearFilters,
  loading,
  getDistance,
  onHeightChange,
  onSnapChange,
  searchQuery,
  selectedRegion,
  sortBy,
  userLocation,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState<SnapPoint>("peek");
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // visualViewport.resize 핸들러용 — isDragging state 의 stale closure 회피
  const isDraggingRef = useRef(false);
  // BottomNav 의 실제 렌더링 높이 (safe area 포함). ResizeObserver 로 동적 측정.
  // 하드코딩 상수가 실제와 안 맞으면 시트 marginBottom 이 어긋나 갈색 갭이 노출됨.
  const [bottomNavHeight, setBottomNavHeight] = useState(DEFAULT_BOTTOM_NAV_HEIGHT);
  const bottomNavHeightRef = useRef(DEFAULT_BOTTOM_NAV_HEIGHT);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const measure = () => {
      const nav = document.querySelector(
        'nav[aria-label="하단 내비게이션"]',
      ) as HTMLElement | null;
      if (!nav) return;
      const h = nav.getBoundingClientRect().height;
      bottomNavHeightRef.current = h;
      setBottomNavHeight(h);
    };
    measure();
    const nav = document.querySelector(
      'nav[aria-label="하단 내비게이션"]',
    ) as HTMLElement | null;
    if (!nav) return;
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // 초기 높이 설정
  useEffect(() => {
    const h = getSnapHeight("peek", bottomNavHeightRef.current);
    setSheetHeight(h); // eslint-disable-line react-hooks/set-state-in-effect
    onHeightChange?.(h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // iOS 동적 toolbar 로 뷰포트 높이가 바뀌면 현재 snap 높이도 재계산.
  // 단, **작은 변화(URL bar 자동 토글, NAVER 로고 long-press 시 흔들림 등)는
  // 무시** — 80px 미만 변화는 시트 jumping 의 주범이라 차단.
  // 큰 변화 (디바이스 회전 등) 만 반응.
  useEffect(() => {
    let lastVh = getViewportHeight();
    const RESIZE_THRESHOLD_PX = 80;

    const handleResize = () => {
      if (isDraggingRef.current) return;
      const newVh = getViewportHeight();
      if (Math.abs(newVh - lastVh) < RESIZE_THRESHOLD_PX) return;
      lastVh = newVh;
      const h = getSnapHeight(snap, bottomNavHeightRef.current);
      setSheetHeight(h); // eslint-disable-line react-hooks/set-state-in-effect
      onHeightChange?.(h);
    };
    window.addEventListener("resize", handleResize);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      vv?.removeEventListener("resize", handleResize);
    };
  }, [snap, onHeightChange]);

  const dragState = useRef({
    startY: 0,
    startHeight: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isScrolling: false,
    dragDirection: null as "up" | "down" | null,
  });

  const animateTo = useCallback(
    (target: SnapPoint) => {
      const h = getSnapHeight(target, bottomNavHeightRef.current);
      setSnap(target);
      setSheetHeight(h);
      onHeightChange?.(h);
      onSnapChange?.(target);
    },
    [onHeightChange, onSnapChange],
  );

  // 탭 전환 시
  const prevTabRef = useRef(activeTab);
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      if (activeTab === "events" && snap === "closed") {
        animateTo("peek"); // eslint-disable-line react-hooks/set-state-in-effect
      }
    }
  }, [activeTab, snap, animateTo]);

  // 높이 변경 알림
  useEffect(() => {
    onHeightChange?.(sheetHeight);
  }, [sheetHeight, onHeightChange]);

  // ---------------------------------------------------------------------------
  // Touch handlers — 핸들/헤더 전용 (스크롤 체크 없이 항상 드래그)
  // ---------------------------------------------------------------------------

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      const touch = e.touches[0];
      const ds = dragState.current;
      ds.isScrolling = false;
      ds.dragDirection = null;
      ds.startY = touch.clientY;
      ds.startHeight = sheetHeight;
      ds.lastY = touch.clientY;
      ds.lastTime = Date.now();
      ds.velocity = 0;
      isDraggingRef.current = true;
      setIsDragging(true);
    },
    [sheetHeight],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      const ds = dragState.current;
      if (ds.isScrolling) return;

      const touch = e.touches[0];
      const now = Date.now();
      const deltaY = ds.startY - touch.clientY;

      // full 상태 + scrollTop 0 + 아래로 드래그할 때만 패널 내리기
      if (
        snap === "full" &&
        contentRef.current &&
        contentRef.current.scrollTop === 0 &&
        deltaY < -10
      ) {
        // 패널 드래그 모드로 전환
      } else if (snap === "full" && deltaY >= 0) {
        // 위로 드래그 → 스크롤에 맡기기
        ds.isScrolling = true;
        isDraggingRef.current = false;
        setIsDragging(false);
        return;
      }

      const vh = getViewportHeight();
      const available = vh - bottomNavHeightRef.current;
      const newHeight = Math.max(
        vh * 0.05,
        Math.min(available, ds.startHeight + deltaY),
      );

      const dt = now - ds.lastTime;
      if (dt > 0) ds.velocity = (ds.lastY - touch.clientY) / dt;
      ds.lastY = touch.clientY;
      ds.lastTime = now;
      ds.dragDirection = deltaY > 0 ? "up" : "down";

      setSheetHeight(newHeight);
      e.preventDefault();
    },
    [snap],
  );

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current;
    if (ds.isScrolling) {
      isDraggingRef.current = false;
      return;
    }
    isDraggingRef.current = false;
    setIsDragging(false);

    // 속도 기반 방향 결정
    const direction: "up" | "down" =
      Math.abs(ds.velocity) > 0.3
        ? ds.velocity > 0
          ? "up"
          : "down"
        : (ds.dragDirection ?? "down");

    animateTo(nextSnap(snap, direction));
  }, [snap, animateTo]);

  // 콘텐츠 터치 이벤트 전파 방지
  const stopPropagation = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="bg-surface-container-low fixed right-0 bottom-0 left-0 z-30 flex flex-col rounded-t-[2rem] shadow-[0_-12px_48px_rgba(29,27,22,0.15)]"
      style={
        mounted
          ? {
              height: sheetHeight,
              marginBottom: bottomNavHeight,
              transition: isDragging
                ? "none"
                : "height 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
              willChange: "height",
              touchAction: "none",
            }
          : { height: 0, overflow: "hidden" }
      }
    >
      {/* Drag Handle */}
      <div
        className="flex flex-shrink-0 cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-outline-variant h-1 w-10 rounded-full" />
      </div>

      {/* Header (places only) */}
      {activeTab === "places" && (
        <div
          className="flex-shrink-0 px-6 pb-3"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex w-full flex-row justify-between">
            <h2 className="font-display text-title-sm text-on-surface font-extrabold tracking-tight">
              장소
            </h2>
            <p className="text-label-md text-outline font-medium">
              {places.length}개 장소
            </p>
          </div>
          {viewportFilterActive && (
            <button
              onClick={onClearViewportFilter}
              onTouchStart={stopPropagation}
              onTouchMove={stopPropagation}
              onTouchEnd={stopPropagation}
              className="bg-primary/10 text-primary text-label-md hover:bg-primary/15 mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 font-bold transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              전체보기
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="hide-scrollbar min-h-0 flex-1 overflow-y-auto"
        onTouchStart={stopPropagation}
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {activeTab === "places" ? (
          <div className="space-y-3 px-6 pb-20">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))
            ) : places.length === 0 ? (
              viewportFilterActive && onClearViewportFilter ? (
                <EmptyState
                  icon={<MapPin className="text-outline h-8 w-8" />}
                  title="이 지역에는 장소가 없어요"
                  description="지도를 이동하거나 전체 지역으로 확장해보세요."
                  action={{ label: "전체 지역 보기", onClick: onClearViewportFilter }}
                />
              ) : (
                <EmptyState
                  icon={<MapPin className="text-outline h-8 w-8" />}
                  title="검색 결과가 없어요"
                  description="필터를 변경하거나 검색어를 수정해보세요."
                  action={
                    hasActiveFilters && onClearFilters
                      ? { label: "필터 초기화", onClick: onClearFilters }
                      : undefined
                  }
                />
              )
            ) : (
              places.map((place) => (
                <PlaceCardCompact
                  key={place.id}
                  place={place}
                  onClick={onPlaceSelect}
                  distance={getDistance?.(place)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="pb-20">
            <EventSidePanelContent
              onEventSelect={onEventSelect}
              searchQuery={searchQuery}
              selectedRegion={selectedRegion}
              sortBy={sortBy}
              userLocation={userLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
