interface TagChipProps {
  label: string
  size?: 'sm' | 'md' | 'lg'
}

export default function TagChip({ label, size = 'sm' }: TagChipProps) {
  const sizeClass = {
    sm: 'px-1.5 py-0.5 text-label-2xs',
    md: 'px-2 py-0.5 text-label-xs',
    lg: 'px-4 py-2 text-label-lg',
  }[size]

  return (
    <span className={`${sizeClass} bg-secondary-container text-on-secondary-container rounded-full font-medium`}>
      {label}
    </span>
  )
}
