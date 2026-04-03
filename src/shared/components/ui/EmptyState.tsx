import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({
  title = '아직 내용이 없어요',
  description = '곧 추가될 예정입니다.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-5">
        {icon || <Inbox className="w-8 h-8 text-outline" />}
      </div>
      <h3 className="font-display font-bold text-title-sm text-on-surface mb-2">{title}</h3>
      <p className="text-body-sm text-on-surface-variant max-w-[280px]">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-label-md font-bold transition-all hover:opacity-90 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
