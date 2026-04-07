"use client"

import { ModalProvider } from "@/shared/providers/ModalProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>
}
