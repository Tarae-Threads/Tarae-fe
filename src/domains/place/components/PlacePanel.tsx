'use client'

import type { Place } from '../types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import TagChip from '@/shared/components/ui/TagChip'
import EventTypeBadge from '@/domains/event/components/EventTypeBadge'
import { getEventsByPlaceId } from '@/domains/event/utils/events'
import { formatDateRange } from '@/domains/event/utils/date'
import { X, Clock, MapPin, ExternalLink, Globe } from 'lucide-react'

interface PlacePanelProps {
  place: Place | null
  open: boolean
  onClose: () => void
}

export default function PlacePanel({ place, open, onClose }: PlacePanelProps) {
  if (!place || !open) return null

  const placeEvents = getEventsByPlaceId(place.id)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-on-surface/10 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div role="dialog" aria-label={`${place.name} 장소 정보`} className="fixed bottom-0 left-0 w-full z-40 max-h-[85vh] overflow-y-auto hide-scrollbar">
        <div className="bg-surface-container-low rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(29,27,22,0.12)] pt-6 pb-32 px-6">
          {/* Handle */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-headline-sm font-extrabold tracking-tight text-on-surface">
                    {place.name}
                  </h2>
                  <CategoryBadge category={place.category} size="md" />
                  <StatusBadge status={place.status} />
                </div>
                <p className="text-on-surface-variant text-body-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {place.address}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>

            {/* Info */}
            <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <Clock className="w-5 h-5 text-outline" />
                <span className="text-body-sm">{place.hours}</span>
              </div>
              {place.closedDays.length > 0 && (
                <p className="text-body-sm text-on-surface-variant pl-8">
                  휴무: {place.closedDays.join(', ')}
                </p>
              )}
              {place.brands.length > 0 && (
                <div className="flex items-start gap-2.5 text-body-sm pl-8">
                  <span className="font-bold text-on-surface shrink-0">취급</span>
                  <span className="text-on-surface-variant">{place.brands.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Note */}
            {place.note && (
              <div className="bg-primary-fixed/30 rounded-xl p-5 mb-5">
                <p className="text-on-surface italic text-body-sm leading-relaxed">
                  &ldquo;{place.note}&rdquo;
                </p>
              </div>
            )}

            {/* Tags */}
            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {place.tags.map(tag => (
                  <TagChip key={tag} label={tag} size="md" />
                ))}
              </div>
            )}

            {/* Links */}
            {(place.links.instagram || place.links.website) && (
              <div className="flex flex-wrap gap-3 mb-5">
                {place.links.instagram && (
                  <a
                    href={place.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-label-lg text-primary font-medium hover:underline decoration-2 underline-offset-4"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Instagram
                  </a>
                )}
                {place.links.website && (
                  <a
                    href={place.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-label-lg text-primary font-medium hover:underline decoration-2 underline-offset-4"
                  >
                    <Globe className="w-4 h-4" />
                    웹사이트
                  </a>
                )}
              </div>
            )}

            {/* Linked Events */}
            {placeEvents.length > 0 && (
              <div className="mb-5">
                <h3 className="font-display font-bold text-body-sm text-on-surface mb-3">예정된 일정</h3>
                <div className="space-y-2">
                  {placeEvents.map(event => (
                    <div key={event.id} className="bg-surface-container rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <EventTypeBadge type={event.type} />
                        <span className="text-label-xs text-outline">
                          {formatDateRange(event.startDate, event.endDate)}
                        </span>
                      </div>
                      <p className="font-display font-bold text-label-md text-on-surface">{event.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
