"use client"

import * as React from "react"
import { create } from "zustand"

// ---------------------------------------------------------------------------
// Frame 옵션 (모달 외형 설정)
// ---------------------------------------------------------------------------

export interface ModalFrame {
  title?: React.ReactNode
  description?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
}

// ---------------------------------------------------------------------------
// 모달 화면 컴포넌트 타입
// ---------------------------------------------------------------------------

export type ScreenComponent<P, R> = React.ComponentType<
  P & { onClose: (v?: R) => void }
>

// ---------------------------------------------------------------------------
// Entry 타입 정의
// ---------------------------------------------------------------------------

export interface ModalEntry {
  id: string
  type: "modal"
  component: ScreenComponent<Record<string, unknown>, unknown>
  props: Record<string, unknown>
  frame: ModalFrame
}

export interface AlertEntry {
  id: string
  type: "alert"
  props: {
    state: "info" | "success" | "error"
    children?: React.ReactNode
    actionText?: string
  }
}

export interface ConfirmEntry {
  id: string
  type: "confirm"
  props: {
    title?: string
    children?: React.ReactNode
    confirmText?: string
    cancelText?: string
  }
}

export type Entry = ModalEntry | AlertEntry | ConfirmEntry

// ---------------------------------------------------------------------------
// Promise resolver
// ---------------------------------------------------------------------------

interface Resolver {
  resolve: (v?: unknown) => void
  reject: (e?: unknown) => void
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface ModalStoreState {
  stack: Entry[]
  resolvers: Record<string, Resolver>

  push: (
    entry:
      | Omit<ModalEntry, "id">
      | Omit<AlertEntry, "id">
      | Omit<ConfirmEntry, "id">,
    resolver: Resolver
  ) => string
  popById: (id: string, result?: unknown) => void
  popTop: (result?: unknown) => void
  rejectAll: (reason?: unknown) => void
}

export const useModalStore = create<ModalStoreState>((set, get) => ({
  stack: [],
  resolvers: {},

  push: (entry, resolver) => {
    const id = Math.random().toString(36).substring(2, 10)
    set((s) => ({
      stack: [...s.stack, { ...entry, id } as Entry],
      resolvers: { ...s.resolvers, [id]: resolver },
    }))
    return id
  },

  popById: (id, result) => {
    const { resolvers } = get()
    resolvers[id]?.resolve(result)
    set((s) => {
      const { [id]: _, ...rest } = s.resolvers
      return {
        stack: s.stack.filter((e) => e.id !== id),
        resolvers: rest,
      }
    })
  },

  popTop: (result) => {
    const top = get().stack.at(-1)
    if (top) get().popById(top.id, result)
  },

  rejectAll: (reason) => {
    const { resolvers } = get()
    Object.values(resolvers).forEach((r) =>
      r.reject(reason ?? new Error("Modal rejected"))
    )
    set({ stack: [], resolvers: {} })
  },
}))
