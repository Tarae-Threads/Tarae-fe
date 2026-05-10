import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/domains/landing/components/Header'
import Footer from '@/domains/landing/components/Footer'
import type { Place } from '@/domains/place/types'
import { REGION_ORDER } from '@/domains/place/constants'
import TrackedLink from '@/shared/components/analytics/TrackedLink'
import SeoPlaceListItem from './SeoPlaceListItem'

interface Props {
  eyebrow: string
  title: string
  intro: string
  places: Place[]
  groupBy: 'region' | 'category'
  source: 'category' | 'region'
  emptyMessage?: string
  related?: { label: string; href: string }[]
}

export default function PlaceLandingLayout({
  eyebrow,
  title,
  intro,
  places,
  groupBy,
  source,
  emptyMessage = '아직 등록된 장소가 없어요. 곧 추가될 예정이에요.',
  related,
}: Props) {
  const groups = groupPlaces(places, groupBy)

  return (
    <div className="min-h-screen flex flex-col bg-surface md:pl-16 pb-20 md:pb-0">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-label-md font-bold text-outline hover:text-on-surface transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>

          <header className="mb-10">
            <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
              {eyebrow}
            </p>
            <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface mb-3">
              {title}
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
              {intro}
            </p>
          </header>

          {places.length === 0 ? (
            <p className="text-body-md text-on-surface-variant py-12 text-center">
              {emptyMessage}
            </p>
          ) : (
            <div className="space-y-10">
              {groups.map(({ key, items }) => (
                <section key={key}>
                  <h2 className="font-display font-bold text-title-md text-on-surface mb-4">
                    {key}{' '}
                    <span className="text-outline font-medium">({items.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((p) => (
                      <SeoPlaceListItem key={p.id} place={p} source={source} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {related && related.length > 0 && (
            <section className="mt-16 pt-10 border-t border-outline-variant/30">
              <h2 className="font-display font-bold text-title-sm text-on-surface mb-4">
                다른 카테고리·지역 둘러보기
              </h2>
              <ul className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <TrackedLink
                      href={r.href}
                      event="seo_related_chip_click"
                      params={{ to: r.href, source }}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container text-label-md text-on-surface transition-colors"
                    >
                      {r.label}
                    </TrackedLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  )
}

function groupPlaces(
  places: Place[],
  groupBy: 'region' | 'category',
): { key: string; items: Place[] }[] {
  if (groupBy === 'region') {
    const map = new Map<string, Place[]>()
    for (const p of places) {
      const key = p.region || '기타'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(p)
    }
    return REGION_ORDER.filter((r) => map.has(r))
      .map((r) => ({ key: r, items: map.get(r)! }))
      .concat(
        Array.from(map.entries())
          .filter(([k]) => !REGION_ORDER.includes(k))
          .map(([k, v]) => ({ key: k, items: v })),
      )
  }
  // groupBy === 'category'
  const map = new Map<string, Place[]>()
  for (const p of places) {
    const key = p.categories[0]?.name || '기타'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  return Array.from(map.entries()).map(([key, items]) => ({ key, items }))
}
