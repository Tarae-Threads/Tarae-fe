"use client";

import type { Event, EventDetail, EventType } from "../types";
import EventTypeBadge from "./EventTypeBadge";
import { MapPin, ExternalLink, Calendar, ChevronRight } from "lucide-react";
import { safeHref } from "@/shared/lib/safeHref";
import { track } from "@/shared/lib/analytics";

function LinkCard({
  href,
  label,
  icon,
  kind,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  kind: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("external_link", { kind })}
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

interface Props {
  event: Event;
  detail?: EventDetail | null;
}

export default function EventDetailView({ event, detail }: Props) {
  const description = detail?.description;
  const locationText = detail?.locationText ?? event.locationText;
  const instagramUrl = safeHref(detail?.instagramUrl ?? event.instagramUrl);
  const websiteUrl = safeHref(detail?.websiteUrl ?? event.websiteUrl);
  const naverMapUrl = safeHref(detail?.naverMapUrl ?? event.naverMapUrl);
  const hasLinks = instagramUrl || websiteUrl || naverMapUrl;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <EventTypeBadge type={event.eventType as EventType} size="md" />
        </div>
        <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-1.5">
          {event.title}
        </h2>
      </div>

      <div className="bg-surface-container rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3 text-body-sm">
          <Calendar className="w-4 h-4 text-outline" />
          <span className="text-on-surface">
            {event.startDate}
            {event.endDate && ` — ${event.endDate}`}
          </span>
        </div>
        {locationText && (
          <div className="flex items-center gap-3 text-body-sm">
            <MapPin className="w-4 h-4 text-outline" />
            <span className="text-on-surface">{locationText}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-body-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
          {description}
        </p>
      )}

      {hasLinks && (
        <div className="space-y-2">
          {instagramUrl && (
            <LinkCard
              href={instagramUrl}
              label="Instagram"
              kind="instagram"
              icon={<ExternalLink className="w-4 h-4" />}
            />
          )}
          {websiteUrl && (
            <LinkCard
              href={websiteUrl}
              label="웹사이트"
              kind="website"
              icon={<ExternalLink className="w-4 h-4" />}
            />
          )}
          {naverMapUrl && (
            <LinkCard
              href={naverMapUrl}
              label="네이버 지도"
              kind="naver_map"
              icon={<MapPin className="w-4 h-4" />}
            />
          )}
        </div>
      )}
    </div>
  );
}
