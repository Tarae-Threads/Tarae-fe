import { apiClient } from "@/shared/api/client"
import type {
  ShopListResponse,
  ShopDetailResponse,
  ShopRequestInput,
  RequestResponse,
  ReviewResponse,
  ReviewCreateRequest,
} from "@/shared/api/client"
import type { operations } from "@/shared/api/types"

export const getShops = async (
  params?: operations["getShops"]["parameters"]["query"]
) => {
  const { data } = await apiClient.get<{ data: ShopListResponse[] }>(
    "/api/shops",
    { params }
  )
  return data.data
}

export const getShop = async (id: number) => {
  const { data } = await apiClient.get<{ data: ShopDetailResponse }>(
    `/api/shops/${id}`
  )
  return data.data
}

export const requestShop = async (body: ShopRequestInput) => {
  const { data } = await apiClient.post<{ data: RequestResponse }>(
    "/api/requests/shops",
    body
  )
  return data.data
}

export const getShopReviews = async (shopId: number) => {
  const { data } = await apiClient.get<{ data: ReviewResponse[] }>(
    `/api/shops/${shopId}/reviews`
  )
  return data.data
}

export const createShopReview = async (
  shopId: number,
  body: ReviewCreateRequest
) => {
  const { data } = await apiClient.post<{ data: ReviewResponse }>(
    `/api/shops/${shopId}/reviews`,
    body
  )
  return data.data
}
