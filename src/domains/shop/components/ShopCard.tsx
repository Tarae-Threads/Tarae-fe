"use client"

import Link from "next/link"
import { Globe, Instagram, Store as StoreIcon } from "lucide-react"
import type { Shop } from "../types"
import TagChip from "@/shared/components/ui/TagChip"
import { useOgImage } from "../hooks/useOgImage"

interface Props {
  shop: Shop
}

export default function ShopCard({ shop }: Props) {
  // og:image 조회 우선순위: 인스타 > 웹사이트 > 네이버 (네이버는 보통 차단/일반 로고)
  const ogTargetUrl = shop.instagramUrl ?? shop.websiteUrl ?? shop.naverUrl
  const { image, loading } = useOgImage(ogTargetUrl)

  return (
    // article + stretched-link 패턴 — 카드 전체 클릭 가능 (제목의 Link 가
    // before:absolute inset-0 으로 카드 영역까지 hit 영역 확장).
    // 외부 링크 아이콘은 relative z-10 로 stretched-link 위에서 동작.
    <article className="group relative flex gap-4 bg-surface-container-high rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* 아바타 (정사각) — og:image 또는 fallback */}
      <div className="shrink-0 relative size-16 sm:size-20 rounded-xl overflow-hidden bg-surface-container">
        {image ? (
          // 외부 도메인 og:image 라 next/image 대신 plain img + lazy
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
            <StoreIcon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-display font-bold text-title-sm text-on-surface line-clamp-1 mb-1.5">
          <Link
            href={`/store/${shop.id}`}
            className="before:absolute before:inset-0 before:rounded-2xl focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-primary/40"
          >
            {shop.name}
          </Link>
        </h3>

        {shop.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
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
