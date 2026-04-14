export const STORAGE_KEYS = {
  OWNED_REVIEWS: "tarae_owned_reviews",
  REVIEW_PREFILL: "tarae_review_prefill",
} as const;

export type ReviewTargetType = "place" | "event";

export interface OwnedReviewRecord {
  reviewId: number;
  targetType: ReviewTargetType;
  targetId: number;
}

export interface ReviewPrefill {
  nickname?: string;
  email?: string;
}
