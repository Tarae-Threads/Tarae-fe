'use client'

interface FilterChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export default function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-body-sm rounded-full transition-all ${
        selected
          ? 'signature-gradient text-white font-bold shadow-lg shadow-primary/20'
          : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
      }`}
    >
      {label}
    </button>
  )
}
