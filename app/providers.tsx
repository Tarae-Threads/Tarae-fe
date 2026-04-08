"use client"

import { ModalProvider } from "@/shared/providers/ModalProvider"
import { ToastProvider } from "@/shared/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ModalProvider>{children}</ModalProvider>
    </ToastProvider>
  )
}
