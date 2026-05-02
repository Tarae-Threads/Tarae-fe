"use client"

import { Pencil } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import SubmitForm from "@/shared/components/layout/SubmitForm"

export default function ShopEditButton() {
  const { openModal } = useModal()

  const handleClick = () => {
    openModal(
      SubmitForm,
      { initialTab: "store" } as unknown as Record<string, unknown>,
      { title: "제보하기", size: "md" },
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-label-md font-bold text-primary hover:underline"
    >
      <Pencil className="w-3.5 h-3.5" />
      잘못된 정보 수정 제보
    </button>
  )
}
