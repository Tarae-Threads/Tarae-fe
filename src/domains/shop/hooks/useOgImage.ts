"use client"

import { useCallback, useEffect, useState } from "react"

interface OgState {
  image: string | null
  loading: boolean
}

/**
 * 외부 URL 의 og:image 를 /api/og 프록시를 통해 조회.
 * 24h 캐시 (브라우저 + Next.js fetch 캐시).
 */
export function useOgImage(url: string | undefined): OgState {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchOg = useCallback(async () => {
    if (!url) {
      setImage(null)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`)
      const data = (await res.json()) as { image: string | null }
      setImage(data.image ?? null)
    } catch {
      setImage(null)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchOg()
  }, [fetchOg])

  return { image, loading }
}
