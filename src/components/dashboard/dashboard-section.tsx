interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardSection({ title, children }: DashboardSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-4 mb-5 text-xs uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex-1">{children}</div>
    </div>
  );
}
