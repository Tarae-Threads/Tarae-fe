'use client'

import { useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'
import type { Place } from '@/lib/types'
import { CATEGORY_COLOR } from '@/lib/types'

declare global {
  interface Window {
    kakao: any
  }
}

interface KakaoMapProps {
  places: Place[]
  onPlaceSelect: (place: Place) => void
  selectedPlaceId?: string | null
}

export default function KakaoMap({ places, onPlaceSelect, selectedPlaceId }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.kakao?.maps) return

    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 13,
      }

      const map = new window.kakao.maps.Map(mapRef.current, options)
      mapInstanceRef.current = map

      // Add markers
      renderMarkers(map)
    })
  }, [places, onPlaceSelect])

  const renderMarkers = useCallback((map: any) => {
    // Clear existing markers
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.lat, place.lng)
      const color = CATEGORY_COLOR[place.category]

      // Create custom marker content
      const content = document.createElement('div')
      content.style.cssText = `
        width: 24px; height: 24px; border-radius: 50%;
        background-color: ${color}; border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer;
        transition: transform 0.2s;
      `
      content.addEventListener('mouseenter', () => {
        content.style.transform = 'scale(1.3)'
      })
      content.addEventListener('mouseleave', () => {
        content.style.transform = 'scale(1)'
      })

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 0.5,
        xAnchor: 0.5,
      })

      content.addEventListener('click', () => {
        onPlaceSelect(place)
        map.panTo(position)
      })

      customOverlay.setMap(map)
      markersRef.current.push(customOverlay)
    })
  }, [places, onPlaceSelect])

  useEffect(() => {
    if (window.kakao?.maps) {
      initMap()
    }
  }, [initMap])

  // Pan to selected place
  useEffect(() => {
    if (!selectedPlaceId || !mapInstanceRef.current) return
    const place = places.find(p => p.id === selectedPlaceId)
    if (place) {
      const position = new window.kakao.maps.LatLng(place.lat, place.lng)
      mapInstanceRef.current.panTo(position)
      mapInstanceRef.current.setLevel(5)
    }
  }, [selectedPlaceId, places])

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
    </>
  )
}
