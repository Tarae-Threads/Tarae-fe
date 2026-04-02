import { redirect } from 'next/navigation'
import { getPlaceById, getPlaces } from '@/domains/place/utils/places'
import { CATEGORY_LABEL } from '@/domains/place/constants'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getPlaces().map(place => ({ id: place.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const place = getPlaceById(id)
  if (!place) return { title: '장소를 찾을 수 없습니다' }

  const description = [
    place.address,
    CATEGORY_LABEL[place.category],
    place.hours,
    [...place.brands.yarn, ...place.brands.needle, ...place.brands.notions].length > 0
      ? `취급: ${[...place.brands.yarn, ...place.brands.needle, ...place.brands.notions].slice(0, 3).join(', ')}`
      : '',
  ].filter(Boolean).join(' | ')

  return {
    title: place.name,
    description,
    openGraph: {
      type: 'article',
      title: `${place.name} | 타래`,
      description,
      ...(place.images[0] && { images: [{ url: place.images[0], alt: place.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.name} | 타래`,
      description,
      ...(place.images[0] && { images: [place.images[0]] }),
    },
    alternates: {
      canonical: `/place/${id}`,
    },
  }
}

function PlaceJsonLd({ place }: { place: NonNullable<ReturnType<typeof getPlaceById>> }) {
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
    ...(place.links.instagram && { sameAs: [place.links.instagram] }),
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

  // JSON-LD for SEO crawlers, then redirect to map view
  if (place) {
    return (
      <>
        <PlaceJsonLd place={place} />
        <meta httpEquiv="refresh" content={`0;url=/?placeId=${id}`} />
      </>
    )
  }

  redirect('/')
}
