export interface NewsFrontmatter {
  title: string
  slug?: string
  date: string // ISO
  excerpt?: string
  coverImage?: string
  tags?: string[]
  author?: string
  draft?: boolean
}

export interface NewsArticleSummary {
  slug: string
  title: string
  date: string
  excerpt?: string
  coverImage?: string
  tags: string[]
  author?: string
}

export interface NewsArticle extends NewsArticleSummary {
  content: string // raw mdx 본문
}
