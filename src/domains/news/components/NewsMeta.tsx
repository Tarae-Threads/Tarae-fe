import { CalendarDays, User } from "lucide-react"

interface Props {
  date: string
  author?: string
  tags?: string[]
  className?: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`
}

export default function NewsMeta({ date, author, tags, className = "" }: Props) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 text-label-sm text-outline ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
      {author && (
        <span className="inline-flex items-center gap-1">
          <User className="w-3.5 h-3.5" aria-hidden="true" />
          {author}
        </span>
      )}
      {tags && tags.length > 0 && (
        <span className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="bg-surface-container text-on-surface-variant rounded-full px-2 py-0.5 text-label-xs font-bold"
            >
              #{t}
            </span>
          ))}
        </span>
      )}
    </div>
  )
}
