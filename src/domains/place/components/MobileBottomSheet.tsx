'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { Place } from '../types'
import PlaceCard from './PlaceCard'
import PlaceCardCompact from './PlaceCardCompact'

type SnapPoint = 'peek' | 'half' | 'full'

const SNAP_PEEK = 0.22  // 22% of viewport
const SNAP_HALF = 0.50  // 50%
const SNAP_FULL = 0.92  // 92%

function getSnapHeight(snap: SnapPoint) {
  if (typeof window === 'undefined') return 0
  const vh = window.innerHeight
  switch (snap) {
    case 'peek': return vh * SNAP_PEEK
    case 'half': return vh * SNAP_HALF
    case 'full': return vh * SNAP_FULL
  }
}

function closestSnap(height: number, velocity: number): SnapPoint {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const peekH = vh * SNAP_PEEK
  const halfH = vh * SNAP_HALF
  const fullH = vh * SNAP_FULL

  // Velocity-based flick detection (px/ms threshold)
  if (velocity < -0.5) {
    // Flicking down
    if (height > halfH) return 'half'
    return 'peek'
  }
  if (velocity > 0.5) {
    // Flicking up
    if (height < halfH) return 'half'
    return 'full'
  }

  // Position-based snap
  const distPeek = Math.abs(height - peekH)
  const distHalf = Math.abs(height - halfH)
  const distFull = Math.abs(height - fullH)
  const min = Math.min(distPeek, distHalf, distFull)
  if (min === distPeek) return 'peek'
  if (min === distHalf) return 'half'
  return 'full'
}

interface Props {
  places: Place[]
  onPlaceSelect: (place: Place) => void
}

export default function MobileBottomSheet({ places, onPlaceSelect }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [snap, setSnap] = useState<SnapPoint>('peek')
  const [sheetHeight, setSheetHeight] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Touch tracking refs (avoid re-renders during drag)
  const dragState = useRef({
    startY: 0,
    startHeight: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isScrolling: false,
  })

  // Initialize height
  useEffect(() => {
    setSheetHeight(getSnapHeight('peek'))
  }, [])

  // Animate to snap point
  const animateTo = useCallback((target: SnapPoint) => {
    setSnap(target)
    setSheetHeight(getSnapHeight(target))
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const ds = dragState.current

    // If fully expanded and content is scrolled, let native scroll handle it
    if (snap === 'full' && contentRef.current) {
      const scrollTop = contentRef.current.scrollTop
      if (scrollTop > 0) {
        ds.isScrolling = true
        return
      }
    }

    ds.isScrolling = false
    ds.startY = touch.clientY
    ds.startHeight = sheetHeight
    ds.lastY = touch.clientY
    ds.lastTime = Date.now()
    ds.velocity = 0
    setIsDragging(true)
  }, [snap, sheetHeight])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const ds = dragState.current
    if (ds.isScrolling) return

    const touch = e.touches[0]
    const now = Date.now()
    const deltaY = ds.startY - touch.clientY
    const newHeight = Math.max(
      window.innerHeight * 0.1,
      Math.min(window.innerHeight * 0.95, ds.startHeight + deltaY)
    )

    // Calculate velocity (positive = upward)
    const dt = now - ds.lastTime
    if (dt > 0) {
      ds.velocity = (ds.lastY - touch.clientY) / dt
    }
    ds.lastY = touch.clientY
    ds.lastTime = now

    setSheetHeight(newHeight)

    // Prevent background scroll
    e.preventDefault()
  }, [])

  const handleTouchEnd = useCallback(() => {
    const ds = dragState.current
    if (ds.isScrolling) return

    setIsDragging(false)
    const target = closestSnap(sheetHeight, ds.velocity)
    animateTo(target)
  }, [sheetHeight, animateTo])

  const isExpanded = snap === 'half' || snap === 'full'

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-30 bg-surface-container-low rounded-t-[2rem] shadow-[0_-12px_48px_rgba(29,27,22,0.15)] flex flex-col"
      style={{
        height: sheetHeight,
        transition: isDragging ? 'none' : 'height 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        willChange: 'height',
        touchAction: 'none',
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

      {/* Header */}
      <div
        className="flex-shrink-0 px-6 pb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-on-surface">
              뜨개 장소
            </h2>
            <p className="text-sm text-outline font-medium">
              {places.length}개 장소
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className={`flex-1 min-h-0 ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'} hide-scrollbar`}
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {!isExpanded ? (
          /* Peek: Horizontal scroll cards */
          <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {places.slice(0, 10).map(place => (
              <PlaceCard key={place.id} place={place} onClick={onPlaceSelect} />
            ))}
          </div>
        ) : (
          /* Half/Full: Vertical list */
          <div className="px-6 pb-32 space-y-3">
            {places.map(place => (
              <PlaceCardCompact key={place.id} place={place} onClick={onPlaceSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
