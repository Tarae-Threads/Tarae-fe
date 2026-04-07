"use client";

import type { Place, PlaceDetail, BrandInfo } from "@/domains/place/types";
import type { Event, EventDetail, EventType } from "@/domains/event/types";
import CategoryBadge from "@/domains/place/components/CategoryBadge";
import StatusBadge from "@/domains/place/components/StatusBadge";
import EventTypeBadge from "@/domains/event/components/EventTypeBadge";
import TagChip from "@/shared/components/ui/TagChip";
import {
  X,
  MapPin,
  ExternalLink,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

type DetailData =
  | { type: "place"; place: Place; placeDetail?: PlaceDetail | null }
  | { type: "event"; event: Event; eventDetail?: EventDetail | null };

interface Props {
  data: DetailData;
  onClose: () => void;
}

export default function DetailPanel({ data, onClose }: Props) {
  return (
    <div className="hidden md:flex flex-col w-[380px] shrink-0 h-full bg-surface border-r border-border overflow-hidden">
      {/* Header */}
      <div className="flex justify-end px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onClose}
          aria-label="닫기"
          className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-outline" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-6">
        {data.type === "place" ? (
          <PlaceDetailContent place={data.place} detail={data.placeDetail} />
        ) : (
          <EventDetailContent event={data.event} detail={data.eventDetail} />
        )}
      </div>
    </div>
  );
}

/* ---- Place Detail ---- */
function PlaceDetailContent({ place, detail }: { place: Place; detail?: PlaceDetail | null }) {
  // detail이 있으면 상세 데이터 사용, 없으면 목록 데이터로 기본 표시
  const categories = detail?.categories ?? place.categories;
  const tags = detail?.tags ?? place.tags;
  const instagramUrl = detail?.instagramUrl ?? place.instagramUrl;
  const websiteUrl = detail?.websiteUrl;
  const naverMapUrl = detail?.naverMapUrl ?? place.naverMapUrl;

  return (
    <>
      <div className="flex items-center gap-2 mb-3 mt-2">
        {categories.map((cat) => (
          <CategoryBadge key={cat.id} category={cat.name} />
        ))}
        <StatusBadge status={place.status} />
      </div>

      <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-2">
        {place.name}
      </h2>
      <p className="text-on-surface-variant text-body-sm flex items-center gap-1.5 mb-5">
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        {place.address}
      </p>

      {/* 상세 정보 (API에서 가져온 경우) */}
      {detail && (
        <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
          {detail.hoursText && (
            <div className="flex items-start gap-2.5 text-body-sm">
              <span className="font-medium text-on-surface shrink-0">영업시간</span>
              <span className="text-on-surface-variant">{detail.hoursText}</span>
            </div>
          )}
          {detail.closedDays && (
            <div className="flex items-start gap-2.5 text-body-sm">
              <span className="font-medium text-on-surface shrink-0">휴무일</span>
              <span className="text-on-surface-variant">{detail.closedDays}</span>
            </div>
          )}
          {detail.description && (
            <div className="flex items-start gap-2.5 text-body-sm">
              <span className="font-medium text-on-surface shrink-0">설명</span>
              <span className="text-on-surface-variant">{detail.description}</span>
            </div>
          )}
        </div>
      )}

      {/* 브랜드 */}
      {detail?.brands && detail.brands.length > 0 && (
        <div className="mb-5">
          <BrandsAccordion brands={detail.brands} />
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags.map((tag) => (
            <TagChip key={tag.id} label={tag.name} size="md" />
          ))}
        </div>
      )}

      {/* 링크 */}
      <div className="flex flex-wrap gap-3 mb-5">
        {instagramUrl && (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-label-lg font-medium hover:underline decoration-2 underline-offset-4">
            <ExternalLink className="w-3.5 h-3.5" /> Instagram
          </a>
        )}
        {websiteUrl && (
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-label-lg font-medium hover:underline decoration-2 underline-offset-4">
            <ExternalLink className="w-3.5 h-3.5" /> 웹사이트
          </a>
        )}
        {naverMapUrl && (
          <a href={naverMapUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-label-lg font-medium hover:underline decoration-2 underline-offset-4">
            <ExternalLink className="w-3.5 h-3.5" /> 네이버 지도
          </a>
        )}
      </div>
    </>
  );
}

/* ---- Event Detail ---- */
function EventDetailContent({ event, detail }: { event: Event; detail?: EventDetail | null }) {
  const description = detail?.description;
  const locationText = detail?.locationText ?? event.locationText;
  const links = detail?.links ?? event.links;

  return (
    <>
      <div className="flex items-center gap-2 mb-3 mt-2">
        <EventTypeBadge type={event.eventType as EventType} size="md" />
      </div>

      <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-2">
        {event.title}
      </h2>

      {/* Info */}
      <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
        <div className="flex items-center gap-2.5 text-body-sm">
          <Calendar className="w-4 h-4 text-outline" />
          <span className="text-on-surface-variant">
            {event.startDate}
            {event.endDate && ` — ${event.endDate}`}
          </span>
        </div>
        {locationText && (
          <div className="flex items-center gap-2.5 text-body-sm">
            <MapPin className="w-4 h-4 text-outline" />
            <span className="text-on-surface-variant">{locationText}</span>
          </div>
        )}
      </div>

      {/* 설명 (상세 API에서만 제공) */}
      {description && (
        <p className="text-body-sm text-on-surface-variant mb-5 whitespace-pre-line">
          {description}
        </p>
      )}

      {/* External link */}
      {links && (
        <a
          href={links}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-bold text-label-lg hover:underline decoration-2 underline-offset-4"
        >
          <ExternalLink className="w-4 h-4" />
          자세히 보기
        </a>
      )}
    </>
  );
}

/* ---- Brands Accordion ---- */
const BRAND_TYPE_LABELS: Record<string, string> = {
  yarn: "실",
  needle: "바늘",
  notions: "부자재",
};

function BrandsAccordion({ brands }: { brands: BrandInfo[] }) {
  const [open, setOpen] = useState(false);

  if (!brands || brands.length === 0) return null;

  // Group brands by type
  const grouped = brands.reduce<Record<string, BrandInfo[]>>((acc, brand) => {
    const key = brand.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(brand);
    return acc;
  }, {});

  return (
    <div className="text-body-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-bold text-on-surface w-full"
      >
        <span>취급 브랜드</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 pl-1">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="flex items-start gap-2">
              <span className="font-medium text-on-surface shrink-0">
                {BRAND_TYPE_LABELS[type] ?? type}
              </span>
              <span className="text-on-surface-variant">
                {items.map((b) => b.name).join(", ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
