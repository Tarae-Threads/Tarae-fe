"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/shared/lib/utils";
import { track } from "@/shared/lib/analytics";
import {
  getActivePopupBanner,
  type ImagePopupBanner,
  type PopupBanner as PopupBannerData,
} from "../data/popupBanners";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const STORAGE_PREFIX = "tarae_popup_dismissed_";
// ModalProvider 의 Z_BASE(1000) 보다 낮게 — 사용자 모달이 열리면 그 아래로 깔리도록
const Z_INDEX = 900;

interface Props {
  /** 테스트 주입용. 기본값은 getActivePopupBanner() */
  banner?: PopupBannerData | null;
}

export default function PopupBanner({ banner: bannerProp }: Props) {
  const banner = React.useMemo(
    () => (bannerProp !== undefined ? bannerProp : getActivePopupBanner()),
    [bannerProp],
  );

  // SSR-safe: 마운트 후에만 localStorage 체크
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!banner) return;
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + banner.id);
      const ts = raw ? Number(raw) : 0;
      if (ts && Date.now() - ts < ONE_DAY_MS) return;
    } catch {
      // localStorage 접근 실패(시크릿 모드 등) — 기본 노출
    }
    setOpen(true);
  }, [banner]);

  if (!banner) return null;

  const closeForToday = () => {
    try {
      localStorage.setItem(STORAGE_PREFIX + banner.id, String(Date.now()));
    } catch {
      // 저장 실패해도 닫기는 진행
    }
    setOpen(false);
  };

  const closeOnce = () => setOpen(false);

  return (
    <DialogPrimitive.Root
      open={open}
      modal
      onOpenChange={(next) => {
        if (!next) closeOnce();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 bg-black/40 transition-opacity duration-200 supports-backdrop-filter:backdrop-blur-xs data-ending-style:opacity-0 data-starting-style:opacity-0"
          style={{ zIndex: Z_INDEX - 1 }}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed top-1/2 left-1/2 flex w-[min(92vw,360px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-surface editorial-shadow",
            "md:w-[500px] md:rounded-3xl",
            "transition-all duration-200",
            "data-starting-style:opacity-0 data-ending-style:opacity-0",
            "data-starting-style:scale-95 data-ending-style:scale-95",
          )}
          style={{ zIndex: Z_INDEX }}
        >
          <DialogPrimitive.Title className="sr-only">
            {banner.alt}
          </DialogPrimitive.Title>

          {/* 본문 영역 (image / custom 분기) */}
          {banner.kind === "image" ? (
            <ImageBannerBody banner={banner} onClose={closeOnce} />
          ) : (
            <banner.Component onClose={closeOnce} />
          )}

          {/* 하단 액션바 */}
          <div className="flex border-t border-outline-variant text-sm font-medium">
            <button
              type="button"
              onClick={closeForToday}
              className="flex-1 px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              오늘 하루 보지 않기
            </button>
            <div className="w-px bg-outline-variant" aria-hidden="true" />
            <button
              type="button"
              onClick={closeOnce}
              className="flex-1 px-4 py-3 text-on-surface transition-colors hover:bg-surface-container"
            >
              닫기
            </button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ---------------------------------------------------------------------------
// 이미지 배너 본문 — 데스크톱/모바일 두 장 + Link 래핑
// ---------------------------------------------------------------------------

function ImageBannerBody({
  banner,
  onClose,
}: {
  banner: ImagePopupBanner;
  onClose: () => void;
}) {
  const desktopSrc = banner.image.desktop;
  const mobileSrc = banner.image.mobile ?? banner.image.desktop;

  const handleClick = () => {
    if (banner.link.track) {
      track(banner.link.track.event, banner.link.track.params);
    }
    onClose();
  };

  const imageContent = (
    <>
      {/* 모바일 이미지 (4:5) */}
      <Image
        src={mobileSrc}
        alt={banner.alt}
        width={720}
        height={900}
        priority
        sizes="(max-width: 767px) 360px, 0"
        className="block aspect-[4/5] w-full object-cover md:hidden"
      />
      {/* 데스크톱 이미지 (5:6) */}
      <Image
        src={desktopSrc}
        alt={banner.alt}
        width={1000}
        height={1200}
        priority
        sizes="(min-width: 768px) 500px, 0"
        className="hidden aspect-[5/6] w-full object-cover md:block"
      />
    </>
  );

  if (banner.link.external) {
    return (
      <a
        href={banner.link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
      >
        {imageContent}
      </a>
    );
  }

  return (
    <Link href={banner.link.href} onClick={handleClick} className="block">
      {imageContent}
    </Link>
  );
}
