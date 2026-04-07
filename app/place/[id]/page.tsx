import { redirect } from 'next/navigation'
import { getPlace } from '@/domains/place/queries/placeApi'
import { CATEGORY_LABEL } from '@/domains/place/constants'
import type { PlaceDetailResponse } from '@/shared/api/client'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const place = await getPlace(Number(id))

    const categoryLabel = place.categories[0]
      ? (CATEGORY_LABEL[place.categories[0].name] ?? place.categories[0].name)
      : ''
    const brandNames = place.brands.map(b => b.name)
    const description = [
      place.address,
      categoryLabel,
      place.hoursText,
      brandNames.length > 0 ? `취급: ${brandNames.slice(0, 3).join(', ')}` : '',
    ].filter(Boolean).join(' | ')

    return {
      title: place.name,
      description,
      openGraph: {
        type: 'article',
        title: `${place.name} | 타래`,
        description,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${place.name} | 타래`,
        description,
      },
      alternates: {
        canonical: `/place/${id}`,
      },
    }
  } catch {
    return { title: '장소를 찾을 수 없습니다' }
  }
}

function PlaceJsonLd({ place }: { place: PlaceDetailResponse }) {
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
    ...(place.lat != null && place.lng != null && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: place.lat,
        longitude: place.lng,
      },
    }),
    ...(place.hoursText && { openingHours: place.hoursText }),
    ...(place.websiteUrl && { url: place.websiteUrl }),
    ...(place.instagramUrl && { sameAs: [place.instagramUrl] }),
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
  try {
    const place = await getPlace(Number(id))

    // JSON-LD for SEO crawlers, then redirect to map view
    return (
      <>
        <PlaceJsonLd place={place} />
        <meta httpEquiv="refresh" content={`0;url=/?placeId=${id}`} />
      </>
    )
  } catch {
    redirect('/')
  }
}
