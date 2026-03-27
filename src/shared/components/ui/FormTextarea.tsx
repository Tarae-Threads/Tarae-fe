import type { UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  rows?: number
  error?: string
  registration: UseFormRegisterReturn
}

export default function FormTextarea({
  label,
  required,
  placeholder,
  rows = 3,
  error,
  registration,
}: Props) {
  return (
    <div>
      <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
        {label}{required && ' *'}
      </label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        {...registration}
        className={`w-full bg-surface-container px-4 py-3 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
          error ? 'ring-2 ring-destructive/30' : ''
        }`}
      />
      {error && <p className="text-destructive text-label-xs mt-1">{error}</p>}
    </div>
  )
}
