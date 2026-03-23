import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPlaceById, getPlaces } from '@/lib/places'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/types'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const places = getPlaces()
  return places.map(place => ({ id: place.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const place = getPlaceById(id)
  if (!place) return { title: '장소를 찾을 수 없습니다' }

  return {
    title: `${place.name} — 타래`,
    description: `${place.address} | ${CATEGORY_LABEL[place.category]} | ${place.hours}`,
    openGraph: {
      title: `${place.name} — 타래`,
      description: `${place.address} | ${CATEGORY_LABEL[place.category]}`,
    },
  }
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params
  const place = getPlaceById(id)
  if (!place) notFound()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-lg font-bold text-yarn-purple">타래</Link>
        <span className="text-sm text-muted-foreground">뜨개 장소 지도</span>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Title + Category */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            <Badge
              style={{ backgroundColor: CATEGORY_COLOR[place.category], color: 'white' }}
            >
              {CATEGORY_LABEL[place.category]}
            </Badge>
          </div>
          <p className="text-muted-foreground">{place.address}</p>
        </div>

        {/* Info */}
        <div className="space-y-3 border rounded-lg p-4">
          <div className="flex gap-2">
            <span className="font-medium min-w-[80px]">영업시간</span>
            <span>{place.hours}</span>
          </div>
          {place.closedDays.length > 0 && (
            <div className="flex gap-2">
              <span className="font-medium min-w-[80px]">휴무일</span>
              <span>{place.closedDays.join(', ')}</span>
            </div>
          )}
          {place.brands.length > 0 && (
            <div className="flex gap-2">
              <span className="font-medium min-w-[80px]">취급 브랜드</span>
              <span>{place.brands.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Note */}
        {place.note && (
          <div className="border rounded-lg p-4">
            <p className="text-sm">{place.note}</p>
          </div>
        )}

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {place.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Links */}
        {(place.links.instagram || place.links.website) && (
          <div className="flex gap-3">
            {place.links.instagram && (
              <a
                href={place.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yarn-purple hover:underline"
              >
                Instagram
              </a>
            )}
            {place.links.website && (
              <a
                href={place.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yarn-purple hover:underline"
              >
                웹사이트
              </a>
            )}
          </div>
        )}

        {/* Map button */}
        <Link href={`/?placeId=${place.id}`}>
          <Button className="w-full" size="lg">
            지도에서 보기
          </Button>
        </Link>
      </main>
    </div>
  )
}
