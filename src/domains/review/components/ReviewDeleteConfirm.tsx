"use client";

import { useEffect, useRef, useState } from "react";
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

// 클라이언트 측 brute force 완화용 쿨다운
// (실제 방어는 서버에서 IP/리뷰당 시도 제한이 필요함)
const MAX_ATTEMPTS = 5;
const COOLDOWN_SEC = 30;

export default function ReviewDeleteConfirm({ onClose, reviewId }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewDeleteFormData>({
    resolver: zodResolver(reviewDeleteSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldownLeft(COOLDOWN_SEC);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldownLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setAttempts(0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data: ReviewDeleteFormData) => {
    if (cooldownLeft > 0) return;
    setSubmitting(true);
    try {
      await deleteReview(reviewId, { password: data.password });
      toast.success("리뷰가 삭제되었습니다");
      onClose(true);
    } catch {
      // 틀린 비밀번호 포함 — axios interceptor가 일반 에러 토스트
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) startCooldown();
    } finally {
      setSubmitting(false);
    }
  };

  const locked = cooldownLeft > 0;

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
          disabled={locked}
          {...register("password")}
          className={`w-full h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 ${
            errors.password ? "ring-2 ring-destructive/30" : ""
          }`}
        />
        {errors.password && (
          <p className="text-destructive text-label-xs mt-1">
            {errors.password.message}
          </p>
        )}
        {locked && (
          <p className="text-destructive text-label-xs mt-1">
            시도 횟수 초과 — {cooldownLeft}초 후 다시 시도해주세요.
          </p>
        )}
        {!locked && attempts > 0 && (
          <p className="text-outline text-label-xs mt-1">
            {MAX_ATTEMPTS - attempts}회 시도 남았어요.
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
          disabled={submitting || locked}
          className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold text-label-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {submitting ? "삭제 중..." : locked ? `대기 ${cooldownLeft}s` : "삭제"}
        </button>
      </div>
    </form>
  );
}
