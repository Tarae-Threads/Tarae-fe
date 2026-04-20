"use client";

import { useModal } from "@/shared/hooks/useModal";
import TermsOfService from "./TermsOfService";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function TermsOfServiceButton({
  className = "",
  children = "이용약관",
}: Props) {
  const { openModal } = useModal();
  return (
    <button
      type="button"
      onClick={() =>
        openModal(TermsOfService, {}, { title: "이용약관", size: "lg" })
      }
      className={`cursor-pointer hover:text-on-surface transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
