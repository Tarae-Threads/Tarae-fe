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

// 에러 인터셉터 — 4xx만 BE 메시지 노출, 5xx/네트워크는 일반 메시지로 치환
// (내부 에러 메시지/스택 유출 방지 목적)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const beMessage = error.response?.data?.message;
    const isClientError = status !== undefined && status >= 400 && status < 500;

    const message = isClientError && beMessage
      ? beMessage
      : "요청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";

    toast.error(message);

    // 개발/운영 로깅을 위해 원본은 콘솔로만
    if (process.env.NODE_ENV !== "production") {
      console.error("[api]", status, beMessage ?? error.message);
    }

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
export type ReviewResponse = components["schemas"]["ReviewResponse"];
export type ReviewCreateRequest = components["schemas"]["ReviewCreateRequest"];
export type ReviewDeleteRequest = components["schemas"]["ReviewDeleteRequest"];
