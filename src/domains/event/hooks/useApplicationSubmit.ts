'use client'

import { useState, useCallback } from 'react'
import { STORAGE_KEYS } from '../constants'

interface ApplicationFormData {
  nickname: string
  contact: string
  experience: string
  reason: string
  portfolio?: string
}

export function useApplicationSubmit(recruitmentId: string) {
  const [submitted, setSubmitted] = useState(false)

  const submit = useCallback((data: ApplicationFormData) => {
    const application = {
      id: crypto.randomUUID(),
      recruitmentId,
      ...data,
      status: 'submitted' as const,
      appliedAt: new Date().toISOString(),
    }

    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TESTER_APPLICATIONS) || '[]'
    )
    existing.push(application)
    localStorage.setItem(STORAGE_KEYS.TESTER_APPLICATIONS, JSON.stringify(existing))

    setSubmitted(true)
  }, [recruitmentId])

  return { submitted, submit }
}
