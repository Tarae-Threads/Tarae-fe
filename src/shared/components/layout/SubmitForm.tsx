'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PlaceCategory } from '@/domains/place/types'
import type { EventType } from '@/domains/event/types'
import { CATEGORY_LABEL, CATEGORY_BG, CATEGORY_COLOR } from '@/domains/place/constants'
import { EVENT_TYPE_LABEL, EVENT_TYPE_BG, EVENT_TYPE_COLOR } from '@/domains/event/constants'
import { placeSubmissionSchema, eventSubmissionSchema, placeUpdateSchema } from '@/shared/schemas/submitForm'
import type { PlaceSubmissionData, EventSubmissionData, PlaceUpdateData } from '@/shared/schemas/submitForm'
import { getPlaces } from '@/domains/place/utils/places'
import FormInput from '@/shared/components/ui/FormInput'
import FormChipGroup from '@/shared/components/ui/FormChipGroup'
import SearchSelect from '@/shared/components/ui/SearchSelect'
import { X, Send, Map, Calendar } from 'lucide-react'

const categoryOptions = (['yarn_store', 'studio', 'cafe', 'dye_shop', 'craft_supply'] as PlaceCategory[]).map(cat => ({
  value: cat, label: CATEGORY_LABEL[cat], bg: CATEGORY_BG[cat], color: CATEGORY_COLOR[cat],
}))

const eventTypeOptions = (['tester_recruitment', 'sale', 'event_popup'] as EventType[]).map(type => ({
  value: type, label: EVENT_TYPE_LABEL[type], bg: EVENT_TYPE_BG[type], color: EVENT_TYPE_COLOR[type],
}))

type FormTab = 'place' | 'event'
type PlaceMode = 'new' | 'update'

const placeOptions = getPlaces().map(p => ({
  value: p.id, label: p.name, sub: p.address,
}))

interface Props {
  open: boolean
  onClose: () => void
}

/* ---- 공통 장소 필드 (신규/업데이트 공용) ---- */
function PlaceDetailFields({ register, errors, prefix }: {
  register: (name: string) => ReturnType<ReturnType<typeof useForm>['register']>
  errors: Record<string, { message?: string } | undefined>
  prefix?: string
}) {
  return (
    <>
      {/* 운영 정보 */}
      <fieldset className="space-y-3">
        <legend className="text-label-md font-bold text-on-surface mb-1">운영 정보</legend>
        <FormInput label="영업시간" placeholder="월~금 11:00-19:00" registration={register('hours')} error={errors.hours?.message} />
        <FormInput label="휴무일" placeholder="일요일, 공휴일" registration={register('closedDays')} error={errors.closedDays?.message} />
      </fieldset>

      {/* 브랜드 */}
      <fieldset className="space-y-3">
        <legend className="text-label-md font-bold text-on-surface mb-1">취급 브랜드</legend>
        <FormInput label="실 브랜드" placeholder="이사거, 산네스간, 오팔" registration={register('brandsYarn')} error={errors.brandsYarn?.message} />
        <FormInput label="바늘 브랜드" placeholder="히야히야, 아디, 튤립" registration={register('brandsNeedle')} error={errors.brandsNeedle?.message} />
        <FormInput label="부자재 브랜드" placeholder="코코닛츠, 크로바" registration={register('brandsNotions')} error={errors.brandsNotions?.message} />
      </fieldset>

      {/* 링크 */}
      <fieldset className="space-y-3">
        <legend className="text-label-md font-bold text-on-surface mb-1">링크</legend>
        <FormInput label="인스타그램" placeholder="https://instagram.com/..." registration={register('linkInstagram')} error={errors.linkInstagram?.message} />
        <FormInput label="웹사이트" placeholder="https://..." registration={register('linkWebsite')} error={errors.linkWebsite?.message} />
        <FormInput label="네이버 지도" placeholder="https://naver.me/..." registration={register('linkNaverMap')} error={errors.linkNaverMap?.message} />
      </fieldset>

      {/* 기타 */}
      <FormInput label="태그" placeholder="수입실, 대바늘, 공방 (쉼표로 구분)" registration={register('tags')} error={errors.tags?.message} />
      <FormInput label="참고사항" placeholder="추가 정보" registration={register('note')} error={errors.note?.message} />
    </>
  )
}

export default function SubmitForm({ open, onClose }: Props) {
  const [tab, setTab] = useState<FormTab>('place')
  const [placeMode, setPlaceMode] = useState<PlaceMode>('new')
  const [submitted, setSubmitted] = useState(false)

  // Place form (new)
  const [selectedCategories, setSelectedCategories] = useState<Set<PlaceCategory>>(new Set())
  const [categoryError, setCategoryError] = useState<string>()
  const placeForm = useForm<PlaceSubmissionData>({
    resolver: zodResolver(placeSubmissionSchema),
  })

  // Place update form
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [placeSelectError, setPlaceSelectError] = useState<string>()
  const updateForm = useForm<PlaceUpdateData>({
    resolver: zodResolver(placeUpdateSchema),
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

  const splitComma = (s?: string) => s ? s.split(',').map(v => v.trim()).filter(Boolean) : []

  const onPlaceSubmit = (data: PlaceSubmissionData) => {
    if (selectedCategories.size === 0) {
      setCategoryError('카테고리를 선택해주세요')
      return
    }
    const fullAddress = data.addressDetail ? `${data.address} ${data.addressDetail}` : data.address
    const submission = {
      type: 'new' as const,
      name: data.name,
      address: fullAddress,
      categories: [...selectedCategories],
      hours: data.hours || '',
      closedDays: splitComma(data.closedDays),
      note: data.note || '',
      tags: splitComma(data.tags),
      brands: {
        yarn: splitComma(data.brandsYarn),
        needle: splitComma(data.brandsNeedle),
        notions: splitComma(data.brandsNotions),
      },
      links: {
        instagram: data.linkInstagram || undefined,
        website: data.linkWebsite || undefined,
        naver_map: data.linkNaverMap || undefined,
      },
      submittedAt: new Date().toISOString(),
    }
    const existing = JSON.parse(localStorage.getItem('tarae_place_submissions') || '[]')
    existing.push(submission)
    localStorage.setItem('tarae_place_submissions', JSON.stringify(existing))
    handleSuccess()
  }

  const onPlaceUpdate = (data: PlaceUpdateData) => {
    if (!selectedPlaceId) {
      setPlaceSelectError('장소를 선택해주세요')
      return
    }
    const place = placeOptions.find(p => p.value === selectedPlaceId)
    const submission = {
      type: 'update' as const,
      placeId: selectedPlaceId,
      placeName: place?.label || '',
      hours: data.hours || undefined,
      closedDays: data.closedDays ? splitComma(data.closedDays) : undefined,
      note: data.note || undefined,
      tags: data.tags ? splitComma(data.tags) : undefined,
      brands: {
        yarn: data.brandsYarn ? splitComma(data.brandsYarn) : undefined,
        needle: data.brandsNeedle ? splitComma(data.brandsNeedle) : undefined,
        notions: data.brandsNotions ? splitComma(data.brandsNotions) : undefined,
      },
      links: {
        instagram: data.linkInstagram || undefined,
        website: data.linkWebsite || undefined,
        naver_map: data.linkNaverMap || undefined,
      },
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
  }

  const handleConfirm = () => {
    setSubmitted(false)
    placeForm.reset()
    updateForm.reset()
    eventForm.reset()
    setSelectedCategories(new Set())
    setSelectedPlaceId(null)
    setPlaceSelectError(undefined)
    setSelectedEventType(null)
    setPlaceMode('new')
    onClose()
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
              <p className="text-body-sm text-on-surface-variant mb-5">제보 내용은 이 기기에 저장됩니다.</p>
              <button type="button" onClick={handleConfirm} className="px-8 py-2.5 bg-secondary text-secondary-foreground font-bold rounded-xl">
                확인
              </button>
            </div>
          ) : tab === 'place' ? (
            <div className="space-y-4">
              {/* Place Mode Toggle */}
              <div className="flex gap-2">
                <button type="button" onClick={() => setPlaceMode('new')}
                  className={`flex-1 py-2 text-label-md font-bold rounded-xl transition-all ${
                    placeMode === 'new' ? 'bg-secondary text-secondary-foreground' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                  새 장소
                </button>
                <button type="button" onClick={() => setPlaceMode('update')}
                  className={`flex-1 py-2 text-label-md font-bold rounded-xl transition-all ${
                    placeMode === 'update' ? 'bg-secondary text-secondary-foreground' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                  기존 장소 업데이트
                </button>
              </div>

              {placeMode === 'new' ? (
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
                  <PlaceDetailFields
                    register={(name) => placeForm.register(name as keyof PlaceSubmissionData)}
                    errors={placeForm.formState.errors as Record<string, { message?: string } | undefined>}
                  />
                  <button type="submit" className="w-full signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <Send className="w-4 h-4" /> 제보하기
                  </button>
                </form>
              ) : (
                <form onSubmit={updateForm.handleSubmit(onPlaceUpdate)} className="space-y-4">
                  <SearchSelect
                    label="장소 선택"
                    required
                    options={placeOptions}
                    value={selectedPlaceId}
                    onChange={(id) => {
                      setSelectedPlaceId(id)
                      updateForm.setValue('placeId', id || '', { shouldValidate: true })
                      setPlaceSelectError(undefined)
                    }}
                    placeholder="장소명 또는 주소로 검색..."
                    error={placeSelectError}
                  />
                  <p className="text-label-xs text-outline">변경된 항목만 입력해주세요</p>
                  <PlaceDetailFields
                    register={(name) => updateForm.register(name as keyof PlaceUpdateData)}
                    errors={updateForm.formState.errors as Record<string, { message?: string } | undefined>}
                  />
                  <button type="submit" className="w-full signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <Send className="w-4 h-4" /> 제보하기
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4">
              <FormInput label="제목" required placeholder="이벤트 제목" registration={eventForm.register('title')} error={eventForm.formState.errors.title?.message} />
              <FormChipGroup label="유형" required options={eventTypeOptions} selected={selectedEventType} onToggle={toggleEventType} mode="single" error={eventTypeError} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="시작일" required type="date" registration={eventForm.register('startDate')} error={eventForm.formState.errors.startDate?.message} />
                <FormInput label="종료일" type="date" registration={eventForm.register('endDate')} />
              </div>
              <FormInput label="장소" placeholder="장소명 또는 주소" registration={eventForm.register('location')} />
              <FormInput label="설명" placeholder="이벤트 상세 내용" registration={eventForm.register('description')} />
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
