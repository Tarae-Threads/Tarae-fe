import Script from 'next/script'
import { fetchPlacesForLanding } from '@/domains/landing/queries/landingApi'
import { REGION_SLUG, REGION_ORDER, REGION_TO_SLUG } from '@/domains/place/constants'
import { CATEGORY_ROUTES, SITE_URL } from '../constants'
import { buildBreadcrumbJsonLd } from '../utils/breadcrumb'
import PlaceLandingLayout from './PlaceLandingLayout'

interface Props {
  slug: string
}

export async function buildRegionMetadata(slug: string) {
  const region = REGION_SLUG[slug]
  if (!region) return null

  const places = await fetchPlacesForLanding()
  const count = places.filter((p) => p.region === region).length

  const title = `${region} 뜨개샵·공방·뜨개카페${count ? ` ${count}곳` : ''}`
  const description = `${region}에 위치한 뜨개샵·공방·뜨개카페·손염색실·공예용품점을 한 번에. 영업 시간·취급 브랜드·태그까지 타래에서 확인하세요.`

  return {
    title,
    description,
    alternates: { canonical: `/places/${slug}` },
    openGraph: {
      type: 'website',
      title: `${title} | 타래`,
      description,
      url: `${SITE_URL}/places/${slug}`,
    },
    twitter: {
      card: 'summary' as const,
      title: `${title} | 타래`,
      description,
    },
  }
}

export default async function RegionLandingPage({ slug }: Props) {
  const region = REGION_SLUG[slug]
  if (!region) return null

  const places = await fetchPlacesForLanding()
  const filtered = places.filter((p) => p.region === region)

  const related = [
    ...REGION_ORDER.filter((r) => r !== region).map((r) => ({
      label: `📍 ${r}`,
      href: `/places/${REGION_TO_SLUG[r]}`,
    })),
    ...CATEGORY_ROUTES.map((c) => ({
      label: `${c.emoji} ${c.category}`,
      href: `/${c.slug}`,
    })),
  ]

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${region} 뜨개 장소`,
    url: `${SITE_URL}/places/${slug}`,
    description: `${region}에 위치한 뜨개샵·공방·뜨개카페 모음.`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filtered.length,
      itemListElement: filtered.slice(0, 50).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/places/${p.id}`,
        name: p.name,
      })),
    },
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: region, path: `/places/${slug}` },
  ])

  return (
    <>
      <Script
        id={`ld-json-region-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Script
        id={`ld-json-breadcrumb-region-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PlaceLandingLayout
        eyebrow={`${region.toUpperCase()} REGION`}
        title={`${region} 뜨개 장소${filtered.length ? ` ${filtered.length}곳` : ''}`}
        intro={`${region}에 위치한 뜨개샵·공방·뜨개카페·손염색실·공예용품점을 카테고리별로 정리했어요. 가까운 동네부터 둘러보세요.`}
        places={filtered}
        groupBy="category"
        related={related}
      />
    </>
  )
}
