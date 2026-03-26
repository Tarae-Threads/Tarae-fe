'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 signature-gradient rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl font-bold">!</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl text-on-surface mb-3">
          문제가 발생했습니다
        </h2>
        <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
          페이지를 불러오는 중 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="signature-gradient text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
