"use client"

import { Globe, Instagram, Store as StoreIcon } from "lucide-react"
import type { Shop } from "@/domains/shop/types"
import TagChip from "@/shared/components/ui/TagChip"
import TrackedLink from "@/shared/components/analytics/TrackedLink"
import { useOgImage } from "@/domains/shop/hooks/useOgImage"

interface Props {
  shop: Shop
}

export default function TrendingStoreCard({ shop }: Props) {
  // og:image 조회 우선순위 — 인스타 > 웹사이트 > 네이버 (네이버는 보통 차단)
  const ogTargetUrl = shop.instagramUrl ?? shop.websiteUrl ?? shop.naverUrl
  const { image, loading } = useOgImage(ogTargetUrl)

  return (
    // article + stretched-link 패턴 — 제목의 TrackedLink 가 카드 전체로 hit
    // 영역 확장. 외부 링크 아이콘은 relative z-10 로 위에 띄움 (a > a 중첩 방지).
    <article className="group relative w-[240px] md:w-[260px] shrink-0 bg-surface-container-low rounded-2xl p-5 transition-all hover:shadow-xl active:scale-[0.98] flex flex-col">
      <div className="mb-3">
        <div className="relative size-12 rounded-xl overflow-hidden bg-surface-container">
          {image ? (
            // 외부 도메인 og:image — next/image 대신 plain img + lazy
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : loading ? (
            <div className="absolute inset-0 bg-surface-container-high animate-pulse" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-primary-fixed/40">
              <StoreIcon className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      </div>

      <h3 className="font-display font-bold text-title-sm text-on-surface mb-2 line-clamp-1">
        <TrackedLink
          href={`/store/${shop.id}`}
          event="shop_select"
          params={{ shop_id: shop.id, source: "landing_trending" }}
          className="before:absolute before:inset-0 before:rounded-2xl focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-primary/40"
        >
          {shop.name}
        </TrackedLink>
      </h3>

      {shop.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {shop.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag.id} label={tag.name} size="md" />
          ))}
        </div>
      )}

      <div className="relative z-10 mt-auto flex items-center gap-1.5">
        {shop.instagramUrl && (
          <ExternalIcon
            href={shop.instagramUrl}
            label={`${shop.name} 인스타그램`}
            icon={<Instagram className="w-3.5 h-3.5" />}
          />
        )}
        {shop.naverUrl && (
          <ExternalIcon
            href={shop.naverUrl}
            label={`${shop.name} 네이버 스마트스토어`}
            icon={
              <span className="font-display font-extrabold text-[10px] leading-none">
                N
              </span>
            }
          />
        )}
        {shop.websiteUrl && (
          <ExternalIcon
            href={shop.websiteUrl}
            label={`${shop.name} 웹사이트`}
            icon={<Globe className="w-3.5 h-3.5" />}
          />
        )}
      </div>
    </article>
  )
}

function ExternalIcon({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-7 items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-primary-fixed hover:text-primary transition-colors"
    >
      {icon}
    </a>
  )
}
