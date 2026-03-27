import type { UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  type?: 'text' | 'date'
  readOnly?: boolean
  error?: string
  registration: UseFormRegisterReturn
  onClick?: () => void
}

export default function FormInput({
  label,
  required,
  placeholder,
  type = 'text',
  readOnly,
  error,
  registration,
  onClick,
}: Props) {
  return (
    <div>
      <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        onClick={onClick}
        {...registration}
        className={`w-full h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          readOnly
            ? 'bg-surface-container cursor-pointer'
            : 'bg-surface-container'
        } ${error ? 'ring-2 ring-destructive/30' : ''}`}
      />
      {error && <p className="text-destructive text-label-xs mt-1">{error}</p>}
    </div>
  )
}
