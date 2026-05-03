import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Globe, Instagram } from "lucide-react"
import Header from "@/domains/landing/components/Header"
import Footer from "@/domains/landing/components/Footer"
import PlaceBrandsView from "@/domains/place/components/PlaceBrandsView"
import TagChip from "@/shared/components/ui/TagChip"
import ReviewSection from "@/domains/review/components/ReviewSection"
import ShopEditButton from "@/domains/shop/components/ShopEditButton"
import { getShop } from "@/domains/shop/queries/shopApi"

interface Params {
  id: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const shop = await getShop(Number(id))
    return {
      title: shop.name,
      description: `${shop.name} — ${shop.brands.map((b) => b.name).slice(0, 3).join(", ") || "온라인 뜨개 상점"}`,
      alternates: { canonical: `/store/${id}` },
      openGraph: {
        title: `${shop.name} | 타래`,
        description: shop.brands.map((b) => b.name).slice(0, 3).join(", "),
        type: "website",
      },
    }
  } catch {
    return { title: "상점을 찾을 수 없어요" }
  }
}

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { id } = await params
  const shopId = Number(id)
  if (!Number.isFinite(shopId)) notFound()

  let shop
  try {
    shop = await getShop(shopId)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface md:pl-16 pb-20 md:pb-0">
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-3xl">
          <Link
            href="/store"
            className="inline-flex items-center gap-1.5 text-label-md font-bold text-outline hover:text-on-surface transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            스토어 목록
          </Link>

          <header className="mb-8">
            <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface mb-3">
              {shop.name}
            </h1>
            {shop.description && (
              <p className="text-body-lg text-on-surface-variant leading-relaxed mb-3">
                {shop.description}
              </p>
            )}
            {shop.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {shop.tags.map((tag) => (
                  <TagChip key={tag.id} label={tag.name} size="md" />
                ))}
              </div>
            )}
          </header>

          {/* 취급 브랜드 (장소 상세와 동일 UI) */}
          {shop.brands.length > 0 && (
            <section className="mb-8">
              <h2 className="font-display font-bold text-title-sm text-on-surface mb-3">
                취급 브랜드
              </h2>
              <PlaceBrandsView brands={shop.brands} />
            </section>
          )}

          {/* 외부 링크 큰 버튼 */}
          {(shop.instagramUrl || shop.naverUrl || shop.websiteUrl) && (
            <section className="mb-10 flex flex-col sm:flex-row gap-2.5">
              {shop.instagramUrl && (
                <ExternalLinkButton
                  href={shop.instagramUrl}
                  icon={<Instagram className="w-4 h-4" />}
                  label="인스타그램에서 보기"
                  primary
                />
              )}
              {shop.naverUrl && (
                <ExternalLinkButton
                  href={shop.naverUrl}
                  icon={
                    <span className="font-display font-extrabold text-[12px] leading-none">
                      N
                    </span>
                  }
                  label="스마트스토어로"
                />
              )}
              {shop.websiteUrl && (
                <ExternalLinkButton
                  href={shop.websiteUrl}
                  icon={<Globe className="w-4 h-4" />}
                  label="공식 사이트"
                />
              )}
            </section>
          )}

          {/* 리뷰 */}
          <section className="mb-10">
            <ReviewSection type="shop" targetId={shop.id} />
          </section>

          {/* 수정 제보 */}
          <div className="border-t border-outline-variant/40 pt-6 text-center">
            <ShopEditButton />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}

function ExternalLinkButton({
  href,
  icon,
  label,
  primary,
}: {
  href: string
  icon: React.ReactNode
  label: string
  primary?: boolean
}) {
  const className = primary
    ? "signature-gradient text-white shadow-lg shadow-primary/20"
    : "bg-surface-container-high text-on-surface hover:bg-surface-container"
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 font-bold text-label-lg transition-all active:scale-[0.98] ${className}`}
    >
      {icon}
      {label}
    </a>
  )
}
