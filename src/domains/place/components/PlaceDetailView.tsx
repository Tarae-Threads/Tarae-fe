"use client";

import type { Place, PlaceDetail, BrandInfo } from "../types";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import TagChip from "@/shared/components/ui/TagChip";
import Skeleton from "@/shared/components/ui/Skeleton";
import {
  MapPin,
  Clock,
  XCircle,
  ExternalLink,
  ChevronRight,
  PenTool,
  Scissors,
  Volleyball,
} from "lucide-react";

// ---------------------------------------------------------------------------
// 브랜드 타입 라벨
// ---------------------------------------------------------------------------

const BRAND_TYPE_CONFIG: Record<
  string,
  { label: string; Icon: typeof Volleyball; iconClass: string; bg: string }
> = {
  YARN: {
    label: "실",
    Icon: Volleyball,
    iconClass: "w-4 h-4 text-primary",
    bg: "bg-primary-fixed",
  },
  NEEDLE: {
    label: "바늘",
    Icon: PenTool,
    iconClass: "w-4 h-4 text-secondary",
    bg: "bg-secondary-container",
  },
  NOTIONS: {
    label: "부자재",
    Icon: Scissors,
    iconClass: "w-4 h-4 text-warmyellow-container",
    bg: "bg-warmyellow",
  },
};

// ---------------------------------------------------------------------------
// 링크 카드
// ---------------------------------------------------------------------------

function LinkCard({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors group"
    >
      <span className="text-primary">{icon}</span>
      <span className="flex-1 text-label-lg font-medium text-on-surface">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-outline group-hover:text-on-surface-variant transition-colors" />
    </a>
  );
}

// ---------------------------------------------------------------------------
// 로딩 Skeleton
// ---------------------------------------------------------------------------

function PlaceDetailSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="flex gap-1.5">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlaceDetailView
// ---------------------------------------------------------------------------

interface Props {
  place: Place;
  detail?: PlaceDetail | null;
}

export default function PlaceDetailView({ place, detail }: Props) {
  const categories = detail?.categories ?? place.categories;
  const tags = detail?.tags ?? place.tags;
  const instagramUrl = detail?.instagramUrl ?? place.instagramUrl;
  const websiteUrl = detail?.websiteUrl;
  const naverMapUrl = detail?.naverMapUrl ?? place.naverMapUrl;
  const hasLinks = instagramUrl || websiteUrl || naverMapUrl;
  const isLoading = !detail;

  return (
    <div className="space-y-5">
      {/* 아이덴티티 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {categories.map((cat) => (
            <CategoryBadge key={cat.id} category={cat.name} />
          ))}
          <StatusBadge status={place.status} />
        </div>

        <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-1.5">
          {place.name}
        </h2>

        <p className="text-on-surface-variant text-body-sm flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-outline" />
          {place.address}
        </p>
      </div>

      {/* 운영 정보 */}
      {isLoading ? (
        <PlaceDetailSkeleton />
      ) : (
        <>
          {(detail.hoursText || detail.closedDays) && (
            <div className="bg-surface-container rounded-2xl p-4 space-y-3">
              {detail.hoursText && (
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-secondary-container shrink-0">
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-label-sm font-bold text-on-surface-variant mb-0.5">
                      영업시간
                    </p>
                    <p className="text-body-sm text-on-surface">
                      {detail.hoursText}
                    </p>
                  </div>
                </div>
              )}
              {detail.closedDays && (
                <div className="flex items-start gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 shrink-0">
                    <XCircle className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-label-sm font-bold text-on-surface-variant mb-0.5">
                      휴무일
                    </p>
                    <p className="text-body-sm text-on-surface">
                      {detail.closedDays}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 설명 */}
          {detail.description && (
            <div className="bg-surface-container rounded-2xl p-4">
              <p className="text-label-sm font-bold text-on-surface-variant mb-1.5">
                소개
              </p>
              <p className="text-body-sm text-on-surface leading-relaxed whitespace-pre-line">
                {detail.description}
              </p>
            </div>
          )}

          {/* 브랜드 */}
          {detail.brands.length > 0 && (
            <div className="bg-surface-container rounded-2xl p-4">
              <p className="text-label-sm font-bold text-on-surface-variant mb-3">
                취급 브랜드
              </p>
              <div className="space-y-3">
                {(() => {
                  const grouped = detail.brands.reduce<
                    Record<string, BrandInfo[]>
                  >((acc, b) => {
                    if (!acc[b.type]) acc[b.type] = [];
                    acc[b.type].push(b);
                    return acc;
                  }, {});
                  const orderedTypes = ["YARN", "NEEDLE", "NOTIONS"].filter(
                    (t) => grouped[t],
                  );
                  // 혹시 알 수 없는 타입이 있으면 뒤에 추가
                  Object.keys(grouped).forEach((t) => {
                    if (!orderedTypes.includes(t)) orderedTypes.push(t);
                  });
                  return orderedTypes.map((type, idx) => {
                    const items = grouped[type];
                    const config = BRAND_TYPE_CONFIG[type];
                    const IconComp = config?.Icon;
                    return (
                      <div key={type}>
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex size-8 items-center justify-center rounded-lg ${config?.bg ?? "bg-surface-container-high"} shrink-0`}
                          >
                            {IconComp && (
                              <IconComp className={config.iconClass} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-label-sm font-bold text-on-surface mb-1">
                              {config?.label ?? type}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {items.map((b) => (
                                <span
                                  key={b.id}
                                  className="px-2.5 py-1 rounded-full bg-surface text-on-surface-variant text-label-xs font-medium"
                                >
                                  {b.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {idx < orderedTypes.length - 1 && (
                          <div className="border-t border-outline-variant/20 mt-3" />
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </>
      )}

      {/* 태그 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <TagChip key={tag.id} label={tag.name} size="md" />
          ))}
        </div>
      )}

      {/* 링크 */}
      {hasLinks && (
        <div className="space-y-2">
          {instagramUrl && (
            <LinkCard
              href={instagramUrl}
              label="Instagram"
              icon={<ExternalLink className="w-4 h-4" />}
            />
          )}
          {websiteUrl && (
            <LinkCard
              href={websiteUrl}
              label="웹사이트"
              icon={<ExternalLink className="w-4 h-4" />}
            />
          )}
          {naverMapUrl && (
            <LinkCard
              href={naverMapUrl}
              label="네이버 지도"
              icon={<MapPin className="w-4 h-4" />}
            />
          )}
        </div>
      )}
    </div>
  );
}
