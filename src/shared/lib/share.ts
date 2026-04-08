import { toast } from "@/shared/components/ui/toast"

interface ShareOptions {
  title: string
  text?: string
  url: string
}

export const shareOrCopy = async ({ title, text, url }: ShareOptions) => {
  const fullUrl = `${window.location.origin}${url}`

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: fullUrl })
      return
    } catch {
      // 사용자가 공유 취소
    }
  }

  try {
    await navigator.clipboard.writeText(fullUrl)
    toast.success("링크가 복사되었습니다")
  } catch {
    toast.error("링크 복사에 실패했습니다")
  }
}
