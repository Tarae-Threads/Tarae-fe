"use client"

import * as React from "react"
import {
  useModalStore,
  type ModalFrame,
  type ScreenComponent,
} from "@/shared/stores/useModalStore"

// ---------------------------------------------------------------------------
// 헬퍼
// ---------------------------------------------------------------------------

function blurActiveElement(): void {
  if (typeof document === "undefined") return
  const el = document.activeElement
  if (el instanceof HTMLElement) el.blur()
}

// ---------------------------------------------------------------------------
// useModal hook
// ---------------------------------------------------------------------------

export function useModal() {
  const push = useModalStore((s) => s.push)

  function openModal<P extends Record<string, unknown>, R = unknown>(
    Component: React.ComponentType<P & { onClose: (r?: R) => void }>,
    props: P,
    frame?: ModalFrame
  ): Promise<R> {
    blurActiveElement()
    return new Promise<R>((resolve, reject) => {
      push(
        {
          type: "modal",
          component: Component as ScreenComponent<Record<string, unknown>, unknown>,
          props,
          frame: frame ?? {},
        },
        {
          resolve: (v?: unknown) => resolve(v as R),
          reject: (e?: unknown) => reject(e),
        }
      )
    })
  }

  function openConfirm(options: {
    title?: string
    children?: React.ReactNode
    confirmText?: string
    cancelText?: string
  }): Promise<boolean> {
    blurActiveElement()
    return new Promise<boolean>((resolve, reject) => {
      push(
        { type: "confirm", props: options },
        {
          resolve: (v?: unknown) => resolve(v as boolean),
          reject: (e?: unknown) => reject(e),
        }
      )
    })
  }

  return { openModal, openConfirm }
}
