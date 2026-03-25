import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPlaceById, getPlaces } from '@/lib/places'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/types'
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

  return {
    title: `${place.name} — 타래`,
    description: `${place.address} | ${CATEGORY_LABEL[place.category]} | ${place.hours}`,
    openGraph: {
      title: `${place.name} — 타래`,
      description: `${place.address} | ${CATEGORY_LABEL[place.category]}`,
    },
  }
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params
  const place = getPlaceById(id)
  if (!place) notFound()

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 py-4">
        <Link
          href="/"
          className="text-primary font-bold text-sm uppercase tracking-wider hover:underline decoration-2 underline-offset-4"
        >
          ← 지도로
        </Link>
        <h1 className="font-display font-extrabold tracking-tighter text-2xl text-primary">
          Tarae
        </h1>
        <div className="w-16" />
      </header>

      <main className="pt-24 pb-32 px-6 md:px-8 max-w-2xl mx-auto">
        {/* Title + Category */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: CATEGORY_COLOR[place.category] }}
            >
              {CATEGORY_LABEL[place.category]}
            </span>
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
              <span
                key={tag}
                className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
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
                className="text-primary font-bold text-sm tracking-wide uppercase hover:underline decoration-2 underline-offset-4"
              >
                Instagram
              </a>
            )}
            {place.links.website && (
              <a
                href={place.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold text-sm tracking-wide uppercase hover:underline decoration-2 underline-offset-4"
              >
                웹사이트
              </a>
            )}
          </div>
        )}

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
