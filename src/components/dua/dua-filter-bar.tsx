"use client";

import { X } from "lucide-react";

interface FilterState {
  status: string;
  visibility: string;
  category: string;
  type: string;
}

interface DuaFilterBarProps {
  categories: { id: string; nameEn: string; nameBn: string }[];
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

export function DuaFilterBar({
  categories,
  filters,
  onFilterChange,
  onReset,
}: DuaFilterBarProps) {
  const hasActiveFilters =
    filters.status !== "all" ||
    filters.visibility !== "all" ||
    filters.category !== "all" ||
    filters.type !== "all";

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap items-center gap-3.5 animate-fade-in">
      {/* Content Type Filter */}
      <div className="flex flex-col gap-1 shrink-0 min-w-[120px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Node Type</span>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-700 font-semibold text-slate-600 transition-all cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="book">Books</option>
          <option value="index">Indexes</option>
          <option value="dua">Duas</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1 shrink-0 min-w-[120px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Status</span>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-700 font-semibold text-slate-600 transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Visibility Filter */}
      <div className="flex flex-col gap-1 shrink-0 min-w-[120px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">App Visibility</span>
        <select
          value={filters.visibility}
          onChange={(e) => onFilterChange("visibility", e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-700 font-semibold text-slate-600 transition-all cursor-pointer"
        >
          <option value="all">All Visibility</option>
          <option value="visible">Visible in App</option>
          <option value="hidden">Hidden from App</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Dua Category</span>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none bg-slate-50/50 focus:bg-white focus:border-emerald-700 font-semibold text-slate-600 transition-all cursor-pointer w-full"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nameEn} ({cat.nameBn})
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="h-8 self-end px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer animate-scale-up"
        >
          <X className="h-3 w-3 shrink-0" /> Reset
        </button>
      )}
    </div>
  );
}
