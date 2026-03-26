import type { MetadataRoute } from 'next'
import { getPlaces } from '@/domains/place/utils/places'

export default function sitemap(): MetadataRoute.Sitemap {
  const places = getPlaces()

  const placeUrls = places.map((place) => ({
    url: `https://tarae.vercel.app/place/${place.id}`,
    lastModified: place.updatedAt,
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
}
