import { DuaTreeBookNode } from "./dua-tree-book-node";
import { DuaBookWithIndexes, DuaIndexWithItems, DuaItemWithCategory } from "@/types/dua";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DuaTreeProps {
  books: DuaBookWithIndexes[];
  selectedId: string | null;
  selectedType: string | null;
  onSelectNode: (
    type: "book" | "index" | "dua",
    id: string,
    data: DuaBookWithIndexes | DuaIndexWithItems | DuaItemWithCategory
  ) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export function DuaTree({
  books,
  selectedId,
  selectedType,
  onSelectNode,
  expandedIds,
  onToggleExpand,
  onExpandAll,
  onCollapseAll,
}: DuaTreeProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-2xl border border-slate-100/60 shadow-sm animate-fade-in">
        No books, indexes, or duas match your search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Expand / Collapse All Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
          Content Explorer
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExpandAll}
            className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 px-2 py-1 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer"
          >
            <ChevronDown className="h-3 w-3" /> Expand All
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-lg transition-all flex items-center gap-0.5 cursor-pointer"
          >
            <ChevronUp className="h-3 w-3" /> Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {books.map((book) => (
          <DuaTreeBookNode
            key={book.id}
            bookNode={book}
            selectedId={selectedId}
            selectedType={selectedType}
            onSelectNode={onSelectNode}
            isExpanded={expandedIds.has(book.id)}
            onToggleExpand={onToggleExpand}
            expandedIds={expandedIds}
          />
        ))}
      </div>
    </div>
  );
}
