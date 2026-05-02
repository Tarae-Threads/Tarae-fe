"use client"

import { Suspense } from "react"
import { ModalProvider } from "@/shared/providers/ModalProvider"
import { ToastProvider } from "@/shared/components/ui/toast"
import AppNav from "@/shared/components/layout/AppNav"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ModalProvider>
        <Suspense fallback={null}>
          <AppNav />
        </Suspense>
        {children}
      </ModalProvider>
    </ToastProvider>
  )
}
