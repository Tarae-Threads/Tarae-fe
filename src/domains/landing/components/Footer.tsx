import Link from "next/link";
import PrivacyPolicyButton from "@/shared/components/legal/PrivacyPolicyButton";

export default function Footer() {
  return (
    <footer className="bg-surface-container border-outline-variant/20 border-t">
      <div className="container mx-auto px-4 py-10 md:px-8 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-title-lg text-primary mb-2 font-extrabold">
              타래
            </p>
            <p className="text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              뜨개인을 위한 플랫폼. 흩어져 있는 뜨개 정보를 한 곳에서
              연결합니다.
            </p>
          </div>
          <nav className="text-label-md text-on-surface-variant flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/map"
              className="hover:text-on-surface transition-colors"
            >
              지도
            </Link>
            <Link
              href="/map"
              className="hover:text-on-surface transition-colors"
            >
              이벤트
            </Link>
            <Link
              href="/map"
              className="hover:text-on-surface transition-colors"
            >
              장소 제보
            </Link>
          </nav>
        </div>
        <div className="border-outline-variant/20 mt-10 border-t pt-6">
          <p className="text-label-xs text-outline">
            © {new Date().getFullYear()} 타래 · Tarae Threads |{" "}
            <PrivacyPolicyButton />
          </p>
        </div>
      </div>
    </footer>
  );
}
