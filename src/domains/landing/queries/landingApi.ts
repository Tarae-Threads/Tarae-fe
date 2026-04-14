import type {
  PlaceListResponse,
  EventListResponse,
  BrandTypeGroup,
} from "@/shared/api/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// 1시간 캐시 (ISR)
const REVALIDATE = 60 * 60;

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return fallback;
    const json = (await res.json()) as { data: T };
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

export const fetchPlacesForLanding = () =>
  safeFetch<PlaceListResponse[]>("/api/places", []);

export const fetchEventsForLanding = () =>
  safeFetch<EventListResponse[]>("/api/events?active=true", []);

export const fetchBrandsForLanding = () =>
  safeFetch<BrandTypeGroup[]>("/api/brands", []);
