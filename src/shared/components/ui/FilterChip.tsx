'use client'

interface FilterChipProps {
  label: React.ReactNode
  selected: boolean
  onClick: () => void
}

export default function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-label-md rounded-full transition-all ${
        selected
          ? 'bg-secondary text-secondary-foreground font-bold'
          : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
      }`}
    >
      {label}
    </button>
  )
}
