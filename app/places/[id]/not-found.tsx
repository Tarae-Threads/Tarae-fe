import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Header from "@/domains/landing/components/Header"
import Footer from "@/domains/landing/components/Footer"

export default function PlaceNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface md:pl-16 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-8 py-16 max-w-md text-center">
          <h1 className="font-display font-extrabold text-headline-md text-on-surface mb-3">
            장소를 찾을 수 없어요
          </h1>
          <p className="text-body-md text-on-surface-variant mb-8">
            요청하신 장소가 삭제되었거나 잘못된 주소일 수 있어요.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-label-md font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            지도에서 다른 장소 둘러보기
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
