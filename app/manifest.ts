import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '타래 — 뜨개 장소·일정·스토어를 한 곳에서',
    short_name: '타래',
    description: '실 가게·공방·뜨개카페·이벤트·온라인샵을 한 곳에서 탐색하는 뜨개인을 위한 정보 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff9ef',
    theme_color: '#91472b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
