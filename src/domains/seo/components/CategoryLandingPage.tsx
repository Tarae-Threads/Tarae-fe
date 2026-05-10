import Script from 'next/script'
import { fetchPlacesForLanding } from '@/domains/landing/queries/landingApi'
import {
  CATEGORY_ROUTES,
  CATEGORY_BY_SLUG,
  SITE_URL,
  type CategoryRouteMeta,
} from '../constants'
import { buildBreadcrumbJsonLd } from '../utils/breadcrumb'
import PlaceLandingLayout from './PlaceLandingLayout'

interface Props {
  meta: CategoryRouteMeta
}

export async function buildCategoryMetadata(slug: string) {
  const meta = CATEGORY_BY_SLUG[slug]
  if (!meta) return null

  const places = await fetchPlacesForLanding()
  const count = places.filter((p) =>
    p.categories.some((c) => c.name === meta.category),
  ).length

  const title = `전국 ${meta.category} 모음${count ? ` · ${count}곳` : ''}`
  const description = `${meta.intro} 타래에서 ${meta.category}${count ? ` ${count}곳` : ''}을 한 번에 확인하세요.`

  return {
    title,
    description,
    alternates: { canonical: `/${meta.slug}` },
    openGraph: {
      type: 'website',
      title: `${title} | 타래`,
      description,
      url: `${SITE_URL}/${meta.slug}`,
    },
    twitter: {
      card: 'summary' as const,
      title: `${title} | 타래`,
      description,
    },
  }
}

export default async function CategoryLandingPage({ meta }: Props) {
  const places = await fetchPlacesForLanding()
  const filtered = places.filter((p) =>
    p.categories.some((c) => c.name === meta.category),
  )

  const related = [
    ...CATEGORY_ROUTES.filter((c) => c.slug !== meta.slug).map((c) => ({
      label: `${c.emoji} ${c.category}`,
      href: `/${c.slug}`,
    })),
    { label: '🎉 진행 중인 행사', href: '/knitting-event' },
  ]

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `전국 ${meta.category}`,
    url: `${SITE_URL}/${meta.slug}`,
    description: meta.intro,
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
    { name: meta.category, path: `/${meta.slug}` },
  ])

  return (
    <>
      <Script
        id={`ld-json-${meta.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Script
        id={`ld-json-breadcrumb-${meta.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PlaceLandingLayout
        eyebrow={`${meta.emoji} ${meta.category.toUpperCase()}`}
        title={`전국 ${meta.category}${filtered.length ? ` ${filtered.length}곳` : ''}`}
        intro={meta.intro}
        places={filtered}
        groupBy="region"
        source="category"
        related={related}
      />
    </>
  )
}
