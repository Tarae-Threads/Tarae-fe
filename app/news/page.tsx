import type { Metadata } from "next"
import Header from "@/domains/landing/components/Header"
import Footer from "@/domains/landing/components/Footer"
import NewsCard from "@/domains/news/components/NewsCard"
import EmptyState from "@/shared/components/ui/EmptyState"
import { listArticles } from "@/domains/news/queries/newsSource"
import { Newspaper } from "lucide-react"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "뜨개소식",
  description:
    "타래가 전하는 뜨개 공지·소식. 새 기능, 이벤트, 파트너 가게 이야기를 모았습니다.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "뜨개소식 | 타래",
    description:
      "타래가 전하는 뜨개 공지·소식. 새 기능, 이벤트, 파트너 가게 이야기를 모았습니다.",
    type: "website",
  },
}

export default async function NewsListPage() {
  const articles = await listArticles()

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-8 py-10 md:py-16">
          <div className="mb-8 md:mb-12">
            <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
              NEWS
            </p>
            <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface">
              뜨개소식
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-3 max-w-2xl">
              타래가 전하는 공지와 뜨개 이야기.
            </p>
          </div>

          {articles.length === 0 ? (
            <EmptyState
              icon={<Newspaper className="w-8 h-8 text-outline" />}
              title="아직 올라온 소식이 없어요"
              description="곧 새 소식으로 찾아올게요."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
