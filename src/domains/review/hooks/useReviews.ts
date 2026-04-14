"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReviewResponse } from "@/shared/api/client";
import {
  getPlaceReviews,
  getEventReviews,
} from "../queries/reviewApi";
import {
  STORAGE_KEYS,
  type ReviewTargetType,
  type OwnedReviewRecord,
} from "../constants";

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function loadOwned(): OwnedReviewRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OWNED_REVIEWS);
    return raw ? (JSON.parse(raw) as OwnedReviewRecord[]) : [];
  } catch {
    return [];
  }
}

function saveOwned(records: OwnedReviewRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.OWNED_REVIEWS, JSON.stringify(records));
}

export function addOwnedReview(record: OwnedReviewRecord) {
  const all = loadOwned();
  all.push(record);
  saveOwned(all);
}

export function removeOwnedReview(reviewId: number) {
  const all = loadOwned().filter((r) => r.reviewId !== reviewId);
  saveOwned(all);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useReviews(type: ReviewTargetType, targetId: number) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set());

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const list =
        type === "place"
          ? await getPlaceReviews(targetId)
          : await getEventReviews(targetId);
      // 최신순 정렬
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setReviews(list);
    } catch {
      // axios interceptor가 토스트 처리
    } finally {
      setLoading(false);
    }
  }, [type, targetId]);

  const refreshOwned = useCallback(() => {
    const ids = new Set(loadOwned().map((r) => r.reviewId));
    setOwnedIds(ids);
  }, []);

  useEffect(() => {
    fetchList();
    refreshOwned();
  }, [fetchList, refreshOwned]);

  const addLocalReview = useCallback(
    (review: ReviewResponse) => {
      setReviews((prev) => [review, ...prev]);
      addOwnedReview({ reviewId: review.id, targetType: type, targetId });
      refreshOwned();
    },
    [type, targetId, refreshOwned],
  );

  const removeLocalReview = useCallback(
    (reviewId: number) => {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      removeOwnedReview(reviewId);
      refreshOwned();
    },
    [refreshOwned],
  );

  return {
    reviews,
    loading,
    ownedIds,
    refetch: fetchList,
    addLocalReview,
    removeLocalReview,
  };
}
