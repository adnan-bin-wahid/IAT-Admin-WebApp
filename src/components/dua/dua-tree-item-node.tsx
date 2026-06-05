import { FileText, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/common/status-badge";
import { DuaItemWithCategory } from "@/types/dua";

interface DuaTreeItemNodeProps {
  item: DuaItemWithCategory;
  isSelected: boolean;
  onSelect: () => void;
}

export function DuaTreeItemNode({ item, isSelected, onSelect }: DuaTreeItemNodeProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "group flex items-start justify-between gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer ml-4 pl-4 border-l border-slate-100",
        isSelected
          ? "bg-emerald-50/50 text-[#022c22] border-l-2 border-emerald-700 font-semibold"
          : "text-slate-600 hover:text-[#022c22] hover:bg-slate-50/50",
        item.status === "archived" && "opacity-60 bg-slate-50/10"
      )}
    >
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <FileText className={cn("h-4 w-4 mt-0.5 shrink-0", isSelected ? "text-emerald-700" : "text-slate-400")} />
        <div className="flex flex-col min-w-0">
          <span className="truncate leading-none">{item.titleEn}</span>
          <span className="text-[10px] text-slate-400 truncate mt-1 font-medium">{item.titleBn}</span>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {item.isVisibleInApp ? (
          <span title="Visible in App"><Eye className="h-3 w-3 text-emerald-600 shrink-0" /></span>
        ) : (
          <span title="Hidden from App"><EyeOff className="h-3 w-3 text-slate-400 shrink-0" /></span>
        )}
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
}
