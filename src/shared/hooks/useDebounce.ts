'use client'

import { useState, useEffect, useRef } from 'react'

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    timer.current = setTimeout(() => setDebouncedValue(value), delay)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [value, delay])

  return debouncedValue
}
