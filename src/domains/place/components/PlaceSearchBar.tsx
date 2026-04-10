"use client";

import PlaceFilter from "./PlaceFilter";
import type { SortBy } from "./PlaceFilter";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface PlaceSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOpen: boolean;
  onToggleFilter: () => void;
  selectedCategories: Set<string>;
  selectedRegion: string;
  onToggleCategory: (category: string) => void;
  onClearCategories: () => void;
  onRegionChange: (region: string) => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  resultCount?: number;
}

export default function PlaceSearchBar({
  searchQuery,
  onSearchChange,
  filterOpen,
  onToggleFilter,
  selectedCategories,
  selectedRegion,
  onToggleCategory,
  onClearCategories,
  onRegionChange,
  sortBy,
  onSortChange,
  resultCount,
}: PlaceSearchBarProps) {
  const activeFilterCount =
    selectedCategories.size + (selectedRegion !== "all" ? 1 : 0);
  return (
    <div className="relative">
      <div className="bg-surface/80 editorial-shadow flex h-14 items-center rounded-2xl backdrop-blur-2xl">
        <Search
          className="text-primary absolute left-5 h-5 w-5"
          aria-hidden="true"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="뜨개 장소 검색"
          placeholder="장소, 브랜드, 태그 검색..."
          className="text-on-surface placeholder:text-outline h-full flex-1 bg-transparent pr-2 pl-14 font-medium focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="검색 초기화"
            className="text-outline hover:text-on-surface p-1.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={onToggleFilter}
          aria-expanded={filterOpen}
          aria-label="필터"
          className={`relative mr-2 rounded-lg p-2.5 transition-colors ${
            filterOpen
              ? "bg-primary text-white"
              : "text-outline hover:bg-surface-container"
          }`}
        >
          {filterOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <SlidersHorizontal className="h-4 w-4" />
          )}
          {!filterOpen && activeFilterCount > 0 && (
            <span className="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {filterOpen && (
        <div className="bg-surface-container-low editorial-shadow mt-3 rounded-2xl p-4 backdrop-blur-2xl">
          <PlaceFilter
            selectedCategories={selectedCategories}
            selectedRegion={selectedRegion}
            onToggleCategory={onToggleCategory}
            onClearCategories={onClearCategories}
            onRegionChange={onRegionChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
          />
        </div>
      )}
    </div>
  );
}
