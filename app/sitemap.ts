import type { MetadataRoute } from 'next'
import { fetchPlacesForLanding } from '@/domains/landing/queries/landingApi'
import { listArticles } from '@/domains/news/queries/newsSource'
import { getShops } from '@/domains/shop/queries/shopApi'
import { CATEGORY_ROUTES } from '@/domains/seo/constants'
import { REGION_SLUG } from '@/domains/place/constants'

const SITE_URL = 'https://www.taraethreads.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/map`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/store`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/knitting-event`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    ...CATEGORY_ROUTES.map((c) => ({
      url: `${SITE_URL}/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...Object.keys(REGION_SLUG).map((slug) => ({
      url: `${SITE_URL}/places/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ]

  const [places, shops, articles] = await Promise.all([
    fetchPlacesForLanding(),
    getShops().catch(() => []),
    listArticles(),
  ])

  const placeEntries: MetadataRoute.Sitemap = places.map((p) => ({
    url: `${SITE_URL}/places/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const newsEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: a.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const shopEntries: MetadataRoute.Sitemap = shops.map((s) => ({
    url: `${SITE_URL}/store/${s.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    ...staticEntries,
    ...placeEntries,
    ...shopEntries,
    ...newsEntries,
  ]
}
