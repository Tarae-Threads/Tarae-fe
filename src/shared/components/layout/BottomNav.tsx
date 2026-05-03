'use client'

import Link from 'next/link'
import { Home, Map, Calendar, Store, Plus } from 'lucide-react'
import type { NavTab } from './NavBar'

interface Props {
  activeTab: NavTab | null
  onSubmit: () => void
}

const items: { id: NavTab; href: string; icon: typeof Map; label: string }[] = [
  { id: 'home', href: '/', icon: Home, label: '홈' },
  { id: 'places', href: '/map', icon: Map, label: '장소' },
  { id: 'events', href: '/map?tab=events', icon: Calendar, label: '일정' },
  { id: 'store', href: '/store', icon: Store, label: '스토어' },
]

export default function BottomNav({ activeTab, onSubmit }: Props) {
  return (
    <nav
      aria-label="하단 내비게이션"
      className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-2 bg-surface-container-lowest z-50 shadow-[0_-4px_12px_rgba(29,27,22,0.04)]"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {items.map(({ id, href, icon: Icon, label }) => {
        const isActive = activeTab === id
        return (
          <Link
            key={id}
            href={href}
            aria-label={label}
            className={`relative flex flex-col items-center justify-center px-3 py-2 active:scale-90 transition-transform ${
              isActive ? 'text-primary' : 'text-outline'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 left-2 right-2 h-[3px] bg-primary rounded-b-full" />
            )}
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-label-2xs mt-1 font-bold">{label}</span>
          </Link>
        )
      })}
      <button
        type="button"
        onClick={onSubmit}
        aria-label="제보하기"
        className="flex flex-col items-center justify-center px-3 py-2 text-outline cursor-pointer active:scale-90 transition-transform"
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
        <span className="text-label-2xs mt-1 font-bold">제보</span>
      </button>
    </nav>
  )
}
