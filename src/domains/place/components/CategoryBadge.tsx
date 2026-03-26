import type { PlaceCategory } from "../types";
import { CATEGORY_LABEL, CATEGORY_COLOR, CATEGORY_BG } from "../constants";

interface CategoryBadgeProps {
  category: PlaceCategory;
  size?: "sm" | "md";
}

export default function CategoryBadge({
  category,
  size = "sm",
}: CategoryBadgeProps) {
  const sizeClass =
    size === "md" ? "px-3 py-1 text-[12px]" : "px-2.5 py-0.5 text-[11px]";

  return (
    <span
      className={`${sizeClass} rounded-full font-bold uppercase tracking-widest`}
      style={{
        backgroundColor: CATEGORY_BG[category],
        color: CATEGORY_COLOR[category],
      }}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}
