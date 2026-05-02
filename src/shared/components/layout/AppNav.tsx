'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import NavBar, { type NavTab } from './NavBar'
import BottomNav from './BottomNav'
import SubmitForm from './SubmitForm'
import { useModal } from '@/shared/hooks/useModal'

/**
 * 글로벌 nav — 데스크톱 사이드(NavBar) · 모바일 하단(BottomNav) 동시 책임.
 * usePathname/useSearchParams 로 활성 탭 판정 후 두 컴포넌트에 prop 으로 전달.
 *
 * 마운트 위치: app/providers.tsx 안 (Suspense 내부 — useSearchParams 요구사항).
 */
export default function AppNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { openModal } = useModal()

  const activeTab = computeActiveTab(pathname, searchParams.get('tab'))

  const handleSubmit = () => {
    openModal(SubmitForm, {}, { title: '제보하기', size: 'md' })
  }

  return (
    <>
      <NavBar activeTab={activeTab} onSubmit={handleSubmit} />
      <BottomNav activeTab={activeTab} onSubmit={handleSubmit} />
    </>
  )
}

function computeActiveTab(pathname: string, tabQuery: string | null): NavTab | null {
  if (pathname === '/') return 'home'
  if (pathname === '/map') {
    return tabQuery === 'events' ? 'events' : 'places'
  }
  if (pathname.startsWith('/store')) return 'store'
  return null
}
