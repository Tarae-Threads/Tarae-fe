"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Shuffle } from "lucide-react";
import { toast } from "@/shared/components/ui/toast";
import { reviewCreateSchema, type ReviewCreateFormData } from "../schemas/reviewForm";
import {
  createPlaceReview,
  createEventReview,
} from "../queries/reviewApi";
import { STORAGE_KEYS, type ReviewTargetType, type ReviewPrefill } from "../constants";
import { generateRandomNickname } from "../utils/nickname";
import { track } from "@/shared/lib/analytics";
import type { ReviewResponse } from "@/shared/api/client";

interface Props {
  onClose: (result?: ReviewResponse) => void;
  type: ReviewTargetType;
  targetId: number;
}

const CONTENT_MAX = 500;

export default function ReviewForm({ onClose, type, targetId }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewCreateFormData>({
    resolver: zodResolver(reviewCreateSchema),
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
      content: "",
    },
  });

  // localStorage prefill 로드 — 닉네임이 없으면 랜덤 추천
  useEffect(() => {
    if (typeof window === "undefined") return;
    let hasNickname = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REVIEW_PREFILL);
      if (raw) {
        const prefill = JSON.parse(raw) as ReviewPrefill;
        if (prefill.nickname) {
          setValue("nickname", prefill.nickname);
          hasNickname = true;
        }
        if (prefill.email) setValue("email", prefill.email);
      }
    } catch {
      // ignore
    }
    if (!hasNickname) {
      setValue("nickname", generateRandomNickname());
    }
  }, [setValue]);

  const content = watch("content") ?? "";

  const onSubmit = async (data: ReviewCreateFormData) => {
    setSubmitting(true);
    try {
      const review =
        type === "place"
          ? await createPlaceReview(targetId, data)
          : await createEventReview(targetId, data);

      // 다음 작성 편의용 prefill 저장 (비밀번호 제외)
      try {
        const prefill: ReviewPrefill = {
          nickname: data.nickname,
          email: data.email,
        };
        localStorage.setItem(
          STORAGE_KEYS.REVIEW_PREFILL,
          JSON.stringify(prefill),
        );
      } catch {
        // ignore storage errors
      }

      track("review_submit", { target: type, target_id: targetId });
      toast.success("리뷰가 등록되었습니다");
      onClose(review);
    } catch {
      // axios interceptor 에러 토스트
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-2">
      <div>
        <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
          닉네임 *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="뜨개하는고양이"
            maxLength={50}
            {...register("nickname")}
            className={`${inputClass} ${errors.nickname ? "ring-2 ring-destructive/30" : ""}`}
          />
          <button
            type="button"
            onClick={() => setValue("nickname", generateRandomNickname())}
            className="shrink-0 size-11 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-all"
            aria-label="랜덤 닉네임"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
        {errors.nickname && (
          <p className="text-destructive text-label-xs mt-1">
            {errors.nickname.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
          이메일 *
          <span className="text-outline font-medium ml-1">· 공개되지 않아요</span>
        </label>
        <input
          type="email"
          placeholder="cat@example.com"
          {...register("email")}
          className={`${inputClass} ${errors.email ? "ring-2 ring-destructive/30" : ""}`}
        />
        {errors.email && (
          <p className="text-destructive text-label-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
          비밀번호 *
          <span className="text-outline font-medium ml-1">
            · 삭제 시 사용 (4~20자)
          </span>
        </label>
        <input
          type="password"
          maxLength={20}
          placeholder="영숫자, 특수문자 조합"
          {...register("password")}
          className={`${inputClass} ${errors.password ? "ring-2 ring-destructive/30" : ""}`}
        />
        {errors.password && (
          <p className="text-destructive text-label-xs mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
          리뷰 내용 *
        </label>
        <textarea
          rows={5}
          maxLength={CONTENT_MAX}
          placeholder="다녀온 경험을 공유해주세요"
          {...register("content")}
          className={`w-full px-4 py-3 rounded-xl text-label-lg text-on-surface placeholder:text-outline bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
            errors.content ? "ring-2 ring-destructive/30" : ""
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.content ? (
            <p className="text-destructive text-label-xs">
              {errors.content.message}
            </p>
          ) : (
            <span />
          )}
          <p className="text-label-xs text-outline">
            {content.length}/{CONTENT_MAX}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {submitting ? "등록 중..." : "리뷰 등록"}
      </button>
    </form>
  );
}
