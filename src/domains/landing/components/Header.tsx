"use client";

import Link from "next/link";
import Image from "next/image";
import { Map } from "lucide-react";
import { track } from "@/shared/lib/analytics";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="container mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          aria-label="타래 홈"
          className="inline-flex items-center gap-2"
        >
          <Image
            src="/icon-192.png"
            alt=""
            width={28}
            height={28}
            className="rounded-full"
            priority
          />
          <span className="font-display font-extrabold text-title-md text-primary">
            타래
          </span>
        </Link>
        <Link
          href="/map"
          onClick={() => track("landing_cta_click", { cta: "header_map" })}
          className="inline-flex items-center gap-1.5 bg-primary text-white font-bold text-label-md px-4 py-2 rounded-full transition-transform active:scale-95"
        >
          <Map className="w-4 h-4" />
          지도 바로가기
        </Link>
      </div>
    </header>
  );
}
