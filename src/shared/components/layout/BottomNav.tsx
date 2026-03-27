'use client'

import { Map, Calendar, Plus } from 'lucide-react'
import type { NavTab } from './NavBar'

interface Props {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  onSubmit: () => void
}

const tabs: { id: NavTab; icon: typeof Map; label: string }[] = [
  { id: 'places', icon: Map, label: '장소' },
  { id: 'events', icon: Calendar, label: '일정' },
]

export default function BottomNav({ activeTab, onTabChange, onSubmit }: Props) {
  return (
    <nav aria-label="하단 내비게이션" className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-surface-container-lowest z-50 shadow-[0_-4px_12px_rgba(29,27,22,0.04)]">
      {tabs.map(({ id, icon: Icon, label }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`relative flex flex-col items-center justify-center px-5 py-2 active:scale-90 transition-transform ${
              isActive ? 'text-primary' : 'text-outline'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 left-2 right-2 h-[3px] bg-primary rounded-b-full" />
            )}
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-label-2xs mt-1 font-bold">{label}</span>
          </button>
        )
      })}
      <button
        onClick={onSubmit}
        className="flex flex-col items-center justify-center px-5 py-2 text-outline active:scale-90 transition-transform"
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
        <span className="text-label-2xs mt-1 font-bold">제보</span>
      </button>
    </nav>
  )
}
