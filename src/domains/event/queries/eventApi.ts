import { apiClient } from "@/shared/api/client"
import type {
  EventListResponse,
  EventDetailResponse,
  EventRequestInput,
  RequestResponse,
} from "@/shared/api/client"
import type { operations } from "@/shared/api/types"

export const getEvents = async (
  params?: operations["getEvents"]["parameters"]["query"]
) => {
  const { data } = await apiClient.get<{ data: EventListResponse[] }>(
    "/api/events",
    { params }
  )
  return data.data
}

export const getEvent = async (id: number) => {
  const { data } = await apiClient.get<{ data: EventDetailResponse }>(
    `/api/events/${id}`
  )
  return data.data
}

// BE EventRequestInput 스펙에는 lat/lng가 아직 노출되지 않았지만
// 응답 스키마(EventListResponse 등)에 이미 lat/lng가 있어 FE에서 선제 전송.
// BE 스펙이 추가되면 generate:api 재실행 시 EventRequestInput 타입으로 통합된다.
export type EventRequestInputExt = EventRequestInput & {
  lat?: number
  lng?: number
}

export const requestEvent = async (body: EventRequestInputExt) => {
  const { data } = await apiClient.post<{ data: RequestResponse }>(
    "/api/requests/events",
    body
  )
  return data.data
}
