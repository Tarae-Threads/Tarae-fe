"use client";

import { CATEGORY_LABEL, CATEGORY_COLOR } from "../constants";
import { cn } from "@/shared/lib/utils";

interface Props {
  selectedCategories: Set<string>;
  onToggleCategory: (category: string) => void;
  onClearCategories: () => void;
}

const categoryList = Object.keys(CATEGORY_LABEL);

export default function PlaceCategoryTabs({
  selectedCategories,
  onToggleCategory,
  onClearCategories,
}: Props) {
  const isAll = selectedCategories.size === 0;

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar">
      <button
        type="button"
        onClick={onClearCategories}
        className={cn(
          "shrink-0 px-4 py-1.5 text-label-md rounded-full transition-all whitespace-nowrap",
          isAll
            ? "bg-secondary text-secondary-foreground font-bold"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
        )}
      >
        전체
      </button>
      {categoryList.map((name) => {
        const selected = selectedCategories.has(name);
        return (
          <button
            key={name}
            type="button"
            onClick={() => {
              if (selected) {
                onClearCategories();
              } else {
                onClearCategories();
                onToggleCategory(name);
              }
            }}
            className={cn(
              "shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 text-label-md rounded-full transition-all whitespace-nowrap",
              selected
                ? "bg-secondary text-secondary-foreground font-bold"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
            )}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: CATEGORY_COLOR[name] }}
            />
            {CATEGORY_LABEL[name]}
          </button>
        );
      })}
    </div>
  );
}
