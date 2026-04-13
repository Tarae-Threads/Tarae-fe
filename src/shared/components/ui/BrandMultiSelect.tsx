"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { BrandItem } from "@/shared/api/client";

interface Props {
  label: string;
  brands: BrandItem[];
  selectedIds: number[];
  onChangeIds: (ids: number[]) => void;
  fallbackRegistration?: ReturnType<
    ReturnType<typeof import("react-hook-form").useForm>["register"]
  >;
  placeholder?: string;
}

export default function BrandMultiSelect({
  label,
  brands,
  selectedIds,
  onChangeIds,
  fallbackRegistration,
  placeholder = "브랜드 검색...",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query
    ? brands.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
    : brands;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: number) => {
    onChangeIds(
      selectedIds.includes(id)
        ? selectedIds.filter((v) => v !== id)
        : [...selectedIds, id],
    );
  };

  const selectedBrands = brands.filter((b) => selectedIds.includes(b.id));

  return (
    <div className="space-y-2">
      <label className="text-label-md font-bold text-on-surface-variant block">
        {label}
      </label>

      {/* Selected chips */}
      {selectedBrands.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedBrands.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-label-xs font-medium"
            >
              {b.name}
              <button
                type="button"
                onClick={() => toggle(b.id)}
                className="hover:text-on-surface"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search dropdown */}
      {brands.length > 0 && (
        <div ref={containerRef} className="relative">
          <div
            className={`flex items-center h-11 px-4 bg-surface-container rounded-xl ${open ? "ring-2 ring-primary/30" : ""}`}
          >
            <Search className="w-4 h-4 text-outline shrink-0 mr-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-label-lg text-on-surface placeholder:text-outline focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 text-outline hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {open && filtered.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-surface-container-low rounded-xl editorial-shadow max-h-40 overflow-y-auto hide-scrollbar">
              {filtered.map((brand) => {
                const isSelected = selectedIds.includes(brand.id);
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => toggle(brand.id)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-surface-container transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between ${isSelected ? "bg-primary-fixed/30" : ""}`}
                  >
                    <span className="text-label-lg text-on-surface font-medium">
                      {brand.name}
                    </span>
                    {isSelected && (
                      <span className="text-primary text-label-xs font-bold">
                        선택됨
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Fallback text input */}
      <input
        type="text"
        placeholder="목록에 없는 브랜드 직접 입력"
        className="w-full h-11 px-4 rounded-xl text-label-lg text-on-surface placeholder:text-outline bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
        {...fallbackRegistration}
      />
    </div>
  );
}
