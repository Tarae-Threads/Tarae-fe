'use client'

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import Script from 'next/script'
import type { Place } from '@/lib/types'

declare global {
  interface Window {
    naver: any
    MarkerClustering: any
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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드 완료된 경우
    if (window.MarkerClustering) {
      resolve()
      return
    }
    // 이전에 실패한 스크립트 태그 제거
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(
  function NaverMap({ places, onPlaceSelect, selectedPlaceId }, ref) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markersRef = useRef<any[]>([])
    const clusterRef = useRef<any>(null)
    const initializedRef = useRef(false)

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

    const initMap = useCallback(async () => {
      if (initializedRef.current) return
      if (!mapRef.current || !window.naver?.maps) return

      // 네이버 맵이 로드된 후에 MarkerClustering.js 로드
      await loadScript('/js/MarkerClustering.js')
      if (!window.MarkerClustering) return

      initializedRef.current = true

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
      // 기존 클러스터 제거
      if (clusterRef.current) {
        clusterRef.current.setMap(null)
        clusterRef.current = null
      }
      markersRef.current.forEach(m => m.setMap(null))
      markersRef.current = []

      const markers: any[] = []
      const N = window.naver.maps

      places.forEach((place) => {
        const position = new N.LatLng(place.lat, place.lng)

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

        const marker = new N.Marker({
          position,
          icon: {
            content: markerHtml,
            anchor: new N.Point(16, 44),
          },
        })

        N.Event.addListener(marker, 'click', () => {
          onPlaceSelect(place)
          map.morph(position, 15, { duration: 500 })
        })

        markers.push(marker)
      })

      markersRef.current = markers

      // 클러스터 아이콘 (테라코타 톤 3단계)
      function makeIcon(size: number, bg: string) {
        return {
          content: `<div style="
            cursor:pointer;width:${size}px;height:${size}px;
            border-radius:9999px;
            background:${bg};
            border:3px solid #ffffff;
            box-shadow:0 4px 16px rgba(29,27,22,0.18);
            display:flex;align-items:center;justify-content:center;
            color:#ffffff;font-weight:800;font-size:${Math.round(size * 0.32)}px;
            letter-spacing:-0.02em;
          "></div>`,
          size: new N.Size(size, size),
          anchor: new N.Point(size / 2, size / 2),
        }
      }

      const clustering = new window.MarkerClustering({
        minClusterSize: 2,
        maxZoom: 12,
        map: map,
        markers: markers,
        disableClickZoom: false,
        gridSize: 120,
        icons: [
          makeIcon(44, 'linear-gradient(135deg, #af5f41 0%, #d4856a 100%)'),
          makeIcon(52, 'linear-gradient(135deg, #91472b 0%, #af5f41 100%)'),
          makeIcon(60, 'linear-gradient(135deg, #6b2f18 0%, #91472b 100%)'),
        ],
        indexGenerator: [5, 10, 20],
        averageCenter: true,
        stylingFunction: (clusterMarker: any, count: number) => {
          const el = clusterMarker.getElement()
          if (el) {
            const div = el.querySelector('div')
            if (div) div.textContent = String(count)
          }
        },
      })

      clusterRef.current = clustering
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
        mapInstanceRef.current.morph(position, 15, { duration: 500 })
      }
    }, [selectedPlaceId, places])

    return (
      <>
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
          strategy="afterInteractive"
          onLoad={initMap}
        />
        <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      </>
    )
  }
)

export default NaverMap
