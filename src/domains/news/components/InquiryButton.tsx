"use client";

import { CircleQuestionMark } from "lucide-react";
import { useModal } from "@/shared/hooks/useModal";
import InquiryForm from "@/domains/inquiry/components/InquiryForm";

interface Props {
  label?: string;
}

export default function InquiryButton({ label = "문의하기" }: Props) {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(InquiryForm, {}, { title: "문의하기", size: "md" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group bg-surface-container-high text-label-md text-primary hover:bg-surface-container my-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl px-5 py-3 font-bold transition-all active:scale-[0.98]"
    >
      <CircleQuestionMark className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
