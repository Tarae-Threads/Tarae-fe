import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import type {
  NewsArticle,
  NewsArticleSummary,
  NewsFrontmatter,
} from "../types"

const CONTENT_DIR = path.join(process.cwd(), "content", "news")

async function readMdxFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    return files.filter((f) => f.endsWith(".mdx"))
  } catch {
    return []
  }
}

function toSummary(
  frontmatter: NewsFrontmatter,
  fallbackSlug: string,
): NewsArticleSummary {
  return {
    slug: frontmatter.slug ?? fallbackSlug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    coverImage: frontmatter.coverImage,
    tags: frontmatter.tags ?? [],
    author: frontmatter.author,
  }
}

async function parseFile(
  fileName: string,
): Promise<{ summary: NewsArticleSummary; content: string; draft: boolean }> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, fileName), "utf-8")
  const { data, content } = matter(raw)
  const fm = data as NewsFrontmatter
  const fallbackSlug = fileName.replace(/\.mdx$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "")
  return {
    summary: toSummary(fm, fallbackSlug),
    content,
    draft: fm.draft === true,
  }
}

/** 공개(draft=false) 기사만 최신순으로 반환 */
export async function listArticles(): Promise<NewsArticleSummary[]> {
  const files = await readMdxFiles()
  const parsed = await Promise.all(files.map(parseFile))
  return parsed
    .filter((p) => !p.draft)
    .map((p) => p.summary)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** slug 로 단건 조회 (draft 도 null 반환) */
export async function getArticle(slug: string): Promise<NewsArticle | null> {
  const files = await readMdxFiles()
  for (const file of files) {
    const { summary, content, draft } = await parseFile(file)
    if (draft) continue
    if (summary.slug === slug) {
      return { ...summary, content }
    }
  }
  return null
}

/** generateStaticParams 용 슬러그 리스트 */
export async function getAllSlugs(): Promise<string[]> {
  const list = await listArticles()
  return list.map((a) => a.slug)
}
