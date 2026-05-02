import { useState, useId } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  type?: 'text' | 'date' | 'email'
  readOnly?: boolean
  error?: string
  registration: UseFormRegisterReturn
  onClick?: () => void
  maxLength?: number
  showCount?: boolean
  autoFocus?: boolean
  rightSlot?: React.ReactNode
  /** 라벨 우측에 outline 톤 보조 문구 (앞에 "·" 자동 prepend) */
  helperText?: string
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
  maxLength,
  showCount,
  autoFocus,
  rightSlot,
  helperText,
}: Props) {
  const inputId = useId()
  const [count, setCount] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    registration.onChange(e)
    if (showCount) setCount(e.target.value.length)
  }

  const showCounter = !!(showCount && maxLength)

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="text-label-md font-bold text-on-surface-variant mb-1 block"
        >
          {label}
          {required && ' *'}
          {helperText && (
            <span className="text-outline font-medium ml-1">· {helperText}</span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          inputMode={type === 'email' ? 'email' : undefined}
          autoComplete={type === 'email' ? 'email' : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          onClick={onClick}
          maxLength={maxLength}
          autoFocus={autoFocus}
          {...registration}
          onChange={handleChange}
          className={`w-full h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 ${
            readOnly
              ? 'bg-surface-container cursor-pointer'
              : 'bg-surface-container'
          } ${error ? 'ring-2 ring-destructive/30' : ''} ${
            rightSlot ? 'pr-11' : ''
          }`}
        />
        {rightSlot && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-outline">
            {rightSlot}
          </div>
        )}
      </div>
      {(error || showCounter) && (
        <div className="mt-1 flex items-start justify-between gap-2">
          {error ? (
            <p className="text-destructive text-label-xs">{error}</p>
          ) : (
            <span />
          )}
          {showCounter && (
            <p className="text-outline text-label-xs tabular-nums shrink-0">
              {count}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
