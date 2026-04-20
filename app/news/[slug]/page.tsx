import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import { ArrowLeft } from "lucide-react"
import Header from "@/domains/landing/components/Header"
import Footer from "@/domains/landing/components/Footer"
import NewsMeta from "@/domains/news/components/NewsMeta"
import NewsArticleBody from "@/domains/news/components/NewsArticleBody"
import { getAllSlugs, getArticle } from "@/domains/news/queries/newsSource"

export const revalidate = 3600

interface Params {
  slug: string
}

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: "소식을 찾을 수 없어요" }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      type: "article",
      title: `${article.title} | 타래`,
      description: article.excerpt,
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | 타래`,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: "타래" },
    image: article.coverImage
      ? `https://www.taraethreads.com${article.coverImage}`
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "타래",
      logo: {
        "@type": "ImageObject",
        url: "https://www.taraethreads.com/logo.png",
      },
    },
    mainEntityOfPage: `https://www.taraethreads.com/news/${article.slug}`,
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Script
        id={`ld-json-article-${article.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-3xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-label-md font-bold text-outline hover:text-on-surface transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            뜨개소식 목록
          </Link>

          <header className="mb-6 md:mb-8">
            <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface leading-tight mb-4">
              {article.title}
            </h1>
            <NewsMeta
              date={article.date}
              author={article.author}
              tags={article.tags}
            />
          </header>

          {article.coverImage && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8 editorial-shadow">
              <Image
                src={article.coverImage}
                alt=""
                fill
                priority
                sizes="(max-width: 767px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <NewsArticleBody source={article.content} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
