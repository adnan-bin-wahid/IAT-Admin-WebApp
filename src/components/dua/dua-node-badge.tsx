interface DuaNodeBadgeProps {
  label: string;
  count: number;
}

export function DuaNodeBadge({ label, count }: DuaNodeBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/50 whitespace-nowrap">
      <span className="text-slate-400 font-medium">{label}:</span>
      <span>{count}</span>
    </span>
  );
}
