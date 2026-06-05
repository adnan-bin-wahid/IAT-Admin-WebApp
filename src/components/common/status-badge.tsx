import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "draft" | "published" | "archived" | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
        status === "published" && "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
        status === "draft" && "bg-amber-50 text-amber-700 border border-amber-200/50",
        status === "archived" && "bg-slate-100 text-slate-700 border border-slate-200"
      )}
    >
      {status}
    </span>
  );
}
