"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import type { Place } from "../types"
import type { NavTab } from "@/shared/components/layout/NavBar"
import PlaceCardCompact from "./PlaceCardCompact"
import EventSidePanelContent from "@/domains/event/components/EventSidePanelContent"
import EmptyState from "@/shared/components/ui/EmptyState"
import { PlaceCardSkeleton } from "@/shared/components/ui/Skeleton"
import { X, MapPin } from "lucide-react"

// ---------------------------------------------------------------------------
// Snap Points: closed(10%) → peek(30%) → full(100% - 48px bottomNav)
// ---------------------------------------------------------------------------

type SnapPoint = "closed" | "peek" | "full"
export type { SnapPoint as MobileSnapPoint }
const SNAP_RATIOS: Record<SnapPoint, number> = { closed: 0.1, peek: 0.3, full: 1 }
const BOTTOM_NAV_HEIGHT = 48
const SEARCH_BAR_BOTTOM = 72 // top-4(16px) + h-14(56px)

function getSnapHeight(snap: SnapPoint): number {
  if (typeof window === "undefined") return 0
  // full: 검색창 아래까지
  if (snap === "full") return window.innerHeight - SEARCH_BAR_BOTTOM - BOTTOM_NAV_HEIGHT
  return window.innerHeight * SNAP_RATIOS[snap]
}

// 한 단계씩만 이동
function nextSnap(current: SnapPoint, direction: "up" | "down"): SnapPoint {
  if (direction === "up") {
    if (current === "closed") return "peek"
    if (current === "peek") return "full"
    return "full"
  } else {
    if (current === "full") return "peek"
    if (current === "peek") return "closed"
    return "closed"
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  activeTab: NavTab
  places: Place[]
  loading?: boolean
  onPlaceSelect: (place: Place) => void
  onEventSelect?: (eventId: number) => void
  viewportFilterActive?: boolean
  onClearViewportFilter?: () => void
  hasActiveFilters?: boolean
  onClearFilters?: () => void
  getDistance?: (place: Place) => number | null
  onHeightChange?: (height: number) => void
  onSnapChange?: (snap: SnapPoint) => void
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
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [snap, setSnap] = useState<SnapPoint>("peek")
  const [sheetHeight, setSheetHeight] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const h = getSnapHeight("peek")
    setSheetHeight(h)
    onHeightChange?.(h)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const dragState = useRef({
    startY: 0,
    startHeight: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isScrolling: false,
    dragDirection: null as "up" | "down" | null,
  })

  const animateTo = useCallback((target: SnapPoint) => {
    const h = getSnapHeight(target)
    setSnap(target)
    setSheetHeight(h)
    onHeightChange?.(h)
    onSnapChange?.(target)
  }, [onHeightChange, onSnapChange])

  // 탭 전환 시
  const prevTabRef = useRef(activeTab)
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab
      if (activeTab === "events" && snap === "closed") {
        animateTo("peek")
      }
    }
  }, [activeTab, snap, animateTo])

  // 높이 변경 알림
  useEffect(() => {
    onHeightChange?.(sheetHeight)
  }, [sheetHeight, onHeightChange])


  // ---------------------------------------------------------------------------
  // Touch handlers — 핸들/헤더 전용 (스크롤 체크 없이 항상 드래그)
  // ---------------------------------------------------------------------------

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation()
      const touch = e.touches[0]
      const ds = dragState.current
      ds.isScrolling = false
      ds.dragDirection = null
      ds.startY = touch.clientY
      ds.startHeight = sheetHeight
      ds.lastY = touch.clientY
      ds.lastTime = Date.now()
      ds.velocity = 0
      setIsDragging(true)
    },
    [sheetHeight],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation()
      const ds = dragState.current
      if (ds.isScrolling) return

      const touch = e.touches[0]
      const now = Date.now()
      const deltaY = ds.startY - touch.clientY

      // full 상태 + scrollTop 0 + 아래로 드래그할 때만 패널 내리기
      if (snap === "full" && contentRef.current && contentRef.current.scrollTop === 0 && deltaY < -10) {
        // 패널 드래그 모드로 전환
      } else if (snap === "full" && deltaY >= 0) {
        // 위로 드래그 → 스크롤에 맡기기
        ds.isScrolling = true
        setIsDragging(false)
        return
      }

      const available = window.innerHeight - BOTTOM_NAV_HEIGHT
      const newHeight = Math.max(
        window.innerHeight * 0.05,
        Math.min(available, ds.startHeight + deltaY),
      )

      const dt = now - ds.lastTime
      if (dt > 0) ds.velocity = (ds.lastY - touch.clientY) / dt
      ds.lastY = touch.clientY
      ds.lastTime = now
      ds.dragDirection = deltaY > 0 ? "up" : "down"

      setSheetHeight(newHeight)
      e.preventDefault()
    },
    [snap],
  )

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current
    if (ds.isScrolling) return
    setIsDragging(false)

    // 속도 기반 방향 결정
    const direction: "up" | "down" =
      Math.abs(ds.velocity) > 0.3
        ? ds.velocity > 0 ? "up" : "down"
        : ds.dragDirection ?? "down"

    animateTo(nextSnap(snap, direction))
  }, [snap, animateTo])

  // 콘텐츠 터치 이벤트 전파 방지
  const stopPropagation = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 bg-surface-container-low shadow-[0_-12px_48px_rgba(29,27,22,0.15)] flex flex-col ${
        snap === "full" ? "rounded-none" : "rounded-t-[2rem]"
      }`}
      style={mounted ? {
        height: sheetHeight,
        marginBottom: BOTTOM_NAV_HEIGHT,
        transition: isDragging
          ? "none"
          : "height 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        willChange: "height",
        touchAction: "none",
      } : { height: 0, overflow: "hidden" }}
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
          <div className="flex flex-row w-full justify-between">
            <h2 className="font-display text-title-sm font-extrabold tracking-tight text-on-surface">
              장소
            </h2>
            <p className="text-label-md text-outline font-medium">
              {places.length}개 장소
            </p>
          </div>
          {viewportFilterActive && (
            <button
              onClick={onClearViewportFilter}
              className="mt-2 w-full flex items-center justify-center gap-1.5 bg-primary/10 text-primary font-bold text-label-md py-2 rounded-xl hover:bg-primary/15 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              전체보기
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="flex-1 min-h-0 overflow-y-auto hide-scrollbar"
        onTouchStart={stopPropagation}
        style={{
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {activeTab === "places" ? (
          <div className="px-6 pb-20 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))
            ) : places.length === 0 ? (
              <EmptyState
                icon={<MapPin className="w-8 h-8 text-outline" />}
                title="검색 결과가 없어요"
                description="필터를 변경하거나 검색어를 수정해보세요."
                action={
                  hasActiveFilters && onClearFilters
                    ? { label: "필터 초기화", onClick: onClearFilters }
                    : undefined
                }
              />
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
            <EventSidePanelContent onEventSelect={onEventSelect} />
          </div>
        )}
      </div>
    </div>
  )
}
