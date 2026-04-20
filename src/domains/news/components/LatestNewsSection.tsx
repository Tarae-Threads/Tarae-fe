import Link from "next/link"
import { ArrowRight } from "lucide-react"
import NewsCard from "./NewsCard"
import { listArticles } from "../queries/newsSource"

const LIMIT = 3

export default async function LatestNewsSection() {
  const articles = await listArticles()
  const list = articles.slice(0, LIMIT)

  if (list.length === 0) return null

  return (
    <section className="py-12 md:py-20 bg-surface">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
              NEWS
            </p>
            <h2 className="font-display font-extrabold text-headline-sm md:text-headline-md text-on-surface">
              최근 뜨개소식
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-primary font-bold text-label-md hover:gap-2 transition-all"
          >
            <span className="hidden md:inline">전체 소식 보기</span>
            <span className="md:hidden">전체</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
