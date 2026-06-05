import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
}

export function StatCard({ title, value, icon: Icon, iconColor }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-slate-200/50">
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <p className="text-3xl font-extrabold text-[#022c22] tracking-tight">
          {value.toLocaleString()}
        </p>
      </div>
      <div className={`p-3 rounded-2xl ${iconColor} flex items-center justify-center`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
