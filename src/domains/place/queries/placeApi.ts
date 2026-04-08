import { apiClient } from "@/shared/api/client"
import type {
  PlaceListResponse,
  PlaceDetailResponse,
  PlaceRequestInput,
  RequestResponse,
  CategoryResponse,
} from "@/shared/api/client"
import type { operations } from "@/shared/api/types"

export const getPlaces = async (
  params?: operations["getPlaces"]["parameters"]["query"]
) => {
  const { data } = await apiClient.get<{ data: PlaceListResponse[] }>(
    "/api/places",
    { params }
  )
  return data.data
}

export const getPlace = async (id: number) => {
  const { data } = await apiClient.get<{ data: PlaceDetailResponse }>(
    `/api/places/${id}`
  )
  return data.data
}

export const getCategories = async () => {
  const { data } = await apiClient.get<{ data: CategoryResponse[] }>(
    "/api/categories"
  )
  return data.data
}

export const requestPlace = async (body: PlaceRequestInput) => {
  const { data } = await apiClient.post<{ data: RequestResponse }>(
    "/api/requests/places",
    body
  )
  return data.data
}
