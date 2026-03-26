"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import Script from "next/script";
import type { Place } from "../types";

/* ---- Naver Maps 최소 타입 정의 ---- */
interface NaverLatLng {
  lat(): number;
  lng(): number;
}

interface NaverMap {
  getZoom(): number;
  setZoom(zoom: number, animate?: boolean): void;
  panTo(position: NaverLatLng): void;
  morph(
    position: NaverLatLng,
    zoom: number,
    options?: { duration?: number },
  ): void;
}

interface NaverMarker {
  setMap(map: NaverMap | null): void;
  getElement(): HTMLElement | null;
}

interface NaverMapsNamespace {
  Map: new (el: HTMLElement, options: Record<string, unknown>) => NaverMap;
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Marker: new (options: Record<string, unknown>) => NaverMarker;
  Point: new (x: number, y: number) => unknown;
  Size: new (w: number, h: number) => unknown;
  Event: {
    addListener(target: unknown, event: string, handler: () => void): void;
  };
  Position: { BOTTOM_LEFT: unknown };
}

interface MarkerClusteringConstructor {
  new (options: Record<string, unknown>): {
    setMap(map: NaverMap | null): void;
  };
}

declare global {
  interface Window {
    naver: { maps: NaverMapsNamespace };
    MarkerClustering: MarkerClusteringConstructor;
  }
}

interface NaverMapProps {
  places: Place[];
  onPlaceSelect: (place: Place) => void;
  selectedPlaceId?: string | null;
  eventPlaceIds?: Set<string>;
}

export interface NaverMapHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  locate: () => void;
  panTo: (lat: number, lng: number, zoom?: number) => void;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드 완료된 경우
    if (window.MarkerClustering) {
      resolve();
      return;
    }
    // 이전에 실패한 스크립트 태그 제거
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(function NaverMap(
  { places, onPlaceSelect, selectedPlaceId, eventPlaceIds },
  ref,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const clusterRef = useRef<{ setMap(map: NaverMap | null): void } | null>(
    null,
  );
  const initializedRef = useRef(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    zoomIn() {
      if (!mapInstanceRef.current) return;
      const zoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(zoom + 1, true);
    },
    zoomOut() {
      if (!mapInstanceRef.current) return;
      const zoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(zoom - 1, true);
    },
    locate() {
      if (!mapInstanceRef.current || !navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((pos) => {
        const map = mapInstanceRef.current;
        if (!map) return;
        const { latitude, longitude } = pos.coords;
        const position = new window.naver.maps.LatLng(latitude, longitude);
        map.panTo(position);
        map.setZoom(14, true);
      });
    },
    panTo(lat: number, lng: number, zoom?: number) {
      const map = mapInstanceRef.current;
      if (!map) return;
      const position = new window.naver.maps.LatLng(lat, lng);
      if (zoom) {
        map.morph(position, zoom, { duration: 500 });
      } else {
        map.panTo(position);
      }
    },
  }));

  const renderMarkers = useCallback(
    (map: NaverMap) => {
      // 기존 클러스터 제거
      if (clusterRef.current) {
        clusterRef.current.setMap(null);
        clusterRef.current = null;
      }
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      const markers: NaverMarker[] = [];
      const N = window.naver.maps;

      places.forEach((place) => {
        const position = new N.LatLng(place.lat, place.lng);
        const hasEvent = eventPlaceIds?.has(place.id) ?? false;
        const pinGradient = hasEvent
          ? 'linear-gradient(135deg,#53624f 0%,#7a8c73 100%)'
          : 'linear-gradient(135deg,#91472b 0%,#af5f41 100%)';
        const labelColor = hasEvent ? '#53624f' : '#91472b';

        const markerHtml = `
          <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="
              width:32px;height:32px;border-radius:9999px;
              background:${pinGradient};
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
              padding:1px 8px 3px;border-radius:9999px;
              box-shadow:0 2px 8px rgba(29,27,22,0.08);
              white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis;
            ">
              <span style="font-size:10px;font-weight:700;letter-spacing:-0.02em;color:${labelColor};white-space:nowrap;">
                ${place.name}
              </span>
            </div>
          </div>
        `;

        const marker = new N.Marker({
          position,
          icon: {
            content: markerHtml,
            anchor: new N.Point(16, 44),
          },
        });

        N.Event.addListener(marker, "click", () => {
          onPlaceSelect(place);
          map.morph(position, 13, { duration: 500 });
        });

        markers.push(marker);
      });

      markersRef.current = markers;

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
        };
      }

      const clustering = new window.MarkerClustering({
        minClusterSize: 2,
        maxZoom: 12,
        map: map,
        markers: markers,
        disableClickZoom: false,
        gridSize: 120,
        icons: [
          makeIcon(44, "linear-gradient(135deg, #af5f41 0%, #d4856a 100%)"),
          makeIcon(52, "linear-gradient(135deg, #91472b 0%, #af5f41 100%)"),
          makeIcon(60, "linear-gradient(135deg, #6b2f18 0%, #91472b 100%)"),
        ],
        indexGenerator: [5, 10, 20],
        averageCenter: true,
        stylingFunction: (clusterMarker: NaverMarker, count: number) => {
          const el = clusterMarker.getElement();
          if (el) {
            const div = el.querySelector("div");
            if (div) div.textContent = String(count);
          }
        },
      });

      clusterRef.current = clustering;
    },
    [places, onPlaceSelect, eventPlaceIds],
  );

  const initMap = useCallback(async () => {
    if (initializedRef.current) return;
    if (!mapRef.current || !window.naver?.maps) return;

    try {
      // 네이버 맵이 로드된 후에 MarkerClustering.js 로드
      await loadScript("/js/MarkerClustering.js");
      if (!window.MarkerClustering) {
        setMapError("마커 클러스터링 스크립트를 불러올 수 없습니다.");
        return;
      }

      initializedRef.current = true;

      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.978),
        zoom: 7,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        logoControl: true,
        logoControlOptions: {
          position: window.naver.maps.Position.BOTTOM_LEFT,
        },
      });

      mapInstanceRef.current = map;
      renderMarkers(map);
    } catch {
      setMapError("지도를 불러오는 중 문제가 발생했습니다.");
    }
  }, [renderMarkers]);

  useEffect(() => {
    if (window.naver?.maps) {
      initMap();
    }
  }, [initMap]);

  // Pan to selected place
  useEffect(() => {
    if (!selectedPlaceId || !mapInstanceRef.current) return;
    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      const position = new window.naver.maps.LatLng(place.lat, place.lng);
      mapInstanceRef.current.morph(position, 13, { duration: 500 });
    }
  }, [selectedPlaceId, places]);

  if (mapError) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-surface-container-low">
        <div className="text-center px-6">
          <p className="text-on-surface-variant text-sm mb-4">{mapError}</p>
          <button
            onClick={() => { setMapError(null); initializedRef.current = false; initMap(); }}
            className="signature-gradient text-white font-bold py-2 px-6 rounded-xl text-sm active:scale-95 transition-transform"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={initMap}
        onError={() => setMapError("네이버 지도 API를 불러올 수 없습니다. 네트워크를 확인해 주세요.")}
      />
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
    </>
  );
});

export default NaverMap;
