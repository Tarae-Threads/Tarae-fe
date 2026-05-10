import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Clock,
  XCircle,
  Globe,
  Instagram,
  Map as MapIcon,
} from "lucide-react"
import Header from "@/domains/landing/components/Header"
import Footer from "@/domains/landing/components/Footer"
import PlaceBrandsView from "@/domains/place/components/PlaceBrandsView"
import TagChip from "@/shared/components/ui/TagChip"
import ReviewSection from "@/domains/review/components/ReviewSection"
import { getPlace } from "@/domains/place/queries/placeApi"
import { STATUS_LABEL, REGION_SLUG, REGION_TO_SLUG } from "@/domains/place/constants"
import RegionLandingPage, {
  buildRegionMetadata,
} from "@/domains/seo/components/RegionLandingPage"
import { buildBreadcrumbJsonLd } from "@/domains/seo/utils/breadcrumb"

export const revalidate = 3600

interface Params {
  slug: string
}

export function generateStaticParams() {
  return Object.keys(REGION_SLUG).map((slug) => ({ slug }))
}

const SITE_URL = "https://www.taraethreads.com"

function isNumericSlug(slug: string) {
  return /^\d+$/.test(slug)
}

function buildLocationLabel(region: string, district: string) {
  const parts = [region, district].filter(Boolean)
  return parts.join(" ")
}

function buildCategoryLabel(categories: { name: string }[]) {
  if (!categories.length) return "뜨개 장소"
  return categories.map((c) => c.name).join("·")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params

  if (!isNumericSlug(slug)) {
    const meta = await buildRegionMetadata(slug)
    return meta ?? { title: "페이지를 찾을 수 없어요" }
  }

  const placeId = Number(slug)
  if (!Number.isFinite(placeId)) {
    return { title: "장소를 찾을 수 없어요" }
  }

  try {
    const place = await getPlace(placeId)
    const location = buildLocationLabel(place.region, place.district)
    const categoryLabel = buildCategoryLabel(place.categories)
    const titleSuffix = location ? `${location} ${categoryLabel}` : categoryLabel
    const title = `${place.name} | ${titleSuffix}`
    const description =
      place.description?.trim() ||
      `${location ? location + "에 위치한 " : ""}${categoryLabel}. 주소·영업 시간·취급 브랜드·태그 정보를 한 번에 확인하세요.`

    return {
      title,
      description,
      alternates: { canonical: `/places/${placeId}` },
      openGraph: {
        type: "website",
        title: `${place.name} | 타래`,
        description,
        url: `${SITE_URL}/places/${placeId}`,
      },
      twitter: {
        card: "summary",
        title: `${place.name} | 타래`,
        description,
      },
    }
  } catch {
    return { title: "장소를 찾을 수 없어요" }
  }
}

export default async function PlacesSlugPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params

  if (!isNumericSlug(slug)) {
    if (!REGION_SLUG[slug]) notFound()
    return <RegionLandingPage slug={slug} />
  }

  const placeId = Number(slug)
  if (!Number.isFinite(placeId)) notFound()

  let place
  try {
    place = await getPlace(placeId)
  } catch {
    notFound()
  }

  const location = buildLocationLabel(place.region, place.district)
  const categoryLabel = buildCategoryLabel(place.categories)
  const statusLabel = STATUS_LABEL[place.status] ?? place.status
  const isClosed = place.status === "CLOSED"

  const sameAs = [place.instagramUrl, place.websiteUrl, place.naverMapUrl].filter(
    (v): v is string => Boolean(v),
  )

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: place.name,
    description:
      place.description?.trim() ||
      `${location} ${categoryLabel}`.trim(),
    url: `${SITE_URL}/places/${placeId}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
      addressLocality: place.district || undefined,
      addressRegion: place.region || undefined,
      addressCountry: "KR",
    },
    keywords: [
      ...place.categories.map((c) => c.name),
      ...place.tags.map((t) => t.name),
    ].join(", ") || undefined,
  }
  if (typeof place.lat === "number" && typeof place.lng === "number") {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng,
    }
  }
  if (place.hoursText) jsonLd.openingHours = place.hoursText
  if (sameAs.length) jsonLd.sameAs = sameAs

  const regionSlug = place.region ? REGION_TO_SLUG[place.region] : undefined
  const breadcrumbItems = [{ name: "홈", path: "/" }]
  if (place.region && regionSlug) {
    breadcrumbItems.push({ name: place.region, path: `/places/${regionSlug}` })
  }
  breadcrumbItems.push({ name: place.name, path: `/places/${placeId}` })
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems)

  return (
    <div className="min-h-screen flex flex-col bg-surface md:pl-16 pb-20 md:pb-0">
      <Script
        id={`ld-json-place-${placeId}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id={`ld-json-breadcrumb-place-${placeId}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-3xl">
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-label-md font-bold text-outline hover:text-on-surface transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            지도로 돌아가기
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-label-md text-on-surface-variant">
              {location && <span>{location}</span>}
              {location && <span aria-hidden="true">·</span>}
              <span>{categoryLabel}</span>
              {isClosed && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-error font-bold">{statusLabel}</span>
                </>
              )}
            </div>
            <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface mb-4">
              {place.name}
            </h1>
            {place.description && (
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-4 whitespace-pre-line">
                {place.description}
              </p>
            )}
            {place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <TagChip key={tag.id} label={tag.name} size="md" />
                ))}
              </div>
            )}
          </header>

          <section className="mb-8 space-y-3">
            {place.address && (
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="주소">
                {place.address}
              </InfoRow>
            )}
            {place.hoursText && (
              <InfoRow icon={<Clock className="w-4 h-4" />} label="영업 시간">
                <span className="whitespace-pre-line">{place.hoursText}</span>
              </InfoRow>
            )}
            {place.closedDays && (
              <InfoRow icon={<XCircle className="w-4 h-4" />} label="휴무일">
                {place.closedDays}
              </InfoRow>
            )}
          </section>

          {place.brands.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display font-bold text-title-sm text-on-surface mb-3">
                취급 브랜드
              </h2>
              <PlaceBrandsView brands={place.brands} />
            </section>
          )}

          <section className="mb-10 flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`/map?placeId=${placeId}`}
              className="signature-gradient text-white shadow-lg shadow-primary/20 flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 font-bold text-label-lg transition-all active:scale-[0.98]"
            >
              <MapIcon className="w-4 h-4" />
              지도에서 보기
            </Link>
            {place.instagramUrl && (
              <ExternalLinkButton
                href={place.instagramUrl}
                icon={<Instagram className="w-4 h-4" />}
                label="인스타그램"
              />
            )}
            {place.naverMapUrl && (
              <ExternalLinkButton
                href={place.naverMapUrl}
                icon={
                  <span className="font-display font-extrabold text-[12px] leading-none">
                    N
                  </span>
                }
                label="네이버 지도"
              />
            )}
            {place.websiteUrl && (
              <ExternalLinkButton
                href={place.websiteUrl}
                icon={<Globe className="w-4 h-4" />}
                label="공식 사이트"
              />
            )}
          </section>

          <section>
            <ReviewSection type="place" targetId={placeId} />
          </section>
        </article>
      </main>
      <Footer />
    </div>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3 text-body-md text-on-surface">
      <span className="mt-1 shrink-0 text-on-surface-variant" aria-hidden="true">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-label-sm text-on-surface-variant mb-0.5">{label}</p>
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function ExternalLinkButton({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-surface-container-high text-on-surface hover:bg-surface-container flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 font-bold text-label-lg transition-all active:scale-[0.98]"
    >
      {icon}
      {label}
    </a>
  )
}
