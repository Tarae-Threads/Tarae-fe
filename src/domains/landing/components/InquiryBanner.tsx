"use client";

import { MessageCircleQuestion, ArrowRight } from "lucide-react";
import { useModal } from "@/shared/hooks/useModal";
import InquiryForm from "@/domains/inquiry/components/InquiryForm";

export default function InquiryBanner() {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal(InquiryForm, {}, { title: "문의하기", size: "md" });
  };

  return (
    <section className="pb-12 md:pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <button
          type="button"
          onClick={handleClick}
          className="group w-full flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg active:scale-[0.99] text-left"
        >
          <div className="flex items-start md:items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-fixed shrink-0">
              <MessageCircleQuestion className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-title-sm text-on-surface mb-1">
                궁금한 점이 있으신가요?
              </p>
              <p className="text-body-sm text-on-surface-variant">
                서비스 이용 중 불편하거나 궁금한 점이 있다면 편하게 문의해주세요.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-primary font-bold text-label-md group-hover:gap-2.5 transition-all md:shrink-0">
            문의하기 <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </section>
  );
}
