'use client'

import { Map, Calendar, Database, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/', icon: Map, label: '지도' },
  { href: '/events', icon: Calendar, label: '캘린더' },
  { href: '/data', icon: Database, label: '데이터' },
  { href: '/community', icon: Users, label: '함뜨' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="하단 내비게이션" className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest rounded-t-[2rem] z-50 shadow-[0_-8px_24px_rgba(29,27,22,0.04)]">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center px-5 py-2 active:scale-90 transition-transform ${
              isActive
                ? 'bg-primary-fixed text-primary rounded-2xl'
                : 'text-outline hover:text-primary'
            }`}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span className="text-label-sm font-semibold uppercase tracking-wider mt-1">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
