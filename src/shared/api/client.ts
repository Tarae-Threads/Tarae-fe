import axios from "axios"
import type { components } from "./types"

// ---------------------------------------------------------------------------
// Axios 인스턴스
// ---------------------------------------------------------------------------

export const apiClient = axios.create({
  baseURL: "https://api.taraethreads.com",
  headers: { "Content-Type": "application/json" },
})

// ---------------------------------------------------------------------------
// 스키마 타입 단축 export
// ---------------------------------------------------------------------------

export type PlaceListResponse = components["schemas"]["PlaceListResponse"]
export type PlaceDetailResponse = components["schemas"]["PlaceDetailResponse"]
export type EventListResponse = components["schemas"]["EventListResponse"]
export type EventDetailResponse = components["schemas"]["EventDetailResponse"]
export type PlaceRequestInput = components["schemas"]["PlaceRequestInput"]
export type EventRequestInput = components["schemas"]["EventRequestInput"]
export type CategoryInfo = components["schemas"]["CategoryInfo"]
export type TagInfo = components["schemas"]["TagInfo"]
export type BrandInfo = components["schemas"]["BrandInfo"]
export type RequestResponse = components["schemas"]["RequestResponse"]
