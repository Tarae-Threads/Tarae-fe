'use client'

import { useState } from 'react'
import { Send, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  recruitmentId: string
}

export default function TesterApplicationForm({ recruitmentId }: Props) {
  const [open, setOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [contact, setContact] = useState('')
  const [experience, setExperience] = useState('')
  const [reason, setReason] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim() || !contact.trim() || !experience.trim() || !reason.trim()) return

    const application = {
      id: `app-${Date.now()}`,
      recruitmentId,
      nickname: nickname.trim(),
      contact: contact.trim(),
      experience: experience.trim(),
      reason: reason.trim(),
      portfolio: portfolio.trim() || undefined,
      status: 'submitted' as const,
      appliedAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('tarae_tester_applications') || '[]')
    existing.push(application)
    localStorage.setItem('tarae_tester_applications', JSON.stringify(existing))

    setSubmitted(true)
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
        <form onSubmit={handleSubmit} className="mt-4 bg-surface-container rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-label-md font-bold text-on-surface-variant mb-1 block">닉네임 *</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              required
              className="w-full bg-surface h-11 px-4 rounded-xl text-label-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-label-md font-bold text-on-surface-variant mb-1 block">연락처 *</label>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              required
              placeholder="인스타 ID, 이메일 등"
              className="w-full bg-surface h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-label-md font-bold text-on-surface-variant mb-1 block">뜨개 경험 *</label>
            <textarea
              value={experience}
              onChange={e => setExperience(e.target.value)}
              required
              rows={2}
              placeholder="뜨개 경력, 주로 만드는 작품 등"
              className="w-full bg-surface px-4 py-3 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <div>
            <label className="text-label-md font-bold text-on-surface-variant mb-1 block">지원 이유 *</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              rows={2}
              className="w-full bg-surface px-4 py-3 rounded-xl text-label-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <div>
            <label className="text-label-md font-bold text-on-surface-variant mb-1 block">포트폴리오 (선택)</label>
            <input
              type="text"
              value={portfolio}
              onChange={e => setPortfolio(e.target.value)}
              placeholder="인스타그램, 블로그 URL 등"
              className="w-full bg-surface h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            신청 제출
          </button>
        </form>
      )}
    </div>
  )
}
