"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/components/ui/carousel";
import { cn } from "@/shared/lib/utils";
import { track } from "@/shared/lib/analytics";
import { getActiveBanners, type HomeBanner } from "../data/homeBanners";

const AUTOPLAY_DELAY_MS = 5000;

interface Props {
  /** 테스트·스토리북 주입용. 기본값은 getActiveBanners() */
  banners?: HomeBanner[];
}

export default function HomeBannerCarousel({ banners }: Props) {
  const list = React.useMemo(() => banners ?? getActiveBanners(), [banners]);

  const autoplay = React.useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (list.length === 0) return null;

  // 배너가 1장뿐이면 캐러셀 UI 를 생략하고 정적으로 렌더 (LCP·접근성 단순화)
  if (list.length === 1) {
    return (
      <section className="bg-surface relative pt-4 md:pt-8">
        <div className="container mx-auto px-4 md:px-8">
          <BannerSlide banner={list[0]} priority />
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-surface relative pt-4 md:pt-8"
      aria-roledescription="carousel"
      aria-label="홈 배너"
    >
      <div className="container mx-auto px-4 md:px-8">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          plugins={[autoplay.current]}
          className="relative"
        >
          <CarouselContent className="-ml-0">
            {list.map((banner, i) => (
              <CarouselItem
                key={banner.id}
                className="pl-0"
                aria-label={`${i + 1} / ${list.length}`}
              >
                <BannerSlide banner={banner} priority={i === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 데스크톱 이전/다음 버튼 — 모바일은 터치 스와이프 주력 */}
          <CarouselPrevious className="left-2 hidden size-10 bg-white/70 backdrop-blur-md hover:bg-white md:flex" />
          <CarouselNext className="right-2 hidden size-10 bg-white/70 backdrop-blur-md hover:bg-white md:flex" />
        </Carousel>

        {/* 인디케이터 */}
        <div
          className="mt-3 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="배너 페이지"
        >
          {list.map((banner, i) => {
            const selected = i === current;
            return (
              <button
                key={banner.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`${i + 1}번 배너로 이동`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "focus-visible:ring-primary/50 h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  selected
                    ? "bg-primary w-6"
                    : "bg-outline-variant hover:bg-outline w-2",
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 개별 슬라이드
// ---------------------------------------------------------------------------

function BannerSlide({
  banner,
  priority,
}: {
  banner: HomeBanner;
  priority?: boolean;
}) {
  const { image, Background, alt, link, overlay } = banner;
  const theme = overlay?.theme ?? "light";
  const textColor = theme === "light" ? "text-white" : "text-on-surface";
  const subColor =
    theme === "light" ? "text-white/85" : "text-on-surface-variant";

  const hasImage = !!image;
  const hasBackground = !hasImage && !!Background;

  const content = (
    <div className="editorial-shadow relative block overflow-hidden rounded-3xl">
      {hasImage ? (
        <>
          {/* 모바일 이미지 */}
          <Image
            src={image.mobile ?? image.desktop}
            alt={alt ?? ""}
            width={750}
            height={600}
            priority={priority}
            sizes="(max-width: 767px) 100vw, 0"
            className="block aspect-[5/4] w-full object-cover md:hidden"
          />
          {/* 데스크톱 이미지 */}
          <Image
            src={image.desktop}
            alt={alt ?? ""}
            width={1600}
            height={600}
            priority={priority}
            sizes="(min-width: 768px) 100vw, 0"
            className="hidden aspect-[8/3] w-full object-cover md:block"
          />
        </>
      ) : hasBackground ? (
        // 커스텀 배경 컴포넌트 (SVG 등)
        <div className="relative aspect-[5/4] w-full overflow-hidden md:aspect-[8/3]">
          <Background />
        </div>
      ) : (
        // fallback: signature-gradient + 블러 장식
        <div
          className="signature-gradient relative aspect-[5/4] w-full md:aspect-[8/3]"
          aria-hidden="true"
        >
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
      )}

      {overlay &&
        (overlay.eyebrow ||
          overlay.title ||
          overlay.description ||
          overlay.ctaLabel) && (
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            {/* 이미지 배경이면서 밝은 텍스트일 때만 가독성용 검정 그라데이션 */}
            {hasImage && theme === "light" && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/5"
              />
            )}
            <div
              className={cn(
                "relative",
                textColor,
                // 밝은 배경 위에서도 글씨가 뜨도록 drop-shadow
                theme === "light" &&
                  "[text-shadow:_0_2px_8px_rgba(0,0,0,0.35)]",
              )}
            >
              {overlay.eyebrow && (
                <p
                  className={cn(
                    "text-label-sm md:text-label-md mb-3 font-bold font-extrabold tracking-widest uppercase",
                    theme === "light" ? "text-white" : "text-primary",
                  )}
                >
                  {overlay.eyebrow}
                </p>
              )}
              {overlay.title && (
                <h2 className="font-display text-headline-md md:text-display-sm mb-3 line-clamp-2 leading-tight font-extrabold">
                  {overlay.title}
                </h2>
              )}
              {overlay.description && (
                <p
                  className={cn(
                    "text-body-lg md:text-title-sm mb-5 line-clamp-2 font-medium",
                    subColor,
                  )}
                >
                  {overlay.description}
                </p>
              )}
              {overlay.ctaLabel && (
                <span className="text-title-sm inline-flex items-center gap-1.5 font-extrabold">
                  {overlay.ctaLabel} <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </div>
          </div>
        )}
    </div>
  );

  const handleClick = () => {
    if (link.track) track(link.track.event, link.track.params);
  };

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} onClick={handleClick} className="block">
      {content}
    </Link>
  );
}
