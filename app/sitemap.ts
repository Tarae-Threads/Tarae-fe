import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  return [
    {
      url: 'https://tarae.vercel.app',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://tarae.vercel.app/map',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]
}
