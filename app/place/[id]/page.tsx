import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPlaceById, getPlaces } from '@/domains/place/utils/places'
import { CATEGORY_LABEL } from '@/domains/place/constants'
import CategoryBadge from '@/domains/place/components/CategoryBadge'
import StatusBadge from '@/domains/place/components/StatusBadge'
import { getEventsByPlaceId } from '@/domains/event/utils/events'
import TagChip from '@/shared/components/ui/TagChip'
import { EVENT_TYPE_LABEL, EVENT_TYPE_COLOR } from '@/domains/event/constants'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const places = getPlaces()
  return places.map(place => ({ id: place.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const place = getPlaceById(id)
  if (!place) return { title: '장소를 찾을 수 없습니다' }

  const description = [
    place.address,
    CATEGORY_LABEL[place.category],
    place.hours,
    place.brands.length > 0 ? `취급: ${place.brands.slice(0, 3).join(', ')}` : '',
  ].filter(Boolean).join(' | ')

  return {
    title: place.name,
    description,
    openGraph: {
      type: 'article',
      title: `${place.name} — 타래`,
      description,
      ...(place.images[0] && { images: [{ url: place.images[0], alt: place.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.name} — 타래`,
      description,
      ...(place.images[0] && { images: [place.images[0]] }),
    },
    alternates: {
      canonical: `/place/${id}`,
    },
  }
}

function PlaceJsonLd({ place }: { place: ReturnType<typeof getPlaceById> & {} }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressRegion: place.region,
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    },
    openingHours: place.hours,
    ...(place.images[0] && { image: place.images[0] }),
    ...(place.links.website && { url: place.links.website }),
    ...(place.links.instagram && {
      sameAs: [place.links.instagram],
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params
  const place = getPlaceById(id)
  if (!place) notFound()

  return (
    <div className="min-h-screen bg-surface">
      <PlaceJsonLd place={place} />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 py-4">
        <Link
          href="/"
          className="text-primary font-bold text-label-lg uppercase tracking-wider hover:underline decoration-2 underline-offset-4"
        >
          ← 지도로
        </Link>
        <h1 className="font-display font-extrabold tracking-tighter text-headline-sm text-primary">
          타래
        </h1>
        <div className="w-16" />
      </header>

      <main className="pt-24 pb-32 px-6 md:px-8 max-w-2xl mx-auto">
        {/* Title + Category */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <CategoryBadge category={place.category} size="md" />
            <StatusBadge status={place.status} />
          </div>
          <h2 className="font-display font-extrabold text-display-sm tracking-editorial text-on-surface mb-3">
            {place.name}
          </h2>
          <p className="text-on-surface-variant text-body-lg">{place.address}</p>
        </section>

        {/* Info Card */}
        <section className="bg-surface-container rounded-2xl p-8 mb-8 editorial-shadow">
          <div className="space-y-5">
            <div className="flex gap-4">
              <span className="font-display font-bold text-on-surface min-w-[80px]">영업시간</span>
              <span className="text-on-surface-variant">{place.hours}</span>
            </div>
            {place.closedDays.length > 0 && (
              <div className="flex gap-4">
                <span className="font-display font-bold text-on-surface min-w-[80px]">휴무일</span>
                <span className="text-on-surface-variant">{place.closedDays.join(', ')}</span>
              </div>
            )}
            {place.brands.length > 0 && (
              <div className="flex gap-4">
                <span className="font-display font-bold text-on-surface min-w-[80px]">취급 브랜드</span>
                <span className="text-on-surface-variant">{place.brands.join(', ')}</span>
              </div>
            )}
          </div>
        </section>

        {/* Note */}
        {place.note && (
          <section className="bg-primary-fixed/30 rounded-2xl p-8 mb-8">
            <p className="text-on-surface italic text-body-lg leading-relaxed">
              &ldquo;{place.note}&rdquo;
            </p>
          </section>
        )}

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {place.tags.map(tag => (
              <TagChip key={tag} label={tag} size="lg" />
            ))}
          </div>
        )}

        {/* Links */}
        {(place.links.instagram || place.links.website) && (
          <div className="flex gap-4 mb-8">
            {place.links.instagram && (
              <a
                href={place.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold text-label-lg tracking-wide uppercase hover:underline decoration-2 underline-offset-4"
              >
                Instagram
              </a>
            )}
            {place.links.website && (
              <a
                href={place.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold text-label-lg tracking-wide uppercase hover:underline decoration-2 underline-offset-4"
              >
                웹사이트
              </a>
            )}
          </div>
        )}

        {/* Linked Events */}
        {(() => {
          const placeEvents = getEventsByPlaceId(place.id)
          if (placeEvents.length === 0) return null
          return (
            <section className="mb-8">
              <h3 className="font-display font-bold text-title-sm text-on-surface mb-4">예정된 일정</h3>
              <div className="space-y-3">
                {placeEvents.map(event => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="block bg-surface-container rounded-2xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-label-2xs font-bold text-white"
                        style={{ backgroundColor: EVENT_TYPE_COLOR[event.type] }}
                      >
                        {EVENT_TYPE_LABEL[event.type]}
                      </span>
                      <span className="text-label-sm text-outline">
                        {event.startDate.slice(5).replace('-', '.')}
                        {event.startDate !== event.endDate && ` — ${event.endDate.slice(5).replace('-', '.')}`}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-label-lg text-on-surface">{event.title}</h4>
                    <p className="text-on-surface-variant text-label-md line-clamp-1 mt-1">{event.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}

        {/* Map CTA */}
        <Link
          href={`/?placeId=${place.id}`}
          className="signature-gradient text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 w-full"
        >
          지도에서 보기
        </Link>
      </main>
    </div>
  )
}
