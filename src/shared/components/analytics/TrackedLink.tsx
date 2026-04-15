"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/shared/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  event: string;
  params?: Record<string, unknown>;
};

// 서버 컴포넌트 내부에서도 클릭 추적을 붙이고 싶을 때 사용.
// <Link> 위에 얇게 onClick 핸들러만 덧붙인다.
export default function TrackedLink({
  event,
  params,
  onClick,
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}
