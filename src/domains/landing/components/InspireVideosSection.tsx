"use client";

import * as React from "react";
import { YouTubeEmbed } from "@next/third-parties/google";
import { ArrowUpRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { getActiveInspireVideos, type InspireVideo } from "../data/inspireVideos";

interface Props {
  videos?: InspireVideo[];
}

export default function InspireVideosSection({ videos }: Props) {
  const list = React.useMemo(() => videos ?? getActiveInspireVideos(), [videos]);

  if (list.length === 0) return null;

  return (
    <section
      className="py-12 md:py-20 bg-surface-container-low"
      aria-label="뜨개 영감 영상"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 md:mb-10">
          <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
            INSPIRATION
          </p>
          <h2 className="font-display font-extrabold text-headline-sm md:text-headline-md text-on-surface">
            뜨개로 이런 것도?
          </h2>
          <p className="text-body-md md:text-body-lg text-on-surface-variant mt-2">
            손님, 이건 직접 뜨셔야 합니다 👀
          </p>
        </div>

        <Carousel
          opts={{ loop: false, align: "start" }}
          className="relative"
        >
          <CarouselContent className="-ml-4">
            {list.map((video) => (
              <CarouselItem
                key={video.id}
                className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <InspireCard video={video} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex -left-4 size-10 bg-white/80 backdrop-blur-md hover:bg-white" />
          <CarouselNext className="hidden md:flex -right-4 size-10 bg-white/80 backdrop-blur-md hover:bg-white" />
        </Carousel>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 개별 카드
// ---------------------------------------------------------------------------

function InspireCard({ video }: { video: InspireVideo }) {
  const { videoId, caption, creator, tag } = video;

  return (
    <article className="h-full flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface-container editorial-shadow">
        <YouTubeEmbed videoid={videoId} params="rel=0" />
      </div>

      <div className="flex-1 flex flex-col gap-2 px-1">
        <p className="font-display font-bold text-title-sm text-on-surface leading-snug line-clamp-2 min-h-[2.75em]">
          {caption}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          {creator.channelUrl ? (
            <a
              href={creator.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-label-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              @{creator.name}
              <ArrowUpRight className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-label-sm font-medium text-on-surface-variant">
              @{creator.name}
            </span>
          )}
          {tag && (
            <span className="bg-surface-container text-on-surface-variant rounded-full px-2 py-0.5 text-label-xs font-bold">
              #{tag}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
