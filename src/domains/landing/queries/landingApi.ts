import type {
  PlaceListResponse,
  EventListResponse,
  BrandTypeGroup,
} from "@/shared/api/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1시간 캐시 (ISR)
const REVALIDATE = 60 * 60;
// 빌드 타임아웃 (Vercel page build 60초 한도 대비 충분히 짧게)
const FETCH_TIMEOUT_MS = 8000;

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  if (!BASE_URL) return fallback;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE },
      signal: controller.signal,
    });
    if (!res.ok) return fallback;
    const json = (await res.json()) as { data: T };
    return json.data ?? fallback;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchPlacesForLanding = () =>
  safeFetch<PlaceListResponse[]>("/api/places", []);

export const fetchEventsForLanding = () =>
  safeFetch<EventListResponse[]>("/api/events?active=true", []);

export const fetchBrandsForLanding = () =>
  safeFetch<BrandTypeGroup[]>("/api/brands", []);
