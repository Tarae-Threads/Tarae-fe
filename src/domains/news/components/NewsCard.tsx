import Link from "next/link"
import Image from "next/image"
import NewsMeta from "./NewsMeta"
import type { NewsArticleSummary } from "../types"

interface Props {
  article: NewsArticleSummary
}

export default function NewsCard({ article }: Props) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-high editorial-shadow transition-all hover:shadow-xl active:scale-[0.99]"
    >
      {article.coverImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-container">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display font-bold text-title-sm text-on-surface line-clamp-2 min-h-[2.75em] group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-body-sm text-on-surface-variant line-clamp-2 min-h-[2.75em]">
            {article.excerpt}
          </p>
        )}
        <NewsMeta
          date={article.date}
          author={article.author}
          tags={article.tags}
          className="mt-auto pt-1"
        />
      </div>
    </Link>
  )
}
