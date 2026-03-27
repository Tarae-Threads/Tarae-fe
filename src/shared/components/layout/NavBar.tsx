'use client'

import Image from 'next/image'
import { Map, Calendar, Plus } from 'lucide-react'

export type NavTab = 'places' | 'events'

interface Props {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  onSubmit: () => void
}

const tabs: { id: NavTab; icon: typeof Map; label: string }[] = [
  { id: 'places', icon: Map, label: '장소' },
  { id: 'events', icon: Calendar, label: '일정' },
]

export default function NavBar({ activeTab, onTabChange, onSubmit }: Props) {
  return (
    <nav className="hidden md:flex flex-col items-center w-16 shrink-0 h-full bg-surface py-4 gap-1">
      {/* Logo */}
      <div className="mb-5 w-8 h-8 rounded-full overflow-hidden">
        <Image src="/favicon.ico" alt="타래" width={32} height={32} className="object-cover" />
      </div>

      {/* Tabs */}
      {tabs.map(({ id, icon: Icon, label }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            aria-label={label}
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
          </button>
        )
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Submit */}
      <button
        onClick={onSubmit}
        aria-label="제보하기"
        className="w-10 h-10 signature-gradient text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
      </button>
    </nav>
  )
}
