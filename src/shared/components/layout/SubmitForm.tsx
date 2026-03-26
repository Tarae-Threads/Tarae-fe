'use client'

import { useState } from 'react'
import type { PlaceCategory } from '@/domains/place/types'
import type { EventType } from '@/domains/event/types'
import { CATEGORY_LABEL, CATEGORY_BG, CATEGORY_COLOR } from '@/domains/place/constants'
import { EVENT_TYPE_LABEL, EVENT_TYPE_BG, EVENT_TYPE_COLOR } from '@/domains/event/constants'
import { X, Send, Map, Calendar } from 'lucide-react'

const categoryList: PlaceCategory[] = ['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply']
const eventTypeList: EventType[] = ['tester_recruitment', 'sale', 'event_popup']

type FormTab = 'place' | 'event'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SubmitForm({ open, onClose }: Props) {
  const [tab, setTab] = useState<FormTab>('place')
  const [submitted, setSubmitted] = useState(false)

  // Place fields
  const [placeName, setPlaceName] = useState('')
  const [address, setAddress] = useState('')
  const [categories, setCategories] = useState<Set<PlaceCategory>>(new Set())
  const [placeDesc, setPlaceDesc] = useState('')

  // Event fields
  const [eventTitle, setEventTitle] = useState('')
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [eventDesc, setEventDesc] = useState('')

  if (!open) return null

  const toggleCat = (cat: PlaceCategory) => {
    setCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const selectEventType = (type: EventType) => {
    setEventType(prev => prev === type ? null : type)
  }

  const resetForm = () => {
    setPlaceName('')
    setAddress('')
    setCategories(new Set())
    setPlaceDesc('')
    setEventTitle('')
    setEventType(null)
    setStartDate('')
    setEndDate('')
    setLocation('')
    setEventDesc('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (tab === 'place') {
      if (!placeName.trim() || !address.trim() || categories.size === 0) return
      const submission = {
        name: placeName.trim(),
        address: address.trim(),
        categories: [...categories],
        description: placeDesc.trim(),
        submittedAt: new Date().toISOString(),
      }
      const existing = JSON.parse(localStorage.getItem('tarae_place_submissions') || '[]')
      existing.push(submission)
      localStorage.setItem('tarae_place_submissions', JSON.stringify(existing))
    } else {
      if (!eventTitle.trim() || !eventType || !startDate) return
      const submission = {
        title: eventTitle.trim(),
        type: eventType,
        startDate,
        endDate: endDate || startDate,
        location: location.trim(),
        description: eventDesc.trim(),
        submittedAt: new Date().toISOString(),
      }
      const existing = JSON.parse(localStorage.getItem('tarae_event_submissions') || '[]')
      existing.push(submission)
      localStorage.setItem('tarae_event_submissions', JSON.stringify(existing))
    }

    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      resetForm()
      onClose()
    }, 1500)
  }

  const inputClass = 'w-full bg-surface-container h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-on-surface/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-x-4 bottom-8 z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[440px] md:bottom-12 max-h-[80vh] overflow-y-auto hide-scrollbar">
        <div className="bg-surface-container-low rounded-3xl editorial-shadow p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-title-lg text-on-surface">제보하기</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full">
              <X className="w-5 h-5 text-outline" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => setTab('place')}
              className={`flex items-center gap-1.5 px-4 py-2 text-label-lg font-bold rounded-full transition-all ${
                tab === 'place'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              장소
            </button>
            <button
              type="button"
              onClick={() => setTab('event')}
              className={`flex items-center gap-1.5 px-4 py-2 text-label-lg font-bold rounded-full transition-all ${
                tab === 'event'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              일정
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <p className="font-display font-bold text-title-sm text-primary mb-2">제보 완료!</p>
              <p className="text-body-sm text-on-surface-variant">제보 내용은 이 기기에 저장됩니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'place' ? (
                <>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1 block">장소명 *</label>
                    <input type="text" value={placeName} onChange={e => setPlaceName(e.target.value)} required placeholder="뜨개 장소 이름" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1 block">주소 *</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} required placeholder="도로명 또는 지번 주소" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1.5 block">카테고리 * (복수 선택)</label>
                    <div className="flex flex-wrap gap-2">
                      {categoryList.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCat(cat)}
                          className="px-3 py-1.5 text-label-md font-bold rounded-full transition-all border-2"
                          style={categories.has(cat)
                            ? { backgroundColor: CATEGORY_BG[cat], borderColor: CATEGORY_COLOR[cat], color: CATEGORY_COLOR[cat] }
                            : { backgroundColor: CATEGORY_BG[cat], borderColor: 'transparent', color: CATEGORY_COLOR[cat] }
                          }
                        >
                          {CATEGORY_LABEL[cat]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1 block">설명</label>
                    <textarea value={placeDesc} onChange={e => setPlaceDesc(e.target.value)} placeholder="추가 정보 (운영시간, 특징 등)" rows={3} className="w-full bg-surface-container px-4 py-3 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1 block">제목 *</label>
                    <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required placeholder="이벤트 제목" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1.5 block">유형 *</label>
                    <div className="flex flex-wrap gap-2">
                      {eventTypeList.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => selectEventType(type)}
                          className="px-3 py-1.5 text-label-md font-bold rounded-full transition-all border-2"
                          style={eventType === type
                            ? { backgroundColor: EVENT_TYPE_BG[type], borderColor: EVENT_TYPE_COLOR[type], color: EVENT_TYPE_COLOR[type] }
                            : { backgroundColor: EVENT_TYPE_BG[type], borderColor: 'transparent', color: EVENT_TYPE_COLOR[type] }
                          }
                        >
                          {EVENT_TYPE_LABEL[type]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-label-md font-bold text-on-surface-variant mb-1 block">시작일 *</label>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="text-label-md font-bold text-on-surface-variant mb-1 block">종료일</label>
                      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1 block">장소</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="장소명 또는 주소" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-label-md font-bold text-on-surface-variant mb-1 block">설명</label>
                    <textarea value={eventDesc} onChange={e => setEventDesc(e.target.value)} placeholder="이벤트 상세 내용" rows={3} className="w-full bg-surface-container px-4 py-3 rounded-xl text-label-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                </>
              )}

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
