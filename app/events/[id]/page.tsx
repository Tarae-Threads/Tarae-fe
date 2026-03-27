import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEventById, getEvents, getLinkedPlace } from '@/domains/event/utils/events'
import { isTesterRecruitment } from '@/domains/event/utils/typeGuards'
import { CATEGORY_LABEL } from '@/domains/place/constants'
import type { Metadata } from 'next'
import { Calendar, MapPin, Users, ExternalLink, Clock, Navigation } from 'lucide-react'
import InfoRow from '@/shared/components/ui/InfoRow'
import EventTypeBadge from '@/domains/event/components/EventTypeBadge'
import RecruitmentStatusBadge from '@/domains/event/components/RecruitmentStatusBadge'
import TesterApplicationForm from '@/domains/event/components/TesterApplicationForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getEvents().map(e => ({ id: e.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const event = getEventById(id)
  if (!event) return { title: '일정을 찾을 수 없습니다' }

  return {
    title: `${event.title} — 타래`,
    description: event.description,
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const event = getEventById(id)
  if (!event) notFound()

  const isRecruitment = isTesterRecruitment(event)
  const linkedPlace = getLinkedPlace(event)

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-primary font-bold text-label-lg uppercase tracking-wider hover:underline decoration-2 underline-offset-4">
          ← 홈
        </Link>
        <h1 className="font-display font-extrabold tracking-tighter text-headline-sm text-primary">타래</h1>
        <div className="w-16" />
      </header>

      <main className="pt-24 pb-32 px-6 md:px-8 max-w-2xl mx-auto">
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-4">
          <EventTypeBadge type={event.type} size="md" />
          {isRecruitment && <RecruitmentStatusBadge status={event.recruitmentStatus} />}
        </div>

        {/* Title */}
        <h2 className="font-display font-extrabold text-display-sm tracking-editorial text-on-surface mb-3">
          {event.title}
        </h2>

        <p className="text-on-surface-variant text-body-lg leading-relaxed mb-8">
          {event.description}
        </p>

        {/* Info card */}
        <section className="bg-surface-container rounded-2xl p-6 mb-6 editorial-shadow space-y-4">
          <InfoRow icon={Calendar}>{event.startDate} — {event.endDate}</InfoRow>
          {event.location && !linkedPlace && (
            <InfoRow icon={MapPin}>{event.location}</InfoRow>
          )}
          {isRecruitment && (
            <InfoRow icon={Users}>{event.currentParticipants}/{event.maxParticipants}명 신청</InfoRow>
          )}
        </section>

        {/* Linked Place Card */}
        {linkedPlace && (
          <section className="bg-secondary-container/40 rounded-2xl p-6 mb-6 editorial-shadow">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-title-sm text-on-surface">장소 정보</h3>
            </div>
            <div className="space-y-2.5 text-body-sm mb-4">
              <div className="flex gap-3">
                <span className="font-bold text-on-surface min-w-[56px]">장소명</span>
                <span className="text-on-surface-variant">{linkedPlace.name}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-on-surface min-w-[56px]">카테고리</span>
                <span className="text-on-surface-variant">{CATEGORY_LABEL[linkedPlace.category]}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-on-surface min-w-[56px]">주소</span>
                <span className="text-on-surface-variant">{linkedPlace.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-outline" />
                <span className="text-on-surface-variant">{linkedPlace.hours}</span>
              </div>
            </div>
            <Link
              href={`/?placeId=${linkedPlace.id}`}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold py-2.5 px-5 rounded-xl text-label-lg shadow-md shadow-primary/20"
            >
              <Navigation className="w-4 h-4" />
              지도에서 보기
            </Link>
          </section>
        )}

        {/* Tester recruitment details */}
        {isRecruitment && (
          <>
            <section className="bg-primary-fixed/30 rounded-2xl p-6 mb-6 space-y-4">
              <h3 className="font-display font-bold text-title-sm text-on-surface">모집 정보</h3>
              <div className="space-y-3 text-body-sm">
                <div className="flex gap-4">
                  <span className="font-bold text-on-surface min-w-[80px]">도안명</span>
                  <span className="text-on-surface-variant">{event.patternName}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-on-surface min-w-[80px]">카테고리</span>
                  <span className="text-on-surface-variant">{event.category}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-on-surface min-w-[80px]">신청 기간</span>
                  <span className="text-on-surface-variant">{event.applicationStart} — {event.applicationEnd}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-on-surface min-w-[80px]">테스트 기간</span>
                  <span className="text-on-surface-variant">{event.testPeriodStart} — {event.testPeriodEnd}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-on-surface min-w-[80px]">조건</span>
                  <span className="text-on-surface-variant">{event.conditions}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-on-surface min-w-[80px]">제출물</span>
                  <span className="text-on-surface-variant">{event.requirements}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold text-on-surface min-w-[80px]">연락 방식</span>
                  <span className="text-on-surface-variant">{event.contactMethod}</span>
                </div>
              </div>
            </section>

            {event.recruitmentStatus === 'open' && (
              <TesterApplicationForm recruitmentId={event.id} />
            )}
          </>
        )}

        {/* External link */}
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-bold text-label-lg hover:underline decoration-2 underline-offset-4 mb-6"
          >
            <ExternalLink className="w-4 h-4" />
            자세히 보기
          </a>
        )}
      </main>
    </div>
  )
}
