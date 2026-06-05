"use client";

import { BookOpen, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { DuaTreeIndexNode } from "./dua-tree-index-node";
import { DuaNodeBadge } from "./dua-node-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { DuaBookWithIndexes, DuaIndexWithItems, DuaItemWithCategory } from "@/types/dua";

interface DuaTreeBookNodeProps {
  bookNode: DuaBookWithIndexes;
  selectedId: string | null;
  selectedType: string | null;
  onSelectNode: (
    type: "book" | "index" | "dua",
    id: string,
    data: DuaBookWithIndexes | DuaIndexWithItems | DuaItemWithCategory
  ) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  expandedIds: Set<string>;
}

export function DuaTreeBookNode({
  bookNode,
  selectedId,
  selectedType,
  onSelectNode,
  isExpanded,
  onToggleExpand,
  expandedIds,
}: DuaTreeBookNodeProps) {
  const isSelected = selectedType === "book" && selectedId === bookNode.id;
  const indexCount = bookNode.indexes?.length || 0;
  
  // Calculate total Duas count under this book
  const totalDuasCount = bookNode.indexes?.reduce(
    (sum: number, idx: DuaIndexWithItems) => sum + (idx.duaItems?.length || 0),
    0
  ) || 0;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(bookNode.id);
  };

  return (
    <div
      className={cn(
        "space-y-1 bg-white p-2 rounded-2xl border border-slate-100/60 shadow-sm transition-all duration-200",
        bookNode.status === "archived" && "opacity-60 bg-slate-50/50"
      )}
    >
      {/* Node Header */}
      <div
        onClick={() => onSelectNode("book", bookNode.id, bookNode)}
        className={cn(
          "group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer",
          isSelected
            ? "bg-emerald-900/10 text-[#022c22] border-l-4 border-emerald-700 font-semibold pl-2.5"
            : "text-slate-800 hover:text-[#022c22] hover:bg-slate-50"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Chevron expander */}
          <button
            type="button"
            onClick={toggleExpand}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          <BookOpen
            className={cn(
              "h-4.5 w-4.5 shrink-0",
              isSelected ? "text-emerald-700" : "text-emerald-900/80"
            )}
          />
          
          <div className="flex flex-col min-w-0">
            <span className="truncate leading-none font-semibold text-slate-800">
              {bookNode.nameEn}
            </span>
            <span className="text-[10px] text-slate-400 truncate mt-1 font-medium">
              {bookNode.nameBn}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {/* Visibility indicator */}
          {bookNode.isVisibleInApp ? (
            <span title="Visible in App"><Eye className="h-3.5 w-3.5 text-emerald-600 shrink-0" /></span>
          ) : (
            <span title="Hidden from App"><EyeOff className="h-3.5 w-3.5 text-slate-400 shrink-0" /></span>
          )}

          {/* Status Badge */}
          <StatusBadge status={bookNode.status} />

          <DuaNodeBadge label="Sections" count={indexCount} />
          <DuaNodeBadge label="Duas" count={totalDuasCount} />
        </div>
      </div>

      {/* Expanded Children */}
      {isExpanded && (
        <div className="space-y-1.5 mt-1 border-t border-slate-50 pt-1.5 pl-2">
          {bookNode.indexes && bookNode.indexes.length > 0 ? (
            bookNode.indexes.map((idx: DuaIndexWithItems) => (
              <DuaTreeIndexNode
                key={idx.id}
                indexNode={idx}
                selectedId={selectedId}
                selectedType={selectedType}
                onSelectNode={onSelectNode}
                isExpanded={expandedIds.has(idx.id)}
                onToggleExpand={onToggleExpand}
              />
            ))
          ) : (
            <div className="text-[10px] text-slate-400 italic py-2 pl-12 font-medium">
              No indexes inside this book
            </div>
          )}
        </div>
      )}
    </div>
  );
}
