"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  InfoIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  useModalStore,
  type Entry,
  type ModalEntry,
  type ConfirmEntry,
} from "@/shared/stores/useModalStore"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const Z_BASE = 1000
const Z_STEP = 2

// 모바일(md 이상): full-screen / 데스크톱: 센터 모달
const SIZE_MAP: Record<string, { popup: string; mobile: boolean }> = {
  sm: { popup: "max-w-sm", mobile: false },
  md: { popup: "md:max-w-lg", mobile: true },
  lg: { popup: "md:max-w-2xl", mobile: true },
  xl: { popup: "md:max-w-4xl", mobile: true },
  full: { popup: "max-w-[95vw]", mobile: false },
}

// ---------------------------------------------------------------------------
// Confirm 아이콘
// ---------------------------------------------------------------------------

const CONFIRM_ICON = (
  <div className="flex size-8 items-center justify-center rounded-xl bg-primary-fixed">
    <InfoIcon className="size-4 text-primary" />
  </div>
)

// ---------------------------------------------------------------------------
// 공통 Popup 래퍼
// ---------------------------------------------------------------------------

function ModalPopup({
  entry,
  isTop,
  zIndex,
  children,
  size = "md",
  className,
}: {
  entry: Entry
  isTop: boolean
  zIndex: number
  children: React.ReactNode
  size?: string
  className?: string
}) {
  const popById = useModalStore((s) => s.popById)
  const sizeConfig = SIZE_MAP[size] ?? SIZE_MAP.md
  const isMobileFullScreen = sizeConfig.mobile

  return (
    <DialogPrimitive.Root
      open
      modal
      onOpenChange={(open) => {
        if (isTop && !open) popById(entry.id)
      }}
    >
      <DialogPrimitive.Portal>
        {isTop && (
          <DialogPrimitive.Backdrop
            data-slot="modal-overlay"
            className="fixed inset-0 bg-black/10 transition-opacity duration-200 supports-backdrop-filter:backdrop-blur-xs data-ending-style:opacity-0 data-starting-style:opacity-0"
            style={{ zIndex: zIndex - 1 }}
          />
        )}
        <DialogPrimitive.Popup
          data-slot="modal-content"
          className={cn(
            "fixed flex w-full flex-col bg-surface transition-all duration-200",
            "data-starting-style:opacity-0 data-ending-style:opacity-0",
            isTop ? "pointer-events-auto" : "pointer-events-none",
            isMobileFullScreen
              ? [
                  // 모바일: full-screen 페이지
                  "inset-0 h-[100dvh] max-h-[100dvh] rounded-none",
                  "data-starting-style:translate-y-4 data-ending-style:translate-y-4",
                  // 데스크톱: 센터 모달
                  "md:inset-auto md:top-1/2 md:left-1/2 md:h-auto md:max-h-[85vh] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:editorial-shadow",
                  "md:data-starting-style:scale-95 md:data-ending-style:scale-95",
                  "md:data-starting-style:translate-y-0 md:data-ending-style:translate-y-0",
                ]
              : [
                  // sm, full: 항상 센터 모달
                  "top-1/2 left-1/2 max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-3xl editorial-shadow",
                  "data-starting-style:scale-95 data-ending-style:scale-95",
                ],
            sizeConfig.popup,
            isMobileFullScreen ? "p-0 md:p-6" : "p-6",
            className
          )}
          style={{ zIndex }}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// ---------------------------------------------------------------------------
// Modal 렌더러
// ---------------------------------------------------------------------------

function ModalRenderer({
  entry,
  isTop,
  zIndex,
}: {
  entry: ModalEntry
  isTop: boolean
  zIndex: number
}) {
  const popById = useModalStore((s) => s.popById)
  const Component = entry.component
  const sizeConfig = SIZE_MAP[entry.frame.size ?? "md"] ?? SIZE_MAP.md
  const isMobileFullScreen = sizeConfig.mobile

  return (
    <ModalPopup
      entry={entry}
      isTop={isTop}
      zIndex={zIndex}
      size={entry.frame.size}
      className={entry.frame.className}
    >
      {/* Header — sticky top */}
      <div
        data-slot="modal-header"
        className={cn(
          "flex items-start justify-between gap-4",
          isMobileFullScreen ? "p-4 md:p-0 md:pb-0" : ""
        )}
      >
        <div className="flex flex-col gap-1">
          {entry.frame.title && (
            <DialogPrimitive.Title className="text-title-lg font-bold text-on-surface">
              {entry.frame.title}
            </DialogPrimitive.Title>
          )}
          {entry.frame.description && (
            <DialogPrimitive.Description className="text-body-sm text-on-surface-variant">
              {entry.frame.description}
            </DialogPrimitive.Description>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => popById(entry.id)}
          className={cn(
            "shrink-0 rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface",
            isMobileFullScreen ? "" : "absolute top-3 right-3"
          )}
        >
          <XIcon className="size-5" />
          <span className="sr-only">닫기</span>
        </button>
      </div>

      {/* Body — flex-1로 남은 공간 차지, Component가 내부 스크롤/footer 관리 */}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          isMobileFullScreen ? "px-4 md:px-0" : ""
        )}
      >
        <Component
          {...entry.props}
          onClose={(v?: unknown) => popById(entry.id, v)}
        />
      </div>
    </ModalPopup>
  )
}

// ---------------------------------------------------------------------------
// Confirm 렌더러
// ---------------------------------------------------------------------------

function ConfirmRenderer({
  entry,
  isTop,
  zIndex,
}: {
  entry: ConfirmEntry
  isTop: boolean
  zIndex: number
}) {
  const popById = useModalStore((s) => s.popById)
  const {
    title = "확인",
    children,
    confirmText = "확인",
    cancelText = "취소",
  } = entry.props

  return (
    <ModalPopup entry={entry} isTop={isTop} zIndex={zIndex} size="sm">
      {/* Header */}
      <div data-slot="confirm-header" className="flex items-center gap-3">
        {CONFIRM_ICON}
        <DialogPrimitive.Title className="text-title-lg font-bold text-on-surface">
          {title}
        </DialogPrimitive.Title>
      </div>

      {/* Body */}
      {children && (
        <div className="text-body-sm text-on-surface-variant">{children}</div>
      )}

      {/* Footer */}
      <div
        data-slot="confirm-footer"
        className="mt-auto flex justify-end gap-2"
      >
        <Button variant="outline" onClick={() => popById(entry.id, false)}>
          {cancelText}
        </Button>
        <Button onClick={() => popById(entry.id, true)}>{confirmText}</Button>
      </div>
    </ModalPopup>
  )
}

// ---------------------------------------------------------------------------
// ModalProvider
// ---------------------------------------------------------------------------

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const { stack, rejectAll } = useModalStore()

  React.useEffect(() => {
    return () => rejectAll(new Error("ModalProvider unmounted"))
  }, [rejectAll])

  return (
    <>
      {children}

      {stack.map((entry, idx) => {
        const zIndex = Z_BASE + idx * Z_STEP
        const isTop = idx === stack.length - 1

        switch (entry.type) {
          case "modal":
            return (
              <ModalRenderer
                key={entry.id}
                entry={entry}
                isTop={isTop}
                zIndex={zIndex}
              />
            )
          case "confirm":
            return (
              <ConfirmRenderer
                key={entry.id}
                entry={entry}
                isTop={isTop}
                zIndex={zIndex}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
