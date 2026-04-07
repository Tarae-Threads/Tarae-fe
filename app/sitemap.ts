import type { MetadataRoute } from 'next'
import { getPlaces } from '@/domains/place/queries/placeApi'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const places = await getPlaces()

    const placeUrls = places.map((place) => ({
      url: `https://tarae.vercel.app/place/${place.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: 'https://tarae.vercel.app',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...placeUrls,
    ]
  } catch {
    return [
      {
        url: 'https://tarae.vercel.app',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
