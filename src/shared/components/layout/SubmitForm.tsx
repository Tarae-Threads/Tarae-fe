"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EventType } from "@/domains/event/types";
import {
  CATEGORY_LABEL,
  CATEGORY_BG,
  CATEGORY_COLOR,
} from "@/domains/place/constants";
import {
  EVENT_TYPE_LABEL,
  EVENT_TYPE_BG,
  EVENT_TYPE_COLOR,
} from "@/domains/event/constants";
import {
  placeSubmissionSchema,
  eventSubmissionSchema,
  placeUpdateSchema,
} from "@/shared/schemas/submitForm";
import type {
  PlaceSubmissionData,
  EventSubmissionData,
  PlaceUpdateData,
} from "@/shared/schemas/submitForm";
import { requestPlace } from "@/domains/place/queries/placeApi";
import { requestEvent } from "@/domains/event/queries/eventApi";
import { getPlaces } from "@/domains/place/queries/placeApi";
import { toast } from "@/shared/components/ui/toast";
import FormInput from "@/shared/components/ui/FormInput";
import FormChipGroup from "@/shared/components/ui/FormChipGroup";
import SearchSelect from "@/shared/components/ui/SearchSelect";
import {
  Send,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Pencil,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

// ---------------------------------------------------------------------------
// 상수
// ---------------------------------------------------------------------------

const CATEGORY_KEYS = [
  "뜨개샵",
  "공방",
  "뜨개카페",
  "손염색실",
  "공예용품점",
] as const;
const categoryOptions = CATEGORY_KEYS.map((cat) => ({
  value: cat,
  label: CATEGORY_LABEL[cat],
  bg: CATEGORY_BG[cat],
  color: CATEGORY_COLOR[cat],
}));

const EVENT_TYPE_KEYS: EventType[] = ["TESTER_RECRUIT", "SALE", "EVENT_POPUP"];
const eventTypeOptions = EVENT_TYPE_KEYS.map((type) => ({
  value: type,
  label: EVENT_TYPE_LABEL[type],
  bg: EVENT_TYPE_BG[type],
  color: EVENT_TYPE_COLOR[type],
}));

type FormTab = "place" | "event";
type PlaceMode = "new" | "update" | null;

// ---------------------------------------------------------------------------
// 스텝 설정
// ---------------------------------------------------------------------------

// place mode 선택이 step 0, 이후 분기
const STEP_TITLES = {
  placeSelect: ["어떤 제보를 하시겠어요?"],
  placeNew: ["장소 기본 정보", "카테고리 선택", "추가 정보가 있나요?"],
  placeUpdate: ["어떤 장소를 수정하나요?", "수정할 내용을 알려주세요"],
  event: ["어떤 일정인가요?", "언제, 어디서 진행되나요?"],
} as const;

// ---------------------------------------------------------------------------
// StepIndicator
// ---------------------------------------------------------------------------

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className={cn(
              "size-2 rounded-full transition-all duration-normal",
              i === current
                ? "bg-primary scale-125"
                : i < current
                  ? "bg-primary/40"
                  : "bg-surface-container-high",
            )}
          />
          {i < total - 1 && (
            <div
              className={cn(
                "w-6 h-0.5 rounded-full transition-all duration-normal",
                i < current ? "bg-primary/40" : "bg-surface-container-high",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 공통 장소 필드 (선택 항목)
// ---------------------------------------------------------------------------

function PlaceDetailFields({
  register,
  errors,
}: {
  register: (
    name: string,
  ) => ReturnType<ReturnType<typeof useForm>["register"]>;
  errors: Record<string, { message?: string } | undefined>;
}) {
  return (
    <>
      <fieldset className="space-y-3">
        <legend className="text-label-md font-bold text-on-surface mb-1">
          운영 정보
        </legend>
        <FormInput
          label="영업시간"
          placeholder="월~금 11:00-19:00"
          registration={register("hours")}
          error={errors.hours?.message}
        />
        <FormInput
          label="휴무일"
          placeholder="일요일, 공휴일"
          registration={register("closedDays")}
          error={errors.closedDays?.message}
        />
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="text-label-md font-bold text-on-surface mb-1">
          취급 브랜드
        </legend>
        <FormInput
          label="실 브랜드"
          placeholder="이사거, 산네스간, 오팔"
          registration={register("brandsYarn")}
          error={errors.brandsYarn?.message}
        />
        <FormInput
          label="바늘 브랜드"
          placeholder="히야히야, 아디, 튤립"
          registration={register("brandsNeedle")}
          error={errors.brandsNeedle?.message}
        />
        <FormInput
          label="부자재 브랜드"
          placeholder="코코닛츠, 크로바"
          registration={register("brandsNotions")}
          error={errors.brandsNotions?.message}
        />
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="text-label-md font-bold text-on-surface mb-1">
          링크
        </legend>
        <FormInput
          label="인스타그램"
          placeholder="https://instagram.com/..."
          registration={register("linkInstagram")}
          error={errors.linkInstagram?.message}
        />
        <FormInput
          label="웹사이트"
          placeholder="https://..."
          registration={register("linkWebsite")}
          error={errors.linkWebsite?.message}
        />
        <FormInput
          label="네이버 지도"
          placeholder="https://naver.me/..."
          registration={register("linkNaverMap")}
          error={errors.linkNaverMap?.message}
        />
      </fieldset>
      <FormInput
        label="태그"
        placeholder="수입실, 대바늘, 공방 (쉼표로 구분)"
        registration={register("tags")}
        error={errors.tags?.message}
      />
      <FormInput
        label="참고사항"
        placeholder="추가 정보"
        registration={register("note")}
        error={errors.note?.message}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// SubmitForm
// ---------------------------------------------------------------------------

interface Props {
  onClose: (v?: unknown) => void;
}

export default function SubmitForm({ onClose }: Props) {
  const [tab, setTab] = useState<FormTab>("place");
  const [placeMode, setPlaceMode] = useState<PlaceMode>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Place options for update dropdown
  const [placeOptions, setPlaceOptions] = useState<
    { value: string; label: string; sub?: string }[]
  >([]);
  useEffect(() => {
    getPlaces()
      .then((places) => {
        setPlaceOptions(
          places.map((p) => ({
            value: String(p.id),
            label: p.name,
            sub: p.address,
          })),
        );
      })
      .catch(() => {});
  }, []);

  // Geocoding 좌표
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // Place form (new)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [categoryError, setCategoryError] = useState<string>();
  const placeForm = useForm<PlaceSubmissionData>({
    resolver: zodResolver(placeSubmissionSchema),
  });

  // Place update form
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [placeSelectError, setPlaceSelectError] = useState<string>();
  const updateForm = useForm<PlaceUpdateData>({
    resolver: zodResolver(placeUpdateSchema),
  });

  // Event form
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(
    null,
  );
  const [eventTypeError, setEventTypeError] = useState<string>();
  const eventForm = useForm<EventSubmissionData>({
    resolver: zodResolver(eventSubmissionSchema),
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      address: "",
      addressDetail: "",
      description: "",
    },
  });

  // ---------------------------------------------------------------------------
  // 스텝 계산
  // ---------------------------------------------------------------------------

  // place 탭에서 mode 미선택이면 선택 화면
  const stepKey: keyof typeof STEP_TITLES =
    tab === "event"
      ? "event"
      : placeMode === null
        ? "placeSelect"
        : placeMode === "new"
          ? "placeNew"
          : "placeUpdate";

  const titles = STEP_TITLES[stepKey];
  const totalSteps = titles.length;
  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps - 1;

  // 탭 변경 시 리셋
  useEffect(() => {
    setStep(0);
    setPlaceMode(null);
  }, [tab]);

  // ---------------------------------------------------------------------------
  // 핸들러
  // ---------------------------------------------------------------------------

  const toggleCat = (value: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
    setCategoryError(undefined);
  };

  const toggleEventType = (value: string) => {
    const type = value as EventType;
    setSelectedEventType((prev) => (prev === type ? null : type));
    setEventTypeError(undefined);
  };

  const openAddressSearch = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const selected =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        placeForm.setValue("address", selected, { shouldValidate: true });
        try {
          const res = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: selected }),
          });
          if (res.ok) {
            const { lat, lng } = await res.json();
            setCoords({ lat, lng });
          }
        } catch {
          // 좌표 변환 실패해도 주소 입력은 유지
        }
      },
    }).open();
  };

  // ---------------------------------------------------------------------------
  // 스텝 유효성 검증 + 다음
  // ---------------------------------------------------------------------------

  const validateAndNext = async () => {
    if (stepKey === "placeNew") {
      if (step === 0) {
        const valid = await placeForm.trigger(["name", "address"]);
        if (!valid) return;
      }
      if (step === 1) {
        if (selectedCategories.size === 0) {
          setCategoryError("카테고리를 선택해주세요");
          return;
        }
      }
    }
    if (stepKey === "placeUpdate" && step === 0) {
      if (!selectedPlaceId) {
        setPlaceSelectError("장소를 선택해주세요");
        return;
      }
    }
    if (stepKey === "event" && step === 0) {
      const titleValid = await eventForm.trigger("title");
      if (!selectedEventType) {
        setEventTypeError("유형을 선택해주세요");
        return;
      }
      if (!titleValid) return;
    }

    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  // ---------------------------------------------------------------------------
  // 제출
  // ---------------------------------------------------------------------------

  const onPlaceSubmit = async (data: PlaceSubmissionData) => {
    if (selectedCategories.size === 0) {
      setCategoryError("카테고리를 선택해주세요");
      return;
    }
    setSubmitting(true);
    try {
      await requestPlace({
        requestType: "NEW",
        name: data.name,
        address: data.address,
        addressDetail: data.addressDetail || undefined,
        lat: coords?.lat,
        lng: coords?.lng,
        hoursText: data.hours || undefined,
        closedDays: data.closedDays || undefined,
        brandsYarn: data.brandsYarn || undefined,
        brandsNeedle: data.brandsNeedle || undefined,
        brandsNotions: data.brandsNotions || undefined,
        instagramUrl: data.linkInstagram || undefined,
        websiteUrl: data.linkWebsite || undefined,
        naverMapUrl: data.linkNaverMap || undefined,
        tags: data.tags || undefined,
        note: data.note || undefined,
      });
      toast.success("제보가 등록되었습니다");
      onClose();
    } catch {
      // axios interceptor handles error toast
    } finally {
      setSubmitting(false);
    }
  };

  const onPlaceUpdate = async (data: PlaceUpdateData) => {
    setSubmitting(true);
    try {
      await requestPlace({
        requestType: "UPDATE",
        placeId: Number(selectedPlaceId),
        hoursText: data.hours || undefined,
        closedDays: data.closedDays || undefined,
        brandsYarn: data.brandsYarn || undefined,
        brandsNeedle: data.brandsNeedle || undefined,
        brandsNotions: data.brandsNotions || undefined,
        instagramUrl: data.linkInstagram || undefined,
        websiteUrl: data.linkWebsite || undefined,
        naverMapUrl: data.linkNaverMap || undefined,
        tags: data.tags || undefined,
        note: data.note || undefined,
      });
      toast.success("제보가 등록되었습니다");
      onClose();
    } catch {
      // axios interceptor handles error toast
    } finally {
      setSubmitting(false);
    }
  };

  const onEventSubmit = async (data: EventSubmissionData) => {
    setSubmitting(true);
    try {
      const locationText =
        [data.address, data.addressDetail].filter(Boolean).join(" ") ||
        undefined;
      await requestEvent({
        title: data.title,
        eventType: selectedEventType!,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        locationText,
        description: data.description || undefined,
      });
      toast.success("제보가 등록되었습니다");
      onClose();
    } catch {
      // axios interceptor handles error toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipSubmit = () => {
    if (stepKey === "placeNew") placeForm.handleSubmit(onPlaceSubmit)();
    if (stepKey === "placeUpdate") updateForm.handleSubmit(onPlaceUpdate)();
    if (stepKey === "event") eventForm.handleSubmit(onEventSubmit)();
  };

  // ---------------------------------------------------------------------------
  // 스텝별 필드 렌더링
  // ---------------------------------------------------------------------------

  // 장소 모드 선택 화면 (step 0 of placeSelect)
  const renderPlaceModeSelect = () => (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => {
          setPlaceMode("new");
          setStep(0);
        }}
        className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low transition-all hover:bg-surface-container active:scale-[0.98]"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary-fixed">
          <MapPin className="size-5 text-primary" />
        </div>
        <div className="text-left">
          <p className="text-label-lg font-bold text-on-surface">
            새 장소 제보
          </p>
          <p className="text-label-sm text-on-surface-variant">
            아직 등록되지 않은 뜨개 장소를 알려주세요
          </p>
        </div>
      </button>
      <button
        type="button"
        onClick={() => {
          setPlaceMode("update");
          setStep(0);
        }}
        className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low transition-all hover:bg-surface-container active:scale-[0.98]"
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-secondary-container">
          <Pencil className="size-5 text-secondary" />
        </div>
        <div className="text-left">
          <p className="text-label-lg font-bold text-on-surface">
            기존 장소 수정
          </p>
          <p className="text-label-sm text-on-surface-variant">
            운영시간, 브랜드 등 변경된 정보를 알려주세요
          </p>
        </div>
      </button>
    </div>
  );

  const renderPlaceNewStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 px-2">
            <FormInput
              label="장소명"
              required
              placeholder="뜨개 장소 이름"
              registration={placeForm.register("name")}
              error={placeForm.formState.errors.name?.message}
            />
            <div>
              <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
                주소 *
              </label>
              <div className="flex gap-2">
                <FormInput
                  label=""
                  readOnly
                  placeholder="주소 검색을 눌러주세요"
                  registration={placeForm.register("address")}
                  error={placeForm.formState.errors.address?.message}
                  onClick={openAddressSearch}
                />
                <button
                  type="button"
                  onClick={openAddressSearch}
                  className="shrink-0 px-3 h-11 mt-auto bg-secondary text-secondary-foreground font-bold text-label-md rounded-xl"
                >
                  검색
                </button>
              </div>
            </div>
            <FormInput
              label="상세주소"
              placeholder="층, 호수 등 상세주소"
              registration={placeForm.register("addressDetail")}
            />
            {coords && (
              <p className="text-label-xs text-outline">
                좌표: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </p>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 px-2">
            <FormChipGroup
              label="카테고리"
              required
              options={categoryOptions}
              selected={selectedCategories}
              onToggle={toggleCat}
              mode="multi"
              error={categoryError}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 px-2">
            <p className="text-body-sm text-on-surface-variant">
              아는 정보만 입력해주세요. 나중에 수정할 수 있어요.
            </p>
            <PlaceDetailFields
              register={(name) =>
                placeForm.register(name as keyof PlaceSubmissionData)
              }
              errors={
                placeForm.formState.errors as Record<
                  string,
                  { message?: string } | undefined
                >
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderPlaceUpdateStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 px-2">
            <SearchSelect
              label="장소 선택"
              required
              options={placeOptions}
              value={selectedPlaceId}
              onChange={(id) => {
                setSelectedPlaceId(id);
                updateForm.setValue("placeId", id || "", {
                  shouldValidate: true,
                });
                setPlaceSelectError(undefined);
              }}
              placeholder="장소명 또는 주소로 검색..."
              error={placeSelectError}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 px-2">
            <p className="text-body-sm text-on-surface-variant">
              변경된 항목만 입력해주세요.
            </p>
            <PlaceDetailFields
              register={(name) =>
                updateForm.register(name as keyof PlaceUpdateData)
              }
              errors={
                updateForm.formState.errors as Record<
                  string,
                  { message?: string } | undefined
                >
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  const openEventAddressSearch = () => {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const selected =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
        eventForm.setValue("address", selected, { shouldValidate: true });
      },
    }).open();
  };

  const renderEventStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 px-2">
            <FormInput
              label="제목"
              required
              placeholder="이벤트 제목"
              registration={eventForm.register("title")}
              error={eventForm.formState.errors.title?.message}
            />
            <FormChipGroup
              label="유형"
              required
              options={eventTypeOptions}
              selected={selectedEventType}
              onToggle={toggleEventType}
              mode="single"
              error={eventTypeError}
            />
            <div>
              <label className="text-label-md font-bold text-on-surface-variant mb-1 block">
                장소
              </label>
              <div className="flex gap-2">
                <FormInput
                  label=""
                  readOnly
                  placeholder="주소 검색을 눌러주세요"
                  registration={eventForm.register("address")}
                  onClick={openEventAddressSearch}
                />
                <button
                  type="button"
                  onClick={openEventAddressSearch}
                  className="shrink-0 px-3 h-11 mt-auto bg-secondary text-secondary-foreground font-bold text-label-md rounded-xl"
                >
                  검색
                </button>
              </div>
            </div>
            <FormInput
              label="상세주소"
              placeholder="층, 호수 등 상세주소"
              registration={eventForm.register("addressDetail")}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 px-2">
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="시작일"
                required
                type="date"
                registration={eventForm.register("startDate")}
                error={eventForm.formState.errors.startDate?.message}
              />
              <FormInput
                label="종료일"
                type="date"
                registration={eventForm.register("endDate")}
              />
            </div>
            <FormInput
              label="설명"
              placeholder="이벤트 상세 내용"
              registration={eventForm.register("description")}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // ---------------------------------------------------------------------------
  // submit / footer 로직
  // ---------------------------------------------------------------------------

  const currentSubmitHandler =
    stepKey === "placeNew"
      ? placeForm.handleSubmit(onPlaceSubmit)
      : stepKey === "placeUpdate"
        ? updateForm.handleSubmit(onPlaceUpdate)
        : eventForm.handleSubmit(onEventSubmit);

  const lastStepIsOptional =
    (stepKey === "placeNew" && step === 2) ||
    (stepKey === "placeUpdate" && step === 1);

  // placeSelect 모드에서는 폼 없이 카드 선택만
  const isSelectMode = stepKey === "placeSelect";

  // ---------------------------------------------------------------------------
  // 렌더
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-1 flex-col min-h-0 pt-2">
      {/* Tabs */}
      <div className="flex gap-2 shrink-0 mb-3">
        <button
          type="button"
          onClick={() => setTab("place")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-label-lg font-bold rounded-full transition-all",
            tab === "place"
              ? "bg-secondary text-secondary-foreground"
              : "bg-surface-container text-on-surface-variant",
          )}
        >
          <Sparkles className="w-3.5 h-3.5" /> 장소
        </button>
        <button
          type="button"
          onClick={() => setTab("event")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-label-lg font-bold rounded-full transition-all",
            tab === "event"
              ? "bg-secondary text-secondary-foreground"
              : "bg-surface-container text-on-surface-variant",
          )}
        >
          <Calendar className="w-3.5 h-3.5" /> 일정
        </button>
      </div>

      {/* Step Indicator + Title */}
      <div className="shrink-0 mb-4">
        <StepIndicator current={step} total={totalSteps} />
        <p className="text-title-sm font-bold text-on-surface text-center">
          {titles[step]}
        </p>
      </div>

      {isSelectMode ? (
        /* 장소 모드 선택 — 폼 없이 카드 선택 */
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {renderPlaceModeSelect()}
        </div>
      ) : (
        /* 폼 스텝 */
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isLastStep) {
              currentSubmitHandler();
            } else {
              validateAndNext();
            }
          }}
          className="flex flex-1 flex-col min-h-0"
        >
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-2">
            {stepKey === "placeNew" && renderPlaceNewStep()}
            {stepKey === "placeUpdate" && renderPlaceUpdateStep()}
            {stepKey === "event" && renderEventStep()}
          </div>

          {/* Sticky Footer */}
          <div className="shrink-0 py-2 flex gap-2">
            {!isFirstStep ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-surface-container text-on-surface-variant font-bold text-label-md transition-all hover:bg-surface-container-high"
              >
                <ChevronLeft className="w-4 h-4" /> 이전
              </button>
            ) : (
              tab === "place" && (
                <button
                  type="button"
                  onClick={() => {
                    setPlaceMode(null);
                    setStep(0);
                  }}
                  className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-surface-container text-on-surface-variant font-bold text-label-md transition-all hover:bg-surface-container-high"
                >
                  <ChevronLeft className="w-4 h-4" /> 선택
                </button>
              )
            )}

            {isLastStep ? (
              <div className="flex flex-1 gap-2">
                {lastStepIsOptional && (
                  <button
                    type="button"
                    onClick={handleSkipSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface-variant font-bold text-label-md transition-all hover:bg-surface-container-high disabled:opacity-50"
                  >
                    건너뛰고 제보
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />{" "}
                  {submitting ? "제출 중..." : "제보하기"}
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="flex-1 signature-gradient text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-primary/20"
              >
                다음 <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
