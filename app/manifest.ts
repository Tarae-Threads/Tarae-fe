import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '타래 — 뜨개 장소 지도',
    short_name: '타래',
    description: '전국 뜨개 장소를 지도에서 탐색하세요',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff9ef',
    theme_color: '#91472b',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  }
}
