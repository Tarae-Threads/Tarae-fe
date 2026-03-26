'use client'

import { Bell, Settings } from 'lucide-react'

export default function TopAppBar() {
  return (
    <header className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 py-4">
      <button
        aria-label="알림"
        className="hover:bg-surface-container/50 rounded-full transition-colors p-2 flex items-center justify-center"
      >
        <Bell className="w-5 h-5 text-primary" />
      </button>
      <h1 className="font-display font-extrabold tracking-tighter text-2xl text-primary">
        타래
      </h1>
      <button
        aria-label="설정"
        className="hover:bg-surface-container/50 rounded-full transition-colors p-2 flex items-center justify-center"
      >
        <Settings className="w-5 h-5 text-primary" />
      </button>
    </header>
  )
}
