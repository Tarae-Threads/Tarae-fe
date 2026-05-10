'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Home, Map, Calendar, Store, Plus } from 'lucide-react'
import { track } from '@/shared/lib/analytics'

export type NavTab = 'home' | 'places' | 'events' | 'store'

interface Props {
  activeTab: NavTab | null
  onSubmit: () => void
}

const tabs: { id: NavTab; href: string; icon: typeof Map; label: string }[] = [
  { id: 'home', href: '/', icon: Home, label: '홈' },
  { id: 'places', href: '/map', icon: Map, label: '장소' },
  { id: 'events', href: '/map?tab=events', icon: Calendar, label: '일정' },
  { id: 'store', href: '/store', icon: Store, label: '스토어' },
]

export default function NavBar({ activeTab, onSubmit }: Props) {
  return (
    <nav
      aria-label="사이드 내비게이션"
      className="hidden md:flex fixed left-0 top-0 h-full w-16 z-50 flex-col items-center bg-surface py-4 gap-1 border-r border-outline-variant/40"
    >
      {/* Logo → Home (별도 시각 자산) */}
      <Link
        href="/"
        aria-label="홈"
        className="mb-5 w-8 h-8 rounded-full overflow-hidden"
      >
        <Image
          src="/favicon.ico"
          alt="타래"
          width={32}
          height={32}
          className="object-cover"
        />
      </Link>

      {tabs.map(({ id, href, icon: Icon, label }) => {
        const isActive = activeTab === id
        return (
          <Link
            key={id}
            href={href}
            aria-label={label}
            onClick={() => track('nav_tab_click', { tab: id, surface: 'side' })}
            className={`relative flex flex-col items-center justify-center w-12 h-14 rounded-xl transition-all ${
              isActive
                ? 'text-primary'
                : 'text-outline hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full" />
            )}
            <Icon className="w-5 h-5" />
            <span className="text-label-2xs mt-1 font-bold">{label}</span>
          </Link>
        )
      })}

      <div className="flex-1" />

      <button
        type="button"
        onClick={onSubmit}
        aria-label="제보하기"
        className="w-12 h-14 signature-gradient text-white rounded-xl flex flex-col items-center justify-center shadow-lg cursor-pointer active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
        <span className="text-label-2xs mt-1 font-bold">제보</span>
      </button>
    </nav>
  )
}
