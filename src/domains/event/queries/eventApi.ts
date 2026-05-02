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

export const requestEvent = async (body: EventRequestInput) => {
  const { data } = await apiClient.post<{ data: RequestResponse }>(
    "/api/requests/events",
    body
  )
  return data.data
}
