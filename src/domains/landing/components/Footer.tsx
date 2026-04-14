import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container border-t border-outline-variant/20">
      <div className="container mx-auto px-4 md:px-8 py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="font-display font-extrabold text-title-lg text-primary mb-2">
              타래
            </p>
            <p className="text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              뜨개인을 위한 플랫폼. 흩어져 있는 뜨개 정보를 한 곳에서 연결합니다.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-label-md text-on-surface-variant">
            <Link href="/map" className="hover:text-on-surface transition-colors">
              지도
            </Link>
            <Link
              href="/map"
              className="hover:text-on-surface transition-colors"
            >
              이벤트
            </Link>
            <Link href="/map" className="hover:text-on-surface transition-colors">
              장소 제보
            </Link>
          </nav>
        </div>
        <div className="mt-10 pt-6 border-t border-outline-variant/20">
          <p className="text-label-xs text-outline">
            © {new Date().getFullYear()} 타래 · Tarae Threads
          </p>
        </div>
      </div>
    </footer>
  );
}
