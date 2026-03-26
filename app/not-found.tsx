import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-display font-extrabold text-primary mb-4">404</p>
        <h2 className="font-display font-extrabold text-2xl text-on-surface mb-3">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="signature-gradient text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 inline-block active:scale-95 transition-transform"
        >
          지도로 돌아가기
        </Link>
      </div>
    </div>
  )
}
