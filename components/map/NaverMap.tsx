'use client'

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import Script from 'next/script'
import type { Place } from '@/lib/types'

declare global {
  interface Window {
    naver: any
  }
}

interface NaverMapProps {
  places: Place[]
  onPlaceSelect: (place: Place) => void
  selectedPlaceId?: string | null
}

export interface NaverMapHandle {
  zoomIn: () => void
  zoomOut: () => void
  locate: () => void
}

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(
  function NaverMap({ places, onPlaceSelect, selectedPlaceId }, ref) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markersRef = useRef<any[]>([])

    useImperativeHandle(ref, () => ({
      zoomIn() {
        if (!mapInstanceRef.current) return
        const zoom = mapInstanceRef.current.getZoom()
        mapInstanceRef.current.setZoom(zoom + 1, true)
      },
      zoomOut() {
        if (!mapInstanceRef.current) return
        const zoom = mapInstanceRef.current.getZoom()
        mapInstanceRef.current.setZoom(zoom - 1, true)
      },
      locate() {
        if (!mapInstanceRef.current || !navigator.geolocation) return
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords
          const position = new window.naver.maps.LatLng(latitude, longitude)
          mapInstanceRef.current.panTo(position)
          mapInstanceRef.current.setZoom(14, true)
        })
      },
    }))

    const initMap = useCallback(() => {
      if (!mapRef.current || !window.naver?.maps) return

      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 7,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: true,
        logoControlOptions: {
          position: window.naver.maps.Position.BOTTOM_LEFT,
        },
      })

      mapInstanceRef.current = map
      renderMarkers(map)
    }, [places, onPlaceSelect])

    const renderMarkers = useCallback((map: any) => {
      // Clear existing markers
      markersRef.current.forEach(m => m.setMap(null))
      markersRef.current = []

      places.forEach((place) => {
        const position = new window.naver.maps.LatLng(place.lat, place.lng)

        // Terracotta yarn ball pin HTML
        const markerHtml = `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="
              width:32px;height:32px;border-radius:9999px;
              background:linear-gradient(135deg,#91472b 0%,#af5f41 100%);
              border:3px solid #ffffff;
              box-shadow:0 4px 12px rgba(29,27,22,0.15);
              transition:transform 0.2s ease;
              display:flex;align-items:center;justify-content:center;
            ">
              <div style="width:8px;height:8px;border-radius:9999px;background:rgba(255,255,255,0.8);"></div>
            </div>
            <div style="
              margin-top:6px;background:rgba(255,249,239,0.9);
              backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
              padding:2px 8px;border-radius:9999px;
              box-shadow:0 2px 8px rgba(29,27,22,0.08);
            ">
              <span style="font-size:10px;font-weight:700;letter-spacing:-0.02em;color:#91472b;">
                ${place.name}
              </span>
            </div>
          </div>
        `

        const marker = new window.naver.maps.Marker({
          position,
          map,
          icon: {
            content: markerHtml,
            anchor: new window.naver.maps.Point(16, 44),
          },
        })

        window.naver.maps.Event.addListener(marker, 'click', () => {
          onPlaceSelect(place)
          map.panTo(position)
        })

        markersRef.current.push(marker)
      })
    }, [places, onPlaceSelect])

    useEffect(() => {
      if (window.naver?.maps) {
        initMap()
      }
    }, [initMap])

    // Pan to selected place
    useEffect(() => {
      if (!selectedPlaceId || !mapInstanceRef.current) return
      const place = places.find(p => p.id === selectedPlaceId)
      if (place) {
        const position = new window.naver.maps.LatLng(place.lat, place.lng)
        mapInstanceRef.current.panTo(position)
        mapInstanceRef.current.setZoom(14, true)
      }
    }, [selectedPlaceId, places])

    return (
      <>
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
          strategy="afterInteractive"
          onLoad={initMap}
        />
        <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      </>
    )
  }
)

export default NaverMap
