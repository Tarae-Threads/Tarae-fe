"use client";

import { Trash2 } from "lucide-react";
import type { ReviewResponse } from "@/shared/api/client";
import {
  nicknameToInitial,
  nicknameToPalette,
  formatRelativeTime,
} from "../utils/nickname";

interface Props {
  review: ReviewResponse;
  owned?: boolean;
  onDelete?: () => void;
}

export default function ReviewCard({ review, owned, onDelete }: Props) {
  const palette = nicknameToPalette(review.nickname);
  const initial = nicknameToInitial(review.nickname);

  return (
    <div className="bg-surface-container-low rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex size-9 items-center justify-center rounded-full shrink-0 font-display font-bold text-label-lg"
          style={{ background: palette.bg, color: palette.color }}
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-label-md font-bold text-on-surface line-clamp-1">
            {review.nickname}
          </p>
          <p className="text-label-xs text-outline">
            {formatRelativeTime(review.createdAt)}
          </p>
        </div>
        {owned && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="리뷰 삭제"
            className="p-1.5 text-outline hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-body-sm text-on-surface leading-relaxed whitespace-pre-wrap">
        {review.content}
      </p>
    </div>
  );
}
