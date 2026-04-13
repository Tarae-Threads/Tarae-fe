import axios from "axios";
import type { AxiosError } from "axios";
import type { components } from "./types";
import { toast } from "@/shared/components/ui/toast";

// ---------------------------------------------------------------------------
// BE 에러 응답 타입
// ---------------------------------------------------------------------------

export interface ApiError {
  code: string;
  status: number;
  message: string;
}

// ---------------------------------------------------------------------------
// Axios 인스턴스
// ---------------------------------------------------------------------------

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 에러 인터셉터 — BE 에러 파싱 + toast 자동 표시
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message =
      error.response?.data?.message ?? "알 수 없는 오류가 발생했습니다";
    toast.error(message);
    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// 스키마 타입 단축 export
// ---------------------------------------------------------------------------

export type PlaceListResponse = components["schemas"]["PlaceListResponse"];
export type PlaceDetailResponse = components["schemas"]["PlaceDetailResponse"];
export type EventListResponse = components["schemas"]["EventListResponse"];
export type EventDetailResponse = components["schemas"]["EventDetailResponse"];
export type PlaceRequestInput = components["schemas"]["PlaceRequestInput"];
export type EventRequestInput = components["schemas"]["EventRequestInput"];
export type CategoryInfo = components["schemas"]["CategoryDto"];
export type TagInfo = components["schemas"]["TagDto"];
export type BrandInfo = components["schemas"]["BrandDto"];
export type RequestResponse = components["schemas"]["RequestResponse"];
export type CategoryResponse = components["schemas"]["CategoryResponse"];
export type BrandTypeGroup = components["schemas"]["BrandTypeGroup"];
export type BrandItem = components["schemas"]["BrandItem"];
