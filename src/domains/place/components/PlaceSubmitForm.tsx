'use client'

import { useState } from 'react'
import type { PlaceCategory } from '../types'
import { CATEGORY_LABEL } from '../constants'
import { X, Send } from 'lucide-react'

const categoryList: PlaceCategory[] = ['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply']

interface Props {
  open: boolean
  onClose: () => void
}

interface SubmissionData {
  name: string
  address: string
  category: PlaceCategory
  description: string
  submittedAt: string
}

export default function PlaceSubmitForm({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState<PlaceCategory>('yarn_store')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !address.trim()) return

    const submission: SubmissionData = {
      name: name.trim(),
      address: address.trim(),
      category,
      description: description.trim(),
      submittedAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem('tarae_place_submissions') || '[]')
    existing.push(submission)
    localStorage.setItem('tarae_place_submissions', JSON.stringify(existing))

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setAddress('')
      setCategory('yarn_store')
      setDescription('')
      onClose()
    }, 1500)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-on-surface/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-x-4 bottom-8 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[440px] md:bottom-12">
        <div className="bg-surface-container-low rounded-3xl editorial-shadow p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-extrabold text-xl text-on-surface">장소 제보</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full">
              <X className="w-5 h-5 text-outline" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <p className="font-display font-bold text-lg text-primary mb-2">제보 완료!</p>
              <p className="text-sm text-on-surface-variant">제보 내용은 이 기기에 저장됩니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
                  장소명 *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="뜨개 장소 이름"
                  className="w-full bg-surface-container h-11 px-4 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
                  주소 *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  placeholder="도로명 또는 지번 주소"
                  className="w-full bg-surface-container h-11 px-4 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
                  카테고리
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as PlaceCategory)}
                  className="w-full bg-surface-container h-11 px-4 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {categoryList.map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_LABEL[cat]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="추가 정보 (운영시간, 특징 등)"
                  rows={3}
                  className="w-full bg-surface-container px-4 py-3 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
                제보하기
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
