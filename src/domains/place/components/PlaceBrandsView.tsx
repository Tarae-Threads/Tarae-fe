"use client";

import type { PlaceDetail, BrandInfo } from "../types";
import Skeleton from "@/shared/components/ui/Skeleton";
import EmptyState from "@/shared/components/ui/EmptyState";
import {
  PenTool,
  Scissors,
  Volleyball,
  BookOpen,
  Package,
} from "lucide-react";

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
  PATTERNBOOK: {
    label: "도서",
    Icon: BookOpen,
    iconClass: "w-4 h-4 text-on-surface-variant",
    bg: "bg-surface-container-high",
  },
};

interface Props {
  detail?: PlaceDetail | null;
}

export default function PlaceBrandsView({ detail }: Props) {
  if (!detail) {
    return (
      <div className="space-y-3 animate-pulse">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (detail.brands.length === 0) {
    return (
      <EmptyState
        title="취급 브랜드 정보가 없어요"
        description="아는 브랜드가 있다면 제보해주세요."
        icon={<Package className="w-8 h-8 text-outline" />}
      />
    );
  }

  const grouped = detail.brands.reduce<Record<string, BrandInfo[]>>(
    (acc, b) => {
      if (!acc[b.type]) acc[b.type] = [];
      acc[b.type].push(b);
      return acc;
    },
    {},
  );
  const orderedTypes = ["YARN", "NEEDLE", "NOTIONS", "PATTERNBOOK"].filter(
    (t) => grouped[t],
  );
  Object.keys(grouped).forEach((t) => {
    if (!orderedTypes.includes(t)) orderedTypes.push(t);
  });

  return (
    <div className="space-y-3">
      {orderedTypes.map((type) => {
        const items = grouped[type];
        const config = BRAND_TYPE_CONFIG[type];
        const IconComp = config?.Icon;
        return (
          <div key={type} className="bg-surface-container rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex size-9 items-center justify-center rounded-xl ${config?.bg ?? "bg-surface-container-high"} shrink-0`}
              >
                {IconComp && <IconComp className={config.iconClass} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-sm font-bold text-on-surface mb-2">
                  {config?.label ?? type}
                </p>
                <div className="flex flex-wrap gap-1.5">
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
          </div>
        );
      })}
    </div>
  );
}
