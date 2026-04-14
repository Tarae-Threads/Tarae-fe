"use client";

import { cn } from "@/shared/lib/utils";

export interface DetailTab {
  id: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: DetailTab[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function DetailTabs({ tabs, activeId, onChange }: Props) {
  return (
    <div
      role="tablist"
      className="sticky top-0 z-10 bg-surface flex items-center gap-1 border-b border-outline-variant/30"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-3 text-label-lg font-bold transition-colors",
              active
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface",
            )}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-label-xs font-bold",
                    active ? "text-primary" : "text-outline",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {active && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
