"use client"

import * as React from "react"
import { Toast } from "@base-ui/react/toast"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "lucide-react"
import { create } from "zustand"

import { cn } from "@/shared/lib/utils"

// ---------------------------------------------------------------------------
// Toast variant styles
// ---------------------------------------------------------------------------

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start gap-3 rounded-2xl editorial-shadow p-4 transition-all",
  {
    variants: {
      variant: {
        default: "bg-surface-container text-on-surface",
        success: "bg-secondary-container text-on-secondary-container",
        error: "bg-destructive/10 text-destructive",
        info: "bg-primary-fixed text-on-surface",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>["variant"]>

// ---------------------------------------------------------------------------
// Zustand toast store
// ---------------------------------------------------------------------------

interface ToastData {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

interface ToastStoreState {
  /** Pending toasts queued before the Base UI manager is ready */
  pending: ToastData[]
  enqueue: (data: ToastData) => void
  flush: () => ToastData[]
}

const useToastStore = create<ToastStoreState>((set, get) => ({
  pending: [],
  enqueue: (data) => set((s) => ({ pending: [...s.pending, data] })),
  flush: () => {
    const items = get().pending
    set({ pending: [] })
    return items
  },
}))

// ---------------------------------------------------------------------------
// useToast hook
// ---------------------------------------------------------------------------

function useToast() {
  const managerRef = React.useRef<ReturnType<typeof Toast.useToastManager> | null>(null)
  const enqueue = useToastStore((s) => s.enqueue)

  const toast = React.useCallback(
    (data: ToastData) => {
      const manager = managerRef.current
      if (manager) {
        manager.add({
          title: data.title,
          description: data.description,
          type: data.variant ?? "default",
          timeout: data.duration ?? 5000,
          actionProps: data.action
            ? { onClick: data.action.onClick, children: data.action.label }
            : undefined,
          data: { variant: data.variant ?? "default", action: data.action } as any,
        })
      } else {
        enqueue(data)
      }
    },
    [enqueue],
  )

  const setManager = React.useCallback(
    (manager: ReturnType<typeof Toast.useToastManager>) => {
      managerRef.current = manager
    },
    [],
  )

  return { toast, setManager }
}

// ---------------------------------------------------------------------------
// Singleton accessor – call toast() from anywhere
// ---------------------------------------------------------------------------

let globalToastFn: ((data: ToastData) => void) | null = null

function toast(data: ToastData) {
  if (globalToastFn) {
    globalToastFn(data)
  } else {
    useToastStore.getState().enqueue(data)
  }
}

toast.success = (title: React.ReactNode, opts?: Omit<ToastData, "title" | "variant">) =>
  toast({ ...opts, title, variant: "success" })
toast.error = (title: React.ReactNode, opts?: Omit<ToastData, "title" | "variant">) =>
  toast({ ...opts, title, variant: "error" })
toast.info = (title: React.ReactNode, opts?: Omit<ToastData, "title" | "variant">) =>
  toast({ ...opts, title, variant: "info" })

// ---------------------------------------------------------------------------
// ToastItem – individual toast rendered inside the viewport
// ---------------------------------------------------------------------------

interface ToastItemProps {
  toast: Parameters<typeof Toast.Root>[0]["toast"]
}

function ToastItem({ toast: t }: ToastItemProps) {
  const variant = ((t.data as any)?.variant ?? t.type ?? "default") as ToastVariant
  const action = (t.data as any)?.action as ToastData["action"] | undefined

  return (
    <Toast.Root
      data-slot="toast"
      toast={t}
      className={cn(
        toastVariants({ variant }),
        // slide-up entry / slide-down exit
        "data-[starting]:translate-y-full data-[starting]:opacity-0",
        "data-[ending]:translate-y-full data-[ending]:opacity-0",
        "transition-[transform,opacity] duration-300 ease-out",
      )}
    >
      <Toast.Content data-slot="toast-content" className="flex flex-1 flex-col gap-1">
        {t.title && (
          <Toast.Title data-slot="toast-title" className="text-sm font-semibold leading-tight">
            {t.title}
          </Toast.Title>
        )}
        {t.description && (
          <Toast.Description data-slot="toast-description" className="text-xs opacity-80">
            {t.description}
          </Toast.Description>
        )}
      </Toast.Content>

      <div data-slot="toast-actions" className="flex shrink-0 items-center gap-1">
        {action && (
          <Toast.Action
            data-slot="toast-action"
            onClick={action.onClick}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              variant === "error"
                ? "bg-destructive/15 hover:bg-destructive/25"
                : variant === "success"
                  ? "bg-on-secondary-container/10 hover:bg-on-secondary-container/20"
                  : "bg-on-surface/10 hover:bg-on-surface/20",
            )}
          >
            {action.label}
          </Toast.Action>
        )}
        <Toast.Close
          data-slot="toast-close"
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-lg transition-colors",
            variant === "error"
              ? "hover:bg-destructive/15"
              : variant === "success"
                ? "hover:bg-on-secondary-container/10"
                : "hover:bg-on-surface/10",
          )}
          aria-label="Close"
        >
          <XIcon className="size-3.5" />
        </Toast.Close>
      </div>
    </Toast.Root>
  )
}

// ---------------------------------------------------------------------------
// Toaster – renders all active toasts, place once in layout
// ---------------------------------------------------------------------------

function Toaster() {
  const manager = Toast.useToastManager()
  const flush = useToastStore((s) => s.flush)

  // Register global accessor
  React.useEffect(() => {
    globalToastFn = (data) => {
      manager.add({
        title: data.title,
        description: data.description,
        type: data.variant ?? "default",
        timeout: data.duration ?? 5000,
        actionProps: data.action
          ? { onClick: data.action.onClick, children: data.action.label }
          : undefined,
        data: { variant: data.variant ?? "default", action: data.action } as any,
      })
    }
    return () => {
      globalToastFn = null
    }
  }, [manager])

  // Flush any toasts queued before the provider mounted
  React.useEffect(() => {
    const pending = flush()
    for (const data of pending) {
      globalToastFn?.(data)
    }
  }, [flush])

  return (
    <Toast.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed z-[100] flex max-h-screen flex-col-reverse gap-2 p-4",
        // bottom-center on mobile, bottom-right on desktop
        "inset-x-0 bottom-0 items-center",
        "sm:right-0 sm:left-auto sm:items-end sm:w-[380px]",
      )}
    >
      {manager.toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </Toast.Viewport>
  )
}

// ---------------------------------------------------------------------------
// ToastProvider – wraps app with Base UI Toast.Provider + Toaster
// ---------------------------------------------------------------------------

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider timeout={5000} limit={3}>
      {children}
      <Toaster />
    </Toast.Provider>
  )
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { ToastProvider, Toaster, ToastItem, useToast, toast, toastVariants }
export type { ToastData, ToastVariant }
