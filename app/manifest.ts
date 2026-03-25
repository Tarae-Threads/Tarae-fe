import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '타래 — 뜨개 장소, 정보, 모임을 한 곳에서',
    short_name: '타래',
    description: '뜨개 관련 장소, 정보, 모임을 한 곳에서 탐색할 수 있는 서비스',
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
