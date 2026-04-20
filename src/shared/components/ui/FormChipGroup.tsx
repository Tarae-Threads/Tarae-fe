interface ChipOption {
  value: string
  label: string
  bg: string
  color: string
}

interface Props {
  label: string
  required?: boolean
  options: ChipOption[]
  selected: Set<string> | string | null
  onToggle: (value: string) => void
  mode?: 'multi' | 'single'
  error?: string
}

export default function FormChipGroup({
  label,
  required,
  options,
  selected,
  onToggle,
  mode = 'multi',
  error,
}: Props) {
  const isSelected = (value: string) => {
    if (selected instanceof Set) return selected.has(value)
    return selected === value
  }

  return (
    <div role="group" aria-label={label}>
      <div className="text-label-md font-bold text-on-surface-variant mb-1.5 block">
        {label}{required && ' *'}{mode === 'multi' && ' (복수 선택)'}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            aria-pressed={isSelected(opt.value)}
            className="px-3 py-1.5 text-label-xs font-bold rounded-full transition-all border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            style={isSelected(opt.value)
              ? { backgroundColor: opt.bg, borderColor: opt.color, color: opt.color }
              : { backgroundColor: opt.bg, borderColor: 'transparent', color: opt.color }
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="text-destructive text-label-xs mt-1">{error}</p>}
    </div>
  )
}
