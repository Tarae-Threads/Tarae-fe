"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { toast } from "@/shared/components/ui/toast";
import { inquiryCreateSchema, type InquiryCreateFormData } from "../schemas/inquiryForm";
import { createInquiry } from "../queries/inquiryApi";
import { track } from "@/shared/lib/analytics";

interface Props {
  onClose: () => void;
}

const BODY_MAX = 2000;

export default function InquiryForm({ onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InquiryCreateFormData>({
    resolver: zodResolver(inquiryCreateSchema),
    defaultValues: { title: "", body: "", email: "" },
  });

  const body = watch("body") ?? "";

  const onSubmit = async (data: InquiryCreateFormData) => {
    setSubmitting(true);
    try {
      await createInquiry(data);
      track("inquiry_submit");
      toast.success("문의가 접수되었습니다. 빠른 시일 내 답변 드릴게요!");
      onClose();
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
        <label htmlFor="inquiry-title" className="text-label-md font-bold text-on-surface-variant mb-1 block">
          제목 *
        </label>
        <input
          id="inquiry-title"
          type="text"
          placeholder="문의 제목을 입력해주세요"
          maxLength={255}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "inquiry-title-error" : undefined}
          {...register("title")}
          className={`${inputClass} ${errors.title ? "ring-2 ring-destructive/30" : ""}`}
        />
        {errors.title && (
          <p id="inquiry-title-error" role="alert" className="text-destructive text-label-xs mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="inquiry-body" className="text-label-md font-bold text-on-surface-variant mb-1 block">
          내용 *
        </label>
        <textarea
          id="inquiry-body"
          rows={6}
          maxLength={BODY_MAX}
          placeholder="궁금한 점이나 건의사항을 자유롭게 작성해주세요"
          aria-invalid={!!errors.body}
          aria-describedby={errors.body ? "inquiry-body-error" : undefined}
          {...register("body")}
          className={`w-full px-4 py-3 rounded-xl text-label-lg text-on-surface placeholder:text-outline bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
            errors.body ? "ring-2 ring-destructive/30" : ""
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.body ? (
            <p id="inquiry-body-error" role="alert" className="text-destructive text-label-xs">
              {errors.body.message}
            </p>
          ) : (
            <span />
          )}
          <p className="text-label-xs text-outline" aria-live="polite">
            {body.length}/{BODY_MAX}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="inquiry-email" className="text-label-md font-bold text-on-surface-variant mb-1 block">
          이메일 *
          <span className="text-outline font-medium ml-1">· 답변받을 주소</span>
        </label>
        <input
          id="inquiry-email"
          type="email"
          placeholder="user@example.com"
          maxLength={100}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "inquiry-email-error" : undefined}
          {...register("email")}
          className={`${inputClass} ${errors.email ? "ring-2 ring-destructive/30" : ""}`}
        />
        {errors.email && (
          <p id="inquiry-email-error" role="alert" className="text-destructive text-label-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        {submitting ? "접수 중..." : "문의 보내기"}
      </button>
    </form>
  );
}
