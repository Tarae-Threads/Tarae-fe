'use client'

import type { Place } from '../types'
import type { AnyEvent } from '@/domains/event/types'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import TagChip from '@/shared/components/ui/TagChip'
import EventTypeBadge from '@/domains/event/components/EventTypeBadge'
import RecruitmentStatusBadge from '@/domains/event/components/RecruitmentStatusBadge'
import TesterApplicationForm from '@/domains/event/components/TesterApplicationForm'
import { isTesterRecruitment } from '@/domains/event/utils/typeGuards'
import { getEventsByPlaceId, getLinkedPlace } from '@/domains/event/utils/events'
import { formatDateRange } from '@/domains/event/utils/date'
import { CATEGORY_LABEL } from '../constants'
import { X, Clock, MapPin, ExternalLink, Globe, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

type DetailData =
  | { type: 'place'; place: Place }
  | { type: 'event'; event: AnyEvent }

interface Props {
  data: DetailData | null
  open: boolean
  onClose: () => void
}

export default function PlacePanel({ data, open, onClose }: Props) {
  if (!data || !open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-on-surface/20 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label="상세 정보"
        className="fixed bottom-[48px] left-0 w-full z-40 flex flex-col bg-surface-container-low rounded-t-[2rem] shadow-[0_-12px_48px_rgba(29,27,22,0.15)]"
        style={{ height: '65vh' }}
      >
        {/* Handle + Close */}
        <div className="flex-shrink-0 pt-3 px-4">
          <div className="flex justify-center pb-2">
            <div className="w-10 h-1 bg-outline-variant rounded-full" />
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} aria-label="닫기" className="p-2 hover:bg-surface-container rounded-full transition-colors">
              <X className="w-5 h-5 text-outline" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-2xl mx-auto">
            {data.type === 'place' ? (
              <PlaceContent place={data.place} />
            ) : (
              <EventContent event={data.event} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ---- Place Content ---- */
function PlaceContent({ place }: { place: Place }) {
  const placeEvents = getEventsByPlaceId(place.id)

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-display text-headline-sm font-extrabold tracking-editorial text-on-surface">
          {place.name}
        </h2>
        <CategoryBadge category={place.category} size="md" />
        <StatusBadge status={place.status} />
      </div>

      <p className="text-on-surface-variant text-body-sm flex items-center gap-1.5 mb-5">
        <MapPin className="w-3.5 h-3.5" />
        {place.address}
      </p>

      <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-outline" />
          <span className="text-body-sm text-on-surface-variant">{place.hours}</span>
        </div>
        {place.closedDays.length > 0 && (
          <p className="text-body-sm text-on-surface-variant pl-[26px]">휴무: {place.closedDays.join(', ')}</p>
        )}
        <BrandsAccordion brands={place.brands} />
      </div>

      {place.note && (
        <div className="bg-primary-fixed/30 rounded-xl p-5 mb-5">
          <p className="text-on-surface italic text-body-sm leading-relaxed">&ldquo;{place.note}&rdquo;</p>
        </div>
      )}

      {place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {place.tags.map(tag => <TagChip key={tag} label={tag} size="md" />)}
        </div>
      )}

      {(place.links.instagram || place.links.website) && (
        <div className="flex flex-wrap gap-3 mb-5">
          {place.links.instagram && (
            <a href={place.links.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-label-lg text-primary font-medium hover:underline decoration-2 underline-offset-4">
              <ExternalLink className="w-3.5 h-3.5" /> Instagram
            </a>
          )}
          {place.links.website && (
            <a href={place.links.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-label-lg text-primary font-medium hover:underline decoration-2 underline-offset-4">
              <Globe className="w-3.5 h-3.5" /> 웹사이트
            </a>
          )}
        </div>
      )}

      {placeEvents.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-body-sm text-on-surface mb-3">예정된 일정</h3>
          <div className="space-y-2">
            {placeEvents.map(event => (
              <div key={event.id} className="bg-surface-container rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <EventTypeBadge type={event.type} />
                  <span className="text-label-xs text-outline">{formatDateRange(event.startDate, event.endDate)}</span>
                </div>
                <p className="font-display font-bold text-label-md text-on-surface">{event.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

/* ---- Event Content ---- */
function EventContent({ event }: { event: AnyEvent }) {
  const isRecruitment = isTesterRecruitment(event)
  const linkedPlace = getLinkedPlace(event)

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <EventTypeBadge type={event.type} size="md" />
        {isRecruitment && <RecruitmentStatusBadge status={event.recruitmentStatus} />}
      </div>

      <h2 className="font-display font-extrabold text-headline-sm tracking-editorial text-on-surface mb-2">
        {event.title}
      </h2>

      <p className="text-on-surface-variant text-body-sm leading-relaxed mb-5">{event.description}</p>

      <div className="bg-surface-container rounded-xl p-5 mb-5 space-y-3">
        <div className="flex items-center gap-2.5 text-body-sm">
          <Calendar className="w-4 h-4 text-outline" />
          <span className="text-on-surface-variant">{event.startDate} — {event.endDate}</span>
        </div>
        {event.location && !linkedPlace && (
          <div className="flex items-center gap-2.5 text-body-sm">
            <MapPin className="w-4 h-4 text-outline" />
            <span className="text-on-surface-variant">{event.location}</span>
          </div>
        )}
        {isRecruitment && (
          <div className="flex items-center gap-2.5 text-body-sm">
            <Users className="w-4 h-4 text-outline" />
            <div className="flex-1">
              <span className="text-on-surface-variant">{event.currentParticipants}/{event.maxParticipants}명 신청</span>
              <div className="mt-1.5 h-1.5 bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${Math.min(100, (event.currentParticipants / event.maxParticipants) * 100)}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {linkedPlace && (
        <div className="bg-secondary-container/40 rounded-xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-body-sm text-on-surface">장소 정보</h3>
          </div>
          <div className="space-y-1.5 text-body-sm">
            <p className="text-on-surface-variant">{linkedPlace.name} · {CATEGORY_LABEL[linkedPlace.category]}</p>
            <p className="text-on-surface-variant">{linkedPlace.address}</p>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-outline" />
              <span className="text-on-surface-variant">{linkedPlace.hours}</span>
            </div>
          </div>
        </div>
      )}

      {isRecruitment && (
        <>
          <div className="bg-primary-fixed/30 rounded-xl p-5 mb-5 space-y-3">
            <h3 className="font-display font-bold text-body-sm text-on-surface">모집 정보</h3>
            <div className="space-y-2 text-body-sm">
              {[
                ['도안명', event.patternName],
                ['카테고리', event.category],
                ['신청 기간', `${event.applicationStart} — ${event.applicationEnd}`],
                ['테스트 기간', `${event.testPeriodStart} — ${event.testPeriodEnd}`],
                ['조건', event.conditions],
                ['제출물', event.requirements],
                ['연락 방식', event.contactMethod],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="font-bold text-on-surface min-w-[64px] shrink-0">{label}</span>
                  <span className="text-on-surface-variant">{value}</span>
                </div>
              ))}
            </div>
          </div>
          {event.recruitmentStatus === 'open' && (
            <TesterApplicationForm recruitmentId={event.id} />
          )}
        </>
      )}

      {event.link && (
        <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-bold text-label-lg hover:underline decoration-2 underline-offset-4">
          <ExternalLink className="w-4 h-4" /> 자세히 보기
        </a>
      )}
    </>
  )
}

/* ---- Brands Accordion ---- */
const BRAND_LABELS = { yarn: '실', needle: '바늘', notions: '부자재' } as const

function BrandsAccordion({ brands }: { brands: Place['brands'] }) {
  const [open, setOpen] = useState(false)
  const hasBrands = brands.yarn.length > 0 || brands.needle.length > 0 || brands.notions.length > 0

  if (!hasBrands) return null

  return (
    <div className="text-body-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-bold text-on-surface w-full"
      >
        <span>취급 브랜드</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 pl-1">
          {(Object.keys(BRAND_LABELS) as (keyof typeof BRAND_LABELS)[]).map(key =>
            brands[key].length > 0 && (
              <div key={key} className="flex items-start gap-2">
                <span className="font-medium text-on-surface shrink-0">{BRAND_LABELS[key]}</span>
                <span className="text-on-surface-variant">{brands[key].join(', ')}</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
