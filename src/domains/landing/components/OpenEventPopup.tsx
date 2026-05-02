"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { track } from "@/shared/lib/analytics";
import type { PopupContentProps } from "../data/popupBanners";

const PRIZE_THUMBS = [
  {
    src: "/events/능소화레이스_요나와작은보석들.jpg",
    alt: "요나와 능소화 레이스",
  },
  {
    src: "/events/순수한면_요나와작은보석들.jpg",
    alt: "너의 순수한면 레이스",
  },
  {
    src: "/events/딸기요거트스무디_울다방.jpg",
    alt: "딸기요거트스무디 레이스",
  },
  {
    src: "/events/키링3종_울다방.jpg",
    alt: "ME 시리즈 키링 3종 세트",
  },
] as const;

const SPONSOR_LOGOS = [
  { src: "/events/FFO_logo.png", alt: "엪엪오 니팅스튜디오" },
  { src: "/events/요나와작은보석들_logo.png", alt: "요나와 작은보석들" },
  { src: "/events/울다방_logo.png", alt: "울다방" },
] as const;

export default function OpenEventPopup({ onClose }: PopupContentProps) {
  const router = useRouter();

  const handleCTA = () => {
    track("landing_popup_click", { popup: "open-event-launch-2026" });
    onClose();
    router.push("/news/open-event");
  };

  return (
    <div className="flex flex-col">
      {/* 그라디언트 헤더 */}
      <div className="signature-gradient px-5 pt-5 pb-4 text-white">
        <p className="font-display text-title-md leading-tight font-extrabold">
          🎁 런칭 기념 경품 이벤트
        </p>
        <p className="text-label-md mt-1 opacity-90">
          리뷰·제보로 참여하면 7분께 추첨
        </p>
      </div>

      {/* 경품 섬네일 그리드 */}
      <div className="grid grid-cols-4 gap-2 px-5 pt-4">
        {PRIZE_THUMBS.map((p) => (
          <div
            key={p.src}
            className="bg-surface-container relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 767px) 80px, 110px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* 본문 안내 */}
      <p className="text-body-md text-on-surface-variant flex justify-center px-5 pt-3 leading-relaxed font-bold">
        총 7분께 경품 랜덤 추첨
      </p>

      {/* 브랜드 로고 행 */}
      <div className="px-5 pt-4">
        <p className="text-label-xs text-on-surface-variant text-center">
          함께해주신 브랜드
        </p>
        <div className="-mx-2 mt-3 flex items-center justify-center gap-3">
          {SPONSOR_LOGOS.map((logo) => (
            <div key={logo.src} className="relative h-24 flex-1">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="(max-width: 767px) 110px, 150px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pt-4 pb-5">
        <button
          type="button"
          onClick={handleCTA}
          className="signature-gradient text-label-lg shadow-primary/25 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-white shadow-lg transition-all active:scale-[0.98]"
        >
          자세히 보기
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
