"use client";

import Image from "next/image";
import Link from "next/link";
import PrivacyPolicyButton from "@/shared/components/legal/PrivacyPolicyButton";
import TermsOfServiceButton from "@/shared/components/legal/TermsOfServiceButton";
import { useModal } from "@/shared/hooks/useModal";
import InquiryForm from "@/domains/inquiry/components/InquiryForm";

export default function Footer() {
  const { openModal } = useModal();

  return (
    <footer className="bg-surface-container border-outline-variant/20 border-t">
      <div className="container mx-auto px-4 py-10 md:px-8 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/logo.png"
                alt="타래"
                width={72}
                height={36}
                className="h-9 w-auto"
              />
              <p className="font-display text-title-lg text-primary font-extrabold">
                타래
              </p>
            </div>
            <p className="text-body-sm text-on-surface-variant md:whitespace-nowrap leading-relaxed">
              뜨개인을 위한 플랫폼.<br className="md:hidden" /> 흩어져 있는 뜨개 정보를 한 곳에서 연결합니다.
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
            <button
              type="button"
              onClick={() =>
                openModal(InquiryForm, {}, { title: "문의하기", size: "md" })
              }
              className="hover:text-on-surface transition-colors"
            >
              문의하기
            </button>
          </nav>
        </div>
        <div className="border-outline-variant/20 mt-10 border-t pt-6">
          <p className="text-label-xs text-outline">
            © {new Date().getFullYear()} 타래 · Tarae Threads |{" "}
            <TermsOfServiceButton /> |{" "}
            <PrivacyPolicyButton />
          </p>
          <a
            href="mailto:taraethreads@gmail.com"
            className="text-label-xs text-outline hover:text-on-surface-variant transition-colors mt-1 inline-block"
          >
            taraethreads@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
