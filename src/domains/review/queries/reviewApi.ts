import { apiClient } from "@/shared/api/client";
import type {
  ReviewResponse,
  ReviewCreateRequest,
  ReviewDeleteRequest,
} from "@/shared/api/client";

export const getPlaceReviews = async (placeId: number) => {
  const { data } = await apiClient.get<{ data: ReviewResponse[] }>(
    `/api/places/${placeId}/reviews`,
  );
  return data.data;
};

export const createPlaceReview = async (
  placeId: number,
  body: ReviewCreateRequest,
) => {
  const { data } = await apiClient.post<{ data: ReviewResponse }>(
    `/api/places/${placeId}/reviews`,
    body,
  );
  return data.data;
};

export const getEventReviews = async (eventId: number) => {
  const { data } = await apiClient.get<{ data: ReviewResponse[] }>(
    `/api/events/${eventId}/reviews`,
  );
  return data.data;
};

export const createEventReview = async (
  eventId: number,
  body: ReviewCreateRequest,
) => {
  const { data } = await apiClient.post<{ data: ReviewResponse }>(
    `/api/events/${eventId}/reviews`,
    body,
  );
  return data.data;
};

export const deleteReview = async (
  reviewId: number,
  body: ReviewDeleteRequest,
) => {
  await apiClient.delete(`/api/reviews/${reviewId}`, { data: body });
};
