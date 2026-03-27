'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema } from '../schemas/applicationForm'
import type { ApplicationFormData } from '../schemas/applicationForm'
import { useApplicationSubmit } from '../hooks/useApplicationSubmit'
import FormInput from '@/shared/components/ui/FormInput'
import FormTextarea from '@/shared/components/ui/FormTextarea'
import { Send, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  recruitmentId: string
}

export default function TesterApplicationForm({ recruitmentId }: Props) {
  const [open, setOpen] = useState(false)
  const { submitted, submit } = useApplicationSubmit(recruitmentId)

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { nickname: '', contact: '', experience: '', reason: '', portfolio: '' },
  })

  const onSubmit = (data: ApplicationFormData) => {
    submit({
      ...data,
      portfolio: data.portfolio || undefined,
    })
  }

  if (submitted) {
    return (
      <div className="bg-secondary-container rounded-2xl p-6 text-center mb-6">
        <p className="font-display font-bold text-title-sm text-on-secondary-container mb-1">신청 완료!</p>
        <p className="text-body-sm text-on-secondary-container/80">모집자의 연락을 기다려주세요.</p>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full signature-gradient text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        테스터 신청하기
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {open && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 bg-surface-container rounded-2xl p-6 space-y-4">
          <FormInput label="닉네임" required registration={form.register('nickname')} error={form.formState.errors.nickname?.message} />
          <FormInput label="연락처" required placeholder="인스타 ID, 이메일 등" registration={form.register('contact')} error={form.formState.errors.contact?.message} />
          <FormTextarea label="뜨개 경험" required rows={2} placeholder="뜨개 경력, 주로 만드는 작품 등" registration={form.register('experience')} error={form.formState.errors.experience?.message} />
          <FormTextarea label="지원 이유" required rows={2} registration={form.register('reason')} error={form.formState.errors.reason?.message} />
          <FormInput label="포트폴리오" placeholder="인스타그램, 블로그 URL 등" registration={form.register('portfolio')} />
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> 신청 제출
          </button>
        </form>
      )}
    </div>
  )
}
