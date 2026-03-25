'use client'

import { Map, MessageCircle, Search, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/', icon: Map, label: 'Map' },
  { href: '/threads', icon: MessageCircle, label: 'Threads' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest rounded-t-[2rem] z-50 shadow-[0_-8px_24px_rgba(29,27,22,0.04)]">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center px-5 py-2 active:scale-90 transition-transform ${
              isActive
                ? 'bg-primary-fixed text-primary rounded-2xl'
                : 'text-outline hover:text-primary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider mt-1">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
