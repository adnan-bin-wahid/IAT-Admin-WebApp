import { Info } from "lucide-react";

export function DuaEmptyState() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center py-24 h-full">
      <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-700 mb-4">
        <Info className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-1.5">No Item Selected</h3>
      <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
        Select a book, index, or dua from the content explorer tree on the left to view detailed metadata and preview sections.
      </p>
    </div>
  );
}
