"use client";

import { MessageSquare, PenSquare } from "lucide-react";
import Skeleton from "@/shared/components/ui/Skeleton";
import EmptyState from "@/shared/components/ui/EmptyState";
import { useModal } from "@/shared/hooks/useModal";
import { useReviews } from "../hooks/useReviews";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import ReviewDeleteConfirm from "./ReviewDeleteConfirm";
import type { ReviewTargetType } from "../constants";
import type { ReviewResponse } from "@/shared/api/client";

interface Props {
  type: ReviewTargetType;
  targetId: number;
}

export default function ReviewSection({ type, targetId }: Props) {
  const { reviews, loading, ownedIds, addLocalReview, removeLocalReview } =
    useReviews(type, targetId);
  const { openModal } = useModal();

  const handleWrite = async () => {
    const result = (await openModal(
      ReviewForm,
      { type, targetId },
      { title: "리뷰 작성", size: "md" },
    )) as ReviewResponse | undefined;
    if (result) addLocalReview(result);
  };

  const handleDelete = async (reviewId: number) => {
    const deleted = (await openModal(
      ReviewDeleteConfirm,
      { reviewId },
      { title: "리뷰 삭제", size: "sm" },
    )) as boolean | undefined;
    if (deleted) removeLocalReview(reviewId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-label-md font-bold text-on-surface-variant">
          리뷰 {reviews.length}
        </p>
        <button
          type="button"
          onClick={handleWrite}
          className="inline-flex items-center gap-1.5 bg-primary text-white font-bold text-label-md px-3.5 py-2 rounded-full active:scale-95 transition-transform"
        >
          <PenSquare className="w-3.5 h-3.5" />
          작성하기
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
              <Skeleton className="h-3.5 w-full mb-1.5" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="아직 리뷰가 없어요"
          description="첫 리뷰를 남겨 경험을 공유해보세요."
          icon={<MessageSquare className="w-8 h-8 text-outline" />}
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              owned={ownedIds.has(review.id)}
              onDelete={() => handleDelete(review.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
