"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Instagram } from "lucide-react";
import PrivacyPolicyButton from "@/shared/components/legal/PrivacyPolicyButton";
import TermsOfServiceButton from "@/shared/components/legal/TermsOfServiceButton";
import { useModal } from "@/shared/hooks/useModal";
import InquiryForm from "@/domains/inquiry/components/InquiryForm";
import { track } from "@/shared/lib/analytics";

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
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              <span className="block font-semibold text-on-surface">뜨개할 곳 찾을 땐, 타래.</span>
              전국 뜨개샵·공방·뜨개카페부터<br className="md:hidden" /> 뜨개 행사·세일·테스터 모집까지 한 곳에서 확인하세요.
            </p>
          </div>
          <nav className="text-label-md text-on-surface-variant flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/map"
              className="hover:text-on-surface transition-colors"
            >
              뜨개 장소 지도
            </Link>
            <Link
              href="/map?tab=events"
              className="hover:text-on-surface transition-colors"
            >
              진행 중인 행사
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
                openModal(
                  InquiryForm,
                  { source: "footer" },
                  { title: "문의하기", size: "md" },
                )
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
          <div className="text-label-xs text-outline mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
            <a
              href="mailto:taraethreads@gmail.com"
              onClick={() => track("footer_link_click", { kind: "email" })}
              className="hover:text-on-surface-variant inline-flex items-center gap-1.5 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              taraethreads@gmail.com
            </a>
            <a
              href="https://www.instagram.com/tarae.threads?igsh=cXNhdmoxYWlmdm0y&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("footer_link_click", { kind: "instagram" })}
              className="hover:text-on-surface-variant inline-flex items-center gap-1.5 transition-colors"
              aria-label="타래 인스타그램"
            >
              <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
              @tarae.threads
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
