interface ColorBadgeProps {
  label: string
  bg: string
  color: string
  size?: 'sm' | 'md'
  dot?: boolean
}

export default function ColorBadge({ label, bg, color, size = 'sm', dot }: ColorBadgeProps) {
  const sizeClass = size === 'md'
    ? 'px-3 py-1 text-label-xs'
    : 'px-2.5 py-0.5 text-label-2xs'

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClass} rounded-full font-bold uppercase tracking-widest`}
      style={{ backgroundColor: bg, color }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${color}80` }} />}
      {label}
    </span>
  )
}
