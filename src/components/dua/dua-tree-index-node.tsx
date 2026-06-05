"use client";

import { Folder, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { DuaTreeItemNode } from "./dua-tree-item-node";
import { DuaNodeBadge } from "./dua-node-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { DuaBookWithIndexes, DuaIndexWithItems, DuaItemWithCategory } from "@/types/dua";

interface DuaTreeIndexNodeProps {
  indexNode: DuaIndexWithItems;
  selectedId: string | null;
  selectedType: string | null;
  onSelectNode: (
    type: "book" | "index" | "dua",
    id: string,
    data: DuaBookWithIndexes | DuaIndexWithItems | DuaItemWithCategory
  ) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

export function DuaTreeIndexNode({
  indexNode,
  selectedId,
  selectedType,
  onSelectNode,
  isExpanded,
  onToggleExpand,
}: DuaTreeIndexNodeProps) {
  const isSelected = selectedType === "index" && selectedId === indexNode.id;
  const childDuasCount = indexNode.duaItems?.length || 0;

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(indexNode.id);
  };

  return (
    <div
      className={cn(
        "space-y-1 transition-all duration-200",
        indexNode.status === "archived" && "opacity-60 bg-slate-50/20"
      )}
    >
      {/* Node Header */}
      <div
        onClick={() => onSelectNode("index", indexNode.id, indexNode)}
        className={cn(
          "group flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ml-4 border-l border-slate-100",
          isSelected
            ? "bg-emerald-50/50 text-[#022c22] border-l-2 border-emerald-700 font-semibold"
            : "text-slate-700 hover:text-[#022c22] hover:bg-slate-50/50"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Chevron expander */}
          <button
            type="button"
            onClick={toggleExpand}
            className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>

          <Folder
            className={cn(
              "h-4 w-4 shrink-0",
              isSelected ? "text-emerald-700" : "text-slate-400"
            )}
          />
          
          <div className="flex flex-col min-w-0">
            <span className="truncate leading-none">{indexNode.titleEn}</span>
            <span className="text-[10px] text-slate-400 truncate mt-1 font-medium">
              {indexNode.titleBn}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {/* Visibility indicator */}
          {indexNode.isVisibleInApp ? (
            <span title="Visible in App"><Eye className="h-3.5 w-3.5 text-emerald-600 shrink-0" /></span>
          ) : (
            <span title="Hidden from App"><EyeOff className="h-3.5 w-3.5 text-slate-400 shrink-0" /></span>
          )}

          {/* Status Badge */}
          <StatusBadge status={indexNode.status} />

          <DuaNodeBadge label="Duas" count={childDuasCount} />
        </div>
      </div>

      {/* Expanded Children */}
      {isExpanded && (
        <div className="space-y-0.5 pl-4">
          {indexNode.duaItems && indexNode.duaItems.length > 0 ? (
            indexNode.duaItems.map((dua: DuaItemWithCategory) => (
              <DuaTreeItemNode
                key={dua.id}
                item={dua}
                isSelected={selectedType === "dua" && selectedId === dua.id}
                onSelect={() => onSelectNode("dua", dua.id, dua)}
              />
            ))
          ) : (
            <div className="text-[10px] text-slate-400 italic py-2 pl-12 font-medium">
              No duas inside this index
            </div>
          )}
        </div>
      )}
    </div>
  );
}
