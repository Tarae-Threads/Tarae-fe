import type { LucideIcon } from 'lucide-react'

interface InfoRowProps {
  icon: LucideIcon
  children: React.ReactNode
}

export default function InfoRow({ icon: Icon, children }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 text-body-sm">
      <Icon className="w-5 h-5 text-outline shrink-0" />
      <span className="text-on-surface-variant">{children}</span>
    </div>
  )
}
