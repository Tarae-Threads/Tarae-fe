"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Search, Store as StoreIcon } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import EmptyState from "@/shared/components/ui/EmptyState"
import SubmitForm from "@/shared/components/layout/SubmitForm"
import { getShops } from "../queries/shopApi"
import type { Shop } from "../types"
import ShopCard from "./ShopCard"

const SEARCH_DEBOUNCE_MS = 300

export default function ShopList() {
  const { openModal } = useModal()

  // raw 검색 입력 + 디바운스 후 API 쿼리
  const [searchInput, setSearchInput] = useState("")
  const [keyword, setKeyword] = useState("")

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [errored, setErrored] = useState(false)

  // 검색 디바운스
  useEffect(() => {
    const id = setTimeout(() => setKeyword(searchInput.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [searchInput])

  const fetchShops = useCallback(async () => {
    setLoading(true)
    setErrored(false)
    try {
      const list = await getShops({
        keyword: keyword || undefined,
        categoryId: selectedCategoryId ?? undefined,
      })
      setShops(list)
    } catch {
      setErrored(true)
    } finally {
      setLoading(false)
    }
  }, [keyword, selectedCategoryId])

  // 데이터 로드 (keyword/categoryId 변경 시)
  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  // 데이터에 실제 존재하는 카테고리만 칩으로
  const availableCategories = useMemo(() => {
    const seen = new Map<number, string>()
    for (const shop of shops) {
      for (const cat of shop.categories) {
        if (!seen.has(cat.id)) seen.set(cat.id, cat.name)
      }
    }
    return Array.from(seen, ([id, name]) => ({ id, name }))
  }, [shops])

  const hasActiveFilter = keyword !== "" || selectedCategoryId !== null

  const openShopSubmission = () => {
    openModal(
      SubmitForm,
      { initialTab: "store" } as unknown as Record<string, unknown>,
      { title: "제보하기", size: "md" },
    )
  }

  const resetFilters = () => {
    setSearchInput("")
    setKeyword("")
    setSelectedCategoryId(null)
  }

  return (
    <section className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl">
      <div className="mb-6">
        <p className="text-label-md font-bold text-primary uppercase tracking-[0.3em] mb-2">
          STORE
        </p>
        <h1 className="font-display font-extrabold text-headline-md md:text-display-sm text-on-surface">
          스토어
        </h1>
        <p className="text-body-lg text-on-surface-variant mt-2">
          지도에 없는 뜨개 상점들.
        </p>
      </div>

      {/* 검색 */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 size-4 text-outline" />
        <input
          type="text"
          inputMode="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="상점명·태그·브랜드 검색"
          className="w-full h-12 pl-11 pr-4 rounded-2xl text-label-lg text-on-surface placeholder:text-outline bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* 카테고리 칩 — 데이터에 있는 것만 */}
      {availableCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Chip
            active={selectedCategoryId === null}
            onClick={() => setSelectedCategoryId(null)}
          >
            전체 카테고리
          </Chip>
          {availableCategories.map((cat) => (
            <Chip
              key={cat.id}
              active={selectedCategoryId === cat.id}
              onClick={() =>
                setSelectedCategoryId((prev) => (prev === cat.id ? null : cat.id))
              }
            >
              {cat.name}
            </Chip>
          ))}
        </div>
      )}

      {/* 결과 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-label-md text-on-surface-variant">
          {loading ? "불러오는 중..." : `${shops.length}곳`}
        </p>
      </div>

      {/* 결과 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-surface-container animate-pulse"
            />
          ))}
        </div>
      ) : errored ? (
        <EmptyState
          icon={<StoreIcon className="w-8 h-8 text-outline" />}
          title="잠시 후 다시 시도해주세요"
          description="상점 목록을 불러오지 못했어요."
        />
      ) : shops.length === 0 ? (
        hasActiveFilter ? (
          <EmptyState
            icon={<StoreIcon className="w-8 h-8 text-outline" />}
            title="조건에 맞는 상점이 없어요"
            description="필터를 바꾸거나 초기화해보세요."
            action={{ label: "필터 초기화", onClick: resetFilters }}
          />
        ) : (
          <EmptyState
            icon={<StoreIcon className="w-8 h-8 text-outline" />}
            title="아직 등록된 온라인 상점이 없어요"
            description="가장 먼저 제보해주세요!"
            action={{ label: "제보하기", onClick: openShopSubmission }}
          />
        )
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-body-sm text-on-surface-variant mb-3">
              여기 없는 상점을 알고 계신가요?
            </p>
            <button
              type="button"
              onClick={openShopSubmission}
              className="inline-flex items-center gap-1.5 bg-primary text-white font-bold text-label-md px-5 py-2.5 rounded-full active:scale-95 transition-transform"
            >
              제보하기
            </button>
          </div>
        </>
      )}
    </section>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-1.5 rounded-full text-label-md font-bold transition-all border ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high"
      }`}
    >
      {children}
    </button>
  )
}
