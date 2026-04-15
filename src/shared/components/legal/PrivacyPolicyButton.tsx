"use client";

import { useModal } from "@/shared/hooks/useModal";
import PrivacyPolicy from "./PrivacyPolicy";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function PrivacyPolicyButton({
  className = "",
  children = "개인정보처리방침",
}: Props) {
  const { openModal } = useModal();
  return (
    <button
      type="button"
      onClick={() =>
        openModal(PrivacyPolicy, {}, { title: "개인정보처리방침", size: "lg" })
      }
      className={`cursor-pointer hover:text-on-surface transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
