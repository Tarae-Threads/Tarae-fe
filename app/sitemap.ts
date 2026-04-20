import type { MetadataRoute } from 'next'
import {
  fetchPlacesForLanding,
  fetchEventsForLanding,
} from '@/domains/landing/queries/landingApi'
import { listArticles } from '@/domains/news/queries/newsSource'

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
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const [places, events, articles] = await Promise.all([
    fetchPlacesForLanding(),
    fetchEventsForLanding(),
    listArticles(),
  ])

  const placeEntries: MetadataRoute.Sitemap = places.map((p) => ({
    url: `${SITE_URL}/map?placeId=${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_URL}/map?eventId=${e.id}`,
    lastModified: e.endDate ?? e.startDate ?? now,
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  const newsEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: a.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...placeEntries, ...eventEntries, ...newsEntries]
}
