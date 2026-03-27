'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PlaceCategory } from '@/domains/place/types'
import type { EventType } from '@/domains/event/types'
import { CATEGORY_LABEL, CATEGORY_BG, CATEGORY_COLOR } from '@/domains/place/constants'
import { EVENT_TYPE_LABEL, EVENT_TYPE_BG, EVENT_TYPE_COLOR } from '@/domains/event/constants'
import { placeSubmissionSchema, eventSubmissionSchema } from '@/shared/schemas/submitForm'
import type { PlaceSubmissionData, EventSubmissionData } from '@/shared/schemas/submitForm'
import FormInput from '@/shared/components/ui/FormInput'
import FormTextarea from '@/shared/components/ui/FormTextarea'
import FormChipGroup from '@/shared/components/ui/FormChipGroup'
import { X, Send, Map, Calendar } from 'lucide-react'

const categoryOptions = (['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply'] as PlaceCategory[]).map(cat => ({
  value: cat, label: CATEGORY_LABEL[cat], bg: CATEGORY_BG[cat], color: CATEGORY_COLOR[cat],
}))

const eventTypeOptions = (['tester_recruitment', 'sale', 'event_popup'] as EventType[]).map(type => ({
  value: type, label: EVENT_TYPE_LABEL[type], bg: EVENT_TYPE_BG[type], color: EVENT_TYPE_COLOR[type],
}))

type FormTab = 'place' | 'event'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SubmitForm({ open, onClose }: Props) {
  const [tab, setTab] = useState<FormTab>('place')
  const [submitted, setSubmitted] = useState(false)

  // Place form
  const [selectedCategories, setSelectedCategories] = useState<Set<PlaceCategory>>(new Set())
  const [categoryError, setCategoryError] = useState<string>()
  const placeForm = useForm<PlaceSubmissionData>({
    resolver: zodResolver(placeSubmissionSchema),
    defaultValues: { name: '', address: '', addressDetail: '', description: '' },
  })

  // Event form
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null)
  const [eventTypeError, setEventTypeError] = useState<string>()
  const eventForm = useForm<EventSubmissionData>({
    resolver: zodResolver(eventSubmissionSchema),
    defaultValues: { title: '', startDate: '', endDate: '', location: '', description: '' },
  })

  if (!open) return null

  const toggleCat = (value: string) => {
    const cat = value as PlaceCategory
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
    setCategoryError(undefined)
  }

  const toggleEventType = (value: string) => {
    const type = value as EventType
    setSelectedEventType(prev => prev === type ? null : type)
    setEventTypeError(undefined)
  }

  const openAddressSearch = () => {
    if (!window.daum?.Postcode) return
    new window.daum.Postcode({
      oncomplete: (data) => {
        const selected = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
        placeForm.setValue('address', selected, { shouldValidate: true })
      },
    }).open()
  }

  const onPlaceSubmit = (data: PlaceSubmissionData) => {
    if (selectedCategories.size === 0) {
      setCategoryError('카테고리를 선택해주세요')
      return
    }
    const fullAddress = data.addressDetail ? `${data.address} ${data.addressDetail}` : data.address
    const submission = {
      name: data.name,
      address: fullAddress,
      categories: [...selectedCategories],
      description: data.description || '',
      submittedAt: new Date().toISOString(),
    }
    const existing = JSON.parse(localStorage.getItem('tarae_place_submissions') || '[]')
    existing.push(submission)
    localStorage.setItem('tarae_place_submissions', JSON.stringify(existing))
    handleSuccess()
  }

  const onEventSubmit = (data: EventSubmissionData) => {
    if (!selectedEventType) {
      setEventTypeError('유형을 선택해주세요')
      return
    }
    const submission = {
      title: data.title,
      type: selectedEventType,
      startDate: data.startDate,
      endDate: data.endDate || data.startDate,
      location: data.location || '',
      description: data.description || '',
      submittedAt: new Date().toISOString(),
    }
    const existing = JSON.parse(localStorage.getItem('tarae_event_submissions') || '[]')
    existing.push(submission)
    localStorage.setItem('tarae_event_submissions', JSON.stringify(existing))
    handleSuccess()
  }

  const handleSuccess = () => {
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      placeForm.reset()
      eventForm.reset()
      setSelectedCategories(new Set())
      setSelectedEventType(null)
      onClose()
    }, 1500)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-on-surface/20 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
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
            <button type="button" onClick={() => setTab('place')}
              className={`flex items-center gap-1.5 px-4 py-2 text-label-lg font-bold rounded-full transition-all ${
                tab === 'place' ? 'bg-secondary text-secondary-foreground' : 'bg-surface-container text-on-surface-variant'
              }`}>
              <Map className="w-3.5 h-3.5" /> 장소
            </button>
            <button type="button" onClick={() => setTab('event')}
              className={`flex items-center gap-1.5 px-4 py-2 text-label-lg font-bold rounded-full transition-all ${
                tab === 'event' ? 'bg-secondary text-secondary-foreground' : 'bg-surface-container text-on-surface-variant'
              }`}>
              <Calendar className="w-3.5 h-3.5" /> 일정
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <p className="font-display font-bold text-title-sm text-primary mb-2">제보 완료!</p>
              <p className="text-body-sm text-on-surface-variant">제보 내용은 이 기기에 저장됩니다.</p>
            </div>
          ) : tab === 'place' ? (
            <form onSubmit={placeForm.handleSubmit(onPlaceSubmit)} className="space-y-4">
              <FormInput label="장소명" required placeholder="뜨개 장소 이름" registration={placeForm.register('name')} error={placeForm.formState.errors.name?.message} />
              <div>
                <label className="text-label-md font-bold text-on-surface-variant mb-1 block">주소 *</label>
                <div className="flex gap-2">
                  <FormInput label="" readOnly placeholder="주소 검색을 눌러주세요" registration={placeForm.register('address')} error={placeForm.formState.errors.address?.message} onClick={openAddressSearch} />
                  <button type="button" onClick={openAddressSearch} className="shrink-0 px-3 h-11 mt-auto bg-secondary text-secondary-foreground font-bold text-label-md rounded-xl">검색</button>
                </div>
              </div>
              <FormInput label="상세주소" placeholder="층, 호수 등 상세주소" registration={placeForm.register('addressDetail')} />
              <FormChipGroup label="카테고리" required options={categoryOptions} selected={selectedCategories} onToggle={toggleCat} mode="multi" error={categoryError} />
              <FormTextarea label="설명" placeholder="추가 정보 (운영시간, 특징 등)" registration={placeForm.register('description')} />
              <button type="submit" className="w-full signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Send className="w-4 h-4" /> 제보하기
              </button>
            </form>
          ) : (
            <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4">
              <FormInput label="제목" required placeholder="이벤트 제목" registration={eventForm.register('title')} error={eventForm.formState.errors.title?.message} />
              <FormChipGroup label="유형" required options={eventTypeOptions} selected={selectedEventType} onToggle={toggleEventType} mode="single" error={eventTypeError} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="시작일" required type="date" registration={eventForm.register('startDate')} error={eventForm.formState.errors.startDate?.message} />
                <FormInput label="종료일" type="date" registration={eventForm.register('endDate')} />
              </div>
              <FormInput label="장소" placeholder="장소명 또는 주소" registration={eventForm.register('location')} />
              <FormTextarea label="설명" placeholder="이벤트 상세 내용" registration={eventForm.register('description')} />
              <button type="submit" className="w-full signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Send className="w-4 h-4" /> 제보하기
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
