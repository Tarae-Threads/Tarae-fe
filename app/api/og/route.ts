import { NextRequest, NextResponse } from "next/server"

// ---------------------------------------------------------------------------
// /api/og — 외부 URL 의 og:image 를 추출해 반환
//
// 클라이언트(ShopCard 등)가 카드 썸네일을 보여주기 위해 사용.
// SSRF·과다 요청 방지를 위해 다음 가드:
//   - http(s) 만 허용
//   - 호스트가 사설/루프백 대역이면 거부
//   - 5초 타임아웃, 1MB 응답 상한
//   - IP 당 60초 60회 레이트리밋
//   - Next.js fetch 의 ISR 24h 캐시 + Cache-Control 응답 헤더
// ---------------------------------------------------------------------------

const FETCH_TIMEOUT_MS = 5_000
const MAX_BYTES = 1_000_000
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 60
const rateBuckets = new Map<string, number[]>()

const ALLOWED_ORIGINS = new Set([
  "https://taraethreads.com",
  "https://www.taraethreads.com",
  "http://localhost:3000",
  "http://localhost:3848",
])

const PRIVATE_HOST_PATTERNS: RegExp[] = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
]

function isPrivateHost(hostname: string): boolean {
  return PRIVATE_HOST_PATTERNS.some((re) => re.test(hostname))
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true
  return ALLOWED_ORIGINS.has(origin)
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (rateBuckets.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  )
  if (recent.length >= RATE_MAX) {
    rateBuckets.set(ip, recent)
    return true
  }
  recent.push(now)
  rateBuckets.set(ip, recent)
  return false
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!isOriginAllowed(origin)) {
    return NextResponse.json({ image: null }, { status: 403 })
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? ""
  const ip = forwarded.split(",")[0]?.trim() || "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json({ image: null }, { status: 429 })
  }

  const target = request.nextUrl.searchParams.get("url")
  if (!target) {
    return NextResponse.json({ image: null }, { status: 400 })
  }

  let url: URL
  try {
    url = new URL(target)
  } catch {
    return NextResponse.json({ image: null }, { status: 400 })
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return NextResponse.json({ image: null }, { status: 400 })
  }
  if (isPrivateHost(url.hostname)) {
    return NextResponse.json({ image: null }, { status: 400 })
  }

  let html: string
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TaraeBot/1.0; +https://www.taraethreads.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: ctrl.signal,
      next: { revalidate: 86400 },
    })
    clearTimeout(timer)
    if (!res.ok || !res.body) {
      return NextResponse.json({ image: null })
    }
    html = await readLimited(res.body, MAX_BYTES)
  } catch {
    return NextResponse.json({ image: null })
  }

  const raw =
    extractMeta(html, "og:image") ??
    extractMeta(html, "twitter:image") ??
    null
  const image = raw ? resolveUrl(raw, url) : null

  return NextResponse.json(
    { image },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  )
}

async function readLimited(
  stream: ReadableStream<Uint8Array>,
  maxBytes: number,
): Promise<string> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (total < maxBytes) {
    const { value, done } = await reader.read()
    if (done) break
    chunks.push(value)
    total += value.byteLength
  }
  reader.cancel().catch(() => {})
  const buf = new Uint8Array(total)
  let off = 0
  for (const c of chunks) {
    buf.set(c, off)
    off += c.byteLength
  }
  return new TextDecoder("utf-8").decode(buf)
}

function extractMeta(html: string, prop: string): string | null {
  const escaped = prop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const reForward = new RegExp(
    `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']+)["']`,
    "i",
  )
  const m1 = html.match(reForward)
  if (m1) return decodeEntities(m1[1])
  const reBackward = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`,
    "i",
  )
  const m2 = html.match(reBackward)
  return m2 ? decodeEntities(m2[1]) : null
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function resolveUrl(maybeRelative: string, base: URL): string {
  try {
    return new URL(maybeRelative, base).toString()
  } catch {
    return maybeRelative
  }
}
