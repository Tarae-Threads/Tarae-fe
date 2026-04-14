"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { toast } from "@/shared/components/ui/toast";
import { deleteReview } from "../queries/reviewApi";
import {
  reviewDeleteSchema,
  type ReviewDeleteFormData,
} from "../schemas/reviewForm";

interface Props {
  onClose: (deleted?: boolean) => void;
  reviewId: number;
}

export default function ReviewDeleteConfirm({ onClose, reviewId }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewDeleteFormData>({
    resolver: zodResolver(reviewDeleteSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (data: ReviewDeleteFormData) => {
    setSubmitting(true);
    try {
      await deleteReview(reviewId, { password: data.password });
      toast.success("리뷰가 삭제되었습니다");
      onClose(true);
    } catch {
      // 서버가 비밀번호 틀리면 에러 → axios interceptor가 토스트
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
      <p className="text-body-sm text-on-surface-variant">
        작성 시 입력한 비밀번호를 입력하시면 삭제됩니다.
      </p>
      <div>
        <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
          비밀번호
        </label>
        <input
          type="password"
          maxLength={20}
          autoFocus
          placeholder="비밀번호"
          {...register("password")}
          className={`w-full h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            errors.password ? "ring-2 ring-destructive/30" : ""
          }`}
        />
        {errors.password && (
          <p className="text-destructive text-label-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onClose(false)}
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface-variant font-bold text-label-md hover:bg-surface-container-high disabled:opacity-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold text-label-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {submitting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </form>
  );
}
