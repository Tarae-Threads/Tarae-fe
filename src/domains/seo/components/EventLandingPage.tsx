import Link from 'next/link'
import Script from 'next/script'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import Header from '@/domains/landing/components/Header'
import Footer from '@/domains/landing/components/Footer'
import { fetchEventsForLanding } from '@/domains/landing/queries/landingApi'
import type { EventListResponse } from '@/shared/api/client'
import { CATEGORY_ROUTES, SITE_URL } from '../constants'
import { buildBreadcrumbJsonLd } from '../utils/breadcrumb'

const MAX_JSON_LD_EVENTS = 50

function buildEventJsonLd(e: EventListResponse) {
  const event: Record<string, unknown> = {
    '@type': 'Event',
    name: e.title,
    startDate: e.startDate,
    eventStatus: e.active
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventCancelled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: `${SITE_URL}/map?eventId=${e.id}`,
    description: [e.eventType, e.title, e.locationText]
      .filter(Boolean)
      .join(' · '),
    organizer: {
      '@type': 'Organization',
      name: '타래',
      url: SITE_URL,
    },
  }
  if (e.endDate) event.endDate = e.endDate

  const location: Record<string, unknown> = {
    '@type': 'Place',
    name: e.locationText || '대한민국',
    address: e.locationText || '대한민국',
  }
  if (typeof e.lat === 'number' && typeof e.lng === 'number') {
    location.geo = {
      '@type': 'GeoCoordinates',
      latitude: e.lat,
      longitude: e.lng,
    }
  }
  event.location = location

  const sameAs = [e.instagramUrl, e.websiteUrl, e.naverMapUrl].filter(
    (v): v is string => Boolean(v),
  )
  if (sameAs.length) event.sameAs = sameAs

  return event
}

const TITLE = '진행 중인 뜨개 행사·세일·테스터 모집'
const INTRO =
  '전국 뜨개 마켓·페어·팝업, 시즌 세일, 테스터 모집까지. 지금 진행 중인 뜨개 이벤트를 한자리에서 확인하세요.'

export async function buildEventLandingMetadata() {
  const events = await fetchEventsForLanding()
  const count = events.length

  const title = `${TITLE}${count ? ` · ${count}건` : ''}`
  const description = `${INTRO}${count ? ` 현재 ${count}건의 이벤트가 진행 중이에요.` : ''}`

  return {
    title,
    description,
    alternates: { canonical: '/knitting-event' },
    openGraph: {
      type: 'website',
      title: `${title} | 타래`,
      description,
      url: `${SITE_URL}/knitting-event`,
    },
    twitter: {
      card: 'summary' as const,
      title: `${title} | 타래`,
      description,
    },
  }
}

function formatRange(start: string, end?: string) {
  if (!end || end === start) return start
  return `${start} ~ ${end}`
}

export default async function EventLandingPage() {
  const events = await fetchEventsForLanding()

  const eventsForJsonLd = events.slice(0, MAX_JSON_LD_EVENTS)

  const collectionJsonLd = {
    '@type': 'CollectionPage',
    name: TITLE,
    url: `${SITE_URL}/knitting-event`,
    description: INTRO,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: events.length,
      itemListElement: eventsForJsonLd.map((e, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/map?eventId=${e.id}`,
        name: e.title,
      })),
    },
  }

  const graphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [collectionJsonLd, ...eventsForJsonLd.map(buildEventJsonLd)],
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '진행 중인 행사', path: '/knitting-event' },
  ])

  return (
    <>
      <Script
        id="ld-json-knitting-event"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />
      <Script
        id="ld-json-breadcrumb-knitting-event"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-surface md:pl-16 pb-20 md:pb-0">
        <Header />
        <main className="flex-1">
          <article className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-5xl">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-label-md font-bold text-outline hover:text-on-surface transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로
            </Link>

            <header className="mb-10">
              <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
                🎉 KNITTING EVENT
              </p>
              <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface mb-3">
                {TITLE}
                {events.length ? (
                  <span className="text-outline font-medium"> · {events.length}건</span>
                ) : null}
              </h1>
              <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
                {INTRO}
              </p>
            </header>

            {events.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-12 text-center">
                지금 진행 중인 행사가 없어요. 다음 시즌을 기대해주세요.
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {events.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/map?eventId=${e.id}`}
                      className="block bg-surface-container-high rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
                    >
                      <p className="text-label-sm font-bold text-primary uppercase tracking-wider mb-2">
                        {e.eventType}
                      </p>
                      <h2 className="font-display font-bold text-title-sm text-on-surface mb-2">
                        {e.title}
                      </h2>
                      <p className="text-body-sm text-on-surface-variant inline-flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-outline" aria-hidden="true" />
                        {formatRange(e.startDate, e.endDate)}
                      </p>
                      {e.locationText && (
                        <p className="text-body-sm text-on-surface-variant inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-outline" aria-hidden="true" />
                          {e.locationText}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <section className="mt-16 pt-10 border-t border-outline-variant/30">
              <h2 className="font-display font-bold text-title-sm text-on-surface mb-4">
                카테고리별 뜨개 장소도 둘러보기
              </h2>
              <ul className="flex flex-wrap gap-2">
                {CATEGORY_ROUTES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${c.slug}`}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container text-label-md text-on-surface transition-colors"
                    >
                      {c.emoji} {c.category}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </main>
        <Footer />
      </div>
    </>
  )
}
