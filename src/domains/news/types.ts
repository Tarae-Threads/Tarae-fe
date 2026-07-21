/** 커버 이미지 크롭 기준점. 와이드 배너의 텍스트가 잘리지 않게 초점을 옮길 때 사용. 기본 center */
export type CoverAlign = "left" | "center" | "right"

export interface NewsFrontmatter {
  title: string
  slug?: string
  date: string // ISO
  excerpt?: string
  coverImage?: string
  /** 커버 크롭 정렬 (기본 center). 와이드 배너의 왼쪽 텍스트가 잘릴 때 "left" */
  coverAlign?: CoverAlign
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
  coverAlign?: CoverAlign
  tags: string[]
  author?: string
}

export interface NewsArticle extends NewsArticleSummary {
  content: string // raw mdx 본문
}
